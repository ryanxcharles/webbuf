import { describe, it, expect } from "vitest";
import {
  WebBuf,
  encode_base64,
  decode_base64,
  encode_hex,
  decode_hex,
} from "../src/webbuf.js";
import { Buffer as NpmBuffer } from "buffer";

function uint8ArrayToBinaryString(arr: Uint8Array): string {
  const CHUNK_SIZE = 0x8000; // 32KB chunk size
  const chunks: string[] = [];

  for (let i = 0; i < arr.length; i += CHUNK_SIZE) {
    const chunk = arr.subarray(i, i + CHUNK_SIZE);
    chunks.push(String.fromCharCode.apply(null, chunk as unknown as number[]));
  }

  return chunks.join("");
}

function uint8ArrayToBase64(arr: Uint8Array): string {
  const binaryString = uint8ArrayToBinaryString(arr);
  return btoa(binaryString);
}

function newUint8ArrayToBinaryString(arr: Uint8Array): string {
  return new TextDecoder("latin1").decode(arr); // latin1 ensures each byte is converted to a character directly
}

function newUint8ArrayToBase64(arr: Uint8Array): string {
  const binaryString = uint8ArrayToBinaryString(arr);
  return btoa(binaryString);
}

function fromHex(hex: string) {
  const result = new WebBuf(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    result[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return result;
  // const uint8array = decode_hex(hex);
  // return new WebBuf(
  //   uint8array.buffer,
  //   uint8array.byteOffset,
  //   uint8array.byteLength,
  // );
}

function toHex(buf: WebBuf) {
  // return encode_hex(buf);
  return Array.from(new Uint8Array(buf.buffer))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
}

describe("WebBuf", () => {
  describe("benchmarks", () => {
    it("should encode this large buffer to base64", () => {
      const testArray = new Uint8Array(10_000_000); // Large Uint8Array for benchmarking
      // fill with iterating count
      for (let i = 0; i < testArray.length; i++) {
        testArray[i] = i % 256;
      }
      const npmBuffer = NpmBuffer.from(testArray.buffer);

      // Old approach (chunking)
      const startOld = performance.now();
      const base64Old = uint8ArrayToBase64(testArray);
      const endOld = performance.now();
      console.log(`Old method time: ${endOld - startOld} ms`);

      // New optimized approach
      const startNew = performance.now();
      const base64New = newUint8ArrayToBase64(testArray);
      const endNew = performance.now();
      console.log(`New method time: ${endNew - startNew} ms`);

      // Npm Buffer
      const startNpm = performance.now();
      const base64Npm = npmBuffer.toString("base64");
      const endNpm = performance.now();
      console.log(`Npm method time: ${endNpm - startNpm} ms`);

      // wasm methods
      const startWasm = performance.now();
      const base64Wasm = encode_base64(testArray);
      const endWasm = performance.now();
      console.log(`Wasm method time: ${endWasm - startWasm} ms`);

      // Native Buffer
      // const startNative = performance.now();
      // const base64Native = Buffer.from(testArray.buffer).toString("base64");
      // const endNative = performance.now();
      // console.log(`Native method time: ${endNative - startNative} ms`);

      // Make sure they are all equal
      expect(base64Old).toBe(base64New);
      expect(base64Old).toBe(base64Npm);
      expect(base64Old).toBe(base64Wasm);
      // expect(base64Old).toBe(base64Native);
    });

    it.only("should decode this large base64 string", () => {
      const testArray = new Uint8Array(1_000_000); // Large Uint8Array for benchmarking
      // fill with iterating count
      for (let i = 0; i < testArray.length; i++) {
        testArray[i] = i % 256;
      }
      const npmBuffer = NpmBuffer.from(testArray.buffer);
      const base64 = newUint8ArrayToBase64(testArray);

      // Npm Buffer
      const startNpm = performance.now();
      const decodedNpm = NpmBuffer.from(base64, "base64");
      const endNpm = performance.now();
      console.log(`Npm method time: ${endNpm - startNpm} ms`);

      // wasm methods
      const startWasm = performance.now();
      const decodedWasm = decode_base64(base64);
      const endWasm = performance.now();
      console.log(`Wasm method time: ${endWasm - startWasm} ms`);

      // Make sure they are all equal
      expect(NpmBuffer.from(decodedWasm).toString("hex")).toBe(
        decodedNpm.toString("hex"),
      );
    });

    it("should encode this large buffer to hex", () => {
      const testArray = new Uint8Array(10_000_000); // Large Uint8Array for benchmarking
      // fill with iterating count
      for (let i = 0; i < testArray.length; i++) {
        testArray[i] = i % 256;
      }
      const npmBuffer = NpmBuffer.from(testArray.buffer);

      // Npm Buffer
      const startNpm = performance.now();
      const hexNpm = npmBuffer.toString("hex");
      const endNpm = performance.now();
      console.log(`Npm method time: ${endNpm - startNpm} ms`);

      // wasm methods
      const startWasm = performance.now();
      const hexWasm = encode_hex(testArray);
      const endWasm = performance.now();
      console.log(`Wasm method time: ${endWasm - startWasm} ms`);

      // Make sure they are all equal
      expect(hexNpm).toBe(hexWasm);
    });
  });
});
