import React from 'react';
import ReactDOM from 'react-dom';
import './scss/style.scss';
import App from './app';
import config from './core/config';
import i18n from './core/i18n';

async function start() {
	await config.init();
	await i18n.init();
	const root = document.createElement('div');
	root.classList.add('live-editor');
	document.body.appendChild(root);
	ReactDOM.render(<App />, root);

	var target = window; // this can be any scrollable element
	var last_y = 0;
	target.addEventListener('touchmove', function (e) {
		var scrolly = target.pageYOffset || target.scrollTop || 0;
		var direction = e.changedTouches[0].pageY > last_y ? 1 : -1;
		if (direction > 0 && scrolly === 0) {
			e.preventDefault();
		}
		last_y = e.changedTouches[0].pageY;
	});
}

start();