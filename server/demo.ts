import type { ProductSource, Requirement } from '../src/types.js';
import type { AgentChange } from './generator.js';

const clean = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500);

export function demoExtract(participantId: string, participantName: string, changes: AgentChange[], context: string, previous: Requirement | undefined, revision: number): Requirement {
  const text = clean(changes.map(change=>change.after).join(' ') || context);
  const lower = text.toLowerCase();
  const features: string[] = [];
  if (/task|todo|checklist/.test(lower)) features.push('Add and complete tasks');
  if (/vot|poll|choice/.test(lower)) features.push('Create choices and record votes');
  if (/board|column|kanban/.test(lower)) features.push('Organize items in a visual board');
  if (/search|filter/.test(lower)) features.push('Search and filter the working set');
  if (!features.length) features.push(text ? `Turn this idea into an interactive flow: ${text.slice(0, 120)}` : 'Provide a clear interactive starting point');
  const design = [/(dark|night)/.test(lower) ? 'Use a dark interface' : /(bright|colorful)/.test(lower) ? 'Use an energetic color palette' : 'Keep the interface calm and focused'];
  const constraints = /mobile|phone|responsive/.test(lower) ? ['Work well on small screens'] : ['Keep the first version frontend-only'];
  const deleting=changes.some(change=>change.kind==='delete');
  const withdrawals=deleting?(previous?.features||[]).filter(feature=>!context.toLowerCase().includes(feature.toLowerCase().split(' ')[0])):[];
  const retained=(previous?.features||[]).filter(feature=>!withdrawals.includes(feature));
  const mergedFeatures=[...new Set([...retained,...features])];
  return { id: crypto.randomUUID(), participantId, participantName, goals: text?[text]:(previous?.goals||['Shape the team’s shared idea']), features:mergedFeatures, design, constraints, questions: [], additions:features.filter(x=>!previous?.features.includes(x)), modifications:[], withdrawals, revision, createdAt: new Date().toISOString() };
}

const shell = (title: string, body: string) => `export default function App(){const React=globalThis.React;${body}}`;

export function demoOrchestrate(requirements: Requirement[]): ProductSource {
  const text = requirements.flatMap(r => [...r.goals, ...r.features, ...r.design, ...r.constraints]).join(' ').toLowerCase();
  const dark = text.includes('dark interface');
  const baseCss = `*{box-sizing:border-box}body{margin:0;font-family:Inter,ui-sans-serif,system-ui;background:${dark ? '#10131f' : '#f5f7fb'};color:${dark ? '#f7f8ff' : '#172033'}}button,input{font:inherit}.app{min-height:100vh;padding:36px;max-width:960px;margin:auto}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.14em;color:#6573d8;font-weight:800}h1{font-size:clamp(32px,5vw,56px);margin:8px 0 24px;letter-spacing:-.045em}.card{background:${dark ? '#191e2f' : '#fff'};border:1px solid ${dark ? '#2a324a' : '#e2e6f0'};border-radius:18px;padding:18px;box-shadow:0 16px 50px #10172a12}.row{display:flex;gap:10px}.row input{flex:1;border:1px solid #ccd2e2;border-radius:10px;padding:12px;background:transparent;color:inherit}button{border:0;border-radius:10px;padding:11px 15px;background:#5365d8;color:white;font-weight:750;cursor:pointer}.muted{color:#768097}.item{display:flex;justify-content:space-between;align-items:center;padding:13px 2px;border-bottom:1px solid ${dark ? '#2a324a' : '#edf0f6'}}`;
  if (/vot|poll|choice/.test(text)) return {
    app: shell('Team poll', `const [votes,setVotes]=React.useState([0,0,0]);const options=['Build the prototype','Interview users','Refine the brief'];return <main className="app"><div className="eyebrow">Shared decision</div><h1>What should we do next?</h1><section className="card">{options.map((o,i)=><div className="item" key={o}><div><strong>{o}</strong><div className="muted">{votes[i]} votes</div></div><button onClick={()=>setVotes(v=>v.map((n,j)=>j===i?n+1:n))}>Vote</button></div>)}</section></main>`), css: baseCss, summary: 'Built a shared voting app from the team’s ideas.', decisions: ['Used three editable decision paths for a fast first version'], conflicts: [] };
  if (/board|column|kanban/.test(text)) return {
    app: shell('Idea board', `const [cards,setCards]=React.useState(['Clarify the audience','Sketch the first flow']);const [value,setValue]=React.useState('');return <main className="app"><div className="eyebrow">Team board</div><h1>Ideas in motion</h1><section className="card"><form className="row" onSubmit={e=>{e.preventDefault();if(value.trim()){setCards([...cards,value]);setValue('')}}}><input value={value} onChange={e=>setValue(e.target.value)} placeholder="Add an idea…"/><button>Add card</button></form>{cards.map((c,i)=><div className="item" key={i}><strong>{c}</strong><button onClick={()=>setCards(cards.filter((_,j)=>j!==i))}>Done</button></div>)}</section></main>`), css: baseCss, summary: 'Built an interactive idea board.', decisions: ['Started with one focused column so the team can validate the workflow'], conflicts: [] };
  return {
    app: shell('Shared checklist', `const [items,setItems]=React.useState([{t:'Turn the shared idea into a prototype',done:false},{t:'Invite another perspective',done:false}]);const [value,setValue]=React.useState('');return <main className="app"><div className="eyebrow">Co-created prototype</div><h1>Shape the idea together.</h1><section className="card"><form className="row" onSubmit={e=>{e.preventDefault();if(value.trim()){setItems([...items,{t:value,done:false}]);setValue('')}}}><input value={value} onChange={e=>setValue(e.target.value)} placeholder="Add to the shared idea…"/><button>Add</button></form>{items.map((x,i)=><label className="item" key={i}><span style={{textDecoration:x.done?'line-through':'none'}}>{x.t}</span><input type="checkbox" checked={x.done} onChange={()=>setItems(items.map((v,j)=>j===i?{...v,done:!v.done}:v))}/></label>)}</section></main>`), css: baseCss, summary: 'Combined the team’s current brainstorm into a working prototype.', decisions: ['Used a focused single-page React app', 'Kept all data inside the isolated preview'], conflicts: [] };
}
