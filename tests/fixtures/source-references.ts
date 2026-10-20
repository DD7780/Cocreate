/** Upgrade controlled provider responses to cite only matching, server-supplied evidence. */
export function citeSources(value:any,input:any) {
  if(!input?.submittedSources)return value;
  const norm=(text:string)=>text.replace(/\s+/g,' ').trim();
  const intents=value.intents||['goals','features','design','constraints','questions'].flatMap(key=>(value[key]||[]).map((text:string)=>({text,
    category:({goals:'goal',features:'feature',design:'design',constraints:'constraint',questions:'question'} as Record<string,string>)[key],
    classification:value.classification,rationale:'Controlled fixture',sourcePassage:value.sourcePassages?.[0]||text,affectedRequirementIds:[]})));
  return {...value,intents:intents.map((intent:any)=>({...intent,sourceRefs:input.submittedSources.filter((source:any)=>{
    const quote=norm(intent.sourcePassage),original=norm(source.text);return quote&&original&&(original.includes(quote)||quote.includes(original));
  }).map((source:any)=>source.id)}))};
}
