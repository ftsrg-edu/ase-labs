import Contract from '../../../artifacts/contracts/SimpleAuction.sol/SimpleAuction.json'
type ContractType = import('../../../artifacts/contracts/SimpleAuction.sol/SimpleAuction').SimpleAuction$Type

export const SimpleAuction = Contract as ContractType
