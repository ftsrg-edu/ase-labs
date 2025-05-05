// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.4;

import { IERC721 } from "@openzeppelin/contracts/interfaces/IERC721.sol";
import { IERC721Receiver } from "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";

contract SimpleAuction is IERC721Receiver {
	// Parameters of the auction.
	address payable public beneficiary;
	// TODO add auction parameters here

	// Current state of the auction.
	address public highestBidder;
	uint public highestBid;
	// TODO add state variables here

	bool public ended;

	// Events that will be emitted on changes.
	// TODO add events here

	// Errors that describe failures.
	// TODO add errors here

	// Modifiers
	// TODO add modifiers here

	/// Create a simple auction that ends at `_biddingEnd`
	/// on behalf of the beneficiary address `_beneficiary`.
	constructor(uint _biddingEnd, address payable _beneficiary) {
		// TODO store the beneficiary address
		// TODO store when the bidding ends
	}

	/// Bid on the auction with the value sent
	/// together with this transaction.
	/// The value will only be refunded if the
	/// auction is not won.
	function bid() external payable {
		// TODO
	}

	/// Withdraw a bid that was overbid.
	function withdraw() external {
		// TODO
	}

	/// End the auction and send the highest bid
	/// to the beneficiary.
	function auctionEnd() external {
		// TODO
	}

	/// Handle the receiving NFT tokens
	function onERC721Received(address, address, uint256 _tokenId, bytes calldata) external view returns (bytes4) {
		// TODO
	}
}
