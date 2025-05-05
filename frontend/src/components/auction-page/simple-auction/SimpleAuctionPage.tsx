import { Address, getAddress, getContract, createPublicClient, custom } from 'viem'
import { useCallback, useEffect, useState } from 'react'
import { NFT } from '../../../contracts/NFT'
import Loading from '../../common/Loading'
import { Message } from 'primereact/message'
import DetailsCard from './../DetailsCard'
import ItemCard from './../ItemCard'
import useNetwork from '../../../hooks/useNetwork'
import useClient from '../../../hooks/useClient'
import useSimpleAuction from '../../../hooks/useSimpleAuction'
import { SimpleAuction, SimpleAuctionStage } from '../../../common/simpleAuction'
import SimpleActionsCard from './SimpleActionsCard'

type Props = {
    auctionAddress: Address
}

enum AuctionPageState {
    LOADING,
    LOADED,
    FAILED
}

function SimpleAuctionPage({ auctionAddress }: Props) {
    const [network] = useNetwork()
    const [client] = useClient()
    const [auctionContract] = useSimpleAuction(auctionAddress)

    const [state, setState] = useState(AuctionPageState.LOADING)

    const [lastBlockTimestamp, setLastBlockTimestamp] = useState(null as Date | null)

    const [auction, setAuction] = useState(null as SimpleAuction | null)

    const loadAuction = useCallback(async () => {
        if (!network || !client || !auctionContract) {
            setAuction(null)
            setState(AuctionPageState.LOADING)
            return
        }

        try {
            const beneficiaryAddress = await auctionContract.read.beneficiary()
            const biddingEnd = new Date(Number(await auctionContract.read.biddingEnd()) * 1000)
            const funded = await auctionContract.read.funded()
            const ended = await auctionContract.read.ended()

            const nftAddress = await auctionContract.read.tokenAddress()
            const nftTokenId = await auctionContract.read.tokenId()

            const highestBid = await auctionContract.read.highestBid()
            const highestBidder = await auctionContract.read.highestBidder()

            let nftDescriptor = null
            try {
                const nftContract = getContract({
                    abi: NFT.abi,
                    client: client,
                    address: getAddress(nftAddress)
                })
                const tokenUri = await nftContract.read.tokenURI([nftTokenId])
                const nftResponse = await fetch(tokenUri)
                nftDescriptor = await nftResponse.json()
            } catch (e) {
                // Do nothing
            }

            const publicClient = createPublicClient({
                chain: network.chain,
                transport: custom(window.ethereum!)
            })

            const block = await publicClient.getBlock()
            const timestamp = Number(block.timestamp) * 1000
            setLastBlockTimestamp(new Date(timestamp))
            const now = new Date(Math.max(Date.now(), timestamp))

            const stage =
                !ended && !funded
                    ? SimpleAuctionStage.WAITING_FOR_FUNDING
                    : now < biddingEnd
                      ? SimpleAuctionStage.BIDDING
                      : !ended
                        ? SimpleAuctionStage.WAITING_FOR_END
                        : SimpleAuctionStage.ENDED

            setAuction({
                beneficiaryAddress,
                biddingEnd,
                nftDescriptor,
                nftAddress,
                nftTokenId: Number(nftTokenId),
                stage,
                highestBid: Number(highestBid),
                highestBidder
            })

            setState(AuctionPageState.LOADED)
        } catch (e) {
            setState(AuctionPageState.FAILED)
            console.error(e)
        }
    }, [auctionContract, client, network])

    useEffect(() => {
        loadAuction()
    }, [loadAuction])

    useEffect(() => {
        if (!network) {
            return
        }

        const publicClient = createPublicClient({
            chain: network.chain,
            transport: custom(window.ethereum!)
        })

        const unwatch = publicClient.watchBlocks({
            onBlock: loadAuction
        })

        return () => {
            unwatch()
        }
    }, [loadAuction, network])

    return (
        <>
            {state === AuctionPageState.LOADING && <Loading />}
            {state === AuctionPageState.FAILED && (
                <Message severity="error" text="Auction contract is not deployed on this address!" className="w-full" />
            )}
            {state === AuctionPageState.LOADED &&
                client &&
                network &&
                auctionContract &&
                auction &&
                lastBlockTimestamp && (
                    <>
                        <div className="flex gap-4 flex-wrap md:flex-nowrap">
                            <div className="w-12 md:w-9">
                                <DetailsCard
                                    auctionAddress={auctionAddress}
                                    auction={auction}
                                    lastBlockTimestamp={lastBlockTimestamp}
                                    type="simple"
                                />
                            </div>
                            <div className="w-12 md:w-3">
                                <ItemCard auction={auction} />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-12">
                                <SimpleActionsCard
                                    auction={auction}
                                    auctionAddress={auctionAddress}
                                    refresh={() => loadAuction()}
                                />
                            </div>
                        </div>
                    </>
                )}
        </>
    )
}

export default SimpleAuctionPage
