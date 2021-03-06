import React from 'react';
import {PropTypes as T} from 'react';
import Component from './Component';
import Layout from './Layout';
import {hexString, bitString, byteFormats} from './utils';
import * as CPU from 'System/CPU';


export default class RAMPane extends Component {

	static propTypes = {
		pc: T.number,
		ram: T.object,
	};

	static style = {
		row: {
			color: '#bbb',
			padding: '0 1rem',
			borderBottom: 'solid thin #ddd',
			fontFamily: 'lucida console, monospace',
		},
		currentRow: {
			color: 'inherit',
		},
		arRow: {
			background: '#e6f5ff',
		},
		pcRow: {
			background: '#ffefed',
		},
		cell: {
			margin: '0 1rem',
			padding: '.93rem 0 .7rem',
		},
		addr: {},
		short: {
			flex: '0 0 35px',
			textAlign: 'center',
		},
		long: {
			flex: '1 1 0',
			textAlign: 'left',
		},
		reg: {
			flexBasis: 35,
			textAlign: 'right',
		},
		read: {
			color: '#0099ff',
		},
		write: {
			color: '#e94c3d',
		},
		ar: {
			color: '#0099ff',
		},
		pc: {
			color: '#e94c3d',
		},
	};

	render() {
		return (
			<Layout>
				<div>
					{this.props.ram.data.map(::this.renderRow)}
				</div>
			</Layout>
		);
	}

	renderRow(word, i) {
		const {style} = this;
		const {ram, pc} = this.props;
		const activity = i===ram.ar
			          && ((ram.read && 'READ') || (ram.write && 'WRITE'));
		const rowStyle = {
			...style.row,
			...(i===ram.ar && style.arRow),
			...(i===pc && style.pcRow),
			...((i===ram.ar || i===pc) && style.currentRow),
		};
		const activityStyle = {
			...style.reg,
			...(ram.read && style.read),
			...(ram.write && style.write),
		};
		return (
			<Layout key={i} dir="horizontal" style={rowStyle}>
				{this.renderCell({
					style: style.addr,
					hint: `Address - ${byteFormats(i)}`,
					value: bitString(i, 5)})}
				{this.renderCell({
					style: style.short,
					value: String.fromCharCode(word)})}
				{this.renderCell({
					style: style.short,
					hint: `Address contents - ${byteFormats(i)}`,
					value: hexString(word)})}
				{this.renderCell({
					style: style.long,
					value: bitString(word)})}
				{this.renderCell({
					style: style.long,
					hint: 'Disassembly',
					value: this.disassembled(word)})}
				{this.renderCell({
					style: activityStyle,
					hint: 'Read/write activity',
					value: activity})}
				{this.renderCell({
					style: {...style.reg, ...style.ar},
					hint: 'Address Register',
					value: ram.ar === i && '<AR'})}
				{this.renderCell({
					style: {...style.reg, ...style.pc},
					hint: 'Program Counter',
					value: pc === i && '<PC'})}
			</Layout>
		);
	}

	renderCell(cell) {
		const {hint, style, value} = cell;
		return (
			<div title={hint}
				style={{...this.style.cell, ...style}}>
				{value}
			</div>
		);
	}

	disassembled(word) {
		const {opcode, ar} = CPU.decode(word);
		const {mnemonic, operands} = opcode;
		switch (operands[0]) {
			case 'address':
				return `${mnemonic} [${bitString(ar, 5)}]`;
			case 'operator':
				let operators = CPU.decodeOperator(ar);
				return operators.map(o => o.mnemonic).join(' ');
			default:
				return mnemonic;
		}
	}

}
