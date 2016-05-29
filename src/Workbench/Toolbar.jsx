import React from 'react';
import {PropTypes as T} from 'react';
import Component from './Component';
import Layout from './Layout';
import Button from './Button';


export default class Toolbar extends Component {

	static propTypes = {
		onCycle: T.func.isRequired,
		onPause: T.func.isRequired,
		onReset: T.func.isRequired,
		onRun: T.func.isRequired,
		running: T.bool.isRequired,
		speed: T.number,
	}

	static style = {
		flexShrink: 0,
		padding: '.4rem .6rem',
		background: '#eee',
		borderBottom: 'solid thin #bbb',
	}

	render() {
		const {
			running,
			speed,
			onRun,
			onPause,
			onCycle,
			onReset,
		} = this.props;

		return (
			<header style={this.style}>
				<Layout dir="horizontal" align="center" justify="between">
					<div>
						<Button disabled={running} onClick={onRun}>Run</Button>
						<Button disabled={!running} onClick={onPause}>Pause</Button>
						<Button onClick={onCycle}>Cycle</Button>
						<Button onClick={onReset}>Reset</Button>
						{' '}
						{running && <span>Speed: {Math.floor(speed)} Hz</span>}
					</div>
				</Layout>
			</header>
		);
	}

}
