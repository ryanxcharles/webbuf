import * as base64 from "./base64-js.js";
import * as ieee754 from "./ieee754.js";

export class WebBuf {
  buffer: Uint8Array;
  // constructor
  constructor(size: number) {
    this.buffer = new Uint8Array(size);
  }
  // concat
  static concat(list: Uint8Array[]) {
    let size = 0;
    for (let i = 0; i < list.length; i++) {
      size += list[i].length;
    }
    let buffer = new Uint8Array(size);
    let offset = 0;
    for (let i = 0; i < list.length; i++) {
      buffer.set(list[i], offset);
      offset += list[i].length;
    }
    return buffer;
  }
  // alloc
  static alloc(size: number) {
    return new WebBuf(size);
  }
  // from (string, hex, base64)
  // toString
  // fromString
  // slice
  // subarray
  // read/write binary numbers
}
