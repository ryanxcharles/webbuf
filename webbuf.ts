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
    return this
  }

  clone() {
    return new WebBuf(this);
  }

  copy(target: WebBuf, targetStart = 0, sourceStart = 0, sourceEnd = this.length) {
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

  static fromBase64(b64: string) {
    const binary = atob(b64);
    const result = new WebBuf(binary.length);
    for (let i = 0; i < binary.length; i++) {
      result[i] = binary.charCodeAt(i);
    }
    return result;
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

    return (
      (this[offset] as number) |
      ((this[offset + 1] as number) << 8) |
      ((this[offset + 2] as number) << 16) |
      ((this[offset + 3] as number) << 24)
    );
  }

  readUint32BE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);

    return (
      ((this[offset] as number) << 24) |
      ((this[offset + 1] as number) << 16) |
      ((this[offset + 2] as number) << 8) |
      (this[offset + 3] as number)
    );
  }

  readBigUInt64LE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);

    const lo = this.readUint32LE(offset);
    const hi = this.readUint32LE(offset + 4);
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
  }

  readBigUint64BE(offset: number) {
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);

    const lo = this.readUint32BE(offset);
    const hi = this.readUint32BE(offset + 4);
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
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

    const lo = this.readInt32BE(offset + 4);
    const hi = this.readUint32BE(offset);
    return BigInt(lo) + (BigInt(hi) << BigInt(32));
  }

  // writing numbers

  writeUintLE(value: number, offset: number, byteLength: number) {
    value = +value;
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
    value = +value;
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
    value = +value;
    offset = offset >>> 0;
    checkOffset(offset, 1, this.length);
    this[offset] = value & 0xff;
    return offset + 1;
  }

  writeUint16LE(value: number, offset: number) {
    value = +value;
    offset = offset >>> 0;
    checkOffset(offset, 2, this.length);
    this[offset] = value & 0xff;
    this[offset + 1] = (value >>> 8) & 0xff;
    return offset + 2;
  }

  writeUint16BE(value: number, offset: number) {
    value = +value;
    offset = offset >>> 0;
    checkOffset(offset, 2, this.length);
    this[offset] = (value >>> 8) & 0xff;
    this[offset + 1] = value & 0xff;
    return offset + 2;
  }

  writeUint32LE(value: number, offset: number) {
    value = +value;
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);
    this[offset] = value & 0xff;
    this[offset + 1] = (value >>> 8) & 0xff;
    this[offset + 2] = (value >>> 16) & 0xff;
    this[offset + 3] = (value >>> 24) & 0xff;
    return offset + 4;
  }

  writeUint32BE(value: number, offset: number) {
    value = +value;
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);
    this[offset] = (value >>> 24) & 0xff;
    this[offset + 1] = (value >>> 16) & 0xff;
    this[offset + 2] = (value >>> 8) & 0xff;
    this[offset + 3] = value & 0xff;
    return offset + 4;
  }

  writeBigUInt64LE(value: bigint, offset: number) {
    value = BigInt(value);
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);

    this.writeUint32LE(Number(value & BigInt(0xffffffff)), offset);
    this.writeUint32LE(Number(value >> BigInt(32)), offset + 4);
    return offset + 8;
  }

  writeBigUInt64BE(value: bigint, offset: number) {
    value = BigInt(value);
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);

    this.writeUint32BE(Number(value >> BigInt(32)), offset);
    this.writeUint32BE(Number(value & BigInt(0xffffffff)), offset + 4);
    return offset + 8;
  }

  writeIntLE(value: number, offset: number, byteLength: number) {
    value = +value;
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
    value = +value;
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
    value = +value;
    offset = offset >>> 0;
    checkOffset(offset, 1, this.length);
    this[offset] = value & 0xff;
    return offset + 1;
  }

  writeInt16LE(value: number, offset: number) {
    value = +value;
    offset = offset >>> 0;
    checkOffset(offset, 2, this.length);
    this[offset] = value & 0xff;
    this[offset + 1] = (value >>> 8) & 0xff;
    return offset + 2;
  }

  writeInt16BE(value: number, offset: number) {
    value = +value;
    offset = offset >>> 0;
    checkOffset(offset, 2, this.length);
    this[offset] = (value >>> 8) & 0xff;
    this[offset + 1] = value & 0xff;
    return offset + 2;
  }

  writeInt32LE(value: number, offset: number) {
    value = +value;
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);
    this[offset] = value & 0xff;
    this[offset + 1] = (value >>> 8) & 0xff;
    this[offset + 2] = (value >>> 16) & 0xff;
    this[offset + 3] = (value >>> 24) & 0xff;
    return offset + 4;
  }

  writeInt32BE(value: number, offset: number) {
    value = +value;
    offset = offset >>> 0;
    checkOffset(offset, 4, this.length);
    this[offset] = (value >>> 24) & 0xff;
    this[offset + 1] = (value >>> 16) & 0xff;
    this[offset + 2] = (value >>> 8) & 0xff;
    this[offset + 3] = value & 0xff;
    return offset + 4;
  }

  writeBigInt64LE(value: bigint, offset: number) {
    value = BigInt(value);
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);

    this.writeUint32LE(Number(value & BigInt(0xffffffff)), offset);
    this.writeInt32LE(Number(value >> BigInt(32)), offset + 4);
    return offset + 8;
  }

  writeBigInt64BE(value: bigint, offset: number) {
    value = BigInt(value);
    offset = offset >>> 0;
    checkOffset(offset, 8, this.length);

    this.writeInt32BE(Number(value >> BigInt(32)), offset);
    this.writeUint32BE(Number(value & BigInt(0xffffffff)), offset + 4);
    return offset + 8;
  }
}
