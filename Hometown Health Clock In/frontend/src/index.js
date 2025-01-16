import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ActiveProvider } from './Context/ActiveContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ActiveProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </ActiveProvider>
);
