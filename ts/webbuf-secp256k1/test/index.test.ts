import { describe, it, expect } from "vitest";
import { WebBuf } from "webbuf";
import { FixedBuf } from "@webbuf/fixedbuf";
import {
  sign,
  verify,
  sharedSecret,
  publicKeyAdd,
  publicKeyCreate,
  publicKeyVerify,
  privateKeyAdd,
} from "../src/index.js";
import { blake3Hash } from "@webbuf/blake3";

describe("secp256k1", () => {
  it("should correctly sign and verify a message", () => {
    const privateKey = FixedBuf.fromRandom(32);
    const publicKey = publicKeyCreate(privateKey);
    const message = WebBuf.fromString("test message");
    const digest = blake3Hash(message);
    const signature = sign(digest, privateKey, FixedBuf.fromRandom(32));
    expect(verify(signature, digest, publicKey)).toBe(true);
  });
});
