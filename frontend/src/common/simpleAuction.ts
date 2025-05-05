import { Address } from 'viem'

export enum SimpleAuctionStage {
    WAITING_FOR_FUNDING,
    BIDDING,
    WAITING_FOR_END,
    ENDED
}

export type SimpleAuction = {
    beneficiaryAddress: Address
    biddingEnd: Date
    nftAddress: Address
    nftTokenId: number
    nftDescriptor: { name: string; description: string; image: string } | null
    stage: SimpleAuctionStage
    highestBid: number
    highestBidder: Address
}

export const simpleAuctionMarkers = [
    {
        stage: SimpleAuctionStage.WAITING_FOR_FUNDING,
        name: 'Waiting for funding',
        color: 'warning'
    } as const,
    {
        stage: SimpleAuctionStage.BIDDING,
        name: 'Bidding',
        color: 'success'
    } as const,
    {
        stage: SimpleAuctionStage.WAITING_FOR_END,
        name: 'Waiting for end',
        color: 'info'
    } as const,
    {
        stage: SimpleAuctionStage.ENDED,
        name: 'Ended',
        color: 'secondary'
    } as const
]
