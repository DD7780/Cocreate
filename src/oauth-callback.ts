export type OAuthCallbackOutcome=
  |{status:'success';destination:string}
  |{status:'authenticated-error';destination:string;message:string}
  |{status:'denied';message:string}
  |{status:'error';message:string};

export async function completeOAuthCallback(
  search:string,
  destination:string,
  exchangeCode:(code:string)=>Promise<{error:{message:string}|null}>,
  hasExistingSession=false,
):Promise<OAuthCallbackOutcome>{
  const params=new URLSearchParams(search);
  if(params.has('error')||params.has('error_description'))return hasExistingSession?{status:'authenticated-error',destination,message:'The new Google sign-in was cancelled. Your existing session is still available.'}:{status:'denied',message:'Google sign-in was cancelled or denied.'};
  const code=params.get('code');
  if(!code)return hasExistingSession?{status:'authenticated-error',destination,message:'This callback has no new authorization code. Your existing session is still available.'}:{status:'error',message:'The sign-in callback did not contain an authorization code. Start sign-in again.'};
  const result=await exchangeCode(code);
  if(result.error)return hasExistingSession?{status:'authenticated-error',destination,message:'The new sign-in could not be completed, but your existing session is still available.'}:{status:'error',message:result.error.message||'The sign-in code was invalid, expired, or already used. Start sign-in again.'};
  return{status:'success',destination};
}
