import { Address } from 'viem'
import { useMemo, useState } from 'react'
import Loading from '../common/Loading'
import { Message } from 'primereact/message'
import { DataView } from 'primereact/dataview'
import { Button } from 'primereact/button'
import NewAuctionDialog from './NewAuctionDialog'
import { classNames } from 'primereact/utils'
import ImportAuctionDialog from './ImportAuctionDialog'
import { Card } from 'primereact/card'
import useNetwork from '../../hooks/useNetwork'
import useClient from '../../hooks/useClient'
import useAuctionFactory from '../../hooks/useAuctionFactory'
import useAuctionStore from '../../hooks/useAuctionStore'

enum AuctionHomeState {
    LOADING,
    LOADED,
    FAILED
}

type Props = {
    navigate: (type: 'simple' | 'blind', address: Address) => void
}

function AuctionHome({ navigate }: Props) {
    const [network] = useNetwork()
    const [client] = useClient()

    const [factoryContract] = useAuctionFactory()
    const { auctions, addSimpleAuction, addBlindAuction, removeAuction } = useAuctionStore()

    const state = useMemo(() => {
        if (!network || !client) {
            return AuctionHomeState.LOADING
        } else if (!factoryContract) {
            return AuctionHomeState.FAILED
        } else {
            return AuctionHomeState.LOADED
        }
    }, [network, client, factoryContract])

    const [showNewAuctionDialog, setShowNewAuctionDialog] = useState(false)
    const [showImportAuctionDialog, setShowImportAuctionDialog] = useState(false)

    const itemTemplate = (address: Address, type: 'simple' | 'blind', index: number) => {
        return (
            <div
                className="flex flex-row justify-content-start align-items-center py-3 px-2 w-full hover:surface-ground gap-2"
                key={index}
            >
                <div className="justify-content-start align-items-center">
                    <span className={`pi ${type === 'simple' ? 'pi-eye' : 'pi-eye-slash'}`} />
                </div>
                <span>{address}</span>
                <div className="flex-grow-1 justify-content-end align-items-center flex gap-2">
                    <Button
                        icon="pi pi-trash"
                        size="small"
                        rounded
                        severity="danger"
                        aria-label="delete"
                        pt={{ root: { className: classNames('p-1', 'w-2rem', 'h-2rem') } }}
                        onClick={() => removeAuction(address)}
                    />
                    <Button
                        icon="pi pi-angle-right"
                        size="small"
                        rounded
                        severity="secondary"
                        aria-label="Open"
                        pt={{ root: { className: classNames('p-1', 'w-2rem', 'h-2rem') } }}
                        onClick={() => navigate(type, address)}
                    />
                </div>
            </div>
        )
    }

    const listTemplate = (auctions: { address: Address; type: 'simple' | 'blind' }[]) => {
        if (!auctions || auctions.length === 0) return null

        const list = auctions.map((auction, index) => {
            return itemTemplate(auction.address, auction.type, index)
        })

        return <div className="grid grid-nogutter">{list}</div>
    }

    return (
        <>
            {state === AuctionHomeState.LOADING && <Loading />}
            {state === AuctionHomeState.FAILED && (
                <Message severity="error" text="Factory contract is not deployed on this network!" className="w-full" />
            )}
            {state === AuctionHomeState.LOADED && (
                <Card title="Auctions">
                    <div className="flex justify-content-start align-items-center gap-2 mb-2">
                        <Button
                            icon="pi pi-plus"
                            size="small"
                            label="New auction"
                            severity="success"
                            onClick={() => setShowNewAuctionDialog(true)}
                        />
                        <Button
                            icon="pi pi-download"
                            size="small"
                            label="Import auction"
                            severity="info"
                            onClick={() => setShowImportAuctionDialog(true)}
                        />
                    </div>
                    <DataView
                        value={auctions}
                        listTemplate={listTemplate}
                        pt={{
                            header: { className: classNames('bg-white') },
                            paginator: { root: { className: classNames('border-none') } }
                        }}
                    />
                </Card>
            )}
            {network && client && (
                <>
                    {factoryContract && (
                        <NewAuctionDialog
                            show={showNewAuctionDialog}
                            onCancel={() => setShowNewAuctionDialog(false)}
                            onNewAuction={(auction, type) => {
                                if (type === 'simple') addSimpleAuction(auction)
                                else addBlindAuction(auction)
                                setShowNewAuctionDialog(false)
                            }}
                        />
                    )}
                    <ImportAuctionDialog
                        show={showImportAuctionDialog}
                        onCancel={() => setShowImportAuctionDialog(false)}
                        onNewAuction={(auction, type) => {
                            if (type === 'simple') addSimpleAuction(auction)
                            else addBlindAuction(auction)
                            setShowImportAuctionDialog(false)
                        }}
                    />
                </>
            )}
        </>
    )
}

export default AuctionHome
