import React from 'react';
import {PropTypes as T} from 'react';
import Component from './Component';


export default class Layout extends Component {

	static propTypes = {
		align: T.oneOf(['start', 'end', 'center', 'stretch']),
		children: T.node,
		dir: T.oneOf(['vertical', 'horizontal']),
		flex: T.number,
		justify: T.oneOf(['start', 'center', 'end', 'between', 'around']),
		size: T.number,
		title: T.string,
	}

	static defaultProps = {
		flex: 1,
		dir: 'vertical',
		align: 'stretch',
		justify: 'between',
	}

	static style = {
		display: 'flex',
		overflowY: 'auto',
	}

	static stylePropMap = {
		'vertical': 'column',
		'horizontal': 'row',
		'start': 'flex-start',
		'end': 'flex-end',
		'center': 'center',
		'between': 'space-between',
		'around': 'space-around',
		'stretch': 'stretch',
	}

	computeStyle() {
		return {
			flexGrow:   this.props.size? 0 : this.props.flex,
			flexShrink: this.props.size? 1 : this.props.flex,
			flexBasis:  this.props.size? this.props.size : 'auto',
			flexDirection:  Layout.stylePropMap[this.props.dir],
			alignItems:     Layout.stylePropMap[this.props.align],
			justifyContent: Layout.stylePropMap[this.props.justify],
		};
	}

	render() {
		return (
			<div style={this.style}
				title={this.props.title}>
				{this.props.children}
			</div>
		);
	}

}
