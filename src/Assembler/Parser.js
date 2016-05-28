/**
 * Parses source code into abstract syntax.
 *
 * @module Assembler/Parser
 */


/**
 * Registered token types.
 *
 * @type {TokenType[]}
 */
const types = [
	{name:'label',      pattern:/^([a-zA-Z_][\w]*):$/},
	{name:'address',    pattern:/^\[([a-zA-Z_][\w]*)\]$/},
	{name:'number',     pattern:/^(\d.*)$/},
	{name:'identifier', pattern:/^([a-zA-Z_][\w]*)$/},
];


/**
 * Finds the first token type that matches the given text.
 *
 * @param   {String} token
 * @returns {Token}
 */
export function lexToken(token) {
	const type = types.find(type => type.pattern.test(token));
	if (!type) throw new Error(`Unknown token, '${token}'`);
	const value = type.pattern.exec(token)[1];
	return {type:type.name, value};
}

/**
 * Lexes assembly code into a stream of blocks of tokens.
 *
 * Returns a list of lines grouped into blocks. Each block contains the tokens
 * lexed for each line. Whitespace is mandatory for separating tokens. Comments
 * and empty lines are discarded at this stage.
 *
 * @param   {String} source
 * @returns {Block[]}
 */
export function lex(source) {
	const lines = source.split('\n');

	return lines.reduce((block, line) => {
		const tokens = line
			.replace(/;.*/gm, '')  // Discard comments
			.replace(/\s+/gm, ' ') // Collapse whitespace
			.trim().split(' ')     // Split by whitespace
			.filter(t => t.length) // Discard empty tokens
			.map(lexToken);        // Lex each token

		return tokens.length
			? [...block, tokens]
			: block; // Discard empty blocks
	}, []);
}

/**
 * Parses a list of blocks into a list of instructions.
 *
 * Each block represents a line of source code, and may contain a label,
 * an instruction followed by zero or more operands, and a comment,
 * in this order.
 *
 * Returns a list of instructions, one for each block, as abstract syntax.
 *
 * @param   {Block[]} blocks
 * @returns {AST}
 */
export function parse(blocks) {
	return blocks.map(block => {
		block = [...block];
		const instr = {};

		// Labels can only occur in first position
		if (block[0].type === 'label') {
			instr.label = block[0].value;
			block.shift();
		}

		// First or second position must be identifier
		// and is always treated as the instruction
		if (block[0].type === 'identifier') {
			instr.type = block[0].value;
			block.shift();
		} else {
			throw new Error(`Expected instruction, found '${block.value}'`);
		}

		// Operands take the rest of the block
		instr.operands = block;
		return instr;
	});
}

/**
 * Shortcut for perform both lexing and parsing in one step.
 *
 * @param   {String} source
 * @returns {AST}
 */
export function parseSource(source) {
	return parse(lex(source));
}
