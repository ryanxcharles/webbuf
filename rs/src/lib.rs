use base64;
use hex;

/// Encode a byte slice into a base64 string
pub fn encode_base64(data: &[u8]) -> String {
    base64::encode(data)
}

/// Decode a base64 string into a byte vector
/// Returns an error string if decoding fails
pub fn decode_base64(encoded: &str) -> Result<Vec<u8>, String> {
    base64::decode(encoded).map_err(|_| "invalid base64".to_string())
}

/// Encode a byte slice into a hex string
pub fn encode_hex(data: &[u8]) -> String {
    hex::encode(data)
}

/// Decode a hex string into a byte vector
/// Returns an error string if decoding fails
pub fn decode_hex(encoded: &str) -> Result<Vec<u8>, String> {
    hex::decode(encoded).map_err(|_| "invalid hex".to_string())
}

