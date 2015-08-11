/**
 * Functions to create and operate on CPUs.
 *
 * @module Engine/CPU
 */


/**
 * A CPU in a virgin state.
 *
 * @typedef  {Object}  CPU
 * @property {String}  phase - Current phase of execution
 * @property {String}  next  - Next phase to be executed
 * @property {Boolean} rst   - Reset flag
 * @property {Boolean} read  - Read request flag
 * @property {Boolean} write - Write request flag
 * @property {Number}  a     - Accumulator
 * @property {Number}  dr    - Data register
 * @property {Number}  ir    - Instruction register
 * @property {Number}  ar    - Address register
 * @property {Number}  pc    - Program counter
 */


/**
 * Create a CPU in a virgin state.
 *
 * @method create
 * @returns {CPU}
 */
export function create() {
	return {
		phase: 'RESET',
		next: 'FETCH',
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
 */
export const phases = {
	FETCH, FETCH2,
	OPR, CLR, NOT, INC, ROL, ROR,
	LD, LD2, ST,
	ADD, ADD2,
	AND, AND2,
	JMP, JZ,
	OUT,
};

/**
 * A map between the opcodes supported by this CPU and the phase
 * transitions that handle their execution.
 *
 * | Opcode | Mnemonic | Operand | T | Function                            |
 * |--------|----------|---------|---|-------------------------------------|
 * | 000    | OPR      | op      | 1 | Operate on accumulator              |
 * | 001    | LD       | addr    | 2 | Load memory into accumulator        |
 * | 010    | ST       | addr    | 1 | Store accumulator into memory       |
 * | 011    | ADD      | addr    | 2 | Add memory location to accumulator  |
 * | 100    | AND      | addr    | 2 | Bitwise AND memory with accumulator |
 * | 101    | JMP      | addr    | 1 | Inconditional jump                  |
 * | 110    | JZ       | addr    | 1 | Jump if accumulator is zero         |
 * | 111    | OUT      |         | 1 | Output accumulator                  |
 */
export const opcodes = {
	0b000: 'OPR',
	0b001: 'LD',
	0b010: 'ST',
	0b011: 'ADD',
	0b100: 'AND',
	0b101: 'JMP',
	0b110: 'JZ',
	0b111: 'OUT',
};

/**
 * A map between the operators supported by the OPR instruction and the
 * phase transitions that handle their execution. All operators whose
 * flag is expressed will run in the same cycle and in the same order as
 * they are presented here.
 *
 * | Operator | Mnemonic | Function                     |
 * |----------|----------|------------------------------|
 * | 00001    | CLR      | Clear accumulator            |
 * | 00010    | NOT      | One's complement accumulator |
 * | 00100    | INC      | Increment accumulator        |
 * | 01000    | ROL      | Rotate accumulator left      |
 * | 10000    | ROR      | Rotate accumulator right     |
 */
export const operators = {
	0b00001: 'CLR',
	0b00010: 'NOT',
	0b00100: 'INC',
	0b01000: 'ROL',
	0b10000: 'ROR',
};

/**
 * Fetch the instruction at PC.
 *
 * Points the address register to the program counter, raises the read
 * request flag, and waits for memory to reply.
 *
 * @method  FETCH
 * @param   {CPU} state
 * @returns {CPU}
 */
export function FETCH(state) {
	return {
		ar: state.pc,
		read: true,
		write: false,
		next: 'FETCH2',
	};
}

/**
 * Second step of the instruction fetch phase.
 *
 * Reads the value arriving from memory on the data register and writes
 * it into the instruction and address registers, then increments the
 * program counter. Will transition to the handler for the opcode
 * expressed by the instruction register.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
export function FETCH2(state) {
	const ir = (state.dr & 0b11100000) >> 5;
	const ar = (state.dr & 0b00011111) >> 0;
	const next = opcodes[ir];
	return {
		next, ir, ar,
		read: false,
		pc: state.pc + 1,
	};
}

/**
 * Load memory into accumulator.
 *
 * Points the address register to the memory location to be read, raises
 * the read request flag, and waits for memory to reply.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function LD(state) {
	return {
		ar: state.ar,
		read: true,
		next: 'LD2',
	};
}

/**
 * Second step of the load operation.
 *
 * Reads the value arriving from memory on the data register and writes
 * it into the accumulator.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function LD2(state) {
	return {
		a: state.dr,
		read: false,
		next: 'FETCH',
	};
}

/**
 * Store accumulator into memory.
 *
 * Points the address register to the memory location to be written,
 * writes the contents of the accumulator on the data register, and
 * triggers the write request flag.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function ST(state) {
	return {
		ar: state.ar,
		dr: state.a,
		write: true,
		next: 'FETCH',
	};
}

/**
 * Add memory location to accumulator.
 *
 * Points the address register to the memory location of the operand,
 * raises the read request flag, and waits for memory to reply.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function ADD(state) {
	return {
		ar: state.ar,
		read: true,
		next: 'ADD2',
	};
}

/**
 * Second step of the addition operation.
 *
 * Reads the value arriving from memory on the data register, adds it to
 * the accumulator, and stores the results into the accumulator.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function ADD2(state) {
	return {
		a: (state.a + state.dr) % 256,
		read: false,
		next: 'FETCH',
	};
}

/**
 * Bitwise AND memory with accumulator.
 *
 * Points the address register to the memory location of the operand,
 * raises the read request flag, and waits for memory to reply.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function AND(state) {
	return {
		read: true,
		next: 'AND2',
	};
}

/**
 * Second step of the bitwise AND operation.
 *
 * Reads the value arriving from memory on the data register, ANDs it
 * with the accumulator, and stores the results into the accumulator.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function AND2(state) {
	return {
		a: (state.a & state.dr) % 256,
		read: false,
		next: 'FETCH',
	};
}

/**
 * Inconditional jump.
 *
 * Points the program counter to the address in the address register.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function JMP(state) {
	return {
		pc: state.ar & 0b00011111,
		next: 'FETCH',
	};
}

/**
 * Jump if accumulator is zero.
 *
 * Points the program counter to the address in the address register if
 * the accumulator is zero.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function JZ(state) {
	const z = state.a === 0;
	const ar = state.ar & 0b00011111;
	const pc = z? ar : state.pc;
	return {
		pc,
		next: 'FETCH',
	};
}

/**
 * Output accumulator.
 *
 * Outputs the value of the accumulator to the standard output.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function OUT(state) {
	/* eslint-disable */
	// TODO: Implement output device or generic I/O.
	console.log(state.a);
	/* eslint-enable */
	return {
		next: 'FETCH',
	};
}

/**
 * Operate on accumulator.
 *
 * Executes the operation expressed by the address register on the
 * accumulator, and stores the results into the accumulator. Requires no
 * operands.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function OPR(state) {
	const newState = Object
		.keys(operators)
		.map(op => parseInt(op, 10)).sort()
		.filter(op => state.ar & op)
		.reduce(function(diff, op) {
			var handler = phases[operators[op]];
			return { ...diff, ...handler({ ...state, ...diff }) };
		}, {});
	newState.next = 'FETCH';
	return newState;
}

/**
 * Clear accumulator.
 *
 * Resets the accumulator to zero.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function CLR(state) {
	return {
		a: 0,
	};
}

/**
 * One's complement accumulator.
 *
 * Replaces the value in the accumulator with its one's complement.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function NOT(state) {
	return {
		a: ~state.a & 0b11111111,
	};
}

/**
 * Increment accumulator.
 *
 * Increments the value in the accumulator by 1.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function INC(state) {
	return {
		a: (state.a + 1) % 256,
	};
}

/**
 * Rotate accumulator left.
 *
 * Rotates the accumulator to the left by 1.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function ROL(state) {
	return {
		a: (state.a << 1) % 256,
	};
}

/**
 * Rotate accumulator right.
 *
 * Rotates the accumulator to the right by 1.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function ROR(state) {
	return {
		a: (state.a >> 1) % 256,
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
