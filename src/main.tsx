import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ProjectApp } from './ProjectApp';
import { clientAuthMode } from './supabase';
import './styles.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode>{clientAuthMode==='supabase'?<ProjectApp/>:<App/>}</React.StrictMode>);
