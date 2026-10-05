const fs=require('node:fs');
(async()=>{
 const origin='http://localhost:5173',url=`${origin}/r/f3Up_EmJ0X31-j7RR0XnEP6S`;
 let ready;
 for(let attempt=0;attempt<12;attempt++){
  try{const response=await fetch(`${origin}/__cocreate/app-health`,{signal:AbortSignal.timeout(5000)});const body=await response.json();if(response.ok&&body.status==='ok'&&body.service==='cocreate-app'){ready=body;break;}}catch{}
  await new Promise(resolve=>setTimeout(resolve,500));
 }
 if(!ready)throw new Error('Local app health did not become ready.');
 const response=await fetch(url,{signal:AbortSignal.timeout(5000)}),html=await response.text();
 if(!response.ok||!html.includes('/@vite/client'))throw new Error('Local workspace SPA is not ready.');
 const result={url,health:ready,status:response.status,viteClient:true,scope:'HTTP readiness only; no inference, generated-room change or browser acceptance claim'};
 fs.writeFileSync('artifacts/multiuser-step08/local-preview.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
