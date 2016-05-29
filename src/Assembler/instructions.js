/**
 * Instruction set
 *
 * @module Assembler/instructions
 */

import {assemble} from './utils';
import {int} from './utils';


/**
 * Store data into memory
 * @type {Instruction}
 */
export const DB = {
	name: 'DB',
	operands: ['number'],
	size: instr => 1,
	assemble: instr => {
		const arg = instr.operands[0];
		return [int(arg.value)];
	},
};

// TODO: Combine OPRs into one opcode

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
		return [assemble(0b001, arg.addr)];
	},
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
		return [assemble(0b010, arg.addr)];
	},
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
