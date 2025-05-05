import { useCallback, useEffect, useState } from 'react'
import { INetwork } from '../networks/Deployment'
import { HardhatNetwork } from '../networks/HardhatNetwork'

const Networks = [HardhatNetwork]

export default function useNetwork() {
    // The selected network
    const [network, setNetwork] = useState(null as INetwork | null)

    const [loading, setLoading] = useState(true)

    // BEGIN TODO: network
    // Handle when the user changes the network
    const changeNetwork = useCallback(async (chainId: string) => {
        const network = Networks.find((network) => chainId === `0x${network.chain.id.toString(16)}`) ?? null
        setNetwork(network)
        setLoading(false)
    }, [])

    // Register the event to recognize when the user changed the network
    useEffect(() => {
        window.ethereum?.on('chainChanged', changeNetwork)

        return () => {
            window.ethereum?.removeListener('chainChanged', changeNetwork)
        }
    }, [changeNetwork])

    // Initialize the network
    const initializeNetwork = useCallback(async () => {
        setLoading(true)
        if (!window.ethereum) {
            setNetwork(null)
            setLoading(false)
        }

        // We check the network
        const chainId = await window.ethereum!.request({ method: 'eth_chainId' })
        await changeNetwork(chainId)
    }, [changeNetwork])
    // END TODO: network

    // First initialize the network
    useEffect(() => {
        initializeNetwork()
    }, [initializeNetwork])

    return [network, loading] as const
}
