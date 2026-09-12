import{spawn}from'node:child_process';import fs from'node:fs';import path from'node:path';
const origin='http://localhost:5173',profile=path.resolve('.connections-smoke-profile-2');
fs.mkdirSync(profile,{recursive:true});
const roomId=(await fetch(origin+'/api/rooms',{method:'POST',headers:{'content-type':'application/json'},body:'{}'}).then(r=>r.json())).roomId;
const session=await fetch(origin+'/api/session',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({roomId,name:'Provider QA'})}).then(r=>r.json());
const browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=9227','--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
let socket;
try{
  let target;
  for(let i=0;i<60&&!target;i++){await new Promise(resolve=>setTimeout(resolve,100));try{target=await fetch('http://127.0.0.1:9227/json/new?about:blank',{method:'PUT'}).then(r=>r.json())}catch{}}
  if(!target)throw new Error('Chrome did not start');
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
  let sequence=0;const pending=new Map();
  const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
  socket.addEventListener('message',event=>{const message=JSON.parse(event.data),task=pending.get(message.id);if(task){pending.delete(message.id);message.error?task.reject(new Error(message.error.message)):task.resolve(message.result)}});
  await call('Page.enable');await call('Runtime.enable');await call('Page.navigate',{url:origin});await new Promise(resolve=>setTimeout(resolve,500));
  await call('Runtime.evaluate',{expression:"localStorage.setItem('cocreate-session-"+roomId+"',"+JSON.stringify(session.token)+")"});
  await call('Page.navigate',{url:origin+'/r/'+roomId});await new Promise(resolve=>setTimeout(resolve,2600));
  const evaluate=async expression=>(await call('Runtime.evaluate',{expression,returnByValue:true})).result.value;
  let text=await evaluate('document.body.innerText');
  if(!text.toLowerCase().includes('provider-independent ai'))throw new Error('New connection panel did not open. Visible text: '+text.slice(0,700));
  for(const label of['OpenAI','Anthropic','Google Gemini','OpenRouter','DeepSeek','Custom OpenAI-compatible','Ollama (local)'])if(!text.includes(label))throw new Error('Missing provider '+label);
  if(!text.includes('Agent assignments')||!text.includes('Default personal idea agent')||!text.includes('Shared coding agent'))throw new Error('Role assignments are missing');
  await evaluate("(()=>{const s=[...document.querySelectorAll('select')].find(x=>[...x.options].some(o=>o.value==='ollama'));s.value='ollama';s.dispatchEvent(new Event('change',{bubbles:true}))})()");
  await new Promise(resolve=>setTimeout(resolve,150));text=await evaluate('document.body.innerText');
  if(!text.includes('No key is required'))throw new Error('Local runtime guidance is missing');
  console.log(JSON.stringify({roomId,providers:7,roleAssignments:true,ollamaNoFakeKey:true}));
}finally{socket?.close();browser.kill()}
