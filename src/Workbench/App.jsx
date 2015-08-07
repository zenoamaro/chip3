import React from 'react';
import Component from './Component';
import Toolbar from './Toolbar';
import Layout from './Layout';
import CPUPane from './CPUPane';
import RAMPane from './RAMPane';
import {System} from 'Engine';


export default class App extends Component {

	componentWillMount() {
		this.createSystem();
	}

	createSystem = () => {
		const system = System.create();
		system.ram.data[0b00000] = 0b01100000; /* INC   */
		system.ram.data[0b00001] = 0b01000000; /* JMP 0 */
		this.setState({ system });
	}

	cycleSystem = () => {
		const system = System.cycle(this.state.system);
		this.setState({ system });
	}

	static style = {
		width: '100vw',
		height: '100vh',
		overflow: 'hidden',
	}

	render() {
		return (
			<Layout dir='vertical' style={this.style}>
				<Toolbar onCycle={this.cycleSystem}/>
				<Layout dir='horizontal'>
					<RAMPane ram={this.state.system.ram}
					         pc={this.state.system.cpu.pc}/>
					<CPUPane cpu={this.state.system.cpu}/>
				</Layout>
			</Layout>
		);
	}

	static bootstrap(selector) {
		const $element = document.querySelector(selector);
		return React.render(<App/>, $element);
	}

}