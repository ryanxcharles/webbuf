import { describe, it, expect } from "vitest";
import { acb3Encrypt, acb3Decrypt } from "../src/index.js";
import { WebBuf } from "@webbuf/webbuf";
import { FixedBuf } from "@webbuf/fixedbuf";
import { blake3Hash } from "@webbuf/blake3";

describe("Index", () => {
  it("should exist", () => {
    expect(acb3Encrypt).toBeDefined();
    expect(acb3Decrypt).toBeDefined();
  });
});

describe("Encryption Tests", () => {
  it("should pass sanity check", () => {
    const plaintext = WebBuf.from("hello world");
    const key = blake3Hash(WebBuf.from("123456789012345678"));
    const iv = FixedBuf.fromBuf(
      16,
      blake3Hash(WebBuf.from("1234")).buf.slice(0, 16),
    );
    const encrypted = acb3Encrypt(plaintext, key, iv);
    const decrypted = acb3Decrypt(encrypted, key);
    expect(decrypted.toString()).toBe(plaintext.toString());
  });

  it("should pass 1000 random tests", () => {
    for (let i = 0; i < 1000; i++) {
      const plaintext = WebBuf.from(
        (i + 10 ** 12).toString(36).substring(2, 15),
      );
      const key = blake3Hash(WebBuf.from("12345678901234567"));
      const iv = FixedBuf.fromBuf(
        16,
        blake3Hash(WebBuf.from("1234")).buf.slice(0, 16),
      );
      const encrypted = acb3Encrypt(plaintext, key, iv);
      const decrypted = acb3Decrypt(encrypted, key);
      expect(decrypted.toString()).toBe(plaintext.toString());
    }
  });

  it("should pass a test with 1000+ byte message", () => {
    const plaintext = WebBuf.from("12".repeat(1000));
    const key = blake3Hash(WebBuf.from("1234567890123456"));
    const iv = FixedBuf.fromBuf(
      16,
      blake3Hash(WebBuf.from("1234")).buf.slice(0, 16),
    );
    const encrypted = acb3Encrypt(plaintext, key, iv);
    const decrypted = acb3Decrypt(encrypted, key);
    expect(decrypted.toString()).toBe(plaintext.toString());
    expect(encrypted.toString("hex")).toBe(
      "daf039777087d565e10d58d4873667fa9ae1d998be5d7fe8f96ebc195bc38d83cde13a55f41e387480391c47238acfe93ad7877d2deb896aed873c48a46bfa05841c8c81cb6984e34cab090a90cc25adf46c805589cb6d45df0b6436d3c024df7bd8785ff3098a77d03bc20492bf9836bc88a1c88e74bc25ca1255d7ad6bf424ccbf3b6751d579d248dd0eef60ff2148f148286bedf0e26ecad07479cf808e87dac341681b084104f2135d135feb4a22d75983c459bf9cd239cd887720e10a295f3ace120a0aeea63a4caf427644793efbcf408d1ab318667aa4ad91153f9833a89b8551bebffb22a4658173ad74593e938f9525e0fc294ce54470504e2f07546846c72a77b580aeabc7a58e35b1399a9138ec3517c4af778ab2019e5dcbf03a7bc6c410a1d82b91d1e1cda2d4326fabaded612c93ea05455a8b0fd7ab5651f2705787a3e5c08f3f2a9272a09c26d8ecfa4803540157e4c431d366c117bc1ca4134a9b863e23e685efe04b28f5f7aa27faee2277fd1377c31b929f69478ce9c340cd2b79afa9f680d7a291a6b0ee9118b352f9df2bc657224abffb4d1014f66c979a144859ac8ecf130e256dfae76d885d9274fcab85155d3601719046bd509a288f3b7d4664abf971da3fcef1aafcdf6519031abd47127bc732625ac5a81f03a82994dd81a5c93394e7123178fe6da5140d19c046eb29c1c4c4ecf510936e9c1a7fe8d0115d9b348c0787bb2f61abd223cd864f2451b6a59558cc214d8dbfb255cd91e47fc3bd548c172cd2f39b0db9343d37a55b9013f618ba6d4568f678be5517d39dd9244a7d99ac60348537fff429500128eb0ef339e2fa8d1bc860a7d715803848c42b0a07ff62f6121268bbd4f87556f8d7bbd6120b91408e3e47070063e82796d5c5ee5ef47431db7ad0bc04bb6e864163294ba60e22559ad00112d933a62d19aec5055ebc3e8072efe11896db2d205cefdfafae4027613b291748d24392f2e73c58e6238513b9ec7cebb7eadd7787711aee1561984a1d0d0b8b6fdb669ac2f9c38506be6b1cf6d48928346d2dd19973a89a74c6a41985deeb64759978da07339bc45acd938e0a53f3e629441514386294c9a1e3719360b6dab58678d380c9e939acf775bb64d5d96decfe4e47df7fa5e70a2deef8f919ef8134e836cdb5ecd3c543cd54b3e2a7a49086faf49076bbec162d65f2c4525136c225ad022bf7a52149c14e9c1b7e6b0fc31af80dd69adf82f6b1b7bd0017845c27e5471cd339498fa2908fef6c926e8b2f5f42a7dc19238a02ce5033ccd4e4be0ca382244e8bc8e62aaedcc086ff8c42d78c0e20956586702aa3160fb911c63817a3e53a355dd1d168cbf047d91b33d72d091ae95d0b5311de62dccfddaa7d287ee46556e14b33cd230a0d173f148ec997a916f96d8d142b47519e722874d11d590d7ba072cf03aaca53c814919c8fade54321ed08a1a0a8927ecaefb199fae12b9902403c2bec8c5a30a94516260e57524727f0b337c59c476de6affe431842fe43cffef4957e1e03d705a37540cfcb4e11c77090fa1f5624692a2a6b1c06060ddb441aeeea0900ff87f8db0331e68c4b66d73816687714c37a952d77c0c563b490eb43b698e0ab6227298bf69ddb2186a63c0a060d79bfd7ad8e3c8e0690d9d46a5c76324cd11fa46c110d60b5377ac2a382fe8ff1072226e05f03be98738960c4f3360a35a7d0a3c9ebb8b01c0f24b4675b5224380011bea5d944a498afdb2ee0dffe5beef2d8187cc58dfe62f002d6a3651ae3a65cd5fb481ebb616133596d72155f5c1c9057cc5db357f2360ae4a69ea1b0d3bf9d0a665f259ac5a368d7961316b1da7147d52db6260b6b0877722fa607752fad92a4ecebf148405cefdc2e1cd560ac36f2f6762278e84d1fb8a084213b492bae2f8159c2a475061c17f465f14a6248fe28d0debc6b7c012c4f926b04153ecddc728e48556db507adf0954e8e9f4abe3edddc5e8df63d61ca5ffed44ef00c7ebb1ae94b574df3ae9fd0b77068b308003687c1ab9463352758cdcb30fbb7a30b14e550cde63bc8f66f4e44bde5ac3d2b3ff96cd2fc99538a2979ababda665f5de5eba9f3f4e932ceb10172db0ab49747fc2ce13823cdba597939ac7397af9e5acb1c9a1cd10ac9fa2da7b812e02c7f896405627983dbbae9f2590bbbfeb7478b44d9068c35afae10b9b8f792a5ae957efc2070eb782b5a41537cf5479c2e96a6e9afcf52c0894cb35748bba02aea02ed18a1137a61bb3bb190020496c85fb35b0e655497ed5c334cc1e8d21c73b4e7d7bf8fe2cedf14710389f124ad8c625a24860830dabba671a7a3e71c8f1a6c4b8f054b1ad6c3253f3bd49d50094a45926f6ca38585688d5970dc283a125a66830ec75f2616f5ead827a8328f44c47290521547f90187ae138d279046c223be2ee773f838eab0cf6b5097a7026b275d37970663798050cc4944ddab126b2293fc5cd9ccd23c1e0fba6e17b978013570e3129581969a8cb2e83f87c4c2fedef7594e78bebb41022ded398d22f35e0796aa41a4c4ebd5c6ed01809844db94920854d15406f18629762509d2226d9a78efc58dca14ced0f98f9a049ccdbaaeb7f5bfdbecb2873ce24602d3dda37986a083efd591ea8dcafa90571558dead4a0901ce2d16bd99156eb4d455538e310ae39459cf43909b40f118b699ce4b46998e572b9ab751c3182b78ae416825cdfff1b99592f7b7b907ffd12d35049637c9bda249ad59691dc8bc36e40483c96988fb76b41264b6e18364196f10cb4c097c76259d6f81939219b3db20f3f8debb885868655953ad243bba9b9221a17351d7253aced951bf613ca0df4e326c425116273caa065f0be081a7427dc63aec7f2a553ce5f03cc8153d6b524fc7201e3486345d6c",
    );
  });
});
