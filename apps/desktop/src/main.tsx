import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { injectCssVariables } from './theme/css-variables';

injectCssVariables();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
