import * as Y from 'yjs';

const plainText=(node:unknown):string=>{
  if(node instanceof Y.XmlText)return node.toDelta().map((item:{insert?:unknown})=>typeof item.insert==='string'?item.insert:'').join('');
  if(node instanceof Y.XmlElement||node instanceof Y.XmlFragment)return node.toArray().map(plainText).join('');
  return '';
};

/** Capture exact insertions while the authenticated transaction's deltas are valid. */
export function applySteeringUpdate(doc:Y.Doc,update:Uint8Array,origin:unknown){
  const fragment=doc.getXmlFragment('default'),insertions:string[]=[];
  const previous=new Map<Y.AbstractType<any>,string>();
  const capture=(node:unknown)=>{if(node instanceof Y.XmlText)previous.set(node,plainText(node));else if(node instanceof Y.XmlElement||node instanceof Y.XmlFragment)node.toArray().forEach(capture)};
  capture(fragment);
  const observe=(events:Y.YEvent<any>[])=>{
    const added=new Set<Y.AbstractType<any>>();
    for(const event of events)for(const item of event.delta){
      if(Array.isArray(item.insert))for(const node of item.insert)if(node instanceof Y.AbstractType)added.add(node);
    }
    const insideAdded=(node:Y.AbstractType<any>|null):boolean=>{
      for(let current=node;current;current=current.parent)if(added.has(current))return true;
      return false;
    };
    for(const node of added)if(!insideAdded(node.parent))insertions.push(plainText(node));
    for(const event of events)if(!insideAdded(event.target)){
      let offset=0;
      for(const item of event.delta){
        if(item.retain)offset+=item.retain;
        if(typeof item.insert==='string'){
          // Editor diffing may reuse a common prefix ("Add f") and encode a
          // leading sentence as an equivalent insertion inside the next one.
          // Normalize pure insertions left without claiming existing text.
          let text=item.insert,index=offset;
          if(!event.delta.some(part=>part.delete)){
            const before=previous.get(event.target)||'';
            if(/\w/.test(before[index-1]||'')&&/\w/.test(before[index]||''))
              while(index>0&&before[index-1]===text.at(-1)){text=text.at(-1)!+text.slice(0,-1);index--;}
          }
          insertions.push(text);
        }
        if(item.delete)offset+=item.delete;
      }
    }
  };
  fragment.observeDeep(observe);
  try{Y.applyUpdate(doc,update,origin);}finally{fragment.unobserveDeep(observe);}
  return insertions.filter(Boolean).join('\n');
}
