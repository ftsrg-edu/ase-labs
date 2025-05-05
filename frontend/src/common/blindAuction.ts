import { Address } from 'viem'

export enum BlindAuctionStage {
    WAITING_FOR_FUNDING,
    BIDDING,
    REVEAL,
    WAITING_FOR_END,
    ENDED
}

export type BlindAuction = {
    beneficiaryAddress: Address
    biddingEnd: Date
    revealEnd: Date
    nftAddress: Address
    nftTokenId: number
    nftDescriptor: { name: string; description: string; image: string } | null
    stage: BlindAuctionStage
    highestBid: number
    highestBidder: Address
}

export const blindAuctionMarkers = [
    {
        stage: BlindAuctionStage.WAITING_FOR_FUNDING,
        name: 'Waiting for funding',
        color: 'warning'
    } as const,
    {
        stage: BlindAuctionStage.BIDDING,
        name: 'Bidding',
        color: 'success'
    } as const,
    {
        stage: BlindAuctionStage.REVEAL,
        name: 'Reveal',
        color: 'warning'
    } as const,
    {
        stage: BlindAuctionStage.WAITING_FOR_END,
        name: 'Waiting for end',
        color: 'info'
    } as const,
    {
        stage: BlindAuctionStage.ENDED,
        name: 'Ended',
        color: 'secondary'
    } as const
]
