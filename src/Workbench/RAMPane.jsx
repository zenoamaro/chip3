import React from 'react';
import {PropTypes as T} from 'react';
import Component from './Component';
import Layout from './Layout';
import {hexString, bitString, byteFormats} from './utils';


export default class RAM extends Component {

	static propTypes = {
		ram: T.object,
		pc: T.number,
	}

	static style = {
		row: {
			color: '#bbb',
			borderBottom: 'solid thin #ddd',
			fontFamily: 'lucida console, monospace',
		},
		currentRow: {
			color: 'inherit',
		},
		cell: {
			padding: '.93rem 1rem .7rem',
			textAlign: 'center',
		},
		addr: {
			flexBasis: 70,
			textAlign: 'right',
			borderRight: 'solid thin #ddd',
		},
		val: {
			flexBasis: 70,
			borderRight: 'solid thin #ddd',
		},
		dim: {
			color: '#bbb',
		},
		bits: {
			flexGrow: 1,
			flexShrink: 0,
		},
		ar: {
			color: '#af7bc5',
			flexBasis: 70,
			borderLeft: 'solid thin #ddd',
		},
		pc: {
			color: '#e94c3d',
			flexBasis: 70,
			borderLeft: 'solid thin #ddd',
		},
	}

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
		const currentRow = i === this.props.ram.ar || i === this.props.pc;
		const rowStyle = {...style.row, ...(currentRow && style.currentRow)};
		return (
			<Layout key={i} dir='horizontal'style={rowStyle}>
				{this.renderCell({
					style: style.addr,
					hint: `Address - ${byteFormats(i)}`,
					value: bitString(i, 5) })}
				{this.renderCell({
					style: style.val,
					hint: `Address contents - ${byteFormats(i)}`,
					value: hexString(word) })}
				{this.renderCell({
					style: style.bits,
					value: bitString(word) })}
				{this.renderCell({
					style: style.ar,
					hint: 'Address Register',
					value: ram.ar === i && '<AR' })}
				{this.renderCell({
					style: style.pc,
					hint: 'Program Counter',
					value: pc === i && '<PC' })}
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

}