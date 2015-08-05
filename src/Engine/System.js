/**
 * Functions to create and operate on complete systems.
 *
 * @module Engine/System
 */

import * as CPU from './CPU';
import * as RAM from './RAM';


/**
 * A system in a virgin state.
 *
 * @typedef  {Object} System
 * @property {RAM}    ram
 * @property {CPU}    cpu
 * @property {Number} cycle
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
	return {
		cpu: CPU.cycle(state.cpu),
		ram: RAM.cycle(state.ram),
		cycle: state.cycle +1,
	};
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
