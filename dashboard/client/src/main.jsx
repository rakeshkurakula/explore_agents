import React from 'react';
import ReactDOM from 'react-dom/client';
import { TradeUpdates, DerivativesMastery } from './index.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="p-4 space-y-8">
      <TradeUpdates />
      <DerivativesMastery />
    </div>
  </React.StrictMode>
);
