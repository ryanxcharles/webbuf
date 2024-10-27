import { WebBuf } from "@webbuf/webbuf";
import { FixedBuf } from "@webbuf/fixedbuf";

export abstract class FixedNum<N extends number> {
  protected buf: FixedBuf<N>;

  constructor(buf: FixedBuf<N>) {
    this.buf = buf;
  }

  // abstract static fromBn(bn: bigint): FixedU<N>;
  abstract toBn(): bigint;
  abstract add(other: FixedNum<N>): FixedNum<N>;
  abstract sub(other: FixedNum<N>): FixedNum<N>;
  abstract mul(other: FixedNum<N>): FixedNum<N>;
  abstract div(other: FixedNum<N>): FixedNum<N>;
  abstract get n(): number;
  abstract get bn(): bigint;
}

export class FixedU8 extends FixedNum<1> {
  static fromBn(bn: bigint): FixedU8 {
    if (bn < 0 || bn > 0xffn) {
      throw new Error("Invalid number");
    }
    return new FixedU8(FixedBuf.fromBuf(1, WebBuf.fromArray([Number(bn)])));
  }

  toBn(): bigint {
    return BigInt(this.buf.buf[0] as number);
  }

  add(other: FixedU8): FixedU8 {
    return FixedU8.fromBn(this.toBn() + other.toBn());
  }

  sub(other: FixedU8): FixedU8 {
    return FixedU8.fromBn(this.toBn() - other.toBn());
  }

  mul(other: FixedU8): FixedU8 {
    return FixedU8.fromBn(this.toBn() * other.toBn());
  }

  div(other: FixedU8): FixedU8 {
    return FixedU8.fromBn(this.toBn() / other.toBn());
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class FixedU16 extends FixedNum<2> {
  static fromBn(bn: bigint): FixedU16 {
    if (bn < 0 || bn > 0xffffn) {
      throw new Error("Invalid number");
    }
    return new FixedU16(
      FixedBuf.fromBuf(2, WebBuf.fromArray([Number(bn >> 8n), Number(bn)])),
    );
  }

  toBn(): bigint {
    return (BigInt(this.buf.buf[0] as number) << 8n) + BigInt(this.buf.buf[1]);
  }

  add(other: FixedU16): FixedU16 {
    return FixedU16.fromBn(this.toBn() + other.toBn());
  }

  sub(other: FixedU16): FixedU16 {
    return FixedU16.fromBn(this.toBn() - other.toBn());
  }

  mul(other: FixedU16): FixedU16 {
    return FixedU16.fromBn(this.toBn() * other.toBn());
  }

  div(other: FixedU16): FixedU16 {
    return FixedU16.fromBn(this.toBn() / other.toBn());
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class FixedU32 extends FixedNum<4> {
  static fromBn(bn: bigint): FixedU32 {
    if (bn < 0 || bn > 0xffffffffn) {
      throw new Error("Invalid number");
    }
    return new FixedU32(
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

  add(other: FixedU32): FixedU32 {
    return FixedU32.fromBn(this.toBn() + other.toBn());
  }

  sub(other: FixedU32): FixedU32 {
    return FixedU32.fromBn(this.toBn() - other.toBn());
  }

  mul(other: FixedU32): FixedU32 {
    return FixedU32.fromBn(this.toBn() * other.toBn());
  }

  div(other: FixedU32): FixedU32 {
    return FixedU32.fromBn(this.toBn() / other.toBn());
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class FixedU64 extends FixedNum<8> {
  static fromBn(bn: bigint): FixedU64 {
    if (bn < 0 || bn > 0xffffffffffffffffn) {
      throw new Error("Invalid number");
    }
    return new FixedU64(
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

  add(other: FixedU64): FixedU64 {
    return FixedU64.fromBn(this.toBn() + other.toBn());
  }

  sub(other: FixedU64): FixedU64 {
    return FixedU64.fromBn(this.toBn() - other.toBn());
  }

  mul(other: FixedU64): FixedU64 {
    return FixedU64.fromBn(this.toBn() * other.toBn());
  }

  div(other: FixedU64): FixedU64 {
    return FixedU64.fromBn(this.toBn() / other.toBn());
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class FixedU128 extends FixedNum<16> {
  static fromBn(bn: bigint): FixedU128 {
    if (bn < 0 || bn > 0xffffffffffffffffffffffffffffffffn) {
      throw new Error("Invalid number");
    }
    return new FixedU128(
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

  add(other: FixedU128): FixedU128 {
    return FixedU128.fromBn(this.toBn() + other.toBn());
  }

  sub(other: FixedU128): FixedU128 {
    return FixedU128.fromBn(this.toBn() - other.toBn());
  }

  mul(other: FixedU128): FixedU128 {
    return FixedU128.fromBn(this.toBn() * other.toBn());
  }

  div(other: FixedU128): FixedU128 {
    return FixedU128.fromBn(this.toBn() / other.toBn());
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export class FixedU256 extends FixedNum<32> {
  static fromBn(bn: bigint): FixedU256 {
    if (bn < 0 || bn > 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn) {
      throw new Error("Invalid number");
    }
    return new FixedU256(
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

  add(other: FixedU256): FixedU256 {
    return FixedU256.fromBn(this.toBn() + other.toBn());
  }

  sub(other: FixedU256): FixedU256 {
    return FixedU256.fromBn(this.toBn() - other.toBn());
  }

  mul(other: FixedU256): FixedU256 {
    return FixedU256.fromBn(this.toBn() * other.toBn());
  }

  div(other: FixedU256): FixedU256 {
    return FixedU256.fromBn(this.toBn() / other.toBn());
  }

  get n(): number {
    return Number(this.toBn());
  }

  get bn(): bigint {
    return this.toBn();
  }
}

export abstract class BasicNumber<U extends BasicNumber<U>> {
  protected value: bigint;
  protected min: bigint;
  protected max: bigint;

  constructor(value: bigint | number, min: bigint, max: bigint) {
    const valueBn = BigInt(value);
    if (valueBn < min || valueBn > max) {
      throw new Error(`Value ${value} is not a valid number`);
    }
    this.value = valueBn;
    this.min = min;
    this.max = max;
  }

  abstract add(other: U): U;
  abstract sub(other: U): U;
  abstract mul(other: U): U;
  abstract div(other: U): U;
  abstract get bn(): bigint;
  abstract get n(): number;
  abstract toBEBuf(): WebBuf;
  abstract toHex(): string;
}

export class U8 extends BasicNumber<U8> {
  readonly _U8: undefined;

  constructor(value: bigint | number) {
    super(value, 0x00n, 0xffn);
  }

  add(other: U8): U8 {
    const result = this.value + other.value;
    return new U8(result);
  }

  sub(other: U8): U8 {
    const result = this.value - other.value;
    return new U8(result);
  }

  mul(other: U8): U8 {
    const result = this.value * other.value;
    return new U8(result);
  }

  div(other: U8): U8 {
    const result = this.value / other.value;
    return new U8(result);
  }

  get bn(): bigint {
    return this.value;
  }

  get n(): number {
    return Number(this.value);
  }

  toBEBuf(): WebBuf {
    return WebBuf.fromArray([this.n]);
  }

  toHex(): string {
    return this.toBEBuf().toString("hex");
  }

  static fromBEBuf(buf: WebBuf): U8 {
    if (buf.length !== 1) {
      throw new Error("Invalid buffer length");
    }
    return new U8(buf[0] as number);
  }

  static fromHex(hex: string): U8 {
    return U8.fromBEBuf(FixedBuf.fromHex(1, hex).buf);
  }
}

export class U16 extends BasicNumber<U16> {
  readonly _U16: undefined;

  constructor(value: bigint | number) {
    super(value, 0x0000n, 0xffffn);
  }

  add(other: U16): U16 {
    const result = this.value + other.value;
    return new U16(result);
  }

  sub(other: U16): U16 {
    const result = this.value - other.value;
    return new U16(result);
  }

  mul(other: U16): U16 {
    const result = this.value * other.value;
    return new U16(result);
  }

  div(other: U16): U16 {
    const result = this.value / other.value;
    return new U16(result);
  }

  get bn(): bigint {
    return this.value;
  }

  get n(): number {
    return Number(this.value);
  }

  toBEBuf(): WebBuf {
    return WebBuf.fromArray([this.n >> 8, this.n & 0xff]);
  }

  toHex(): string {
    return this.toBEBuf().toString("hex");
  }

  static fromBEBuf(buf: WebBuf): U16 {
    if (buf.length !== 2) {
      throw new Error("Invalid buffer length");
    }
    return new U16(((buf[0] as number) << 8) + (buf[1] as number));
  }

  static fromHex(hex: string): U16 {
    return U16.fromBEBuf(FixedBuf.fromHex(2, hex).buf);
  }
}

export class U32 extends BasicNumber<U32> {
  readonly _U32: undefined;

  constructor(value: bigint | number) {
    super(value, 0x00000000n, 0xffffffffn);
  }

  add(other: U32): U32 {
    const result = this.value + other.value;
    return new U32(result);
  }

  sub(other: U32): U32 {
    const result = this.value - other.value;
    return new U32(result);
  }

  mul(other: U32): U32 {
    const result = this.value * other.value;
    return new U32(result);
  }

  div(other: U32): U32 {
    const result = this.value / other.value;
    return new U32(result);
  }

  get bn(): bigint {
    return this.value;
  }

  get n(): number {
    return Number(this.value);
  }

  toBEBuf(): WebBuf {
    return WebBuf.fromArray([
      Number((this.bn >> 24n) & 0xffn),
      Number((this.bn >> 16n) & 0xffn),
      Number((this.bn >> 8n) & 0xffn),
      Number(this.bn & 0xffn),
    ]);
  }

  toHex(): string {
    return this.toBEBuf().toString("hex");
  }

  static fromBEBuf(buf: WebBuf): U32 {
    if (buf.length !== 4) {
      throw new Error("Invalid buffer length");
    }
    return new U32(
      (BigInt(buf[0] as number) << 24n) +
        (BigInt(buf[1] as number) << 16n) +
        (BigInt(buf[2] as number) << 8n) +
        BigInt(buf[3] as number),
    );
  }

  static fromHex(hex: string): U32 {
    return U32.fromBEBuf(FixedBuf.fromHex(4, hex).buf);
  }
}

export class U64 extends BasicNumber<U64> {
  readonly _U64: undefined;

  constructor(value: bigint | number) {
    super(value, 0x0000000000000000n, 0xffffffffffffffffn);
  }

  add(other: U64): U64 {
    const result = this.value + other.value;
    return new U64(result);
  }

  sub(other: U64): U64 {
    const result = this.value - other.value;
    return new U64(result);
  }

  mul(other: U64): U64 {
    const result = this.value * other.value;
    return new U64(result);
  }

  div(other: U64): U64 {
    const result = this.value / other.value;
    return new U64(result);
  }

  get bn(): bigint {
    return this.value;
  }

  get n(): number {
    return Number(this.value);
  }

  toBEBuf(): WebBuf {
    return WebBuf.fromArray([
      Number((this.bn >> 56n) & 0xffn),
      Number((this.bn >> 48n) & 0xffn),
      Number((this.bn >> 40n) & 0xffn),
      Number((this.bn >> 32n) & 0xffn),
      Number((this.bn >> 24n) & 0xffn),
      Number((this.bn >> 16n) & 0xffn),
      Number((this.bn >> 8n) & 0xffn),
      Number(this.bn & 0xffn),
    ]);
  }

  toHex(): string {
    return this.toBEBuf().toString("hex");
  }

  static fromBEBuf(buf: WebBuf): U64 {
    if (buf.length !== 8) {
      throw new Error("Invalid buffer length");
    }
    return new U64(
      (BigInt(buf[0] as number) << 56n) +
        (BigInt(buf[1] as number) << 48n) +
        (BigInt(buf[2] as number) << 40n) +
        (BigInt(buf[3] as number) << 32n) +
        (BigInt(buf[4] as number) << 24n) +
        (BigInt(buf[5] as number) << 16n) +
        (BigInt(buf[6] as number) << 8n) +
        BigInt(buf[7] as number),
    );
  }

  static fromHex(hex: string): U64 {
    return U64.fromBEBuf(FixedBuf.fromHex(8, hex).buf);
  }
}

export class U128 extends BasicNumber<U128> {
  readonly _U128: undefined;

  constructor(value: bigint | number) {
    super(
      value,
      0x00000000000000000000000000000000n,
      0xffffffffffffffffffffffffffffffffn,
    );
  }

  add(other: U128): U128 {
    const result = this.value + other.value;
    return new U128(result);
  }

  sub(other: U128): U128 {
    const result = this.value - other.value;
    return new U128(result);
  }

  mul(other: U128): U128 {
    const result = this.value * other.value;
    return new U128(result);
  }

  div(other: U128): U128 {
    const result = this.value / other.value;
    return new U128(result);
  }

  get bn(): bigint {
    return this.value;
  }

  get n(): number {
    return Number(this.value);
  }

  toBEBuf(): WebBuf {
    return WebBuf.fromArray([
      Number((this.bn >> 120n) & 0xffn),
      Number((this.bn >> 112n) & 0xffn),
      Number((this.bn >> 104n) & 0xffn),
      Number((this.bn >> 96n) & 0xffn),
      Number((this.bn >> 88n) & 0xffn),
      Number((this.bn >> 80n) & 0xffn),
      Number((this.bn >> 72n) & 0xffn),
      Number((this.bn >> 64n) & 0xffn),
      Number((this.bn >> 56n) & 0xffn),
      Number((this.bn >> 48n) & 0xffn),
      Number((this.bn >> 40n) & 0xffn),
      Number((this.bn >> 32n) & 0xffn),
      Number((this.bn >> 24n) & 0xffn),
      Number((this.bn >> 16n) & 0xffn),
      Number((this.bn >> 8n) & 0xffn),
      Number(this.bn & 0xffn),
    ]);
  }

  toHex(): string {
    return this.toBEBuf().toString("hex");
  }

  static fromBEBuf(buf: WebBuf): U128 {
    if (buf.length !== 16) {
      throw new Error("Invalid buffer length");
    }
    return new U128(
      (BigInt(buf[0] as number) << 120n) +
        (BigInt(buf[1] as number) << 112n) +
        (BigInt(buf[2] as number) << 104n) +
        (BigInt(buf[3] as number) << 96n) +
        (BigInt(buf[4] as number) << 88n) +
        (BigInt(buf[5] as number) << 80n) +
        (BigInt(buf[6] as number) << 72n) +
        (BigInt(buf[7] as number) << 64n) +
        (BigInt(buf[8] as number) << 56n) +
        (BigInt(buf[9] as number) << 48n) +
        (BigInt(buf[10] as number) << 40n) +
        (BigInt(buf[11] as number) << 32n) +
        (BigInt(buf[12] as number) << 24n) +
        (BigInt(buf[13] as number) << 16n) +
        (BigInt(buf[14] as number) << 8n) +
        BigInt(buf[15] as number),
    );
  }

  static fromHex(hex: string): U128 {
    const buf = FixedBuf.fromHex(16, hex).buf;
    return U128.fromBEBuf(buf);
  }
}

export class U256 extends BasicNumber<U256> {
  readonly _U256: undefined;

  constructor(value: bigint | number) {
    super(
      value,
      0x0000000000000000000000000000000000000000000000000000000000000000n,
      0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
    );
  }

  add(other: U256): U256 {
    const result = this.value + other.value;
    return new U256(result);
  }

  sub(other: U256): U256 {
    const result = this.value - other.value;
    return new U256(result);
  }

  mul(other: U256): U256 {
    const result = this.value * other.value;
    return new U256(result);
  }

  div(other: U256): U256 {
    const result = this.value / other.value;
    return new U256(result);
  }

  get bn(): bigint {
    return this.value;
  }

  get n(): number {
    return Number(this.value);
  }

  toBEBuf(): WebBuf {
    return WebBuf.fromArray([
      Number((this.bn >> 248n) & 0xffn),
      Number((this.bn >> 240n) & 0xffn),
      Number((this.bn >> 232n) & 0xffn),
      Number((this.bn >> 224n) & 0xffn),
      Number((this.bn >> 216n) & 0xffn),
      Number((this.bn >> 208n) & 0xffn),
      Number((this.bn >> 200n) & 0xffn),
      Number((this.bn >> 192n) & 0xffn),
      Number((this.bn >> 184n) & 0xffn),
      Number((this.bn >> 176n) & 0xffn),
      Number((this.bn >> 168n) & 0xffn),
      Number((this.bn >> 160n) & 0xffn),
      Number((this.bn >> 152n) & 0xffn),
      Number((this.bn >> 144n) & 0xffn),
      Number((this.bn >> 136n) & 0xffn),
      Number((this.bn >> 128n) & 0xffn),
      Number((this.bn >> 120n) & 0xffn),
      Number((this.bn >> 112n) & 0xffn),
      Number((this.bn >> 104n) & 0xffn),
      Number((this.bn >> 96n) & 0xffn),
      Number((this.bn >> 88n) & 0xffn),
      Number((this.bn >> 80n) & 0xffn),
      Number((this.bn >> 72n) & 0xffn),
      Number((this.bn >> 64n) & 0xffn),
      Number((this.bn >> 56n) & 0xffn),
      Number((this.bn >> 48n) & 0xffn),
      Number((this.bn >> 40n) & 0xffn),
      Number((this.bn >> 32n) & 0xffn),
      Number((this.bn >> 24n) & 0xffn),
      Number((this.bn >> 16n) & 0xffn),
      Number((this.bn >> 8n) & 0xffn),
      Number(this.bn & 0xffn),
    ]);
  }

  toHex(): string {
    return this.toBEBuf().toString("hex");
  }

  static fromBEBuf(buf: WebBuf): U256 {
    if (buf.length !== 32) {
      throw new Error("Invalid buffer length");
    }
    return new U256(
      (BigInt(buf[0] as number) << 248n) +
        (BigInt(buf[1] as number) << 240n) +
        (BigInt(buf[2] as number) << 232n) +
        (BigInt(buf[3] as number) << 224n) +
        (BigInt(buf[4] as number) << 216n) +
        (BigInt(buf[5] as number) << 208n) +
        (BigInt(buf[6] as number) << 200n) +
        (BigInt(buf[7] as number) << 192n) +
        (BigInt(buf[8] as number) << 184n) +
        (BigInt(buf[9] as number) << 176n) +
        (BigInt(buf[10] as number) << 168n) +
        (BigInt(buf[11] as number) << 160n) +
        (BigInt(buf[12] as number) << 152n) +
        (BigInt(buf[13] as number) << 144n) +
        (BigInt(buf[14] as number) << 136n) +
        (BigInt(buf[15] as number) << 128n) +
        (BigInt(buf[16] as number) << 120n) +
        (BigInt(buf[17] as number) << 112n) +
        (BigInt(buf[18] as number) << 104n) +
        (BigInt(buf[19] as number) << 96n) +
        (BigInt(buf[20] as number) << 88n) +
        (BigInt(buf[21] as number) << 80n) +
        (BigInt(buf[22] as number) << 72n) +
        (BigInt(buf[23] as number) << 64n) +
        (BigInt(buf[24] as number) << 56n) +
        (BigInt(buf[25] as number) << 48n) +
        (BigInt(buf[26] as number) << 40n) +
        (BigInt(buf[27] as number) << 32n) +
        (BigInt(buf[28] as number) << 24n) +
        (BigInt(buf[29] as number) << 16n) +
        (BigInt(buf[30] as number) << 8n) +
        BigInt(buf[31] as number),
    );
  }

  static fromHex(hex: string): U256 {
    const buf = FixedBuf.fromHex(32, hex).buf;
    return U256.fromBEBuf(buf);
  }
}
