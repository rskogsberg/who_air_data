import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App style = {{ overlfow: 'auto' }}/>
  </React.StrictMode>,
  document.getElementById('root')
);
