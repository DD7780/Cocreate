export function previewDocument(bundle:string,css:string){
  const safeCss=css.replace(/<\/style/gi,'<\\/style');
  const safeBundle=bundle.replace(/<\/script/gi,'<\\/script');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'"><style>${safeCss}</style></head><body><div id="root"></div><script>globalThis.__twoGuysOneCanvasRun=function(){${safeBundle}};</script><script>(function(){
var values={},started=false,prefix='2guys1canvas';
function post(kind,data){parent.postMessage(Object.assign({type:prefix+'-'+kind},data||{}),'*')}
Object.defineProperty(globalThis,'localStorage',{value:{get length(){return Object.keys(values).length},key:function(i){return Object.keys(values)[i]||null},getItem:function(k){return Object.prototype.hasOwnProperty.call(values,k)?values[k]:null},setItem:function(k,v){values[String(k)]=String(v);post('storage-set',{key:String(k),value:String(v)})},removeItem:function(k){delete values[String(k)];post('storage-remove',{key:String(k)})},clear:function(){values={};post('storage-clear')}}});
function start(){if(started)return;started=true;try{globalThis.__twoGuysOneCanvasRun()}catch(error){post('preview-error',{message:String(error&&error.message||error)})}}
addEventListener('message',function(event){if(started||event.source!==parent||!event.data||!['2guys1canvas-storage-init','cocreate-storage-init'].includes(event.data.type))return;prefix=event.data.type==='cocreate-storage-init'?'cocreate':'2guys1canvas';values=event.data.values||{};start()});
addEventListener('error',function(e){post('preview-error',{message:e.message})});
post('storage-ready');parent.postMessage({type:'cocreate-storage-ready'},'*');setTimeout(start,700)
})();</script></body></html>`;
}
