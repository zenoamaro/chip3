import React from 'react';
import {PropTypes as T} from 'react';
import Component from './Component';
import Layout from './Layout';
import {bitArray} from './utils';


export default class RAM extends Component {

	static propTypes = {
		ram: T.object,
		pc: T.number,
	}

	static style = {
		row: {
			padding: '.7rem 1rem',
			borderBottom: 'solid thin #ddd',
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
		return (
			<div key={i} style={this.style.row}>
				{i} - {word} - {bitArray(word).join('')}
				{this.props.ram.ar === i && ' <AR'}
				{this.props.pc === i && ' <PC'}
			</div>
		);
	}

}