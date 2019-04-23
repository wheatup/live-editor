import React from 'react';
import ReactDOM from 'react-dom';
import './scss/style.scss';
import App from './app';
import config from './core/config';
import i18n from './core/i18n';

async function start(){
	await config.init();
	await i18n.init();
	const root = document.createElement('div');
	root.classList.add('live-editor');
	document.body.appendChild(root);
	ReactDOM.render(<App />, root);
}

start();