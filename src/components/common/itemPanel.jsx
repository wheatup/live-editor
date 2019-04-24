import React, { Component } from 'react';

const ItemPanel = ({ item, rotation, onChangeSize, onChangeRotation }) => {
	return (
		<div className="item-panel">
			<div className="item-panel--item">
				<i className="icon-font-size"></i>
				<input type="range" min="1" max="10" step="0.1" value={item.scale} onChange={onChangeSize} class="item-panel--item--size"></input>
			</div>
			<div className="item-panel--item">
				<i className="icon-spinner"></i>
				<input type="range" min="0" max="360" step="1" value={rotation} onChange={onChangeRotation} class="item-panel--item--size"></input>
			</div>
		</div>
	);
}

export default ItemPanel;