import React, { Component } from 'react';

import whevent from 'whevent';

export default class Tip extends Component {
	state = {
		text: null,
		duration: 1000
	}

	constructor(props) {
		super(props);
		this.tip = React.createRef();
		console.log(this.tip);
	}
	
	componentDidMount() {
		whevent.bind('TIP', this.onTip, this);
	}

	onTip({ text, duration }) {
		this.tip.current.classList.remove('anim-fade-out');
		setTimeout(()=>this.tip.current.classList.add('anim-fade-out'), 0);
		this.setState({ text, duration: duration || 1500 });
	}

	render() {
		const { text, duration } = this.state;
		return (
			<div style={{ animationDuration: `${duration}ms` }} ref={this.tip} className="tip">
				<span className="text">{text}</span>
			</div>
		);
	}
}