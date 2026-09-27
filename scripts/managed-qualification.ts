import { readFile } from 'node:fs/promises';
import { managedFixtures, scoreManagedTrials, type ManagedTrial } from '../server/managed-qualification.js';
import { MANAGED_CATALOG_VERSION, managedCatalog } from '../server/managed-catalog.js';

const [command,file]=process.argv.slice(2);
if(command==='plan'){
  console.log(JSON.stringify({catalogVersion:MANAGED_CATALOG_VERSION,
    models:managedCatalog.map(item=>({id:item.id,availability:item.availability,qualification:item.qualification})),
    fixtures:managedFixtures,repetitions:3,
    note:'No provider call is made. Live trials require an explicitly authorized USD budget and human visual review.'},null,2));
}else if(command==='score'&&file){
  const trials=JSON.parse(await readFile(file,'utf8')) as ManagedTrial[];
  if(!Array.isArray(trials))throw new Error('Expected an array of recorded trial results.');
  console.log(JSON.stringify(scoreManagedTrials(trials),null,2));
}else{
  console.error('Usage: pnpm exec tsx scripts/managed-qualification.ts plan | score <recorded-trials.json>');
  process.exitCode=2;
}
