import { useState, useCallback, useEffect } from 'react'
import { Address } from 'viem'
import useLastBlockNumberStore from './useLastBlockNumberStore'

export default function useAuctionStore() {
    const lastBlockNumber = useLastBlockNumberStore()

    const [auctions, setAuctions] = useState([] as { address: Address; type: 'simple' | 'blind' }[])

    const loadAuctions = useCallback(async () => {
        const auctionsString = window.localStorage.getItem('auctions') ?? '[]'
        const auctions = JSON.parse(auctionsString)
        setAuctions(auctions)
    }, [])

    const addSimpleAuction = useCallback(
        async (auction: `0x${string}`) => {
            if (!auctions.find((a) => a.address === auction)) {
                const newAuctions = [{ address: auction, type: 'simple' } as const, ...auctions]
                setAuctions(newAuctions)
                window.localStorage.setItem('auctions', JSON.stringify(newAuctions))
            }
        },
        [auctions]
    )

    const addBlindAuction = useCallback(
        async (auction: `0x${string}`) => {
            if (!auctions.find((a) => a.address === auction)) {
                const newAuctions = [{ address: auction, type: 'blind' } as const, ...auctions]
                setAuctions(newAuctions)
                window.localStorage.setItem('auctions', JSON.stringify(newAuctions))
            }
        },
        [auctions]
    )

    const removeAuction = useCallback(
        async (auction: `0x${string}`) => {
            const newAuctions = auctions.filter((a) => a.address !== auction)
            setAuctions(newAuctions)
            window.localStorage.setItem('auctions', JSON.stringify(newAuctions))
        },
        [auctions]
    )

    useEffect(() => {
        loadAuctions()
    }, [loadAuctions, lastBlockNumber])

    return { auctions, addSimpleAuction, addBlindAuction, removeAuction } as const
}
