// import vitest
import { describe, it, expect } from "vitest";
import { WebBuf } from "./index.js";

describe("WebBuf", () => {
  it("should be a Buffer", () => {
    const buf = WebBuf.alloc(10);
    expect(buf).toBeInstanceOf(WebBuf);
    expect(WebBuf.isBuffer(buf)).toBe(true);
  });
});
