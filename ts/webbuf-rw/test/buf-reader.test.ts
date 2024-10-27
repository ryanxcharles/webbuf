import { describe, expect, test, beforeEach } from "vitest";
import { BufReader } from "../src/buf-reader.js";
import { WebBuf } from "@webbuf/webbuf";

describe("BufReader", () => {
  let bufferReader: BufReader;
  let testEbxBuf: WebBuf;

  beforeEach(() => {
    testEbxBuf = WebBuf.from([1, 2, 3, 4, 5, 6, 7, 8]);
    bufferReader = new BufReader(testEbxBuf);
  });

  test("constructor sets buffer and position", () => {
    expect(bufferReader.buf.toHex()).toEqual(testEbxBuf.toHex());
    expect(bufferReader.pos).toBe(0);
  });

  test("read returns correct subarray", () => {
    const len = 4;
    const result = bufferReader.read(len);
    expect(result).toEqual(testEbxBuf.subarray(0, len));
  });

  test("read updates position", () => {
    const len = 4;
    bufferReader.read(len);
    expect(bufferReader.pos).toBe(len);
  });

  test("readUint8 returns correct value and updates position", () => {
    const result = bufferReader.readU8();
    expect(result.n).toBe(1);
    expect(bufferReader.pos).toBe(1);
  });

  test("readUint16BE returns correct value and updates position", () => {
    const result = bufferReader.readU16BE();
    expect(result.n).toBe(WebBuf.from([1, 2]).readUint16BE());
    expect(bufferReader.pos).toBe(2);
  });

  test("readUint32BE returns correct value and updates position", () => {
    const result = bufferReader.readU32BE();
    expect(result.n).toBe(WebBuf.from([1, 2, 3, 4]).readUint32BE());
    expect(bufferReader.pos).toBe(4);
  });

  test("readUint64BEBigInt returns correct value and updates position", () => {
    // Create a EbxBufReader with a buffer that contains the 64-bit unsigned integer 0x0123456789ABCDEF
    bufferReader = new BufReader(
      WebBuf.from([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef]),
    );

    const result = bufferReader.readU64BE();

    // Check that the method returns the correct BigInt
    expect(result.bn).toEqual(BigInt("0x0123456789ABCDEF"));

    // Check that the position has been updated correctly
    expect(bufferReader.pos).toBe(8);
  });

  test("readUint128BE returns correct value and updates position", () => {
    // Create a EbxBufReader with a buffer that contains the 128-bit unsigned integer 0x0123456789ABCDEF0123456789ABCDEF
    bufferReader = new BufReader(
      WebBuf.fromHex("0123456789ABCDEF0123456789ABCDEF"),
    );

    const result = bufferReader.readU128BE();

    // Check that the method returns the correct BigInt
    expect(result.bn).toEqual(
      BigInt("0x0123456789ABCDEF0123456789ABCDEF"),
    );

    // Check that the position has been updated correctly
    expect(bufferReader.pos).toBe(16);
  });

  test("readUint256BE returns correct value and updates position", () => {
    // Create a EbxBufReader with a buffer that contains the 256-bit unsigned integer 0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF
    bufferReader = new BufReader(
      WebBuf.fromHex(
        "0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF",
      ),
    );

    const result = bufferReader.readU256BE();

    // Check that the method returns the correct BigInt
    expect(result.bn).toEqual(
      BigInt(
        "0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF",
      ),
    );

    // Check that the position has been updated correctly
    expect(bufferReader.pos).toBe(32);
  });

  test("readVarIntBEBuf", () => {
    let bufferReader = new BufReader(WebBuf.from([0xfd, 0x00, 0x01]));
    expect(() => bufferReader.readVarIntBEBuf()).toThrow();

    bufferReader = new BufReader(WebBuf.from([0xfe, 0x00, 0x00, 0x00, 0x01]));
    expect(() => bufferReader.readVarIntBEBuf()).toThrow();

    bufferReader = new BufReader(
      WebBuf.from([0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]),
    );
    expect(() => bufferReader.readVarIntBEBuf()).toThrow();

    bufferReader = new BufReader(WebBuf.from([0x01]));
    expect(bufferReader.readVarIntBEBuf().toString("hex")).toEqual(
      WebBuf.from([0x01]).toString("hex"),
    );
  });

  test("readVarInt", () => {
    let bufferReader = new BufReader(WebBuf.from([0xfd, 0x00, 0x01]));
    expect(() => bufferReader.readVarIntU64BE()).toThrow();

    bufferReader = new BufReader(WebBuf.from([0xfe, 0x00, 0x00, 0x00, 0x01]));
    expect(() => bufferReader.readVarIntU64BE()).toThrow();

    bufferReader = new BufReader(
      WebBuf.from([0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]),
    );
    expect(() => bufferReader.readVarIntU64BE()).toThrow();

    bufferReader = new BufReader(WebBuf.from([0x01]));
    expect(bufferReader.readVarIntU64BE().bn).toEqual(BigInt(1));
  });
});
