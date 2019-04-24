import React, { Component } from 'react';
import SliderPicker from 'react-color';
import { i18n } from '../core/i18n';
import globalState from '../core/globalState';
import whevent from 'whevent';
import ItemPanel from './common/itemPanel';

let UUID = 0, lastX = -1, lastY = -1;

export default class Canvas extends Component {
	state = {
		selecting: null,
		dragging: null,
		background: '#fff',
		showBackgroundColorPicker: false,
		items: [
			{ type: 'text', content: i18n('tool.insert_text'), color: '#37f', id: ++UUID, scale: 3, rotation: 0, x: 0, y: 100 }
		]
	}

	componentWillMount() {
		let items = [];
		let background = '#fff';
		let canvas = localStorage.getItem('canvas');
		if (canvas) {
			items = JSON.parse(canvas);
			let maxIndex = 0;
			items.forEach(i => {
				if (i.id > maxIndex) {
					maxIndex = i.id;
				}
			});
			UUID = maxIndex;
		}
		let b = localStorage.getItem('background');
		if (b) {
			background = b;
		}
		this.setState({ items, background });
		this.canvas = React.createRef;
		whevent.bind('TOOL', this.onSelectTool, this);
	}

	onSelectTool({ tool }) {
		let showBackgroundColorPicker = tool === 'BACKGROUND';
		if (tool === 'DELETE') {
			if (this.state.selecting) {
				this.setState({ items: this.state.items.filter(i => i !== this.state.selecting) });
				this.saveWork();
			}
			whevent.call('SELECT_TOOL', { tool: null });
		}
		this.setState({ showBackgroundColorPicker });
	}

	saveWork() {
		setTimeout(() => {
			localStorage.setItem('canvas', JSON.stringify(this.state.items));
			localStorage.setItem('background', this.state.background);
		}, 50);

	}

	onSaveContent = ({ currentTarget }) => {
		let id = currentTarget.getAttribute('data-id');
		let item = this.state.items.find(i => i.id == id);
		if (item) {
			item.content = currentTarget.innerHTML;
			if (item.content === null || item.content.trim() === '') {
				this.setState({ items: this.state.items.filter(i => i !== item) });
			} else {
				this.setState({ items: [...this.state.items] });
			}
			this.saveWork();
		}
	}

	onMouseDown = e => {
		if (e.touches) {
			lastX = e.touches[0].clientX;
			lastY = e.touches[0].clientY;
		} else {
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

		if (globalState.currentTool === 'BACKGROUND') {
			whevent.call('SELECT_TOOL', { tool: null });
		}
	}

	onMouseMove = e => {
		// e.preventDefault();
		if (!this.state.dragging) return;
		let movementX = 0, movementY = 0, thisX = 0, thisY = 0;
		if (e.touches) {
			thisX = e.touches[0].clientX;
			thisY = e.touches[0].clientY;
		} else {
			thisX = e.clientX;
			thisY = e.clientY;
		}

		if (lastX >= 0 && lastY >= 0) {
			movementX = thisX - lastX;
			movementY = thisY - lastY;
		}

		lastX = thisX;
		lastY = thisY;

		if (this.state.dragging) {
			this.state.dragging.x += movementX;
			this.state.dragging.y += movementY;
			this.setState({ items: [...this.state.items] });
			this.saveWork();
		}
	}

	onMouseUp = e => {
		// e.stopPropagation();
		this.setState({ dragging: null })
	}

	onClickBlank = e => {
		if (globalState.currentTool === 'TEXT') {
			let { clientX: rawX, clientY: rawY } = e;
			if (globalState.currentTool === 'TEXT') {
				const item = { type: 'text', content: i18n('tool.insert_text'), color: '#37f', id: ++UUID, scale: 3, rotation: 0, x: rawX - e.currentTarget.clientWidth * 0.5, y: rawY };
				whevent.call('SELECT_TOOL', { tool: null });
				this.setState({ selecting: item, items: [...this.state.items, item] });
				this.saveWork();
			}
		} else {
			this.setState({ selecting: null });
		}

		if (globalState.currentTool === 'BACKGROUND') {
			whevent.call('SELECT_TOOL', { tool: null });
		}
	}

	onChangeColor = e => {
		if (this.state.selecting) {
			this.state.selecting.color = e.hex;
			this.setState({ items: [...this.state.items] });
			this.saveWork();
		}
	}

	onChangeBackgroundColor = e => {
		this.setState({ background: e.hex });
		this.saveWork();
	}

	onChangeSize = e => {
		if (this.state.selecting) {
			this.state.selecting.scale = e.target.value;
			this.setState({ items: [...this.state.items] });
			this.saveWork();
		}
	}

	render() {
		const { selecting } = this.state;
		return (
			<section onMouseUp={this.onMouseUp} onTouchEnd={this.onMouseUp} onMouseMove={this.onMouseMove} onTouchMove={this.onMouseMove} className="canvas">
				<div onClick={this.onClickBlank} className="canvas--background" style={{ backgroundColor: this.state.background }}></div>
				{this.state.items.map((item, index) => {
					const { type, content, color, id, scale, x, y, ...rest } = item;
					switch (type) {
						case 'text':
							return <React.Fragment>
								<div
									key={`item_${index}`}
									data-id={item.id}
									className={'item' + (selecting === item ? ' active' : '')}
									onBlur={this.onSaveContent}

									onMouseDown={this.onMouseDown}
									onTouchStart={this.onMouseDown}

									contentEditable={selecting === item}
									style={{
										transform: `translate(${x}px, ${y}px) scale(${scale})`,
										color
									}}
									{...rest}
								>
									{content}
								</div>
								{selecting === item && <div
									className="color-picker-container"
									style={{ transform: `translate(${x}px, calc(${y > window.innerHeight / 2 ? '-100%' : '0%'} + ${y + (y > window.innerHeight / 2 ? -10 : 15) * item.scale}px))` }}>
									<SliderPicker color={item.color} onChangeComplete={this.onChangeColor} />
									<ItemPanel item={item} onChangeSize={this.onChangeSize} />
								</div>}
							</React.Fragment>;
					}
				})}
				{this.state.showBackgroundColorPicker &&
					<div class="color-picker-background-container">
						<SliderPicker color={this.state.background} onChangeComplete={this.onChangeBackgroundColor} />
					</div>
				}
			</section>
		);
	}
}