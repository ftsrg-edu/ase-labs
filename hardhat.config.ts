import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox-viem'
import 'hardhat-chai-matchers-viem'

const config: HardhatUserConfig = {
    solidity: '0.8.27',
    networks: {}
}

export default config
