import { describe, test, it, expect } from "vitest";
import { U8, U16, U32, U64, U128, U256 } from "../src/index.js";

describe("U8", () => {
  it("should create a new U8 instance from number", () => {
    const u8 = U8.fromN(0);
    expect(u8.n).toBe(0);
  });

  it("should add two U8 instances", () => {
    const u8 = U8.fromBn(10n).add(U8.fromBn(20n));
    expect(u8.bn).toBe(30n);
  });

  it("should subtract two U8 instances", () => {
    const u8 = U8.fromBn(20n).sub(U8.fromBn(10n));
    expect(u8.bn).toBe(10n);
  });

  it("should multiply two U8 instances", () => {
    const u8 = U8.fromBn(10n).mul(U8.fromBn(20n));
    expect(u8.bn).toBe(200n);
  });

  it("should divide two U8 instances", () => {
    const u8 = U8.fromBn(20n).div(U8.fromBn(10n));
    expect(u8.bn).toBe(2n);
  });

  it("should convert to hex string", () => {
    const u8 = U8.fromBn(255n);
    expect(u8.toHex()).toBe("ff");
  });
});

describe("U16", () => {
  it("should create a new U16 instance from number", () => {
    const u16 = U16.fromN(0);
    expect(u16.n).toBe(0);
  });

  it("should add two U16 instances", () => {
    const u16 = U16.fromBn(10n).add(U16.fromBn(20n));
    expect(u16.bn).toBe(30n);
  });

  it("should subtract two U16 instances", () => {
    const u16 = U16.fromBn(20n).sub(U16.fromBn(10n));
    expect(u16.bn).toBe(10n);
  });

  it("should multiply two U16 instances", () => {
    const u16 = U16.fromBn(10n).mul(U16.fromBn(20n));
    expect(u16.bn).toBe(200n);
  });

  it("should divide two U16 instances", () => {
    const u16 = U16.fromBn(20n).div(U16.fromBn(10n));
    expect(u16.bn).toBe(2n);
  });

  it("should convert to hex string", () => {
    const u16 = U16.fromBn(65535n);
    expect(u16.toHex()).toBe("ffff");
  });
});

describe("U32", () => {
  it("should create a new U32 instance from number", () => {
    const u32 = U32.fromN(0);
    expect(u32.n).toBe(0);
  });

  it("should add two U32 instances", () => {
    const u32 = U32.fromBn(10n).add(U32.fromBn(20n));
    expect(u32.bn).toBe(30n);
  });

  it("should subtract two U32 instances", () => {
    const u32 = U32.fromBn(20n).sub(U32.fromBn(10n));
    expect(u32.bn).toBe(10n);
  });

  it("should multiply two U32 instances", () => {
    const u32 = U32.fromBn(10n).mul(U32.fromBn(20n));
    expect(u32.bn).toBe(200n);
  });

  it("should divide two U32 instances", () => {
    const u32 = U32.fromBn(20n).div(U32.fromBn(10n));
    expect(u32.bn).toBe(2n);
  });

  it("should convert to hex string", () => {
    const u32 = U32.fromBn(4294967295n);
    expect(u32.toHex()).toBe("ffffffff");
  });
});

describe("U64", () => {
  it("should create a new U64 instance from number", () => {
    const u64 = U64.fromN(0);
    expect(u64.n).toBe(0);
  });

  it("should add two U64 instances", () => {
    const u64 = U64.fromBn(10n).add(U64.fromBn(20n));
    expect(u64.bn).toBe(30n);
  });

  it("should subtract two U64 instances", () => {
    const u64 = U64.fromBn(20n).sub(U64.fromBn(10n));
    expect(u64.bn).toBe(10n);
  });

  it("should multiply two U64 instances", () => {
    const u64 = U64.fromBn(10n).mul(U64.fromBn(20n));
    expect(u64.bn).toBe(200n);
  });

  it("should divide two U64 instances", () => {
    const u64 = U64.fromBn(20n).div(U64.fromBn(10n));
    expect(u64.bn).toBe(2n);
  });

  it("should convert to hex string", () => {
    const u64 = U64.fromBn(0xffffffffffffffffn);
    expect(u64.toHex()).toBe("ffffffffffffffff");
  });
});

describe("U128", () => {
  it("should create a new U128 instance from number", () => {
    const u128 = U128.fromN(0);
    expect(u128.n).toBe(0);
  });

  it("should add two U128 instances", () => {
    const u128 = U128.fromBn(10n).add(U128.fromBn(20n));
    expect(u128.bn).toBe(30n);
  });

  it("should subtract two U128 instances", () => {
    const u128 = U128.fromBn(20n).sub(U128.fromBn(10n));
    expect(u128.bn).toBe(10n);
  });

  it("should multiply two U128 instances", () => {
    const u128 = U128.fromBn(10n).mul(U128.fromBn(20n));
    expect(u128.bn).toBe(200n);
  });

  it("should divide two U128 instances", () => {
    const u128 = U128.fromBn(20n).div(U128.fromBn(10n));
    expect(u128.bn).toBe(2n);
  });

  it("should convert to hex string", () => {
    const u128 = U128.fromBn(340282366920938463463374607431768211455n);
    expect(u128.toHex()).toBe("ffffffffffffffffffffffffffffffff");
  });
});

describe("U256", () => {
  it("should create a new U256 instance from number", () => {
    const u256 = U256.fromN(0);
    expect(u256.n).toBe(0);
  });

  it("should add two U256 instances", () => {
    const u256 = U256.fromBn(10n).add(U256.fromBn(20n));
    expect(u256.bn).toBe(30n);
  });

  it("should subtract two U256 instances", () => {
    const u256 = U256.fromBn(20n).sub(U256.fromBn(10n));
    expect(u256.bn).toBe(10n);
  });

  it("should multiply two U256 instances", () => {
    const u256 = U256.fromBn(10n).mul(U256.fromBn(20n));
    expect(u256.bn).toBe(200n);
  });

  it("should divide two U256 instances", () => {
    const u256 = U256.fromBn(20n).div(U256.fromBn(10n));
    expect(u256.bn).toBe(2n);
  });

  it("should convert to hex string", () => {
    const u256 = U256.fromBn(115792089237316195423570985008687907853269984665640564039457584007913129639935n);
    expect(u256.toHex()).toBe("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  });
});
