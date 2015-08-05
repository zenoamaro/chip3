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
