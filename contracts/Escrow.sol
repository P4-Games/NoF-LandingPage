// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./GammaCardsV2.sol";

contract Escrow is Ownable{
    using SafeERC20 for IERC20;

    GammaCardsV2 public immutable gammaCardsContract;
    IERC20 public immutable DAI_TOKEN;
    uint256 public constant CARD_PRICE = 0.1e18; //0.1 DAI
    
    
    //Events that will be emited when trades are created, acepted or cancelled
    event TradeCreated(uint256 indexed tradeId, uint8 offeredCard, uint8[] wantedCards);
    event TradeAccepted(uint256 indexed tradeId, address indexed offeror, uint8 offeredCard, address indexed acceptor,  uint8 wantedCard);
    event TradeCancelled(uint256 indexed tradeId, uint8 offeredCard);
    event UpdateTradeIndex(uint256 oldIndex, uint256 newIndex);
    event SaleCreated(uint256 indexed saleId, uint8 offeredCard);
    event SaleCompleted(uint256 indexed saleId, address indexed seller, address indexed buyer, uint8 soldCard);
    event SaleCancelled(uint256 indexed saleId);
    event UpdateSaleIndex(uint256 oldIndex, uint256 newIndex);


    //Structs to store the trades and sales
    struct Trade {
        uint8 offeredCard;
        uint8[] wantedCards;
        address offeror;
        uint32 createdOn;
    }

    struct Sale {
        uint8 offeredCard;
        address seller;
        uint32 createdOn;
    }

    //Arrays to store trades and sales
    Trade [] public trades;
    Sale [] public sales;

    constructor (GammaCardsV2 _gammaCardsContract, address _daiTokenAddress) {
        gammaCardsContract = _gammaCardsContract;
        DAI_TOKEN = IERC20(_daiTokenAddress);
    }

    //Functions to manage trades
    function createTrade(uint8 _offeredCard, uint8[] memory _wantedCards) public {
        require(gammaCardsContract.cardsByUser(msg.sender, _offeredCard) > 0, "You don't own the card you are trying to trade");
        require(_wantedCards.length > 0, "You must ask for at least one card");
        require(_wantedCards.length < 11, "You can't ask for more than 10 cards");
        Trade memory _trade = Trade(_offeredCard, _wantedCards, msg.sender, uint32(block.timestamp));
        trades.push(_trade);
        emit TradeCreated(trades.length - 1, _offeredCard, _wantedCards);
    }

    function acceptTrade(uint256 _tradeId, uint8 _wantedCard) public {
        Trade memory _trade = trades[_tradeId];
        require(isCardWanted(_trade.wantedCards, _wantedCard), "You are not offering the card the offeror is asking for");
        updateTradeIndex(_tradeId);
        gammaCardsContract.transferFromEscrow(_trade.offeror, _trade.offeredCard, msg.sender, _wantedCard);
        emit TradeAccepted(_tradeId, _trade.offeror, _trade.offeredCard, msg.sender, _wantedCard);
    }

    function cancelTrade(uint256 _tradeId) public {
        Trade memory _trade = trades[_tradeId];
        require(_trade.offeror == msg.sender, "You are not the offeror of this trade");
        updateTradeIndex(_tradeId);
        emit TradeCancelled(_tradeId, _trade.offeredCard);
    }

    //Functions to manage sales
    function createSale(uint8 _offeredCard) public {
        require(gammaCardsContract.cardsByUser(msg.sender, _offeredCard) > 0, "You don't own the card you are trying to sell");
        Sale memory _sale = Sale(_offeredCard, msg.sender, uint32(block.timestamp));
        sales.push(_sale);
        emit SaleCreated(sales.length - 1, _offeredCard);
    }

    function buyCardForDAI(uint256 _saleId) public {
        Sale memory _sale = sales[_saleId];
        updateSaleIndex(_saleId);
        DAI_TOKEN.safeTransferFrom(msg.sender, _sale.seller, CARD_PRICE);
        gammaCardsContract.sendCard(_sale.seller, _sale.offeredCard, msg.sender);
        emit SaleCompleted(_saleId, _sale.seller, msg.sender, _sale.offeredCard);

    }

    function cancelSale(uint256 _saleId) public {
        Sale memory _sale = sales[_saleId];
        require(_sale.seller == msg.sender, "You are not the seller of this sale");
        updateSaleIndex(_saleId);
        emit SaleCancelled(_saleId);
    }

    //Auxiliar function to accept a trade
    function isCardWanted(uint8[] memory _wantedCards, uint8 _wantedCard) internal pure returns (bool) {
        for (uint i; i < _wantedCards.length; i++) {
            if(_wantedCards[i] == _wantedCard) {
                return true;
            }
        }
        return false;
    }

    function updateTradeIndex(uint256 index) internal {
        trades[index] = trades[trades.length - 1];
        trades.pop();
        emit UpdateTradeIndex(trades.length, index);
    }

    function updateSaleIndex(uint256 index) internal {
        sales[index] = sales[sales.length - 1];
        sales.pop();
        emit UpdateSaleIndex(sales.length, index);
    }


}