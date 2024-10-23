# WebBuf

`WebBuf` is a powerful, flexible class that extends JavaScript's `Uint8Array` to provide additional functionality for handling binary data. It includes methods for manipulating binary data, converting to and from different formats (e.g., base64, hex, strings), and reading/writing values in both little-endian and big-endian formats. This library is ideal for applications that need efficient and low-level control over binary data, like encoding/decoding or working with protocols.

## Features

- Extended `Uint8Array` with extra methods for binary manipulation.
- Conversion methods: supports Base64, Hex, Strings, and arrays.
- Efficient concatenation and allocation methods.
- Clone and copy functionality for working with buffers.
- Support for reading and writing unsigned and signed integers in both Little Endian (LE) and Big Endian (BE) formats, including 8-bit, 16-bit, 32-bit, 64-bit, 128-bit, and 256-bit integers.
- Utility methods like `compare`, `equals`, `fill`, and more.

## Installation

Install via npm:

```bash
npm install webbuf
```

Or include it in your project using a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/webbuf"></script>
```

## Usage

### Basic Usage

```typescript
import { WebBuf } from 'webbuf';

// Allocating a buffer
const buf = WebBuf.alloc(10);

// Filling the buffer
buf.fill(0);

// Working with base64
const base64Str = buf.toBase64();
const decodedBuf = WebBuf.fromBase64(base64Str);

// Cloning a buffer
const clonedBuf = buf.clone();

// Comparing buffers
const anotherBuf = WebBuf.alloc(10);
console.log(buf.equals(anotherBuf));  // false
```

### Conversion Examples

- **String to WebBuf**:

  ```typescript
  const buf = WebBuf.fromString('Hello, World!');
  console.log(buf.toString());  // Outputs: Hello, World!
  ```

- **Hex to WebBuf**:

  ```typescript
  const hexBuf = WebBuf.fromHex('48656c6c6f');
  console.log(hexBuf.toString());  // Outputs: Hello
  ```

- **Base64 to WebBuf**:

  ```typescript
  const base64Buf = WebBuf.fromBase64('SGVsbG8=');
  console.log(base64Buf.toString());  // Outputs: Hello
  ```

### Reading and Writing Data

- **Read/Write Integers**:

  ```typescript
  const buf = WebBuf.alloc(8);

  // Writing a 32-bit little-endian integer
  buf.writeUint32LE(123456, 0);

  // Reading the value back
  const val = buf.readUint32LE(0);
  console.log(val);  // Outputs: 123456
  ```

- **Working with BigInt**:

  ```typescript
  const buf = WebBuf.alloc(16);

  // Writing a 128-bit little-endian BigInt
  buf.writeBigUint128LE(0x1234567890abcdef1234567890abcdefn, 0);

  // Reading the value back
  const bigVal = buf.readBigUint128LE(0);
  console.log(bigVal.toString(16));  // Outputs: 1234567890abcdef1234567890abcdef
  ```

## API Reference

### Static Methods

- **`WebBuf.concat(list: Uint8Array[]): WebBuf`**  
  Concatenates a list of `Uint8Array` or `WebBuf` into a single `WebBuf`.

- **`WebBuf.alloc(size: number): WebBuf`**  
  Allocates a new `WebBuf` of the specified size.

- **`WebBuf.fromUint8Array(buffer: Uint8Array): WebBuf`**  
  Returns a `WebBuf` that is a view of the same data as the input `Uint8Array`.

- **`WebBuf.fromArray(array: number[]): WebBuf`**  
  Creates a `WebBuf` from an array of numbers.

- **`WebBuf.fromString(str: string): WebBuf`**  
  Converts a string into a `WebBuf`.

- **`WebBuf.fromHex(hex: string): WebBuf`**  
  Converts a hex string to a `WebBuf`.

- **`WebBuf.fromBase64(b64: string): WebBuf`**  
  Converts a base64 string into a `WebBuf`.

- **`WebBuf.from(source, mapFn?, thisArg?): WebBuf`**  
  Overrides the `Uint8Array.from` method to return a `WebBuf`.

### Instance Methods

- **`toBase64(): string`**  
  Converts the `WebBuf` to a base64 string.

- **`toString(): string`**  
  Converts the `WebBuf` to a UTF-8 string.

- **`toHex(): string`**  
  Converts the `WebBuf` to a hexadecimal string.

- **`toArray(): number[]`**  
  Converts the `WebBuf` to a standard array of numbers.

- **`clone(): WebBuf`**  
  Returns a copy of the `WebBuf`.

- **`compare(other: WebBuf): number`**  
  Compares two buffers lexicographically. Returns `0` if equal, `-1` if `this` is smaller, or `1` if `this` is larger.

- **`equals(other: WebBuf): boolean`**  
  Returns `true` if the contents of two buffers are identical.

- **`copy(target: WebBuf, targetStart?: number, sourceStart?: number, sourceEnd?: number): number`**  
  Copies a section of `WebBuf` data to another `WebBuf`.

### Reading/Writing Numbers

- **Read and write unsigned integers** (8-bit, 16-bit, 32-bit, 64-bit, 128-bit, 256-bit) in both Little Endian (LE) and Big Endian (BE) formats:
  - `readUintLE`, `readUintBE`
  - `readUint8`, `readUint16LE`, `readUint16BE`
  - `readUint32LE`, `readUint32BE`
  - `readBigUint64LE`, `readBigUint64BE`
  - `writeUintLE`, `writeUintBE`, `writeBigUint64LE`, `writeBigUint64BE`
  - `writeBigUint128LE`, `writeBigUint128BE`
  - `writeBigUint256LE`, `writeBigUint256BE`

- **Read and write signed integers** in both Little Endian and Big Endian formats:
  - `readIntLE`, `readIntBE`
  - `readInt8`, `readInt16LE`, `readInt16BE`
  - `readInt32LE`, `readInt32BE`
  - `readBigInt64LE`, `readBigInt64BE`
  - `readBigInt128LE`, `readBigInt128BE`
  - `readBigInt256LE`, `readBigInt256BE`

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for any improvements or bugs.

## License

This project is licensed under the MIT License.
