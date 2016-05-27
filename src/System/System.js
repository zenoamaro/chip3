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
	// TODO: Refactor data synchronization
	cpu = CPU.cycle(cpu);
	ram = {...ram, read:cpu.read, write:cpu.write, ar:cpu.ar, dr:cpu.dr};
	ram = RAM.cycle(ram);
	cpu = {...cpu, dr:ram.dr};
	return {...state, cpu, ram, cycle:state.cycle+1};
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
