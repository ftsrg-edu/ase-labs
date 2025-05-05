// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.4;

import { IERC721 } from "@openzeppelin/contracts/interfaces/IERC721.sol";
import { IERC721Receiver } from "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";

contract BlindAuction {
	address payable public beneficiary;
	uint public biddingEnd;
	uint public revealEnd;
	address public tokenAddress;
	uint256 public tokenId;

	address public highestBidder;
	uint public highestBid;

	mapping(address => uint) pendingReturns;

	bool public ended;

	// NEW: Struct for storing the hashed bid and the deposit
	struct Bid {
		bytes32 blindedBid;
		uint deposit;
	}
	// NEW: Mapping for storing the bids of each address
	mapping(address => Bid[]) public bids;

	// NEW: A bid has been received from `sender` with `blindedBid` hash value and `deposit` amount of Ether.
	event BidReceived(address sender, bytes32 blindedBid, uint deposit);
	// NEW: A bid has been revealed by `sender` with `blindedBid` hash value, `fake` flag and `value` amount of Ether.
	event RevealedBid(address sender, bytes32 blindedBid, bool fake, uint value);
	event AuctionEnded(address winner, uint highestBid);

	error TooEarly(uint time);
	error TooLate(uint time);
	error AuctionEndAlreadyCalled();

	modifier onlyBefore(uint time) {
		if (block.timestamp >= time) revert TooLate(time);
		_;
	}
	modifier onlyAfter(uint time) {
		if (block.timestamp <= time) revert TooEarly(time);
		_;
	}

	// NEW: revealEnd is the end of the reveal period, tokenAddress and tokenId are parameters of the NFT.
	constructor(
		uint _biddingEnd,
		uint _revealEnd,
		address payable _beneficiary,
		address _tokenAddress,
		uint256 _tokenId
	) {
		beneficiary = _beneficiary;
		biddingEnd = _biddingEnd;
		revealEnd = _revealEnd;
		tokenAddress = _tokenAddress;
		tokenId = _tokenId;
	}

	/// NEW: Place a blinded bid with `blindedBid` =
	/// keccak256(abi.encodePacked(value, fake, secret)).
	/// The sent ether is only refunded if the bid is correctly
	/// revealed in the revealing phase. The bid is valid if the
	/// ether sent together with the bid is at least "value" and
	/// "fake" is not true. Setting "fake" to true and sending
	/// not the exact amount are ways to hide the real bid but
	/// still make the required deposit. The same address can
	/// place multiple bids.
	function bid(bytes32 blindedBid) external payable onlyBefore(biddingEnd) {
		// TODO
	}

	/// NEW: Reveal your blinded bids. You will get a refund for all
	/// correctly blinded invalid bids and for all bids except for
	/// the totally highest.
	function reveal(
		uint[] calldata values,
		bool[] calldata fakes,
		bytes32[] calldata secrets
	) external onlyAfter(biddingEnd) onlyBefore(revealEnd) {
		uint length = bids[msg.sender].length;
		require(values.length == length);
		require(fakes.length == length);
		require(secrets.length == length);

		uint refund;
		for (uint i = 0; i < length; i++) {
			// TODO process bids
		}
		payable(msg.sender).transfer(refund);
	}

	function withdraw() external {
		uint amount = pendingReturns[msg.sender];
		if (amount > 0) {
			pendingReturns[msg.sender] = 0;

			payable(msg.sender).transfer(amount);
		}
	}

	function auctionEnd() external onlyAfter(revealEnd) {
		if (ended) revert AuctionEndAlreadyCalled();

		ended = true;
		beneficiary.transfer(highestBid);

		emit AuctionEnded(highestBidder, highestBid);
	}

	// NEW: The bid function was transformed into an internal function that will be called from the reveal function.
	// This is an "internal" function which means that it
	// can only be called from the contract itself (or from
	// derived contracts).
	function placeBid(address bidder, uint value) internal returns (bool success) {
		if (value <= highestBid) {
			return false;
		}

		pendingReturns[highestBidder] += highestBid;

		highestBid = value;
		highestBidder = bidder;
		return true;
	}

	/// Returns whether the auction has been funded (the NFT has been transferred to the contract).
	function funded() public view returns (bool success) {
		// TODO
		return false;
	}

	/// Handle the receiving NFT tokens
	function onERC721Received(address, address, uint256 _tokenId, bytes calldata) external view returns (bytes4) {
		// TODO
		return IERC721Receiver.onERC721Received.selector;
	}
}
