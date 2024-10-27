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
