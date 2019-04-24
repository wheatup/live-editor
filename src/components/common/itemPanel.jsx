import React, { Component } from 'react';

const ItemPanel = ({item, onChangeSize}) => {
	return (
	<div className="item-panel">
		<input type="range" min="1" max="10" step="0.1" value={item.scale} onChange={onChangeSize} class="item-panel--size"></input>
	</div>
	);
}

export default ItemPanel;