/**
 * Assembles an AST into a stream of opcodes.
 *
 * @module Assembler/Assembler
 */

import {parseSource} from './Parser';
import {dereference} from './utils';
import {validateOperandType} from './utils';
import * as instructions from './instructions';


/**
 * Performs the first pass of compilation over an abstract syntax.
 *
 * Will validate instruction types and operands, detect duplicated labels,
 * assign memory addresses to each instruction for later use in linking.
 *
 * @param   {AST} ast
 * @returns {AST}
 */
export function compile(ast) {
	/*
	Our case is simple enough: every instruction will always occupy exactly
	one byte, so we can assume a simple addressing scheme in which the address
	counter is increased by one for each operation. For more complex cases where
	the size of an opcode may vary, a less naive solution will be required.
	*/
	let addr = 0;

	// Store encountered labels to detect duplicates.
	const labels = {};

	return ast.map(instr => {
		const {label, operands} = instr;
		const type = instr.type.toUpperCase();
		const instrType = instructions[type];
		const instrOperands = instrType.operands;

		if (label) {
			if (label in labels) {
				throw new Error(`Duplicate label, '${label}'`);
			} else {
				labels[label] = true;
			}
		}

		if (!instrType) {
			throw new Error(`Unknown instruction, '${instrType}'`);
		}

		// There are no optional operands whatsoever
		// so we can simply match the length of the signature
		if (operands.length !== instrOperands.length) {
			throw new Error(`
				Instruction '${instrType.name}' expected ${instrOperands.length}
				operands, found ${operands.length} instead
			`);
		}

		// Compare the signature of the operands with
		// the expected signature of the instruction
		operands.forEach((op, i) => {
			const opType = instrOperands[i];
			if (!validateOperandType(op, opType)) {
				throw new Error(`
					Instruction '${instrType.name}' expected operand ${i} to be of type
					'${opType}', found '${op.type}' instead
				`);
			}
		});

		return {
			...instr,
			type,
			addr: addr++,
		};
	});
}

/**
 * Performs linking on compiled abstract syntax.
 *
 * Every operand of type `address` is dereferenced to the actual location
 * in memory it is pointing to.
 *
 * @param   {AST} ast
 * @returns {AST}
 */
export function link(ast) {
	return ast.map(instr => {
		const operands = instr.operands.map(op => {
			// Only `address` type operands need dereferencing.
			if (op.type === 'address') {
				const label = op.value;
				const location = dereference(ast, label);
				if (!location) throw new Error(`Unknown reference, '${label}'`);
				return {...op, addr:location.addr};
			} else {
				return op;
			}
		});

		return {
			...instr,
			operands,
		};
	});
}

/**
 * Assembles a linked abstract syntax into a list of opcodes.
 *
 * @param   {AST} ast
 * @returns {Program}
 */
export function assemble(ast) {
	return ast.reduce((program, instr) => {
		const type = instructions[instr.type];
		const opcodes = type.assemble(instr);
		return [...program, ...opcodes];
	}, []);
}

/**
 * Shortcut for perform both parsing and assembling in one step.
 *
 * @param   {String} source
 * @returns {Program}
 */
export function assembleSource(source) {
	const stream = parseSource(source);
	const ast = link(compile(stream));
	return assemble(ast);
}
