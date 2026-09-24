export const defaultSupabaseUrl='https://dnsapasubeoxxsgkiotw.supabase.co';
export const defaultSupabasePublishableKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuc2FwYXN1YmVveHhzZ2tpb3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxODIyOTEsImV4cCI6MjEwNTc1ODI5MX0.gUDEoMSpHhtdsnXNz0oi4bDYml6Ofl5QrkxDU06nc24';
export const defaultSupabaseOAuthRedirectUrl='https://cocreate.pages.dev/api/auth/callback';

export function resolveSupabaseAuthConfig(env:Record<string,string|undefined>){
  return{
    url:env.VITE_SUPABASE_URL?.trim()||defaultSupabaseUrl,
    publishableKey:env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()||defaultSupabasePublishableKey,
    redirectTo:env.VITE_SUPABASE_OAUTH_REDIRECT_URL?.trim()||defaultSupabaseOAuthRedirectUrl,
  };
}
