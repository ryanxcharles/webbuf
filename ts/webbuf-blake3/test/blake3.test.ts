import { describe, it, expect } from "vitest";
import { blake3Hash, doubleBlake3Hash, blake3Mac } from "../src/index.js"
import { WebBuf } from "webbuf";
import { FixedBuf } from "@webbuf/fixedbuf";

describe.skip("Blake3", () => {
  it("should correctly compute blake3 hash", () => {
    const input = WebBuf.fromString("test input");
    const result = blake3Hash(input);
    
    expect(result).toBeInstanceOf(FixedBuf);
    expect(result.buf.length).toBe(32);
    const expectedHashHex = "your_expected_hash_here";
    expect(result.toHex()).toBe(expectedHashHex);
  });

  it("should correctly compute double blake3 hash", () => {
    const input = WebBuf.fromString("test input");
    const result = doubleBlake3Hash(input);

    expect(result).toBeInstanceOf(FixedBuf);
    expect(result.buf.length).toBe(32);
    const expectedDoubleHashHex = "your_expected_double_hash_here";
    expect(result.toHex()).toBe(expectedDoubleHashHex);
  });

  it("should correctly compute blake3 MAC", () => {
    const key = WebBuf.fromString("key");
    const message = WebBuf.fromString("message");
    const result = blake3Mac(key, message);

    expect(result).toBeInstanceOf(FixedBuf);
    expect(result.buf.length).toBe(32);
    const expectedMacHex = "your_expected_mac_here";
    expect(result.toHex()).toBe(expectedMacHex);
  });
});
