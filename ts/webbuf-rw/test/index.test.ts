import { describe, test, it, expect } from "vitest";
import { U8BE, U16BE, U32BE, U64BE, U128BE, U256BE } from "../src/index.js";

describe("U8BE", () => {
  it("should create a new U8 instance from number", () => {
    const u8 = U8BE.fromN(0);
    expect(u8.n).toBe(0);
  });

  it("should add two U8 instances", () => {
    const u8 = U8BE.fromBn(10n).add(U8BE.fromBn(20n));
    expect(u8.bn).toBe(30n);
  });

  it("should subtract two U8 instances", () => {
    const u8 = U8BE.fromBn(20n).sub(U8BE.fromBn(10n));
    expect(u8.bn).toBe(10n);
  });

  it("should multiply two U8 instances", () => {
    const u8 = U8BE.fromBn(10n).mul(U8BE.fromBn(20n));
    expect(u8.bn).toBe(200n);
  });

  it("should divide two U8 instances", () => {
    const u8 = U8BE.fromBn(20n).div(U8BE.fromBn(10n));
    expect(u8.bn).toBe(2n);
  });

  it("should convert to hex string", () => {
    const u8 = U8BE.fromBn(0xffn);
    expect(u8.toHex()).toBe("ff");
  });

  it("should convert to a big number", () => {
    const u8 = U8BE.fromBn(0xffn);
    expect(u8.bn).toBe(0xffn);
  });

  it("should convert to LE buffer", () => {
    const u8 = U8BE.fromBn(0xffn);
    expect(u8.toLEBuf().toHex()).toEqual("ff");
  });

  it("should convert from LE buffer", () => {
    const u8 = U8BE.fromLEBuf(U8BE.fromBn(0xffn).toLEBuf());
    expect(u8.bn).toBe(0xffn);
  });
});

describe("U16BE", () => {
  it("should create a new U16 instance from number", () => {
    const u16 = U16BE.fromN(0);
    expect(u16.n).toBe(0);
  });

  it("should add two U16 instances", () => {
    const u16 = U16BE.fromBn(10n).add(U16BE.fromBn(20n));
    expect(u16.bn).toBe(30n);
  });

  it("should subtract two U16 instances", () => {
    const u16 = U16BE.fromBn(20n).sub(U16BE.fromBn(10n));
    expect(u16.bn).toBe(10n);
  });

  it("should multiply two U16 instances", () => {
    const u16 = U16BE.fromBn(10n).mul(U16BE.fromBn(20n));
    expect(u16.bn).toBe(200n);
  });

  it("should divide two U16 instances", () => {
    const u16 = U16BE.fromBn(20n).div(U16BE.fromBn(10n));
    expect(u16.bn).toBe(2n);
  });

  it("should convert to hex string", () => {
    const u16 = U16BE.fromBn(0xffffn);
    expect(u16.toHex()).toBe("ffff");
  });

  it("should convert to a big number", () => {
    const u16 = U16BE.fromBn(0xffffn);
    expect(u16.bn).toBe(0xffffn);
  });

  it("should convert to LE buffer", () => {
    const u16 = U16BE.fromBn(0x0102n);
    expect(u16.toLEBuf().toHex()).toEqual("0201");
  });

  it("should convert from LE buffer", () => {
    const u16 = U16BE.fromLEBuf(U16BE.fromBn(0x0102n).toLEBuf());
    expect(u16.bn).toBe(0x0102n);
  });
});

describe("U32BE", () => {
  it("should create a new U32 instance from number", () => {
    const u32 = U32BE.fromN(0);
    expect(u32.n).toBe(0);
  });

  it("should add two U32 instances", () => {
    const u32 = U32BE.fromBn(10n).add(U32BE.fromBn(20n));
    expect(u32.bn).toBe(30n);
  });

  it("should subtract two U32 instances", () => {
    const u32 = U32BE.fromBn(20n).sub(U32BE.fromBn(10n));
    expect(u32.bn).toBe(10n);
  });

  it("should multiply two U32 instances", () => {
    const u32 = U32BE.fromBn(10n).mul(U32BE.fromBn(20n));
    expect(u32.bn).toBe(200n);
  });

  it("should divide two U32 instances", () => {
    const u32 = U32BE.fromBn(20n).div(U32BE.fromBn(10n));
    expect(u32.bn).toBe(2n);
  });

  it("should convert to hex string", () => {
    const u32 = U32BE.fromBn(0xffffffffn);
    expect(u32.toHex()).toBe("ffffffff");
  });

  it("should convert to a big number", () => {
    const u32 = U32BE.fromBn(0xffffffffn);
    expect(u32.bn).toBe(0xffffffffn);
  });

  it("should convert to LE buffer", () => {
    const u32 = U32BE.fromBn(0x01020304n);
    expect(u32.toLEBuf().toHex()).toEqual("04030201");
  });

  it("should convert from LE buffer", () => {
    const u32 = U32BE.fromLEBuf(U32BE.fromBn(0x01020304n).toLEBuf());
    expect(u32.bn).toBe(0x01020304n);
  });
});

describe("U64BE", () => {
  it("should create a new U64 instance from number", () => {
    const u64 = U64BE.fromN(0);
    expect(u64.n).toBe(0);
  });

  it("should add two U64 instances", () => {
    const u64 = U64BE.fromBn(10n).add(U64BE.fromBn(20n));
    expect(u64.bn).toBe(30n);
  });

  it("should subtract two U64 instances", () => {
    const u64 = U64BE.fromBn(20n).sub(U64BE.fromBn(10n));
    expect(u64.bn).toBe(10n);
  });

  it("should multiply two U64 instances", () => {
    const u64 = U64BE.fromBn(10n).mul(U64BE.fromBn(20n));
    expect(u64.bn).toBe(200n);
  });

  it("should divide two U64 instances", () => {
    const u64 = U64BE.fromBn(20n).div(U64BE.fromBn(10n));
    expect(u64.bn).toBe(2n);
  });

  it("should convert to hex string", () => {
    const u64 = U64BE.fromBn(0xffffffffffffffffn);
    expect(u64.toHex()).toBe("ffffffffffffffff");
  });

  it("should convert to a big number", () => {
    const u64 = U64BE.fromBn(0xffffffffffffffffn);
    expect(u64.bn).toBe(0xffffffffffffffffn);
  });

  it("should convert to LE buffer", () => {
    const u64 = U64BE.fromBn(0x0102030405060708n);
    expect(u64.toLEBuf().toHex()).toEqual("0807060504030201");
  });

  it("should convert from LE buffer", () => {
    const u64 = U64BE.fromLEBuf(U64BE.fromBn(0x0102030405060708n).toLEBuf());
    expect(u64.bn).toBe(0x0102030405060708n);
  });
});

describe("U128BE", () => {
  it("should create a new U128 instance from number", () => {
    const u128 = U128BE.fromN(0);
    expect(u128.n).toBe(0);
  });

  it("should add two U128 instances", () => {
    const u128 = U128BE.fromBn(10n).add(U128BE.fromBn(20n));
    expect(u128.bn).toBe(30n);
  });

  it("should subtract two U128 instances", () => {
    const u128 = U128BE.fromBn(20n).sub(U128BE.fromBn(10n));
    expect(u128.bn).toBe(10n);
  });

  it("should multiply two U128 instances", () => {
    const u128 = U128BE.fromBn(10n).mul(U128BE.fromBn(20n));
    expect(u128.bn).toBe(200n);
  });

  it("should divide two U128 instances", () => {
    const u128 = U128BE.fromBn(20n).div(U128BE.fromBn(10n));
    expect(u128.bn).toBe(2n);
  });

  it("should convert to hex string", () => {
    const u128 = U128BE.fromBn(0xffffffffffffffffffffffffffffffffn);
    expect(u128.toHex()).toBe("ffffffffffffffffffffffffffffffff");
  });

  it("should convert to a big number", () => {
    const u128 = U128BE.fromBn(0xffffffffffffffffffffffffffffffffn);
    expect(u128.bn).toBe(0xffffffffffffffffffffffffffffffffn);
  });

  it("should convert to LE buffer", () => {
    const u128 = U128BE.fromBn(0x0102030405060708090a0b0c0d0e0f10n);
    expect(u128.toLEBuf().toHex()).toEqual("100f0e0d0c0b0a090807060504030201");
  });

  it("should convert from LE buffer", () => {
    const u128 = U128BE.fromLEBuf(U128BE.fromBn(0x0102030405060708090a0b0c0d0e0f10n).toLEBuf());
    expect(u128.bn).toBe(0x0102030405060708090a0b0c0d0e0f10n);
  });
});

describe("U256BE", () => {
  it("should create a new U256 instance from number", () => {
    const u256 = U256BE.fromN(0);
    expect(u256.n).toBe(0);
  });

  it("should add two U256 instances", () => {
    const u256 = U256BE.fromBn(10n).add(U256BE.fromBn(20n));
    expect(u256.bn).toBe(30n);
  });

  it("should subtract two U256 instances", () => {
    const u256 = U256BE.fromBn(20n).sub(U256BE.fromBn(10n));
    expect(u256.bn).toBe(10n);
  });

  it("should multiply two U256 instances", () => {
    const u256 = U256BE.fromBn(10n).mul(U256BE.fromBn(20n));
    expect(u256.bn).toBe(200n);
  });

  it("should divide two U256 instances", () => {
    const u256 = U256BE.fromBn(20n).div(U256BE.fromBn(10n));
    expect(u256.bn).toBe(2n);
  });

  it("should convert to hex string", () => {
    const u256 =
      U256BE.fromBn(
        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      );
    expect(u256.toHex()).toBe(
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    );
  });

  it("should convert to a big number", () => {
    const u256 =
      U256BE.fromBn(
        0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      );
    expect(u256.bn).toBe(
      0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
    );
  });

  it("should convert to LE buffer", () => {
    const u256 =
      U256BE.fromBn(
        0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20n,
      );
    expect(u256.toLEBuf().toHex()).toEqual(
      "201f1e1d1c1b1a191817161514131211100f0e0d0c0b0a090807060504030201",
    );
  });

  it("should convert from LE buffer", () => {
    const u256 = U256BE.fromLEBuf(
      U256BE.fromBn(
        0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20n,
      ).toLEBuf(),
    );
    expect(u256.bn).toBe(
      0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20n,
    );
  });
});

