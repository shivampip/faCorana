import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

// ReactDOM.render(<App />, document.querySelector('#root'));

document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(<App />, document.getElementById('root'));
});
