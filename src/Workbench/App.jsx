import React from 'react';


export default class App {

	render() {
		return (
			<div>Workbench</div>
		);
	}

	static bootstrap(selector) {
		const $element = document.querySelector(selector);
		return React.render(<App/>, $element);
	}

}