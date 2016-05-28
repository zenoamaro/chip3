import React from 'react';
import ReactDOM from 'react-dom';
import {PropTypes as T} from 'react';
import {AppContainer} from 'react-hot-loader';
import Component from './Component';
import Toolbar from './Toolbar';
import Layout from './Layout';
import HistoryPane from './HistoryPane';
import RAMPane from './RAMPane';
import CPUPane from './CPUPane';
import PrinterPane from './PrinterPane';
import {System} from 'System';
import {clamp} from './utils';


export default class App extends Component {

	static propTypes = {
		historySize: T.number,
		program: T.array,
	}

	static defaultProps = {
		program: [],
		historySize: 500,
	}

	state = {
		history: [],
		currentSnapshot: 0,
	}

	componentWillMount() {
		this.createSystem();
	}

	createSystem = () => {
		const system = System.create();
		const {data} = system.ram;
		const {program} = this.props;
		// Load program into memory
		system.ram.data = data.map((word, i) => program[i] || word);
		this.replaceHistory([system]);
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
		this.setState({currentSnapshot:current});
	}

	pushSnapshot(state) {
		const current = this.state.currentSnapshot;
		const history = this.state.history
			.slice(0, current+1)
			.concat(state);
		this.replaceHistory(history);
	}

	replaceHistory(history) {
		const historySize = clamp(1, this.props.historySize);
		history = history.slice(-historySize);
		this.setState({history, currentSnapshot:history.length-1});
	}

	static style = {
		width: '100vw',
		height: '100vh',
		overflow: 'hidden',
	}

	render() {
		const history = this.state.history;
		const current = this.state.currentSnapshot;
		const currentHistory = history.slice(0, current+1);
		const system = this.getCurrentSnapshot();
		return (
			<AppContainer>
				<Layout dir="vertical" style={this.style}>
					<Toolbar onCycle={this.cycleSystem}
						onReset={this.createSystem}/>
					<Layout dir="horizontal">
						<HistoryPane history={history}
							current={current}
							onSelect={this.selectSnapshot}/>
						<RAMPane ram={system.ram}
							pc={system.cpu.pc}/>
						<Layout dir="vertical" size={275}>
							<CPUPane cpu={system.cpu}/>
							<PrinterPane history={currentHistory}/>
						</Layout>
					</Layout>
				</Layout>
			</AppContainer>
		);
	}

	static bootstrap(selector, props) {
		const $element = document.querySelector(selector);
		return ReactDOM.render(<App {...props}/>, $element);
	}

}
