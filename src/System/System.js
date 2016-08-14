/**
 * Functions to create and operate on complete systems.
 *
 * @module System/System
 */

import * as CPU from './CPU';
import * as RAM from './RAM';
import * as Printer from './Printer';


/**
 * A system in a virgin state.
 *
 * @typedef  {Object}  System
 * @property {CPU}     cpu     - CPU device
 * @property {RAM}     ram     - RAM device
 * @property {Printer} printer - Printer device
 * @property {Number}  cycle   - Current cycle number
 */


/**
 * A generic device.
 *
 * @typedef  {Object} Device
 */


/**
 * Specification for a system bus.
 *
 * This bus specifies the order of creation and execution of devices in the
 * system, and which lines will be synchronized between devices after each
 * device has cycled.
 *
 * @typedef  {Array}    Bus
 * @property {String}   Bus[].id     - ID of device in the bus
 * @property {Module}   Bus[].device - Module of device to instantiate
 * @property {Array}    Bus[].lines  - Synchronization lines to other devices
 */
export const Bus = [{
	id: 'cpu',
	device: CPU,
	lines: {
		ram: ['read', 'write', 'ar', 'dr'],
		printer: ['output', 'or'],
	},
}, {
	id: 'ram',
	device: RAM,
	lines: {
		cpu: ['dr'],
	},
}, {
	id: 'printer',
	device: Printer,
	lines: {},
}];


/**
 * Create a system in a virgin state.
 *
 * @method create
 * @returns {System}
 */
export function create() {
	const system = {
		cycle: 0,
	};
	for (const {id, device} of Bus) {
		system[id] = device.create();
	}
	return system;
}

/**
 * Executes one system cycle by cycling devices, and returning the
 * new state.
 *
 * @param   {System} state
 * @returns {System}
 */
export function cycle(state) {
	state = {
		...state,
		cycle: state.cycle + 1,
	};
	for (const {id, device, lines} of Bus) {
		state[id] = device.cycle(state[id]);
		for (const [target, mapping] of Object.entries(lines)) {
			for (const line of mapping) {
				state[target][line] = state[id][line];
			}
		}
	}
	return state;
}

/**
 * Returns an overview of the state of a System as text.
 *
 * @param   {System} state
 * @returns {String}
 */
export function toString(state) {
	return `${state.cycle}${Bus.map(
		({id, device}) => `\t\t${device.toString(state[id])}\n`
	)}`;
}
