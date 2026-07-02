import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove the import from virtual:pwa-register to avoid breaking build in some envs if not fully supported,
// or use the standard vite-plugin-pwa setup if requested.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
