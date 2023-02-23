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
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GammaPacks is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    address public DAI_TOKEN;
    address public cardsContract;
    string public baseUri;
    uint256 public MAX_INT = 2**256-1;
    uint256 public packPrice; // 1200000000000000000 --- 1.2 DAI
    // uint256 public prizesBalance;
    uint256 public constant totalSupply = 50000;
    address public balanceReceiver;

    event PackPurchase(address buyer, uint256 tokenId);
    event NewPrice(uint256 newPrice);
    event NewCardsContract(address newCardsContract);

    constructor(
            address _daiTokenAddress,
            uint256 _packPrice,
            address _balanceReceiver,
            string memory _baseUri
        ) ERC721("GammaPacks", "NOF_GP") {
            baseUri = _baseUri;
            DAI_TOKEN = _daiTokenAddress;
            packPrice = _packPrice;
            balanceReceiver = _balanceReceiver;
    }

    function buyPack(uint256 price) public {
        require(cardsContract != address(0), "Contrato de cartas no seteado");
        require(price == packPrice, "Debes enviar el precio exacto");
        safeMint(msg.sender, baseUri);
        uint256 prizesAmount = price - price / 6;
        // prizesBalance += prizesAmount;
        IERC20(DAI_TOKEN).transferFrom(msg.sender, cardsContract, prizesAmount); // envia monto de premios al contrato de cartas
        IERC20(DAI_TOKEN).transferFrom(msg.sender, balanceReceiver, price - prizesAmount); // envia monto de profit a cuenta de NoF
    }

    function openPack(uint256 tokenId) public {
        // agregar require para que solo pueda ser llamado por cardsContract
        _burn(tokenId);
    }

    function safeMint(address to, string memory uri) internal {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < totalSupply, "Se acabaron los sobres");
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        emit PackPurchase(msg.sender, tokenId);
    }

    function changePrice(uint256 _newPrice) public onlyOwner {
        packPrice = _newPrice;
        emit NewPrice(_newPrice);
    }

    function setCardsContract(address _cardsContract) public onlyOwner {
        cardsContract = _cardsContract;
        emit NewCardsContract(_cardsContract);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
