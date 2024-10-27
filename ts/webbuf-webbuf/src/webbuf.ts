import {
  encode_base64,
  decode_base64,
  decode_base64_strip_whitespace,
  encode_hex,
  decode_hex,
} from "./rs-webbuf-inline-base64/webbuf.js";

function verifyOffset(offset: number, ext: number, length: number) {
  if (offset % 1 !== 0 || offset < 0) {
    throw new Error("offset is not uint");
  }
  if (offset + ext > length) {
    throw new Error("Trying to access beyond buffer length");
  }
}

function verifySize(
  buf: WebBuf,
  value: number | bigint,
  offset: number,
  ext: number,
  max: number | bigint,
  min: number | bigint,
) {
  if (value > max || value < min) {
    throw new Error('"value" argument is out of bounds');
  }
  if (offset + ext > buf.length) {
    throw new Error("Index out of range");
  }
}

export class WebBuf extends Uint8Array {
  static concat(list: Uint8Array[]) {
    const size = list.reduce((acc, buf) => acc + buf.length, 0);
    const result = new WebBuf(size);
    let offset = 0;
    for (const buf of list) {
      result.set(buf, offset);
      offset += buf.length;
    }
    return result;
  }

  static alloc(size: number, fill = 0) {
    const buf = new WebBuf(size);
    if (fill !== 0) {
      buf.fill(fill);
    }
    return buf;
  }

  fill(value: number, start = 0, end = this.length) {
    for (let i = start; i < end; i++) {
      this[i] = value;
    }
    return this;
  }

  // Override slice method to return WebBuf instead of Uint8Array
  slice(start?: number, end?: number): WebBuf {
    const slicedArray = super.slice(start, end); // Create a slice using Uint8Array's slice method
    return new WebBuf(
      slicedArray.buffer,
      slicedArray.byteOffset,
      slicedArray.byteLength,
    ); // Return a WebBuf instead
  }

  subarray(start?: number, end?: number): WebBuf {
    const subArray = super.subarray(start, end);
    return new WebBuf(
      subArray.buffer,
      subArray.byteOffset,
      subArray.byteLength,
    );
  }

  clone() {
    return new WebBuf(this);
  }

  copy(
    target: WebBuf,
    targetStart = 0,
    sourceStart = 0,
    sourceEnd = this.length,
  ) {
    if (sourceStart >= sourceEnd) {
      return 0;
    }
    if (targetStart >= target.length) {
      throw new Error("targetStart out of bounds");
    }
    if (sourceEnd > this.length) {
      throw new Error("sourceEnd out of bounds");
    }
    if (targetStart + sourceEnd - sourceStart > target.length) {
      throw new Error("source is too large");
    }

    target.set(this.subarray(sourceStart, sourceEnd), targetStart);
    return sourceEnd - sourceStart;
  }

  /**
   * Return a WebBuf that is a view of the same data as the input Uint8Array
   *
   * @param buffer
   * @returns WebBuf
   */
  static view(buffer: Uint8Array) {
    return new WebBuf(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  static fromArray(array: number[]) {
    return new WebBuf(array);
  }

  static fromString(str: string) {
    const encoder = new TextEncoder();
    return new WebBuf(encoder.encode(str));
  }

  // we use wasm for big data, because small data is faster in js

  // experiments show wasm is always faster
  static FROM_BASE64_ALGO_THRESHOLD = 10; // str len

  // experiments show wasm is always faster
  static TO_BASE64_ALGO_THRESHOLD = 10; // buf len

  // experimentally derived for optimal performance
  static FROM_HEX_ALGO_THRESHOLD = 1_000; // str len

  // experiments show wasm is always faster
  static TO_HEX_ALGO_THRESHOLD = 10; // buf len

  static fromHexPureJs(hex: string): WebBuf {
    const result = new WebBuf(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      result[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
    }
    return result;
  }

  static fromHexWasm(hex: string): WebBuf {
    const uint8array = decode_hex(hex);
    return new WebBuf(
      uint8array.buffer,
      uint8array.byteOffset,
      uint8array.byteLength,
    );
  }

  static fromHex(hex: string): WebBuf {
    if (hex.length % 2 !== 0) {
      throw new Error("Invalid hex string");
    }
    if (hex.length < WebBuf.FROM_HEX_ALGO_THRESHOLD) {
      return WebBuf.fromHexPureJs(hex);
    }
    return WebBuf.fromHexWasm(hex);
  }

  toHexPureJs(): string {
    return Array.from(this)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  toHexWasm(): string {
    return encode_hex(this);
  }

  toHex(): string {
    // disabled: experiments show this is not faster, even for small buffers
    // if (this.length < WebBuf.TO_HEX_ALGO_THRESHOLD) {
    //   return this.toHexPureJs();
    // }
    return this.toHexWasm();
  }

  static fromBase64PureJs(b64: string, stripWhitespace = false): WebBuf {
    const uint8array = new Uint8Array(
      atob(stripWhitespace ? b64.replace(/\s+/g, "") : b64)
        .split("")
        .map((c) => c.charCodeAt(0)),
    );
    return new WebBuf(
      uint8array.buffer,
      uint8array.byteOffset,
      uint8array.byteLength,
    );
  }

  static fromBase64Wasm(b64: string, stripWhitespace = false): WebBuf {
    const uint8array = stripWhitespace
      ? decode_base64_strip_whitespace(b64)
      : decode_base64(b64);
    return new WebBuf(
      uint8array.buffer,
      uint8array.byteOffset,
      uint8array.byteLength,
    );
  }

  /**
   * Convert a base64 string to a Uint8Array. Tolerant of whitespace, but
   * throws if the string has invalid characters.
   *
   * @param b64
   * @returns Uint8Array
   * @throws {Error} if the input string is not valid base64
   */
  static fromBase64(b64: string, stripWhitespace = false): WebBuf {
    // disabled: experiments show this is not faster, even for small buffers
    // if (b64.length < WebBuf.FROM_BASE64_ALGO_THRESHOLD) {
    //   return WebBuf.fromBase64PureJs(b64, stripWhitespace);
    // }
    return WebBuf.fromBase64Wasm(b64, stripWhitespace);
  }

  toBase64PureJs(): string {
    return btoa(String.fromCharCode(...new Uint8Array(this)));
  }

  toBase64Wasm(): string {
    return encode_base64(this);
  }

  toBase64() {
    // disabled: experiments show this is not faster, even for small buffers
    // if (this.length < WebBuf.TO_BASE64_ALGO_THRESHOLD) {
    //   return this.toBase64PureJs();
    // }
    return this.toBase64Wasm();
  }

  /**
   * Override Uint8Array.from to return a WebBuf
   *
   * @param source An array-like or iterable object to convert to WebBuf
   * @param mapFn Optional map function to call on every element of the array
   * @param thisArg Optional value to use as `this` when executing `mapFn`
   * @returns WebBuf
   */
  static from(
    source: ArrayLike<number> | Iterable<number> | string,
    mapFn?: ((v: number, k: number) => number) | string,
    // biome-ignore lint:
    thisArg?: any,
  ): WebBuf {
    if (typeof mapFn === "string") {
      if (typeof source !== "string") {
        throw new TypeError("Invalid mapFn");
      }
      if (mapFn === "hex") {
        return WebBuf.fromHex(source);
      }
      if (mapFn === "base64") {
        return WebBuf.fromBase64(source);
      }
      if (mapFn === "utf8") {
        return WebBuf.fromString(source);
      }
      throw new TypeError("Invalid mapFn");
    }
    if (typeof source === "string") {
      return WebBuf.fromString(source);
    }
    if (source instanceof Uint8Array) {
      return WebBuf.view(source);
    }
    const sourceArray = Array.from(source);
    // biome-ignore lint:
    const uint8Array = super.from(sourceArray, mapFn, thisArg);
    return new WebBuf(
      uint8Array.buffer,
      uint8Array.byteOffset,
      uint8Array.byteLength,
    );
  }

  toString(encoding?: "utf8" | "hex" | "base64") {
    if (encoding === "hex") {
      return this.toHex();
    }
    if (encoding === "base64") {
      return this.toBase64();
    }
    if (encoding === "utf8") {
      const decoder = new TextDecoder();
      return decoder.decode(this);
    }
    const decoder = new TextDecoder();
    return decoder.decode(this);
  }

  toArray() {
    return Array.from(this);
  }

  compare(other: WebBuf): number {
    const len = Math.min(this.length, other.length);

    for (let i = 0; i < len; i++) {
      if (this[i] !== other[i]) {
        return (this[i] as number) < (other[i] as number) ? -1 : 1;
      }
    }

    if (this.length < other.length) {
      return -1;
    }
    if (this.length > other.length) {
      return 1;
    }

    return 0;
  }

  static compare(buf1: WebBuf, buf2: WebBuf): number {
    return buf1.compare(buf2);
  }

  equals(other: WebBuf): boolean {
    return this.compare(other) === 0;
  }

  readUintLE(byteLength: number, offset = 0): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let value = this[offset] as number;
    let multiplier = 1;
    for (let i = 1; i < byteLength; i++) {
      multiplier *= 0x100;
      value += (this[offset + i] as number) * multiplier;
    }

    return value;
  }

  readUintBE(byteLength: number, offset = 0): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let value = this[offset + byteLength - 1] as number;
    let multiplier = 1;
    for (let i = byteLength - 2; i >= 0; i--) {
      multiplier *= 0x100;
      value += (this[offset + i] as number) * multiplier;
    }

    return value;
  }

  readBigUintLE(byteLength: number, offset = 0): bigint {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let value = BigInt(this[offset] as number);
    let multiplier = 1n;
    for (let i = 1; i < byteLength; i++) {
      multiplier *= 0x100n;
      value += BigInt(this[offset + i] as number) * multiplier;
    }

    return value;
  }

  readBigUintBE(byteLength: number, offset = 0): bigint {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let value = BigInt(this[offset + byteLength - 1] as number);
    let multiplier = 1n;
    for (let i = byteLength - 2; i >= 0; i--) {
      multiplier *= 0x100n;
      value += BigInt(this[offset + i] as number) * multiplier;
    }

    return value;
  }

  readIntLE(byteLength: number, offset = 0): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let value = this[offset] as number;
    let multiplier = 1;
    for (let i = 1; i < byteLength; i++) {
      multiplier *= 0x100;
      value += (this[offset + i] as number) * multiplier;
    }
    multiplier *= 0x80;

    if (value >= multiplier) {
      value -= 2 ** (8 * byteLength);
    }

    return value;
  }

  readIntBE(byteLength: number, offset = 0): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let value = this[offset + byteLength - 1] as number;
    let multiplier = 1;
    for (let i = byteLength - 2; i >= 0; i--) {
      multiplier *= 0x100;
      value += (this[offset + i] as number) * multiplier;
    }
    multiplier *= 0x80;

    if (value >= multiplier) {
      value -= 2 ** (8 * byteLength);
    }

    return value;
  }

  readBigIntLE(byteLength: number, offset = 0): bigint {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let value = BigInt(this[offset] as number);
    let multiplier = 1n;
    for (let i = 1; i < byteLength; i++) {
      multiplier *= 0x100n;
      value += BigInt(this[offset + i] as number) * multiplier;
    }
    multiplier *= 0x80n;

    if (value >= multiplier) {
      value -= 1n << BigInt(8 * byteLength);
    }

    return value;
  }

  readBigIntBE(byteLength: number, offset = 0): bigint {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let value = BigInt(this[offset + byteLength - 1] as number);
    let multiplier = 1n;
    for (let i = byteLength - 2; i >= 0; i--) {
      multiplier *= 0x100n;
      value += BigInt(this[offset + i] as number) * multiplier;
    }
    multiplier *= 0x80n;

    if (value >= multiplier) {
      value -= 1n << BigInt(8 * byteLength);
    }

    return value;
  }

  writeUintLE(value: number, byteLength: number, offset = 0): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let i = 0;
    this[offset] = value & 0xff;
    while (++i < byteLength) {
      (this[offset + i] as number) = (value >>> (i * 8)) & 0xff;
    }

    return offset + byteLength;
  }

  writeUintBE(value: number, byteLength: number, offset = 0): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let i = byteLength - 1;
    (this[offset + i] as number) = value & 0xff;
    while (i > 0) {
      i--;
      (this[offset + i] as number) =
        (value >>> ((byteLength - 1 - i) * 8)) & 0xff;
    }

    return offset + byteLength;
  }

  writeBigUintLE(value: bigint, byteLength: number, offset = 0): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let i = 0;
    this[offset] = Number(value & 0xffn);
    while (++i < byteLength) {
      (this[offset + i] as number) = Number((value >> BigInt(i * 8)) & 0xffn);
    }

    return offset + byteLength;
  }

  writeBigUintBE(value: bigint, byteLength: number, offset = 0): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let i = byteLength - 1;
    (this[offset + i] as number) = Number(value & 0xffn);
    while (i > 0) {
      i--;
      (this[offset + i] as number) = Number(
        (value >> BigInt((byteLength - 1 - i) * 8)) & 0xffn,
      );
    }

    return offset + byteLength;
  }

  writeIntLE(value: number, byteLength: number, offset = 0): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let i = 0;
    this[offset] = value & 0xff;
    while (++i < byteLength) {
      (this[offset + i] as number) = (value >> (i * 8)) & 0xff;
    }

    return offset + byteLength;
  }

  writeIntBE(value: number, byteLength: number, offset = 0): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let i = byteLength - 1;
    (this[offset + i] as number) = value & 0xff;
    while (i > 0) {
      i--;
      (this[offset + i] as number) =
        (value >> ((byteLength - 1 - i) * 8)) & 0xff;
    }

    return offset + byteLength;
  }

  writeBigIntLE(value: bigint, byteLength: number, offset = 0): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let i = 0;
    this[offset] = Number(value & 0xffn);
    while (++i < byteLength) {
      (this[offset + i] as number) = Number((value >> BigInt(i * 8)) & 0xffn);
    }

    return offset + byteLength;
  }

  writeBigIntBE(value: bigint, byteLength: number, offset = 0): number {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    verifyOffset(offset, byteLength, this.length);

    let i = byteLength - 1;
    (this[offset + i] as number) = Number(value & 0xffn);
    while (i > 0) {
      i--;
      (this[offset + i] as number) = Number(
        (value >> BigInt((byteLength - 1 - i) * 8)) & 0xffn,
      );
    }

    return offset + byteLength;
  }

  readUint8(offset = 0): number {
    verifySize(this, 0xff, offset, 1, 0xff, 0);
    return this.readUintLE(1, offset);
  }

  readUint16LE(offset = 0): number {
    verifySize(this, 0xffff, offset, 2, 0xffff, 0);
    return this.readUintLE(2, offset);
  }

  readUint16BE(offset = 0): number {
    verifySize(this, 0xffff, offset, 2, 0xffff, 0);
    return this.readUintBE(2, offset);
  }

  readUint32LE(offset = 0): number {
    verifySize(this, 0xffffffff, offset, 4, 0xffffffff, 0);
    return this.readUintLE(4, offset);
  }

  readUint32BE(offset = 0): number {
    verifySize(this, 0xffffffff, offset, 4, 0xffffffff, 0);
    return this.readUintBE(4, offset);
  }

  readBigUint64LE(offset = 0): bigint {
    verifySize(this, 0xffffffffffffffffn, offset, 8, 0xffffffffffffffffn, 0n);
    return this.readBigUintLE(8, offset);
  }

  readBigUint64BE(offset = 0): bigint {
    verifySize(this, 0xffffffffffffffffn, offset, 8, 0xffffffffffffffffn, 0n);
    return this.readBigUintBE(8, offset);
  }

  readBigUint128LE(offset = 0): bigint {
    verifySize(
      this,
      0xffffffffffffffffffffffffffffffffn,
      offset,
      16,
      0xffffffffffffffffffffffffffffffffn,
      0n,
    );
    return this.readBigUintLE(16, offset);
  }

  readBigUint128BE(offset = 0): bigint {
    verifySize(
      this,
      0xffffffffffffffffffffffffffffffffn,
      offset,
      16,
      0xffffffffffffffffffffffffffffffffn,
      0n,
    );
    return this.readBigUintBE(16, offset);
  }

  readBigUint256LE(offset = 0): bigint {
    verifySize(
      this,
      0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      offset,
      32,
      0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      0n,
    );
    return this.readBigUintLE(32, offset);
  }

  readBigUint256BE(offset = 0): bigint {
    verifySize(
      this,
      0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      offset,
      32,
      0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      0n,
    );
    return this.readBigUintBE(32, offset);
  }

  readInt8(offset = 0): number {
    verifySize(this, 0x7f, offset, 1, 0x7f, -0x80);
    return this.readIntLE(1, offset);
  }

  readInt16LE(offset = 0): number {
    verifySize(this, 0x7fff, offset, 2, 0x7fff, -0x8000);
    return this.readIntLE(2, offset);
  }

  readInt16BE(offset = 0): number {
    verifySize(this, 0x7fff, offset, 2, 0x7fff, -0x8000);
    return this.readIntBE(2, offset);
  }

  readInt32LE(offset = 0): number {
    verifySize(this, 0x7fffffff, offset, 4, 0x7fffffff, -0x80000000);
    return this.readIntLE(4, offset);
  }

  readInt32BE(offset = 0): number {
    verifySize(this, 0x7fffffff, offset, 4, 0x7fffffff, -0x80000000);
    return this.readIntBE(4, offset);
  }

  readBigInt64LE(offset = 0): bigint {
    verifySize(
      this,
      0x7fffffffffffffffn,
      offset,
      8,
      0x7fffffffffffffffn,
      -0x8000000000000000n,
    );
    return this.readBigIntLE(8, offset);
  }

  readBigInt64BE(offset = 0): bigint {
    verifySize(
      this,
      0x7fffffffffffffffn,
      offset,
      8,
      0x7fffffffffffffffn,
      -0x8000000000000000n,
    );
    return this.readBigIntBE(8, offset);
  }

  readBigInt128LE(offset = 0): bigint {
    verifySize(
      this,
      0x7fffffffffffffffffffffffffffffffn,
      offset,
      16,
      0x7fffffffffffffffffffffffffffffffn,
      -0x80000000000000000000000000000000n,
    );
    return this.readBigIntLE(16, offset);
  }

  readBigInt128BE(offset = 0): bigint {
    verifySize(
      this,
      0x7fffffffffffffffffffffffffffffffn,
      offset,
      16,
      0x7fffffffffffffffffffffffffffffffn,
      -0x80000000000000000000000000000000n,
    );
    return this.readBigIntBE(16, offset);
  }

  readBigInt256LE(offset = 0): bigint {
    verifySize(
      this,
      0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      offset,
      32,
      0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      -0x80000000000000000000000000000000000000000000000000000000000000000n,
    );
    return this.readBigIntLE(32, offset);
  }

  readBigInt256BE(offset = 0): bigint {
    verifySize(
      this,
      0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      offset,
      32,
      0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      -0x80000000000000000000000000000000000000000000000000000000000000000n,
    );
    return this.readBigIntBE(32, offset);
  }

  writeUint8(value: number, offset = 0): number {
    verifySize(this, value, offset, 1, 0xff, 0);
    return this.writeUintLE(value, 1, offset);
  }

  writeUint16LE(value: number, offset = 0): number {
    verifySize(this, value, offset, 2, 0xffff, 0);
    return this.writeUintLE(value, 2, offset);
  }

  writeUint16BE(value: number, offset = 0): number {
    verifySize(this, value, offset, 2, 0xffff, 0);
    return this.writeUintBE(value, 2, offset);
  }

  writeUint32LE(value: number, offset = 0): number {
    verifySize(this, value, offset, 4, 0xffffffff, 0);
    return this.writeUintLE(value, 4, offset);
  }

  writeUint32BE(value: number, offset = 0): number {
    verifySize(this, value, offset, 4, 0xffffffff, 0);
    return this.writeUintBE(value, 4, offset);
  }

  writeBigUint64LE(value: bigint, offset = 0): number {
    verifySize(this, value, offset, 8, 0xffffffffffffffffn, 0n);
    return this.writeBigUintLE(value, 8, offset);
  }

  writeBigUint64BE(value: bigint, offset = 0): number {
    verifySize(this, value, offset, 8, 0xffffffffffffffffn, 0n);
    return this.writeBigUintBE(value, 8, offset);
  }

  writeBigUint128LE(value: bigint, offset = 0): number {
    verifySize(
      this,
      value,
      offset,
      16,
      0xffffffffffffffffffffffffffffffffn,
      0n,
    );
    return this.writeBigUintLE(value, 16, offset);
  }

  writeBigUint128BE(value: bigint, offset = 0): number {
    verifySize(
      this,
      value,
      offset,
      16,
      0xffffffffffffffffffffffffffffffffn,
      0n,
    );
    return this.writeBigUintBE(value, 16, offset);
  }

  writeBigUint256LE(value: bigint, offset = 0): number {
    verifySize(
      this,
      value,
      offset,
      32,
      0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      0n,
    );
    return this.writeBigUintLE(value, 32, offset);
  }

  writeBigUint256BE(value: bigint, offset = 0): number {
    verifySize(
      this,
      value,
      offset,
      32,
      0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      0n,
    );
    return this.writeBigUintBE(value, 32, offset);
  }

  writeInt8(value: number, offset = 0): number {
    verifySize(this, value, offset, 1, 0x7f, -0x80);
    return this.writeIntLE(value, 1, offset);
  }

  writeInt16LE(value: number, offset = 0): number {
    verifySize(this, value, offset, 2, 0x7fff, -0x8000);
    return this.writeIntLE(value, 2, offset);
  }

  writeInt16BE(value: number, offset = 0): number {
    verifySize(this, value, offset, 2, 0x7fff, -0x8000);
    return this.writeIntBE(value, 2, offset);
  }

  writeInt32LE(value: number, offset = 0): number {
    verifySize(this, value, offset, 4, 0x7fffffff, -0x80000000);
    return this.writeIntLE(value, 4, offset);
  }

  writeInt32BE(value: number, offset = 0): number {
    verifySize(this, value, offset, 4, 0x7fffffff, -0x80000000);
    return this.writeIntBE(value, 4, offset);
  }

  writeBigInt64LE(value: bigint, offset = 0): number {
    verifySize(
      this,
      value,
      offset,
      8,
      0x7fffffffffffffffn,
      -0x8000000000000000n,
    );
    return this.writeBigIntLE(value, 8, offset);
  }

  writeBigInt64BE(value: bigint, offset = 0): number {
    verifySize(
      this,
      value,
      offset,
      8,
      0x7fffffffffffffffn,
      -0x8000000000000000n,
    );
    return this.writeBigIntBE(value, 8, offset);
  }

  writeBigInt128LE(value: bigint, offset = 0): number {
    verifySize(
      this,
      value,
      offset,
      16,
      0x7fffffffffffffffffffffffffffffffn,
      -0x80000000000000000000000000000000n,
    );
    return this.writeBigIntLE(value, 16, offset);
  }

  writeBigInt128BE(value: bigint, offset = 0): number {
    verifySize(
      this,
      value,
      offset,
      16,
      0x7fffffffffffffffffffffffffffffffn,
      -0x80000000000000000000000000000000n,
    );
    return this.writeBigIntBE(value, 16, offset);
  }

  writeBigInt256LE(value: bigint, offset = 0): number {
    verifySize(
      this,
      value,
      offset,
      32,
      0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      -0x80000000000000000000000000000000000000000000000000000000000000000n,
    );
    return this.writeBigIntLE(value, 32, offset);
  }

  writeBigInt256BE(value: bigint, offset = 0): number {
    verifySize(
      this,
      value,
      offset,
      32,
      0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      -0x80000000000000000000000000000000000000000000000000000000000000000n,
    );
    return this.writeBigIntBE(value, 32, offset);
  }
}
