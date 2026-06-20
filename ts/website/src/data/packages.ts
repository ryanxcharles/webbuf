export type Category =
  | "Core buffers"
  | "Hashing"
  | "Elliptic curve"
  | "Encryption"
  | "Post-quantum";

export interface Package {
  /** URL slug under /docs/. */
  slug: string;
  /** Published npm package name. */
  npm: string;
  category: Category;
  /** One-line summary. */
  summary: string;
  /** Longer description shown on the package page. */
  description: string;
  /** Install command. */
  install: string;
  /** Optional usage snippet (TypeScript), only where the API is documented. */
  usage?: string;
}

export const CATEGORIES: readonly Category[] = [
  "Core buffers",
  "Hashing",
  "Elliptic curve",
  "Encryption",
  "Post-quantum",
];

export const PACKAGES: readonly Package[] = [
  {
    slug: "webbuf",
    npm: "@webbuf/webbuf",
    category: "Core buffers",
    summary: "The core WebBuf buffer class.",
    description:
      "WebBuf extends Uint8Array with hex/base64 encoding, concatenation, comparison, and cloning. It is the common buffer format every other package speaks.",
    install: "npm install @webbuf/webbuf",
    usage: `import { WebBuf } from "@webbuf/webbuf";

const buf = WebBuf.fromHex("deadbeef");
console.log(buf.toBase64());

const joined = WebBuf.concat([buf, WebBuf.fromHex("00ff")]);
console.log(joined.toHex());`,
  },
  {
    slug: "fixedbuf",
    npm: "@webbuf/fixedbuf",
    category: "Core buffers",
    summary: "Type-safe fixed-size buffers (FixedBuf<N>).",
    description:
      "FixedBuf<N> wraps a WebBuf whose length is encoded in the type, so 32-byte hashes and keys cannot be mixed up with arbitrary-length buffers at compile time.",
    install: "npm install @webbuf/fixedbuf",
    usage: `import { FixedBuf } from "@webbuf/fixedbuf";

const key = FixedBuf.fromRandom(32);
console.log(key.toHex());`,
  },
  {
    slug: "numbers",
    npm: "@webbuf/numbers",
    category: "Core buffers",
    summary: "Fixed-width numeric types: U8, U16BE, U32BE, U64BE.",
    description:
      "Wrapper types for fixed-width, big-endian integers used throughout the reader/writer and serialization code.",
    install: "npm install @webbuf/numbers",
  },
  {
    slug: "rw",
    npm: "@webbuf/rw",
    category: "Core buffers",
    summary: "Sequential buffer I/O: BufReader and BufWriter.",
    description:
      "BufReader and BufWriter provide position-tracking sequential reads and writes of fixed-width numbers, fixed buffers, and varints.",
    install: "npm install @webbuf/rw",
  },
  {
    slug: "blake3",
    npm: "@webbuf/blake3",
    category: "Hashing",
    summary: "BLAKE3 hashing and keyed MAC.",
    description:
      "BLAKE3 cryptographic hash and message authentication code, compiled from the Rust blake3 crate to WebAssembly.",
    install: "npm install @webbuf/blake3",
    usage: `import { blake3Hash } from "@webbuf/blake3";
import { WebBuf } from "@webbuf/webbuf";

const data = WebBuf.fromHex("00010203");
const hash = blake3Hash(data); // FixedBuf<32>
console.log(hash.toHex());`,
  },
  {
    slug: "sha256",
    npm: "@webbuf/sha256",
    category: "Hashing",
    summary: "SHA-256 hashing and HMAC-SHA256.",
    description:
      "SHA-256 cryptographic hash and HMAC-SHA256, from the RustCrypto sha2 and hmac crates.",
    install: "npm install @webbuf/sha256",
  },
  {
    slug: "ripemd160",
    npm: "@webbuf/ripemd160",
    category: "Hashing",
    summary: "RIPEMD160 hashing.",
    description:
      "RIPEMD160 cryptographic hash, commonly paired with SHA-256 for address derivation.",
    install: "npm install @webbuf/ripemd160",
  },
  {
    slug: "secp256k1",
    npm: "@webbuf/secp256k1",
    category: "Elliptic curve",
    summary: "secp256k1 ECDSA and ECDH.",
    description:
      "Elliptic-curve cryptography over secp256k1: ECDSA signatures and ECDH key agreement, from the RustCrypto k256 crate.",
    install: "npm install @webbuf/secp256k1",
  },
  {
    slug: "aescbc",
    npm: "@webbuf/aescbc",
    category: "Encryption",
    summary: "AES-CBC encryption.",
    description:
      "AES in CBC mode. Typically combined with a MAC (see @webbuf/acb3) rather than used on its own.",
    install: "npm install @webbuf/aescbc",
  },
  {
    slug: "acb3",
    npm: "@webbuf/acb3",
    category: "Encryption",
    summary: "AES-CBC encryption with a BLAKE3 MAC.",
    description:
      "Authenticated encryption combining AES-CBC with a BLAKE3 message authentication code (encrypt-then-MAC).",
    install: "npm install @webbuf/acb3",
  },
  {
    slug: "acb3dh",
    npm: "@webbuf/acb3dh",
    category: "Encryption",
    summary: "AES-CBC + BLAKE3 + secp256k1 Diffie-Hellman.",
    description:
      "End-to-end encryption: secp256k1 ECDH establishes a shared secret, which keys AES-CBC encryption authenticated with a BLAKE3 MAC.",
    install: "npm install @webbuf/acb3dh",
  },
  {
    slug: "mlkem",
    npm: "@webbuf/mlkem",
    category: "Post-quantum",
    summary: "ML-KEM (FIPS 203) post-quantum key encapsulation.",
    description:
      "ML-KEM key encapsulation mechanism (FIPS 203), from the RustCrypto ml-kem crate, for post-quantum key establishment.",
    install: "npm install @webbuf/mlkem",
  },
  {
    slug: "mldsa",
    npm: "@webbuf/mldsa",
    category: "Post-quantum",
    summary: "ML-DSA (FIPS 204) post-quantum signatures.",
    description:
      "ML-DSA digital signature algorithm (FIPS 204), from the RustCrypto ml-dsa crate, for post-quantum signatures.",
    install: "npm install @webbuf/mldsa",
  },
  {
    slug: "slhdsa",
    npm: "@webbuf/slhdsa",
    category: "Post-quantum",
    summary: "SLH-DSA (FIPS 205) hash-based post-quantum signatures.",
    description:
      "SLH-DSA stateless hash-based digital signatures (FIPS 205), from the RustCrypto slh-dsa crate, for conservative post-quantum signatures.",
    install: "npm install @webbuf/slhdsa",
  },
  {
    slug: "main",
    npm: "webbuf",
    category: "Core buffers",
    summary: "The umbrella package re-exporting the core utilities.",
    description:
      "The main webbuf package re-exports the core buffer utilities so you can install a single dependency to get started.",
    install: "npm install webbuf",
  },
];

export const packagesByCategory = (category: Category): Package[] =>
  PACKAGES.filter((pkg) => pkg.category === category);
