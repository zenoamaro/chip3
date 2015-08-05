/**
 * Functions to create and operate on CPUs.
 *
 * @module Engine/CPU
 */


/**
 * A CPU in a virgin state.
 *
 * @typedef  {Object}  CPU
 * @property {String}  phase
 * @property {String}  next
 * @property {Boolean} rst
 * @property {Boolean} read
 * @property {Boolean} write
 * @property {Number}  a
 * @property {Number}  dr
 * @property {Number}  ir
 * @property {Number}  ar
 * @property {Number}  pc
 */


/**
 * Create a CPU in a virgin state.
 *
 * @method create
 * @returns {CPU}
 */
export function create() {
	return {
		phase: 'reset',
		next: 'fetch1',
		rst: false,
		read: false,
		write: false,
		a: 0,
		dr: 0,
		ir: 0,
		ar: 0,
		pc: 0,
	};
}