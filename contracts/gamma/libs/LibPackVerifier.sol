// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";


library LibPackVerifier {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    function verifyPackSigner(
        address sender,
        uint256 packNumber,
        uint8[] memory packData,
        bytes calldata signature
    ) public pure returns (address) {
        bytes32 messageHash = keccak256(
            abi.encodePacked(sender, packNumber, packData, '0xf1dD71895e49b1563693969de50898197cDF3481')
        ).toEthSignedMessageHash();

        address recoveredSigner = messageHash.recover(signature);
        return recoveredSigner;
    }
}
