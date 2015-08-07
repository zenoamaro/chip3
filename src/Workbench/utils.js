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
 * Pads a string to a certain length by inserting filler characters on
 * its left, until it matches the requested length.
 *
 * Spaces are filled the specified character. If the requested length is
 * equal or less than the length of the string, the original string will
 * be returned as is. Numbers will be cast to string.
 *
 * @param   {String|Number} x
 * @param   {Number} len
 * @param   {String} [fill='0']
 * @returns {String}
 */
export function padString(x, len, fill='0') {
	while (x.length < len) x = fill + x;
	return x;
}

/**
 * Returns a hex string representation of a number.
 *
 * @param   {Number} x
 * @param   {Number} [pad=2]
 * @returns {String}
 */
export function hexString(x, pad=2) {
	const str = x.toString(16).toUpperCase();
	return `0x${padString(str, pad)}`;
}

/**
 * Converts a byte to an array of bits.
 *
 * @method  bitArray
 * @param   {Number} x
 * @param   {Number} [len=8]
 * @returns {Array}
 */
export function bitArray(x, len=8) {
	const digits = [ 128, 64, 32, 16, 8, 4, 2, 1 ].slice(len * -1);
	return digits.map(d => (x & d) > 0? 1 : 0);
}

/**
 * Converts a byte to string of bits.
 *
 * @param   {Number} x
 * @param   {Number} [len]
 * @returns {String}
 */
export function bitString(x, len) {
	return bitArray(x, len).join('');
}

/**
 * Returns a string with the value displayed in decimal, hexadecimal and
 * binary formats.
 *
 * @param   {Number} x
 * @returns {String}
 */
export function byteFormats(x) {
	return [
		`DEC=${x}`,
		`HEX=${hexString(x)}`,
		`BIN=${bitString(x)}`,
	].join(' ');
}