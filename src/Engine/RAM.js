/**
 * Functions to create and operate on blocks of RAM.
 *
 * @module Engine/RAM
 */


/**
 * A block of random-access memory.
 *
 * @typedef  {Object}   RAM
 * @property {Boolean}  rst
 * @property {Boolean}  read
 * @property {Boolean}  write
 * @property {Number}   size
 * @property {Array}    data
 * @property {Number}   ar
 * @property {Number}   dr
 */


/**
 * Create an empty RAM block.
 *
 * @method create
 * @returns {RAM}
 */
export function create() {
	return {
		rst: false,
		read: false,
		write: false,
		size: 0b100000,
		data: new Array(0b100000),
		ar: 0,
		dr: 0,
	};
}

/**
 * Executes one RAM cycle, returning the new state.
 *
 * @param   {RAM} state
 * @returns {RAM}
 */
export function cycle(state) {
	return { ...state };
}

/**
 * Returns an overview of the state of a RAM as text.
 *
 * @param   {RAM} state
 * @returns {String}
 */
export function toString(state) {
	const rst = state.rst? 'yes' : 'no';
	const read = state.read? 'yes' : 'no';
	const write = state.write? 'yes' : 'no';
	const {ar, dr} = state;
	return `RAM RST:${rst} READ:${read} WRITE:${write} AR:${ar} DR:${dr}`;
}
