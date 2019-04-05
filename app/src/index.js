import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const serverURL = process.env.NODE_ENV === 'production' ? 'https://image-color-profiler.herokuapp.com' : 'http://localhost:4000'

ReactDOM.render(<App serverUrl={serverURL}/>, document.getElementById('root'));