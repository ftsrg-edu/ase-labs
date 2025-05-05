import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'
import FtsrgNftModule from './FtsrgNft'
import AuctionFactoryModule from './AuctionFactory'

const SystemModule = buildModule('SystemModule', (m) => {
    return {}
})

export default SystemModule
