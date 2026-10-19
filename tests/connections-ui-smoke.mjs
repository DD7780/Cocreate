import{spawn}from'node:child_process';import{createServer}from'node:http';import fs from'node:fs';import os from'node:os';import path from'node:path';
const origin=process.env.COCREATE_ORIGIN||'http://localhost:5173',profile=path.join(os.tmpdir(),`cocreate-connections-smoke-${process.pid}-${Date.now()}`),debugPort=9400+(process.pid%200);
fs.mkdirSync(profile,{recursive:true});
const provider=createServer((req,res)=>{if(req.url==='/v1/models'&&req.headers.authorization==='Bearer synthetic-key'){res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify({data:[{id:'synthetic/fast',name:'Synthetic Fast'},{id:'synthetic/capable',name:'Synthetic Capable'}]}));return}res.writeHead(401,{'content-type':'application/json'});res.end('{"error":{"message":"Invalid synthetic credential"}}')});
await new Promise(resolve=>provider.listen(0,'127.0.0.1',resolve));
const providerPort=provider.address().port;
const roomId=(await fetch(origin+'/api/rooms',{method:'POST',headers:{'content-type':'application/json'},body:'{}'}).then(r=>r.json())).roomId;
const session=await fetch(origin+'/api/session',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({roomId,name:'Provider QA'})}).then(r=>r.json());
const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--no-sandbox','--disable-gpu','--no-first-run',`--remote-debugging-port=${debugPort}`,'--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
let socket;
try{
  let target;
  for(let i=0;i<60&&!target;i++){await new Promise(resolve=>setTimeout(resolve,100));try{target=await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`,{method:'PUT'}).then(r=>r.json())}catch{}}
  if(!target)throw new Error('Chrome did not start');
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
  let sequence=0;const pending=new Map();
  const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
  socket.addEventListener('message',event=>{const message=JSON.parse(event.data),task=pending.get(message.id);if(task){pending.delete(message.id);message.error?task.reject(new Error(message.error.message)):task.resolve(message.result)}});
  await call('Page.enable');await call('Runtime.enable');await call('Page.navigate',{url:origin});await new Promise(resolve=>setTimeout(resolve,500));
  await call('Runtime.evaluate',{expression:"localStorage.setItem('cocreate-session-"+roomId+"',"+JSON.stringify(session.token)+")"});
  await call('Page.navigate',{url:origin+'/r/'+roomId});
  const evaluate=async expression=>(await call('Runtime.evaluate',{expression,returnByValue:true})).result.value;
  let text='';for(let attempt=0;attempt<50&&!text.includes('API connections');attempt++){await new Promise(resolve=>setTimeout(resolve,100));text=await evaluate('document.body.innerText')}
  if(!text.includes('Your API powers Recommended')||!text.includes('Connect your API'))throw new Error('Recommended setup is not the primary API-powered experience. Visible text: '+text.slice(0,700));
  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Connect your API')).click()`);await new Promise(resolve=>setTimeout(resolve,150));text=await evaluate('document.body.innerText');
  if(!text.toLowerCase().includes('bring your own key · advanced'))throw new Error('New connection panel did not open. Visible text: '+text.slice(0,700));
  for(const label of['OpenAI','Anthropic','Google Gemini','OpenRouter','DeepSeek','Custom OpenAI-compatible','Ollama (local)'])if(!text.includes(label))throw new Error('Missing provider '+label);
  if(!text.includes('Agent assignments')||!text.includes('Default personal interpreter')||!text.includes('Shared executor'))throw new Error('Role assignments are missing');
  await evaluate("(()=>{const s=[...document.querySelectorAll('select')].find(x=>[...x.options].some(o=>o.value==='ollama'));s.value='ollama';s.dispatchEvent(new Event('change',{bubbles:true}))})()");
  await new Promise(resolve=>setTimeout(resolve,150));text=await evaluate('document.body.innerText');
  if(!text.includes('No key is required'))throw new Error('Local runtime guidance is missing');
  await evaluate(`(()=>{const set=(element,value)=>{const prototype=element instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(prototype,'value').set.call(element,value);element.dispatchEvent(new Event(element instanceof HTMLSelectElement?'change':'input',{bubbles:true}))},field=label=>[...document.querySelectorAll('label')].find(item=>item.textContent.trim().startsWith(label)).querySelector('input,select'),provider=field('Provider');set(provider,'custom');set(field('Display name'),'Synthetic provider');set(field('API endpoint'),'http://127.0.0.1:${providerPort}/v1');set(field('API key'),'synthetic-key')})()`);
  await new Promise(resolve=>setTimeout(resolve,100));
  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Save connection')).click()`);
  for(let attempt=0;attempt<50;attempt++){await new Promise(resolve=>setTimeout(resolve,100));if(await evaluate(`[...document.querySelectorAll('button')].some(button=>button.textContent.includes('Discover models'))`))break}
  await evaluate(`[...document.querySelectorAll('button')].find(button=>button.textContent.includes('Discover models')).click()`);
  let discovered=[];for(let attempt=0;attempt<50&&!discovered.length;attempt++){await new Promise(resolve=>setTimeout(resolve,100));discovered=await evaluate(`(()=>{const select=document.querySelector('select[aria-label="Discovered models"]');return select?[...select.options].map(option=>option.value).filter(Boolean):[]})()`)}
  if(JSON.stringify(discovered)!==JSON.stringify(['synthetic/fast','synthetic/capable']))throw new Error('Discovered models were not shown as selectable options: '+JSON.stringify(discovered));
  const selectedModel=await evaluate(`document.querySelector('input[placeholder="Choose above or enter an exact model ID"]')?.value`);
  if(selectedModel!=='synthetic/fast')throw new Error('First discovered model was not selected for testing: '+selectedModel);
  console.log(JSON.stringify({roomId,providers:7,roleAssignments:true,ollamaNoFakeKey:true,discoveredModels:discovered,selectedModel}));
}finally{socket?.close();browser.kill();await new Promise(resolve=>provider.close(resolve))}
