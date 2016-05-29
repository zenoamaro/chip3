import React from 'react';
import ReactDOM from 'react-dom';
import {PropTypes as T} from 'react';
import {AppContainer} from 'react-hot-loader';
import Component from './Component';
import Timer from './Timer';
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
		historySize: 500,
		program: [],
	}

	state = {
		currentSnapshot: 0,
		history: [],
		running: false,
		interval: 0,
	}

	lastCycleDuration = 0;
	lastCycleTime = 0;

	componentWillMount() {
		this.create();
	}

	create = () => {
		const system = System.create();
		const {data} = system.ram;
		const {program} = this.props;
		// Load program into memory
		system.ram.data = data.map((word, i) => program[i] || word);
		this.replaceHistory([system]);
	}

	cycle = () => {
		const current = this.getCurrentSnapshot();
		const next = System.cycle(current);
		this.pushSnapshot(next);
		// Measure execution time
		const now = Date.now();
		this.lastCycleDuration = now - this.lastCycleTime;
		this.lastCycleTime = now;
	}

	run = () => {
		this.setState({running: true});
	}

	pause = () => {
		this.setState({running: false});
	}

	step = () => {
		this.setState(
			{running: false},
			() => this.cycle()
		);
	}

	reset = () => {
		this.setState(
			{running: false},
			() => this.create()
		);
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
		const {interval, running} = this.state;
		const history = this.state.history;
		const current = this.state.currentSnapshot;
		const currentHistory = history.slice(0, current+1);
		const system = this.getCurrentSnapshot();

		return (
			<AppContainer>
				<Layout dir="vertical" style={this.style}>
					<Toolbar running={running}
						speed={1000/this.lastCycleDuration}
						onRun={this.run}
						onPause={this.pause}
						onCycle={this.step}
						onReset={this.reset}/>
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
					<Timer interval={interval}
						running={running}
						onTick={this.cycle}/>
				</Layout>
			</AppContainer>
		);
	}

	static bootstrap(selector, props) {
		const $element = document.querySelector(selector);
		return ReactDOM.render(<App {...props}/>, $element);
	}

}
