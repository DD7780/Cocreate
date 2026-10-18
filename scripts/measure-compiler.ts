import {bundleProject} from '../server/project.js';
import {assertIsolationAvailable,safeIsolationDiagnostics,IsolationError,isolationPolicy} from '../server/isolation.js';
import {restaurantFiles} from '../tests/fixtures/restaurant.js';
const measurements=[];
for(const name of ['tiny-preflight','restaurant-cold','restaurant-warm']){
  const started=performance.now();
  try{
    const result=name==='tiny-preflight'?await assertIsolationAvailable():await bundleProject(restaurantFiles());
    measurements.push({name,ok:true,elapsedMs:Math.round(performance.now()-started),diagnostics:result&&safeIsolationDiagnostics(result.diagnostics)});
  }catch(error){measurements.push({name,ok:false,elapsedMs:Math.round(performance.now()-started),code:error instanceof IsolationError?error.code:'compile_failed',diagnostics:error instanceof Error?safeIsolationDiagnostics(error.cause):undefined});process.exitCode=1;}
}
console.log(JSON.stringify({platform:process.platform,policy:isolationPolicy,representativeSource:true,exactIncidentSource:false,fileCount:restaurantFiles().length,measurements},null,2));
