import * as Y from 'yjs';

const legacyBufferShape=(value:unknown):value is {type:'Buffer';data:number[]}=>{
  if(!value||typeof value!=='object')return false;
  const candidate=value as {type?:unknown;data?:unknown};
  return candidate.type==='Buffer'&&Array.isArray(candidate.data)&&candidate.data.every(byte=>Number.isInteger(byte)&&byte>=0&&byte<=255);
};

export function persistedRawBytes(value:unknown):Buffer{
  if(typeof value==='string'){
    if(/^\\x[0-9a-f]*$/i.test(value))return Buffer.from(value.slice(2),'hex');
    return Buffer.from(value,'utf8');
  }
  if(value instanceof Uint8Array)return Buffer.from(value.buffer,value.byteOffset,value.byteLength);
  if(Array.isArray(value)&&value.every(byte=>Number.isInteger(byte)&&byte>=0&&byte<=255))return Buffer.from(value);
  throw new Error('The persisted Yjs value is not a supported byte representation.');
}

export function decodePersistedYjsUpdate(value:unknown){
  const stored=persistedRawBytes(value);
  let bytes=stored,legacyBufferJson=false;
  if(stored[0]===0x7b){
    try{
      const parsed=JSON.parse(stored.toString('utf8'));
      if(legacyBufferShape(parsed)){bytes=Buffer.from(parsed.data);legacyBufferJson=true}
    }catch{/* A real Yjs update can begin with the same byte; validation below remains authoritative. */}
  }
  const isolated=new Y.Doc();
  try{Y.applyUpdate(isolated,new Uint8Array(bytes.buffer,bytes.byteOffset,bytes.byteLength),'persistence-validation')}
  catch(error){throw new Error(`Stored collaboration data failed Yjs V1 validation: ${error instanceof Error?error.message:'invalid update'}`)}
  finally{isolated.destroy()}
  return{bytes:Buffer.from(bytes),legacyBufferJson,storedBytes:Buffer.from(stored)};
}

export const encodePostgresBytea=(bytes:Uint8Array)=>`\\x${Buffer.from(bytes.buffer,bytes.byteOffset,bytes.byteLength).toString('hex')}`;
