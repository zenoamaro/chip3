/**
 * Functions to create and operate on blocks of RAM.
 *
 * @module System/RAM
 */


/**
 * A block of random-access memory.
 *
 * @typedef  {Device}   RAM
 * @property {Boolean}  rst   - Reset flag
 * @property {Boolean}  read  - Read request flag
 * @property {Boolean}  write - Write request flag
 * @property {Number}   size  - Size of memory in words
 * @property {Array}    data  - Memory locations
 * @property {Number}   ar    - Address register
 * @property {Number}   dr    - Data register
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
	let receiver;
	switch (true) {
		case state.rst:   receiver = create; break;
		case state.read:  receiver = read; break;
		case state.write: receiver = write; break;
		default:          return {...state};
	}
	return {...state, ...receiver(state)};
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
	return {ar, dr};
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
	const data = state.data.slice();
	data[ar] = dr; // This ruins my feng shui
	return {data};
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
