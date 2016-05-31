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
const tokenTypes = [
	{name:'eol',        skip:false, pattern:/^\n+/},
	{name:'whitespace', skip:true,  pattern:/^\s+/},
	{name:'number',     skip:false, pattern:/^(\d+)/},
	{name:'string',     skip:false, pattern:/^"((?:[^"\\]|\\.)*)"/},
	{name:'address',    skip:false, pattern:/^\[([a-zA-Z_][\w]*)\]/},
	{name:'label',      skip:false, pattern:/^([a-zA-Z_][\w]*):/},
	{name:'identifier', skip:false, pattern:/^([a-zA-Z_][\w]*)/},
	{name:'comment',    skip:true,  pattern:/^;.*/},
];

/**
 * Finds the first token type that matches the beginning of the source.
 *
 * @param   {String} source
 * @returns {Token?}
 */
export function lexToken(source) {
	const type = tokenTypes.find(type => type.pattern.test(source));
	if (!type) throw new Error(`Invalid expression '${source.slice(0, 20)}...'`);
	const [literal, value] = type.pattern.exec(source);
	return {type:type.name, literal, value, skip:type.skip};
}

/**
 * Lexes source code into a list of tokens.
 *
 * @param   {String} source
 * @returns {Token[]}
 */
export function lex(source) {
	const tokens = [];
	while (source.length) {
		const token = lexToken(source);
		source = source.slice(token.literal.length);
		if (!token.skip) tokens.push(token);
	}
	return tokens;
}

/**
 * Parses a list of tokens into a list of instructions.
 *
 * Each line of source code may contain a label, an instruction followed by
 * zero or more operands, and a comment, in this order.
 *
 * Returns a list of instructions, one for each line, as abstract syntax.
 *
 * @param   {Token[]} tokens
 * @returns {AST}
 */
export function parse(tokens) {
	// Chunk tokens into blocks of code describing
	// the same operation (ie. separated by EOL)
	const blocks = tokens.reduce((blocks, token) => {
		if (token.type === 'eol') {
			return [...blocks, []];
		} else {
			blocks[blocks.length-1].push(token);
			return blocks;
		}
	}, [[]]).filter(b => b.length);

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
