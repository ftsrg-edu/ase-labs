import { useState, useEffect, useCallback } from 'react'
import { GetContractReturnType, Client, Address, getContract, getAddress, createPublicClient, custom } from 'viem'
import useClient from './useClient'
import useNetwork from './useNetwork'
import { SimpleAuction } from '../contracts/SimpleAuction'

type Bid = {
    value: number
    sender: Address
    own: boolean
}

export default function useSimpleAuction(auctionAddress: Address) {
    const [network] = useNetwork()
    const [client] = useClient()

    const [auctionContract, setAuctionContract] = useState(
        null as GetContractReturnType<typeof SimpleAuction.abi, Client, Address> | null
    )
    const [receivedBids, setReceivedBids] = useState([] as Bid[])

    const [loading, setLoading] = useState(0)

    useEffect(() => {
        setLoading((loading) => loading + 1)
        try {
            if (!network || !client) {
                setAuctionContract(null)
                return
            }

            const auctionContract = getContract({
                abi: SimpleAuction.abi,
                client: client,
                address: getAddress(auctionAddress)
            })
            setAuctionContract(auctionContract)
        } catch (e) {
            setAuctionContract(null)
            console.error(e)
        } finally {
            setLoading((loading) => loading - 1)
        }
    }, [auctionAddress, client, network])

    const loadReceivedBids = useCallback(async () => {
        if (!network || !client) {
            setReceivedBids([])
            return
        }

        setLoading((loading) => loading + 1)
        try {
            const publicClient = createPublicClient({
                chain: network.chain,
                transport: custom(window.ethereum!)
            })

            const blockNumber = await publicClient.getBlockNumber()
            const bidReceivedEvents = await publicClient.getContractEvents({
                abi: SimpleAuction.abi,
                address: auctionAddress,
                eventName: 'HighestBidIncreased',
                fromBlock: 0n,
                toBlock: blockNumber
            })

            const bids = [] as Bid[]
            for (const bidReceivedEvent of bidReceivedEvents) {
                const sender = bidReceivedEvent.args.bidder
                const value = bidReceivedEvent.args.amount

                if (sender && value) {
                    bids.push({
                        sender: sender,
                        value: Number(value),
                        own: getAddress(sender) === getAddress(client.account.address)
                    })
                }
            }
            setReceivedBids(bids)
        } catch (e) {
            setReceivedBids([])
        } finally {
            setLoading((loading) => loading - 1)
        }
    }, [auctionAddress, network, client])

    useEffect(() => {
        loadReceivedBids()
    }, [loadReceivedBids])

    useEffect(() => {
        if (!network) {
            return
        }

        const publicClient = createPublicClient({
            chain: network.chain,
            transport: custom(window.ethereum!)
        })

        const unwatch = publicClient.watchBlocks({
            onBlock: () => {
                loadReceivedBids()
            }
        })

        return () => {
            unwatch()
        }
    }, [loadReceivedBids, network])

    return [auctionContract, loading !== 0, receivedBids] as const
}
