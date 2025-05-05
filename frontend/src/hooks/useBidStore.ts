import { useCallback, useEffect, useState } from 'react'
import { Address } from 'viem'
import useLastBlockNumberStore from './useLastBlockNumberStore'

type OwnBid = {
    value: number
    fake: boolean
    secret: string
    blindedBid: `0x${string}`
}

export default function useBidStore(auctionAddress: Address, userAddress: Address) {
    const lastBlockNumber = useLastBlockNumberStore()

    const [bids, setBids] = useState([] as OwnBid[])

    const loadBids = useCallback(async () => {
        const ownBids = JSON.parse(
            window.localStorage.getItem(`bids-${auctionAddress}-${userAddress}`) ?? '[]'
        ) as OwnBid[]
        setBids(ownBids)
    }, [auctionAddress, userAddress])

    const saveBid = useCallback(
        (blindedBid: `0x${string}`, value: number, secret: string, fake: boolean) => {
            const bids = JSON.parse(
                window.localStorage.getItem(`bids-${auctionAddress}-${userAddress}`) ?? '[]'
            ) as OwnBid[]
            bids.push({ blindedBid, value, secret, fake })
            window.localStorage.setItem(`bids-${auctionAddress}-${userAddress}`, JSON.stringify(bids))
            loadBids()
        },
        [auctionAddress, loadBids, userAddress]
    )

    useEffect(() => {
        loadBids()
    }, [loadBids, lastBlockNumber])

    return [bids, saveBid] as const
}
