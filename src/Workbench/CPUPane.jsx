import React from 'react';
import {PropTypes as T} from 'react';
import Component from './Component';
import Layout from './Layout';
import {hexString, byteFormats} from './utils';


export default class CPUPane extends Component {

	static propTypes = {
		cpu: T.object,
	};

	static style = {
		pane: {
			flex: '0 0 auto',
			flexFlow: 'row wrap',
			background: '#f6f6f6',
			borderLeft: 'solid thin #bbb',
		},
		prop: {
			display: 'flex',
			flex: '1 0 50%',
			padding: '.7rem 1rem',
			borderBottom: 'solid thin #ddd',
		},
		dim: {
			color: '#bbb',
		},
		propLabel: {
			flexBasis: 50,
			color: '#bbb',
			marginRight: '1rem',
			textAlign: 'right',
		},
		propValue: {
			fontFamily: 'lucida console, monospace',
			marginTop: '.08rem',
			marginRight: '1rem',
		},
	};

	render() {
		const cpu = this.props.cpu;
		return (
			<Layout style={this.style.pane}>
				{this.renderProp({
					label: 'Phase',
					hint: 'Current phase',
					value: cpu.phase})}
				{this.renderProp({
					label: 'Next',
					hint: 'Next phase',
					value: cpu.next})}
				{this.renderProp({
					label: 'RST',
					hint: 'Reset flag',
					value: cpu.rst})}
				{this.renderProp({
					label: 'READ',
					hint: 'Memory read flag',
					value: cpu.read})}
				{this.renderProp({
					label: 'WRITE',
					hint: 'Memory write flag',
					value: cpu.write})}
				{this.renderProp({
					label: 'OUTPUT',
					hint: 'I/O output',
					value: cpu.output})}
				{this.renderProp({
					label: 'A',
					hint: 'Accumulator',
					value: cpu.a})}
				{this.renderProp({
					label: 'IR',
					hint: 'Instruction Register',
					value: cpu.ir})}
				{this.renderProp({
					label: 'AR',
					hint: 'Address Register',
					value: cpu.ar})}
				{this.renderProp({
					label: 'DR',
					hint: 'Data Register',
					value: cpu.dr})}
				{this.renderProp({
					label: 'OR',
					hint: 'Output Register',
					value: cpu.or})}
				{this.renderProp({
					label: 'LR',
					hint: 'Last load address Register',
					value: cpu.ar})}
				{this.renderProp({
					label: 'PC',
					hint: 'Program Counter',
					value: cpu.pc})}
			</Layout>
		);
	}

	renderProp(prop) {
		const {style} = this;
		const {label, value, size} = prop;
		const hint = typeof value === 'number'
			? `${prop.hint} - ${byteFormats(value)}`
			: prop.hint;
		return (
			<Layout dir="horizontal" justify="start"
				title={hint} style={style.prop}>
				<div style={style.propLabel}>
					{label}
				</div>
				{typeof value === 'string' && (
					<div style={style.propValue}>
						{value}
					</div>
				)}
				{typeof value === 'boolean' && (
					<div style={{...style.propValue, ...(!value&&style.dim)}}>
						{value? 'ON' : 'OFF'}
					</div>
				)}
				{typeof value === 'number' && (
					<div style={style.propValue}>
						{hexString(value)}
					</div>
				)}
			</Layout>
		);
	}

}
