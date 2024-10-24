/* tslint:disable */
/* eslint-disable */
/**
 * Encode a byte slice into a base64 string using the default engine
 * @param {Uint8Array} data
 * @returns {string}
 */
export function encode_base64(data: Uint8Array): string;
/**
 * Decode a base64 string into a byte vector
 * Returns an error string if decoding fails
 * @param {string} encoded
 * @returns {string}
 */
export function decode_base64(encoded: string): string;
/**
 * Encode a byte slice into a hex string
 * @param {Uint8Array} data
 * @returns {string}
 */
export function encode_hex(data: Uint8Array): string;
/**
 * Decode a hex string into a regular UTF-8 string
 * Returns an error string if decoding fails or if the decoded data is not valid UTF-8
 * @param {string} encoded
 * @returns {string}
 */
export function decode_hex(encoded: string): string;
