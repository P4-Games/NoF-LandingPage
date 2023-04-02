// SPDX-License-Identifier: MIT

// - 5000 copias de cada carta (120 personajes únicos) = 600.000 cartas de personajes
// - se venden de a sobres a ciegas, trae 12 cartas y puede o no traer un album extra aleatoriamente
// - los albumes de 120 figuritas son de toda la colección (los 120 personajes) (#120)
// - los albumes de 60 figuritas son albumes de quema y no importa la figurita que pongan (#121)
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

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "hardhat/console.sol";

interface IGammaPacks {
    function getPackOwner(uint256 tokenId) external view returns (address);
    function openPack(uint256 tokenId) external;
}

contract GammaCardsV2 is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    using ECDSA for bytes32;

    IGammaPacks public packsContract;

    Counters.Counter private _tokenIdCounter;
    address public immutable DAI_TOKEN;
    address public signer;
    address public escrow;
    uint256 public packPrice = 1.2e18;
    uint256 public prizesBalance;
    string public baseUri;
    string public mainUri;
    string public secondaryUri;
    mapping (uint256 cardNumber => uint256 amount) public cardsInventory; // maximos: 119 => 4999
    mapping (uint256 tokenId => Card) public cards;
    mapping(address user => mapping(uint8 cardNumber => uint8 amount)) public cardsByUser;
    mapping(address user => uint256 amount) public burnedCards;

    struct Card {
        uint256 tokenId;
        uint256 number;
        bool pasted;
        uint8 class; // 1 para cartas, 2 para album de 120, 3 para album de 60
        uint256 completion; // solo se modifica en el caso de los albums
    }

    uint256 public constant mainAlbumPrize = 15e18; // 15 DAI por album principal completado
    uint256 public constant secondaryAlbumPrize = 1e18; // 1 DAI por album secundario completado

    event PackOpened(address player, uint8[] packData, uint256 packNumber);
    event AlbumCompleted(address player, uint8 albumClass);
    event CardPasted(address player, uint256 cardTokenId, uint256 albumTokenId);
    event EmergencyWithdrawal(address receiver, uint256 amount);
    event NewSigner(address newSigner);
    event NewUris(string newMainUri, string newSecondaryUri);

    modifier onlyPacksContract {
        require(msg.sender == address(packsContract), "Solo contrato de packs");
        _;
    }

    modifier onlyEscrow {
        require(msg.sender == escrow, "Solo escrow");
        _;
    }

    constructor(address _daiTokenAddress, address _packsContract, string memory _baseUri, address _signer) ERC721("GammaCards", "NOF_GC") {
        packsContract = IGammaPacks(_packsContract);
        DAI_TOKEN = _daiTokenAddress;
        baseUri = _baseUri;
        mainUri = string(abi.encodePacked(bytes(baseUri), bytes("/"), bytes("120"), bytes("F.json")));
        secondaryUri = string(abi.encodePacked(bytes(baseUri), bytes("/"), bytes("121"), bytes("F.json")));
        signer = _signer;
        for(uint256 i=0;i<122;i++){
            cardsInventory[i] = 1;
        }
    }


    function openPack(uint256 packNumber, uint8[] memory packData, bytes calldata signature) external {
        require(packsContract.getPackOwner(packNumber) == msg.sender, "Este sobre no es tuyo");
        require(packData.length < 15, "Limite de cartas excedido"); // chequear este length
        
        packsContract.openPack(packNumber);
        prizesBalance += packPrice - packPrice / 6;

        // Recreates the message present in the `signature`
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, packNumber, packData, 0xf1dD71895e49b1563693969de50898197cDF3481)).toEthSignedMessageHash();
        // bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, packNumber, packData, address(this))).toEthSignedMessageHash();
        require(messageHash.recover(signature) == signer, "Invalid signature");


        uint256 length = packData.length;
        for(uint8 i=0;i<length;i++){
            require(packData[i] == 120 ? cardsInventory[120] < 3001 : cardsInventory[packData[i]] < 5001);
            cardsInventory[packData[i]]++; // 280k gas aprox.
            cardsByUser[msg.sender][packData[i]]++; // 310k gas aprox.
        }

        emit PackOpened(msg.sender, packData, packNumber);
    }

    // transfer one card
    function transferCard(address to, uint8 cardNumber) public {
        require(cardsByUser[msg.sender][cardNumber] > 0, "No tienes esta carta");
        require(to != msg.sender, "Transf propia no permitida");
        require(to != address(0), "Quemado de cartas no permitido");
        cardsByUser[msg.sender][cardNumber]--;
        cardsByUser[to][cardNumber]++;
    }

    // transfer multiple cards
    function transferCards(address to, uint8[] calldata cardNumbers) public {
        require(to != msg.sender, "No te puedes enviar cartas a ti mismo");
        require(to != address(0), "No puedes quemar cartas de esta manera");

        for(uint8 i=0; i<cardNumbers.length;i++){
            require(cardsByUser[msg.sender][cardNumbers[i]] > 0, "No tienes esta carta");
            cardsByUser[msg.sender][cardNumbers[i]]--;
            cardsByUser[to][cardNumbers[i]]++;
        }
    }

    // escrow functions
    function setEscrow(address _escrow) external onlyOwner {
        escrow = _escrow;
    }


    function transferFromEscrow(address offeror, uint8 oferrorCard, address acceptor, uint8 acceptorCard) onlyEscrow external {
        require(cardsByUser[offeror][oferrorCard] > 0, "El ofertante no tiene esta carta");
        require(cardsByUser[acceptor][acceptorCard] > 0, "El aceptante no tiene esta carta");
        cardsByUser[offeror][oferrorCard]--;
        cardsByUser[acceptor][acceptorCard]--;
        cardsByUser[offeror][acceptorCard]++;
        cardsByUser[acceptor][oferrorCard]++;
    }

    function sendCard(address seller, uint8 sellerCard, address buyer) onlyEscrow external {
        require(cardsByUser[seller][sellerCard] > 0, "El vendedor no tiene esta carta");
        cardsByUser[seller][sellerCard]--;
        cardsByUser[buyer][sellerCard]++;
    }

    // user must call this function when they have at least 1 card of each number (120 total) + a 120 album card
    function finishAlbum() public {
        // requiere que el usuario tenga al menos un album de 120
        require(cardsByUser[msg.sender][120] > 0, "No tienes ningun album");
        require(prizesBalance >= mainAlbumPrize, "Fondos insuficientes");

        // chequea que tenga al menos una carta de cada numero
        // chequear si es necesaria esta parte porque la resta de cartas haria underflow si esta en 0
        bool unfinished;
        for(uint8 i=0;i<121;i++){
            if(cardsByUser[msg.sender][i] == 0) {
                unfinished = true;
                break;
            }
            cardsByUser[msg.sender][i]--;
        }
        
        require(!unfinished, "Must complete the album");
        
        // mintea el album lleno
        safeMint(msg.sender, mainUri, 120, 2);

        prizesBalance -= mainAlbumPrize;
        // transfiere premio en DAI
        IERC20(DAI_TOKEN).transfer(msg.sender, mainAlbumPrize);
        emit AlbumCompleted(msg.sender, 1);
    }

    function testAddCards() public {
        for(uint8 i=0;i<121;i++){
            cardsByUser[msg.sender][i]++;
        }
    }

    // user should call this function if they want to 'paste' selected cards in the 60 cards album to 'burn' them
    function burnCards(uint8[] calldata cardNumbers) public {
        require(cardsByUser[msg.sender][121] > 0, "No tienes album de quema");
        cardsByUser[msg.sender][121]--;
        burnedCards[msg.sender] += cardNumbers.length;
        for(uint8 i;i<cardNumbers.length;i++){
            cardsByUser[msg.sender][cardNumbers[i]]--;
        }
        if(burnedCards[msg.sender] % 60 == 0){
            // string memory uri = string(abi.encodePacked(bytes(baseUri), bytes("/"), bytes("121"), bytes("F.json"))); // global variable
            // mintea album de 60
            safeMint(msg.sender, secondaryUri, 121, 2);
            
            prizesBalance -= mainAlbumPrize;
            // transfiere premio en DAI
            IERC20(DAI_TOKEN).transfer(msg.sender, secondaryAlbumPrize);
            emit AlbumCompleted(msg.sender, 2);
        }
    }

    function mintCard(uint8 cardNum) public {
        require(cardsByUser[msg.sender][cardNum] > 0, "No tienes esta carta");
        cardsByUser[msg.sender][cardNum]--;
        string memory uri = string(abi.encodePacked(bytes(baseUri), bytes("/"), bytes(toString(cardNum)), bytes(".json"))); // global variable / chequear createUri
        safeMint(msg.sender, uri, cardNum, 1);
    }
     
    function safeMint(address _to, string memory _uri, uint256 _number, uint8 _class) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        cards[tokenId].tokenId = tokenId;
        cards[tokenId].number = _number;
        cards[tokenId].class = _class;
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);
    }

    function receivePrizesBalance(uint256 amount) external onlyPacksContract {
        prizesBalance += amount;
    }

    // do not call unless really necessary
    function emergencyWithdraw(uint256 amount) public onlyOwner {
        require(balanceOf(address(this)) >= amount);
        prizesBalance -= amount;
        IERC20(DAI_TOKEN).transfer(msg.sender, amount);

        emit EmergencyWithdrawal(msg.sender, amount);
    }

    function changePackPrice(uint256 newPackPrice) external onlyPacksContract {
        packPrice = newPackPrice;
    }

    function setSigner(address newSigner) public onlyOwner {
        signer = newSigner;
        emit NewSigner(newSigner);
    }

    function setUris(string memory newMainUri, string memory newSecondaryUri) public onlyOwner {
        mainUri = newMainUri;
        secondaryUri = newSecondaryUri;
        emit NewUris(newMainUri, newSecondaryUri);
    }

    // function getCardsByUser(address owner) public view returns(uint256[] memory) {
    //     uint8[] memory userCards;
    //     for(uint256 i=0;i<122;i++){
    //         userCards.push(cardsByUser[owner][i]);
    //     }
    // }

    function getCardsByUser(address user) public view returns (uint8[] memory, uint8[] memory) {
        uint8[] memory cardNumbers = new uint8[](121);
        uint8[] memory amounts = new uint8[](121);
        uint8 index = 0;
        
        for (uint8 i = 1; i <= 120; i++) {
            if (cardsByUser[user][i] > 0) {
                cardNumbers[index] = i;
                amounts[index] = cardsByUser[user][i];
                index++;
            }
        }
        
        uint8[] memory userCardNumbers = new uint8[](index);
        uint8[] memory userAmounts = new uint8[](index);
        
        for (uint8 j = 0; j < index; j++) {
            userCardNumbers[j] = cardNumbers[j];
            userAmounts[j] = amounts[j];
        }
        
        return (userCardNumbers, userAmounts);
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

    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol#L15-L35

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}