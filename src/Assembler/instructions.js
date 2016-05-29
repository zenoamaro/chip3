/**
 * Instruction set
 *
 * @module Assembler/instructions
 */

import {assemble} from './utils';
import {int} from './utils';
import {string} from './utils';


/**
 * Store data into memory
 * @type {Instruction}
 */
export const DB = {
	name: 'DB',
	operands: ['address|number|string'],
	size: instr => (
		DB.assemble(instr).length
	),
	assemble: instr => {
		const arg = instr.operands[0];
		switch (arg.type) {
			case 'address': return [int(arg.addr)];
			case 'number': return [int(arg.value)];
			case 'string': return string(arg.value);
		}
	},
};

// TODO: Combine OPRs into one opcode

/**
 * Perform no operation
 * @type {Instruction}
 */
export const NOP = {
	name: 'NOP',
	operands: [],
	size: instr => 1,
	assemble: instr => [assemble(0b000, 0b00000)],
};

/**
 * Clear the accumulator
 * @type {Instruction}
 */
export const CLR = {
	name: 'CLR',
	operands: [],
	size: instr => 1,
	assemble: instr => [assemble(0b000, 0b00001)],
};

/**
 * Bitwise negate the accumulator
 * @type {Instruction}
 */
export const NOT = {
	name: 'NOT',
	operands: [],
	size: instr => 1,
	assemble: instr => [assemble(0b000, 0b00010)],
};

/**
 * Increase the accumulator by one
 * @type {Instruction}
 */
export const INC = {
	name: 'INC',
	operands: [],
	size: instr => 1,
	assemble: instr => [assemble(0b000, 0b00100)],
};

/**
 * Rotate the accumulator left by one
 * @type {Instruction}
 */
export const ROL = {
	name: 'ROL',
	operands: [],
	size: instr => 1,
	assemble: instr => [assemble(0b000, 0b01000)],
};

/**
 * Rotate the accumulator right by one
 * @type {Instruction}
 */
export const ROR = {
	name: 'ROR',
	operands: [],
	size: instr => 1,
	assemble: instr => [assemble(0b000, 0b10000)],
};

/**
 * Load memory into accumulator
 * @type {Instruction}
 */
export const LD = {
	name: 'LD',
	operands: ['address'],
	size: instr => 1,
	assemble: instr => {
		const arg = instr.operands[0];
		if (arg.addr === 0) {
			throw new Error('Loading address `zero`, use LDA instead');
		}
		return [assemble(0b001, arg.addr)];
	},
};

/**
 * Load memory at accumulator into accumulator
 * @type {Instruction}
 */
export const LDA = {
	name: 'LDA',
	operands: [],
	size: instr => 1,
	assemble: instr => [assemble(0b001, 0b00000)],
};

/**
 * Store accumulator into memory
 * @type {Instruction}
 */
export const ST = {
	name: 'ST',
	operands: ['address'],
	size: instr => 1,
	assemble: instr => {
		const arg = instr.operands[0];
		if (arg.addr === 0) {
			throw new Error('Loading address `zero`, use LDA instead');
		}
		return [assemble(0b010, arg.addr)];
	},
};

/**
 * Store accumulator into last read address
 * @type {Instruction}
 */
export const STA = {
	name: 'STA',
	operands: [],
	size: instr => 1,
	assemble: instr => [assemble(0b010, 0b00000)],
};

/**
 * Add memory to accumulator
 * @type {Instruction}
 */
export const ADD = {
	name: 'ADD',
	operands: ['address'],
	size: instr => 1,
	assemble: instr => {
		const arg = instr.operands[0];
		return [assemble(0b011, arg.addr)];
	},
};

/**
 * Bitwise and accumulator with memory
 * @type {Instruction}
 */
export const AND = {
	name: 'AND',
	operands: ['address'],
	size: instr => 1,
	assemble: instr => {
		const arg = instr.operands[0];
		return [assemble(0b100, arg.addr)];
	},
};

/**
 * Unconditionally jump to address
 * @type {Instruction}
 */
export const JMP = {
	name: 'JMP',
	operands: ['address'],
	size: instr => 1,
	assemble: instr => {
		const arg = instr.operands[0];
		return [assemble(0b101, arg.addr)];
	},
};

/**
 * Jump to address if accumulator is zero
 * @type {Instruction}
 */
export const JZ = {
	name: 'JZ',
	operands: ['address'],
	size: instr => 1,
	assemble: instr => {
		const arg = instr.operands[0];
		return [assemble(0b110, arg.addr)];
	},
};

/**
 * Output accumulator
 * @type {Instruction}
 */
export const OUT = {
	name: 'OUT',
	operands: [],
	size: instr => 1,
	assemble: instr => [assemble(0b111)],
};
