import { expect, describe, it } from "vitest";
import { aescbcEncrypt, aescbcDecrypt } from "../src/index.js";
import { WebBuf } from "@webbuf/webbuf";
import { FixedBuf } from "@webbuf/fixedbuf";

describe("aescbc", () => {
  it("should encrypt and decrypt", () => {
    const key = FixedBuf.fromHex(
      32,
      "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    );
    const plaintext = WebBuf.fromString("Hello, world!");
    const iv = FixedBuf.fromHex(16, "000102030405060708090a0b0c0d0e0f");
    const ciphertext = aescbcEncrypt(plaintext, key, iv);
    const decrypted = aescbcDecrypt(ciphertext, key);
    expect(decrypted.toString()).toEqual("Hello, world!");
  });
});
