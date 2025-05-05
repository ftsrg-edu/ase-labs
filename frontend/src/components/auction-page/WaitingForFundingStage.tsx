import { InputText } from 'primereact/inputtext'
import { Address, getAddress } from 'viem'
import { BlindAuction } from '../../common/blindAuction'
import { InputNumber } from 'primereact/inputnumber'
import { useCallback, useEffect, useRef, useState } from 'react'
import Loading from '../common/Loading'
import { Message } from 'primereact/message'
import { Button } from 'primereact/button'
import TransactionExecutor, { TransactionExecutorRef } from '../common/TransactionExecutor'
import { classNames } from 'primereact/utils'
import useClient from '../../hooks/useClient'
import useNetwork from '../../hooks/useNetwork'
import useNft from '../../hooks/useNft'
import { SimpleAuction } from '../../common/simpleAuction'

type Props = {
    auctionAddress: Address
    auction: SimpleAuction | BlindAuction
    refresh: () => void
}

enum WaitingForFundingState {
    LOADING,
    LOADED,
    FAILED
}

function WaitingForFundingStage({ auctionAddress, auction }: Props) {
    const [network] = useNetwork()
    const [client] = useClient()
    const [nftContract] = useNft(auction.nftAddress)

    const [state, setState] = useState(WaitingForFundingState.LOADING)

    const [nftOwner, setNftOwner] = useState(null as Address | null)
    const [errorMessage, setErrorMessage] = useState('')

    const checkUserBalance = useCallback(async () => {
        if (!nftContract) {
            setState(WaitingForFundingState.FAILED)
            setErrorMessage(`There is no valid ERC721 NFT contract at address ${auction.nftAddress}`)
            return
        }

        try {
            const owner = await nftContract.read.ownerOf([BigInt(auction.nftTokenId)])
            setNftOwner(owner)

            setState(WaitingForFundingState.LOADED)
        } catch (e) {
            setState(WaitingForFundingState.FAILED)
            setErrorMessage(`Could not get user balance`)
        }
    }, [auction, nftContract])

    useEffect(() => {
        checkUserBalance()
    }, [checkUserBalance])

    const [transactionInProgress, setTransactionInProgress] = useState(false)
    const transactionExecutorRef = useRef<TransactionExecutorRef>(null)

    if (!network || !client) {
        return <></>
    }

    return (
        <>
            <p>Fund the auction by transferring the NFT to this auction contract.</p>
            <div className="formgrid grid">
                <div className="field col-12 md:col-9">
                    <label htmlFor="nftAddress">NFT address</label>
                    <InputText id="nftAddress" className="w-full" value={auction.nftAddress} disabled />
                </div>
                <div className="field col-12 md:col-3">
                    <label htmlFor="nftTokenId">NFT token ID</label>
                    <InputNumber
                        id="nftTokenId"
                        className="w-full"
                        value={auction.nftTokenId}
                        disabled
                        pt={{ input: { root: { className: classNames('w-full') } } }}
                    />
                </div>
                <div className="field col-12">
                    <label htmlFor="contractAddress">Auction contract address</label>
                    <InputText id="contractAddress" className="w-full" value={auctionAddress} disabled />
                </div>
            </div>
            {state === WaitingForFundingState.LOADING && <Loading />}
            {state === WaitingForFundingState.FAILED && (
                <Message severity="error" text={errorMessage} className="w-full" />
            )}
            {state === WaitingForFundingState.LOADED && nftContract && nftOwner && (
                <>
                    {getAddress(nftOwner) === getAddress(client.account.address) && (
                        <>
                            <p>You own this NFT.</p>
                            <p>
                                <Button
                                    severity="warning"
                                    size="small"
                                    icon="pi pi-send"
                                    label="Transfer NFT"
                                    onClick={async () => {
                                        const transaction = nftContract.simulate.safeTransferFrom(
                                            [client.account.address, auctionAddress, BigInt(auction.nftTokenId)],
                                            { account: client.account.address, chain: network.chain }
                                        )

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
                        </>
                    )}
                    {getAddress(nftOwner) !== getAddress(client.account.address) && (
                        <p>The NFT is owned by {nftOwner}. Ask them to fund this auction!</p>
                    )}
                </>
            )}
        </>
    )
}

export default WaitingForFundingStage
