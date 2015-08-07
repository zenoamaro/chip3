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
		arRow: {
			background: '#e6f5ff',
		},
		pcRow: {
			background: '#ffefed',
		},
		cell: {
			padding: '.93rem 1rem .7rem',
			textAlign: 'center',
		},
		addr: {
			flexBasis: 70,
			textAlign: 'right',
			borderRight: 'solid thin rgba(0, 0, 0, .14)',
		},
		val: {
			flexBasis: 70,
			borderRight: 'solid thin rgba(0, 0, 0, .14)',
		},
		dim: {
			color: '#bbb',
		},
		bits: {
			flexGrow: 1,
			flexShrink: 0,
		},
		read: {
			color: '#0099ff',
		},
		write: {
			color: '#e94c3d',
		},
		ar: {
			color: '#0099ff',
			flexBasis: 70,
			borderLeft: 'solid thin rgba(0, 0, 0, .14)',
		},
		pc: {
			color: '#e94c3d',
			flexBasis: 70,
			borderLeft: 'solid thin rgba(0, 0, 0, .14)',
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
		const activity = i===ram.ar
			          && ((ram.read && 'READ') || (ram.write && 'WRITE'));
		const rowStyle = {
			...style.row,
			...(i===ram.ar && style.arRow),
			...(i===pc && style.pcRow),
			...((i===ram.ar || i===pc) && style.currentRow),
		};
		const activityStyle = {
			...style.ar,
			...(ram.read && style.read),
			...(ram.write && style.write),
		};
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
					style: activityStyle,
					hint: 'Read/write activity',
					value: activity })}
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