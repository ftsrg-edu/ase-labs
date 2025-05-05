import { useCallback, useEffect, useState } from 'react'
import useNetwork from './useNetwork'
import { createPublicClient, custom } from 'viem'

export default function useLastBlockNumberStore() {
    const [network] = useNetwork()

    const [lastBlockNumber, setLastBlockNumber] = useState(null as bigint | null)

    const loadLastBlockNumber = useCallback(async () => {
        let currentLastBlockNumber = null as bigint | null
        if (network) {
            const publicClient = createPublicClient({
                chain: network.chain,
                transport: custom(window.ethereum!)
            })

            const block = await publicClient.getBlock()
            currentLastBlockNumber = block.number
        }

        const lastBlockNumberString = window.localStorage.getItem('lastBlockNumber')
        const lastBlockNumber = lastBlockNumberString ? BigInt(lastBlockNumberString) : null

        // No network
        if (currentLastBlockNumber === null) {
            setLastBlockNumber(null)
        }
        // No previous value was set
        else if (lastBlockNumber === null) {
            setLastBlockNumber(currentLastBlockNumber)
            window.localStorage.setItem('lastBlockNumber', currentLastBlockNumber.toString())
        }
        // New block
        else if (lastBlockNumber <= currentLastBlockNumber) {
            setLastBlockNumber(currentLastBlockNumber)
            window.localStorage.setItem('lastBlockNumber', currentLastBlockNumber.toString())
        }
        // Network was reset
        else {
            window.localStorage.clear()
            setLastBlockNumber(currentLastBlockNumber)
            window.localStorage.setItem('lastBlockNumber', currentLastBlockNumber.toString())
        }
    }, [network])

    useEffect(() => {
        loadLastBlockNumber()
    }, [loadLastBlockNumber])

    return lastBlockNumber
}
