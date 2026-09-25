export type InvitationEmail = {
  invitationId:string;
  recipientEmail:string;
  inviterName:string;
  projectTitle:string;
  role:'editor'|'viewer';
  inviteUrl:string;
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

export function invitationEmailSenderFromEnv(
  env:NodeJS.ProcessEnv=process.env,
  request:typeof fetch=fetch,
):InvitationEmailSender {
  const apiKey=env.RESEND_API_KEY?.trim(),from=env.COCREATE_EMAIL_FROM?.trim();
  if(!apiKey||!from)return{
    configured:false,
    async send(){return{state:'configuration_required',error:'Transactional email is not configured. Add RESEND_API_KEY and COCREATE_EMAIL_FROM.'}},
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
            subject:`${inviterName} invited you to ${projectTitle} in CoCreate`,
            text:`${inviterName} invited you to join “${projectTitle}” as ${message.role}. Open this invitation: ${message.inviteUrl}\n\nThe invitation is intended only for ${message.recipientEmail}.`,
            html:`<p>${html(inviterName)} invited you to join <strong>${html(projectTitle)}</strong> as ${html(message.role)}.</p><p><a href="${html(message.inviteUrl)}">Open project invitation</a></p><p>This invitation is intended only for ${html(message.recipientEmail)}.</p>`,
          }),
          signal:AbortSignal.timeout(10_000),
        });
        const body=await response.json().catch(()=>({})) as {id?:string;message?:string};
        if(!response.ok)return{state:'failed',error:body.message||`Email provider rejected the request (${response.status}).`};
        return{state:'sent',providerMessageId:body.id};
      }catch(error){return{state:'failed',error:error instanceof Error?error.message:'Email provider request failed.'}}
    },
  };
}
