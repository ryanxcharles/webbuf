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

export class U16 extends FixedNum<2> {
  static fromBn(bn: bigint): U16 {
    if (bn < 0 || bn > 0xffffn) {
      throw new Error("Invalid number");
    }
    return new U16(
      FixedBuf.fromBuf(2, WebBuf.fromArray([Number(bn >> 8n), Number(bn)])),
    );
  }

  toBn(): bigint {
    return (BigInt(this.buf.buf[0] as number) << 8n) + BigInt(this.buf.buf[1]);
  }

  add(other: U16): U16 {
    return U16.fromBn(this.toBn() + other.toBn());
  }

  sub(other: U16): U16 {
    return U16.fromBn(this.toBn() - other.toBn());
  }

  mul(other: U16): U16 {
    return U16.fromBn(this.toBn() * other.toBn());
  }

  div(other: U16): U16 {
    return U16.fromBn(this.toBn() / other.toBn());
  }

  toBEBuf(): FixedBuf<2> {
    return this.buf.clone();
  }

  toLEBuf(): FixedBuf<2> {
    return FixedBuf.fromBuf(2, WebBuf.fromArray([this.buf.buf[1], this.buf.buf[0]]));
  }

  toHex(): string {
    return this.buf.toHex();
  }

  static fromBEBuf(buf: FixedBuf<2>): U16 {
    return new U16(buf);
  }

  static fromLEBuf(buf: FixedBuf<2>): U16 {
    return new U16(FixedBuf.fromBuf(2, WebBuf.fromArray([buf.buf[1], buf.buf[0]])));
  }

  static fromHex(hex: string): U16 {
    return new U16(FixedBuf.fromHex(2, hex));
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class U32 extends FixedNum<4> {
  static fromBn(bn: bigint): U32 {
    if (bn < 0 || bn > 0xffffffffn) {
      throw new Error("Invalid number");
    }
    return new U32(
      FixedBuf.fromBuf(4, WebBuf.fromArray([
        Number(bn >> 24n),
        Number(bn >> 16n),
        Number(bn >> 8n),
        Number(bn),
      ])),
    );
  }

  toBn(): bigint {
    return (BigInt(this.buf.buf[0] as number) << 24n) +
      (BigInt(this.buf.buf[1] as number) << 16n) +
      (BigInt(this.buf.buf[2] as number) << 8n) +
      BigInt(this.buf.buf[3]);
  }

  add(other: U32): U32 {
    return U32.fromBn(this.toBn() + other.toBn());
  }

  sub(other: U32): U32 {
    return U32.fromBn(this.toBn() - other.toBn());
  }

  mul(other: U32): U32 {
    return U32.fromBn(this.toBn() * other.toBn());
  }

  div(other: U32): U32 {
    return U32.fromBn(this.toBn() / other.toBn());
  }

  toBEBuf(): FixedBuf<4> {
    return this.buf.clone();
  }

  toLEBuf(): FixedBuf<4> {
    return FixedBuf.fromBuf(4, WebBuf.fromArray([this.buf.buf[3], this.buf.buf[2], this.buf.buf[1], this.buf.buf[0]]));
  }

  toHex(): string {
    return this.buf.toHex();
  }

  static fromBEBuf(buf: FixedBuf<4>): U32 {
    return new U32(buf);
  }

  static fromLEBuf(buf: FixedBuf<4>): U32 {
    return new U32(FixedBuf.fromBuf(4, WebBuf.fromArray([buf.buf[3], buf.buf[2], buf.buf[1], buf.buf[0]])));
  }

  static fromHex(hex: string): U32 {
    return new U32(FixedBuf.fromHex(4, hex));
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class U64 extends FixedNum<8> {
  static fromBn(bn: bigint): U64 {
    if (bn < 0 || bn > 0xffffffffffffffffn) {
      throw new Error("Invalid number");
    }
    return new U64(
      FixedBuf.fromBuf(8, WebBuf.fromArray([
        Number(bn >> 56n),
        Number(bn >> 48n),
        Number(bn >> 40n),
        Number(bn >> 32n),
        Number(bn >> 24n),
        Number(bn >> 16n),
        Number(bn >> 8n),
        Number(bn),
      ])),
    );
  }

  toBn(): bigint {
    return (BigInt(this.buf.buf[0] as number) << 56n) +
      (BigInt(this.buf.buf[1] as number) << 48n) +
      (BigInt(this.buf.buf[2] as number) << 40n) +
      (BigInt(this.buf.buf[3] as number) << 32n) +
      (BigInt(this.buf.buf[4] as number) << 24n) +
      (BigInt(this.buf.buf[5] as number) << 16n) +
      (BigInt(this.buf.buf[6] as number) << 8n) +
      BigInt(this.buf.buf[7]);
  }

  add(other: U64): U64 {
    return U64.fromBn(this.toBn() + other.toBn());
  }

  sub(other: U64): U64 {
    return U64.fromBn(this.toBn() - other.toBn());
  }

  mul(other: U64): U64 {
    return U64.fromBn(this.toBn() * other.toBn());
  }

  div(other: U64): U64 {
    return U64.fromBn(this.toBn() / other.toBn());
  }

  toBEBuf(): FixedBuf<8> {
    return this.buf.clone();
  }

  toLEBuf(): FixedBuf<8> {
    return FixedBuf.fromBuf(8, WebBuf.fromArray([
      this.buf.buf[7],
      this.buf.buf[6],
      this.buf.buf[5],
      this.buf.buf[4],
      this.buf.buf[3],
      this.buf.buf[2],
      this.buf.buf[1],
      this.buf.buf[0],
    ]));
  }

  toHex(): string {
    return this.buf.toHex();
  }

  static fromBEBuf(buf: FixedBuf<8>): U64 {
    return new U64(buf);
  }

  static fromLEBuf(buf: FixedBuf<8>): U64 {
    return new U64(FixedBuf.fromBuf(8, WebBuf.fromArray([
      buf.buf[7],
      buf.buf[6],
      buf.buf[5],
      buf.buf[4],
      buf.buf[3],
      buf.buf[2],
      buf.buf[1],
      buf.buf[0],
    ])));
  }

  static fromHex(hex: string): U64 {
    return new U64(FixedBuf.fromHex(8, hex));
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class U128 extends FixedNum<16> {
  static fromBn(bn: bigint): U128 {
    if (bn < 0 || bn > 0xffffffffffffffffffffffffffffffffn) {
      throw new Error("Invalid number");
    }
    return new U128(
      FixedBuf.fromBuf(16, WebBuf.fromArray([
        Number(bn >> 120n),
        Number(bn >> 112n),
        Number(bn >> 104n),
        Number(bn >> 96n),
        Number(bn >> 88n),
        Number(bn >> 80n),
        Number(bn >> 72n),
        Number(bn >> 64n),
        Number(bn >> 56n),
        Number(bn >> 48n),
        Number(bn >> 40n),
        Number(bn >> 32n),
        Number(bn >> 24n),
        Number(bn >> 16n),
        Number(bn >> 8n),
        Number(bn),
      ])),
    );
  }

  toBn(): bigint {
    return (BigInt(this.buf.buf[0] as number) << 120n) +
      (BigInt(this.buf.buf[1] as number) << 112n) +
      (BigInt(this.buf.buf[2] as number) << 104n) +
      (BigInt(this.buf.buf[3] as number) << 96n) +
      (BigInt(this.buf.buf[4] as number) << 88n) +
      (BigInt(this.buf.buf[5] as number) << 80n) +
      (BigInt(this.buf.buf[6] as number) << 72n) +
      (BigInt(this.buf.buf[7] as number) << 64n) +
      (BigInt(this.buf.buf[8] as number) << 56n) +
      (BigInt(this.buf.buf[9] as number) << 48n) +
      (BigInt(this.buf.buf[10] as number) << 40n) +
      (BigInt(this.buf.buf[11] as number) << 32n) +
      (BigInt(this.buf.buf[12] as number) << 24n) +
      (BigInt(this.buf.buf[13] as number) << 16n) +
      (BigInt(this.buf.buf[14] as number) << 8n) +
      BigInt(this.buf.buf[15]);
  }

  add(other: U128): U128 {
    return U128.fromBn(this.toBn() + other.toBn());
  }

  sub(other: U128): U128 {
    return U128.fromBn(this.toBn() - other.toBn());
  }

  mul(other: U128): U128 {
    return U128.fromBn(this.toBn() * other.toBn());
  }

  div(other: U128): U128 {
    return U128.fromBn(this.toBn() / other.toBn());
  }

  toBEBuf(): FixedBuf<16> {
    return this.buf.clone();
  }

  toLEBuf(): FixedBuf<16> {
    return FixedBuf.fromBuf(16, WebBuf.fromArray([
      this.buf.buf[15],
      this.buf.buf[14],
      this.buf.buf[13],
      this.buf.buf[12],
      this.buf.buf[11],
      this.buf.buf[10],
      this.buf.buf[9],
      this.buf.buf[8],
      this.buf.buf[7],
      this.buf.buf[6],
      this.buf.buf[5],
      this.buf.buf[4],
      this.buf.buf[3],
      this.buf.buf[2],
      this.buf.buf[1],
      this.buf.buf[0],
    ]));
  }

  toHex(): string {
    return this.buf.toHex();
  }

  static fromBEBuf(buf: FixedBuf<16>): U128 {
    return new U128(buf);
  }

  static fromLEBuf(buf: FixedBuf<16>): U128 {
    return new U128(FixedBuf.fromBuf(16, WebBuf.fromArray([
      buf.buf[15],
      buf.buf[14],
      buf.buf[13],
      buf.buf[12],
      buf.buf[11],
      buf.buf[10],
      buf.buf[9],
      buf.buf[8],
      buf.buf[7],
      buf.buf[6],
      buf.buf[5],
      buf.buf[4],
      buf.buf[3],
      buf.buf[2],
      buf.buf[1],
      buf.buf[0],
    ])));
  }

  static fromHex(hex: string): U128 {
    return new U128(FixedBuf.fromHex(16, hex));
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class U256 extends FixedNum<32> {
  static fromBn(bn: bigint): U256 {
    if (bn < 0 || bn > 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn) {
      throw new Error("Invalid number");
    }
    return new U256(
      FixedBuf.fromBuf(32, WebBuf.fromArray([
        Number(bn >> 248n),
        Number(bn >> 240n),
        Number(bn >> 232n),
        Number(bn >> 224n),
        Number(bn >> 216n),
        Number(bn >> 208n),
        Number(bn >> 200n),
        Number(bn >> 192n),
        Number(bn >> 184n),
        Number(bn >> 176n),
        Number(bn >> 168n),
        Number(bn >> 160n),
        Number(bn >> 152n),
        Number(bn >> 144n),
        Number(bn >> 136n),
        Number(bn >> 128n),
        Number(bn >> 120n),
        Number(bn >> 112n),
        Number(bn >> 104n),
        Number(bn >> 96n),
        Number(bn >> 88n),
        Number(bn >> 80n),
        Number(bn >> 72n),
        Number(bn >> 64n),
        Number(bn >> 56n),
        Number(bn >> 48n),
        Number(bn >> 40n),
        Number(bn >> 32n),
        Number(bn >> 24n),
        Number(bn >> 16n),
        Number(bn >> 8n),
        Number(bn),
      ])),
    );
  }

  toBn(): bigint {
    return (BigInt(this.buf.buf[0] as number) << 248n) +
      (BigInt(this.buf.buf[1] as number) << 240n) +
      (BigInt(this.buf.buf[2] as number) << 232n) +
      (BigInt(this.buf.buf[3] as number) << 224n) +
      (BigInt(this.buf.buf[4] as number) << 216n) +
      (BigInt(this.buf.buf[5] as number) << 208n) +
      (BigInt(this.buf.buf[6] as number) << 200n) +
      (BigInt(this.buf.buf[7] as number) << 192n) +
      (BigInt(this.buf.buf[8] as number) << 184n) +
      (BigInt(this.buf.buf[9] as number) << 176n) +
      (BigInt(this.buf.buf[10] as number) << 168n) +
      (BigInt(this.buf.buf[11] as number) << 160n) +
      (BigInt(this.buf.buf[12] as number) << 152n) +
      (BigInt(this.buf.buf[13] as number) << 144n) +
      (BigInt(this.buf.buf[14] as number) << 136n) +
      (BigInt(this.buf.buf[15] as number) << 128n) +
      (BigInt(this.buf.buf[16] as number) << 120n) +
      (BigInt(this.buf.buf[17] as number) << 112n) +
      (BigInt(this.buf.buf[18] as number) << 104n) +
      (BigInt(this.buf.buf[19] as number) << 96n) +
      (BigInt(this.buf.buf[20] as number) << 88n) +
      (BigInt(this.buf.buf[21] as number) << 80n) +
      (BigInt(this.buf.buf[22] as number) << 72n) +
      (BigInt(this.buf.buf[23] as number) << 64n) +
      (BigInt(this.buf.buf[24] as number) << 56n) +
      (BigInt(this.buf.buf[25] as number) << 48n) +
      (BigInt(this.buf.buf[26] as number) << 40n) +
      (BigInt(this.buf.buf[27] as number) << 32n) +
      (BigInt(this.buf.buf[28] as number) << 24n) +
      (BigInt(this.buf.buf[29] as number) << 16n) +
      (BigInt(this.buf.buf[30] as number) << 8n) +
      BigInt(this.buf.buf[31]);
  }

  add(other: U256): U256 {
    return U256.fromBn(this.toBn() + other.toBn());
  }

  sub(other: U256): U256 {
    return U256.fromBn(this.toBn() - other.toBn());
  }

  mul(other: U256): U256 {
    return U256.fromBn(this.toBn() * other.toBn());
  }

  div(other: U256): U256 {
    return U256.fromBn(this.toBn() / other.toBn());
  }

  toBEBuf(): FixedBuf<32> {
    return this.buf.clone();
  }

  toLEBuf(): FixedBuf<32> {
    return FixedBuf.fromBuf(32, WebBuf.fromArray([
      this.buf.buf[31],
      this.buf.buf[30],
      this.buf.buf[29],
      this.buf.buf[28],
      this.buf.buf[27],
      this.buf.buf[26],
      this.buf.buf[25],
      this.buf.buf[24],
      this.buf.buf[23],
      this.buf.buf[22],
      this.buf.buf[21],
      this.buf.buf[20],
      this.buf.buf[19],
      this.buf.buf[18],
      this.buf.buf[17],
      this.buf.buf[16],
      this.buf.buf[15],
      this.buf.buf[14],
      this.buf.buf[13],
      this.buf.buf[12],
      this.buf.buf[11],
      this.buf.buf[10],
      this.buf.buf[9],
      this.buf.buf[8],
      this.buf.buf[7],
      this.buf.buf[6],
      this.buf.buf[5],
      this.buf.buf[4],
      this.buf.buf[3],
      this.buf.buf[2],
      this.buf.buf[1],
      this.buf.buf[0],
    ]));
  }

  toHex(): string {
    return this.buf.toHex();
  }

  static fromBEBuf(buf: FixedBuf<32>): U256 {
    return new U256(buf);
  }

  static fromLEBuf(buf: FixedBuf<32>): U256 {
    return new U256(FixedBuf.fromBuf(32, WebBuf.fromArray([
      buf.buf[31],
      buf.buf[30],
      buf.buf[29],
      buf.buf[28],
      buf.buf[27],
      buf.buf[26],
      buf.buf[25],
      buf.buf[24],
      buf.buf[23],
      buf.buf[22],
      buf.buf[21],
      buf.buf[20],
      buf.buf[19],
      buf.buf[18],
      buf.buf[17],
      buf.buf[16],
      buf.buf[15],
      buf.buf[14],
      buf.buf[13],
      buf.buf[12],
      buf.buf[11],
      buf.buf[10],
      buf.buf[9],
      buf.buf[8],
      buf.buf[7],
      buf.buf[6],
      buf.buf[5],
      buf.buf[4],
      buf.buf[3],
      buf.buf[2],
      buf.buf[1],
      buf.buf[0],
    ])));
  }

  static fromHex(hex: string): U256 {
    return new U256(FixedBuf.fromHex(32, hex));
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}
