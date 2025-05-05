import { useState, useCallback, useEffect } from 'react'
import { WalletClient, Address, createWalletClient, custom, Transport, Chain, Account, RpcSchema } from 'viem'
import useNetwork from './useNetwork'

export default function useClient() {
    // Viem Client
    const [client, setClient] = useState(null as WalletClient<Transport, Chain, Account, RpcSchema> | null)

    const [loading, setLoading] = useState(true)

    const [network] = useNetwork()

    // BEGIN TODO: user
    // Handle when the user changes the account
    const changeUser = useCallback(
        async ([userAddress]: (Address | undefined)[]) => {
            // Check if the selected account exists (and we have permission to access it)
            if (!network || !userAddress) {
                setClient(null)
                setLoading(false)
                return
            }

            // We first initialize viem by creating a wallet client using window.ethereum
            const client = createWalletClient({
                account: userAddress,
                chain: network.chain,
                transport: custom(window.ethereum!)
            })
            setClient(client)
            setLoading(false)
        },
        [network]
    )

    // Register the event to recognize when the user changed the wallet
    useEffect(() => {
        // `accountsChanged` event can be triggered with an undefined newAddress.
        // This happens when the user removes the Dapp from the "Connected list of sites allowed access to your addresses"
        // To avoid errors, we reset the dapp state
        window.ethereum?.on('accountsChanged', changeUser)

        return () => {
            window.ethereum?.removeListener('accountsChanged', changeUser)
        }
    }, [changeUser])

    const initializeUser = useCallback(async () => {
        setLoading(true)
        if (!window.ethereum) {
            setClient(null)
            setLoading(false)
            return
        }

        // To connect to the user's wallet, we run this method.
        // It returns a promise that will resolve to the user's address.
        const [userAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        await changeUser([userAddress])
    }, [changeUser])
    // END TODO: user

    // Reinitialize the user if the network changes
    useEffect(() => {
        initializeUser()
    }, [initializeUser, network])

    return [client, loading] as const
}
