import React from 'react';
import {PropTypes as T} from 'react';
import shallowEqual from 'react/lib/shallowEqual';


export default class Component extends React.Component {

	static propTypes = {
		style: T.object,
	}

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
		return !shallowEqual(this.props, nextProps)
		    || !shallowEqual(this.state, nextState);
	}

}