import { WebBuf } from "@webbuf/webbuf";
import { FixedBuf } from "@webbuf/fixedbuf";
import { U8, U16BE, U32BE, U64BE, U128BE, U256BE } from "@webbuf/numbers";

export class BufReader {
  buf: WebBuf;
  pos: number;

  constructor(buf: WebBuf) {
    this.buf = buf;
    this.pos = 0;
  }

  eof(): boolean {
    return this.pos >= this.buf.length;
  }

  read(len: number): WebBuf {
    if (this.pos + len > this.buf.length) {
      throw new Error("not enough bytes in the buffer to read");
    }
    const buf = this.buf.subarray(this.pos, this.pos + len);
    const newBuf = WebBuf.alloc(len);
    newBuf.set(buf);
    this.pos += len;
    return newBuf;
  }

  readFixed<N extends number>(len: N): FixedBuf<N> {
    const isoBuf = this.read(len);
    return FixedBuf.fromBuf(len, isoBuf) as FixedBuf<N>;
  }

  readRemainder(): WebBuf {
    return this.read(this.buf.length - this.pos);
  }

  readU8(): U8 {
    let val: U8;
    try {
      val = U8.fromBEBuf(
        FixedBuf.fromBuf(1, this.buf.subarray(this.pos, this.pos + 1)),
      );
    } catch (err: unknown) {
      throw new Error("not enough bytes in the buffer to read");
    }
    this.pos += 1;
    return val;
  }

  readU16BE(): U16BE {
    let val: U16BE;
    try {
      val = U16BE.fromBEBuf(
        FixedBuf.fromBuf(2, this.buf.subarray(this.pos, this.pos + 2)),
      );
    } catch (err: unknown) {
      throw new Error("not enough bytes in the buffer to read");
    }
    this.pos += 2;
    return val;
  }

  readU32BE(): U32BE {
    let val: U32BE;
    try {
      val = U32BE.fromBEBuf(
        FixedBuf.fromBuf(4, this.buf.subarray(this.pos, this.pos + 4)),
      );
    } catch (err: unknown) {
      throw new Error("not enough bytes in the buffer to read");
    }
    this.pos += 4;
    return val;
  }

  readU64BE(): U64BE {
    let val: U64BE;
    try {
      val = U64BE.fromBEBuf(
        FixedBuf.fromBuf(8, this.buf.subarray(this.pos, this.pos + 8)),
      );
    } catch (err: unknown) {
      throw new Error("not enough bytes in the buffer to read");
    }
    this.pos += 8;
    return val;
  }

  readU128BE(): U128BE {
    let val: U128BE;
    try {
      val = U128BE.fromBEBuf(
        FixedBuf.fromBuf(16, this.buf.subarray(this.pos, this.pos + 16)),
      );
    } catch (err: unknown) {
      throw new Error("not enough bytes in the buffer to read");
    }
    this.pos += 16;
    return val;
  }

  readU256BE(): U256BE {
    let val: U256BE;
    try {
      val = U256BE.fromBEBuf(
        FixedBuf.fromBuf(32, this.buf.subarray(this.pos, this.pos + 32)),
      );
    } catch (err: unknown) {
      throw new Error("not enough bytes in the buffer to read");
    }
    this.pos += 32;
    return val;
  }

  readVarIntBEBuf(): WebBuf {
    const first = this.readU8().n;
    if (first === 0xfd) {
      const buf = this.read(2);
      if (buf.readUint16BE(0) < 0xfd) {
        throw new Error("non-minimal encoding");
      }
      return WebBuf.concat([WebBuf.from([first]), buf]);
    }
    if (first === 0xfe) {
      const buf = this.read(4);
      if (buf.readUint32BE(0) < 0x10000) {
        throw new Error("non-minimal encoding");
      }
      return WebBuf.concat([WebBuf.from([first]), buf]);
    }
    if (first === 0xff) {
      const buf = this.read(8);
      const bn = buf.readBigUint64BE(0);
      if (bn < 0x100000000n) {
        throw new Error("non-minimal encoding");
      }
      return WebBuf.concat([WebBuf.from([first]), buf]);
    }
    return WebBuf.from([first]);
  }

  readVarIntU64BE(): U64BE {
    const buf = this.readVarIntBEBuf();
    const first = buf.readUint8(0);
    let value: bigint;
    switch (first) {
      case 0xfd:
        value = BigInt(buf.readUint16BE(1));
        break;
      case 0xfe:
        value = BigInt(buf.readUint32BE(1));
        break;
      case 0xff:
        value = buf.readBigUint64BE(1);
        break;
      default:
        value = BigInt(first);
        break;
    }
    return U64BE.fromBn(value);
  }
}
