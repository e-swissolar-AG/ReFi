// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTRegister is ReentrancyGuard { //<- NFTMarket
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;

  address payable owner;
  uint256 listingPrice = 0.025 ether;

  constructor() {
    owner = payable(msg.sender);
  }

  struct RegisterItem { //<- MarketItem
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => RegisterItem) private idToRegisterItem; //<-MarketItem/idTomarketItem

 //MarketItemCreated 
  event RegisterItemCreated ( 
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );

  /* Returns the listing price of the contract */
  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }
  
  /* Places an item for sale on the marketplace */
  //createMarketItem
  function createRegisterItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();
  
    //idToMarketItem
    idToRegisterItem[itemId] =  RegisterItem( //MarketItem
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit RegisterItemCreated( //MarketItemCreated
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false
    );
  }

  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createRegisterSale( //createMarketSale
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    uint price = idToRegisterItem[itemId].price; //idToMarketItem
    uint tokenId = idToRegisterItem[itemId].tokenId; //idToMarketItem
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");

    idToRegisterItem[itemId].seller.transfer(msg.value); //idToMarketItem
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToRegisterItem[itemId].owner = payable(msg.sender); //idToMarketItem
    idToRegisterItem[itemId].sold = true; //idToMarketItem
    _itemsSold.increment();
    payable(owner).transfer(listingPrice);
  }

  /* Returns all unsold market items */
  function fetchRegisterItems() public view returns (RegisterItem[] memory) { //FetchMarketItems/RegisterItem
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    RegisterItem[] memory items = new RegisterItem[](unsoldItemCount); //MarketItem
    for (uint i = 0; i < itemCount; i++) {
      if (idToRegisterItem[i + 1].owner == address(0)) { //idToMarketItem
        uint currentId = i + 1;
        RegisterItem storage currentItem = idToRegisterItem[currentId]; //MarketItem/idToMarketItem
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns onlyl items that a user has purchased */
  function fetchMyNFTs() public view returns (RegisterItem[] memory) { //MarketItem
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToRegisterItem[i + 1].owner == msg.sender) { //idToMarketItem
        itemCount += 1;
      }
    }

    RegisterItem[] memory items = new RegisterItem[](itemCount); //MarketItem
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToRegisterItem[i + 1].owner == msg.sender) { //idToMarketItem
        uint currentId = i + 1;
        RegisterItem storage currentItem = idToRegisterItem[currentId]; //MarketItem/idToMarketItem
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (RegisterItem[] memory) { //MarketItem
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToRegisterItem[i + 1].seller == msg.sender) { //idToMarketItem
        itemCount += 1;
      }
    }

    RegisterItem[] memory items = new RegisterItem[](itemCount); //MarketItem
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToRegisterItem[i + 1].seller == msg.sender) { //idToMarketItem
        uint currentId = i + 1;
        RegisterItem storage currentItem = idToRegisterItem[currentId]; //MarketItem/idToMarketItem
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }
}