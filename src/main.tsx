import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('لم يُعثر على عنصر الجذر #root في الصفحة.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
