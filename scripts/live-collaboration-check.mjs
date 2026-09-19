import * as Y from 'yjs';

const origin=(process.env.COCREATE_LIVE_ORIGIN||'').replace(/\/$/,'');
if(!origin)throw new Error('Set COCREATE_LIVE_ORIGIN to the deployed CoCreate origin.');
const wsOrigin=origin.replace(/^http/,'ws');
const timeout=(label,ms=15_000)=>new Promise((_,reject)=>setTimeout(()=>reject(new Error(`${label} timed out after ${ms}ms`)),ms));
const waitFor=async(label,check,ms=15_000)=>{
  const started=Date.now();
  while(Date.now()-started<ms){if(check())return;await new Promise(resolve=>setTimeout(resolve,50))}
  throw new Error(`${label} timed out after ${ms}ms`);
};
const json=async(path,init={})=>{
  const response=await fetch(`${origin}${path}`,init);
  const body=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(`${path} returned ${response.status}: ${body.error||'request failed'}`);
  return body;
};
const binary=(type,payload)=>{const result=new Uint8Array(payload.length+1);result[0]=type;result.set(payload,1);return result};

function connect(roomId,token,doc,label){
  const remote={label};
  const transitions=[];
  let saved=0;
  let roomStates=0;
  const socket=new WebSocket(`${wsOrigin}/ws?room=${encodeURIComponent(roomId)}&token=${encodeURIComponent(token)}`);
  socket.binaryType='arraybuffer';
  const update=(payload,origin)=>{if(origin!==remote&&socket.readyState===WebSocket.OPEN)socket.send(binary(0,payload))};
  doc.on('update',update);
  socket.addEventListener('open',()=>transitions.push('connected'));
  socket.addEventListener('error',()=>transitions.push('error'));
  socket.addEventListener('close',event=>transitions.push(`closed:${event.code}:${event.reason||'none'}`));
  socket.addEventListener('message',event=>{
    if(typeof event.data==='string'){
      const message=JSON.parse(event.data);
      if(message.type==='saved')saved++;
      if(message.type==='room-state')roomStates++;
      return;
    }
    const data=new Uint8Array(event.data);
    if(data[0]===0)Y.applyUpdate(doc,data.subarray(1),remote);
    if(data[0]===2){const missing=Y.encodeStateAsUpdate(doc,data.subarray(1));if(missing.length>2)socket.send(binary(0,missing))}
  });
  const opened=Promise.race([
    new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('close',event=>reject(new Error(`${label} closed before opening (${event.code}, ${event.reason||'no reason'})`)),{once:true});socket.addEventListener('error',()=>reject(new Error(`${label} failed before opening`)),{once:true})}),
    timeout(`${label} WebSocket open`),
  ]);
  return{socket,opened,transitions,get saved(){return saved},get roomStates(){return roomStates},dispose(){doc.off('update',update);socket.close(1000,'check complete')}};
}

function rejectedConnection(roomId,token){
  return Promise.race([
    new Promise(resolve=>{
      const socket=new WebSocket(`${wsOrigin}/ws?room=${encodeURIComponent(roomId)}&token=${encodeURIComponent(token)}`);
      const result={opened:false,error:false,closeCode:null,reason:''};
      socket.addEventListener('open',()=>{result.opened=true;socket.close()});
      socket.addEventListener('error',()=>{result.error=true});
      socket.addEventListener('close',event=>{result.closeCode=event.code;result.reason=event.reason||'';resolve(result)},{once:true});
    }),
    timeout('rejected WebSocket outcome'),
  ]);
}

const health=await Promise.all([
  json('/__cocreate/health'),
  json('/__cocreate/app-health'),
]);
const {roomId}=await json('/api/rooms',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
const createSession=name=>json('/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({roomId,name})});
const [ram,sham]=await Promise.all([createSession('Live Check Ram'),createSession('Live Check Sham')]);
const ramDoc=new Y.Doc(),shamDoc=new Y.Doc();
let ramConnection=connect(roomId,ram.token,ramDoc,'Ram');
const shamConnection=connect(roomId,sham.token,shamDoc,'Sham');
try{
  await Promise.all([ramConnection.opened,shamConnection.opened]);
  await waitFor('initial room state',()=>ramConnection.roomStates>0&&shamConnection.roomStates>0);

  ramDoc.getText('live-check').insert(0,'ram-to-sham');
  await waitFor('Ram to Sham synchronization',()=>shamDoc.getText('live-check').toString()==='ram-to-sham');
  shamDoc.getText('live-check').insert(shamDoc.getText('live-check').length,'|sham-to-ram');
  await waitFor('Sham to Ram synchronization',()=>ramDoc.getText('live-check').toString()==='ram-to-sham|sham-to-ram');
  await waitFor('saved acknowledgement',()=>ramConnection.saved>0&&shamConnection.saved>0);

  ramConnection.socket.close(4000,'simulated interruption');
  await waitFor('Ram disconnect',()=>ramConnection.socket.readyState===WebSocket.CLOSED);
  ramConnection.dispose();
  ramConnection=connect(roomId,ram.token,ramDoc,'Ram reconnect');
  await ramConnection.opened;
  shamDoc.getText('live-check').insert(shamDoc.getText('live-check').length,'|after-reconnect');
  await waitFor('post-reconnect synchronization',()=>ramDoc.getText('live-check').toString().endsWith('|after-reconnect'));

  const invalidSession=await rejectedConnection(roomId,'invalid-session');
  const missingRoom=await rejectedConnection(`missing-${roomId}`,ram.token);
  const invalidState=await fetch(`${origin}/api/rooms/${encodeURIComponent(roomId)}/state`,{headers:{Authorization:'Bearer invalid-session'}});
  const missingState=await fetch(`${origin}/api/rooms/missing-room/state`,{headers:{Authorization:`Bearer ${ram.token}`}});

  console.log(JSON.stringify({
    health:health.map(item=>item.service),
    websocketOpened:true,
    roomStateReceived:true,
    bidirectionalSync:true,
    savedAcknowledged:true,
    reconnectSync:true,
    invalidSession:{websocket:invalidSession,httpStatus:invalidState.status},
    missingRoom:{websocket:missingRoom,httpStatus:missingState.status},
  }));
}finally{
  ramConnection.dispose();
  shamConnection.dispose();
  ramDoc.destroy();
  shamDoc.destroy();
}
