export type OAuthCallbackOutcome=
  |{status:'success';destination:string}
  |{status:'denied';message:string}
  |{status:'error';message:string};

export async function completeOAuthCallback(
  search:string,
  destination:string,
  exchangeCode:(code:string)=>Promise<{error:{message:string}|null}>,
):Promise<OAuthCallbackOutcome>{
  const params=new URLSearchParams(search);
  if(params.has('error')||params.has('error_description'))return{status:'denied',message:'Sign-in was cancelled, denied, or the email link expired.'};
  const code=params.get('code');
  if(!code)return{status:'error',message:'The sign-in callback did not contain an authorization code. Start sign-in again.'};
  const result=await exchangeCode(code);
  if(result.error)return{status:'error',message:result.error.message||'The sign-in code was invalid, expired, or already used. Start sign-in again.'};
  return{status:'success',destination};
}
