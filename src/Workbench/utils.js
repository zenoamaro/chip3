/**
 * Workbench-related utilities.
 *
 * @module Workbench/utils
 */


/**
 * Clamps a value inside the given bounds, inclusive.
 *
 * @param    {Number} [min=0]
 * @param    {Number} x
 * @param    {Number} [max=Infinity]
 * @returns  {Number}
 */
export function clamp(min=0, x, max=Infinity) {
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
 * Optionally, specify printable characters to represent the states.
 *
 * @method  bitArray
 * @param   {Number} x
 * @param   {Number} [len=8]
 * @param   {Any} [off=0]
 * @param   {Any} [on=1]
 * @returns {Array}
 */
export function bitArray(x, len=8, off=0, on=1) {
	const digits = [128, 64, 32, 16, 8, 4, 2, 1].slice(len * -1);
	/* eslint-disable no-bitwise */
	return digits.map(d => (x & d) > 0? on : off);
	/* eslint-enable no-bitwise */
}

/**
 * Converts a byte to string of bits.
 *
 * Optionally, specify printable characters to represent the states.
 *
 * @param   {Number} x
 * @param   {Number} [len]
 * @param   {Any} [off='0']
 * @param   {Any} [on='1']
 * @returns {String}
 */
export function bitString(x, len, off='0', on='1') {
	return bitArray(x, len, off, on).join('');
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
		`CHAR=${String.fromCharCode(x)}`,
	].join(' ');
}
