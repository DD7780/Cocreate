export type SupabaseAuthConfig={url:string;publishableKey:string;appOrigin:string;redirectTo:string};
export type SupabaseAuthResolution={config:SupabaseAuthConfig|null;error:string|null};

const required=['VITE_SUPABASE_URL','VITE_SUPABASE_PUBLISHABLE_KEY','VITE_COCREATE_APP_ORIGIN'] as const;

function parseOrigin(label:string,value:string,allowLocalHttp=false){
  try{
    const url=new URL(value);
    const local=allowLocalHttp&&url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname);
    if((url.protocol!=='https:'&&!local)||url.username||url.password||url.search||url.hash||url.pathname!=='/')throw new Error();
    return null;
  }catch{return `${label} must be an HTTPS origin without a path, query, credentials, or fragment${allowLocalHttp?' (localhost HTTP is allowed for development)':''}.`;}
}

function legacyKeyProjectRef(key:string){
  if(!key.includes('.'))return null;
  try{
    const part=key.split('.')[1],padding='='.repeat((4-part.length%4)%4),payload=JSON.parse(atob(part.replace(/-/g,'+').replace(/_/g,'/')+padding));
    return typeof payload.ref==='string'?payload.ref:'';
  }catch{return '';}
}

export function resolveSupabaseAuthConfig(env:Record<string,string|undefined>):SupabaseAuthResolution{
  const missing=required.filter(name=>!env[name]?.trim());
  if(missing.length)return{config:null,error:`Hosted authentication is not configured. Missing build variables: ${missing.join(', ')}.`};
  const rawUrl=env.VITE_SUPABASE_URL!.trim(),rawOrigin=env.VITE_COCREATE_APP_ORIGIN!.trim(),publishableKey=env.VITE_SUPABASE_PUBLISHABLE_KEY!.trim();
  const urlError=parseOrigin('VITE_SUPABASE_URL',rawUrl),originError=parseOrigin('VITE_COCREATE_APP_ORIGIN',rawOrigin,true);
  if(urlError)return{config:null,error:urlError};
  if(originError)return{config:null,error:originError};
  const url=new URL(rawUrl),projectRef=url.hostname.endsWith('.supabase.co')?url.hostname.slice(0,-'.supabase.co'.length):'';
  if(!projectRef)return{config:null,error:'VITE_SUPABASE_URL must use the intended project hostname under supabase.co.'};
  const keyRef=legacyKeyProjectRef(publishableKey);
  if(keyRef==='')return{config:null,error:'VITE_SUPABASE_PUBLISHABLE_KEY is not a valid publishable or legacy anon key.'};
  if(keyRef&&keyRef!==projectRef)return{config:null,error:'The public Supabase URL and publishable key belong to different projects.'};
  const appOrigin=new URL(rawOrigin).origin;
  return{config:{url:new URL(rawUrl).origin,publishableKey,appOrigin,redirectTo:`${appOrigin}/api/auth/callback`},error:null};
}

export function safeLocalDestination(value:string|null|undefined,fallback='/projects',origin=typeof location==='undefined'?'http://localhost':location.origin){
  if(!value||!value.startsWith('/')||value.startsWith('//')||value.includes('\\'))return fallback;
  try{const parsed=new URL(value,origin);if(parsed.origin!==origin)return fallback;return `${parsed.pathname}${parsed.search}${parsed.hash}`}catch{return fallback;}
}
