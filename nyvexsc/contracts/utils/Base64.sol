// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Provides a set of functions to operate with Base64 strings.
 */
library Base64 {
    string internal constant _TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /**
     * @dev Converts a `bytes` to its Bytes64 `string` representation.
     */
    function encode(bytes memory data) internal pure returns (string memory) {
        /**
         * Inspired by Brecht Devos (Brechtpd) implementation - MIT licence
         * https://github.com/Brechtpd/base64/blob/e78d9fd951e7b0977ddca77d92dc85183770daf4/base64.sol
         */
        if (data.length == 0) return "";

        // Loads the table into memory
        string memory table = _TABLE;

        // Encoding takes 3 bytes chunks of binary data from `bytes` data parameter
        // and split into 4 numbers of 6 bits.
        // The final Base64 length should be `bytes` data length multiplied by 4/3 rounded up
        // - `data.length + 2`  -> Round up
        // - `/ 3`              -> Number of 3-bytes chunks
        // - `4 *`              -> 4 characters for each chunk
        string memory result = new string(4 * ((data.length + 2) / 3));

        assembly {
            // Prepare the lookup table (skip the first "length" byte)
            let tablePtr := add(table, 1)

            // Prepare result pointer, jump over length
            let resultPtr := add(result, 32)

            // Run over the input, 3 bytes at a time
            for {
                let dataPtr := data
                let endPtr := add(data, mload(data))
            } lt(dataPtr, endPtr) {

            } {
                // Advance 3 bytes
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)

                // To avoid going out of bounds. The input length is a multiple of 3.
                if gt(endPtr, dataPtr) {
                    input := and(input, 0xFFFFFF)
                }

                // 4 characters for each chunk
                let chunk := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                chunk := shl(8, chunk)
                chunk := add(chunk, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
                chunk := shl(8, chunk)
                chunk := add(chunk, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
                chunk := shl(8, chunk)
                chunk := add(chunk, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
                mstore(resultPtr, chunk)

                resultPtr := add(resultPtr, 4)
            }

            // Padding with '='
            switch mod(mload(data), 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
        }

        return result;
    }
}
