import { loadFixture } from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { time } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'
import { getAddress, parseEther } from 'viem'

describe('Simple auction', function () {
    async function baseFixture() {
        const publicClient = await hre.viem.getPublicClient()

        const [owner, client1, client2] = await hre.viem.getWalletClients()

        const ownerAddr = getAddress(owner.account.address)
        const addr1 = getAddress(client1.account.address)
        const addr2 = getAddress(client2.account.address)

        return { publicClient, owner, client1, client2, ownerAddr, addr1, addr2 }
    }

    async function nftFixture() {
        const base = await baseFixture()

        const ftsrgNft = await hre.viem.deployContract('FtsrgNft', ['Ftsrg NFT', 'FTSRG'])
        const ftsrgNftTokenId = 0n

        await ftsrgNft.write.mintTo([base.ownerAddr])

        return { ftsrgNft, ftsrgNftTokenId }
    }

    async function simpleAuctionFixture() {
        const base = await baseFixture()
        const nft = await nftFixture()

        const deployTime = await time.latest()

        const simpleAuction = await hre.viem.deployContract('SimpleAuction', [
            BigInt(deployTime + 100),
            base.ownerAddr,
            nft.ftsrgNft.address,
            nft.ftsrgNftTokenId
        ])

        return { simpleAuction, deployTime, ...base, ...nft }
    }

    async function simpleAuctionWrongNftFixture() {
        const base = await baseFixture()
        const nft = await nftFixture()

        const deployTime = await time.latest()

        const simpleAuction = await hre.viem.deployContract('SimpleAuction', [
            BigInt(deployTime + 100),
            base.ownerAddr,
            nft.ftsrgNft.address,
            nft.ftsrgNftTokenId + 1n
        ])

        return { simpleAuction, ...base, ...nft }
    }

    async function simpleAuctionFundedFixture() {
        const base = await baseFixture()
        const nft = await nftFixture()

        const deployTime = await time.latest()

        const simpleAuction = await hre.viem.deployContract('SimpleAuction', [
            BigInt(deployTime + 100),
            base.ownerAddr,
            nft.ftsrgNft.address,
            nft.ftsrgNftTokenId
        ])

        await nft.ftsrgNft.write.transferFrom([base.ownerAddr, simpleAuction.address, nft.ftsrgNftTokenId])

        return { simpleAuction, deployTime, ...base, ...nft }
    }

    describe('Deployment', function () {
        it('Should set the beneficiary', async function () {
            const { simpleAuction, ownerAddr } = await loadFixture(simpleAuctionFixture)
            expect(await simpleAuction.read.beneficiary()).to.equal(ownerAddr)
        })

        it('Should set the bidding end', async function () {
            const { simpleAuction, deployTime } = await loadFixture(simpleAuctionFixture)
            expect(await simpleAuction.read.biddingEnd()).to.equal(deployTime + 100)
        })

        it('Should set the token address', async function () {
            const { simpleAuction, ftsrgNft } = await loadFixture(simpleAuctionFixture)
            expect(await simpleAuction.read.tokenAddress()).to.equal(getAddress(ftsrgNft.address))
        })

        it('Should set the token ID', async function () {
            const { simpleAuction, ftsrgNftTokenId } = await loadFixture(simpleAuctionFixture)
            expect(await simpleAuction.read.tokenId()).to.equal(ftsrgNftTokenId)
        })
    })

    describe('Funding', function () {
        it('Should not be funded by default', async function () {
            const { simpleAuction } = await loadFixture(simpleAuctionFixture)
            expect(await simpleAuction.read.funded()).to.equal(false)
        })

        it('Should be funded after successful NFT transfer', async function () {
            const { simpleAuction, ftsrgNft, ftsrgNftTokenId, ownerAddr } = await loadFixture(simpleAuctionFixture)

            await expect(
                ftsrgNft.write.safeTransferFrom([ownerAddr, simpleAuction.address, ftsrgNftTokenId])
            ).to.changeTokenBalances(ftsrgNft, [ownerAddr, simpleAuction.address], [-1n, 1n])
            expect(await ftsrgNft.read.ownerOf([ftsrgNftTokenId])).to.equal(getAddress(simpleAuction.address))

            expect(await simpleAuction.read.funded()).to.equal(true)
        })

        it('Should not be possible to fund with wrong NFT', async function () {
            const { simpleAuction, ftsrgNft, ftsrgNftTokenId, ownerAddr } =
                await loadFixture(simpleAuctionWrongNftFixture)

            await expect(ftsrgNft.write.safeTransferFrom([ownerAddr, simpleAuction.address, ftsrgNftTokenId])).to.be
                .reverted
        })

        it('Should only be possible to fund an ended auction', async function () {
            const { simpleAuction, client1, client2, ftsrgNft, ftsrgNftTokenId, addr2 } =
                await loadFixture(simpleAuctionFundedFixture)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })
            await simpleAuction.write.bid({ account: client2.account, value: parseEther('1') })

            await time.increase(200)

            await simpleAuction.write.auctionEnd({ account: client1.account })

            await expect(ftsrgNft.write.safeTransferFrom([addr2, simpleAuction.address, ftsrgNftTokenId])).to.be
                .reverted
        })
    })

    describe('Bidding', function () {
        it('Should reject bids while not funded', async function () {
            const { simpleAuction, client1 } = await loadFixture(simpleAuctionFixture)

            await expect(simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') }))
                .to.be.revertedWithCustomError(simpleAuction, 'NotYetFunded')
                .withArgs()
        })

        it('Should accept bids once funded', async function () {
            const { simpleAuction, client1, addr1 } = await loadFixture(simpleAuctionFundedFixture)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })

            expect(await simpleAuction.read.highestBid()).to.equal(parseEther('0.5'))
            expect(await simpleAuction.read.highestBidder()).to.equal(addr1)
        })

        it('Should maintain highestBid and highestBidder properly', async function () {
            const { simpleAuction, client1, client2, addr1, addr2 } = await loadFixture(simpleAuctionFundedFixture)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })

            expect(await simpleAuction.read.highestBid()).to.equal(parseEther('0.5'))
            expect(await simpleAuction.read.highestBidder()).to.equal(addr1)

            await simpleAuction.write.bid({ account: client2.account, value: parseEther('1') })

            expect(await simpleAuction.read.highestBid()).to.equal(parseEther('1'))
            expect(await simpleAuction.read.highestBidder()).to.equal(addr2)
        })

        it('Should emit HighestBidIncreased(msg.sender, msg.value) if bid increased', async function () {
            const { simpleAuction, client1, client2, addr2 } = await loadFixture(simpleAuctionFundedFixture)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })

            await expect(await simpleAuction.write.bid({ account: client2.account, value: parseEther('1') }))
                .to.emit(simpleAuction, 'HighestBidIncreased')
                .withArgs(getAddress(addr2), parseEther('1'))
        })

        it('Should revert if bid is not high enough', async function () {
            const { simpleAuction, client1, client2 } = await loadFixture(simpleAuctionFundedFixture)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })

            await expect(simpleAuction.write.bid({ account: client2.account, value: parseEther('0.5') }))
                .to.be.revertedWithCustomError(simpleAuction, 'BidNotHighEnough')
                .withArgs(parseEther('0.5'))
        })

        it('Should revert if bid is submitted too late', async function () {
            const { simpleAuction, client1, deployTime } = await loadFixture(simpleAuctionFundedFixture)

            await time.increase(200)

            await expect(simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') }))
                .to.be.revertedWithCustomError(simpleAuction, 'TooLate')
                .withArgs(deployTime + 100)
        })
    })

    describe('Returns', function () {
        it('Should add bids that were overbid to pendingReturns', async function () {
            const { simpleAuction, client1, client2, addr1, addr2 } = await loadFixture(simpleAuctionFundedFixture)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })
            await simpleAuction.write.bid({ account: client2.account, value: parseEther('1') })

            expect(await simpleAuction.read.pendingReturns([getAddress(addr1)])).to.equal(parseEther('0.5'))
            expect(await simpleAuction.read.pendingReturns([getAddress(addr2)])).to.equal(parseEther('0'))
        })

        it('Should accumulate pending returns correctly', async function () {
            const { simpleAuction, client1, addr1, addr2 } = await loadFixture(simpleAuctionFundedFixture)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })
            await simpleAuction.write.bid({ account: client1.account, value: parseEther('1') })
            await simpleAuction.write.bid({ account: client1.account, value: parseEther('2') })

            expect(await simpleAuction.read.pendingReturns([getAddress(addr1)])).to.equal(parseEther('1.5'))
            expect(await simpleAuction.read.pendingReturns([getAddress(addr2)])).to.equal(parseEther('0'))
        })

        it('Should allow overbid bids to be withdrawn', async function () {
            const { simpleAuction, client1, client2, addr1 } = await loadFixture(simpleAuctionFundedFixture)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })
            await simpleAuction.write.bid({ account: client2.account, value: parseEther('1') })

            await expect(simpleAuction.write.withdraw({ account: client1.account })).to.changeEtherBalances(
                [addr1, simpleAuction.address],
                [parseEther('0.5'), -parseEther('0.5')]
            )
            expect(await simpleAuction.read.pendingReturns([getAddress(addr1)])).to.equal(parseEther('0'))
        })
    })

    describe('Auction end', function () {
        it('Should revert if auction is ended too early', async function () {
            const { simpleAuction, client1, deployTime } = await loadFixture(simpleAuctionFundedFixture)

            await expect(simpleAuction.write.auctionEnd({ account: client1.account }))
                .to.be.revertedWithCustomError(simpleAuction, 'TooEarly')
                .withArgs(deployTime + 100)
        })

        it('Should transfer the funds to the beneficiary', async function () {
            const { simpleAuction, client1, client2, addr1, addr2, ownerAddr } =
                await loadFixture(simpleAuctionFundedFixture)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })
            await simpleAuction.write.bid({ account: client2.account, value: parseEther('1') })

            await time.increase(200)

            await expect(simpleAuction.write.auctionEnd({ account: client1.account })).to.changeEtherBalances(
                [addr1, addr2, ownerAddr, simpleAuction.address],
                [0, 0, parseEther('1'), -parseEther('1')]
            )
        })

        it('Should transfer the NFT to the highest bidder', async function () {
            const { simpleAuction, client1, client2, addr1, addr2, ownerAddr, ftsrgNft } =
                await loadFixture(simpleAuctionFundedFixture)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })
            await simpleAuction.write.bid({ account: client2.account, value: parseEther('1') })

            await time.increase(200)

            await expect(simpleAuction.write.auctionEnd({ account: client1.account })).to.changeTokenBalances(
                ftsrgNft,
                [addr1, addr2, ownerAddr, simpleAuction.address],
                [0, 1, 0, -1]
            )
        })

        it('Should maintain the ended property correctly', async function () {
            const { simpleAuction, client1, client2 } = await loadFixture(simpleAuctionFundedFixture)

            expect(await simpleAuction.read.ended()).to.equal(false)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })
            await simpleAuction.write.bid({ account: client2.account, value: parseEther('1') })

            await time.increase(200)

            await simpleAuction.write.auctionEnd({ account: client1.account })

            expect(await simpleAuction.read.ended()).to.equal(true)
        })

        it('Should emit AuctionEnded(highestBidder, highestBid)', async function () {
            const { simpleAuction, client1, client2, addr2 } = await loadFixture(simpleAuctionFundedFixture)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })
            await simpleAuction.write.bid({ account: client2.account, value: parseEther('1') })

            await time.increase(200)

            await expect(simpleAuction.write.auctionEnd({ account: client1.account }))
                .to.emit(simpleAuction, 'AuctionEnded')
                .withArgs(addr2, parseEther('1'))
        })

        it('Should only be possible to end an auction once', async function () {
            const { simpleAuction, client1, client2 } = await loadFixture(simpleAuctionFundedFixture)

            await simpleAuction.write.bid({ account: client1.account, value: parseEther('0.5') })
            await simpleAuction.write.bid({ account: client2.account, value: parseEther('1') })

            await time.increase(200)

            await simpleAuction.write.auctionEnd({ account: client1.account })

            await expect(simpleAuction.write.auctionEnd({ account: client1.account }))
                .to.be.revertedWithCustomError(simpleAuction, 'AuctionEndAlreadyCalled')
                .withArgs()
        })
    })
})
