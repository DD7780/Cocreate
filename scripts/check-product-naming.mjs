import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

// Count every match, including preserved evidence. Only individually listed exceptions are accepted.
const ledgerPath='docs/harness/product-name-compatibility.json';
const reportPath='artifacts/product-name-cleanup/residuals.json';
const policy=JSON.parse(fs.readFileSync(ledgerPath,'utf8'));
const pattern=/co[-_ ]?create/gi;
assert.deepEqual('CoCreate co-create CO_CREATE co create'.match(pattern)?.length,4);
for(const rule of policy.exceptions){
  assert.ok(rule.files.length&&rule.owner&&rule.reason&&rule.removeWhen&&rule.evidence);
  new RegExp(rule.pattern,'i');
}
const listed=spawnSync('git',['ls-files','-z','--cached','--others','--exclude-standard'],{encoding:'utf8',windowsHide:true});
assert.equal(listed.status,0,'Tracked source inventory available');
const rows=[],unexplained=[],files=new Set();let textFiles=0;
for(const file of [...new Set(listed.stdout.split('\0').filter(Boolean))].sort()){
  // The policy and derived report quote the inventory; counting them recursively would duplicate it.
  if(file===ledgerPath||file===reportPath||!fs.existsSync(file)||!fs.statSync(file).isFile())continue;
  const bytes=fs.readFileSync(file);if(bytes.includes(0))continue;
  const content=bytes.toString('utf8');textFiles++;
  for(const [index,line] of content.split(/\r?\n/).entries()){
    for(const match of line.matchAll(pattern)){
      const rule=policy.exceptions.find(entry=>entry.files.includes(file)&&new RegExp('^(?:'+entry.pattern+')','i').test(line.slice(match.index)));
      const row={file,line:index+1,column:match.index+1,spelling:match[0],classification:rule?.id??'UNEXPLAINED'};
      rows.push(row);files.add(file);if(!rule)unexplained.push(row);
    }
  }
}
const classificationCounts={};
for(const row of rows)classificationCounts[row.classification]=(classificationCounts[row.classification]||0)+1;
const report={scope:'All tracked and new non-ignored text files, including individually inventoried historical evidence; binary files omitted.',derivedExclusions:[ledgerPath,reportPath],textFiles,matchedFiles:files.size,matches:rows.length,classificationCounts,unexplained,rows};
fs.mkdirSync('artifacts/product-name-cleanup',{recursive:true});fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({textFiles,matchedFiles:files.size,matches:rows.length,unexplained:unexplained.length,reportPath}));
if(unexplained.length){console.error(JSON.stringify(unexplained,null,2));process.exitCode=1}
