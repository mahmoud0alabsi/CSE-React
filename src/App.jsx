import React from 'react';
import { CssBaseline } from '@mui/material';
import AppTheme from "./theme/AppTheme";
import AppRoutes from './routes/AppRoutes';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './state_managment/store';
import GlobalLoadingSpinner from './components/GlobalLoadingSpinner';

function App() {
  return (
    <>
      <Provider store={store}>
        <CssBaseline />
        <GlobalLoadingSpinner />
        <AppRoutes />
      </Provider>
    </>
  );
}

export default App;
