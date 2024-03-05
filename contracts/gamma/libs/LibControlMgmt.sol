// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LibControlMgmt {
    struct Data {
        mapping(address => bool) owners;
        mapping(address => bool) signers;
    }

    event NewOwnerAdded(address newOwner);
    event OwnerRemoved(address owner);
    event NewSignerAdded(address newSigner);
    event SignerRemoved(address signer);

    function addOwner(Data storage self, address newOwner) external {
        require(newOwner != address(0), "Invalid address.");
        require(!self.owners[newOwner], "Address is already an owner.");
        self.owners[newOwner] = true;
        emit NewOwnerAdded(newOwner);
    }

    function removeOwner(Data storage self, address ownerToRemove) external {
        require(ownerToRemove != address(0), "Invalid address.");
        require(self.owners[ownerToRemove], "Address is not an owner.");
        require(ownerToRemove != msg.sender, "You cannot remove yourself as an owner.");
        self.owners[ownerToRemove] = false;
        emit OwnerRemoved(ownerToRemove);
    }

    function addSigner(Data storage self, address newSigner) external {
        require(newSigner != address(0), "Invalid address.");
        require(!self.signers[newSigner], "Address is already a signer.");
        self.signers[newSigner] = true;
        emit NewSignerAdded(newSigner);
    }

    function removeSigner(Data storage self, address signerToRemove) external {
        require(signerToRemove != address(0), "Invalid address.");
        require(self.signers[signerToRemove], "Address is not a signer.");
        require(signerToRemove != msg.sender, "You cannot remove yourself as a signer.");
        self.signers[signerToRemove] = false;
        emit SignerRemoved(signerToRemove);
    }
}
