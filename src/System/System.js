/**
 * Functions to create and operate on complete systems.
 *
 * @module System/System
 */

import * as CPU from './CPU';
import * as RAM from './RAM';


/**
 * A system in a virgin state.
 *
 * @typedef  {Object} System
 * @property {RAM}    ram     - RAM component
 * @property {CPU}    cpu     - CPU component
 * @property {Number} cycle   - Current cycle number
 */


/**
 * A generic device.
 *
 * @typedef  {Object} Device
 */


/**
 * Create a system in a virgin state.
 *
 * @method create
 * @returns {System}
 */
export function create() {
	return {
		cpu: CPU.create(),
		ram: RAM.create(),
		cycle: 1,
	};
}

/**
 * Executes one system cycle by cycling CPU and RAM, and returning the
 * new state.
 *
 * @param   {System} state
 * @returns {System}
 */
export function cycle(state) {
	let {cpu, ram} = state;
	cpu = CPU.cycle(cpu);
	ram = synchronize(ram, cpu, ['read', 'write', 'ar', 'dr']);
	ram = RAM.cycle(ram);
	cpu = synchronize(cpu, ram, ['dr']);
	return {...state, cpu, ram, cycle:state.cycle+1};
}

/**
 * Returns a copy of the receiver, where all the specified lines will have the
 * same value as those on the source.
 *
 * @param   {Device}   receiver
 * @param   {Device}   source
 * @param   {String[]} lines
 * @returns {Device}
 */
export function synchronize(receiver, source, lines) {
	return lines.reduce(
		(receiver, line) => {
			receiver[line] = source[line];
			return receiver;
		},
		{...receiver},
	);
}

/**
 * Returns an overview of the state of a System as text.
 *
 * @param   {System} state
 * @returns {String}
 */
export function toString(state) {
	return `${state.cycle}\t${CPU.toString(state.cpu)}\n`
	     + `\t${RAM.toString(state.ram)}`;
}
