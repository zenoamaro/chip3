import React from 'react';
import {PropTypes as T} from 'react';
import Component from './Component';
import Layout from './Layout';
import Button from './Button';


export default class Toolbar extends Component {

	static propTypes = {
		onCycle: T.func,
		onReset: T.func,
	}

	static style = {
		flexShrink: 0,
		padding: '.4rem .6rem',
		background: '#eee',
		borderBottom: 'solid thin #bbb',
	}

	render() {
		return (
			<header style={this.style}>
				<Layout dir="horizontal" align="center" justify="between">
					<div>
						<Button onClick={this.props.onCycle}>Cycle</Button>
						<Button onClick={this.props.onReset}>Reset</Button>
					</div>
				</Layout>
			</header>
		);
	}

}
