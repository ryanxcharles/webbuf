// import vittest requirements
import { describe, it, expect } from "vitest";
import { WebBuf } from "../webbuf.js";
import { Buffer } from "buffer";

describe("WebBuf", () => {
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
    // t.equal((new B('YW9ldQ', 'base64').toString()), 'aoeu')
    it("should decode base64", () => {
      const base64 = "YW9ldQ==";
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toString()).toBe("aoeu");
    });

    it("should ignore whitespace", () => {
      // const text = '\n   YW9ldQ==  '
      // const buf = new B(text, 'base64')
      // t.equal(buf.toString(), 'aoeu')
      const base64 = "\n   YW9ldQ==  ";
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toString()).toBe("aoeu");
    });

    it("should handle newline in utf8", () => {
      // new B('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK', 'base64').toString('utf8'),
      // '---\ntitle: Three dashes marks the spot\ntags:\n'
      const base64 =
        "LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK";
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toString()).toBe(
        "---\ntitle: Three dashes marks the spot\ntags:\n",
      );
    });

    it("should strip newline in base64", () => {
      // new B('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK\nICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt', 'base64').toString('utf8'),
      // '---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-'
      const base64 =
        "LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoKICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt";
      const decoded = WebBuf.fromBase64(base64);
      expect(decoded.toString()).toBe(
        "---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-",
      );
    });

    it("invalid non-alaphanumeric characters should throws", () => {
      // new B('!"#$%&\'()*,.:;<=>?@[\\]^`{|}~', 'base64').toString('utf8'),
      // ''
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
          buf.writeBigUint256LE(0xffffffffffffffffffffffffffffffffn + 1n, 0),
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
        buf.writeBigUint256LE(0xffffffffffffffffffffffffffffffffn, 0);
        expect(buf.readBigUint256LE(0)).toBe(
          0xffffffffffffffffffffffffffffffffn,
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
          buf.writeBigUint256BE(0xffffffffffffffffffffffffffffffffn + 1n, 0),
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
        buf.writeBigUint256BE(0xffffffffffffffffffffffffffffffffn, 0);
        expect(buf.readBigUint256BE(0)).toBe(
          0xffffffffffffffffffffffffffffffffn,
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
      
      // it("should write a valid i128be with valid offset", () => {
      //   const buf = WebBuf.alloc(17);
      //   buf.writeBigInt128BE(-1311768467463790320234590827345n, 1);
      //   expect(buf.readBigInt128BE(1)).toBe(-1311768467463790320234590827345n);
      // });

    });
  });
});
