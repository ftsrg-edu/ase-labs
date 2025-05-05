import { InputText } from 'primereact/inputtext'
import { Address, formatEther, getAddress, parseEther, toHex } from 'viem'
import { BlindAuction } from '../../../common/blindAuction'
import { InputNumber } from 'primereact/inputnumber'
import { useEffect, useMemo, useRef, useState } from 'react'
import Loading from '../../common/Loading'
import { Message } from 'primereact/message'
import { Button } from 'primereact/button'
import TransactionExecutor, { TransactionExecutorRef } from '../../common/TransactionExecutor'
import { classNames } from 'primereact/utils'
import { Dropdown } from 'primereact/dropdown'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import useBlindAuction from '../../../hooks/useBlindAuction'
import useClient from '../../../hooks/useClient'
import useNetwork from '../../../hooks/useNetwork'
import useBidStore from '../../../hooks/useBidStore'

type Props = {
    auctionAddress: Address
    auction: BlindAuction
    refresh: () => void
}

enum RevealState {
    LOADING,
    LOADED,
    FAILED
}

function RevealStage({ auctionAddress, auction }: Props) {
    const [network] = useNetwork()
    const [client] = useClient()
    const [auctionContract, auctionLoading, receivedBids, revealedBids] = useBlindAuction(auctionAddress)

    const [errorMessage, setErrorMessage] = useState('')

    const toast = useRef<Toast>(null)

    const state = useMemo(() => {
        setErrorMessage('')
        if (!network || !client || (auctionContract === null && auctionLoading)) {
            return RevealState.LOADING
        } else if (!auctionContract) {
            setErrorMessage('Failed to load auction')
            return RevealState.FAILED
        } else {
            return RevealState.LOADED
        }
    }, [auctionContract, auctionLoading, client, network])

    const bids = useMemo(() => {
        return receivedBids.map((receivedBid) => {
            const revealedBid = revealedBids.find(
                (revealedBid) =>
                    getAddress(receivedBid.sender) === getAddress(revealedBid.sender) &&
                    receivedBid.blindedBid === revealedBid.blindedBid
            )

            if (revealedBid) {
                return {
                    sender: receivedBid.sender,
                    deposit: receivedBid.deposit,
                    own: receivedBid.own,
                    value: revealedBid.value,
                    fake: revealedBid.fake
                }
            } else {
                return { sender: receivedBid.sender, deposit: receivedBid.deposit, own: receivedBid.own }
            }
        })
    }, [receivedBids, revealedBids])

    const [storedOwnBids] = useBidStore(auctionAddress, client?.account.address ?? '0x0')
    const [ownBids, setOwnBids] = useState(storedOwnBids)

    useEffect(() => {
        setOwnBids(storedOwnBids)
    }, [storedOwnBids])

    const [transactionInProgress, setTransactionInProgress] = useState(false)
    const transactionExecutorRef = useRef<TransactionExecutorRef>(null)

    if (!network || !client || !auctionContract) {
        return <></>
    }

    return (
        <>
            {state === RevealState.LOADING && <Loading />}
            {state === RevealState.FAILED && <Message severity="error" text={errorMessage} className="w-full" />}
            {state === RevealState.LOADED && (
                <>
                    <h3 className="mt-4">Reveal bids</h3>
                    <div className="formgrid grid">
                        <div className="field col-1">#</div>
                        <div className="field col-3">Value</div>
                        <div className="field col-3">Fake</div>
                        <div className="field col-3">Secret</div>
                        <div className="field col-2"></div>
                    </div>
                    {ownBids.map((ownBid, index) => (
                        <div className="formgrid grid align-items-center" key={index}>
                            <div className="field col-1">{index}</div>
                            <div className="field col-3">
                                <InputNumber
                                    className="w-full"
                                    value={ownBid.value}
                                    onChange={(e) => {
                                        const newOwnBids = [...ownBids]
                                        newOwnBids[index].value = e.value ?? 0
                                        setOwnBids(newOwnBids)
                                    }}
                                    pt={{ input: { root: { className: classNames('w-full') } } }}
                                />
                            </div>
                            <div className="field col-3">
                                <Dropdown
                                    className="w-full"
                                    value={ownBid.fake ? 'Fake' : 'Real'}
                                    options={['Fake', 'Real']}
                                    onChange={(e) => {
                                        const newOwnBids = [...ownBids]
                                        newOwnBids[index].fake = e.value === 'Fake'
                                        setOwnBids(newOwnBids)
                                    }}
                                />
                            </div>
                            <div className="field col-3">
                                <InputText
                                    className="w-full"
                                    value={ownBid.secret}
                                    onChange={(e) => {
                                        const newOwnBids = [...ownBids]
                                        newOwnBids[index].secret = e.target.value
                                        setOwnBids(newOwnBids)
                                    }}
                                />
                            </div>
                            <div className="field col-2 flex gap-2">
                                <Button
                                    icon="pi pi-trash"
                                    severity="danger"
                                    size="small"
                                    onClick={() => {
                                        const newOwnBids = [...ownBids]
                                        newOwnBids.splice(index, 1)
                                        setOwnBids(newOwnBids)
                                    }}
                                />
                                <Button
                                    icon="pi pi-plus"
                                    severity="success"
                                    size="small"
                                    onClick={() => {
                                        const newOwnBids = [...ownBids]
                                        newOwnBids.splice(index + 1, 0, {
                                            fake: false,
                                            secret: '',
                                            value: 0,
                                            blindedBid: '0x0'
                                        })
                                        setOwnBids(newOwnBids)
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    {ownBids.length === 0 && (
                        <p>
                            <Button
                                icon="pi pi-plus"
                                severity="success"
                                size="small"
                                onClick={() => {
                                    const newOwnBids = [
                                        {
                                            fake: false,
                                            secret: '',
                                            value: 0,
                                            blindedBid: '0x0' as const
                                        }
                                    ]
                                    setOwnBids(newOwnBids)
                                }}
                            />
                        </p>
                    )}
                    <p className="flex gap-2">
                        <Button
                            severity="warning"
                            size="small"
                            icon="pi pi-send"
                            label="Reveal bids"
                            onClick={async () => {
                                const transaction = auctionContract.write.reveal(
                                    [
                                        ownBids.map((ownBid) => parseEther(ownBid.value.toString())),
                                        ownBids.map((ownBid) => ownBid.fake),
                                        ownBids.map((ownBid) => toHex(ownBid.secret, { size: 32 }))
                                    ],
                                    {
                                        account: client.account.address,
                                        chain: network.chain
                                    }
                                )

                                setTransactionInProgress(true)
                                try {
                                    await transactionExecutorRef.current?.writeTransaction(transaction)
                                } catch (e) {
                                    // Empty
                                } finally {
                                    setTransactionInProgress(false)
                                }
                            }}
                            disabled={transactionInProgress}
                        />
                        <Button
                            size="small"
                            severity="info"
                            icon="pi pi-send"
                            label="Withdraw pending funds"
                            onClick={async () => {
                                const transaction = auctionContract.simulate.withdraw({
                                    account: client.account.address,
                                    chain: network.chain
                                })

                                setTransactionInProgress(true)
                                try {
                                    await transactionExecutorRef.current?.simulateTransaction(transaction)
                                } catch (e) {
                                    // Empty
                                } finally {
                                    setTransactionInProgress(false)
                                }
                            }}
                            disabled={transactionInProgress}
                        />
                    </p>
                    <Toast ref={toast} />
                    <TransactionExecutor ref={transactionExecutorRef} />
                    <h3 className="mt-4">Bids</h3>
                    <DataTable value={bids} stripedRows size="small">
                        <Column
                            header="Own"
                            body={(bid) =>
                                getAddress(bid.sender) === getAddress(client.account.address) ? (
                                    <i className="pi pi-check" />
                                ) : (
                                    <i className="pi pi-minus" />
                                )
                            }
                        />
                        <Column field="sender" header="Sender" />
                        <Column field="deposit" header="Deposit" body={(bid) => formatEther(bid.deposit)} />
                        <Column
                            field="value"
                            header="Value"
                            body={(bid) => (bid.value ? formatEther(bid.value) : <i className="pi pi-eye-slash" />)}
                        />
                        <Column
                            field="fake"
                            header="Fake"
                            body={(bid) =>
                                typeof bid.fake === 'boolean' ? (
                                    bid.fake ? (
                                        'Fake'
                                    ) : (
                                        'Real'
                                    )
                                ) : (
                                    <i className="pi pi-eye-slash" />
                                )
                            }
                        />
                    </DataTable>
                    <h3 className="mt-4">Current highest bidder</h3>
                    <div className="grid align-items-center">
                        <b className="col-12 md:col-2">Highest bidder:</b>
                        <span className="col-12 md:col-10 overflow-hidden" style={{ textOverflow: 'ellipsis' }}>
                            {auction.highestBidder}
                        </span>
                        <b className="col-12 md:col-2">Highest bid:</b>
                        <span className="col-12 md:col-10 overflow-hidden" style={{ textOverflow: 'ellipsis' }}>
                            {formatEther(BigInt(auction.highestBid))}
                        </span>
                    </div>
                    <p></p>
                </>
            )}
        </>
    )
}

export default RevealStage
