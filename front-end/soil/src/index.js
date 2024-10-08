import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Main from './Main';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import StoreContextProvider from './Components/StoreContext'; // Import the StoreContextProvider

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <StoreContextProvider>
        <Main />
      </StoreContextProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
