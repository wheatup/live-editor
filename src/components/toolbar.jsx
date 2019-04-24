import React, { Component } from 'react';
import ToolButton from './toolButton';
import whevent from 'whevent';

import { i18n } from '../core/i18n';
import globalState from '../core/globalState';

export default class Toolbar extends Component {

	state = {
		currentTool: null
	}

	componentDidMount() {
		whevent.bind('SELECT_TOOL', this.onClickTool, this);
	}

	onClickTool({ tool, text }) {
		globalState.currentTool = globalState.currentTool === tool ? null : tool;
		if (globalState.currentTool) {
			whevent.call('TOOL', { tool, text });
			whevent.call('TIP', { tool, text });
		}else{
			whevent.call('TOOL', { tool: null, text: null });
		}
		this.setState({ currentTool: globalState.currentTool })
	}

	render() {
		return (
			<section className="toolbar">
				<ToolButton active={this.state.currentTool === 'TEXT'} icon="icon-text-color" onClick={() => this.onClickTool({ tool: 'TEXT', text: i18n('tool.add_text') })} title={i18n('tool.add_text')} />
				<ToolButton active={this.state.currentTool === 'IMAGE'} icon="icon-picture" onClick={() => this.onClickTool({ tool: 'IMAGE', text: i18n('tool.add_image') })} title={i18n('tool.add_image')} />
				<ToolButton active={this.state.currentTool === 'BACKGROUND'} icon="icon-star-empty" onClick={() => this.onClickTool({ tool: 'BACKGROUND', text: i18n('tool.background_color') })} title={i18n('tool.background_color')} />
			</section>
		);
	}
}