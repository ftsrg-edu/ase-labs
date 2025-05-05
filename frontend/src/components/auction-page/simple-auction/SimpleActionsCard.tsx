import { BadgeProps, Badge } from 'primereact/badge'
import { Card } from 'primereact/card'
import { Timeline } from 'primereact/timeline'
import { useCallback } from 'react'
import WaitingForFundingStage from '../WaitingForFundingStage'
import { Address } from 'viem'
import useNetwork from '../../../hooks/useNetwork'
import useClient from '../../../hooks/useClient'
import useBlindAuction from '../../../hooks/useBlindAuction'
import { SimpleAuction, simpleAuctionMarkers, SimpleAuctionStage } from '../../../common/simpleAuction'
import BiddingStage from './BiddingStage'
import EndStage from '../EndStage'

type Props = {
    auctionAddress: Address
    auction: SimpleAuction
    refresh: () => void
}

function SimpleActionsCard({ auctionAddress, auction, refresh }: Props) {
    const [network] = useNetwork()
    const [client] = useClient()
    const [auctionContract] = useBlindAuction(auctionAddress)

    const customizedMarker = useCallback(
        (item: (typeof simpleAuctionMarkers)[0]) => {
            let icon = null
            let color = null as BadgeProps['severity']
            if (auction && item.stage === SimpleAuctionStage.ENDED && auction.stage === SimpleAuctionStage.ENDED) {
                icon = 'pi pi-check'
                color = 'secondary'
            } else if (auction && auction.stage > item.stage) {
                icon = 'pi pi-check'
                color = 'secondary'
            } else if (auction && auction.stage < item.stage) {
                icon = 'pi pi-hourglass'
                color = 'secondary'
            } else if (auction && auction.stage === item.stage) {
                icon = 'pi pi-exclamation-circle'
                color = item.color
            }

            return <Badge severity={color ?? 'secondary'} value={<i className={icon ?? ''}></i>} size="large" />
        },
        [auction]
    )

    if (!network || !client || !auctionContract) {
        return <></>
    }

    return (
        <Card title="Actions" className="w-full h-full">
            <Timeline
                value={simpleAuctionMarkers}
                layout="horizontal"
                content={(marker) => marker.name}
                marker={customizedMarker}
                align="bottom"
            />
            {auction.stage === SimpleAuctionStage.WAITING_FOR_FUNDING && (
                <WaitingForFundingStage auctionAddress={auctionAddress} auction={auction} refresh={refresh} />
            )}
            {auction.stage === SimpleAuctionStage.BIDDING && (
                <BiddingStage auctionAddress={auctionAddress} auction={auction} refresh={refresh} />
            )}
            {auction.stage === SimpleAuctionStage.WAITING_FOR_END && (
                <EndStage
                    auctionAddress={auctionAddress}
                    auction={auction}
                    refresh={refresh}
                    showEndAuctionButton={true}
                />
            )}
            {auction.stage === SimpleAuctionStage.ENDED && (
                <EndStage
                    auctionAddress={auctionAddress}
                    auction={auction}
                    refresh={refresh}
                    showEndAuctionButton={false}
                />
            )}
        </Card>
    )
}

export default SimpleActionsCard
