import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { time } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import hre, { viem } from 'hardhat'
import { getAddress, parseEther, keccak256, encodePacked, toBytes, toHex } from 'viem'

function blindBid(value: bigint, fake: boolean, secret: `0x${string}`) {
    return keccak256(encodePacked(['uint256', 'bool', 'bytes32'], [value, fake, secret]))
}

const secret1: `0x${string}` = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
const secret2: `0x${string}` = '0x9876543210abcdef1234567890abcdef1234567890abcdef1234567890abcdef'

describe('Blind auction', function () {
    async function deployBlindAuctionFixture() {
        const publicClient = await hre.viem.getPublicClient()

        const [owner, client1, client2] = await hre.viem.getWalletClients()

        const ownerAddr = getAddress(owner.account.address)
        const addr1 = getAddress(client1.account.address)
        const addr2 = getAddress(client2.account.address)

        const nft = await hre.viem.deployContract('FtsrgNft', ['FTSRG NFT', 'FTSRG'], { client: { wallet: owner } })

        const deployTime = await time.latest()
        const blindAuction = await hre.viem.deployContract('BlindAuction', [
            BigInt(deployTime + 100),
            BigInt(deployTime + 200),
            ownerAddr,
            nft.address,
            0n
        ])

        return { blindAuction, owner, client1, client2, ownerAddr, addr1, addr2, deployTime, publicClient, nft }
    }

    async function deployBlindAuctionFixtureFunded() {
        const { blindAuction, owner, client1, client2, ownerAddr, addr1, addr2, deployTime, publicClient, nft } =
            await deployBlindAuctionFixture()

        await nft.write.mintTo([getAddress(ownerAddr)], { account: owner.account })

        await nft.write.safeTransferFrom([getAddress(ownerAddr), getAddress(blindAuction.address), 0n], {
            account: owner.account
        })

        return { blindAuction, owner, client1, client2, ownerAddr, addr1, addr2, deployTime, publicClient, nft }
    }

    describe('Deployment', function () {
        it('Should set the beneficiary', async function () {
            const { blindAuction, ownerAddr } = await loadFixture(deployBlindAuctionFixture)
            expect(await blindAuction.read.beneficiary()).to.equal(ownerAddr)
        })

        it('Should set the bidding end', async function () {
            const { blindAuction, deployTime } = await loadFixture(deployBlindAuctionFixture)
            expect(await blindAuction.read.biddingEnd()).to.equal(deployTime + 100)
        })

        it('Should set the reveal end', async function () {
            const { blindAuction, deployTime } = await loadFixture(deployBlindAuctionFixture)
            expect(await blindAuction.read.revealEnd()).to.equal(deployTime + 200)
        })

        it('Should set the token address and token Id', async function () {
            const { blindAuction, deployTime, nft } = await loadFixture(deployBlindAuctionFixture)
            expect(await blindAuction.read.tokenAddress()).to.equal(getAddress(nft.address))
            expect(await blindAuction.read.tokenId()).to.equal(0n)
        })
    })

    describe('Funding', function () {
        it("Can't access methods until the auction is funded", async function () {
            const { blindAuction, client1, owner } = await loadFixture(deployBlindAuctionFixture)

            const blinded = blindBid(BigInt(1), true, secret1)

            expect(
                blindAuction.write.bid([blinded], {
                    account: client1.account,
                    value: parseEther('1')
                })
            ).to.be.revertedWith('NotFunded')

            expect(
                blindAuction.write.reveal([[BigInt(1)], [true], [secret1]], {
                    account: client1.account
                })
            ).to.be.revertedWith('NotFunded')

            expect(
                blindAuction.write.auctionEnd({
                    account: owner.account
                })
            ).to.be.revertedWith('NotFunded')
        })

        it('Auction is not funded until NFT is transferred', async function () {
            const { blindAuction, client1, nft, owner, ownerAddr } = await loadFixture(deployBlindAuctionFixture)

            expect(await blindAuction.read.funded()).to.equal(false)
        })

        it('Auction is funded after NFT is transferred', async function () {
            const { blindAuction, client1, nft, owner, ownerAddr } = await loadFixture(deployBlindAuctionFixture)

            await nft.write.mintTo([getAddress(ownerAddr)], { account: owner.account })

            await nft.write.safeTransferFrom([getAddress(ownerAddr), getAddress(blindAuction.address), 0n], {
                account: owner.account
            })

            expect(await blindAuction.read.funded()).to.equal(true)
        })
    })

    describe('Bidding', function () {
        it('Single bid gets added to bids', async function () {
            const { blindAuction, client1, addr1 } = await loadFixture(deployBlindAuctionFixtureFunded)

            const blinded = blindBid(BigInt(1), true, secret1)

            await blindAuction.write.bid([blinded], {
                account: client1.account,
                value: parseEther('1')
            })

            const addedBid = await blindAuction.read.bids([getAddress(addr1), 0n])
            expect(addedBid[0]).to.equal(blinded)
            expect(addedBid[1]).to.equal(parseEther('1'))
        })

        it('Two bids get added to bids', async function () {
            const { blindAuction, client1, addr1 } = await loadFixture(deployBlindAuctionFixtureFunded)

            const blinded1 = blindBid(BigInt(1), true, secret1)
            const blinded2 = blindBid(BigInt(4), true, secret2)

            await blindAuction.write.bid([blinded1], {
                account: client1.account,
                value: parseEther('1')
            })

            await blindAuction.write.bid([blinded2], {
                account: client1.account,
                value: parseEther('2')
            })

            const addedBid1 = await blindAuction.read.bids([getAddress(addr1), 0n])
            const addedBid2 = await blindAuction.read.bids([getAddress(addr1), 1n])
            expect(addedBid1[0]).to.equal(blinded1)
            expect(addedBid1[1]).to.equal(parseEther('1'))
            expect(addedBid2[0]).to.equal(blinded2)
            expect(addedBid2[1]).to.equal(parseEther('2'))
        })

        it('Bids from separate accounts', async function () {
            const { blindAuction, client1, client2, addr1, addr2 } = await loadFixture(deployBlindAuctionFixtureFunded)

            const blinded = blindBid(BigInt(1), true, secret1)

            await blindAuction.write.bid([blinded], {
                account: client1.account,
                value: parseEther('1')
            })

            await blindAuction.write.bid([blinded], {
                account: client2.account,
                value: parseEther('2')
            })

            const addedBid1 = await blindAuction.read.bids([getAddress(addr1), 0n])
            const addedBid2 = await blindAuction.read.bids([getAddress(addr2), 0n])
            expect(addedBid1[0]).to.equal(blinded)
            expect(addedBid1[1]).to.equal(parseEther('1'))
            expect(addedBid2[0]).to.equal(blinded)
            expect(addedBid2[1]).to.equal(parseEther('2'))
        })

        it('Should emit BidReceived(address sender, bytes32 blindedBid, uint deposit)', async function () {
            const { blindAuction, client1, addr1 } = await loadFixture(deployBlindAuctionFixtureFunded)

            const blinded = blindBid(BigInt(1), true, secret1)

            await expect(
                blindAuction.write.bid([blinded], {
                    account: client1.account,
                    value: parseEther('1')
                })
            )
                .to.emit(blindAuction, 'BidReceived')
                .withArgs(getAddress(addr1), blinded, parseEther('1'))
        })

        // it('Should emit HighestBidIncreased(msg.sender, msg.value) if bid increased', async function () {
        //     const { blindAuction, client1, client2, addr1, addr2 } = await loadFixture(deployBlindAuctionFixtureFunded)

        //     await blindAuction.write.bid({ account: client1.account, value: parseEther('0.5') })

        //     await expect(await blindAuction.write.bid({ account: client2.account, value: parseEther('1') }))
        //         .to.emit(blindAuction, 'HighestBidIncreased')
        //         .withArgs(getAddress(addr2), parseEther('1'))
        // })

        // it('Should revert if bid is not high enough', async function () {
        //     const { blindAuction, client1, client2, addr1 } = await loadFixture(deployBlindAuctionFixtureFunded)

        //     await blindAuction.write.bid({ account: client1.account, value: parseEther('0.5') })

        //     await expect(blindAuction.write.bid({ account: client2.account, value: parseEther('0.5') }))
        //         .to.be.revertedWithCustomError(blindAuction, 'BidNotHighEnough')
        //         .withArgs(parseEther('0.5'))
        // })
    })

    describe('Revealing', function () {
        it('Successful reveal should emit RevealedBid(msg.sender, bidToCheck.blindedBid, fake, value)', async function () {
            const { blindAuction, client1, addr1 } = await loadFixture(deployBlindAuctionFixtureFunded)

            const blinded = blindBid(BigInt(1), true, secret1)

            await blindAuction.write.bid([blinded], {
                account: client1.account,
                value: parseEther('1')
            })

            await time.increase(120)

            await expect(
                blindAuction.write.reveal([[BigInt(1)], [true], [secret1]], {
                    account: client1.account
                })
            )
                .to.emit(blindAuction, 'RevealedBid')
                .withArgs(getAddress(addr1), blinded, true, BigInt(1))
        })

        it('Multiple bids are revealed at once', async function () {
            const { blindAuction, client1, addr1 } = await loadFixture(deployBlindAuctionFixtureFunded)

            const blinded1 = blindBid(BigInt(1), true, secret1)
            const blinded2 = blindBid(BigInt(2), false, secret2)

            await blindAuction.write.bid([blinded1], {
                account: client1.account,
                value: parseEther('1')
            })

            await blindAuction.write.bid([blinded2], {
                account: client1.account,
                value: parseEther('2')
            })

            await time.increase(120)

            await expect(
                blindAuction.write.reveal(
                    [
                        [BigInt(1), BigInt(2)],
                        [true, false],
                        [secret1, secret2]
                    ],
                    {
                        account: client1.account
                    }
                )
            )
                .to.emit(blindAuction, 'RevealedBid')
                .withArgs(getAddress(addr1), blinded1, true, BigInt(1))
                .to.emit(blindAuction, 'RevealedBid')
                .withArgs(getAddress(addr1), blinded2, false, BigInt(2))
        })

        it('Revealed bids are cleared', async function () {
            const { blindAuction, client1, addr1 } = await loadFixture(deployBlindAuctionFixtureFunded)

            const blinded1 = blindBid(BigInt(1), true, secret1)
            const blinded2 = blindBid(BigInt(2), false, secret2)

            await blindAuction.write.bid([blinded1], {
                account: client1.account,
                value: parseEther('1')
            })

            await blindAuction.write.bid([blinded2], {
                account: client1.account,
                value: parseEther('2')
            })

            await time.increase(120)

            await blindAuction.write.reveal(
                [
                    [BigInt(1), BigInt(2)],
                    [true, false],
                    [secret1, secret2]
                ],
                {
                    account: client1.account
                }
            )

            const bid1 = await blindAuction.read.bids([getAddress(addr1), 0n])
            const bid2 = await blindAuction.read.bids([getAddress(addr1), 1n])
            expect(bid1[0]).to.equal(0n)
            expect(bid2[0]).to.equal(0n)
        })

        it('Should revert if reveals have incorrect length', async function () {
            const { blindAuction, client1, addr1 } = await loadFixture(deployBlindAuctionFixtureFunded)

            const blinded1 = blindBid(BigInt(1), true, secret1)
            const blinded2 = blindBid(BigInt(2), false, secret2)

            await blindAuction.write.bid([blinded1], {
                account: client1.account,
                value: parseEther('1')
            })

            await blindAuction.write.bid([blinded2], {
                account: client1.account,
                value: parseEther('2')
            })

            await time.increase(120)

            await expect(
                blindAuction.write.reveal([[BigInt(1)], [true, false], [secret1, secret2]], {
                    account: client1.account
                })
            ).to.be.revertedWithoutReason()

            await expect(
                blindAuction.write.reveal([[BigInt(1), BigInt(2)], [true], [secret1, secret2]], {
                    account: client1.account
                })
            ).to.be.revertedWithoutReason()

            await expect(
                blindAuction.write.reveal([[BigInt(1), BigInt(2)], [true, false], [secret1]], {
                    account: client1.account
                })
            ).to.be.revertedWithoutReason()
        })

        it('The hash has to match for the bid to be revealed', async function () {
            const { blindAuction, client1, addr1 } = await loadFixture(deployBlindAuctionFixtureFunded)

            const blinded = blindBid(BigInt(1), false, secret1)

            await blindAuction.write.bid([blinded], {
                account: client1.account,
                value: parseEther('0.5')
            })

            await time.increase(120)

            await expect(
                blindAuction.write.reveal([[BigInt(0)], [false], [secret1]], {
                    account: client1.account
                })
            ).not.to.emit(blindAuction, 'RevealedBid')

            await expect(
                blindAuction.write.reveal([[BigInt(1)], [true], [secret1]], {
                    account: client1.account
                })
            ).not.to.emit(blindAuction, 'RevealedBid')

            await expect(
                blindAuction.write.reveal([[BigInt(1)], [false], [secret2]], {
                    account: client1.account
                })
            ).not.to.emit(blindAuction, 'RevealedBid')
        })
    })

    // describe('Returns', function () {
    //     it('Bids that were overbid get added to pendingReturns', async function () {
    //         const { blindAuction, client1, client2, addr1, addr2 } = await loadFixture(deployBlindAuctionFixtureFunded)

    //         await blindAuction.write.bid({ account: client1.account, value: parseEther('0.5') })
    //         await blindAuction.write.bid({ account: client2.account, value: parseEther('1') })

    //         expect(await blindAuction.read.pendingReturns([getAddress(addr1)])).to.equal(parseEther('0.5'))
    //         expect(await blindAuction.read.pendingReturns([getAddress(addr2)])).to.equal(parseEther('0'))
    //     })

    //     it('Pending returns accumulate correctly', async function () {
    //         const { blindAuction, client1, client2, addr1, addr2 } = await loadFixture(deployBlindAuctionFixtureFunded)

    //         await blindAuction.write.bid({ account: client1.account, value: parseEther('0.5') })
    //         await blindAuction.write.bid({ account: client1.account, value: parseEther('1') })
    //         await blindAuction.write.bid({ account: client1.account, value: parseEther('2') })

    //         expect(await blindAuction.read.pendingReturns([getAddress(addr1)])).to.equal(parseEther('1.5'))
    //         expect(await blindAuction.read.pendingReturns([getAddress(addr2)])).to.equal(parseEther('0'))
    //     })

    //     it('Bids that were overbid can be withdrawn', async function () {
    //         const { blindAuction, client1, client2, addr1, addr2, publicClient } =
    //             await loadFixture(deployBlindAuctionFixture)

    //         await blindAuction.write.bid({ account: client1.account, value: parseEther('0.5') })
    //         await blindAuction.write.bid({ account: client2.account, value: parseEther('1') })

    //         const initialBalance = await publicClient.getBalance({ address: addr1 })

    //         // const gasEstimate = await blindAuction.estimateGas.withdraw({ account: client1.account })
    //         // const gasPrice = await publicClient.getGasPrice()
    //         // const totalGasCost = gasEstimate * gasPrice // Total gas cost

    //         await blindAuction.write.withdraw({ account: client1.account })

    //         const endingBalance = await publicClient.getBalance({ address: addr1 })

    //         expect(await blindAuction.read.pendingReturns([getAddress(addr1)])).to.equal(parseEther('0'))
    //         expect(endingBalance).to.be.greaterThan(initialBalance + parseEther('0.4'))
    //         expect(endingBalance).to.be.lessThanOrEqual(initialBalance + parseEther('0.5'))
    //     })
    // })
})
