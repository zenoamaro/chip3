/**
 * Workbench-related utilities.
 *
 * @module Workbench/utils
 */


/**
 * Converts a byte to an array of bits.
 *
 * @method  bitArray
 * @param   {Number} x
 * @returns {Array}
 */
export function bitArray(x) {
	const digits = [ 128, 64, 32, 16, 8, 4, 2, 1 ];
	return digits.map(d => (x & d) > 0? 1 : 0);
}
