import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import "./fonts/arial.ttf";
import "./fonts/georgia.ttf";
import "./fonts/merriweather.ttf";
import "./fonts/open_sans.ttf";
import "./fonts/poppins.ttf";
import "./fonts/roboto.ttf";
import "./fonts/source_serif_pro.ttf";
import "./fonts/times.ttf";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
