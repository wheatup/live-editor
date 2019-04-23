import React, { Component } from 'react';
import { i18n } from '../core/i18n';
import globalState from '../core/globalState';
import whevent from 'whevent';

let UUID = 0, lastX = -1, lastY = -1;

export default class Canvas extends Component {
	state = {
		selecting: null,
		dragging: null,
		items: [
			{ type: 'text', content: i18n('tool.insert_text'), color: '#37f', id: ++UUID, scale: 3, rotation: 0, x: 0, y: 100 }
		]
	}

	onSaveContent = ({ currentTarget }) => {
		let id = currentTarget.getAttribute('data-id');
		let item = this.state.items.find(i => i.id == id);
		if (item) {
			item.content = currentTarget.innerHTML;
			if (item.content === null || item.content.trim() === '') {
				this.setState({ items: this.state.items.filter(i => i !== item) })
			} else {
				this.setState({ items: [...this.state.items] })
			}
		}
	}

	onMouseDown = (e) => {
		if(e.touches){
			lastX = e.touches[0].clientX;
			lastY = e.touches[0].clientY;
		}else{
			lastX = e.clientX;
			lastY = e.clientY;
		}
		let id = e.currentTarget.getAttribute('data-id');
		if (id !== undefined && id !== null) {
			let item = this.state.items.find(i => i.id == id);
			if (item) {
				this.setState({ dragging: item, selecting: item });
			}
		}
	}

	onMouseMove = (e) => {
		e.preventDefault();
		if (!this.state.dragging) return;
		let movementX = 0, movementY = 0, thisX = 0, thisY = 0;
		if(e.touches){
			thisX = e.touches[0].clientX;
			thisY = e.touches[0].clientY;
		}else{
			thisX = e.clientX;
			thisY = e.clientY;
		}

		if(lastX >= 0 && lastY >= 0){
			movementX = thisX - lastX ;
			movementY = thisY - lastY;
		}

		lastX = thisX;
		lastY = thisY;

		if (this.state.dragging) {
			this.state.dragging.x += movementX;
			this.state.dragging.y += movementY;
			this.setState({ items: [...this.state.items] })
		}
	}

	onMouseUp = (e) => {
		e.stopPropagation();
		this.setState({ dragging: null })
	}

	onClickItem = (e) => {
		e.stopPropagation();
	}

	onClickBlank = (e) => {
		if (globalState.currentTool) {
			let { clientX: rawX, clientY: rawY } = e;
			if (globalState.currentTool === 'TEXT') {
				const item = { type: 'text', content: i18n('tool.insert_text'), color: '#37f', id: ++UUID, scale: 3, rotation: 0, x: rawX - e.currentTarget.clientWidth * 0.5, y: rawY };
				whevent.call('SELECT_TOOL', { tool: null });
				this.setState({ selecting: item, items: [...this.state.items, item] });
			}
		} else {
			this.setState({ selecting: null });
		}
	}

	render() {
		const { selecting } = this.state;
		return (
			<section onClick={this.onClickBlank} onMouseUp={this.onMouseUp} onTouchEnd={this.onMouseUp} onMouseMove={this.onMouseMove} onTouchMove={this.onMouseMove} className="canvas">{this.state.items.map((item, index) => {
				const { type, content, color, id, scale, x, y, ...rest } = item;
				switch (type) {
					case 'text':
						return <div
							key={`item_${index}`}
							data-id={item.id}
							className={'item' + (selecting === item ? ' active' : '')}
							onBlur={this.onSaveContent}

							onMouseDown={this.onMouseDown}
							onTouchStart={this.onMouseDown}

							onClick={this.onClickItem}
							contentEditable={selecting === item}
							style={{
								transform: `translate(${x}px, ${y}px) scale(${scale})`,
								color
							}}
							{...rest}
						>
							{content}
						</div>;
				}
			})}</section>
		);
	}
}