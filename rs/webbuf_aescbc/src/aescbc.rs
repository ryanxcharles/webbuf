use std::convert::TryInto;
use crate::aes::{aes_encrypt, aes_decrypt};

// Ensure the aes_encrypt and aes_decrypt functions are already defined as:
// fn aes_encrypt(key: &[u8], block: &[u8]) -> Vec<u8>;
// fn aes_decrypt(key: &[u8], block: &[u8]) -> Vec<u8>;

// Helper function to XOR two byte slices
fn xor_bufs(buf1: &[u8], buf2: &[u8]) -> Vec<u8> {
    buf1.iter().zip(buf2.iter()).map(|(&x1, &x2)| x1 ^ x2).collect()
}

// PKCS#7 Padding
fn pkcs7_pad(buf: &[u8], block_size: usize) -> Vec<u8> {
    let pad_size = block_size - (buf.len() % block_size);
    let mut padded_buf = buf.to_vec();
    padded_buf.extend(vec![pad_size as u8; pad_size]);
    padded_buf
}

// PKCS#7 Unpadding
fn pkcs7_unpad(padded_buf: &[u8]) -> Vec<u8> {
    let pad_size = *padded_buf.last().unwrap() as usize;
    padded_buf[..padded_buf.len() - pad_size].to_vec()
}

// Splits a buffer into blocks of a specified size, padding if necessary
fn buf_to_blocks(buf: &[u8], block_size: usize) -> Vec<Vec<u8>> {
    let mut blocks = vec![];
    let mut i = 0;
    while i < buf.len() {
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
            buf.extend(pkcs7_unpad(&block));
        } else {
            buf.extend(block);
        }
    }
    buf
}

// // AES-CBC Encrypt
// pub fn encrypt_cbc(plaintext: &[u8], aes_key: &[u8], iv: &[u8], concat_iv: bool) -> Vec<u8> {
//     let block_size = 16;
    
//     if iv.len() != block_size || ![16, 24, 32].contains(&aes_key.len()) {
//         panic!("Invalid IV or key size");
//     }

//     let blocks = buf_to_blocks(plaintext, block_size);
//     let mut ciphertext = vec![];
//     let mut prev_block = iv.clone();

//     for block in blocks {
//         let xored = xor_bufs(&block, &prev_block);
//         let encrypted_block = aes_encrypt(aes_key, &xored);
//         ciphertext.extend(&encrypted_block);
//         prev_block = encrypted_block;
//     }

//     if concat_iv {
//         [iv, &ciphertext].concat()
//     } else {
//         ciphertext
//     }
// }

// // AES-CBC Decrypt
// pub fn decrypt_cbc(ciphertext: &[u8], aes_key: &[u8], iv: Option<&[u8]>) -> Vec<u8> {
//     let block_size = 16;
//     let iv = match iv {
//         Some(iv) => iv.to_vec(),
//         None => ciphertext[..block_size].to_vec(),
//     };

//     let ciphertext_blocks = if iv.len() == block_size {
//         ciphertext[block_size..].chunks(block_size).map(|chunk| chunk.to_vec()).collect::<Vec<_>>()
//     } else {
//         panic!("Invalid IV size")
//     };

//     let mut plaintext_blocks = vec![];
//     let mut prev_block = iv;

//     for block in ciphertext_blocks {
//         let decrypted_block = aes_decrypt(aes_key, &block);
//         let plaintext_block = xor_bufs(&decrypted_block, &prev_block);
//         plaintext_blocks.push(plaintext_block);
//         prev_block = block;
//     }

//     blocks_to_buf(plaintext_blocks)
// }

