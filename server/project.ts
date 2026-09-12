import fs from 'node:fs';
import path from 'node:path';
import posix from 'node:path/posix';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

export type ProjectFile={path:string;content:string};
export type FileOperation={type:'write'|'delete';path:string;content?:string};
export type ProjectSpec={agreed:string[];proposed:string[];questions:string[]};
export type ProjectPlan={operations:FileOperation[];summary:string;decisions:string[];conflicts:string[];specification:ProjectSpec};

const generatedRoot=path.join(process.cwd(),'generated','rooms');
const allowedExtensions=new Set(['.ts','.tsx','.js','.jsx','.css','.json']);
const banned=/\b(fetch|XMLHttpRequest|WebSocket|EventSource|indexedDB|document\.cookie|window\.(parent|top|opener)|eval|Function)\b|\bimport\s*\(/;
const starter:ProjectFile[]=[
  {path:'src/main.tsx',content:"import React from 'react';import{createRoot}from'react-dom/client';import App from'./App';import'./styles.css';createRoot(document.getElementById('root')!).render(<App/>);"},
  {path:'src/App.tsx',content:'export default function App(){return null}'},
  {path:'src/styles.css',content:'*{box-sizing:border-box}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,sans-serif}'},
];

export const infrastructureFiles:ProjectFile[]=[
  {path:'package.json',content:JSON.stringify({name:'cocreate-generated-app',private:true,version:'1.0.0',type:'module',scripts:{dev:'vite',build:'vite build',preview:'vite preview'},dependencies:{'@vitejs/plugin-react':'^5.0.4',vite:'^7.1.12',typescript:'^5.9.3',react:'^19.2.0','react-dom':'^19.2.0'}},null,2)},
  {path:'index.html',content:'<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CoCreate App</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>'},
  {path:'vite.config.ts',content:"import{defineConfig}from'vite';import react from'@vitejs/plugin-react';export default defineConfig({plugins:[react()]})"},
  {path:'README.md',content:'# CoCreate generated app\n\nRequires Node.js 22+. Run `npm install`, then `npm run dev`.\n'},
];

export function validateProjectPath(value:string){const clean=value.replaceAll('\\','/');if(clean!==posix.normalize(clean)||clean.startsWith('/')||clean.startsWith('../')||!clean.startsWith('src/')||!allowedExtensions.has(posix.extname(clean)))throw new Error(`Project operation used an invalid path: ${value}`);return clean}
export function validateFiles(files:ProjectFile[]){if(!files.length||files.length>16)throw new Error('Generated project must contain between 1 and 16 source files.');let total=0;for(const file of files){validateProjectPath(file.path);total+=Buffer.byteLength(file.content);if(Buffer.byteLength(file.content)>40_000)throw new Error(`${file.path} exceeds the per-file size limit.`);if(banned.test(file.content))throw new Error(`${file.path} requested a blocked browser capability.`)}if(total>160_000)throw new Error('Generated project exceeds the source size limit.');if(!files.some(file=>file.path==='src/main.tsx'))throw new Error('Generated project is missing src/main.tsx.');return files}
export function applyOperations(current:ProjectFile[]|undefined,operations:FileOperation[]){const map=new Map((current?.length?current:starter).map(file=>[file.path,file.content]));if(!operations.length||operations.length>20)throw new Error('Builder returned no usable project operations.');for(const operation of operations){const projectPath=validateProjectPath(operation.path);if(operation.type==='delete')map.delete(projectPath);else if(operation.type==='write'&&typeof operation.content==='string')map.set(projectPath,operation.content);else throw new Error(`Invalid project operation for ${projectPath}.`)}return validateFiles([...map].map(([projectPath,content])=>({path:projectPath,content})))}
export function loadProject(roomId:string){const root=path.join(generatedRoot,roomId);if(!fs.existsSync(root))return undefined;const files:ProjectFile[]=[];const walk=(dir:string)=>{for(const item of fs.readdirSync(dir,{withFileTypes:true})){const absolute=path.join(dir,item.name);if(item.isDirectory())walk(absolute);else{const relative=path.relative(root,absolute).replaceAll('\\','/');if(relative.startsWith('src/'))files.push({path:relative,content:fs.readFileSync(absolute,'utf8')})}}};walk(root);return files.length?validateFiles(files):undefined}
export function persistProject(roomId:string,files:ProjectFile[]){const root=path.resolve(generatedRoot,roomId),expected=path.resolve(generatedRoot)+path.sep;if(!root.startsWith(expected))throw new Error('Invalid project directory.');fs.mkdirSync(root,{recursive:true});const keep=new Set(files.map(file=>file.path));for(const old of loadProject(roomId)||[])if(!keep.has(old.path))fs.rmSync(path.join(root,...old.path.split('/')));for(const file of [...infrastructureFiles,...files]){const target=path.resolve(root,...file.path.split('/'));if(!target.startsWith(root+path.sep))throw new Error('Invalid project file target.');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,file.content)}}
export function budgetProjectFiles(files:ProjectFile[]|undefined,budget=70_000){const ordered=[...(files||starter)].sort((a,b)=>{const rank=(p:string)=>p==='src/App.tsx'?0:p==='src/main.tsx'?1:p.endsWith('.css')?2:3;return rank(a.path)-rank(b.path)||a.path.localeCompare(b.path)}),chosen:ProjectFile[]=[];let used=0;for(const file of ordered){const size=Buffer.byteLength(file.path)+Buffer.byteLength(file.content);if(used+size<=budget){chosen.push(file);used+=size}}return{files:chosen,omitted:ordered.filter(file=>!chosen.includes(file)).map(file=>file.path)}}

export async function bundleProject(files:ProjectFile[]){
  validateFiles(files);
  const map=new Map(files.map(file=>[file.path,file.content]));
  const resolveProject=(importer:string,specifier:string)=>{const base=posix.normalize(posix.join(posix.dirname(importer),specifier)),candidates=[base,...['.ts','.tsx','.js','.jsx','.css','.json'].map(ext=>base+ext),...['.ts','.tsx','.js','.jsx'].map(ext=>posix.join(base,'index'+ext))];return candidates.find(candidate=>map.has(candidate))};
  const plugin={name:'cocreate-project',setup(api:any){
    api.onResolve({filter:/.*/},(args:any)=>{
      if(args.kind==='entry-point')return{path:'src/main.tsx',namespace:'project'};
      if(args.namespace==='dependency'){const importer=args.importer&&!args.importer.startsWith('<')?args.importer:import.meta.url;return{path:createRequire(importer).resolve(args.path),namespace:'dependency'}}
      if(args.namespace==='project'&&args.path.startsWith('.')){const resolved=resolveProject(args.importer,args.path);if(!resolved)throw new Error(`Could not resolve ${args.path} from ${args.importer}`);return{path:resolved,namespace:'project'}}
      if(args.path==='react'||args.path==='react-dom/client'||args.path==='react/jsx-runtime')return{path:createRequire(import.meta.url).resolve(args.path),namespace:'dependency'};
      throw new Error(`Dependency is not approved: ${args.path}`)
    });
    api.onLoad({filter:/.*/,namespace:'project'},(args:any)=>({contents:map.get(args.path),loader:posix.extname(args.path).slice(1)||'tsx'}));
    api.onLoad({filter:/.*/,namespace:'dependency'},async(args:any)=>({contents:await readFile(args.path,'utf8'),loader:args.path.endsWith('.json')?'json':'js'}));
  }};
  const result=await build({entryPoints:['entry'],plugins:[plugin],define:{'process.env.NODE_ENV':'"production"'},jsx:'automatic',bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',logLevel:'silent',outdir:'out'}),javascript=result.outputFiles.find(file=>file.path.endsWith('.js'))?.text,css=result.outputFiles.find(file=>file.path.endsWith('.css'))?.text||'';
  if(!javascript)throw new Error('The generated project did not produce a browser bundle.');
  return{javascript,css};
}

export function downloadableFiles(files:ProjectFile[]){return[...infrastructureFiles,...files]}
