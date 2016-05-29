import React from 'react';
import {PropTypes as T} from 'react';
import Component from './Component';
import Layout from './Layout';
import {hexString, bitString} from './utils';


export default class PrinterPane extends Component {

	static propTypes = {
		history: T.array,
	}

	static defaultProps = {
		history: [],
	}

	static style = {
		pane: {
			flex: '1 1 0',
			padding: '0 16px',
			background: '#f6f6f6',
			borderTop: 'solid thin #bbb',
			borderLeft: 'solid thin #bbb',
			boxShadow: 'inset 0 8px 5px -5px rgba(0, 0, 0, .1)',
			fontFamily: 'menlo, monospace',
		},
		paper: {
			flex: '1 1 0',
			background: '#fff',
			borderLeft: 'solid thin #ddd',
			borderRight: 'solid thin #ddd',
			boxShadow: 'inset 0 8px 5px -5px rgba(0, 0, 0, .1)',
		},
		line: {
			flex: '0 0 auto',
			padding: '12px 24px',
			borderBottom: 'solid thin #ddd',
		},
		lineHex: {
			flex: '0 0 auto',
			marginRight: 8,
			textAlign: 'center',
		},
		lineChar: {
			flex: '0 0 auto',
			marginRight: 8,
			textAlign: 'center',
		},
		lineBinary: {
			flex: '1 1 0',
			textAlign: 'right',
			letterSpacing: 1,
			whiteSpace: 'pre',
		},
	}

	render() {
		const lines = this.props.history
			.filter(s => s.cpu.output);

		return (
			<Layout style={this.style.pane}>
				<Layout style={this.style.paper} justify="end">
					{lines.map(this.renderLine)}
				</Layout>
			</Layout>
		);
	}

	renderLine = (state, i) => {
		const output = state.cpu.output;
		if (!output) return;

		return (
			<Layout key={i} style={this.style.line} dir="horizontal">
				<div style={this.style.lineHex}>
					{hexString(state.cpu.output)}
				</div>
				<div style={this.style.lineChar}>
					{String.fromCharCode(state.cpu.output)}
				</div>
				<div style={this.style.lineBinary}>
					{bitString(state.cpu.output, 8, '  ', '▓▓')}
				</div>
			</Layout>
		);
	}

}
