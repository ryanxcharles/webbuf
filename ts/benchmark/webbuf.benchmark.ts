import { describe, it, expect } from "vitest";
import { Buffer as NpmBuffer } from "buffer/index.js";
import { WebBuf } from "../src/webbuf.js";

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

describe("WebBuf Benchmarks", () => {
  describe("benchmarks", () => {
    it("should encode this large buffer to base64", () => {
      const testArray = new Uint8Array(10_000_000); // Large Uint8Array for benchmarking
      // fill with iterating count
      for (let i = 0; i < testArray.length; i++) {
        testArray[i] = i % 256;
      }
      const npmBuffer = NpmBuffer.from(testArray.buffer);
      const wasmBuffer = WebBuf.from(testArray);

      // Npm Buffer
      const startNpm = performance.now();
      const base64Npm = npmBuffer.toString("base64");
      const endNpm = performance.now();
      console.log(`Npm method time: ${endNpm - startNpm} ms`);

      // wasm methods
      const startWasm = performance.now();
      const base64Wasm = wasmBuffer.toString("base64");
      const endWasm = performance.now();
      console.log(`Wasm method time: ${endWasm - startWasm} ms`);

      expect(base64Npm).toBe(base64Wasm);
    });

    it("should decode this large base64 string", () => {
      const testArray = new Uint8Array(10_000_000); // Large Uint8Array for benchmarking
      // fill with iterating count
      for (let i = 0; i < testArray.length; i++) {
        testArray[i] = i % 256;
      }
      const npmBuffer = NpmBuffer.from(testArray.buffer);
      const base64 = uint8ArrayToBase64(testArray);

      // Npm Buffer
      const startNpm = performance.now();
      const decodedNpm = NpmBuffer.from(base64, "base64");
      const endNpm = performance.now();
      console.log(`Npm method time: ${endNpm - startNpm} ms`);

      // wasm methods
      const startWasm = performance.now();
      const decodedWasm = WebBuf.from(base64, "base64");
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
      const wasmBuffer = WebBuf.from(testArray);

      // Npm Buffer
      const startNpm = performance.now();
      const hexNpm = npmBuffer.toString("hex");
      const endNpm = performance.now();
      console.log(`Npm method time: ${endNpm - startNpm} ms`);

      // wasm methods
      const startWasm = performance.now();
      const hexWasm = wasmBuffer.toString("hex");
      const endWasm = performance.now();
      console.log(`Wasm method time: ${endWasm - startWasm} ms`);

      // Make sure they are all equal
      expect(hexNpm).toBe(hexWasm);
    });

    it("should decode this large hex string", () => {
      const testArray = new Uint8Array(10_000_000); // Large Uint8Array for benchmarking
      // fill with iterating count
      for (let i = 0; i < testArray.length; i++) {
        testArray[i] = i % 256;
      }
      //const npmBuffer = NpmBuffer.from(testArray.buffer);
      const hex = NpmBuffer.from(testArray).toString("hex");

      // Npm Buffer
      const startNpm = performance.now();
      const decodedNpm = NpmBuffer.from(hex, "hex");
      const endNpm = performance.now();
      console.log(`Npm method time: ${endNpm - startNpm} ms`);

      // wasm methods
      const startWasm = performance.now();
      const decodedWasm = WebBuf.from(hex, "hex");
      const endWasm = performance.now();
      console.log(`Wasm method time: ${endWasm - startWasm} ms`);

      // Make sure they are all equal
      expect(NpmBuffer.from(decodedWasm).toString("hex")).toBe(
        decodedNpm.toString("hex"),
      );
    });
  });
});
