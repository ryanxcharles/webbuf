use crate::aes::{aes_decrypt, aes_encrypt};

// Helper function to XOR two byte slices
fn xor_bufs(buf1: &[u8], buf2: &[u8]) -> Vec<u8> {
    if buf1.len() != buf2.len() {
        panic!("Buffers must be the same length");
    }
    buf1.iter()
        .zip(buf2.iter())
        .map(|(&x1, &x2)| x1 ^ x2)
        .collect()
}

// PKCS#7 Padding
fn pkcs7_pad(buf: &[u8], block_size: usize) -> Vec<u8> {
    if block_size == 0 {
        panic!("Invalid block size");
    }
    if buf.len() >= block_size {
        panic!("Buffer is already a full block");
    }
    let pad_size = block_size - (buf.len() % block_size);
    let mut padded_buf = buf.to_vec();
    padded_buf.extend(vec![pad_size as u8; pad_size]);
    padded_buf
}

// PKCS#7 Unpadding
fn pkcs7_unpad(padded_buf: &[u8]) -> Vec<u8> {
    if padded_buf.is_empty() {
        panic!("Empty buffer");
    }
    if padded_buf.len() > 16 {
        panic!("Invalid padding");
    }

    let pad_size = *padded_buf.last().unwrap() as usize;
    if pad_size == 0 || pad_size > padded_buf.len() {
        panic!("Invalid padding");
    }

    // Check if all padding bytes match the pad_size value
    let padding = &padded_buf[padded_buf.len() - pad_size..];
    if !padding.iter().all(|&byte| byte as usize == pad_size) {
        panic!("Invalid padding");
    }

    // Return buffer without the padding bytes
    padded_buf[..padded_buf.len() - pad_size].to_vec()
}

// Splits a buffer into blocks of a specified size, padding if necessary
fn buf_to_blocks(buf: &[u8], block_size: usize) -> Vec<Vec<u8>> {
    let mut blocks = vec![];
    let mut i = 0;
    while i <= buf.len() {
        let end = std::cmp::min(i + block_size, buf.len());
        let mut block = buf[i..end].to_vec();
        if block.len() < block_size {
            block = pkcs7_pad(&block, block_size);
        }
        blocks.push(block);
        i += block_size;
    }
    blocks
}

// Combines blocks into a single buffer, removing padding from the last block
fn blocks_to_buf(blocks: Vec<Vec<u8>>) -> Vec<u8> {
    let mut buf = vec![];
    for (i, block) in blocks.iter().enumerate() {
        if i == blocks.len() - 1 {
            buf.extend(pkcs7_unpad(block));
        } else {
            buf.extend(block);
        }
    }
    buf
}

// AES-CBC Encrypt
pub fn encrypt_aescbc(plaintext: &[u8], aes_key: &[u8], iv: &[u8]) -> Result<Vec<u8>, String> {
    let block_size = 16;

    if iv.len() != block_size || ![16, 24, 32].contains(&aes_key.len()) {
        return Err("Invalid IV or key size".to_string());
    }

    let blocks = buf_to_blocks(plaintext, block_size);
    let mut ciphertext = vec![];
    let mut prev_block = iv.to_vec();

    for block in blocks {
        let xored = xor_bufs(&block, &prev_block);
        let encrypted_block = aes_encrypt(aes_key, &xored)?;
        ciphertext.extend(&encrypted_block);
        prev_block = encrypted_block;
    }

    Ok(ciphertext)
}

// AES-CBC Decrypt
pub fn decrypt_aescbc(ciphertext: &[u8], aes_key: &[u8], iv: &[u8]) -> Result<Vec<u8>, String> {
    let block_size = 16;

    if iv.len() != block_size {
        return Err("Invalid IV size".to_string());
    }

    let ciphertext_blocks = ciphertext
        .chunks(block_size)
        .map(|chunk| chunk.to_vec())
        .collect::<Vec<_>>();

    let mut plaintext_blocks = vec![];
    let mut prev_block = iv.to_vec();

    // println!("ciphertext: {:?}", ciphertext);
    // println!("ciphertext_blocks: {:?}", ciphertext_blocks);

    for block in ciphertext_blocks {
        let decrypted_block = aes_decrypt(aes_key, &block)?;
        let plaintext_block = xor_bufs(&decrypted_block, &prev_block);
        plaintext_blocks.push(plaintext_block);
        prev_block = block;
    }

    Ok(blocks_to_buf(plaintext_blocks))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_xor_bufs() {
        // Basic test case
        let buf1 = [0b10101010, 0b11110000];
        let buf2 = [0b01010101, 0b00001111];
        let result = xor_bufs(&buf1, &buf2);
        assert_eq!(result, vec![0b11111111, 0b11111111]);

        // All zeros
        let buf1 = [0u8; 4];
        let buf2 = [0u8; 4];
        let result = xor_bufs(&buf1, &buf2);
        assert_eq!(result, vec![0, 0, 0, 0]);

        // All ones
        let buf1 = [0xFFu8; 4];
        let buf2 = [0xFFu8; 4];
        let result = xor_bufs(&buf1, &buf2);
        assert_eq!(result, vec![0, 0, 0, 0]);
    }

    #[test]
    fn test_pkcs7_pad() {
        // Basic test case with 16-byte block size
        let buf = vec![1, 2, 3, 4, 5, 6, 7, 8];
        let padded = pkcs7_pad(&buf, 16);
        assert_eq!(padded, vec![1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8]);

        // Full block padding of empty block
        let buf = vec![];
        let padded = pkcs7_pad(&buf, 16);
        assert_eq!(
            padded,
            vec![16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]
        );

        // Edge case: Empty buffer
        let buf: Vec<u8> = vec![];
        let padded = pkcs7_pad(&buf, 16);
        assert_eq!(padded, vec![16; 16]);
    }

    #[test]
    fn test_pkcs7_unpad() {
        // Basic unpadding
        let padded_buf = vec![1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8];
        let unpadded = pkcs7_unpad(&padded_buf);
        assert_eq!(unpadded, vec![1, 2, 3, 4, 5, 6, 7, 8]);

        // Full block padding of empty block
        let padded_buf = vec![
            16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
        ];
        let unpadded = pkcs7_unpad(&padded_buf);
        let empty_vec: Vec<u8> = vec![];
        assert_eq!(unpadded, empty_vec);
    }

    #[test]
    fn test_buf_to_blocks_exact_block_size() {
        let buf = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        let block_size = 16;
        let blocks = buf_to_blocks(&buf, block_size);
        assert_eq!(
            blocks,
            vec![
                vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                vec![16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]
            ]
        );
    }

    #[test]
    fn test_buf_to_blocks_with_padding() {
        let buf = vec![1, 2, 3, 4, 5, 6, 7, 8];
        let block_size = 16;
        let blocks = buf_to_blocks(&buf, block_size);
        assert_eq!(
            blocks,
            vec![vec![1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8]]
        );
    }

    #[test]
    fn test_buf_to_blocks_multiple_blocks() {
        let buf = vec![
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        ];
        let block_size = 16;
        let blocks = buf_to_blocks(&buf, block_size);
        assert_eq!(
            blocks,
            vec![
                vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                vec![17, 18, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14]
            ]
        );
    }

    // this panics - as it should
    // #[test]
    // fn test_blocks_to_buf_no_padding() {
    //     let blocks = vec![
    //         vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    //     ];
    //     let buf = blocks_to_buf(blocks);
    //     assert_eq!(buf, vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    // }

    #[test]
    fn test_blocks_to_buf_with_unpadding() {
        let blocks = vec![
            vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            vec![
                17, 18, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
            ],
        ];
        let buf = blocks_to_buf(blocks);
        assert_eq!(
            buf,
            vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
        );
    }

    #[test]
    fn test_blocks_to_buf_with_single_byte_padding() {
        let blocks = vec![vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1]];
        let buf = blocks_to_buf(blocks);
        assert_eq!(buf, vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    }

    // Sample AES key and IV for tests
    const AES_KEY_128: [u8; 16] = [0x00; 16];
    const AES_KEY_192: [u8; 24] = [0x00; 24];
    const AES_KEY_256: [u8; 32] = [0x00; 32];
    const IV: [u8; 16] = [0x00; 16];

    #[test]
    fn test_encrypt_decrypt_aescbc_128bit_key() {
        let plaintext = b"Hello, AES-CBC!";

        // Encrypt with AES-128 and verify it decrypts correctly
        let ciphertext = encrypt_aescbc(plaintext, &AES_KEY_128, &IV).expect("Encryption failed");
        let decrypted_text =
            decrypt_aescbc(&ciphertext, &AES_KEY_128, &IV).expect("Decryption failed");

        // Check that decrypted text matches the original plaintext
        assert_eq!(decrypted_text, plaintext);
    }

    #[test]
    fn test_encrypt_decrypt_aescbc_192bit_key() {
        let plaintext = b"Testing AES with 192-bit key.";

        // Encrypt with AES-192 and verify it decrypts correctly
        let ciphertext = encrypt_aescbc(plaintext, &AES_KEY_192, &IV).expect("Encryption failed");
        let decrypted_text =
            decrypt_aescbc(&ciphertext, &AES_KEY_192, &IV).expect("Decryption failed");

        // Check that decrypted text matches the original plaintext
        assert_eq!(decrypted_text, plaintext);
    }

    #[test]
    fn test_encrypt_decrypt_aescbc_256bit_key() {
        let plaintext = b"Testing AES with 256-bit key.";

        // Encrypt with AES-256 and verify it decrypts correctly
        let ciphertext = encrypt_aescbc(plaintext, &AES_KEY_256, &IV).expect("Encryption failed");
        let decrypted_text =
            decrypt_aescbc(&ciphertext, &AES_KEY_256, &IV).expect("Decryption failed");

        // Check that decrypted text matches the original plaintext
        assert_eq!(decrypted_text, plaintext);
    }

    #[test]
    fn test_encrypt_decrypt_empty_plaintext() {
        let plaintext = b"";

        // Encrypt and decrypt an empty plaintext
        let ciphertext = encrypt_aescbc(plaintext, &AES_KEY_128, &IV).expect("Encryption failed");
        let decrypted_text =
            decrypt_aescbc(&ciphertext, &AES_KEY_128, &IV).expect("Decryption failed");

        // Check that decrypted text matches the original (empty) plaintext
        assert_eq!(decrypted_text, plaintext);
    }

    #[test]
    fn test_invalid_iv_length() {
        let plaintext = b"Invalid IV length test.";
        let invalid_iv = [0x00; 8]; // IV that is not 16 bytes

        // Ensure that encryption with an invalid IV length fails
        let result = encrypt_aescbc(plaintext, &AES_KEY_128, &invalid_iv);
        assert!(
            result.is_err(),
            "Expected an error due to invalid IV length"
        );

        // Ensure that decryption with an invalid IV length fails
        let result = decrypt_aescbc(plaintext, &AES_KEY_128, &invalid_iv);
        assert!(
            result.is_err(),
            "Expected an error due to invalid IV length"
        );
    }

    #[test]
    fn test_invalid_key_length() {
        let plaintext = b"Invalid key length test.";
        let invalid_key = [0x00; 10]; // Key that is not 128, 192, or 256 bits

        // Ensure that encryption with an invalid key length fails
        let result = encrypt_aescbc(plaintext, &invalid_key, &IV);
        assert!(
            result.is_err(),
            "Expected an error due to invalid key length"
        );

        // Ensure that decryption with an invalid key length fails
        let result = decrypt_aescbc(plaintext, &invalid_key, &IV);
        assert!(
            result.is_err(),
            "Expected an error due to invalid key length"
        );
    }

    #[test]
    fn test_encrypt_decrypt_with_padding() {
        let plaintext = b"Plaintext with length not multiple of block size";

        // Encrypt and decrypt a plaintext that requires padding
        let ciphertext = encrypt_aescbc(plaintext, &AES_KEY_128, &IV).expect("Encryption failed");
        let decrypted_text =
            decrypt_aescbc(&ciphertext, &AES_KEY_128, &IV).expect("Decryption failed");

        // Check that decrypted text matches the original plaintext
        assert_eq!(decrypted_text, plaintext);
    }
}
