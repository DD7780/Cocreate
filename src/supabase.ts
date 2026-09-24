import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { resolveSupabaseAuthConfig } from './auth-config';

const {url,publishableKey,redirectTo}=resolveSupabaseAuthConfig(import.meta.env);
export const clientAuthMode=(import.meta.env.VITE_COCREATE_AUTH_MODE as string|undefined)||(import.meta.env.DEV?'local':'supabase');
export const supabaseConfigurationError=null;
export const supabaseOAuthRedirectUrl=redirectTo;

export const supabase:SupabaseClient|null=createClient(url,publishableKey,{
  auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false},
});

export function safeLocalDestination(value:string|null|undefined,fallback='/projects') {
  if(!value||!value.startsWith('/')||value.startsWith('//')||value.includes('\\'))return fallback;
  try{const parsed=new URL(value,location.origin);if(parsed.origin!==location.origin)return fallback;return `${parsed.pathname}${parsed.search}${parsed.hash}`}catch{return fallback}
}

export const authReturnKey='cocreate-auth-return';
