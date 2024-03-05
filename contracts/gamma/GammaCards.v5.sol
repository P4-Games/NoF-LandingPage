// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {LibStringUtils} from "./libs/LibStringUtils.sol";
import {LibPackVerifier} from "./libs/LibPackVerifier.sol";
import {LibControlMgmt} from "./libs/LibControlMgmt.sol";
import {console} from "hardhat/console.sol";
import {NofGammaCardsNFTV1} from "./GammaCardsNFT.v1.sol";

error OnlyGammaPacksContract();
error OnlyOffersContract();
error OnlyOwners();
error InvalidAddress();
error InvalidCardNumber();
error InvalidTransfer();
error InvalidSignature();
error IncorrectPrizeAmount();
error WrongPacksQuantity();
error NotYourPack();
error CardLimitExceeded();
error UserDoesNotHaveCardOrAlbum();
error InsufficientFunds();
error InsufficientCards();
error MustCompleteAlbum();
error CannotRemoveUserOffers();

interface IgammaPacksContract {
  function getPackOwner(uint256 tokenId) external view returns (address);

  function openPack(uint256 tokenId, address owner) external;

  function openPacks(uint256[] memory tokenIds, address owner) external;
}

interface IgammaOffersContract {
  function hasOffer(address user, uint8 cardNumber) external view returns (bool);

  function removeOffersByUser(address user) external returns (bool);

  function getOffersByUserCounter(address user) external view returns (uint256);

  function getOfferByUserAndCardNumber(
    address user,
    uint8 cardNumber
  ) external view returns (uint256, uint8, uint8[] memory, address);
}

interface IgammaTicketsContract {
  function generateTicket(address user) external;
}

contract NofGammaCardsV5 is NofGammaCardsNFTV1, Ownable {
  using LibStringUtils for uint8;
  using LibControlMgmt for LibControlMgmt.Data;

  IgammaPacksContract public gammaPacksContract;
  IgammaOffersContract public gammaOffersContract;
  IgammaTicketsContract public gammaTicketsContract;

  LibControlMgmt.Data private ownersData;
  LibControlMgmt.Data private signersData;

  uint8 public s_maxPacksToOpenAtOnce = 10;
  uint8 public s_lotteryPrizePercentage = 50;
  address public DAI_TOKEN;
  uint256 public s_tokenIdCounter;
  uint256 public s_packPrice = 12e17; // 1.2 DAI
  uint256 public s_prizesBalance = 0;
  uint256 public s_mainAlbumPrize = 15e18; // 15 DAI por album principal completado
  uint256 public s_secondaryAlbumPrize = 1e18; // 1 DAI por album secundario completado
  string public s_mainUri;
  string public s_secondaryUri;
  string public s_baseUri;
  bool public s_requireOpenPackSignerValidation;
  bool public s_requireOfferValidationInMint = true;
  bool public s_requireOfferValidationInTransfer = true;

  struct Card {
    uint256 tokenId;
    uint256 number;
    bool pasted;
    uint8 class; // 1 para cartas, 2 para album de 120, 3 para album de 60
    uint256 completion; // solo se modifica en el caso de los albums
  }

  mapping(uint256 tokenId => Card) public s_cards;
  mapping(uint256 cardNumber => uint256 amount) public s_cardsInventory; // maximos: 120 => 5000
  mapping(address user => uint256 amount) public s_burnedCards;
  mapping(address user => mapping(uint8 cardNumber => uint8 amount)) public s_cardsByUser;

  event NewGammaOffersContract(address indexed newGammaOffersContract);
  event NewGammaPacksContract(address indexed newGammaPacksContract);
  event NewGammaTicketsContract(address indexed newGammaTicketContract);
  event PackOpened(address indexed player, uint8[] indexed packData, uint256 indexed packNumber);
  event AlbumCompleted(address indexed player, uint8 indexed albumClass);
  event CardPasted(address indexed player, uint256 indexed cardTokenId, uint256 indexed albumTokenId);
  event EmergencyWithdrawal(address indexed receiver, uint256 indexed amount);
  event NewSigner(address indexed newSigner);
  event NewUris(string indexed newMainUri, string indexed newSecondaryUri);
  event OfferCardsExchanged(address indexed from, address indexed to, uint8 cardNumberFrom, uint8 cardNumberTo);
  event CardTransfered(address indexed from, address indexed to, uint8 cardNumber);
  event CardsTransfered(address indexed from, address indexed to, uint8[] indexed cardNumber);
  event CardsBurned(address indexed user, uint8[] indexed cardsNumber);

  modifier onlyGammaPacksContract() {
    if(msg.sender != address(gammaPacksContract)) revert OnlyGammaPacksContract();
    _;
  }

  modifier onlyGammaOffersContract() {
    if(msg.sender != address(gammaOffersContract)) revert OnlyOffersContract();
    _;
  }

  modifier onlyOwners() {
    if(!ownersData.owners[msg.sender]) revert OnlyOwners();
    _;
  }

  modifier checkAddressZero(address _address) {
    if(_address == address(0)) revert InvalidAddress();
    _;
  }

  constructor (
    address _daiTokenAddress,
    address _gammaPacksContract,
    address _gammaOffersContract,
    address _gammaTicketsContract,
    string memory _baseUri,
    address _signer
  ) Ownable(msg.sender) {
    ownersData.owners[msg.sender] = true;

    DAI_TOKEN = _daiTokenAddress;
    gammaPacksContract = IgammaPacksContract(_gammaPacksContract);
    gammaTicketsContract = IgammaTicketsContract(_gammaTicketsContract);
    gammaOffersContract = IgammaOffersContract(_gammaOffersContract);

    s_baseUri = _baseUri;
    s_mainUri = string(abi.encodePacked(bytes(s_baseUri), bytes("/"), bytes("120"), bytes("F.json")));
    s_secondaryUri = string(
      abi.encodePacked(bytes(s_baseUri), bytes("/"), bytes("121"), bytes("F.json"))
    );
    signersData.signers[_signer] = true;

    for (uint256 i; i < 122; i++) {
      s_cardsInventory[i] = 1;
    }
  }

  function addOwner(address _newOwner) external onlyOwners {
    ownersData.addOwner(_newOwner);
  }

  function removeOwner(address _ownerToRemove) external onlyOwners {
    ownersData.removeOwner(_ownerToRemove);
  }

  function addSigner(address _newSigner) external onlyOwners {
    signersData.addSigner(_newSigner);
  }

  function removeSigner(address _signerToRemove) external onlyOwners {
    signersData.removeSigner(_signerToRemove);
  }

  function setGammaOffersContract(address _gammaOffersContract) external onlyOwners checkAddressZero(_gammaOffersContract) {
    gammaOffersContract = IgammaOffersContract(_gammaOffersContract);
    emit NewGammaOffersContract(_gammaOffersContract);
  }

  function setGammaPacksContract(address _gammaPacksContract) external onlyOwners checkAddressZero(_gammaPacksContract){
    gammaPacksContract = IgammaPacksContract(_gammaPacksContract);
    emit NewGammaPacksContract(_gammaPacksContract);
  }

  function setGammaTicketsContract(address _gammaTicketsContract) external onlyOwners checkAddressZero(_gammaTicketsContract){
    gammaTicketsContract = IgammaTicketsContract(_gammaTicketsContract);
    emit NewGammaTicketsContract(_gammaTicketsContract);
  }

  function setPrizesBalance(uint256 amount) external onlyGammaPacksContract {
    s_prizesBalance += amount;
  }

  function setMainAlbumPrize(uint256 amount) external onlyOwners {
    if(amount == 0) revert IncorrectPrizeAmount();
    s_mainAlbumPrize = amount;
  }

  function setSecondaryAlbumPrize(uint256 amount) external onlyOwners {
    if(amount == 0) revert IncorrectPrizeAmount();
    s_secondaryAlbumPrize = amount;
  }

  function setLotteryPrizePercentage(uint8 amount) external onlyOwners {
    if(amount > 100) revert IncorrectPrizeAmount();
    s_lotteryPrizePercentage = amount;
  }

  function setUris(string memory newMainUri, string memory newSecondaryUri) external onlyOwners {
    s_mainUri = newMainUri;
    s_secondaryUri = newSecondaryUri;
    emit NewUris(newMainUri, newSecondaryUri);
  }

  function changeRequireOpenPackSignerValidation(bool required) external onlyOwners {
    s_requireOpenPackSignerValidation = required;
  }

  function changeRequireOfferValidationInMint(bool required) external onlyOwners {
    s_requireOfferValidationInMint = required;
  }

  function changeRequireOfferValidationInTransfer(bool required) external onlyOwners {
    s_requireOfferValidationInTransfer = required;
  }

  function changePackPrice(uint256 newPackPrice) external onlyGammaPacksContract {
    s_packPrice = newPackPrice;
  }

  function changeMaxPacksToOpenAtOnce(uint8 _maxPacksToOpenAtOnce) external onlyOwners {
    s_maxPacksToOpenAtOnce = _maxPacksToOpenAtOnce;
  }

  function removeCardByOffer(address user, uint8 cardNumber) external onlyGammaOffersContract {
    s_cardsByUser[user][cardNumber]--;
  }

  function restoreCardByOffer(address user, uint8 cardNumber) external onlyGammaOffersContract {
    s_cardsByUser[user][cardNumber]++;
  }

  function hasCardByOffer(
    address user,
    uint8 cardNumber
  ) external view onlyGammaOffersContract returns (bool has) {
    return s_cardsByUser[user][cardNumber] > 0;
  }

  function hasCard(address user, uint8 cardNum) public view checkAddressZero(user) returns (bool has) {
    return s_cardsByUser[user][cardNum] > 0;
  }

  function isOwner(address user) external view returns (bool) {
    return ownersData.owners[user];
  }

  function isSigner(address user) external view returns (bool) {
    return signersData.signers[user];
  }

  function getLotteryPrize() public view returns (uint256) {
    return (s_lotteryPrizePercentage * s_prizesBalance) / 100;
  }

  function getCardQuantityByUser(address user, uint8 cardNum) public view checkAddressZero(user) returns (uint8) {
    return s_cardsByUser[user][cardNum];
  }

  function getBurnedCardQttyByUser(address user) public view checkAddressZero(user) returns (uint256) {
    return s_burnedCards[user];
  }

  function getCardsByUser(
    address user
  ) public view returns (uint8[] memory, uint8[] memory, bool[] memory) {
    uint8[] memory cardNumbers = new uint8[](122);
    uint8[] memory quantities = new uint8[](122);
    bool[] memory offers = new bool[](122);
    uint8 index = 0;

    for (uint8 i; i <= 121; i++) {
      if (s_cardsByUser[user][i] > 0) {
        cardNumbers[index] = i;
        quantities[index] = s_cardsByUser[user][i];
        offers[index] = gammaOffersContract.hasOffer(user, i);
        index++;
      }
    }

    uint8[] memory userCardNumbers = new uint8[](index);
    uint8[] memory userCardsQtty = new uint8[](index);
    bool[] memory userCardsOffers = new bool[](index);

    for (uint256 j; j < index; j++) {
      userCardNumbers[j] = cardNumbers[j];
      userCardsQtty[j] = quantities[j];
      userCardsOffers[j] = offers[j];
    }

    return (userCardNumbers, userCardsQtty, userCardsOffers);
  }

  function verifyPackSigner(
    uint256 packNumber,
    uint8[] memory packData,
    bytes calldata signature
  ) public view returns (address signer) {
    return LibPackVerifier.verifyPackSigner(msg.sender, packNumber, packData, signature);
  }

  function openPack(
    uint256 packNumber,
    uint8[] memory packData,
    bytes calldata signature
  ) external {
    _openPack(msg.sender, packNumber, packData, signature);
  }

  function openPacks(
    uint8 packsQuantity,
    uint256[] memory packsNumber,
    uint8[][] memory packsData,
    bytes[] calldata signatures
  ) external {
    if(packsQuantity == 0 || packsQuantity > s_maxPacksToOpenAtOnce) revert WrongPacksQuantity();

    for (uint256 i; i < packsQuantity; i++) {
      _openPack(msg.sender, packsNumber[i], packsData[i], signatures[i]);
    }
  }

  function _openPack(
    address user,
    uint256 packNumber,
    uint8[] memory packData,
    bytes calldata signature
  ) private {
    if(gammaPacksContract.getPackOwner(packNumber) != user) revert NotYourPack(); // @tomas read storage in packs
    if(packData.length >= 15) revert CardLimitExceeded();

    if (s_requireOpenPackSignerValidation) { // @tomas read storage
      // Recreates the message present in the `signature`
      address signer = LibPackVerifier.verifyPackSigner(
        msg.sender,
        packNumber,
        packData,
        signature
      );
      
      if(!signersData.signers[signer]) revert InvalidSignature();
    }

    gammaPacksContract.openPack(packNumber, user); // @tomas read storage in packs
    s_prizesBalance += s_packPrice - s_packPrice / 6; // @tomas read storage

    
    for (uint256 i; i < packData.length;) {
      if(packData[i] == 120){
        if(s_cardsInventory[120] > 3000) revert InvalidCardNumber();
      } else {
        if(s_cardsInventory[packData[i]] > 5000) revert InvalidCardNumber();
      }
      s_cardsInventory[packData[i]]++; // @tomas modify storage / 280k gas aprox.
      s_cardsByUser[user][packData[i]]++; // @tomas modify storage / 310k gas aprox.
      unchecked {
        i++;
      }
    }

    emit PackOpened(user, packData, packNumber);
  }

  function exchangeCardsOffer(
    address from,
    uint8 cardNumberFrom,
    address to,
    uint8 cardNumberTo
  ) external onlyGammaOffersContract checkAddressZero(from) checkAddressZero(to) {
    if(s_cardsByUser[from][cardNumberFrom] == 0 || s_cardsByUser[to][cardNumberTo] == 0) revert UserDoesNotHaveCardOrAlbum();

    s_cardsByUser[from][cardNumberFrom]--;
    s_cardsByUser[to][cardNumberFrom]++;
    s_cardsByUser[to][cardNumberTo]--;
    s_cardsByUser[from][cardNumberTo]++;

    emit OfferCardsExchanged(from, to, cardNumberFrom, cardNumberTo);
  }

  function transferCard(address to, uint8 cardNumber) external checkAddressZero(to) {
    if(s_cardsByUser[msg.sender][cardNumber] == 0) revert UserDoesNotHaveCardOrAlbum();
    if(to == msg.sender) revert InvalidTransfer();

    if (s_requireOfferValidationInTransfer) {
      bool hasOffer = gammaOffersContract.hasOffer(msg.sender, cardNumber);
      bool hasMoreThanOne = s_cardsByUser[msg.sender][cardNumber] > 1;
      /* 
            The user can only make an offer for one letter and in that case he cannot mint or transfer it.
            If you have more than one copy (quantity > 1) of that card, you must be able to mint 
            or transfer the rest.
            */
      require(!hasOffer || hasMoreThanOne, "This card has an offer.");
    }

    s_cardsByUser[msg.sender][cardNumber]--;
    s_cardsByUser[to][cardNumber]++;
    emit CardTransfered(msg.sender, to, cardNumber);
  }

  function transferCards(address to, uint8[] calldata cardNumbers) public checkAddressZero(to) {
    if(to == msg.sender) revert InvalidTransfer();

    for (uint256 i; i < cardNumbers.length; i++) {
      if(s_cardsByUser[msg.sender][cardNumbers[i]] == 0) revert UserDoesNotHaveCardOrAlbum();
      s_cardsByUser[msg.sender][cardNumbers[i]]--;
      s_cardsByUser[to][cardNumbers[i]]++;

      if (s_requireOfferValidationInTransfer) {
        bool hasOffer = gammaOffersContract.hasOffer(msg.sender, cardNumbers[i]);
        bool hasMoreThanOne = s_cardsByUser[msg.sender][cardNumbers[i]] > 1;
        /* 
                The user can only make an offer for one letter and in that case he cannot mint or transfer it.
                If you have more than one copy (quantity > 1) of that card, you must be able to mint 
                or transfer the rest.
                */
        require(!hasOffer || hasMoreThanOne, "This card has an offer.");
      }
    }
    emit CardsTransfered(msg.sender, to, cardNumbers);
  }

  // user must call this function when they have at least 1
  // card of each number (120 total) + a 120 album card
  function finishAlbum() public returns (bool) {
    // requires the user to have at least one 120 album
    if(s_cardsByUser[msg.sender][120] == 0) revert UserDoesNotHaveCardOrAlbum();
    if(s_prizesBalance < s_mainAlbumPrize) revert IncorrectPrizeAmount();

    uint256 contractBalance = IERC20(DAI_TOKEN).balanceOf(address(this));
    if(contractBalance < s_mainAlbumPrize) revert InsufficientFunds();

    // check that you have at least one card of each number
    bool unfinished;
    
    for (uint8 i; i <= 120;) {
      if (s_cardsByUser[msg.sender][i] == 0) {
        unfinished = true;
        break;
      }
      s_cardsByUser[msg.sender][i]--;
      unchecked {
        i++;
      }
    }
    if(unfinished) revert MustCompleteAlbum();

    // mint the completed album.
    safeMint(msg.sender, s_mainUri, 120, 2);

    // transfer prize in DAI.
    IERC20(DAI_TOKEN).transfer(msg.sender, s_mainAlbumPrize);
    s_prizesBalance -= s_mainAlbumPrize;

    bool userOffersRemoved = gammaOffersContract.removeOffersByUser(msg.sender);
    if(!userOffersRemoved) revert CannotRemoveUserOffers();

    emit AlbumCompleted(msg.sender, 1);
    return true;
  }

  // user should call this function if they want to 'paste' selected cards in
  // the 60 cards album to 'burn' them.
  function burnCards(uint8[] calldata cardNumbers) public {
    if(s_cardsByUser[msg.sender][121] == 0) revert UserDoesNotHaveCardOrAlbum();
    uint256 totalUserBurnedCards = s_burnedCards[msg.sender] + cardNumbers.length;
    bool mustPayPrize;

    if (totalUserBurnedCards >= 60) {
      uint256 contractBalance = IERC20(DAI_TOKEN).balanceOf(address(this));
      if(contractBalance < s_secondaryAlbumPrize || s_prizesBalance < s_secondaryAlbumPrize) revert InsufficientFunds();
      mustPayPrize = true;
    }

    bool userHasOffers = (gammaOffersContract.getOffersByUserCounter(msg.sender) > 0);
    uint256 cardNumbersLength = cardNumbers.length;
    for (uint256 i; i < cardNumbersLength;) {
      if(s_cardsByUser[msg.sender][cardNumbers[i]] == 0) revert UserDoesNotHaveCardOrAlbum();
      if (userHasOffers) {
        if (gammaOffersContract.hasOffer(msg.sender, cardNumbers[i])) {
          if(s_cardsByUser[msg.sender][cardNumbers[i]] < 2) revert InsufficientCards();
        }
      }
      s_cardsByUser[msg.sender][cardNumbers[i]]--;
      unchecked {
        i++;
      }
    }

    s_burnedCards[msg.sender] += cardNumbersLength;
    emit CardsBurned(msg.sender, cardNumbers);

    if (mustPayPrize) {
      s_cardsByUser[msg.sender][121]--;
      safeMint(msg.sender, s_secondaryUri, 121, 2); // mint album of 60 cards.

      s_prizesBalance -= s_secondaryAlbumPrize;
      IERC20(DAI_TOKEN).transfer(msg.sender, s_secondaryAlbumPrize);

      gammaTicketsContract.generateTicket(msg.sender);
      emit AlbumCompleted(msg.sender, 2);
    }
  }

  function mintCard(uint8 cardNum) public {
    if(s_cardsByUser[msg.sender][cardNum] == 0) revert UserDoesNotHaveCardOrAlbum();

    if (s_requireOfferValidationInMint) {
      bool hasOffer = gammaOffersContract.hasOffer(msg.sender, cardNum);
      bool hasMoreThanOne = s_cardsByUser[msg.sender][cardNum] > 1;
      /* 
            The user can only make an offer for one letter and in that case he cannot mint or transfer it.
            If you have more than one copy (quantity > 1) of that card, you must be able to mint 
            or transfer the rest.
            */
      require(!hasOffer || hasMoreThanOne, "This card has an offer.");
    }

    s_cardsByUser[msg.sender][cardNum]--;

    string memory uri = string(
      abi.encodePacked(bytes(s_baseUri), bytes("/"), bytes(cardNum.toString()), bytes(".json"))
    );

    safeMint(msg.sender, uri, cardNum, 1);
  }

  function safeMint(address _to, string memory _uri, uint256 _number, uint8 _class) internal {
    uint256 tokenId = s_tokenIdCounter;
    s_cards[tokenId].tokenId = tokenId;
    s_cards[tokenId].number = _number;
    s_cards[tokenId].class = _class;
    _safeMint(_to, tokenId);
    _setTokenURI(tokenId, _uri);
    s_tokenIdCounter += 1;
  }

  // do not call unless really necessary
  function emergencyWithdraw(uint256 amount) public onlyOwners {
    if(balanceOf(address(this)) < amount) revert InsufficientFunds();
    s_prizesBalance -= amount;
    IERC20(DAI_TOKEN).transfer(msg.sender, amount);
    emit EmergencyWithdrawal(msg.sender, amount);
  }




  // for testing purposes only, will remove on deploy
  function testAddCards(address user) public onlyOwners {
      for(uint8 i; i<=121; i++){ // 0-119: cards, 120: album-120, 121: album-60
          s_cardsByUser[user][i]++;
      }
  }

  function testOpenPack(address user, uint256 packNumber, uint8[] memory packData) external onlyOwners {
        gammaPacksContract.openPack(packNumber, user);
        s_prizesBalance += s_packPrice - s_packPrice / 6;

        for(uint256 i; i<packData.length; i++){
            require(packData[i] == 120 ? s_cardsInventory[120] < 3001 : s_cardsInventory[packData[i]] < 5001, 
                'invalid cardInventory position');
            s_cardsInventory[packData[i]]++; // 280k gas aprox.
            s_cardsByUser[user][packData[i]]++; // 310k gas aprox.
        }
    }
  // for testing purposes only, will remove on deploy
}
