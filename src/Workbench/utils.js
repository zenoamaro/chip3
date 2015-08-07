/**
 * Workbench-related utilities.
 *
 * @module Workbench/utils
 */


/**
 * Clamps a value inside the given bounds, inclusive.
 *
 * @param    {Number} min
 * @param    {Number} x
 * @param    {Number} max
 * @returns  {Number}
 */
export function clamp(min, x, max) {
	return Math.max(min, Math.min(x, max));
}

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