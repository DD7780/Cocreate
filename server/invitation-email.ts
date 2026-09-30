export type InvitationEmail = {
  invitationId:string;
  recipientEmail:string;
  inviterName:string;
  projectTitle:string;
  role:'editor'|'viewer';
  inviteUrl:string;
  expiresAt:string;
};

export type InvitationDelivery = {
  state:'sent'|'failed'|'configuration_required';
  providerMessageId?:string;
  error?:string;
};

export interface InvitationEmailSender {
  configured:boolean;
  send(message:InvitationEmail):Promise<InvitationDelivery>;
}

const html=(value:string)=>value.replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;',
}[char]!));
const plain=(value:string)=>value.replace(/[\r\n\t]+/g,' ').replace(/\s{2,}/g,' ').trim();
const validSender=(value:string)=>{
  if(value!==value.trim()||/["'\r\n]/.test(value))return false;
  if(value.includes('<')&&!/^[^<>\s][^<>]*[^<>\s] <[^<>]+>$/.test(value))return false;
  const address=value.includes('<')?value.match(/^([^<>]+) <([^<>]+)>$/)?.[2]:value;
  return !!address&&!/example\.(com|org|net)$/i.test(address)&&/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(address);
};

export function invitationEmailSenderFromEnv(
  env:NodeJS.ProcessEnv=process.env,
  request:typeof fetch=fetch,
):InvitationEmailSender {
  const apiKey=env.RESEND_API_KEY?.trim(),from=env.COCREATE_EMAIL_FROM;
  if(!apiKey||!from||!validSender(from))return{
    configured:false,
    async send(){return{state:'configuration_required',error:'Invitation email is unavailable. Configure RESEND_API_KEY and COCREATE_EMAIL_FROM with an authorized sender on a domain verified in Resend.'}},
  };
  return{
    configured:true,
    async send(message){
      try{
        const inviterName=plain(message.inviterName).slice(0,80),projectTitle=plain(message.projectTitle).slice(0,120);
        const response=await request('https://api.resend.com/emails',{
          method:'POST',
          headers:{
            Authorization:`Bearer ${apiKey}`,
            'Content-Type':'application/json',
            'Idempotency-Key':`cocreate-project-invite-${message.invitationId}`,
          },
          body:JSON.stringify({
            from,
            to:[message.recipientEmail],
            subject:`${inviterName} invited you to ${projectTitle} in 2guys1canvas`,
            text:`${inviterName} invited you to join “${projectTitle}” as ${message.role}. Accept invitation: ${message.inviteUrl}\nExpires: ${message.expiresAt}\n\nThis invitation is intended only for ${message.recipientEmail}.`,
            html:`<p>${html(inviterName)} invited you to join <strong>${html(projectTitle)}</strong> as ${html(message.role)}.</p><p><a href="${html(message.inviteUrl)}">Accept invitation</a></p><p>Expires: ${html(message.expiresAt)}</p><p>This invitation is intended only for ${html(message.recipientEmail)}.</p>`,
          }),
          signal:AbortSignal.timeout(10_000),
        });
        const body=await response.json().catch(()=>({})) as {id?:string;message?:string};
        if(!response.ok){console.warn('Invitation email rejected by provider',{invitationId:message.invitationId,status:response.status});return{state:'failed',error:`Email provider rejected the invitation (${response.status}). Check the verified sender and recipient.`}}
        if(!body.id){console.warn('Invitation email response lacked an acceptance ID',{invitationId:message.invitationId});return{state:'failed',error:'Email provider did not confirm acceptance of the invitation.'}}
        return{state:'sent',providerMessageId:body.id};
      }catch(error){console.warn('Invitation email request failed',{invitationId:message.invitationId,errorType:error instanceof Error?error.name:'Unknown'});return{state:'failed',error:'Email provider could not be reached. Retry the invitation.'}}
    },
  };
}
