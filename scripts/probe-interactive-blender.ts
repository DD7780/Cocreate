// Probe-only trusted launcher variant. Never enables a host/default-desktop session or input API.
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { randomUUID, createHash } from 'node:crypto';
import { prepareIsolation } from '../server/isolation.js';
const hash=(value:Uint8Array|string)=>createHash('sha256').update(value).digest('hex');
if(process.platform!=='win32'||process.arch!=='x64')throw new Error('Interactive probe requires Windows x64.');
const executable=path.resolve(process.env.COCREATE_BLENDER_EXECUTABLE||'');
if(!fs.existsSync(executable)||hash(fs.readFileSync(executable))!=='57fa1d294ea76448c3bec84ca758caf4629611330abba7dcf55bb0c56a0a15ab')throw new Error('Use the pinned official Blender 4.5.14 executable.');
const base=fs.readFileSync('server/isolation/windows-runner.cs','utf8');
function replaceOnce(source:string,search:string,replacement:string){if(source.split(search).length!==2)throw new Error('Native probe anchor changed; review adaptation.');return source.replace(search,replacement);}
let source=replaceOnce(base,'public static class IsolationRunner {',`public static class IsolationRunner {
 [StructLayout(LayoutKind.Sequential)] struct DESKTOP_SECURITY {public int length;public IntPtr descriptor;public bool inherit;}
 [StructLayout(LayoutKind.Sequential)] struct UI_LIMIT {public uint flags;}
 [DllImport("advapi32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern bool ConvertStringSecurityDescriptorToSecurityDescriptor(string value,uint version,out IntPtr descriptor,out uint bytes);
 [DllImport("user32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern IntPtr CreateDesktop(string name,IntPtr device,IntPtr mode,uint flags,uint access,ref DESKTOP_SECURITY security);
 [DllImport("user32.dll",SetLastError=true)] static extern bool CloseDesktop(IntPtr desktop);
 [DllImport("user32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern IntPtr CreateWindowStation(string name,uint flags,uint access,ref DESKTOP_SECURITY security);
 [DllImport("user32.dll",SetLastError=true)] static extern bool SetProcessWindowStation(IntPtr station);
 [DllImport("user32.dll")] static extern bool CloseWindowStation(IntPtr station);
 [DllImport("kernel32.dll")] static extern IntPtr LocalFree(IntPtr value);
 [DllImport("kernel32.dll",EntryPoint="SetInformationJobObject",SetLastError=true)] static extern bool SetJobUI(IntPtr job,int kind,ref UI_LIMIT value,uint bytes);
 static IntPtr probeDesktop=IntPtr.Zero;
 static IntPtr probeStation=IntPtr.Zero;
`);
source=replaceOnce(source,'Check(SetInformationJobObject(job,9,ref limit,(uint)Marshal.SizeOf(typeof(EXTENDED_LIMIT))),"job limits");',`Check(SetInformationJobObject(job,9,ref limit,(uint)Marshal.SizeOf(typeof(EXTENDED_LIMIT))),"job limits");
   UI_LIMIT ui=new UI_LIMIT();ui.flags=0xff;Check(SetJobUI(job,4,ref ui,4),"GUI restrictions");`);
source=replaceOnce(source,'startup.info.input=GetStdHandle(-10);',`IntPtr desktopSD;uint desktopBytes;
   string owner=WindowsIdentity.GetCurrent().User.Value,appSid=new SecurityIdentifier(sid).Value;
   Check(ConvertStringSecurityDescriptorToSecurityDescriptor("D:P(A;;GA;;;"+owner+")(A;;GA;;;SY)(A;;0x000000c7;;;"+appSid+")S:(ML;;NW;;;LW)",1,out desktopSD,out desktopBytes),"private low-integrity desktop DACL");
   try{DESKTOP_SECURITY desktopSecurity=new DESKTOP_SECURITY();desktopSecurity.length=Marshal.SizeOf(typeof(DESKTOP_SECURITY));desktopSecurity.descriptor=desktopSD;
    string name="cocreate_probe_"+Path.GetFileName(workspace).Replace("-","");
    IntPtr stationSD;uint stationBytes;Check(ConvertStringSecurityDescriptorToSecurityDescriptor("D:P(A;;GA;;;"+owner+")(A;;GA;;;SY)(A;;0x00000323;;;"+appSid+")S:(ML;;NW;;;LW)",1,out stationSD,out stationBytes),"private station DACL");
    try{DESKTOP_SECURITY stationSecurity=new DESKTOP_SECURITY();stationSecurity.length=Marshal.SizeOf(typeof(DESKTOP_SECURITY));stationSecurity.descriptor=stationSD;probeStation=CreateWindowStation(name,0,0x000f037f,ref stationSecurity);Check(probeStation!=IntPtr.Zero,"private station");Check(SetProcessWindowStation(probeStation),"private station association");}finally{LocalFree(stationSD);}
    probeDesktop=CreateDesktop(name,IntPtr.Zero,IntPtr.Zero,0,0x000f01ff,ref desktopSecurity);Check(probeDesktop!=IntPtr.Zero,"private desktop");startup.info.desktop=name+"\\\\"+name;
   }finally{LocalFree(desktopSD);}
   startup.info.input=GetStdHandle(-10);`);
source=replaceOnce(source,' --background --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 --python ',' --factory-startup --disable-autoexec --threads 2 --python-exit-code 1 --python ');
source=replaceOnce(source,'}if(sid!=IntPtr.Zero)FreeSid(sid);','}if(sid!=IntPtr.Zero)FreeSid(sid);if(probeDesktop!=IntPtr.Zero)CloseDesktop(probeDesktop);if(probeStation!=IntPtr.Zero)CloseWindowStation(probeStation);');
const runtime=path.resolve('.runtime/interactive-blender-probe'),workspace=path.join(runtime,randomUUID());fs.mkdirSync(workspace,{recursive:true});
const native=path.join(runtime,'runner.cs');fs.writeFileSync(native,source);fs.copyFileSync('server/isolation/interactive-blender-probe.py',path.join(workspace,'scene.py'));
const outside=path.resolve('.runtime/interactive-private-'+randomUUID());fs.writeFileSync(outside,'probe-only-private-file');
const server=net.createServer(socket=>socket.destroy());await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
fs.writeFileSync(path.join(workspace,'input.json'),JSON.stringify({outside,port:(server.address() as net.AddressInfo).port}));
const run=(command:string,args:string[])=>new Promise<{code:number|null;output:string}>((resolve,reject)=>{const child=spawn(command,args,{windowsHide:true,stdio:['ignore','pipe','pipe'],env:{SystemRoot:process.env.SystemRoot||'C:\\Windows'}});let output='';child.stdout.on('data',chunk=>{output+=chunk;if(output.length>128*1024)child.kill();});child.stderr.on('data',chunk=>{output+=chunk;if(output.length>128*1024)child.kill();});child.once('error',reject);child.once('close',code=>resolve({code,output}));});
try{
  const compiler=path.join(process.env.SystemRoot||'C:\\Windows','Microsoft.NET','Framework64','v4.0.30319','csc.exe');const compiled=await run(compiler,['/nologo','/target:exe','/platform:x64','/out:'+path.join(runtime,'runner.exe'),native]);if(compiled.code!==0)throw new Error(compiled.output);
  const trusted=await prepareIsolation();const result=await run(path.join(runtime,'runner.exe'),[trusted,workspace,'cocreate.isolation.'+path.basename(workspace).replaceAll('-',''),String(process.pid),'30000','blender',executable]);
  const probeFile=path.join(workspace,'interactive-probe.json'),probe=fs.existsSync(probeFile)?JSON.parse(fs.readFileSync(probeFile,'utf8')):null;
  const pid=Number(result.output.match(/ISOLATION_STARTED (\d+)/)?.[1]||0);let childRemoved=false;if(pid){try{process.kill(pid,0);}catch{childRemoved=true;}}
  const softwareGL=path.join(path.dirname(executable),'opengl32.dll');const evidence={verifiedAt:new Date().toISOString(),scope:'Private window station/desktop, AppContainer and all Job UI restrictions; probe only, no remote viewing/input capability enabled.',executableHash:hash(fs.readFileSync(executable)),softwareOpenGLHash:fs.existsSync(softwareGL)?hash(fs.readFileSync(softwareGL)):null,baseSourceHash:hash(base),nativeProbeHash:hash(source),pythonProbeHash:hash(fs.readFileSync('server/isolation/interactive-blender-probe.py')),exitCode:result.code,probe,childRemoved,diagnostics:result.output};
  fs.mkdirSync('artifacts/interactive-blender',{recursive:true});const evidencePath=path.join('artifacts/interactive-blender','environment-probe-'+new Date().toISOString().replaceAll(':','-').replaceAll('.','-')+'.json');fs.writeFileSync(evidencePath,JSON.stringify(evidence,null,2),{flag:'wx'});console.log(JSON.stringify({evidencePath,...evidence}));
}finally{fs.unlinkSync(outside);await new Promise<void>(resolve=>server.close(()=>resolve()));}
