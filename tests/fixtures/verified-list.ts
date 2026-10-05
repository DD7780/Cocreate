// Controlled product used by integration fixtures that request covered list behavior.
export const verifiedList = `import {useState} from 'react';
export default function App(){
  const [query,setQuery]=useState(''),[favorite,setFavorite]=useState(false),[sorted,setSorted]=useState(false);
  const names=sorted?['Apple','Banana','Cherry']:['Cherry','Apple','Banana'];
  return <main><h1>Catalog</h1><label>Search <input aria-label="Search" value={query} onChange={e=>setQuery(e.target.value)}/></label>
    <button aria-label="Favorite Apple" aria-pressed={favorite} onClick={()=>setFavorite(!favorite)}>Favorite Apple</button>
    <button aria-label="Sort by name" onClick={()=>setSorted(!sorted)}>Sort by name</button>
    <ul>{names.filter(name=>name.toLowerCase().includes(query.toLowerCase())).map(name=><li key={name}><h2>{name}</h2></li>)}</ul>
  </main>;
}`;
