
import { describe, it, expect } from "vitest";
import {
  WebBuf,
  uint8ArrayToBase64,
  newUint8ArrayToBase64,
} from "../src/webbuf.js";

describe("WebBuf", () => {
  describe("benchmarks", () => {
    it("should encode this large buffer to base64", () => {
      const testArray = new Uint8Array(10_000_000); // Large Uint8Array for benchmarking
      // fill with iterating count
      for (let i = 0; i < testArray.length; i++) {
        testArray[i] = i % 256;
      }

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

      // Native Buffer
      const startNative = performance.now();
      const base64Native = Buffer.from(testArray.buffer).toString("base64");
      const endNative = performance.now();
      console.log(`Native method time: ${endNative - startNative} ms`);

      // Make sure they are all equal
      expect(base64Old).toBe(base64New);
      expect(base64Old).toBe(base64Native);
    });
  });
});
