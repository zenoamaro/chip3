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
	var receiver;
	const phase = state.next;
	switch (true) {
		case state.rst:       receiver = create; break;
		case phase in phases: receiver = phases[phase]; break;
		default:              return { ...state };
	}
	return { ...state, phase, ...receiver(state) };
}

/**
 * Handlers for every phase the CPU can transition to.
 *
 * @type {Object}
 */
export const phases = {
	fetch1,
	fetch2,
};

/**
 * First step of the instruction fetch phase. Asks for a memory read
 * at the program counter address on the address register, and
 * transitions to next fetch step.
 *
 * @method  fetch1
 * @param   {CPU} state
 * @returns {CPU}
 */
export function fetch1(state) {
	return {
		ar: state.pc,
		read: true,
		next: 'fetch2',
	};
}

/**
 * Second step of the instruction fetch phase. Reads the data from
 * memory into the instruction and address registers, then
 * increments the program counter.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
export function fetch2(state) {
	const ir = (state.dr & 0b11100000) >> 5;
	const ar = (state.dr & 0b00011111) >> 0;
	return {
		ir, ar,
		read: false,
		next: 'fetch1',
		pc: state.pc + 1,
	};
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
