import React from 'react';
import {PropTypes as T} from 'react';
import Component from './Component';
import Layout from './Layout';


export default class CPU extends Component {

	static propTypes = {
		history: T.array,
		current: T.number,
		onSelect: T.func,
	}

	static style = {
		pane: {
			borderRight: 'solid thin #bbb',
		},
		row: {
			padding: '.7rem 1rem',
			borderBottom: 'solid thin #ddd',
		},
		rowActive: {
			background: '#f6f6f6'
		},
	}

	render() {
		return (
			<Layout size={350} style={this.style.pane}>
				<div>
					{this.props.history.map(::this.renderRow).reverse()}
				</div>
			</Layout>
		);
	}

	renderRow(snapshot, i) {
		const active = i === this.props.current;
		const style = { ...this.style.row, ...(active&&this.style.rowActive) };
		return (
			<div key={i} style={style}
			     onClick={() => this.props.onSelect(i)}>
				Clock cycle {snapshot.cycle} - {snapshot.cpu.phase}
			</div>
		);
	}

}