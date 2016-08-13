/**
 * Functions to create and operate on a printer.
 *
 * @module System/Printer
 */


/**
 * A printer in a virgin state.
 *
 * @typedef  {Device}  Printer
 * @property {Boolean}  rst    - Reset flag 
 * @property {Boolean}  output - Output request 
 * @property {Number}   or     - CPU output register 
 * @property {Number[]} paper  - The full printout
 */


/**
 * Create a printer in a virgin state.
 *
 * @method create
 * @returns {Printer}
 */
export function create() {
	return {
		output: false,
    or: 0,
    paper: [],
	};
}

/**
 * Executes one printer cycle, returning the new state.
 *
 * @param   {Printer} state
 * @returns {Printer}
 */
export function cycle(state) {
	let receiver;
	switch (true) {
		case state.rst:    receiver = create; break;
		case state.output: receiver = print; break;
		default:           return {...state};
	}
	return {...state, ...receiver(state)};
}

/**
 * Pushes the value of the output register at the end of the paper,
 * thus simulating a print operation.
 *
 * @param   {Printer} state
 * @returns {Printer}
 */
function print(state) {
	return {
		paper: [
			...state.paper,
			state.or
		],
	};
}

/**
 * Returns an overview of the state of a printer as text.
 *
 * @param   {Printer} state
 * @returns {String}
 */
export function toString(state) {
	const rst = state.rst? 'on' : 'off';
	const output = state.output? 'on' : 'off';
	return `Printer RST:${rst} OUTPUT:${output} OR:${state.or}`;
}
