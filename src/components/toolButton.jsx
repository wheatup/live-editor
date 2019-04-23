import React, { Component } from 'react';
import IconButton from './common/iconButton';

const ToolButton = ({ active, className, ...rest}) => {
	return <IconButton className={(className || '') + (active ? ' active' : '')} {...rest} />;
}

export default ToolButton;