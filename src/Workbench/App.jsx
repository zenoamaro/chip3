import React from 'react';
import Component from './Component';
import Toolbar from './Toolbar';
import Layout from './Layout';
import CPUPane from './CPUPane';
import RAMPane from './RAMPane';
import HistoryPane from './HistoryPane';
import {System} from 'Engine';
import {clamp} from './utils';


export default class App extends Component {

	state = {
		history: [],
		currentSnapshot: 0,
	}

	componentWillMount() {
		this.createSystem();
	}

	createSystem = () => {
		const system = System.create();
		system.ram.data[0b00000] = 0b01100000; /* INC   */
		system.ram.data[0b00001] = 0b01000000; /* JMP 0 */
		this.pushSnapshot(system);
	}

	cycleSystem = () => {
		const current = this.getCurrentSnapshot();
		const next = System.cycle(current);
		this.pushSnapshot(next);
	}

	getCurrentSnapshot() {
		const current = this.state.currentSnapshot;
		const history = this.state.history;
		return history[current];
	}

	selectSnapshot = (index) => {
		const length = this.state.history.length;
		const current = clamp(0, index, length-1);
		this.setState({ currentSnapshot:current });
	}

	pushSnapshot(state) {
		const current = this.state.currentSnapshot;
		const history = this.state.history
			.slice(0, current+1)
			.concat(state);
		this.setState({ history, currentSnapshot:history.length-1 });
	}

	static style = {
		width: '100vw',
		height: '100vh',
		overflow: 'hidden',
	}

	render() {
		const history = this.state.history;
		const current = this.state.currentSnapshot;
		const system = this.getCurrentSnapshot();
		return (
			<Layout dir='vertical' style={this.style}>
				<Toolbar onCycle={this.cycleSystem}/>
				<Layout dir='horizontal'>
					<HistoryPane history={history}
					             current={current}
					             onSelect={this.selectSnapshot}/>
					<RAMPane ram={system.ram}
					         pc={system.cpu.pc}/>
					<CPUPane cpu={system.cpu}/>
				</Layout>
			</Layout>
		);
	}

	static bootstrap(selector) {
		const $element = document.querySelector(selector);
		return React.render(<App/>, $element);
	}

}