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
