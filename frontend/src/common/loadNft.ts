import { Address, Client, getAddress, getContract } from 'viem'
import { NFT } from '../contracts/NFT'

export default async function loadNft(
    client: Client,
    nftAddress: Address,
    nftTokenId: number | bigint
): Promise<{ name: string; description: string; image: string } | null> {
    try {
        const nftContract = getContract({
            abi: NFT.abi,
            client: client,
            address: getAddress(nftAddress)
        })
        const tokenUri = await nftContract.read.tokenURI([BigInt(nftTokenId)])
        const response = await fetch(tokenUri)
        const tokenDescriptor = await response.json()
        if ('name' in tokenDescriptor && 'description' in tokenDescriptor && 'image' in tokenDescriptor) {
            return tokenDescriptor
        } else {
            return null
        }
    } catch (e) {
        return null
    }
}
