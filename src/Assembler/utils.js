/**
 * Assembler-related utils
 *
 * @module Assembler/utils
 */


 /**
 * Shortcut to parse integers from text, with fallback.
 *
 * @param   {String} n
 * @param   {Number} def
 * @returns {Number}
 */
export function int(n, def=0) {
	const result = parseInt(n, 10);
	return !isNaN(result) ? result : def;
}

/**
 * Shortcut to convert a string-like to a null-terminated string array.
 *
 * @param   {String} s
 * @returns {String[]}
 */
export function string(s) {
	return String(s).split('')
		.map(c => c.charCodeAt(0))
		.concat(0);
}

/**
 * Finds the location of a label in an abstract syntax.
 * Returns the operation that was labeled as such.
 *
 * @param   {AST} ast
 * @param   {String} label
 * @returns {Operation}
 */
export function dereference(ast, label) {
	return ast.find(op => op.label === label);
}

/**
 * Checks if the given operand matches type.
 *
 * Type may be a single type, such as `"label"`, or an union of types, like
 * `"number|string"`.
 *
 * @param   {Token} operand
 * @param   {String} type
 * @returns {Boolean}
 */
export function validateOperandType(operand, type) {
	return type.split('|').includes(operand.type);
}

/**
 * Assembles an instruction and an operand into a complete 8-bit opcode.
 *
 * @param   {Number} instr
 * @param   {Number} operand
 * @returns {Number}
 */
export function assemble(instr, operand=0) {
	return (
		/* eslint-disable no-bitwise */
		((int(instr) & 0b111) << 5) +  // Upper 3 bits
		(int(operand) & 0b11111)       // Lower 5 bits
		/* eslint-enable no-bitwise */
	);
}
