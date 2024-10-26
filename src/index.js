import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Main component
import './index.css'; // Global styles

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
