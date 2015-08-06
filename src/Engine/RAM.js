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
		data: new Array(0b100000).fill(0),
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
	var receiver;
	switch (true) {
		case state.rst:   receiver = create; break;
		case state.read:  receiver = read; break;
		case state.write: receiver = write; break;
		default:          return { ...state };
	}
	return { ...state, ...receiver(state) };
}

/**
 * Reads the memory location pointed by the address register, and
 * produces its contents on the data register.
 *
 * @param   {RAM} state
 * @returns {RAM}
 */
function read(state) {
	const ar = state.ar;
	const dr = state.data[ar];
	return { ar, dr };
}

/**
 * Writes the contents of the data register to the memory location
 * pointed by the address register.
 *
 * @param   {RAM} state
 * @returns {RAM}
 */
function write(state) {
	const {ar, dr} = state;
	var data = state.data.slice();
	data[ar] = dr; // This ruins my feng shui
	return { data };
}

/**
 * Returns an overview of the state of a RAM as text.
 *
 * @param   {RAM} state
 * @returns {String}
 */
export function toString(state) {
	const rst = state.rst? 'on' : 'off';
	const read = state.read? 'on' : 'off';
	const write = state.write? 'on' : 'off';
	const {ar, dr} = state;
	return `RAM RST:${rst} READ:${read} WRITE:${write} AR:${ar} DR:${dr}`;
}
