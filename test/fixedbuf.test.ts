import { describe, it, expect } from "vitest";
import { WebBuf } from "../src/webbuf.js";
import { FixedBuf } from "../src/fixedbuf.js";

describe("FixedBuf", () => {
  describe("to/from hex", () => {
    it("should convert to and from hex", () => {
      const hex = "deadbeef";
      const buf = FixedBuf.fromHex(4, hex);
      expect(buf.toHex()).toBe(hex);
    });
  });

  describe('to/from base64', () => {
    it('should convert to and from base64', () => {
      const base64 = "3q2+7w==";
      const buf = FixedBuf.fromBase64(4, base64);
      expect(buf.toBase64()).toBe(base64);
    });
  });
});
