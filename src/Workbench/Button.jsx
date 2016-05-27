import React from 'react';
import Component from './Component';
import {PropTypes as T} from 'react';


export default class Button extends Component {

	static propTypes = {
		children: T.node,
		onClick: T.func,
	}

	static defaultProps = {
		children: 'Button',
	}

	static style = {
		padding: '.3rem .85rem',
		border: 'solid thin #ddd',
		borderBottomColor: '#bbb',
		borderRadius: '.3rem',
		background: 'white',
	}

	state = {
		hover: false,
		active: false,
	}

	computeStyle() {
		const {hover, active} = this.state;
		const highlighted = active && hover;
		return {
			backgroundColor: highlighted? '#e0e0e0' : 'white',
		};
	}

	render() {
		return (
			<button style={this.style}
				onClick={this.props.onClick}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				onMouseDown={this.onMouseDown}>
				{this.props.children}
			</button>
		);
	}

	onMouseEnter = () => this.setState({hover:true});
	onMouseLeave = () => this.setState({hover:false});

	onMouseDown = () => {
		// This way we can receive `mouseup` outside the element.
		window.addEventListener('mouseup', this.onMouseUp);
		this.setState({active:true});
	};

	onMouseUp = () => {
		window.removeEventListener('mouseup', this.onMouseUp);
		this.setState({active:false});
	};

	componentWillUnmount() {
		this.onMouseUp();
	}

}
