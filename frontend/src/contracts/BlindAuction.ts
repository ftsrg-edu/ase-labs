import Contract from '../../../artifacts/contracts/BlindAuction.sol/BlindAuction.json'
type ContractType = import('../../../artifacts/contracts/BlindAuction.sol/BlindAuction').BlindAuction$Type

export const BlindAuction = Contract as ContractType
