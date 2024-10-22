import { describe, it, expect } from "vitest";
import { WebBuf } from "./index.js";

describe("WebBuf", () => {
  it("should be a Buffer", () => {
    const buf = WebBuf.alloc(10);
    expect(buf).toBeInstanceOf(WebBuf);
    expect(WebBuf.isBuffer(buf)).toBe(true);
  });

  it("should encode and decode base64", () => {
    const myStr = "Hello, World!";
    const buf = WebBuf.from(myStr);
    const base64 = buf.toString("base64");
    const decoded = WebBuf.from(base64, "base64");
    expect(decoded.toString()).toBe(myStr);
  });
  
  it("should encode and decode hex", () => {
    const myStr = "Hello, World!";
    const buf = WebBuf.from(myStr);
    const hex = buf.toString("hex");
    const decoded = WebBuf.from(hex, "hex");
    expect(decoded.toString()).toBe(myStr);
  });

  it('should read and wrote a float in little endian', () => {
    const buf = WebBuf.alloc(4);
    buf.writeFloatLE(3.14, 0);
    expect(buf.readFloatLE(0)).toBeCloseTo(3.14);
  });

  it('should read and wrote a float in big endian', () => {
    const buf = WebBuf.alloc(4);
    buf.writeFloatBE(3.14, 0);
    expect(buf.readFloatBE(0)).toBeCloseTo(3.14);
  });
});
