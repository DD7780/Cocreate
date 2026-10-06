import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { clientAuthMode } from './supabase';
import './styles.css';
import './studio-ivory.css';
const App=lazy(()=>import('./App').then(module=>({default:module.App})));
const ProjectApp=lazy(()=>import('./ProjectApp').then(module=>({default:module.ProjectApp})));
const LandingPage=lazy(()=>import('./LandingPage').then(module=>({default:module.LandingPage})));
createRoot(document.getElementById('root')!).render(<React.StrictMode><Suspense fallback={<main className="project-loading">Opening 2guys1canvas…</main>}>{location.pathname==='/'?<LandingPage/>:clientAuthMode==='supabase'?<ProjectApp/>:<App/>}</Suspense></React.StrictMode>);
