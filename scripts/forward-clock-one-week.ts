import { network } from 'hardhat'

async function main() {
    await network.provider.send('evm_increaseTime', [60 * 60 * 24 * 7])
    await network.provider.send('evm_mine')
}

main().catch((e) => {
    console.error(e)
    process.exitCode = 1
})
