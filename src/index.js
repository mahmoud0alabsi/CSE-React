import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StyledEngineProvider } from '@mui/material/styles';
import "@fontsource/inter";
import './index.css';
import AppTheme from './theme/AppTheme';


// if (!document.documentElement.classList.contains('dark')) {
//   document.documentElement.classList.add('dark');
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <AppTheme >
        <App />
      </AppTheme>
    </StyledEngineProvider>
  </React.StrictMode>
);

reportWebVitals();
