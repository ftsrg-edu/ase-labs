import { useState, useEffect } from 'react'
import { GetContractReturnType, Client, Address, getContract, getAddress } from 'viem'
import useClient from './useClient'
import useNetwork from './useNetwork'
import { NFT } from '../contracts/NFT'

export default function useNft(nftAddress: Address) {
    const [network] = useNetwork()
    const [client] = useClient()

    const [nftContract, setNftContract] = useState(
        null as GetContractReturnType<typeof NFT.abi, Client, Address> | null
    )

    useEffect(() => {
        try {
            if (!network || !client) {
                setNftContract(null)
                return
            }

            const nftContract = getContract({
                abi: NFT.abi,
                client: client,
                address: getAddress(nftAddress)
            })
            setNftContract(nftContract)
            setNftContract(nftContract)
        } catch (e) {
            setNftContract(null)
            console.error(e)
        }
    }, [nftAddress, client, network])

    return [nftContract] as const
}
