import { createRoot } from 'react-dom/client';
import { Routes, Route, HashRouter } from 'react-router';

import './global.css';

import App from './main';

const root = document.getElementById('root');
createRoot(root).render(
  <App/>
);
