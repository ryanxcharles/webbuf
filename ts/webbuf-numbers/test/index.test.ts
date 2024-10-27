import { describe, test, it, expect } from "vitest";
import { U8, U16, U32, U64, U128, U256 } from "../src/index.js";

describe("U8", () => {
  it("should create a new U8 instance", () => {
    const u8 = U8.fromN(0);
    expect(u8.n).toBe(0);
  });
});
