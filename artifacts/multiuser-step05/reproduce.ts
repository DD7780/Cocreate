import {reconcileRequirements} from '../../server/requirements.js';
const contribution=(participantId:string,text:string,affected:string[]=[])=>({id:participantId+text,participantId,participantName:participantId,goals:[],features:[text],design:[],constraints:[],questions:[],additions:[text],modifications:[],withdrawals:[],classification:'explicit_request' as const,affectedRequirementIds:affected,sourceRevision:1,sourceEditSeqs:[1],sourcePassages:[text],revision:1,createdAt:'2026-10-04T00:00:00Z'});
const original=reconcileRequirements([],contribution('alice','Make the header red'));
const shared=reconcileRequirements(original.requirements,contribution('bob','Make the header red'));
const target=shared.requirements[0];
const changed=reconcileRequirements(shared.requirements,contribution('alice','Make the header blue',[target.id]));
console.log(JSON.stringify({scope:'Local registry reproduction at current checkout; no inference',coauthoredOriginal:target.description,afterCallerOnlyModelAffectedId:changed.requirements[0].description,remainingAuthors:changed.requirements[0].sources.map(source=>source.participantId),teammateDescriptionPreserved:changed.requirements.some(req=>req.description===target.description&&req.sources.some(source=>source.participantId==='bob'))},null,2));
