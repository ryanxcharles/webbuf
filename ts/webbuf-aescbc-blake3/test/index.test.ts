import { describe, it, expect } from "vitest";
import{ acb3Encrypt, acb3Decrypt } from "../src/index.js";

describe("Index", () => {
  it("should exist", () => {
    expect(acb3Encrypt).toBeDefined();
    expect(acb3Decrypt).toBeDefined();
  });
});
