import React, { Component } from 'react';
import Canvas from './components/canvas';
import Toolbar from './components/toolbar';
import Tip from './components/tip';
import Div100vh from 'react-div-100vh';

export default class App extends Component {
	state = {}
	render() {
		return (
			<Div100vh>
				<main className="app">
					<Canvas />
					<Toolbar />
				</main>
				<Tip />
			</Div100vh>
		);
	}
}