import React from 'react';
import {PropTypes as T} from 'react';
import Component from './Component';
import Layout from './Layout';


export default class CPU extends Component {

	static propTypes = {
		cpu: T.object,
	}

	static style = {
		pane: {
			borderLeft: 'solid thin #bbb',
		},
		row: {
			padding: '.7rem 1rem',
			borderBottom: 'solid thin #ddd',
		},
	}

	render() {
		const cpu = this.props.cpu;
		return (
			<Layout size={350} style={this.style.pane}>
				<div>
					{this.renderRow(`${cpu.phase} -> ${cpu.next}`)}
					{this.renderRow(`RST: ${cpu.rst? 'on' : 'off'}`)}
					{this.renderRow(`READ: ${cpu.read? 'on' : 'off'}`)}
					{this.renderRow(`WRITE: ${cpu.write? 'on' : 'off'}`)}
					{this.renderRow(`A: ${cpu.a}`)}
					{this.renderRow(`DR: ${cpu.dr}`)}
					{this.renderRow(`IR: ${cpu.ir}`)}
					{this.renderRow(`AR: ${cpu.ar}`)}
					{this.renderRow(`PC: ${cpu.pc}`)}
				</div>
			</Layout>
		);
	}

	renderRow(contents) {
		return (
			<div style={this.style.row}>
				{contents}
			</div>
		);
	}

}