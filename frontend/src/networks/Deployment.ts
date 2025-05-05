import { Address, Chain } from 'viem'

export interface INetwork {
    addresses: {
        auctionFactory: Address
    }
    chain: Chain
}

export function getDeploymentAddress<T extends { [key: string]: string }, K extends keyof T>(
    addresses: T,
    key: K
): Address
export function getDeploymentAddress<T extends { [key: string]: string }, K extends string>(
    addresses: T,
    key: K
): Address
export function getDeploymentAddress<T extends { [key: string]: string }, K extends string>(
    addresses: T,
    key: K
): Address {
    if (key in addresses) {
        const address = addresses[key]
        if (address.startsWith('0x')) {
            return address as Address
        } else {
            throw new Error('Invalid address')
        }
    } else {
        return '0x0'
    }
}
