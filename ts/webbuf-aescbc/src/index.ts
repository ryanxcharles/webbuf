import {
  aescbc_decrypt,
  aescbc_encrypt,
} from "./rs-webbuf_aescbc-inline-base64/webbuf_aescbc.js";
import { WebBuf } from "@webbuf/webbuf";
import { FixedBuf } from "@webbuf/fixedbuf";

export function aescbDecrypt(
  ciphertext: WebBuf,
  aesKey: FixedBuf<32>,
  iv?: FixedBuf<16>,
): WebBuf {
  if (iv === undefined) {
    if (ciphertext.length < 16) {
      throw new Error("Data must be at least 16 bytes long");
    }
    const iv = FixedBuf.fromBuf(16, ciphertext.slice(0, 16));
    ciphertext = ciphertext.slice(16);
    if (ciphertext.length % 16 !== 0) {
      throw new Error("Data length must be a multiple of 16");
    }

    return WebBuf.fromUint8Array(aescbc_decrypt(ciphertext, aesKey.buf, iv.buf));
  }
  if (ciphertext.length % 16 !== 0) {
    throw new Error("Data length must be a multiple of 16");
  }
  return WebBuf.fromUint8Array(aescbc_decrypt(ciphertext, aesKey.buf, iv.buf));
}

export function aescbEncrypt(
  plaintext: WebBuf,
  aesKey: FixedBuf<32>,
  iv: FixedBuf<16> = FixedBuf.fromRandom(16),
  concatIv: boolean = true,
): WebBuf {
  const encrypted = aescbc_encrypt(plaintext, aesKey.buf, iv.buf);
  if (concatIv) {
    return WebBuf.concat([iv.buf, WebBuf.fromUint8Array(encrypted)]);
  }
  return WebBuf.fromUint8Array(encrypted);
}
