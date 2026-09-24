import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { resolveSupabaseAuthConfig } from './auth-config';
export { safeLocalDestination } from './auth-config';

const resolved=resolveSupabaseAuthConfig(import.meta.env),config=resolved.config;
export const clientAuthMode=(import.meta.env.VITE_COCREATE_AUTH_MODE as string|undefined)||(import.meta.env.DEV?'local':'supabase');
export const supabaseConfigurationError=clientAuthMode==='supabase'?resolved.error:null;
export const supabaseOAuthRedirectUrl=config?.redirectTo||'';

export const supabase:SupabaseClient|null=config?createClient(config.url,config.publishableKey,{
  auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false},
}):null;

export const authReturnKey='cocreate-auth-return';
