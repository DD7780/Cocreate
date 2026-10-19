// Trusted launcher: AppContainer has no capabilities; Job Object is assigned before resume.
// Never run candidate code if any native restriction cannot be installed.
using System;
using System.IO;
using System.Text;
using System.Diagnostics;
using System.ComponentModel;
using System.Runtime.InteropServices;
using System.Security.AccessControl;
using System.Security.Principal;

public static class IsolationRunner {
 [StructLayout(LayoutKind.Sequential)] struct SECURITY_CAPABILITIES { public IntPtr Sid,Capabilities; public uint Count,Reserved; }
 [StructLayout(LayoutKind.Sequential,CharSet=CharSet.Unicode)] struct STARTUPINFO { public uint cb; public string reserved,desktop,title; public uint x,y,xSize,ySize,xChars,yChars,fill,flags; public short show,reserved2; public IntPtr reservedPtr,input,output,error; }
 [StructLayout(LayoutKind.Sequential)] struct STARTUPINFOEX { public STARTUPINFO info; public IntPtr attributes; }
 [StructLayout(LayoutKind.Sequential)] struct PROCESS_INFORMATION { public IntPtr process,thread; public uint pid,tid; }
 [StructLayout(LayoutKind.Sequential)] struct BASIC_LIMIT { public long processTime,jobTime; public uint flags; public UIntPtr minWorking,maxWorking; public uint active; public UIntPtr affinity; public uint priority,scheduling; }
 [StructLayout(LayoutKind.Sequential)] struct IO_COUNTERS { public ulong readOps,writeOps,otherOps,readBytes,writeBytes,otherBytes; }
 [StructLayout(LayoutKind.Sequential)] struct EXTENDED_LIMIT { public BASIC_LIMIT basic; public IO_COUNTERS io; public UIntPtr processMemory,jobMemory,peakProcess,peakJob; }
 [StructLayout(LayoutKind.Sequential)] struct BASIC_ACCOUNTING { public long userTime,kernelTime,periodUserTime,periodKernelTime; public uint pageFaults,processes,activeProcesses,terminatedProcesses; }
 [DllImport("userenv.dll",CharSet=CharSet.Unicode)] static extern int CreateAppContainerProfile(string name,string display,string description,IntPtr capabilities,uint count,out IntPtr sid);
 [DllImport("userenv.dll",CharSet=CharSet.Unicode)] static extern int DeleteAppContainerProfile(string name);
 [DllImport("advapi32.dll")] static extern IntPtr FreeSid(IntPtr sid);
 [DllImport("kernel32.dll",SetLastError=true)] static extern bool InitializeProcThreadAttributeList(IntPtr list,int count,int flags,ref IntPtr bytes);
 [DllImport("kernel32.dll",SetLastError=true)] static extern bool UpdateProcThreadAttribute(IntPtr list,uint flags,IntPtr attribute,IntPtr value,IntPtr size,IntPtr previous,IntPtr returned);
 [DllImport("kernel32.dll")] static extern void DeleteProcThreadAttributeList(IntPtr list);
 [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern bool CreateProcess(string app,StringBuilder command,IntPtr processSecurity,IntPtr threadSecurity,bool inherit,uint flags,IntPtr environment,string directory,ref STARTUPINFOEX startup,out PROCESS_INFORMATION process);
 [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] static extern IntPtr CreateJobObject(IntPtr attributes,string name);
 [DllImport("kernel32.dll",SetLastError=true)] static extern bool SetInformationJobObject(IntPtr job,int kind,ref EXTENDED_LIMIT value,uint bytes);
 [DllImport("kernel32.dll",SetLastError=true)] static extern bool QueryInformationJobObject(IntPtr job,int kind,ref EXTENDED_LIMIT value,uint bytes,out uint returned);
 [DllImport("kernel32.dll",EntryPoint="QueryInformationJobObject",SetLastError=true)] static extern bool QueryJobAccounting(IntPtr job,int kind,ref BASIC_ACCOUNTING value,uint bytes,out uint returned);
 [DllImport("kernel32.dll",SetLastError=true)] static extern bool AssignProcessToJobObject(IntPtr job,IntPtr process);
 [DllImport("kernel32.dll")] static extern bool TerminateJobObject(IntPtr job,uint code);
 [DllImport("kernel32.dll")] static extern bool TerminateProcess(IntPtr process,uint code);
 [DllImport("kernel32.dll",SetLastError=true)] static extern uint ResumeThread(IntPtr thread);
 [DllImport("kernel32.dll")] static extern uint WaitForSingleObject(IntPtr handle,uint milliseconds);
 [DllImport("kernel32.dll")] static extern bool GetExitCodeProcess(IntPtr process,out uint code);
 [DllImport("kernel32.dll")] static extern bool CloseHandle(IntPtr handle);
 [DllImport("kernel32.dll")] static extern IntPtr GetStdHandle(int kind);
 [DllImport("kernel32.dll",SetLastError=true)] static extern bool SetHandleInformation(IntPtr handle,uint mask,uint flags);
 static void Check(bool okay,string stage) { if(!okay)throw new Win32Exception(Marshal.GetLastWin32Error(),stage); }
 static string Quote(string value) { return "\""+value.Replace("\"","\\\"")+"\""; }
 static void Grant(string directory,SecurityIdentifier sid,FileSystemRights rights) {
  var access=Directory.GetAccessControl(directory);
  access.AddAccessRule(new FileSystemAccessRule(sid,rights,InheritanceFlags.ContainerInherit|InheritanceFlags.ObjectInherit,PropagationFlags.None,AccessControlType.Allow));
  Directory.SetAccessControl(directory,access);
 }
 public static int Main(string[] args) {
  if(args.Length==2&&args[0]=="cleanup"&&args[1].StartsWith("cocreate.isolation.",StringComparison.Ordinal)) { DeleteAppContainerProfile(args[1]);return 0; }
  IntPtr sid=IntPtr.Zero,job=IntPtr.Zero,attributes=IntPtr.Zero,capsPtr=IntPtr.Zero,handlesPtr=IntPtr.Zero,env=IntPtr.Zero;
  PROCESS_INFORMATION process=new PROCESS_INFORMATION(); string profile=null;bool created=false;
  try {
   bool browser=args.Length==7&&args[5]=="browser";
   if(args.Length!=6&&!browser)throw new ArgumentException("Invalid launcher request.");
   string runtime=Path.GetFullPath(args[0]),workspace=Path.GetFullPath(args[1]);
   profile=args[2];int parentId=int.Parse(args[3]),timeout=int.Parse(args[4]);bool permission=args[5]=="restricted";
   if(!profile.StartsWith("cocreate.isolation.",StringComparison.Ordinal)||timeout<10||timeout>20000||Path.GetFileName(workspace).Length!=36)throw new ArgumentException("Invalid isolation bounds.");
   var parent=Process.GetProcessById(parentId);DateTime parentStarted=parent.StartTime;
   int hr=CreateAppContainerProfile(profile,profile,"Disposable CoCreate compiler",IntPtr.Zero,0,out sid);
   if(hr!=0)Marshal.ThrowExceptionForHR(hr);created=true;
   Grant(runtime,new SecurityIdentifier("S-1-15-2-1"),FileSystemRights.ReadAndExecute);
   Grant(workspace,new SecurityIdentifier(sid),FileSystemRights.ReadAndExecute);
   string browserProfile=Path.Combine(workspace,"browser-profile");
   if(browser){Directory.CreateDirectory(browserProfile);Grant(browserProfile,new SecurityIdentifier(sid),FileSystemRights.Modify);}
   job=CreateJobObject(IntPtr.Zero,null);Check(job!=IntPtr.Zero,"job create");
   EXTENDED_LIMIT limit=new EXTENDED_LIMIT();
   limit.basic.flags=0x2000|0x8|0x100|0x200|0x4|0x400; // Kill on close, one process, memory, CPU, no exception dialogs.
   limit.basic.active=1;limit.basic.jobTime=10L*10000000;limit.processMemory=new UIntPtr(512UL*1024*1024);limit.jobMemory=limit.processMemory;
   Check(SetInformationJobObject(job,9,ref limit,(uint)Marshal.SizeOf(typeof(EXTENDED_LIMIT))),"job limits");
   IntPtr size=IntPtr.Zero;InitializeProcThreadAttributeList(IntPtr.Zero,2,0,ref size);
   attributes=Marshal.AllocHGlobal(size);Check(InitializeProcThreadAttributeList(attributes,2,0,ref size),"attribute list");
   SECURITY_CAPABILITIES caps=new SECURITY_CAPABILITIES();caps.Sid=sid;
   capsPtr=Marshal.AllocHGlobal(Marshal.SizeOf(typeof(SECURITY_CAPABILITIES)));Marshal.StructureToPtr(caps,capsPtr,false);
   Check(UpdateProcThreadAttribute(attributes,0,new IntPtr(0x20009),capsPtr,new IntPtr(Marshal.SizeOf(typeof(SECURITY_CAPABILITIES))),IntPtr.Zero,IntPtr.Zero),"AppContainer capabilities");
   STARTUPINFOEX startup=new STARTUPINFOEX();startup.info.cb=(uint)Marshal.SizeOf(typeof(STARTUPINFOEX));startup.info.flags=0x100;startup.attributes=attributes;
   startup.info.input=GetStdHandle(-10);startup.info.output=GetStdHandle(-11);startup.info.error=GetStdHandle(-12);
   IntPtr[] handles={startup.info.input,startup.info.output,startup.info.error};
   foreach(IntPtr handle in handles)Check(SetHandleInformation(handle,1,1),"stdio handles");
   handlesPtr=Marshal.AllocHGlobal(IntPtr.Size*3);for(int i=0;i<3;i++)Marshal.WriteIntPtr(handlesPtr,i*IntPtr.Size,handles[i]);
   Check(UpdateProcThreadAttribute(attributes,0,new IntPtr(0x20002),handlesPtr,new IntPtr(IntPtr.Size*3),IntPtr.Zero,IntPtr.Zero),"handle allowlist");
   // Rebuild environment rather than inheriting provider/deployment secrets or Node injection flags.
   env=Marshal.StringToHGlobalUni("APPDATA="+Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData)+"\0LOCALAPPDATA="+Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)+"\0NODE_ENV=production\0SystemRoot="+Environment.GetFolderPath(Environment.SpecialFolder.Windows)+"\0USERPROFILE="+Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)+"\0UV_THREADPOOL_SIZE=1\0\0");
   string node=Path.Combine(runtime,"node.exe"),worker=Path.Combine(runtime,"worker.cjs"),input=Path.Combine(workspace,"input.json");
   var command=new StringBuilder(Quote(node)+" --preserve-symlinks --preserve-symlinks-main --wasm-lazy-compilation --max-old-space-size=128 --disable-wasm-trap-handler "+(permission?"--permission "+Quote("--allow-fs-read="+runtime)+" "+Quote("--allow-fs-read="+workspace)+" ":"")+Quote(worker)+" "+Quote(input)+" "+Quote(runtime));
   if(browser){
    node=Path.GetFullPath(args[6]);if(!File.Exists(node)||(Path.GetFileName(node)!="chrome.exe"&&Path.GetFileName(node)!="chrome-headless-shell.exe"))throw new ArgumentException("Browser runtime unavailable.");
    string browserCache=Path.Combine(Directory.GetParent(Directory.GetParent(runtime).FullName).FullName,"browser")+Path.DirectorySeparatorChar;
    if(node.StartsWith(browserCache,StringComparison.OrdinalIgnoreCase))Grant(Path.GetDirectoryName(node),new SecurityIdentifier("S-1-15-2-1"),FileSystemRights.ReadAndExecute);
    command=new StringBuilder(Quote(node)+" --headless=new --single-process --no-sandbox --no-zygote --disable-gpu --in-process-gpu --disable-breakpad --disable-crash-reporter --disable-crashpad-for-testing --disable-background-networking --disable-component-update --disable-sync --no-first-run --no-default-browser-check --disk-cache-size=1 --media-cache-size=1 --remote-debugging-pipe --remote-debugging-io-pipes="+startup.info.input.ToInt64()+","+startup.info.output.ToInt64()+" "+Quote("--user-data-dir="+browserProfile)+" about:blank");
    Marshal.FreeHGlobal(env);env=Marshal.StringToHGlobalUni("APPDATA="+browserProfile+"\0LOCALAPPDATA="+browserProfile+"\0SystemRoot="+Environment.GetFolderPath(Environment.SpecialFolder.Windows)+"\0TEMP="+browserProfile+"\0TMP="+browserProfile+"\0USERPROFILE="+browserProfile+"\0\0");
   }
   Check(CreateProcess(node,command,IntPtr.Zero,IntPtr.Zero,true,0x4|0x80000|0x400|0x8000000,env,workspace,ref startup,out process),"AppContainer process");
   Check(AssignProcessToJobObject(job,process.process),"job assignment");
   Check(ResumeThread(process.thread)!=0xffffffff,"resume");
   Console.Error.WriteLine("ISOLATION_STARTED "+process.pid+" "+profile);
   var clock=Stopwatch.StartNew();
   while(WaitForSingleObject(process.process,25)==0x102) {
    if(File.Exists(Path.Combine(workspace,"cancel"))) {TerminateJobObject(job,1223);return 122;}
    if(clock.ElapsedMilliseconds>timeout) {TerminateJobObject(job,1460);return 124;}
    if(parent.HasExited||parent.StartTime!=parentStarted) {TerminateJobObject(job,1223);return 122;}
   }
   uint code;Check(GetExitCodeProcess(process.process,out code),"exit status");
   EXTENDED_LIMIT observed=new EXTENDED_LIMIT();uint observedBytes;
   if(QueryInformationJobObject(job,9,ref observed,(uint)Marshal.SizeOf(typeof(EXTENDED_LIMIT)),out observedBytes))Console.Error.WriteLine("ISOLATION_PEAK_BYTES "+observed.peakProcess+" "+observed.peakJob);
   BASIC_ACCOUNTING accounting=new BASIC_ACCOUNTING();
   if(QueryJobAccounting(job,1,ref accounting,(uint)Marshal.SizeOf(typeof(BASIC_ACCOUNTING)),out observedBytes))Console.Error.WriteLine("ISOLATION_ACCOUNTING "+accounting.userTime+" "+accounting.kernelTime+" "+accounting.processes+" "+accounting.terminatedProcesses+" "+clock.ElapsedMilliseconds);
   if(code!=0)Console.Error.WriteLine("ISOLATION_EXIT "+code);return code==0?0:125;
  } catch(Exception error) {Console.Error.WriteLine("ISOLATION_UNAVAILABLE "+error.Message+" code="+(error is Win32Exception?((Win32Exception)error).NativeErrorCode:error.HResult));return 126;}
  finally {
   if(job!=IntPtr.Zero){TerminateJobObject(job,1223);CloseHandle(job);}
   if(process.process!=IntPtr.Zero){TerminateProcess(process.process,1223);WaitForSingleObject(process.process,1000);CloseHandle(process.process);}
   if(process.thread!=IntPtr.Zero)CloseHandle(process.thread);
   if(attributes!=IntPtr.Zero){DeleteProcThreadAttributeList(attributes);Marshal.FreeHGlobal(attributes);}
   if(capsPtr!=IntPtr.Zero)Marshal.FreeHGlobal(capsPtr);if(handlesPtr!=IntPtr.Zero)Marshal.FreeHGlobal(handlesPtr);if(env!=IntPtr.Zero)Marshal.FreeHGlobal(env);
   if(created)DeleteAppContainerProfile(profile);if(sid!=IntPtr.Zero)FreeSid(sid);
  }
 }
}
