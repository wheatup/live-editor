import React, { Component } from 'react';
import Canvas from './components/canvas';
import Toolbar from './components/toolbar';
import Tip from './components/tip';

export default class App extends Component {
	state = {}
	render() {
		return (
			<React.Fragment>
				<main className="app">
					<Canvas />
					<Toolbar />
				</main>
				<Tip />
			</React.Fragment>
		);
	}
}