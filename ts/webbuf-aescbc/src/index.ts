import {
  aescbc_decrypt,
  aescbc_encrypt,
} from "./rs-webbuf_aescbc-inline-base64/webbuf_aescbc.js";
import { WebBuf } from "@webbuf/webbuf";
import { FixedBuf } from "@webbuf/fixedbuf";

export function aescbDecrypt(key: FixedBuf<32>, data: WebBuf): WebBuf {
  if (data.length < 16) {
    throw new Error("Data must be at least 16 bytes long");
  }
  const iv = FixedBuf.fromBuf(16, data.slice(0, 16));
  data = data.slice(16);
  if (data.length % 16 !== 0) {
    throw new Error("Data length must be a multiple of 16");
  }

  return WebBuf.fromUint8Array(aescbc_decrypt(data, key.buf, iv.buf));
}
