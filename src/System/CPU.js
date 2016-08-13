/**
 * Functions to create and operate on CPUs.
 *
 * @module System/CPU
 */


/**
 * A CPU in a virgin state.
 *
 * @typedef  {Device}  CPU
 * @property {String}  phase - Current phase of execution
 * @property {String}  next  - Next phase to be executed
 * @property {Boolean} rst   - Reset flag
 * @property {Boolean} read  - Read request flag
 * @property {Boolean} write - Write request flag
 * @property {Number}  a     - Accumulator
 * @property {Number}  dr    - Data register
 * @property {Number}  ir    - Instruction register
 * @property {Number}  ar    - Address register
 * @property {Number}  lr    - Last load address register
 * @property {Number}  pc    - Program counter
 */


/**
 * Handlers for every phase the CPU can transition to.
 */
export const phases = {
	HALT, FETCH, FETCH2,
	OPR, CLR, NOT, INC, ROL, ROR,
	LD, LD2, ST,
	ADD, ADD2,
	AND, AND2,
	JMP, JZ,
	OUT,
};

/**
 * A description of an opcode.
 *
 * @typedef  {Object}  Opcode
 * @property {Number}  code     - Unique code representing this opcode
 * @property {String}  mnemonic - Next phase to be executed
 * @property {String}  phase    - CPU phase that handles this opcode
 * @property {Array}   operands - Data types for all accepted operands
 */

/**
 * Specifications for all opcodes supported by the CPU.
 *
 * | Opcode | Mnemonic | Operands | T | Function                            |
 * |--------|----------|----------|---|-------------------------------------|
 * | 000    | OPR      | operator | 1 | Operate on accumulator              |
 * | 001    | LD       | address  | 2 | Load memory into accumulator        |
 * | 010    | ST       | address  | 1 | Store accumulator into memory       |
 * | 011    | ADD      | address  | 2 | Add memory location to accumulator  |
 * | 100    | AND      | address  | 2 | Bitwise AND memory with accumulator |
 * | 101    | JMP      | address  | 1 | Inconditional jump                  |
 * | 110    | JZ       | address  | 1 | Jump if accumulator is zero         |
 * | 111    | OUT      |          | 1 | Output accumulator                  |
 */
export const opcodes = [
	{code:0b000, mnemonic:'OPR', phase:'OPR', operands:['operator']},
	{code:0b001, mnemonic:'LD',  phase:'LD',  operands:['address']},
	{code:0b010, mnemonic:'ST',  phase:'ST',  operands:['address']},
	{code:0b011, mnemonic:'ADD', phase:'ADD', operands:['address']},
	{code:0b100, mnemonic:'AND', phase:'AND', operands:['address']},
	{code:0b101, mnemonic:'JMP', phase:'JMP', operands:['address']},
	{code:0b110, mnemonic:'JZ',  phase:'JZ',  operands:['address']},
	{code:0b111, mnemonic:'OUT', phase:'OUT', operands:[]},
];

/**
 * A description of an operator.
 *
 * @typedef  {Object}  Opcode
 * @property {Number}  code     - Flag activating this operator
 * @property {String}  mnemonic - Next phase to be executed
 * @property {String}  phase    - CPU phase that handles this operator
 */

/**
 * Specifications for all opcodes supported by the CPU.
 *
 * All operators whose flag is expressed will run in the same cycle and
 * in the same order as they are presented here.
 *
 * | Operator | Mnemonic | Function                     |
 * |----------|----------|------------------------------|
 * | 00001    | CLR      | Clear accumulator            |
 * | 00010    | NOT      | One's complement accumulator |
 * | 00100    | INC      | Increment accumulator        |
 * | 01000    | ROL      | Rotate accumulator left      |
 * | 10000    | ROR      | Rotate accumulator right     |
 */
export const operators = [
	{code:0b00001, mnemonic:'CLR', phase:'CLR'},
	{code:0b00010, mnemonic:'NOT', phase:'NOT'},
	{code:0b00100, mnemonic:'INC', phase:'INC'},
	{code:0b01000, mnemonic:'ROL', phase:'ROL'},
	{code:0b10000, mnemonic:'ROR', phase:'ROR'},
];

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
		output: null,
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
	let receiver;
	const phase = state.next;
	switch (true) {
		case state.rst:       receiver = create; break;
		case phase in phases: receiver = phases[phase]; break;
		default:              return {...state};
	}
	return {...state, phase, ...receiver(state)};
}

/**
 * Decodes a word into into opcode, operand and phase transition.
 *
 * Produces values for the instruction and address register, and the cpu
 * phase to transition to in order to execute the opcode.
 *
 * @method  decode
 * @param   {Number} word
 * @returns {Object}
 */
export function decode(word) {
	/* eslint-disable no-bitwise */
	const ir = (word & 0b11100000) >> 5;
	const ar = (word & 0b00011111) >> 0;
	/* eslint-enable no-bitwise */
	const opcode = opcodes[ir];
	return {ir, ar, opcode};
}

/**
 * Decodes an operator into a list of operators.
 *
 * Multiple operators can be executed on the same cycle, and are
 * returned as a list of phases to handle them. Operations always execute
 * as has been specified (ascending order by code).
 *
 * @param   {Number} opr
 * @returns {Array}
 */
export function decodeOperator(opr) {
	/* eslint-disable no-bitwise */
	return operators.filter(o => opr & o.code);
	/* eslint-enable no-bitwise */
}

/**
 * Keeps the machine halted until reset.
 *
 * @returns {CPU}
 */
export function HALT() {
	return {
		next: 'HALT',
	};
}

/**
 * Fetch the instruction at PC.
 *
 * Points the address register to the program counter, raises the read
 * request flag, and waits for memory to reply.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
export function FETCH(state) {
	return {
		ar: state.pc,
		read: true,
		write: false,
		output: null,
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
	const {opcode, ir, ar} = decode(state.dr);
	const next = opcode.phase;
	return {
		ir, ar,
		read: false,
		pc: state.pc + 1,
		next,
	};
}

/**
 * Load memory into accumulator.
 *
 * Points the address register to the memory location to be read, raises
 * the read request flag, and waits for memory to reply. When the address
 * is `zero`, the address in the accumulator is used instead.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function LD(state) {
	return {
		ar: state.ar || state.a,
		lr: state.ar,
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
 * triggers the write request flag. When the address is `zero`, the
 * last read address is used instead.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function ST(state) {
	return {
		ar: state.ar || state.lr,
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
		/* eslint-disable no-bitwise */
		a: (state.a & state.dr) % 256,
		/* eslint-enable no-bitwise */
		read: false,
		next: 'FETCH',
	};
}

/**
 * Inconditional jump.
 *
 * Points the program counter to the address in the address register.
 * If the instruction jumps to its own address, the machine will halt.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function JMP(state) {
	// Halt when jumping to same address.
	// Note that PC is already one after.
	if (state.ar === state.pc - 1) {
		return {next:'HALT', pc:state.ar};
	}

	return {
		/* eslint-disable no-bitwise */
		pc: state.ar & 0b00011111,
		/* eslint-enable no-bitwise */
		next: 'FETCH',
	};
}

/**
 * Jump if accumulator is zero.
 *
 * Points the program counter to the address in the address register if
 * the accumulator is zero. If a jump to the same address is attempted,
 * the machine will halt.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function JZ(state) {
	const z = state.a === 0;
	/* eslint-disable no-bitwise */
	const ar = state.ar & 0b00011111;
	/* eslint-enable no-bitwise */
	const pc = z? ar : state.pc;

	// Halt when jumping to same address.
	// Note that PC is already one after.
	if (pc === state.pc - 1) {
		return {next:'HALT', pc};
	}

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
	return {
		next: 'FETCH',
		output: state.a,
	};
}

/**
 * Executes operators over the accumulator.
 *
 * Executes the operation expressed by the address register on the
 * accumulator, and stores the results into the accumulator. Requires no
 * operands.
 *
 * @param   {CPU} state
 * @returns {CPU}
 */
function OPR(state) {
	const ops = decodeOperator(state.ar);
	const newState = ops.reduce((partial, opr) => {
		const handler = phases[opr.phase];
		const result = handler({...state, ...partial});
		return {...partial, ...result};
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
		/* eslint-disable no-bitwise */
		a: ~state.a & 0b11111111,
		/* eslint-enable no-bitwise */
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
		/* eslint-disable no-bitwise */
		a: (state.a << 1) % 256,
		/* eslint-enable no-bitwise */
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
		/* eslint-disable no-bitwise */
		a: (state.a >> 1) % 256,
		/* eslint-enable no-bitwise */
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
