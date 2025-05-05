import { Address, formatEther } from 'viem'
import { BlindAuction } from '../../common/blindAuction'
import { useState, useMemo, useRef } from 'react'
import { Message } from 'primereact/message'
import { Button } from 'primereact/button'
import Loading from '../common/Loading'
import TransactionExecutor, { TransactionExecutorRef } from '../common/TransactionExecutor'
import useBlindAuction from '../../hooks/useBlindAuction'
import useClient from '../../hooks/useClient'
import useNetwork from '../../hooks/useNetwork'
import { SimpleAuction } from '../../common/simpleAuction'

type Props = {
    auctionAddress: Address
    auction: SimpleAuction | BlindAuction
    refresh: () => void
    showEndAuctionButton: boolean
}

enum EndState {
    LOADING,
    LOADED,
    FAILED
}

function EndStage({ auctionAddress, auction, showEndAuctionButton }: Props) {
    const [network] = useNetwork()
    const [client] = useClient()
    const [auctionContract, auctionLoading] = useBlindAuction(auctionAddress)

    const [errorMessage, setErrorMessage] = useState('')

    const state = useMemo(() => {
        setErrorMessage('')
        if (!network || !client || auctionLoading) {
            return EndState.LOADING
        } else if (!auctionContract) {
            setErrorMessage('Failed to load auction')
            return EndState.FAILED
        } else {
            return EndState.LOADED
        }
    }, [auctionContract, auctionLoading, client, network])

    const [transactionInProgress, setTransactionInProgress] = useState(false)
    const transactionExecutorRef = useRef<TransactionExecutorRef>(null)

    if (!network || !client || !auctionContract) {
        return <></>
    }

    return (
        <>
            {state === EndState.LOADING && <Loading />}
            {state === EndState.FAILED && <Message severity="error" text={errorMessage} className="w-full" />}
            {state === EndState.LOADED && (
                <>
                    <p className="flex gap-2">
                        {showEndAuctionButton && (
                            <Button
                                severity="info"
                                size="small"
                                icon="pi pi-send"
                                label="End auction"
                                onClick={async () => {
                                    const transaction = auctionContract.write.auctionEnd({
                                        account: client.account.address,
                                        chain: network.chain
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
                        )}
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
                    <TransactionExecutor ref={transactionExecutorRef} />
                    <h3 className="mt-4">Result</h3>
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

export default EndStage
