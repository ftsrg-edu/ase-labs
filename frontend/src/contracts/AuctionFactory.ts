import Contract from '../../../artifacts/contracts/AuctionFactory.sol/AuctionFactory.json'
type ContractType = import('../../../artifacts/contracts/AuctionFactory.sol/AuctionFactory').AuctionFactory$Type

export const AuctionFactory = Contract as ContractType
