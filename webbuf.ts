import * as ieee754 from "./ieee754.js";

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

  static fromUint8Array(buffer: Uint8Array) {
    return new WebBuf(buffer);
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
}
