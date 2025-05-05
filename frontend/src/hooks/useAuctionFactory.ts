import { useState, useEffect } from 'react'
import { GetContractReturnType, Client, Address, getContract, getAddress } from 'viem'
import { AuctionFactory } from '../contracts/AuctionFactory'
import useClient from './useClient'
import useNetwork from './useNetwork'

export default function useAuctionFactory() {
    const [network] = useNetwork()
    const [client] = useClient()

    const [factoryContract, setFactoryContract] = useState(
        null as GetContractReturnType<typeof AuctionFactory.abi, Client, Address> | null
    )

    useEffect(() => {
        try {
            if (!network || !client) {
                setFactoryContract(null)
                return
            }

            const factoryContract = getContract({
                abi: AuctionFactory.abi,
                client: client,
                address: getAddress(network.addresses.auctionFactory)
            })
            setFactoryContract(factoryContract)
        } catch (e) {
            setFactoryContract(null)
            console.error(e)
        }
    }, [client, network])

    return [factoryContract] as const
}
