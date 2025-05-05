import { Address } from 'viem'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useCallback, useEffect, useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { classNames } from 'primereact/utils'
import { InputNumber } from 'primereact/inputnumber'
import { Skeleton } from 'primereact/skeleton'
import { Image } from 'primereact/image'
import TransactionExecutor, { TransactionExecutorRef } from '../common/TransactionExecutor'
import useNetwork from '../../hooks/useNetwork'
import useClient from '../../hooks/useClient'
import useAuctionFactory from '../../hooks/useAuctionFactory'
import loadNft from '../../common/loadNft'
import { SelectButton } from 'primereact/selectbutton'

type Props = {
    show: boolean
    onCancel: () => void
    onNewAuction: (address: Address, type: 'simple' | 'blind') => void
}

const [inOneWeek, inTwoWeeks] = [new Date(), new Date()]
inOneWeek.setDate(inOneWeek.getDate() + 7)
inTwoWeeks.setDate(inTwoWeeks.getDate() + 14)

function NewAuctionDialog({ show, onCancel, onNewAuction }: Props) {
    const [network] = useNetwork()
    const [client] = useClient()
    const [factoryContract] = useAuctionFactory()

    const [beneficiaryAddress, setBeneficiaryAddress] = useState(client?.account.address ?? '0x0')
    const [type, setType] = useState('simple' as 'simple' | 'blind')
    const [biddingEnds, setBiddingEnds] = useState(inOneWeek)
    const [revealEnds, setRevealEnds] = useState(inTwoWeeks)
    const [nftAddress, setNftAddress] = useState('' as Address)
    const [nftTokenId, setNftTokenId] = useState(0)

    const [nftDescriptor, setNftDescriptor] = useState(
        null as { name: string; description: string; image: string } | null
    )

    const [transactionInProgress, setTransactionInProgress] = useState(false)
    const transactionExecutorRef = useRef<TransactionExecutorRef>(null)

    useEffect(() => {
        setBeneficiaryAddress(client?.account.address ?? '0x0')
        setType('simple')
        setBiddingEnds(inOneWeek)
        setRevealEnds(inTwoWeeks)
        setNftAddress('' as Address)
        setNftTokenId(0)
        setNftDescriptor(null)
    }, [show, client])

    const updateNft = useCallback(async () => {
        if (!client || !nftAddress || !nftAddress.startsWith('0x')) {
            setNftDescriptor(null)
            return
        }

        setNftDescriptor(await loadNft(client, nftAddress, nftTokenId))
    }, [client, nftAddress, nftTokenId])

    useEffect(() => {
        updateNft()
    }, [updateNft])

    const createNewAuction = useCallback(async () => {
        if (!network || !client || !factoryContract) {
            return
        }

        const biddingEnd = Math.floor(biddingEnds.getTime() / 1000)
        const revealEnd = Math.floor(revealEnds.getTime() / 1000)

        const transaction: any =
            type === 'simple'
                ? factoryContract.simulate.createSimpleAuction(
                      [BigInt(biddingEnd), beneficiaryAddress, nftAddress, BigInt(nftTokenId)],
                      { account: client.account.address, chain: network.chain }
                  )
                : factoryContract.simulate.createBlindAuction(
                      [BigInt(biddingEnd), BigInt(revealEnd), beneficiaryAddress, nftAddress, BigInt(nftTokenId)],
                      { account: client.account.address, chain: network.chain }
                  )

        setTransactionInProgress(true)
        try {
            const result = await transactionExecutorRef.current?.simulateTransaction(transaction)
            if (result) {
                onNewAuction(result, type)
            }
        } catch (e) {
            // Empty
        } finally {
            setTransactionInProgress(false)
        }
    }, [
        beneficiaryAddress,
        type,
        biddingEnds,
        client,
        factoryContract,
        network,
        nftAddress,
        nftTokenId,
        onNewAuction,
        revealEnds
    ])

    return (
        <Dialog
            header="New auction"
            footer={
                <div>
                    <Button
                        text
                        size="small"
                        severity="secondary"
                        label="Cancel"
                        onClick={onCancel}
                        disabled={transactionInProgress}
                    />
                    <Button
                        size="small"
                        severity="success"
                        icon="pi pi-plus"
                        label="Create new auction"
                        onClick={createNewAuction}
                        disabled={transactionInProgress}
                    />
                </div>
            }
            visible={show}
            onHide={onCancel}
            style={{ maxWidth: '800px' }}
            className="w-full"
        >
            <div className="formgrid grid">
                <div className="field col-12 md:col-9">
                    <label htmlFor="beneficiaryAddress">Beneficiary address</label>
                    <InputText
                        id="beneficiaryAddress"
                        className="w-full"
                        value={beneficiaryAddress}
                        onChange={(e) => setBeneficiaryAddress(e.target.value as Address)}
                    />
                </div>
                <div className="field col-12 md:col-3">
                    <label htmlFor="beneficiaryAddress">Type</label>
                    <SelectButton
                        id="type"
                        className="w-full"
                        value={type}
                        onChange={(e) => setType(e.value)}
                        options={[
                            { label: 'Simple', value: 'simple' },
                            { label: 'Blind', value: 'blind' }
                        ]}
                        optionLabel="label"
                    />
                </div>
                <div className="field col-12 md:col-9">
                    <div className="formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="biddingEnd">Bidding ends</label>
                            <Calendar
                                inputId="biddingEnd"
                                className="w-full"
                                showTime
                                value={biddingEnds}
                                onChange={(e) => setBiddingEnds(e.value ?? inOneWeek)}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="revealEnd">Reveal ends</label>
                            <Calendar
                                inputId="revealEnd"
                                className="w-full"
                                showTime
                                value={revealEnds}
                                onChange={(e) => setRevealEnds(e.value ?? inTwoWeeks)}
                                disabled={type === 'simple'}
                            />
                        </div>
                        <div className="field col-12 md:col-9 md:mb-0">
                            <label htmlFor="nftAddress">NFT address</label>
                            <InputText
                                id="nftAddress"
                                className="w-full"
                                value={nftAddress}
                                onChange={(e) => setNftAddress(e.target.value as Address)}
                            />
                        </div>
                        <div className="field col-12 md:col-3 md:mb-0">
                            <label htmlFor="nftTokenId">NFT token ID</label>
                            <InputNumber
                                inputId="nftTokenId"
                                className="w-full"
                                pt={{
                                    input: {
                                        root: {
                                            className: classNames('w-full')
                                        }
                                    }
                                }}
                                value={nftTokenId}
                                onChange={(e) => setNftTokenId(e.value ?? 0)}
                            />
                        </div>
                    </div>
                </div>
                <div className="field col-12 md:col-3 flex flex-column">
                    <label htmlFor="nft">{nftDescriptor?.name ?? 'NFT'}</label>
                    {(!nftDescriptor || !nftDescriptor.image) && (
                        <Skeleton width="100%" height="100%" borderRadius="16px"></Skeleton>
                    )}
                    {nftDescriptor && nftDescriptor.image && (
                        <Image
                            id="nft"
                            width="100%"
                            height="100%"
                            preview
                            src={nftDescriptor.image}
                            alt={nftDescriptor.description ?? ''}
                            title={nftDescriptor.description ?? ''}
                        />
                    )}
                </div>
            </div>
            <TransactionExecutor ref={transactionExecutorRef} />
        </Dialog>
    )
}

export default NewAuctionDialog
