import { describe, it, expect } from "vitest";
import { WebBuf } from "../src/index.js";

describe("WebBuf 2", () => {
  describe("to/from hex/base64 algo threshold", () => {
    it.skip("should hande algo threshold for to hex", () => {
      const TO_HEX_ALGO_THRESHOLD = WebBuf.TO_HEX_ALGO_THRESHOLD;
      const smallBufLength = TO_HEX_ALGO_THRESHOLD - 1;
      const largeBufLength = TO_HEX_ALGO_THRESHOLD + 1;
      const smallBuf = WebBuf.alloc(smallBufLength);
      const largeBuf = WebBuf.alloc(largeBufLength);
      for (let i = 0; i < smallBufLength; i++) {
        const val = i % 256;
        smallBuf.writeUint8(val, i);
      }
      for (let i = 0; i < largeBufLength; i++) {
        const val = i % 255;
        largeBuf.writeUint8(val, i);
      }
      const smallHex = smallBuf.toHex();
      const largeHex = largeBuf.toHex();
      const fromSmallHex = WebBuf.fromHex(smallHex);
      const fromLargeHex = WebBuf.fromHex(largeHex);
      expect(fromSmallHex.toHex()).toBe(smallHex);
      expect(fromLargeHex.toHex()).toBe(largeHex);
    });

    it("should handle algo threshold for from hex", () => {
      const FROM_HEX_ALGO_THRESHOLD = WebBuf.FROM_HEX_ALGO_THRESHOLD;
      const smallBufLength = FROM_HEX_ALGO_THRESHOLD - 1;
      const largeBufLength = FROM_HEX_ALGO_THRESHOLD + 1;
      const smallBuf = WebBuf.alloc(smallBufLength);
      const largeBuf = WebBuf.alloc(largeBufLength);
      for (let i = 0; i < smallBufLength; i++) {
        const val = i % 256;
        smallBuf.writeUint8(val, i);
      }
      for (let i = 0; i < largeBufLength; i++) {
        const val = i % 255;
        largeBuf.writeUint8(val, i);
      }
      const smallHex = smallBuf.toHex();
      const largeHex = largeBuf.toHex();
      const fromSmallHex = WebBuf.fromHex(smallHex);
      const fromLargeHex = WebBuf.fromHex(largeHex);
      expect(fromSmallHex.toHex()).toBe(smallHex);
      expect(fromLargeHex.toHex()).toBe(largeHex);
    });

    it.skip("should hande algo threshold for to base64", () => {
      const TO_BASE64_ALGO_THRESHOLD = WebBuf.TO_BASE64_ALGO_THRESHOLD;
      const smallBufLength = TO_BASE64_ALGO_THRESHOLD - 1;
      const largeBufLength = TO_BASE64_ALGO_THRESHOLD + 1;
      const smallBuf = WebBuf.alloc(smallBufLength);
      const largeBuf = WebBuf.alloc(largeBufLength);
      for (let i = 0; i < smallBufLength; i++) {
        const val = i % 256;
        smallBuf.writeUint8(val, i);
      }
      for (let i = 0; i < largeBufLength; i++) {
        const val = i % 255;
        largeBuf.writeUint8(val, i);
      }
      const smallBase64 = smallBuf.toBase64();
      const largeBase64 = largeBuf.toBase64();
      const fromSmallBase64 = WebBuf.fromBase64(smallBase64);
      const fromLargeBase64 = WebBuf.fromBase64(largeBase64);
      expect(fromSmallBase64.toBase64()).toBe(smallBase64);
      expect(fromLargeBase64.toBase64()).toBe(largeBase64);
    });

    it.skip("should handle algo threshold for from base64", () => {
      const FROM_BASE64_ALGO_THRESHOLD = WebBuf.FROM_BASE64_ALGO_THRESHOLD;
      const smallBufLength = FROM_BASE64_ALGO_THRESHOLD - 1;
      const largeBufLength = FROM_BASE64_ALGO_THRESHOLD + 1;
      const smallBuf = WebBuf.alloc(smallBufLength);
      const largeBuf = WebBuf.alloc(largeBufLength);
      for (let i = 0; i < smallBufLength; i++) {
        const val = i % 256;
        smallBuf.writeUint8(val, i);
      }
      for (let i = 0; i < largeBufLength; i++) {
        const val = i % 255;
        largeBuf.writeUint8(val, i);
      }
      const smallBase64 = smallBuf.toBase64();
      const largeBase64 = largeBuf.toBase64();
      const fromSmallBase64 = WebBuf.fromBase64(smallBase64);
      const fromLargeBase64 = WebBuf.fromBase64(largeBase64);
      expect(fromSmallBase64.toBase64()).toBe(smallBase64);
      expect(fromLargeBase64.toBase64()).toBe(largeBase64);
    });
  });

  describe("compare", () => {
    it("should pass these known test vectors", () => {
      const b = WebBuf.fromString("a");
      const c = WebBuf.fromString("c");
      const d = WebBuf.fromString("aa");

      expect(b.compare(c)).toBe(-1);
      expect(c.compare(d)).toBe(1);
      expect(d.compare(b)).toBe(1);
      expect(b.compare(d)).toBe(-1);
      expect(b.compare(b)).toBe(0);

      expect(WebBuf.compare(b, c)).toBe(-1);
      expect(WebBuf.compare(c, d)).toBe(1);
      expect(WebBuf.compare(d, b)).toBe(1);
      expect(WebBuf.compare(b, d)).toBe(-1);
      expect(WebBuf.compare(c, c)).toBe(0);
      expect(WebBuf.compare(d, b)).toBe(1);

      expect(WebBuf.compare(WebBuf.alloc(0), WebBuf.alloc(0))).toBe(0);
      expect(WebBuf.compare(WebBuf.alloc(0), WebBuf.alloc(1))).toBe(-1);
      expect(WebBuf.compare(WebBuf.alloc(1), WebBuf.alloc(0))).toBe(1);
    });
  });

  describe("from", () => {
    it("should convert from hex", () => {
      const webBuf = WebBuf.from("deadbeef", "hex");
      expect(webBuf.toHex()).toBe("deadbeef");
      expect(webBuf instanceof WebBuf).toBe(true);
    });
  });

  describe("slice", () => {
    it("should slice a buffer", () => {
      const webBuf = WebBuf.from("deadbeef", "hex");
      const sliced = webBuf.slice(1, 3);
      expect(sliced.toHex()).toBe("adbe");
      expect(sliced instanceof WebBuf).toBe(true);
    });
  });

  describe("subarray", () => {
    it("should subarray a buffer", () => {
      const webBuf = WebBuf.from("deadbeef", "hex");
      const subarray = webBuf.subarray(1, 3);
      expect(subarray.toHex()).toBe("adbe");
      expect(subarray instanceof WebBuf).toBe(true);
    });
  });

  describe("base64", () => {
    it("should encode and decode base64", () => {
      const myStr = "Hello, World!";
      const buf = WebBuf.fromString(myStr);
      const base64 = buf.toBase64();
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toString()).toBe(myStr);
    });

    it("should encode and decode arbitrary binary data", () => {
      const hex =
        "000102030405060708090a0b0c0d0e0ff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff";
      const buf = WebBuf.fromHex(hex);
      const base64 = buf.toBase64();
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toHex()).toBe(hex);
    });

    it("should encode and decode arbitrary binary data of length n, n+1, n+2 ... m", () => {
      for (let i = 0; i < 100; i++) {
        const hex = new Array(i)
          .fill(0)
          .map((_, i) => i.toString(16).padStart(2, "0"))
          .join("");
        const buf = WebBuf.fromHex(hex);
        const base64 = buf.toBase64();
        const decoded = WebBuf.fromBase64(base64);
        expect(decoded.toHex()).toBe(hex);
      }
    });
  });

  describe("hex", () => {
    it("should encode and decode hex", () => {
      const myStr = "Hello, World!";
      const buf = WebBuf.fromString(myStr);
      const hex = buf.toHex();
      const decoded = WebBuf.fromHex(hex);
      expect(decoded.toString()).toBe(myStr);
    });
  });

  describe("base64", () => {
    it("should decode base64", () => {
      const base64 = "YW9ldQ==";
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toString()).toBe("aoeu");
    });

    it("should ignore whitespace", () => {
      const base64 = "\n   YW9ldQ==  ";
      const decoded = WebBuf.fromBase64(base64, true);
      expect(decoded.toString()).toBe("aoeu");
    });

    it("should handle newline in utf8", () => {
      const base64 =
        "LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK";
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toString()).toBe(
        "---\ntitle: Three dashes marks the spot\ntags:\n",
      );
    });

    it("should strip newline in base64", () => {
      const base64 =
        "LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoKICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt";
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toString()).toBe(
        "---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-",
      );
    });

    it("invalid non-alaphanumeric characters should throws", () => {
      const base64 = "!\"#$%&'()*,.:;<=>?@[\\]^`{|}~";
      expect(() => WebBuf.fromBase64(base64)).toThrow();
    });
  });

  describe("read/write unsigned integers and signed integers", () => {
    describe("u8", () => {
      it("should write a valid u8", () => {
        const buf = WebBuf.alloc(1);
        buf.writeUint8(255, 0);
        expect(buf.readUint8(0)).toBe(255);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(1);
        expect(() => buf.writeUint8(256, 0)).toThrow();
      });

      it("should write a valid u8 with valid offset", () => {
        const buf = WebBuf.alloc(2);
        buf.writeUint8(255, 1);
        expect(buf.readUint8(1)).toBe(255);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(1);
        expect(() => buf.writeUint8(255, 1)).toThrow();
      });
    });

    describe("u16le", () => {
      it("should write a valid u16le", () => {
        const buf = WebBuf.alloc(2);
        buf.writeUint16LE(0x1234, 0);
        expect(buf.readUint16LE(0)).toBe(0x1234);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(2);
        expect(() => buf.writeUint16LE(0x12345, 0)).toThrow();
      });

      it("should write a valid u16le with valid offset", () => {
        const buf = WebBuf.alloc(3);
        buf.writeUint16LE(0x1234, 1);
        expect(buf.readUint16LE(1)).toBe(0x1234);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(2);
        expect(() => buf.writeUint16LE(0x1234, 1)).toThrow();
      });
    });

    describe("u16be", () => {
      it("should write a valid u16be", () => {
        const buf = WebBuf.alloc(2);
        buf.writeUint16BE(0x1234, 0);
        expect(buf.readUint16BE(0)).toBe(0x1234);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(2);
        expect(() => buf.writeUint16BE(0x12345, 0)).toThrow();
      });

      it("should write a valid u16be with valid offset", () => {
        const buf = WebBuf.alloc(3);
        buf.writeUint16BE(0x1234, 1);
        expect(buf.readUint16BE(1)).toBe(0x1234);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(2);
        expect(() => buf.writeUint16BE(0x1234, 1)).toThrow();
      });
    });

    describe("u32le", () => {
      it("should write a valid u32le", () => {
        const buf = WebBuf.alloc(4);
        buf.writeUint32LE(0x12345678, 0);
        expect(buf.readUint32LE(0)).toBe(0x12345678);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(4);
        expect(() => buf.writeUint32LE(0x123456789, 0)).toThrow();
      });

      it("should write a valid u32le with valid offset", () => {
        const buf = WebBuf.alloc(5);
        buf.writeUint32LE(0x12345678, 1);
        expect(buf.readUint32LE(1)).toBe(0x12345678);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(4);
        expect(() => buf.writeUint32LE(0x12345678, 1)).toThrow();
      });

      it("should write and read the biggest u32le", () => {
        const buf = WebBuf.alloc(4);
        buf.writeUint32LE(0xffffffff, 0);
        expect(buf.readUint32LE(0)).toBe(0xffffffff);
      });
    });

    describe("u32be", () => {
      it("should write a valid u32be", () => {
        const buf = WebBuf.alloc(4);
        buf.writeUint32BE(0x12345678, 0);
        expect(buf.readUint32BE(0)).toBe(0x12345678);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(4);
        expect(() => buf.writeUint32BE(0x123456789, 0)).toThrow();
      });

      it("should write a valid u32be with valid offset", () => {
        const buf = WebBuf.alloc(5);
        buf.writeUint32BE(0x12345678, 1);
        expect(buf.readUint32BE(1)).toBe(0x12345678);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(4);
        expect(() => buf.writeUint32BE(0x12345678, 1)).toThrow();
      });

      it("should write and read the biggest u32be", () => {
        const buf = WebBuf.alloc(4);
        buf.writeUint32BE(0xffffffff, 0);
        expect(buf.readUint32BE(0)).toBe(0xffffffff);
      });
    });

    describe("u64le", () => {
      it("should write a valid u64le", () => {
        const buf = WebBuf.alloc(8);
        buf.writeBigUint64LE(1311768467463790320n, 0);
        expect(buf.readBigUint64LE(0)).toBe(1311768467463790320n);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(8);
        expect(() => buf.writeBigUint64LE(0x12345678901234567n, 0)).toThrow();
      });

      it("should write a valid u64le with valid offset", () => {
        const buf = WebBuf.alloc(9);
        buf.writeBigUint64LE(0xf0debc9a78563412n, 1);
        expect(buf.readBigUint64LE(1)).toBe(0xf0debc9a78563412n);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(8);
        expect(() => buf.writeBigUint64LE(0xf0debc9a78563412n, 1)).toThrow();
      });

      it("should write and read the biggest u64le", () => {
        const buf = WebBuf.alloc(8);
        buf.writeBigUint64LE(0xffffffffffffffffn, 0);
        expect(buf.readBigUint64LE(0)).toBe(0xffffffffffffffffn);
      });
    });

    describe("u64be", () => {
      it("should write a valid u64be", () => {
        const buf = WebBuf.alloc(8);
        buf.writeBigUint64BE(1311768467463790320n, 0);
        expect(buf.readBigUint64BE(0)).toBe(1311768467463790320n);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(8);
        expect(() => buf.writeBigUint64BE(0x12345678901234567n, 0)).toThrow();
      });

      it("should write a valid u64be with valid offset", () => {
        const buf = WebBuf.alloc(9);
        buf.writeBigUint64BE(0xf0debc9a78563412n, 1);
        expect(buf.readBigUint64BE(1)).toBe(0xf0debc9a78563412n);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(8);
        expect(() => buf.writeBigUint64BE(0xf0debc9a78563412n, 1)).toThrow();
      });

      it("should write and read the biggest u64be", () => {
        const buf = WebBuf.alloc(8);
        buf.writeBigUint64BE(0xffffffffffffffffn, 0);
        expect(buf.readBigUint64BE(0)).toBe(0xffffffffffffffffn);
      });
    });

    describe("u128le", () => {
      it("should write a valid u128le", () => {
        const buf = WebBuf.alloc(16);
        buf.writeBigUint128LE(1311768467463790320n, 0);
        expect(buf.readBigUint128LE(0)).toBe(1311768467463790320n);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(16);
        expect(() =>
          buf.writeBigUint128LE(0xffffffffffffffffffffffffffffffffn + 1n, 0),
        ).toThrow();
      });

      it("should write a valid u128le with valid offset", () => {
        const buf = WebBuf.alloc(17);
        buf.writeBigUint128LE(0xf0debc9a78563412n, 1);
        expect(buf.readBigUint128LE(1)).toBe(0xf0debc9a78563412n);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(16);
        expect(() => buf.writeBigUint128LE(0xf0debc9a78563412n, 1)).toThrow();
      });

      it("should write and read the biggest u128le", () => {
        const buf = WebBuf.alloc(16);
        buf.writeBigUint128LE(0xffffffffffffffffffffffffffffffffn, 0);
        expect(buf.readBigUint128LE(0)).toBe(
          0xffffffffffffffffffffffffffffffffn,
        );
      });
    });

    describe("u128be", () => {
      it("should write a valid u128be", () => {
        const buf = WebBuf.alloc(16);
        buf.writeBigUint128BE(1311768467463790320n, 0);
        expect(buf.readBigUint128BE(0)).toBe(1311768467463790320n);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(16);
        expect(() =>
          buf.writeBigUint128BE(0xffffffffffffffffffffffffffffffffn + 1n, 0),
        ).toThrow();
      });

      it("should write a valid u128be with valid offset", () => {
        const buf = WebBuf.alloc(17);
        buf.writeBigUint128BE(0xf0debc9a78563412n, 1);
        expect(buf.readBigUint128BE(1)).toBe(0xf0debc9a78563412n);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(16);
        expect(() => buf.writeBigUint128BE(0xf0debc9a78563412n, 1)).toThrow();
      });

      it("should write and read the biggest u128be", () => {
        const buf = WebBuf.alloc(16);
        buf.writeBigUint128BE(0xffffffffffffffffffffffffffffffffn, 0);
        expect(buf.readBigUint128BE(0)).toBe(
          0xffffffffffffffffffffffffffffffffn,
        );
      });
    });

    describe("u256le", () => {
      it("should write a valid u256le", () => {
        const buf = WebBuf.alloc(32);
        buf.writeBigUint256LE(1311768467463790320n, 0);
        expect(buf.readBigUint256LE(0)).toBe(1311768467463790320n);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(32);
        expect(() =>
          buf.writeBigUint256LE(
            0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn +
              1n,
            0,
          ),
        ).toThrow();
      });

      it("should write a valid u256le with valid offset", () => {
        const buf = WebBuf.alloc(33);
        buf.writeBigUint256LE(0xf0debc9a78563412n, 1);
        expect(buf.readBigUint256LE(1)).toBe(0xf0debc9a78563412n);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(32);
        expect(() => buf.writeBigUint256LE(0xf0debc9a78563412n, 1)).toThrow();
      });

      it("should write and read the biggest u256le", () => {
        const buf = WebBuf.alloc(32);
        buf.writeBigUint256LE(
          0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
          0,
        );
        expect(buf.readBigUint256LE(0)).toBe(
          0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
        );
      });
    });

    describe("u256be", () => {
      it("should write a valid u256be", () => {
        const buf = WebBuf.alloc(32);
        buf.writeBigUint256BE(1311768467463790320n, 0);
        expect(buf.readBigUint256BE(0)).toBe(1311768467463790320n);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(32);
        expect(() =>
          buf.writeBigUint256BE(
            0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn +
              1n,
            0,
          ),
        ).toThrow();
      });

      it("should write a valid u256be with valid offset", () => {
        const buf = WebBuf.alloc(33);
        buf.writeBigUint256BE(0xf0debc9a78563412n, 1);
        expect(buf.readBigUint256BE(1)).toBe(0xf0debc9a78563412n);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(32);
        expect(() => buf.writeBigUint256BE(0xf0debc9a78563412n, 1)).toThrow();
      });

      it("should write and read the biggest u256be", () => {
        const buf = WebBuf.alloc(32);
        buf.writeBigUint256BE(
          0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
          0,
        );
        expect(buf.readBigUint256BE(0)).toBe(
          0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
        );
      });
    });
  });

  describe("read/write unsigned integers and signed integers", () => {
    describe("i8", () => {
      it("should write a valid i8", () => {
        const buf = WebBuf.alloc(1);
        buf.writeInt8(-1, 0);
        expect(buf.readInt8(0)).toBe(-1);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(1);
        expect(() => buf.writeInt8(-129, 0)).toThrow();
      });

      it("should write a valid i8 with valid offset", () => {
        const buf = WebBuf.alloc(2);
        buf.writeInt8(-1, 1);
        expect(buf.readInt8(1)).toBe(-1);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(1);
        expect(() => buf.writeInt8(-1, 1)).toThrow();
      });
    });

    describe("i16le", () => {
      it("should write a valid i16le", () => {
        const buf = WebBuf.alloc(2);
        buf.writeInt16LE(-30584, 0);
        expect(buf.readInt16LE(0)).toBe(-30584);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(2);
        expect(() => buf.writeInt16LE(-0x8000 - 1, 0)).toThrow();
      });

      it("should write a valid i16le with valid offset", () => {
        const buf = WebBuf.alloc(3);
        buf.writeInt16LE(-30584, 1);
        expect(buf.readInt16LE(1)).toBe(-30584);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(2);
        expect(() => buf.writeInt16LE(-30584, 1)).toThrow();
      });
    });

    describe("i16be", () => {
      it("should write a valid i16be", () => {
        const buf = WebBuf.alloc(2);
        buf.writeInt16BE(-30584, 0);
        expect(buf.readInt16BE(0)).toBe(-30584);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(2);
        expect(() => buf.writeInt16BE(-0x8000 - 1, 0)).toThrow();
      });

      it("should write a valid i16be with valid offset", () => {
        const buf = WebBuf.alloc(3);
        buf.writeInt16BE(-30584, 1);
        expect(buf.readInt16BE(1)).toBe(-30584);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(2);
        expect(() => buf.writeInt16BE(-30584, 1)).toThrow();
      });
    });

    describe("i32le", () => {
      it("should write a valid i32le", () => {
        const buf = WebBuf.alloc(4);
        buf.writeInt32LE(-30584, 0);
        expect(buf.readInt32LE(0)).toBe(-30584);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(4);
        expect(() => buf.writeInt32LE(-0x80000000 - 1, 0)).toThrow();
      });

      it("should write a valid i32le with valid offset", () => {
        const buf = WebBuf.alloc(5);
        buf.writeInt32LE(-30584, 1);
        expect(buf.readInt32LE(1)).toBe(-30584);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(4);
        expect(() => buf.writeInt32LE(-30584, 1)).toThrow();
      });

      it("should write and read the biggest i32le", () => {
        const buf = WebBuf.alloc(4);
        buf.writeInt32LE(-0x80000000, 0);
        expect(buf.readInt32LE(0)).toBe(-0x80000000);
      });
    });

    describe("i32be", () => {
      it("should write a valid i32be", () => {
        const buf = WebBuf.alloc(4);
        buf.writeInt32BE(-30584, 0);
        expect(buf.readInt32BE(0)).toBe(-30584);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(4);
        expect(() => buf.writeInt32BE(-0x80000000 - 1, 0)).toThrow();
      });

      it("should write a valid i32be with valid offset", () => {
        const buf = WebBuf.alloc(5);
        buf.writeInt32BE(-30584, 1);
        expect(buf.readInt32BE(1)).toBe(-30584);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(4);
        expect(() => buf.writeInt32BE(-30584, 1)).toThrow();
      });

      it("should write and read the biggest i32be", () => {
        const buf = WebBuf.alloc(4);
        buf.writeInt32BE(-0x80000000, 0);
        expect(buf.readInt32BE(0)).toBe(-0x80000000);
      });
    });

    describe("i64le", () => {
      it("should write a valid i64le", () => {
        const buf = WebBuf.alloc(8);
        buf.writeBigInt64LE(-1311768467463790320n, 0);
        expect(buf.readBigInt64LE(0)).toBe(-1311768467463790320n);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(8);
        expect(() =>
          buf.writeBigInt64LE(-0x8000000000000000n - 1n, 0),
        ).toThrow();
      });

      it("should write a valid i64le with valid offset", () => {
        const buf = WebBuf.alloc(9);
        buf.writeBigInt64LE(-1311768467463790320n, 1);
        expect(buf.readBigInt64LE(1)).toBe(-1311768467463790320n);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(8);
        expect(() => buf.writeBigInt64LE(-1311768467463790320n, 1)).toThrow();
      });

      it("should write and read the biggest i64le", () => {
        const buf = WebBuf.alloc(8);
        buf.writeBigInt64LE(-0x8000000000000000n, 0);
        expect(buf.readBigInt64LE(0)).toBe(-0x8000000000000000n);
      });
    });

    describe("i64be", () => {
      it("should write a valid i64be", () => {
        const buf = WebBuf.alloc(8);
        buf.writeBigInt64BE(-1311768467463790320n, 0);
        expect(buf.readBigInt64BE(0)).toBe(-1311768467463790320n);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(8);
        expect(() =>
          buf.writeBigInt64BE(-0x8000000000000000n - 1n, 0),
        ).toThrow();
      });

      it("should write a valid i64be with valid offset", () => {
        const buf = WebBuf.alloc(9);
        buf.writeBigInt64BE(-1311768467463790320n, 1);
        expect(buf.readBigInt64BE(1)).toBe(-1311768467463790320n);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(8);
        expect(() => buf.writeBigInt64BE(-1311768467463790320n, 1)).toThrow();
      });

      it("should write and read the biggest i64be", () => {
        const buf = WebBuf.alloc(8);
        buf.writeBigInt64BE(-0x8000000000000000n, 0);
        expect(buf.readBigInt64BE(0)).toBe(-0x8000000000000000n);
      });
    });

    describe("i128le", () => {
      it("should write a valid i128le", () => {
        const hexBE = "01000000000000000000000000000000";
        const hexLE = "00000000000000000000000000000001";
        const bn = BigInt(`0x${hexBE}`);
        const buf = WebBuf.alloc(16);
        buf.writeBigInt128LE(bn, 0);
        expect(buf.toHex()).toBe(hexLE);
        expect(buf.readBigInt128LE(0).toString(16)).toBe(
          "1000000000000000000000000000000",
        );
      });

      it("should write another valid i128le", () => {
        const bn = BigInt(131176846746379032029384n);
        const buf = WebBuf.alloc(16);
        buf.writeBigInt128LE(bn, 0);
        expect(buf.readBigInt128LE(0)).toBe(131176846746379032029384n);
      });

      it("should write yet another valid i128le", () => {
        const bn = BigInt(-1311768467463790320234590827345n);
        const buf = WebBuf.alloc(16);
        buf.writeBigInt128LE(bn, 0);
        expect(buf.readBigInt128LE(0)).toBe(-1311768467463790320234590827345n);
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(16);
        expect(() =>
          buf.writeBigInt128LE(-0x80000000000000000000000000000000n - 1n, 0),
        ).toThrow();
      });

      it("should write a valid i128le with valid offset", () => {
        const buf = WebBuf.alloc(17);
        buf.writeBigInt128LE(-1311768467463790320234590827345n, 1);
        expect(buf.readBigInt128LE(1)).toBe(-1311768467463790320234590827345n);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(16);
        expect(() => buf.writeBigInt128LE(-1311768467463790320n, 1)).toThrow();
      });

      it("should write and read the biggest i128le", () => {
        const buf = WebBuf.alloc(16);
        buf.writeBigInt128LE(-0x80000000000000000000000000000000n, 0);
        expect(buf.readBigInt128LE(0)).toBe(
          -0x80000000000000000000000000000000n,
        );
      });
    });

    describe("i128be", () => {
      it("should write a valid i128be", () => {
        const hexBE = "01000000000000000000000000000000";
        const bn = BigInt(`0x${hexBE}`);
        const buf = WebBuf.alloc(16);
        buf.writeBigInt128BE(bn, 0);
        expect(buf.toHex()).toBe(hexBE);
        expect(buf.readBigInt128BE(0).toString(16)).toBe(
          "1000000000000000000000000000000",
        );
      });

      it("should write another valid i128be", () => {
        const bn = BigInt(131176846746379032029384n);
        const buf = WebBuf.alloc(16);
        buf.writeBigInt128BE(bn, 0);
        expect(buf.readBigInt128BE(0)).toBe(131176846746379032029384n);
      });

      it("should write yet another valid i128be", () => {
        const bn = BigInt(-1311768467463790320234590827345n);
        const buf = WebBuf.alloc(16);
        buf.writeBigInt128BE(bn, 0);
        expect(buf.readBigInt128BE(0)).toBe(-1311768467463790320234590827345n);
      });

      it("should write a valid i128be with valid offset", () => {
        const buf = WebBuf.alloc(17);
        buf.writeBigInt128BE(-1311768467463790320234590827345n, 1);
        expect(buf.readBigInt128BE(1)).toBe(-1311768467463790320234590827345n);
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(16);
        expect(() => buf.writeBigInt128BE(-1311768467463790320n, 1)).toThrow();
      });

      it("should write and read the biggest i128be", () => {
        const buf = WebBuf.alloc(16);
        buf.writeBigInt128BE(-0x80000000000000000000000000000000n, 0);
        expect(buf.readBigInt128BE(0)).toBe(
          -0x80000000000000000000000000000000n,
        );
      });
    });

    describe("i256le", () => {
      it("should write a valid i256le", () => {
        const hexBE = `01${"00".repeat(31)}`;
        const hexLE = `${"00".repeat(31)}01`;
        const bn = BigInt(`0x${hexBE}`);
        const buf = WebBuf.alloc(32);
        buf.writeBigInt256LE(bn, 0);
        expect(buf.toHex()).toBe(hexLE);
        expect(buf.readBigInt256LE(0).toString(16)).toBe(`1${"0".repeat(62)}`);
      });

      it("should write another valid i256le", () => {
        const bn = BigInt(13117684674632349085779032029384n);
        const buf = WebBuf.alloc(32);
        buf.writeBigInt256LE(bn, 0);
        expect(buf.readBigInt256LE(0)).toBe(13117684674632349085779032029384n);
      });

      it("should write yet another valid i256le", () => {
        const bn = BigInt(-131176846746379032023234582344590827345n);
        const buf = WebBuf.alloc(32);
        buf.writeBigInt256LE(bn, 0);
        expect(buf.readBigInt256LE(0)).toBe(
          -131176846746379032023234582344590827345n,
        );
      });

      it("should throw if writing a number that is too big", () => {
        const buf = WebBuf.alloc(32);
        expect(() =>
          buf.writeBigInt256LE(BigInt(`0x${"f".repeat(64)}`) + 1n, 0),
        ).toThrow();
      });

      it("should write a valid i256le with valid offset", () => {
        const buf = WebBuf.alloc(33);
        buf.writeBigInt256LE(-131176846746379032023234582344590827345n, 1);
        expect(buf.readBigInt256LE(1)).toBe(
          -131176846746379032023234582344590827345n,
        );
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(32);
        expect(() =>
          buf.writeBigInt256LE(-131176846746379032023234582344590827345n, 1),
        ).toThrow();
      });

      it("should write and read the biggest i256le", () => {
        const buf = WebBuf.alloc(32);
        buf.writeBigInt256LE(-BigInt(`0x7f${"f".repeat(62)}`), 0);
        expect(buf.readBigInt256LE(0)).toBe(-BigInt(`0x7f${"f".repeat(62)}`));
      });
    });

    describe("i256be", () => {
      it("should write a valid i256be", () => {
        const hexBE = `01${"00".repeat(31)}`;
        const bn = BigInt(`0x${hexBE}`);
        const buf = WebBuf.alloc(32);
        buf.writeBigInt256BE(bn, 0);
        expect(buf.toHex()).toBe(hexBE);
        expect(buf.readBigInt256BE(0).toString(16)).toBe(`1${"0".repeat(62)}`);
      });

      it("should write another valid i256be", () => {
        const bn = BigInt(13117684674632349085779032029384n);
        const buf = WebBuf.alloc(32);
        buf.writeBigInt256BE(bn, 0);
        expect(buf.readBigInt256BE(0)).toBe(13117684674632349085779032029384n);
      });

      it("should write yet another valid i256be", () => {
        const bn = BigInt(-131176846746379032023234582344590827345n);
        const buf = WebBuf.alloc(32);
        buf.writeBigInt256BE(bn, 0);
        expect(buf.readBigInt256BE(0)).toBe(
          -131176846746379032023234582344590827345n,
        );
      });

      it("should write a valid i256be with valid offset", () => {
        const buf = WebBuf.alloc(33);
        buf.writeBigInt256BE(-131176846746379032023234582344590827345n, 1);
        expect(buf.readBigInt256BE(1)).toBe(
          -131176846746379032023234582344590827345n,
        );
      });

      it("should throw if offset is invalid", () => {
        const buf = WebBuf.alloc(32);
        expect(() =>
          buf.writeBigInt256BE(-131176846746379032023234582344590827345n, 1),
        ).toThrow();
      });

      it("should write and read the biggest i256be", () => {
        const buf = WebBuf.alloc(32);
        buf.writeBigInt256BE(-BigInt(`0x7f${"f".repeat(62)}`), 0);
        expect(buf.readBigInt256BE(0)).toBe(-BigInt(`0x7f${"f".repeat(62)}`));
      });
    });
  });
});
