// import * as base64 from "./base64-js.js";
import * as ieee754 from "./ieee754.js";

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
    const CHUNK_SIZE = 0x8000; // Arbitrary chunk size to avoid stack overflow in large arrays
    const len = this.length;
    const binaryStrings: string[] = [];
    for (let i = 0; i < len; i += CHUNK_SIZE) {
      const chunk = this.subarray(i, Math.min(i + CHUNK_SIZE, len));
      // biome-ignore lint:
      binaryStrings.push(String.fromCharCode.apply(null, chunk as any));
    }
    return btoa(binaryStrings.join(""));
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

  slice(start: number, end: number): WebBuf {
    return new WebBuf(this.subarray(start, end));
  }

  subarray(start: number, end: number): WebBuf {
    return new WebBuf(this.slice(start, end));
  }

  compare(other: WebBuf): number {
    if (this.length !== other.length) {
      return this.length - other.length;
    }
    for (let i = 0; i < this.length; i++) {
      if (this[i] !== other[i]) {
        return (this[i] as number) - (other[i] as number);
      }
    }
    return 0;
  }

  equals(other: WebBuf): boolean {
    return this.compare(other) === 0;
  }
  // read/write binary numbers
}
