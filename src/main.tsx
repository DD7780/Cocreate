import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { clientAuthMode } from './supabase';
import './styles.css';
const App=lazy(()=>import('./App').then(module=>({default:module.App})));
const ProjectApp=lazy(()=>import('./ProjectApp').then(module=>({default:module.ProjectApp})));
createRoot(document.getElementById('root')!).render(<React.StrictMode><Suspense fallback={<main className="project-loading">Opening CoCreate…</main>}>{clientAuthMode==='supabase'?<ProjectApp/>:<App/>}</Suspense></React.StrictMode>);
