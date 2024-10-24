use base64::{engine::general_purpose as lib_base64, Engine};
use hex::{decode as lib_hex_decode, encode as lib_hex_encode};

/// Encode a byte slice into a base64 string using the default engine
pub fn encode_base64(data: &[u8]) -> String {
    lib_base64::STANDARD.encode(data)
}

/// Decode a base64 string into a byte vector
/// Returns an error string if decoding fails
pub fn decode_base64(encoded: &str) -> Result<Vec<u8>, String> {
    lib_base64::STANDARD
        .decode(encoded)
        .map_err(|_| "invalid base64".to_string())
}

/// Encode a byte slice into a hex string
pub fn encode_hex(data: &[u8]) -> String {
    lib_hex_encode(data)
}

/// Decode a hex string into a byte vector
/// Returns an error string if decoding fails
pub fn decode_hex(encoded: &str) -> Result<Vec<u8>, String> {
    lib_hex_decode(encoded).map_err(|_| "invalid hex".to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_base64() {
        let data = b"Hello, world!";
        let encoded = encode_base64(data);
        assert_eq!(encoded, "SGVsbG8sIHdvcmxkIQ==");
        let decoded = decode_base64(&encoded).unwrap();
        assert_eq!(decoded, data);
    }

    #[test]
    fn test_hex() {
        let data = b"Hello, world!";
        let encoded = encode_hex(data);
        assert_eq!(encoded, "48656c6c6f2c20776f726c6421");
        let decoded = decode_hex(&encoded).unwrap();
        assert_eq!(decoded, data);
    }
}
