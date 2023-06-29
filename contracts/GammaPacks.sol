// SPDX-License-Identifier: MIT

// - 5000 copias de cada carta (120 personajes únicos) = 600.000 cartas de personajes
// - se venden de a sobres a ciegas, trae 12 cartas y puede o no traer un album extra aleatoriamente
// - los albumes de 120 figuritas son de toda la colección (los 120 personajes)
// - los albumes de 60 figuritas son albumes de quema y no importa la figurita que pongan
// - la carta al pegarse en el album se quema
// - en total van a haber 3000 albumes de 120 figuritas, 5000 albumes de 60 figuritas, 6000 figuritas, 600000 cartas en total, 50000 sobres.
// - el album completo de 120 paga 15 dolares
// - el album completo de 60 paga 1 dolar
// - el sobre sale 1,20 dolares
// - pago total por albumes completos 49000
// - total profit bruto si se venden todos los sobres 60000
// - el ticket del album de un dolar da entrada para un jackpot que reparte 1000 dolares al final de la temporada
// - total profit neto si se venden todos los sobres y se completan todos los albumes 10000 menos gastos de gas
// - importante de la implementación que los albumes estén uniformemente repartidos en los sobres a lo largo del tiempo
// - fee de transacción del 2.5%

// buy pack: mint
// transfer pack ?
// open pack: llamar al contrato de cartas y quemar pack

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

interface ICardsContract {
    function receivePrizesBalance(uint256 amount) external;
    function changePackPrice(uint256 amount) external;
}

contract GammaPacks is Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    address public DAI_TOKEN;
    ICardsContract public cardsContract;
    uint256 private immutable MAX_INT = ~uint256(0);
    uint256 public packPrice = 12e17; // 1.2 DAI
    uint256 public constant totalSupply = 50000;
    address public balanceReceiver;

    mapping(uint256 tokenId => address owner) public packs;
    mapping(address owner => uint256[] tokenIds) public packsByUser;

    event PackPurchase(address buyer, uint256 tokenId);
    event PacksPurchase(address buyer, uint256[] tokenIds);
    event NewPrice(uint256 newPrice);
    event NewCardsContract(address newCardsContract);
    event PackTransfer(address from, address to, uint256 tokenId);

    constructor(address _daiTokenAddress, address _balanceReceiver) {
        DAI_TOKEN = _daiTokenAddress;
        balanceReceiver = _balanceReceiver;
    }

    function buyPack() public returns (uint256){
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
        return tokenId;
    }

    function buyPacks(uint256 numberOfPacks) public returns(uint256[] memory){
        require(address(cardsContract) != address(0), "Contrato de cartas no seteado"); // chequear tambien que el cards contract sea el correcto y no cualquiera
        uint256 prizesAmount = (packPrice - packPrice / 6) * numberOfPacks;
        uint256[] memory tokenIds = new uint256[](numberOfPacks);
        for(uint256 i;i < numberOfPacks;i++){
            uint256 tokenId = _tokenIdCounter.current();
            require(tokenId < totalSupply, "Se acabaron los sobres");
            _tokenIdCounter.increment();
            
            packs[tokenId] = msg.sender;
            packsByUser[msg.sender].push(tokenId);
            tokenIds[i] = tokenId;
        }
        cardsContract.receivePrizesBalance(prizesAmount);
        IERC20(DAI_TOKEN).transferFrom(msg.sender, address(cardsContract), prizesAmount); // envia monto de premios al contrato de cartas
        IERC20(DAI_TOKEN).transferFrom(msg.sender, balanceReceiver, packPrice * numberOfPacks - prizesAmount); // envia monto de profit a cuenta de NoF

        emit PacksPurchase(msg.sender, tokenIds);
        
        return tokenIds;
    }

    function deleteTokenId(uint256 tokenId) internal {
        uint256 packsByUserLength = packsByUser[msg.sender].length;
        for(uint256 i;i<packsByUserLength;i++){
            if(packsByUser[msg.sender][i] == tokenId) {
                packsByUser[msg.sender][i] = packsByUser[msg.sender][packsByUser[msg.sender].length - 1];
                packsByUser[msg.sender].pop();
            }
            break;
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