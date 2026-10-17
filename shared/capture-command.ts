import * as Y from 'yjs';

export const CAPTURE_VERSION = 1;
export const MAX_CAPTURE_BYTES = 512 * 1024;
export const MAX_CAPTURE_UPDATES = 4096;
export type CaptureSource = {id:string; update:string};
export type CaptureEnvelope = {
  version:1;
  requestId:string;
  cutoff:{vector:string; deletions:string};
  sourceIds:string[];
  updates:CaptureSource[];
};
export type CaptureState = 'captured'|'interpreting'|'queued'|'awaiting_decision'|'no_build_needed'|'building'|'verifying'|'available'|'failed'|'interrupted';
export type CaptureReceipt = {
  durable:true; commandId:string; requestId:string; actorId:string; cursor:number;
  sourceRevision:number; acceptedRevision:number; state:CaptureState; productVersion:number|null; message?:string;
};
export const validCaptureId=(value:unknown):value is string=>typeof value==='string'&&/^[A-Za-z0-9_-]{1,100}$/.test(value);
export const encodeCaptureBytes=(bytes:Uint8Array)=>btoa(Array.from(bytes,byte=>String.fromCharCode(byte)).join(''));
export function decodeCaptureBytes(value:unknown,max=MAX_CAPTURE_BYTES):Uint8Array{
  if(typeof value!=='string'||value.length>Math.ceil(max/3)*4||! /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value))throw new Error('Invalid capture bytes.');
  const bytes=Uint8Array.from(atob(value),char=>char.charCodeAt(0));
  if(bytes.length>max)throw new Error('Capture exceeds its payload limit.');
  return bytes;
}
export function validateCaptureEnvelope(input:unknown):CaptureEnvelope{
  const value=input as CaptureEnvelope;
  if(!value||value.version!==1||!validCaptureId(value.requestId)||!value.cutoff||!Array.isArray(value.updates)||value.updates.length>MAX_CAPTURE_UPDATES)throw new Error('Use a supported capture command and bounded source batch.');
  if(Object.keys(value).some(key=>!['version','requestId','cutoff','updates','sourceIds'].includes(key))||Object.keys(value.cutoff).some(key=>!['vector','deletions'].includes(key)))throw new Error('Unexpected capture fields.');
  if(!Array.isArray(value.sourceIds)||value.sourceIds.length>MAX_CAPTURE_UPDATES||value.sourceIds.some(id=>!validCaptureId(id))||new Set(value.sourceIds).size!==value.sourceIds.length)throw new Error('Invalid capture source selection.');
  Y.decodeStateVector(decodeCaptureBytes(value.cutoff.vector,256*1024));
  if(typeof value.cutoff.deletions!=='string'||value.cutoff.deletions.length>256*1024)throw new Error('Invalid deletion cutoff.');
  const ranges=JSON.parse(value.cutoff.deletions);
  if(!Array.isArray(ranges)||ranges.some(row=>!Array.isArray(row)||row.length!==2||!Number.isSafeInteger(row[0])||row[0]<0||!Array.isArray(row[1])||row[1].some((range:unknown)=>!Array.isArray(range)||range.length!==2||range.some(n=>!Number.isSafeInteger(n)||n<0)||range[1]===0)))throw new Error('Invalid deletion ranges.');
  const ids=new Set<string>();let bytes=0;
  const updates=value.updates.map(source=>{
    if(!source||Object.keys(source).some(key=>!['id','update'].includes(key))||!validCaptureId(source.id)||ids.has(source.id))throw new Error('Invalid or duplicated source identity.');
    ids.add(source.id);const decoded=decodeCaptureBytes(source.update);Y.decodeUpdate(decoded);bytes+=decoded.length;
    return {id:source.id,update:source.update};
  });
  if(bytes>MAX_CAPTURE_BYTES)throw new Error('Capture exceeds its payload limit.');
  return {version:1,requestId:value.requestId,cutoff:{vector:value.cutoff.vector,deletions:value.cutoff.deletions},sourceIds:[...value.sourceIds],updates};
}
/** A clock frontier alone cannot cover deletion-only edits. */
export function captureCovers(update:string,cutoff:CaptureEnvelope['cutoff']){
  const clocks=Y.decodeStateVector(decodeCaptureBytes(cutoff.vector)),decoded=Y.decodeUpdate(decodeCaptureBytes(update));
  if(decoded.structs.some(struct=>(clocks.get(struct.id.client)||0)<struct.id.clock+struct.length))return false;
  const deletions=new Map<number,Array<[number,number]>>(JSON.parse(cutoff.deletions));
  return [...decoded.ds.clients].every(([client,ranges])=>ranges.every(range=>(deletions.get(client)||[]).some(([clock,length])=>clock<=range.clock&&clock+length>=range.clock+range.len)));
}
