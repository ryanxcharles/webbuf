const lookup: string[] = [];
const revLookup: number[] = [];

const code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (let i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i] as string;
  revLookup[code.charCodeAt(i)] = i;
}

function checkOffset(offset: number, ext: number, length: number) {
  if (offset % 1 !== 0 || offset < 0) {
    throw new RangeError("offset is not uint");
  }
  if (offset + ext > length) {
    throw new RangeError("Trying to access beyond buffer length");
  }
}

function tripletToBase64(num: number) {
  return (
    (lookup[(num >> 18) & 0x3f] as string) +
    (lookup[(num >> 12) & 0x3f] as string) +
    (lookup[(num >> 6) & 0x3f] as string) +
    (lookup[num & 0x3f] as string)
  );
}

function encodeChunk(uint8: Uint8Array, start: number, end: number) {
  let tmp: number;
  const output = [];
  for (let i = start; i < end; i += 3) {
    tmp =
      (((uint8[i] as number) << 16) & 0xff0000) +
      (((uint8[i + 1] as number) << 8) & 0xff00) +
      ((uint8[i + 2] as number) & 0xff);
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}

function checkInt(
  buf: WebBuf,
  value: number | bigint,
  offset: number,
  ext: number,
  max: number | bigint,
  min: number | bigint,
) {
  if (value > max || value < min) {
    throw new RangeError('"value" argument is out of bounds');
  }
  if (offset + ext > buf.length) {
    throw new RangeError("Index out of range");
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

  static alloc(size: number) {
    return new WebBuf(size);
  }

  fill(value: number, start = 0, end = this.length) {
    for (let i = start; i < end; i++) {
      this[i] = value;
    }
    return this;
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
      throw new RangeError("targetStart out of bounds");
    }
    if (sourceEnd > this.length) {
      throw new RangeError("sourceEnd out of bounds");
    }
    if (targetStart + sourceEnd - sourceStart > target.length) {
      throw new RangeError("source is too large");
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
  static fromUint8Array(buffer: Uint8Array) {
    return new WebBuf(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  }

  static fromArray(array: number[]) {
    return new WebBuf(array);
  }

  static fromString(str: string) {
    const encoder = new TextEncoder();
    return new WebBuf(encoder.encode(str));
  }

  static fromHex(hex: string) {
    const result = new WebBuf(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      result[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
    }
    return result;
  }

  /**
   * Convert a base64 string to a Uint8Array. Tolerant of whitespace, but
   * throws if the string has invalid characters.
   *
   * @param b64
   * @returns Uint8Array
   * @throws {Error} if the input string is not valid base64
   */
  static fromBase64(b64: string) {
    const binary = atob(b64);
    const result = new WebBuf(binary.length);
    for (let i = 0; i < binary.length; i++) {
      result[i] = binary.charCodeAt(i);
    }
    return result;
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
    if (typeof source === "string") {
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
    if (typeof mapFn === "string") {
      throw new TypeError("Invalid mapFn");
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

  toBase64() {
    let tmp: number;
    const len = this.length;
    const extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
    const parts = [];
    const maxChunkLength = 16383; // must be multiple of 3

    // go through the array every three bytes, we'll deal with trailing stuff later
    for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(
        encodeChunk(
          this,
          i,
          i + maxChunkLength > len2 ? len2 : i + maxChunkLength,
        ),
      );
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
      tmp = this[len - 1] as number;
      parts.push(
        `${(lookup[tmp >> 2] as string) + lookup[(tmp << 4) & 0x3f]}==`,
      );
    } else if (extraBytes === 2) {
      tmp = ((this[len - 2] as number) << 8) + (this[len - 1] as number);
      parts.push(
        `${
          (lookup[tmp >> 10] as string) +
          (lookup[(tmp >> 4) & 0x3f] as string) +
          (lookup[(tmp << 2) & 0x3f] as string)
        }=`,
      );
    }

    return parts.join("");
  }

  toString() {
    const decoder = new TextDecoder();
    return decoder.decode(this);
  }

  toHex() {
    return Array.from(this)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
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

  equals(other: WebBuf): boolean {
    return this.compare(other) === 0;
  }
  // read/write binary numbers

  readUintLE(offset: number, byteLength: number) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    checkOffset(offset, byteLength, this.length);

    let val = this[offset] as number;
    let mul = 1;
    let i = 0;
    // biome-ignore lint:
    while (++i < byteLength && (mul *= 0x100)) {
      val += (this[offset + i] as number) * mul;
    }

    return val;
  }

  readUintBE(offset: number, byteLength: number) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    checkOffset(offset, byteLength, this.length);

    let val = this[offset + --byteLength] as number;
    let mul = 1;
    // biome-ignore lint:
    while (byteLength > 0 && (mul *= 0x100)) {
      val += (this[offset + --byteLength] as number) * mul;
    }

    return val;
  }

  readUint8(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 1, this.length);
    return this[offset] as number;
  }

  readUint16LE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 2, this.length);
    return (this[offset] as number) | ((this[offset + 1] as number) << 8);
  }

  readUint16BE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 2, this.length);
    return ((this[offset] as number) << 8) | (this[offset + 1] as number);
  }

  readUint32LE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);

    const lo = this.readUint16LE(offset);
    const hi = this.readUint16LE(offset + 2);
    return lo + hi * 0x10000;
  }

  readUint32BE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);

    const hi = this.readUint16BE(offset);
    const lo = this.readUint16BE(offset + 2);
    return lo + hi * 0x10000;
  }

  readBigUint64LE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);

    const lo = BigInt(this.readUint32LE(offset));
    const hi = BigInt(this.readUint32LE(offset + 4));
    return lo + (hi << 32n);
  }

  readBigUint64BE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);

    const hi = BigInt(this.readUint32BE(offset));
    const lo = BigInt(this.readUint32BE(offset + 4));
    return lo + (hi << 32n);
  }

  readBigUint128LE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 16, this.length);

    const lo = this.readBigUint64LE(offset);
    const hi = this.readBigUint64LE(offset + 8);
    return lo + (hi << 64n);
  }

  readBigUint128BE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 16, this.length);

    const hi = this.readBigUint64BE(offset);
    const lo = this.readBigUint64BE(offset + 8);
    return lo + (hi << 64n);
  }

  readBigUint256LE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 32, this.length);

    const lo = this.readBigUint64LE(offset);
    const hi = this.readBigUint64LE(offset + 8);
    const hi2 = this.readBigUint64LE(offset + 16);
    const hi3 = this.readBigUint64LE(offset + 24);
    return lo + (hi << 64n) + (hi2 << 128n) + (hi3 << 192n);
  }

  readBigUint256BE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 32, this.length);

    const hi3 = this.readBigUint64BE(offset);
    const hi2 = this.readBigUint64BE(offset + 8);
    const hi = this.readBigUint64BE(offset + 16);
    const lo = this.readBigUint64BE(offset + 24);
    return lo + (hi << 64n) + (hi2 << 128n) + (hi3 << 192n);
  }

  readIntLE(offset: number, byteLength: number) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    checkOffset(offset, byteLength, this.length);

    let val = this[offset] as number;
    let mul = 1;
    let i = 0;
    // biome-ignore lint:
    while (++i < byteLength && (mul *= 0x100)) {
      val += (this[offset + i] as number) * mul;
    }
    mul *= 0x80;

    if (val >= mul) {
      val -= 2 ** (8 * byteLength);
    }

    return val;
  }

  readIntBE(offset: number, byteLength: number) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    checkOffset(offset, byteLength, this.length);

    let i = byteLength;
    let mul = 1;
    let val = this[offset + --i] as number;
    // biome-ignore lint:
    while (i > 0 && (mul *= 0x100)) {
      val += (this[offset + --i] as number) * mul;
    }
    mul *= 0x80;

    if (val >= mul) {
      val -= 2 ** (8 * byteLength);
    }

    return val;
  }

  readInt8(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 1, this.length);
    const val = this[offset] as number;
    return val & 0x80 ? val | 0xffffff00 : val;
  }

  readInt16LE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 2, this.length);
    const val = (this[offset] as number) | ((this[offset + 1] as number) << 8);
    return val & 0x8000 ? val | 0xffff0000 : val;
  }

  readInt16BE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 2, this.length);
    const val = ((this[offset] as number) << 8) | (this[offset + 1] as number);
    return val & 0x8000 ? val | 0xffff0000 : val;
  }

  readInt32LE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);
    return (
      (this[offset] as number) |
      ((this[offset + 1] as number) << 8) |
      ((this[offset + 2] as number) << 16) |
      ((this[offset + 3] as number) << 24)
    );
  }

  readInt32BE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);
    return (
      ((this[offset] as number) << 24) |
      ((this[offset + 1] as number) << 16) |
      ((this[offset + 2] as number) << 8) |
      (this[offset + 3] as number)
    );
  }

  readBigInt64LE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);

    const lo = this.readUint32LE(offset);
    const hi = this.readInt32LE(offset + 4);
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
  }

  readBigInt64BE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);

    const lo = this.readUint32BE(offset + 4);
    const hi = this.readInt32BE(offset);
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
  }

  readBigInt128LE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 16, this.length);

    const lo = this.readBigUint64LE(offset);
    const hi = this.readBigInt64LE(offset + 8);
    return lo + (hi << BigInt(64));
  }

  readBigInt128BE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 16, this.length);

    const lo = this.readBigUint64BE(offset + 8);
    const hi = this.readBigInt64BE(offset);
    return lo + (hi << 64n);
  }

  readBigInt256LE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 32, this.length);

    const lo = this.readBigUint64LE(offset);
    const hi = this.readBigUint64LE(offset + 8);
    const hi2 = this.readBigUint64LE(offset + 16);
    const hi3 = this.readBigInt64LE(offset + 24);
    return lo + (hi << 64n) + (hi2 << 128n) + (hi3 << 192n);
  }

  readBigInt256BE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 32, this.length);

    const hi3 = this.readBigInt64BE(offset);
    const hi2 = this.readBigUint64BE(offset + 8);
    const hi = this.readBigUint64BE(offset + 16);
    const lo = this.readBigUint64BE(offset + 24);
    return lo + (hi << 64n) + (hi2 << 128n) + (hi3 << 192n);
  }

  // writing numbers

  writeUintLE(value: number, offset: number, byteLength: number) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    checkOffset(offset, byteLength, this.length);

    let mul = 1;
    let i = 0;
    this[offset] = value & 0xff;
    // biome-ignore lint:
    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xff;
    }

    return offset + byteLength;
  }

  writeUintBE(value: number, offset: number, byteLength: number) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    checkOffset(offset, byteLength, this.length);

    let i = byteLength - 1;
    let mul = 1;
    this[offset + i] = value & 0xff;
    // biome-ignore lint:
    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xff;
    }

    return offset + byteLength;
  }

  writeUint8(value: number, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 1, this.length);
    checkInt(this, value, offset, 1, 0xff, 0);
    this[offset] = value & 0xff;
    return offset + 1;
  }

  writeUint16LE(value: number, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 2, this.length);
    checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = value & 0xff;
    this[offset + 1] = (value >>> 8) & 0xff;
    return offset + 2;
  }

  writeUint16BE(value: number, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 2, this.length);
    checkInt(this, value, offset, 2, 0xffff, 0);
    this[offset] = (value >>> 8) & 0xff;
    this[offset + 1] = value & 0xff;
    return offset + 2;
  }

  writeUint32LE(value: number, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);
    checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset] = value & 0xff;
    this[offset + 1] = (value >>> 8) & 0xff;
    this[offset + 2] = (value >>> 16) & 0xff;
    this[offset + 3] = (value >>> 24) & 0xff;
    return offset + 4;
  }

  writeUint32BE(value: number, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);
    checkInt(this, value, offset, 4, 0xffffffff, 0);
    this[offset] = (value >>> 24) & 0xff;
    this[offset + 1] = (value >>> 16) & 0xff;
    this[offset + 2] = (value >>> 8) & 0xff;
    this[offset + 3] = value & 0xff;
    return offset + 4;
  }

  writeBigUint64LE(value: bigint, offset: number) {
    value = BigInt(value);
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);
    checkInt(this, value, offset, 8, 0xffffffffffffffffn, 0n);
    this.writeUint32LE(Number(value & 0xffffffffn), offset);
    this.writeUint32LE(Number((value >> 32n) & 0xffffffffn), offset + 4);
    return offset + 8;
  }

  writeBigUint64BE(value: bigint, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);
    checkInt(this, value, offset, 8, 0xffffffffffffffffn, 0n);
    this.writeUint32BE(Number(value >> 32n), offset);
    this.writeUint32BE(Number(value & 0xffffffffn), offset + 4);
    return offset + 8;
  }

  writeBigUint128LE(value: bigint, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 16, this.length);
    checkInt(this, value, offset, 16, 0xffffffffffffffffffffffffffffffffn, 0n);
    this.writeBigUint64LE(value & 0xffffffffffffffffn, offset);
    this.writeBigUint64LE(value >> 64n, offset + 8);
    return offset + 16;
  }

  writeBigUint128BE(value: bigint, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 16, this.length);
    checkInt(this, value, offset, 16, 0xffffffffffffffffffffffffffffffffn, 0n);
    this.writeBigUint64BE(value >> 64n, offset);
    this.writeBigUint64BE(value & 0xffffffffffffffffn, offset + 8);
    return offset + 16;
  }

  writeBigUint256LE(value: bigint, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 32, this.length);
    checkInt(
      this,
      value,
      offset,
      32,
      0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      0n,
    );
    this.writeBigUint64LE(value & 0xffffffffffffffffn, offset);
    this.writeBigUint64LE(value >> 64n, offset + 8);
    this.writeBigUint64LE(value >> 128n, offset + 16);
    this.writeBigUint64LE(value >> 192n, offset + 24);
    return offset + 32;
  }

  writeBigUint256BE(value: bigint, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 32, this.length);
    checkInt(
      this,
      value,
      offset,
      32,
      0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      0n,
    );
    this.writeBigUint64BE(value >> 192n, offset);
    this.writeBigUint64BE(value >> 128n, offset + 8);
    this.writeBigUint64BE(value >> 64n, offset + 16);
    this.writeBigUint64BE(value & 0xffffffffffffffffn, offset + 24);
    return offset;
  }

  writeIntLE(value: number, offset: number, byteLength: number) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    checkOffset(offset, byteLength, this.length);

    let mul = 1;
    let i = 0;
    this[offset] = value & 0xff;
    // biome-ignore lint:
    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xff;
    }

    return offset + byteLength;
  }

  writeIntBE(value: number, offset: number, byteLength: number) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    checkOffset(offset, byteLength, this.length);

    let i = byteLength - 1;
    let mul = 1;
    this[offset + i] = value & 0xff;
    // biome-ignore lint:
    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xff;
    }

    return offset + byteLength;
  }

  writeInt8(value: number, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 1, this.length);
    checkInt(this, value, offset, 1, 0x7f, -0x80);
    this[offset] = value & 0xff;
    return offset + 1;
  }

  writeInt16LE(value: number, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 2, this.length);
    checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    this[offset] = value & 0xff;
    this[offset + 1] = (value >>> 8) & 0xff;
    return offset + 2;
  }

  writeInt16BE(value: number, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 2, this.length);
    checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    this[offset] = (value >>> 8) & 0xff;
    this[offset + 1] = value & 0xff;
    return offset + 2;
  }

  writeInt32LE(value: number, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    this[offset] = value & 0xff;
    this[offset + 1] = (value >>> 8) & 0xff;
    this[offset + 2] = (value >>> 16) & 0xff;
    this[offset + 3] = (value >>> 24) & 0xff;
    return offset + 4;
  }

  writeInt32BE(value: number, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    this[offset] = (value >>> 24) & 0xff;
    this[offset + 1] = (value >>> 16) & 0xff;
    this[offset + 2] = (value >>> 8) & 0xff;
    this[offset + 3] = value & 0xff;
    return offset + 4;
  }

  writeBigInt64LE(value: bigint, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);
    checkInt(this, value, offset, 8, 0x7fffffffffffffffn, -0x8000000000000000n);
    this.writeUint32LE(Number(value & 0xffffffffn), offset);
    this.writeInt32LE(Number(value >> 32n), offset + 4);
    return offset + 8;
  }

  writeBigInt64BE(value: bigint, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);
    checkInt(this, value, offset, 8, 0x7fffffffffffffffn, -0x8000000000000000n);
    this.writeInt32BE(Number(value >> 32n), offset);
    this.writeUint32BE(Number(value & 0xffffffffn), offset + 4);
    return offset + 8;
  }

  writeBigInt128LE(value: bigint, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 16, this.length);
    checkInt(
      this,
      value,
      offset,
      16,
      0x7fffffffffffffffffffffffffffffffn,
      -0x80000000000000000000000000000000n,
    );
    this.writeBigUint64LE(value & 0xffffffffffffffffn, offset);
    this.writeBigInt64LE(value >> 64n, offset + 8);
    return offset + 16;
  }

  writeBigInt128BE(value: bigint, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 16, this.length);
    checkInt(
      this,
      value,
      offset,
      16,
      0x7fffffffffffffffffffffffffffffffn,
      -0x80000000000000000000000000000000n,
    );
    this.writeBigInt64BE(value >> 64n, offset);
    this.writeBigUint64BE(value & 0xffffffffffffffffn, offset + 8);
    return offset + 16;
  }

  writeBigInt256LE(value: bigint, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 32, this.length);
    checkInt(
      this,
      value,
      offset,
      32,
      0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      -0x8000000000000000000000000000000000000000000000000000000000000000n,
    );
    this.writeBigUint64LE(value & 0xffffffffffffffffn, offset);
    this.writeBigUint64LE((value >> 64n) & 0xffffffffffffffffn, offset + 8);
    this.writeBigUint64LE((value >> 128n) & 0xffffffffffffffffn, offset + 16);
    this.writeBigInt64LE(value >> 192n, offset + 24);
    return offset + 32;
  }

  writeBigInt256BE(value: bigint, offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 32, this.length);
    checkInt(
      this,
      value,
      offset,
      32,
      0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      -0x8000000000000000000000000000000000000000000000000000000000000000n,
    );
    this.writeBigInt64BE(value >> 192n, offset);
    this.writeBigUint64BE((value >> 128n) & 0xffffffffffffffffn, offset + 8);
    this.writeBigUint64BE((value >> 64n) & 0xffffffffffffffffn, offset + 16);
    this.writeBigUint64BE(value & 0xffffffffffffffffn, offset + 24);
    return offset + 32;
  }
}
