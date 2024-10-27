import { beforeEach, describe, it, test, expect } from "vitest";
import { BufWriter } from "../src/buf-writer.js";
import { U8, U16BE, U32BE, U64BE, U128BE, U256BE } from "@webbuf/numbers";

describe("BufWriter", () => {
  it("should exist", () => {
    expect(BufWriter).toBeDefined();
  });

  let bufferWriter: BufWriter;

  beforeEach(() => {
    bufferWriter = new BufWriter();
  });

  describe("writeUint8", () => {
    it("should write an unsigned 8-bit integer", () => {
      const u8: U8 = U8.fromN(123);
      bufferWriter.writeU8(u8);
      const result = bufferWriter.toBuf();
      expect(result[0]).toEqual(u8.n);
    });
  });

  describe("writeUint16BE", () => {
    it("should write an unsigned 16-bit integer in big-endian format", () => {
      const u16: U16BE = U16BE.fromN(12345);
      bufferWriter.writeU16BE(u16);
      const result = bufferWriter.toBuf();
      expect(result.readUint16BE(0)).toEqual(u16.n);
    });
  });

  describe("writeUint32BE", () => {
    it("should write an unsigned 32-bit integer in big-endian format", () => {
      const u32: U32BE = U32BE.fromN(1234567890);
      bufferWriter.writeU32BE(u32);
      const result = bufferWriter.toBuf();
      expect(result.readUint32BE(0)).toEqual(u32.n);
    });
  });

  describe("writeUint64BE", () => {
    it("should write an unsigned 64-bit integer in big-endian format", () => {
      const u64: U64BE = U64BE.fromBn(1234567890123456789n);
      bufferWriter.writeU64BE(u64);
      const result = bufferWriter.toBuf();
      expect(result.readBigInt64BE(0)).toEqual(u64.bn);
    });
  });

  describe("writeUint128BE", () => {
    it("should write an unsigned 128-bit integer in big-endian format", () => {
      const u128: U128BE =
        U128BE.fromBn(0x0123456789ABCDEF0123456789ABCDEFn);
      bufferWriter.writeU128BE(u128);
      const result = bufferWriter.toBuf();
      expect(result.readBigUint128BE(0)).toEqual(u128.bn);
    });
  });

  describe("writeUint256BE", () => {
    it("should write an unsigned 256-bit integer in big-endian format", () => {
      const u256: U256BE =
        U256BE.fromBn(0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEFn);
      bufferWriter.writeU256BE(u256);
      const result = bufferWriter.toBuf();
      expect(result.readBigUint256BE(0)).toEqual(u256.bn);
    });
  });
});
