// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface ICardsContract {
    function receivePrizesBalance(uint256 amount) external;
    function changePackPrice(uint256 amount) external;
}

contract GammaPacks is Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    address public DAI_TOKEN;
    ICardsContract public cardsContract;
    uint256 private immutable MAX_INT = 2**256-1;
    uint256 public packPrice = 1200000000000000000; // 1.2 DAI
    uint256 public constant totalSupply = 50000;
    address public balanceReceiver;

    mapping(uint256 tokenId => address owner) public packs;
    mapping(address owner => uint256[] tokenIds) public packsByUser;

    event PackPurchase(address buyer, uint256 tokenId);
    event NewPrice(uint256 newPrice);
    event NewCardsContract(address newCardsContract);
    event PackTransfer(address from, address to, uint256 tokenId);

    constructor(address _daiTokenAddress, address _balanceReceiver) {
        DAI_TOKEN = _daiTokenAddress;
        balanceReceiver = _balanceReceiver;
    }

    function buyPack() public {
        require(address(cardsContract) != address(0), "Contrato de cartas no seteado"); // chequear tambien que el cards contract sea el correcto y no cualquiera
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < totalSupply, "Se acabaron los sobres");
        _tokenIdCounter.increment();
        
        packs[tokenId] = msg.sender;
        packsByUser[msg.sender].push(tokenId);
        
        uint256 prizesAmount = packPrice - packPrice / 6;
        cardsContract.receivePrizesBalance(prizesAmount);
        IERC20(DAI_TOKEN).transferFrom(msg.sender, address(cardsContract), prizesAmount); // envia monto de premios al contrato de cartas
        IERC20(DAI_TOKEN).transferFrom(msg.sender, balanceReceiver, packPrice - prizesAmount); // envia monto de profit a cuenta de NoF

        emit PackPurchase(msg.sender, tokenId);
    }

    function deleteTokenId(uint256 tokenId) internal {
        for(uint256 i=0;i<packsByUser[msg.sender].length;i++){
            if(packsByUser[msg.sender][i] == tokenId) {
                packsByUser[msg.sender][i] = packsByUser[msg.sender][packsByUser[msg.sender].length - 1];
                packsByUser[msg.sender].pop();
            }
            continue;
        }
    }

    function transferPack(address to, uint256 tokenId) public {
        require(packs[tokenId] == msg.sender, "Este paquete no es tuyo");
        require(to != address(0), "Quemar no permitido");

        packs[tokenId] = to;
        deleteTokenId(tokenId);
        packsByUser[to].push(tokenId);

        emit PackTransfer(msg.sender, to, tokenId);
    }

    function openPack(uint256 tokenId) public {
        require(msg.sender == address(cardsContract), "No es contrato de cartas");
        deleteTokenId(tokenId);
        delete packs[tokenId];
    }

    function changePrice(uint256 _newPrice) public onlyOwner {
        packPrice = _newPrice;
        cardsContract.changePackPrice(_newPrice);
        emit NewPrice(_newPrice);
    }

    function setCardsContract(address _cardsContract) public onlyOwner {
        cardsContract = ICardsContract(_cardsContract);
        emit NewCardsContract(_cardsContract);
    }

    function getPacksByUser(address owner) public view returns(uint256[] memory) {
        return packsByUser[owner];
    }

    function getPackOwner(uint256 tokenId) public view returns(address) {
        return packs[tokenId];
    }
}