import http from 'node:http';
import https from 'node:https';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

export function publicBrowserAddress(address: string) {
  // Resolve IPv4 only; deny private, link-local, multicast, reserved and mapped IPv6.
  if (isIP(address) !== 4) return false;
  const [a,b,c]=address.split('.').map(Number);
  return !(a===0 || a===10 || a===127 || a>=224 || (a===169&&b===254) || (a===172&&b>=16&&b<=31) || (a===192&&(b===168 || b===0 || b===2)) || (a===100&&b>=64&&b<=127) || (a===198&&(b===18||b===19||b===51&&c===100)) || a===203&&b===0&&c===113);
}
export function approvedBrowserOrigin(origin: string) {
  const approved=JSON.parse(process.env.COCREATE_BROWSER_ORIGINS || '[]') as unknown;
  if (!Array.isArray(approved) || !approved.includes(origin)) throw new Error('The operator must approve this exact browser origin first.');
  const url=new URL(origin), local=process.env.COCREATE_AUTH_MODE==='local' && url.protocol==='http:' && url.hostname==='127.0.0.1';
  if (url.origin !== origin || url.username || url.password || url.hostname==='2guys1canvas.com' || url.hostname==='www.2guys1canvas.com' || !local&&url.protocol!=='https:') throw new Error('Unsupported browser origin.');
  return {origin,local};
}
/** Browser has no native network. The trusted broker pins the validated DNS address per request. */
export async function browserRequest(origin: string, request: {url:string; method:string; headers:Record<string,string>; postData?:string}, allowLoginPost: boolean, signal: AbortSignal) {
  const approved=approvedBrowserOrigin(origin),url=new URL(request.url);
  if (url.origin!==origin || url.username || url.password || !['GET','HEAD'].includes(request.method)&&!(allowLoginPost&&request.method==='POST') || Buffer.byteLength(request.postData||'')>8192) throw new Error('Browser network request denied.');
  const address=approved.local ? '127.0.0.1' : (await lookup(url.hostname,{family:4})).address;
  if (!approved.local&&!publicBrowserAddress(address)) throw new Error('Private network request denied.');
  const headers: Record<string,string>={ 'accept-encoding':'identity' };
  for (const [key,value] of Object.entries(request.headers)) if (['accept','accept-language','content-type','cookie'].includes(key.toLowerCase()) && value.length <= 8192) headers[key]=value;
  return await new Promise<{status:number; headers:Array<{name:string;value:string}>; body:Buffer}>((resolve,reject)=>{
    const req=(url.protocol==='https:'?https:http).request(url,{method:request.method,headers,signal,timeout:5000,lookup:(_name,_options,done)=>done(null,address,4)},res=>{
      const chunks:Buffer[]=[];let size=0;
      res.on('data',chunk=>{size+=chunk.length;if(size>1024*1024){req.destroy(new Error('Browser response exceeds limit.'));return;}chunks.push(chunk);});
      res.on('error',reject);res.on('end',()=>{
        const list:Array<{name:string;value:string}>=[];
        for(let i=0;i<res.rawHeaders.length;i+=2){const name=res.rawHeaders[i],value=res.rawHeaders[i+1];if(!['connection','transfer-encoding','content-length','content-encoding','alt-svc','report-to','nel'].includes(name.toLowerCase()))list.push({name,value});}
        resolve({status:res.statusCode||502,headers:list,body:Buffer.concat(chunks)});
      });
    });
    req.on('timeout',()=>req.destroy(new Error('Browser request timeout.')));req.on('error',reject);req.end(request.postData);
  });
}
