import { Address, formatEther, getAddress, parseEther } from 'viem'
import { InputNumber } from 'primereact/inputnumber'
import { useCallback, useMemo, useRef, useState } from 'react'
import Loading from '../../common/Loading'
import { Message } from 'primereact/message'
import { Button } from 'primereact/button'
import TransactionExecutor, { TransactionExecutorRef } from '../../common/TransactionExecutor'
import { classNames } from 'primereact/utils'
import { Toast } from 'primereact/toast'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import useClient from '../../../hooks/useClient'
import useNetwork from '../../../hooks/useNetwork'
import { SimpleAuction } from '../../../common/simpleAuction'
import useSimpleAuction from '../../../hooks/useSimpleAuction'

type Props = {
    auctionAddress: Address
    auction: SimpleAuction
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
    const [auctionContract, auctionLoading, receivedBids] = useSimpleAuction(auctionAddress)

    const [value, setValue] = useState(0)

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
        } else {
            return true
        }
    }, [value])

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
                            <label htmlFor="value">Value</label>
                            <InputNumber
                                inputId="value"
                                className="w-full"
                                value={value}
                                onChange={(e) => setValue(e.value ?? 0)}
                                pt={{ input: { root: { className: classNames('w-full') } } }}
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

                                const transaction = auctionContract.write.bid({
                                    account: client.account.address,
                                    chain: network.chain,
                                    value: parseEther(value.toString())
                                })

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
                    </p>
                    <Toast ref={toast} />
                    <TransactionExecutor ref={transactionExecutorRef} />
                    <h3 className="mt-4">Bids</h3>
                    <DataTable value={receivedBids} stripedRows size="small">
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
                        <Column field="value" header="Value" body={(bid) => formatEther(bid.value)} />
                    </DataTable>
                </>
            )}
        </>
    )
}

export default BiddingStage
