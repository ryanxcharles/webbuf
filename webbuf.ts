import * as base64 from "./base64-js.js";
import * as ieee754 from "./ieee754.js";

export class WebBuf extends Uint8Array {
  // constructor(size: number) {
  //   super(size);
  // }
  // concat

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
    const byteArray = base64.toByteArray(b64);
    return new WebBuf(byteArray);
  }
  
  toString() {
    const decoder = new TextDecoder();
    return decoder.decode(this);
  }

  toBase64() {
    return base64.fromByteArray(this);
  }

  toHex() {
    return Array.from(this).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  toArray() {
    return Array.from(this);
  }

  // toString
  // fromString
  // slice
  // subarray
  // read/write binary numbers
}
