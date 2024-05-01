import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import { App } from './app/app';

axios.defaults.baseURL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//${window.location.host}/api`
    : 'http://localhost:3001/api';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
