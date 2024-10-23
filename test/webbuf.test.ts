// import vittest requirements
import { describe, it, expect } from "vitest";
import { WebBuf } from "../webbuf.js";

describe("WebBuf", () => {
  describe("base64", () => {
    it("should encode and decode base64", () => {
      const myStr = "Hello, World!";
      const buf = WebBuf.fromString(myStr);
      const base64 = buf.toBase64();
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toString()).toBe(myStr);
    });

    it('should encode and decode arbitrary binary data', () => {
      const hex = "000102030405060708090a0b0c0d0e0ff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff";
      const buf = WebBuf.fromHex(hex);
      const base64 = buf.toBase64();
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toHex()).toBe(hex);
    });

    it('should encode and decode arbitrary binary data of length n, n+1, n+2 ... m', () => {
      for (let i = 0; i < 100; i++) {
        const hex = new Array(i).fill(0).map((_, i) => i.toString(16).padStart(2, "0")).join("");
        const buf = WebBuf.fromHex(hex);
        const base64 = buf.toBase64();
        const decoded = WebBuf.fromBase64(base64);
        expect(decoded.toHex()).toBe(hex);
      }
    });
  });

  describe("hex", () => {
    it("should encode and decode hex", () => {
      const myStr = "Hello, World!";
      const buf = WebBuf.fromString(myStr);
      const hex = buf.toHex();
      const decoded = WebBuf.fromHex(hex);
      expect(decoded.toString()).toBe(myStr);
    });
  });

  describe("base64", () => {
    // t.equal((new B('YW9ldQ', 'base64').toString()), 'aoeu')
    it('should decode base64', () => {
      const base64 = "YW9ldQ==";
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toString()).toBe('aoeu');
    });

    it('should handle newline in utf8', () => {
    // new B('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK', 'base64').toString('utf8'),
    // '---\ntitle: Three dashes marks the spot\ntags:\n'
      const base64 = "LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK";
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toString()).toBe('---\ntitle: Three dashes marks the spot\ntags:\n');
    });
  });
});
