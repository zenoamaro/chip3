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

/**
 * Executes one CPU cycle, returning the new state.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
export function cycle(state) {
	return { ...state };
}

/**
 * Returns an overview of the state of a CPU as text.
 *
 * @param   {CPU} state
 * @returns {String}
 */
export function toString(state) {
	const rst = state.rst? 'yes' : 'no';
	const read = state.read? 'yes' : 'no';
	const write = state.write? 'yes' : 'no';
	const {phase, next, a, dr, ir, ar, pc} = state;
	return `CPU ${phase}->${next} RST:${rst} READ:${read} WRITE:${write} `
	     + `A:${a} AR:${ar} DR:${dr} IR:${ir} PC:${pc}`;
}
