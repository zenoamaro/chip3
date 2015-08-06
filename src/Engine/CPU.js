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
	add1,
	add2,
	and1,
	and2,
	jmp1,
	inc1,
};

/**
 * A map between the opcodes supported by this CPU and the phase
 * transition that handles their execution.
 *
 * @type {Object}
 */
export const opcodes = {
	0b000: 'add1', /* ADD X - Adds X to A       */
	0b001: 'and1', /* AND X - ANDs X and A      */
	0b010: 'jmp1', /* JMP X - Jumps to X        */
	0b011: 'inc1', /* INC   - Increments A by 1 */
};

/**
 * First step of the instruction fetch phase. Asks for a memory read
 * at the program counter address on the address register.
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
 * memory into the instruction and address registers, then increments
 * the program counter. Will transition to the opcode handler, or
 * restart the fetch cycle if the opcode is invalid.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
export function fetch2(state) {
	const ir = (state.dr & 0b11100000) >> 5;
	const ar = (state.dr & 0b00011111) >> 0;
	const next = opcodes[ir] || 'fetch1';
	return {
		next, ir, ar,
		read: false,
		pc: state.pc + 1,
	};
}

/**
 * First step of the addition operation. Asks for a memory read at the
 * address register, and transitions to next add step.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function add1(state) {
	return {
		ar: state.ar,
		read: true,
		next: 'add2',
	};
}

/**
 * Second step of the addition operation. Reads the data from memory
 * and adds it to the accumulator.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function add2(state) {
	return {
		a: (state.a + state.dr) % 255,
		read: false,
		next: 'fetch1',
	};
}

/**
 * First step of the bitwise AND operation. Asks for a memory read at the
 * address register.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function and1(state) {
	return {
		read: true,
		next: 'and2',
	};
}

/**
 * Second step of the bitwise AND operation. Reads the data from memory
 * and bitwise ANDs it to the accumulator.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function and2(state) {
	return {
		a: (state.a & state.dr) % 255,
		read: false,
		next: 'fetch1',
	};
}

/**
 * Points the program counter to the address in the address register.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function jmp1(state) {
	return {
		pc: state.dr & 0b00011111,
		next: 'fetch1',
	};
}

/**
 * Increments the accumulator by 1.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function inc1(state) {
	return {
		a: state.a + 1,
		next: 'fetch1',
	};
}

/**
 * Returns an overview of the state of a CPU as text.
 *
 * @param   {CPU} state
 * @returns {String}
 */
export function toString(state) {
	const rst = state.rst? 'on' : 'off';
	const read = state.read? 'on' : 'off';
	const write = state.write? 'on' : 'off';
	const {phase, next, a, dr, ir, ar, pc} = state;
	return `CPU ${phase}->${next} RST:${rst} READ:${read} WRITE:${write} `
	     + `A:${a} AR:${ar} DR:${dr} IR:${ir} PC:${pc}`;
}
