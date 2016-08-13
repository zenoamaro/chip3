import React from 'react';
import {PropTypes as T} from 'react';
import shallowCompare from 'react/lib/shallowCompare';


export default class Component extends React.Component {

	static propTypes = {
		style: T.object,
	};

	get style() {
		if (this.cachedStyle) {
			return this.cachedStyle;
		}
		this.cachedStyle = {
			...this.constructor.style,
			...(this.computeStyle && this.computeStyle()),
			...this.props.style,
		};
		return this.cachedStyle;
	}

	componentWillUpdate() {
		if (this.computeStyle) {
			this.cachedStyle = null;
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return shallowCompare(this, nextProps, nextState);
	}

}
