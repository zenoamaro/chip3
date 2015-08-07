import React from 'react';
import Component from './Component';
import Toolbar from './Toolbar';
import Layout from './Layout';


export default class App extends Component {

	static style = {
		width: '100vw',
		height: '100vh',
		overflow: 'hidden',
	}

	render() {
		return (
			<Layout dir='vertical' style={this.style}>
				<Toolbar/>
				<Layout dir='horizontal'>
					<div>RAM</div>
					<div>CPU</div>
				</Layout>
			</Layout>
		);
	}

	static bootstrap(selector) {
		const $element = document.querySelector(selector);
		return React.render(<App/>, $element);
	}

}