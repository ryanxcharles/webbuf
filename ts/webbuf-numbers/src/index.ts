import { WebBuf } from "@webbuf/webbuf";
import { FixedBuf } from "@webbuf/fixedbuf";

export abstract class FixedNum<N extends number> {
  buf: FixedBuf<N>;

  constructor(buf: FixedBuf<N>) {
    this.buf = buf;
  }

  // abstract static fromBn(bn: bigint): U<N>;
  abstract toBn(): bigint;
  abstract add(other: FixedNum<N>): FixedNum<N>;
  abstract sub(other: FixedNum<N>): FixedNum<N>;
  abstract mul(other: FixedNum<N>): FixedNum<N>;
  abstract div(other: FixedNum<N>): FixedNum<N>;
  abstract toBEBuf(): FixedBuf<N>;
  abstract toLEBuf(): FixedBuf<N>;
  abstract toHex(): string;
  // abstract static fromBEBuf(buf: FixedBuf<N>): U<N>;
  // abstract static fromLEBuf(buf: FixedBuf<N>): U<N>;
  // abstract static fromHex(hex: string): U<N>;
  abstract get n(): number;
  abstract get bn(): bigint;
}

export class U8 extends FixedNum<1> {
  static fromBn(bn: bigint): U8 {
    if (bn < 0 || bn > 0xffn) {
      throw new Error("Invalid number");
    }
    return new U8(FixedBuf.fromBuf(1, WebBuf.fromArray([Number(bn)])));
  }

  static fromN(n: number): U8 {
    return U8.fromBn(BigInt(n));
  }

  toBn(): bigint {
    return BigInt(this.buf.buf[0] as number);
  }

  add(other: U8): U8 {
    return U8.fromBn(this.toBn() + other.toBn());
  }

  sub(other: U8): U8 {
    return U8.fromBn(this.toBn() - other.toBn());
  }

  mul(other: U8): U8 {
    return U8.fromBn(this.toBn() * other.toBn());
  }

  div(other: U8): U8 {
    return U8.fromBn(this.toBn() / other.toBn());
  }

  toBEBuf(): FixedBuf<1> {
    return this.buf.clone();
  }

  toLEBuf(): FixedBuf<1> {
    return this.buf.clone();
  }

  toHex(): string {
    return this.buf.toHex();
  }

  static fromBEBuf(buf: FixedBuf<1>): U8 {
    return new U8(buf);
  }

  static fromLEBuf(buf: FixedBuf<1>): U8 {
    return new U8(buf);
  }

  static fromHex(hex: string): U8 {
    return new U8(FixedBuf.fromHex(1, hex));
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class U16BE extends FixedNum<2> {
  static fromBn(bn: bigint): U16BE {
    if (bn < 0 || bn > 0xffffn) {
      throw new Error("Invalid number");
    }
    return new U16BE(
      FixedBuf.fromBuf(2, WebBuf.fromArray([Number(bn >> 8n), Number(bn)])),
    );
  }

  static fromN(n: number): U16BE {
    return U16BE.fromBn(BigInt(n));
  }

  toBn(): bigint {
    return (BigInt(this.buf.buf[0] as number) << 8n) + BigInt(this.buf.buf[1] as number);
  }

  add(other: U16BE): U16BE {
    return U16BE.fromBn(this.toBn() + other.toBn());
  }

  sub(other: U16BE): U16BE {
    return U16BE.fromBn(this.toBn() - other.toBn());
  }

  mul(other: U16BE): U16BE {
    return U16BE.fromBn(this.toBn() * other.toBn());
  }

  div(other: U16BE): U16BE {
    return U16BE.fromBn(this.toBn() / other.toBn());
  }

  toBEBuf(): FixedBuf<2> {
    return this.buf.clone();
  }

  toLEBuf(): FixedBuf<2> {
    return this.buf.toReverse();
  }

  toHex(): string {
    return this.buf.toHex();
  }

  static fromBEBuf(buf: FixedBuf<2>): U16BE {
    return new U16BE(buf);
  }

  static fromLEBuf(buf: FixedBuf<2>): U16BE {
    return new U16BE(
      buf.toReverse(),
    );
  }

  static fromHex(hex: string): U16BE {
    return new U16BE(FixedBuf.fromHex(2, hex));
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class U32BE extends FixedNum<4> {
  static fromBn(bn: bigint): U32BE {
    const byteLen = 4;
    if (bn < 0 || bn > 0xffffffffffffffffn) {
      throw new Error("Invalid number");
    }
    const bytes = new Array(byteLen);
    for (let i = byteLen - 1; i >= 0; i--) {
      bytes[i] = Number(bn & 0xffn);
      bn >>= 8n; // Shift right by 8 bits in-place
    }
    return new U32BE(FixedBuf.fromBuf(byteLen, WebBuf.fromArray(bytes)));
  }

  static fromN(n: number): U32BE {
    return U32BE.fromBn(BigInt(n));
  }

  toBn(): bigint {
    const byteLen = 4;
    let result = 0n;
    for (let i = 0; i < byteLen; i++) {
      result = (result << 8n) + BigInt(this.buf.buf[i] as number);
    }
    return result;
  }

  add(other: U32BE): U32BE {
    return U32BE.fromBn(this.toBn() + other.toBn());
  }

  sub(other: U32BE): U32BE {
    return U32BE.fromBn(this.toBn() - other.toBn());
  }

  mul(other: U32BE): U32BE {
    return U32BE.fromBn(this.toBn() * other.toBn());
  }

  div(other: U32BE): U32BE {
    return U32BE.fromBn(this.toBn() / other.toBn());
  }

  toBEBuf(): FixedBuf<4> {
    return this.buf.clone();
  }

  toLEBuf(): FixedBuf<4> {
    return this.buf.toReverse();
  }

  toHex(): string {
    return this.buf.toHex();
  }

  static fromBEBuf(buf: FixedBuf<4>): U32BE {
    return new U32BE(buf);
  }

  static fromLEBuf(buf: FixedBuf<4>): U32BE {
    return new U32BE(
      buf.toReverse(),
    );
  }

  static fromHex(hex: string): U32BE {
    return new U32BE(FixedBuf.fromHex(4, hex));
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class U64BE extends FixedNum<8> {
  static fromBn(bn: bigint): U64BE {
    const byteLen = 8;
    if (bn < 0 || bn > 0xffffffffffffffffn) {
      throw new Error("Invalid number");
    }
    const bytes = new Array(byteLen);
    for (let i = byteLen - 1; i >= 0; i--) {
      bytes[i] = Number(bn & 0xffn);
      bn >>= 8n; // Shift right by 8 bits in-place
    }
    return new U64BE(FixedBuf.fromBuf(byteLen, WebBuf.fromArray(bytes)));
  }

  static fromN(n: number): U64BE {
    return U64BE.fromBn(BigInt(n));
  }

  toBn(): bigint {
    const byteLen = 8;
    let result = 0n;
    for (let i = 0; i < byteLen; i++) {
      result = (result << 8n) + BigInt(this.buf.buf[i] as number);
    }
    return result;
  }

  add(other: U64BE): U64BE {
    return U64BE.fromBn(this.toBn() + other.toBn());
  }

  sub(other: U64BE): U64BE {
    return U64BE.fromBn(this.toBn() - other.toBn());
  }

  mul(other: U64BE): U64BE {
    return U64BE.fromBn(this.toBn() * other.toBn());
  }

  div(other: U64BE): U64BE {
    return U64BE.fromBn(this.toBn() / other.toBn());
  }

  toBEBuf(): FixedBuf<8> {
    return this.buf.clone();
  }

  toLEBuf(): FixedBuf<8> {
    return this.buf.toReverse();
  }

  toHex(): string {
    return this.buf.toHex();
  }

  static fromBEBuf(buf: FixedBuf<8>): U64BE {
    return new U64BE(buf);
  }

  static fromLEBuf(buf: FixedBuf<8>): U64BE {
    return new U64BE(
      buf.toReverse(),
    );
  }

  static fromHex(hex: string): U64BE {
    return new U64BE(FixedBuf.fromHex(8, hex));
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class U128BE extends FixedNum<16> {
  static fromBn(bn: bigint): U128BE {
    const byteLen = 16;
    if (bn < 0 || bn > 0xffffffffffffffffffffffffffffffffn) {
      throw new Error("Invalid number");
    }
    const bytes = new Array(byteLen);
    for (let i = byteLen - 1; i >= 0; i--) {
      bytes[i] = Number(bn & 0xffn);
      bn >>= 8n; // Shift right by 8 bits in-place
    }
    return new U128BE(FixedBuf.fromBuf(byteLen, WebBuf.fromArray(bytes)));
  }

  static fromN(n: number): U128BE {
    return U128BE.fromBn(BigInt(n));
  }

  toBn(): bigint {
    const byteLen = 16;
    let result = 0n;
    for (let i = 0; i < byteLen; i++) {
      result = (result << 8n) + BigInt(this.buf.buf[i] as number);
    }
    return result;
  }

  add(other: U128BE): U128BE {
    return U128BE.fromBn(this.toBn() + other.toBn());
  }

  sub(other: U128BE): U128BE {
    return U128BE.fromBn(this.toBn() - other.toBn());
  }

  mul(other: U128BE): U128BE {
    return U128BE.fromBn(this.toBn() * other.toBn());
  }

  div(other: U128BE): U128BE {
    return U128BE.fromBn(this.toBn() / other.toBn());
  }

  toBEBuf(): FixedBuf<16> {
    return this.buf.clone();
  }

  toLEBuf(): FixedBuf<16> {
    return this.buf.toReverse();
  }

  toHex(): string {
    return this.buf.toHex();
  }

  static fromBEBuf(buf: FixedBuf<16>): U128BE {
    return new U128BE(buf);
  }

  static fromLEBuf(buf: FixedBuf<16>): U128BE {
    return new U128BE(
      buf.toReverse(),
    );
  }

  static fromHex(hex: string): U128BE {
    return new U128BE(FixedBuf.fromHex(16, hex));
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class U256BE extends FixedNum<32> {
  static fromBn(bn: bigint): U256BE {
    const byteLen = 32;
    if (
      bn < 0 ||
      bn > 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn
    ) {
      throw new Error("Invalid number");
    }
    const bytes = new Array(byteLen);
    for (let i = byteLen - 1; i >= 0; i--) {
      bytes[i] = Number(bn & 0xffn);
      bn >>= 8n; // Shift right by 8 bits in-place
    }
    return new U256BE(FixedBuf.fromBuf(byteLen, WebBuf.fromArray(bytes)));
  }

  static fromN(n: number): U256BE {
    return U256BE.fromBn(BigInt(n));
  }

  toBn(): bigint {
    const byteLen = 32;
    let result = 0n;
    for (let i = 0; i < byteLen; i++) {
      result = (result << 8n) + BigInt(this.buf.buf[i] as number);
    }
    return result;
  }

  add(other: U256BE): U256BE {
    return U256BE.fromBn(this.toBn() + other.toBn());
  }

  sub(other: U256BE): U256BE {
    return U256BE.fromBn(this.toBn() - other.toBn());
  }

  mul(other: U256BE): U256BE {
    return U256BE.fromBn(this.toBn() * other.toBn());
  }

  div(other: U256BE): U256BE {
    return U256BE.fromBn(this.toBn() / other.toBn());
  }

  toBEBuf(): FixedBuf<32> {
    return this.buf.clone();
  }

  toLEBuf(): FixedBuf<32> {
    return this.buf.toReverse();
  }

  toHex(): string {
    return this.buf.toHex();
  }

  static fromBEBuf(buf: FixedBuf<32>): U256BE {
    return new U256BE(buf);
  }

  static fromLEBuf(buf: FixedBuf<32>): U256BE {
    return new U256BE(
      buf.toReverse(),
    );
  }

  static fromHex(hex: string): U256BE {
    return new U256BE(FixedBuf.fromHex(32, hex));
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}
