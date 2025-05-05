import { hardhat } from 'viem/chains'
import HardhatDeployedAddressses from '../../../ignition/deployments/chain-31337/deployed_addresses.json'
import { getDeploymentAddress, INetwork } from './Deployment'

export const HardhatNetwork: INetwork = {
    addresses: {
        auctionFactory: getDeploymentAddress(HardhatDeployedAddressses, 'AuctionFactoryModule#AuctionFactory')
    },
    chain: hardhat
}
