import React from 'react';
import {PropTypes as T} from 'react';
import Component from './Component';
import Layout from './Layout';


export default class HistoryPane extends Component {

	static propTypes = {
		current: T.number,
		history: T.array,
		onSelect: T.func,
	};

	static style = {
		pane: {
			background: '#f6f6f6',
			borderRight: 'solid thin #bbb',
		},
		row: {
			padding: '.7rem 1rem',
			borderBottom: 'solid thin #ddd',
		},
		rowActive: {
			fontWeight: 'bold',
			background: '#eee',
		},
	};

	render() {
		return (
			<Layout size={275} style={this.style.pane}>
				<div>
					{this.props.history.map(::this.renderRow).reverse()}
				</div>
			</Layout>
		);
	}

	renderRow(snapshot, i) {
		const active = i === this.props.current;
		const style = {...this.style.row, ...(active&&this.style.rowActive)};
		return (
			<div key={snapshot.cycle} style={style}
				onClick={() => this.props.onSelect(i)}>
				Clock cycle {snapshot.cycle} - {snapshot.cpu.phase}
			</div>
		);
	}

}
