import React, { Component } from 'react';

export default class IconButton extends Component {
	state = {}
	render() {
		const { icon, className, ...rest } = this.props;
		return (
			<a className={'icon-button' + (className || '')} {...rest} href="javascript:void(0)">
				<i className={icon} ></i>
			</a>
		);
	}
}