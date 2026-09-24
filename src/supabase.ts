import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url=import.meta.env.VITE_SUPABASE_URL as string|undefined;
const publishableKey=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string|undefined;
export const clientAuthMode=(import.meta.env.VITE_COCREATE_AUTH_MODE as string|undefined)||(import.meta.env.DEV?'local':'supabase');
export const supabaseConfigurationError=clientAuthMode==='supabase'&&(!url||!publishableKey)
  ?'VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required for hosted authentication.'
  :null;

export const supabase:SupabaseClient|null=url&&publishableKey?createClient(url,publishableKey,{
  auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false},
}):null;

export function safeLocalDestination(value:string|null|undefined,fallback='/projects') {
  if(!value||!value.startsWith('/')||value.startsWith('//')||value.includes('\\'))return fallback;
  try{const parsed=new URL(value,location.origin);if(parsed.origin!==location.origin)return fallback;return `${parsed.pathname}${parsed.search}${parsed.hash}`}catch{return fallback}
}

export const authReturnKey='cocreate-auth-return';
