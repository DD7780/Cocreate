const {DatabaseSync}=require('node:sqlite');
const fs=require('node:fs');const path=require('node:path');
const id='f3Up_EmJ0X31-j7RR0XnEP6S';
const db=new DatabaseSync(path.resolve('data/cocreate.sqlite'),{readOnly:true});
try {
 const row=db.prepare('SELECT state_json FROM workspace_state WHERE workspace_id=?').get(id);
 if(!row)throw new Error('Known workspace is absent; no preview refresh attempted.');
 const state=JSON.parse(row.state_json);
 const result={roomId:id,status:state.status,activeSubmissions:(state.submissions||[]).filter(s=>['submitted','interpreting','queued'].includes(s.status)).length,versions:(state.versions||[]).length,readOnly:true};
 fs.writeFileSync('artifacts/multiuser-step08/local-idle.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 if(result.activeSubmissions)throw new Error('Known workspace is not idle; inspect before refreshing.');
}finally{db.close();}
