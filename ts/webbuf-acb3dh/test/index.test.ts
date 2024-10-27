import { describe, it, expect } from "vitest";
import { acb3dhEncrypt, acb3dhDecrypt } from "../src/index.js";

describe("Index", () => {
  it("should exist", () => {
    expect(acb3dhEncrypt).toBeDefined();
    expect(acb3dhDecrypt).toBeDefined();
  });
});
