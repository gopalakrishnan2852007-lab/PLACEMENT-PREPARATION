import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

window.onerror = function (message, source, lineno, colno, error) {
  console.error("🚨 GLOBAL ERROR INTERCEPTED:", { message, lineno, colno, error });
  return false;
};

window.addEventListener('unhandledrejection', (event) => {
  console.warn("⚠️ UNHANDLED PROMISE REJECTION:", event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
