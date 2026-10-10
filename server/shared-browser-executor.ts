import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import { withIsolatedBrowser, browserExecutable, type BrowserProtocol } from './isolation/browser.js';
import { browserHash } from './browser-state.js';
import { browserRequest, approvedBrowserOrigin } from './browser-network.js';
import { validateBrowserInput, type BrowserInput } from '../shared/browser-session.js';

export class SharedBrowserExecutor {
  private abort = new AbortController();
  private browser?: BrowserProtocol;
  private targetSession?: string;
  private closed!: Promise<void>;
  private finish?: () => void;
  private postPermit = false;
  private postDeadline=0;
  private authorizeNetwork:()=>Promise<void>=async()=>{};
  private requests = 0;
  private networkBytes = 0;
  private networkActive = 0;
  private idleTimer?: NodeJS.Timeout;
  private downloads = new Map<string,{name:string;bytes:Buffer;commandId:string}>();
  private inputCommandId?:string;
  private failure?: Error;
  async start(origin: string,authorizeNetwork:()=>Promise<void>) {
    approvedBrowserOrigin(origin);
    this.authorizeNetwork=authorizeNetwork;
    if(process.platform!=='win32'||process.arch!=='x64'||!fs.existsSync(browserExecutable())||browserHash(fs.readFileSync(browserExecutable()))!=='798971a4fb66ed219f2cae1e6a0e97ad68a2e935d5e140d7150745b063dea65b')throw new Error('Shared browsers require the pinned official Windows x64 headless Chromium 154.0.8037.92 runtime.');
    let ready!:()=>void,reject!:(error:unknown)=>void;
    const opened=new Promise<void>((resolve,fail)=>{ready=resolve;reject=fail;});
    this.closed=withIsolatedBrowser(async browser=>{
      this.browser=browser;
      const target=await browser.call('Target.createTarget',{url:'about:blank'});
      const attached=await browser.call('Target.attachToTarget',{targetId:target.targetId,flatten:true});this.targetSession=attached.sessionId;
      browser.onEvent?.((method,params,sessionId)=>{
        if(method==='Fetch.requestPaused'&&sessionId===this.targetSession) void this.intercept(origin,params);
        if(method==='Fetch.authRequired'&&sessionId===this.targetSession) void this.call('Fetch.continueWithAuth',{requestId:params.requestId,authChallengeResponse:{response:'CancelAuth'}}).catch(()=>this.stop());
      });
      await this.call('Page.enable');await this.call('Network.enable');await this.call('Network.setBypassServiceWorker',{bypass:true});
      await this.call('Emulation.setDeviceMetricsOverride',{width:960,height:640,deviceScaleFactor:1,mobile:false});
      await this.call('Fetch.enable',{patterns:[{urlPattern:'*',requestStage:'Request'}],handleAuthRequests:true});
      await browser.call('Browser.setDownloadBehavior',{behavior:'deny'});
      this.touch();ready(); await new Promise<void>(resolve=>{this.finish=resolve;});
    },{sharedSession:true,wallMs:600_000,signal:this.abort.signal}).catch(error=>{this.failure=error instanceof Error?error:new Error('Isolated session ended.');reject(this.failure);}).finally(()=>{this.browser=undefined;this.downloads.clear();clearTimeout(this.idleTimer);});
    await opened;
  }
  get alive(){return !!this.browser&&!this.failure&&!this.abort.signal.aborted;}
  get busy(){return this.networkActive>0;}
  touch(){clearTimeout(this.idleTimer);this.idleTimer=setTimeout(()=>this.stop(),30_000);}
  private call(method:string,params:object={}){if(!this.browser||!this.targetSession)throw new Error('Browser disconnected; explicitly reopen.');return this.browser.call(method,params,this.targetSession);}
  private async intercept(origin:string,params:any){
    const requestId=String(params.requestId);const request=params.request,commandId=this.inputCommandId;
    let active=false;
    try{
      if(++this.requests>128||this.networkActive>=8)throw new Error('Browser request budget exceeded.');
      this.networkActive++;active=true;
      await this.authorizeNetwork();
      const permit=this.postPermit&&Date.now()<this.postDeadline&&request.method==='POST';if(permit)this.postPermit=false;
      const response=await browserRequest(origin,request,permit,this.abort.signal);
      await this.authorizeNetwork();
      this.networkBytes+=response.body.length;if(this.networkBytes>16*1024*1024)throw new Error('Browser network byte budget exceeded.');
      const disposition=response.headers.find(h=>h.name.toLowerCase()==='content-disposition')?.value;
      if(disposition?.toLowerCase().startsWith('attachment')){
        const name=disposition.match(/filename="?([A-Za-z0-9_. -]{1,80}\.(?:txt|md))"?(?:;|$)/i)?.[1];
        const text=new TextDecoder('utf-8',{fatal:true}).decode(response.body);
        if(!name||!commandId||!text.length||text.includes('\0')||response.body.length>256*1024||this.downloads.size>=8)throw new Error('Unsupported or invalid download. Only bounded UTF-8 .txt/.md is supported.');
        this.downloads.set(randomUUID(),{name,bytes:response.body,commandId});
        await this.call('Fetch.fulfillRequest',{requestId,responseCode:204});
      }else await this.call('Fetch.fulfillRequest',{requestId,responseCode:response.status,responseHeaders:response.headers,body:response.body.toString('base64')});
    }catch{await this.call('Fetch.failRequest',{requestId,errorReason:'BlockedByClient'}).catch(()=>this.stop());}
    finally{if(active)this.networkActive--;}
  }
  pendingDownloads(){return [...this.downloads].map(([id,value])=>({id,name:value.name,byteLength:value.bytes.length}));}
  takeDownload(id:string){const file=this.downloads.get(id);if(!file)throw new Error('Download unavailable. Explicitly download again after reconnect.');return file;}
  releaseDownload(id:string){this.downloads.delete(id);}
  async frame(){this.touch();const result=await this.call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});const bytes=Buffer.from(result.data,'base64');if(bytes.length>1024*1024||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error('Invalid viewport frame.');return bytes;}
  async input(origin:string,value:BrowserInput,privateLogin:boolean,commandId:string){
    const input=validateBrowserInput(value);this.inputCommandId=commandId;this.touch();this.postPermit=privateLogin&&(input.kind==='click'||input.kind==='key'&&input.key==='Enter');this.postDeadline=Date.now()+2000;
    if(input.kind==='navigate'){const url=new URL(input.url);if(url.origin!==origin||url.username||url.password)throw new Error('Navigation must stay inside the approved origin.');await this.call('Page.navigate',{url:url.href});}
    if(input.kind==='click'){await this.call('Input.dispatchMouseEvent',{type:'mousePressed',x:input.x,y:input.y,button:'left',clickCount:1});await this.call('Input.dispatchMouseEvent',{type:'mouseReleased',x:input.x,y:input.y,button:'left',clickCount:1});}
    if(input.kind==='text')await this.call('Input.insertText',{text:input.text});
    if(input.kind==='key'){const keys={Enter:13,Tab:9,Backspace:8,Escape:27,ArrowUp:38,ArrowDown:40};await this.call('Input.dispatchKeyEvent',{type:'keyDown',key:input.key,windowsVirtualKeyCode:keys[input.key]});await this.call('Input.dispatchKeyEvent',{type:'keyUp',key:input.key,windowsVirtualKeyCode:keys[input.key]});}
    if(input.kind==='scroll')await this.call('Input.dispatchMouseEvent',{type:'mouseWheel',x:480,y:320,deltaX:0,deltaY:input.delta});
  }
  stop(){clearTimeout(this.idleTimer);this.finish?.();this.abort.abort();}
  async dispose(){this.stop();await this.closed;}
}
