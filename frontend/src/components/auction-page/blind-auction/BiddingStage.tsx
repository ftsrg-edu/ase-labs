import { InputText } from 'primereact/inputtext'
import { Address, encodePacked, formatEther, getAddress, keccak256, parseEther, toHex } from 'viem'
import { BlindAuction } from '../../../common/blindAuction'
import { InputNumber } from 'primereact/inputnumber'
import { useCallback, useMemo, useRef, useState } from 'react'
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

enum BiddingState {
    LOADING,
    LOADED,
    FAILED
}

function BiddingStage({ auctionAddress }: Props) {
    const [network] = useNetwork()
    const [client] = useClient()
    const [auctionContract, auctionLoading, receivedBids] = useBlindAuction(auctionAddress)

    const [deposit, setDeposit] = useState(0)
    const [value, setValue] = useState(0)
    const [fake, setFake] = useState(false)
    const [secret, setSecret] = useState('')

    const [ownBids, saveBid] = useBidStore(auctionAddress, client?.account.address ?? '0x0')
    const [errorMessage, setErrorMessage] = useState('')

    const state = useMemo(() => {
        setErrorMessage('')
        if (!network || !client || (auctionContract === null && auctionLoading)) {
            return BiddingState.LOADING
        } else if (!auctionContract) {
            setErrorMessage('Failed to load auction')
            return BiddingState.FAILED
        } else {
            return BiddingState.LOADED
        }
    }, [auctionContract, auctionLoading, client, network])

    const bids = useMemo(() => {
        return receivedBids.map((receivedBid) => {
            const ownBid = ownBids.find(
                (ownBid) =>
                    receivedBid.blindedBid === ownBid.blindedBid &&
                    receivedBid.sender === getAddress(client?.account.address ?? '0x0')
            )
            if (ownBid) {
                return { ...receivedBid, ...ownBid }
            } else {
                return receivedBid
            }
        })
    }, [receivedBids, ownBids, client])

    const toast = useRef<Toast>(null)

    const [transactionInProgress, setTransactionInProgress] = useState(false)
    const transactionExecutorRef = useRef<TransactionExecutorRef>(null)

    const validate = useCallback(() => {
        if (value <= 0) {
            toast.current?.show({
                severity: 'error',
                detail: 'Value must be positive'
            })
            return false
        } else if (deposit <= 0) {
            toast.current?.show({
                severity: 'error',
                detail: 'Deposit must be positive'
            })
            return false
        } else if (value > deposit) {
            toast.current?.show({
                severity: 'error',
                detail: 'Deposit must be bigger than value'
            })
            return false
        } else if (secret.length === 0) {
            toast.current?.show({
                severity: 'error',
                detail: 'Secret must not be empty'
            })
            return false
        } else {
            return true
        }
    }, [deposit, secret, value])

    if (!network || !client || !auctionContract) {
        return <></>
    }

    return (
        <>
            {state === BiddingState.LOADING && <Loading />}
            {state === BiddingState.FAILED && <Message severity="error" text={errorMessage} className="w-full" />}
            {state === BiddingState.LOADED && (
                <>
                    <h3 className="mt-4">New bid</h3>
                    <div className="formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="deposit">Deposit</label>
                            <InputNumber
                                inputId="deposit"
                                className="w-full"
                                value={deposit}
                                onChange={(e) => setDeposit(e.value ?? 0)}
                                pt={{ input: { root: { className: classNames('w-full') } } }}
                            />
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="value">Value</label>
                            <InputNumber
                                inputId="value"
                                className="w-full"
                                value={value}
                                onChange={(e) => setValue(e.value ?? 0)}
                                pt={{ input: { root: { className: classNames('w-full') } } }}
                            />
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="fake">Fake</label>
                            <Dropdown
                                inputId="fake"
                                className="w-full"
                                value={fake ? 'Fake' : 'Real'}
                                options={['Fake', 'Real']}
                                onChange={(e) => {
                                    setFake(e.value === 'Fake')
                                }}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="secret">Secret</label>
                            <InputText
                                id="secret"
                                className="w-full"
                                value={secret}
                                onChange={(e) => {
                                    setSecret(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    <p>
                        <Button
                            severity="success"
                            size="small"
                            icon="pi pi-send"
                            label="Place bid"
                            onClick={async () => {
                                if (!validate()) {
                                    return
                                }

                                const blindedBid = keccak256(
                                    encodePacked(
                                        ['uint', 'bool', 'bytes32'],
                                        [parseEther(value.toString()), fake, toHex(secret, { size: 32 })]
                                    )
                                )

                                const transaction = auctionContract.write.bid([blindedBid], {
                                    account: client.account.address,
                                    chain: network.chain,
                                    value: parseEther(deposit.toString())
                                })

                                setTransactionInProgress(true)
                                try {
                                    await transactionExecutorRef.current?.writeTransaction(transaction)
                                    saveBid(blindedBid, value, secret, fake)
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
                            body={(bid) => (bid.value ? bid.value : <i className="pi pi-eye-slash" />)}
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
                        <Column
                            field="secret"
                            header="Secret"
                            body={(bid) => (bid.secret ? bid.secret : <i className="pi pi-eye-slash" />)}
                        />
                    </DataTable>
                </>
            )}
        </>
    )
}

export default BiddingStage
