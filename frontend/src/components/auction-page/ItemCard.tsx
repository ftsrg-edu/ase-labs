import { Card } from 'primereact/card'
import { Skeleton } from 'primereact/skeleton'
import { Image } from 'primereact/image'
import { BlindAuction } from '../../common/blindAuction'
import { SimpleAuction } from '../../common/simpleAuction'

type Props = {
    auction: SimpleAuction | BlindAuction
}

function ItemCard({ auction }: Props) {
    return (
        <Card title="Item" className="w-full h-full">
            {(!auction.nftDescriptor || !auction.nftDescriptor.image) && (
                <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
            )}
            {auction.nftDescriptor && auction.nftDescriptor.image && (
                <figure className="m-0 text-center">
                    <Image
                        width="100%"
                        height="100%"
                        preview
                        src={auction.nftDescriptor.image}
                        alt={auction.nftDescriptor.description ?? ''}
                        title={auction.nftDescriptor.description ?? ''}
                    />
                    <figcaption>{auction.nftDescriptor.name ?? 'NFT'}</figcaption>
                </figure>
            )}
        </Card>
    )
}

export default ItemCard
