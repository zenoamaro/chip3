import Component from './Component';
import {PropTypes as T} from 'react';


export default class Timer extends Component {

	static propTypes = {
		interval: T.number.isRequired,
		onTick: T.func.isRequired,
		running: T.bool.isRequired,
	};

	componentWillMount() {
		if (this.props.running) {
			this.tick();
		}
	}

	componentWillUnmount() {
		this.stop();
	}

	componentDidUpdate(prevProps) {
		if (this.props.running !== prevProps.running) {
			if (this.props.running) {
				this.tick();
			}
		}
	}

	tick = () => {
		if (this.props.running && this.props.onTick) {
			this.props.onTick();
			this.schedule(this.tick, this.props.interval);
		}
	};

	schedule(fn, timeout) {
		this.stop();
		this.timer = setTimeout(fn, timeout);
	}

	stop() {
		clearTimeout(this.timer);
		this.timer = null;
	}

	render() {
		return false;
	}
}
