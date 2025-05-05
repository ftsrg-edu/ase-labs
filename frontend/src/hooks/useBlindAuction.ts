import { useState, useEffect, useCallback } from 'react'
import { GetContractReturnType, Client, Address, getContract, getAddress, createPublicClient, custom } from 'viem'
import useClient from './useClient'
import useNetwork from './useNetwork'
import { BlindAuction } from '../contracts/BlindAuction'

type Bid = {
    deposit: number
    sender: Address
    own: boolean
    blindedBid: `0x${string}`
}

type RevealedBid = {
    sender: Address
    blindedBid: `0x${string}`
    fake: boolean
    value: number
}

export default function useBlindAuction(auctionAddress: Address) {
    const [network] = useNetwork()
    const [client] = useClient()

    const [auctionContract, setAuctionContract] = useState(
        null as GetContractReturnType<typeof BlindAuction.abi, Client, Address> | null
    )
    const [receivedBids, setReceivedBids] = useState([] as Bid[])
    const [revealedBids, setRevealedBids] = useState([] as RevealedBid[])

    const [loading, setLoading] = useState(0)

    useEffect(() => {
        setLoading((loading) => loading + 1)
        try {
            if (!network || !client) {
                setAuctionContract(null)
                return
            }

            const auctionContract = getContract({
                abi: BlindAuction.abi,
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
                abi: BlindAuction.abi,
                address: auctionAddress,
                eventName: 'BidReceived',
                fromBlock: 0n,
                toBlock: blockNumber
            })

            const bids = [] as Bid[]
            for (const bidReceivedEvent of bidReceivedEvents) {
                const sender = bidReceivedEvent.args.sender
                const blindedBid = bidReceivedEvent.args.blindedBid
                const deposit = bidReceivedEvent.args.deposit

                if (sender && blindedBid && deposit) {
                    bids.push({
                        sender: sender,
                        deposit: Number(deposit),
                        own: getAddress(sender) === getAddress(client.account.address),
                        blindedBid: blindedBid
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

    const loadRevealedBids = useCallback(async () => {
        if (!network || !client) {
            setRevealedBids([])
            return
        }

        setLoading((loading) => loading + 1)
        try {
            const publicClient = createPublicClient({
                chain: network.chain,
                transport: custom(window.ethereum!)
            })

            const blockNumber = await publicClient.getBlockNumber()
            const bidRevealedEvents = await publicClient.getContractEvents({
                abi: BlindAuction.abi,
                address: auctionAddress,
                eventName: 'RevealedBid',
                fromBlock: 0n,
                toBlock: blockNumber
            })

            const bids = [] as RevealedBid[]
            for (const bidRevealedEvent of bidRevealedEvents) {
                const sender = bidRevealedEvent.args.sender
                const blindedBid = bidRevealedEvent.args.blindedBid
                const fake = bidRevealedEvent.args.fake
                const value = bidRevealedEvent.args.value

                if (sender && blindedBid && typeof fake === 'boolean' && typeof value === 'bigint') {
                    bids.push({
                        sender: sender,
                        fake: fake,
                        value: Number(value),
                        blindedBid: blindedBid
                    })
                }
            }
            setRevealedBids(bids)
        } catch (e) {
            setRevealedBids([])
        } finally {
            setLoading((loading) => loading - 1)
        }
    }, [auctionAddress, network, client])

    useEffect(() => {
        loadReceivedBids()
        loadRevealedBids()
    }, [loadReceivedBids, loadRevealedBids])

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
                loadRevealedBids()
            }
        })

        return () => {
            unwatch()
        }
    }, [loadReceivedBids, loadRevealedBids, network])

    return [auctionContract, loading !== 0, receivedBids, revealedBids] as const
}
