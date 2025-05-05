// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

// https://eips.ethereum.org/EIPS/eip-721

import { IERC721 } from "@openzeppelin/contracts/interfaces/IERC721.sol";
import { IERC721Metadata } from "@openzeppelin/contracts/interfaces/IERC721Metadata.sol";
import { IERC721Receiver } from "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";

contract FtsrgNft is IERC721, IERC721Metadata {
	string public name;
	string public symbol;

	uint256 public nextTokenIdToMint;
	address public contractOwner;

	// token id => owner
	mapping(uint256 => address) internal _owners;
	// owner => token count
	mapping(address => uint256) internal _balances;
	// token id => approved address
	mapping(uint256 => address) internal _tokenApprovals;
	// owner => (operator => yes/no)
	mapping(address => mapping(address => bool)) internal _operatorApprovals;

	// Inherited
	// event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
	// event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
	// event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

	constructor(string memory _name, string memory _symbol) {
		name = _name;
		symbol = _symbol;
		nextTokenIdToMint = 0;
		contractOwner = msg.sender;
	}

	function balanceOf(address _owner) public view returns (uint256) {
		require(_owner != address(0), "!Add0");
		return _balances[_owner];
	}

	function ownerOf(uint256 _tokenId) public view returns (address) {
		return _owners[_tokenId];
	}

	// unsafe transfer
	function _transfer(address _from, address _to, uint256 _tokenId) internal {
		require(ownerOf(_tokenId) == _from, "!Owner");
		require(_to != address(0), "!ToAdd0");

		delete _tokenApprovals[_tokenId];
		_balances[_from] -= 1;
		_balances[_to] += 1;
		_owners[_tokenId] = _to;

		emit Transfer(_from, _to, _tokenId);
	}

	function _checkOnERC721Received(
		address from,
		address to,
		uint256 tokenId,
		bytes memory data
	) private returns (bool) {
		// check if to is an contract, if yes, to.code.length will always > 0
		if (to.code.length > 0) {
			try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 retval) {
				return retval == IERC721Receiver.onERC721Received.selector;
			} catch (bytes memory reason) {
				if (reason.length == 0) {
					revert("ERC721: transfer to non ERC721Receiver implementer");
				} else {
					/// @solidity memory-safe-assembly
					assembly {
						revert(add(32, reason), mload(reason))
					}
				}
			}
		} else {
			return true;
		}
	}

	function safeTransferFrom(address _from, address _to, uint256 _tokenId) public {
		safeTransferFrom(_from, _to, _tokenId, "");
	}

	function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory _data) public {
		require(
			ownerOf(_tokenId) == msg.sender ||
				_tokenApprovals[_tokenId] == msg.sender ||
				_operatorApprovals[ownerOf(_tokenId)][msg.sender],
			"!Auth"
		);
		_transfer(_from, _to, _tokenId);
		// trigger func check
		require(_checkOnERC721Received(_from, _to, _tokenId, _data), "!ERC721Implementer");
	}

	function transferFrom(address _from, address _to, uint256 _tokenId) public {
		// unsafe transfer without onERC721Received, used for contracts that dont implement
		require(
			ownerOf(_tokenId) == msg.sender ||
				_tokenApprovals[_tokenId] == msg.sender ||
				_operatorApprovals[ownerOf(_tokenId)][msg.sender],
			"!Auth"
		);
		_transfer(_from, _to, _tokenId);
	}

	function approve(address _approved, uint256 _tokenId) public {
		require(ownerOf(_tokenId) == msg.sender, "!Owner");
		_tokenApprovals[_tokenId] = _approved;
		emit Approval(ownerOf(_tokenId), _approved, _tokenId);
	}

	function setApprovalForAll(address _operator, bool _approved) public {
		_operatorApprovals[msg.sender][_operator] = _approved;
		emit ApprovalForAll(msg.sender, _operator, _approved);
	}

	function getApproved(uint256 _tokenId) public view returns (address) {
		return _tokenApprovals[_tokenId];
	}

	function isApprovedForAll(address _owner, address _operator) public view returns (bool) {
		return _operatorApprovals[_owner][_operator];
	}

	function mintTo(address _to) public {
		require(contractOwner == msg.sender, "!Auth");
		require(nextTokenIdToMint == 0, "!TooMany");
		_owners[nextTokenIdToMint] = _to;
		_balances[_to] += 1;
		emit Transfer(address(0), _to, nextTokenIdToMint);
		nextTokenIdToMint += 1;
	}

	function totalSupply() public view returns (uint256) {
		return nextTokenIdToMint;
	}

	function tokenURI(uint256) public pure returns (string memory) {
		return "http://localhost:5173/ftsrg-nft.json";
	}

	function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
		return interfaceID == type(IERC721).interfaceId || interfaceID == type(IERC721Metadata).interfaceId;
	}
}
