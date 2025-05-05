// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.4;

import "./SimpleAuction.sol";
import "./BlindAuction.sol";

contract AuctionFactory {
	address[] public simpleAuctions;
	address[] public blindAuctions;

	function createSimpleAuction(
		uint biddingTime,
		address payable beneficiaryAddress,
		address tokenAddress,
		uint256 tokenId
	) public returns (address) {
		// TODO create and store a SimpleAuction
	}

	function createBlindAuction(
		uint biddingTime,
		uint revealTime,
		address payable beneficiaryAddress,
		address tokenAddress,
		uint256 tokenId
	) public returns (address) {
		// TODO create and store a BlindAction
	}
}
