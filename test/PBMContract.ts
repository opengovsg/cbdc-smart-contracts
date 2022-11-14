import { PBMTokenUpgradeable as PBMToken } from '../typechain-types'
import { ethers } from 'hardhat'
import { time } from '@nomicfoundation/hardhat-network-helpers'

import { expect } from 'chai'
import { dsgdAmount, pbmAmount } from './helpers'
import { initBothContracts, seedWalletStates } from './fixtures/pbm'
import { getUnixTimestamp } from '../helpers/utils'
import { EPOCH_TIME_IN_FUTURE } from './contants'

/*
TODO:
- Abstract away some assertions (eg; not owner)
- Use more fixtures for performance
 */

describe('PBM', () => {
  describe('contract data', () => {
    it('get correct decimal', async () => {
      const { pbmToken, dsgdToken } = await initBothContracts()

      // Retrieve decimals for the 2 contracts
      const pbmDecimals = await pbmToken.decimals()
      const dsgdDecimals = await dsgdToken.decimals()

      // Assertions
      expect(pbmDecimals).to.be.equal(dsgdDecimals)
    })
  })

  describe('roles and ownership', () => {
    it('get correct admin role', async () => {
      const { pbmToken, pbmDeployer } = await initBothContracts()
      const merchantAdminRole = await pbmToken.MERCHANT_ADMIN_ROLE()

      // Assertions
      expect(await pbmToken.owner()).to.be.equal(pbmDeployer.address)
      expect(await pbmToken.hasRole(merchantAdminRole, pbmDeployer.address)).to.be.equal(true)
    })

    it('admin can add merchant role', async () => {
      const { pbmToken, pbmDeployer } = await initBothContracts()
      const merchantRole = await pbmToken.MERCHANT_ROLE()

      // Retrieves a random address
      const [, , randomAccount1] = await ethers.getSigners()
      await pbmToken.connect(pbmDeployer).grantMerchantRole(randomAccount1.address)

      expect(await pbmToken.hasRole(merchantRole, randomAccount1.address)).to.be.equal(true)
    })

    it('admin can remove merchant role', async () => {
      const { pbmToken, pbmDeployer, merchant } = await seedWalletStates()
      const merchantRole = await pbmToken.MERCHANT_ROLE()
      const isMerchantBeforeChange = await pbmToken.hasRole(merchantRole, merchant.address)

      // Makes the role changes
      await pbmToken.connect(pbmDeployer).revokeMerchantRole(merchant.address)
      const isMerchantAfterChange = await pbmToken.hasRole(merchantRole, merchant.address)

      // Assertions
      expect(isMerchantBeforeChange).to.be.equal(true)
      expect(isMerchantAfterChange).to.be.equal(false)
    })

    it('non-admin cannot add/remove merchant role', async () => {
      const { pbmToken, merchant, resident } = await seedWalletStates()
      const merchantAdminRole = await pbmToken.MERCHANT_ADMIN_ROLE()

      const unauthorisedGrant = pbmToken.connect(resident).grantMerchantRole(resident.address)
      const unauthorisedRemoval = pbmToken.connect(resident).revokeMerchantRole(merchant.address)

      // Assertions
      await expect(unauthorisedGrant).to.be.revertedWith(
        `AccessControl: account ${resident.address.toLowerCase()} is missing role ${merchantAdminRole.toLowerCase()}`
      )

      await expect(unauthorisedRemoval).to.be.revertedWith(
        `AccessControl: account ${resident.address.toLowerCase()} is missing role ${merchantAdminRole.toLowerCase()}`
      )
    })

    it('merchant cannot renounce merchant role', async () => {
      const { pbmToken, merchant } = await seedWalletStates()
      const merchantRole = await pbmToken.MERCHANT_ROLE()

      // Merchant attempts to revoke
      const merchantSelfRenounceTransaction = pbmToken
        .connect(merchant)
        .renounceRole(merchantRole, merchant.address)

      // Assertions
      await expect(merchantSelfRenounceTransaction).to.be.revertedWith(
        'feature blocked for current trial'
      )
    })
  })

  describe('minting', () => {
    it('should not be able to mint without DSGD approval', async () => {
      // Setup base fund for PBM Organiser
      const { pbmToken, pbmDeployer, dsgdToken, dsgdDeployer } = await initBothContracts()
      await dsgdToken.connect(dsgdDeployer).mint(pbmDeployer.address, dsgdAmount(100))

      const [, , randomAccount1] = await ethers.getSigners()

      // Attempt to mint PBM tokens to a random address
      const mintToRandom = pbmToken
        .connect(pbmDeployer)
        .wrapMint(randomAccount1.address, pbmAmount(40))

      const mintToSelf = pbmToken.connect(pbmDeployer).wrapMint(pbmDeployer.address, pbmAmount(40))

      // Assertions
      await expect(mintToRandom).to.be.revertedWith('ERC20: insufficient allowance')
      await expect(mintToSelf).to.be.revertedWith('ERC20: insufficient allowance')

      expect(await pbmToken.totalSupply()).to.equal(0)
      expect(await dsgdToken.balanceOf(pbmDeployer.address)).to.equal(dsgdAmount(100))
    })

    it('should be able to mint when DSGD approved', async () => {
      const { pbmToken, pbmDeployer, dsgdToken, dsgdDeployer } = await initBothContracts()
      // Setup base fund for PBM Organiser
      await dsgdToken.connect(dsgdDeployer).mint(pbmDeployer.address, dsgdAmount(100))
      await dsgdToken.connect(pbmDeployer).approve(pbmToken.address, dsgdAmount(40))

      // Init contract to be associated to owner (treat as connect(pbmDeployer))
      const pbmTokenAsOwner: PBMToken = await pbmToken.connect(pbmDeployer)
      const mintToSelf = pbmTokenAsOwner.wrapMint(pbmDeployer.address, pbmAmount(10))

      // Assertions
      await expect(mintToSelf).to.changeTokenBalance(
        pbmTokenAsOwner,
        pbmDeployer.address,
        pbmAmount(10)
      )

      await expect(mintToSelf).to.changeTokenBalances(
        dsgdToken,
        [pbmDeployer.address, pbmTokenAsOwner.address],
        [dsgdAmount(-10), pbmAmount(10)]
      )
    })

    it('should not be able to mint when non-owner address used', async () => {
      const { pbmToken, dsgdToken, dsgdDeployer } = await initBothContracts()
      // Setup base fund for random account
      const [, , randomAccount1] = await ethers.getSigners()
      await dsgdToken.connect(dsgdDeployer).mint(randomAccount1.address, dsgdAmount(100))

      await dsgdToken.connect(randomAccount1).approve(pbmToken.address, dsgdAmount(40))

      const unauthorisedMintTransaction = pbmToken
        .connect(randomAccount1)
        .wrapMint(randomAccount1.address, pbmAmount(10))

      // Assertions
      await expect(unauthorisedMintTransaction).to.be.revertedWith('not owner')

      // Verify token supply remains intact (for sanity)
      expect(await pbmToken.totalSupply()).to.equal(pbmAmount(0))
    })

    it('should reflect consistent supply state', async () => {
      const { resident, pbmToken, pbmDeployer, initialResidentBalance, dsgdToken } =
        await seedWalletStates()

      // Assertions (on PBM)
      expect(await pbmToken.totalSupply()).to.equal(pbmAmount(initialResidentBalance))
      expect(await pbmToken.balanceOf(resident.address)).to.equal(pbmAmount(initialResidentBalance))
      expect(await pbmToken.balanceOf(pbmDeployer.address)).to.equal(pbmAmount(0))

      // Assertions (on DSGD)
      expect(await dsgdToken.balanceOf(pbmToken.address)).to.be.equal(
        dsgdAmount(initialResidentBalance)
      )
      expect(await dsgdToken.balanceOf(pbmDeployer.address)).to.be.equal(
        dsgdAmount(100 - initialResidentBalance)
      )
    })
  })

  describe('pause', () => {
    it('should be pausable by owner', async () => {
      const { resident, merchant, pbmToken, pbmDeployer } = await seedWalletStates()
      await pbmToken.connect(pbmDeployer).pause()

      // Assertions

      expect(await pbmToken.paused()).to.be.equal(true)
      // Assert that no redemptions can happen while paused
      await expect(
        pbmToken.connect(resident).redeem(merchant.address, pbmAmount(1))
      ).to.be.revertedWith('ERC20Pausable: token transfer while paused')

      // Assert that no minting can happen while paused
      await expect(
        pbmToken.connect(pbmDeployer).wrapMint(resident.address, pbmAmount(10))
      ).to.be.revertedWith('ERC20Pausable: token transfer while paused')

      // Assert that no transfers can happen while paused
      await expect(
        pbmToken.connect(resident).transfer(pbmDeployer.address, pbmAmount(10))
      ).to.be.revertedWith('ERC20Pausable: token transfer while paused')
    })

    it('should not be pausable by non-owner identities', async () => {
      const { pbmToken, resident, merchant, dsgdDeployer } = await seedWalletStates()

      await expect(pbmToken.connect(resident).pause()).to.be.revertedWith('not owner')
      await expect(pbmToken.connect(merchant).pause()).to.be.revertedWith('not owner')
      await expect(pbmToken.connect(dsgdDeployer).pause()).to.be.revertedWith('not owner')
    })

    it('should be un-pausable', async () => {
      const { pbmToken, pbmDeployer, resident } = await seedWalletStates()
      const pbmTokenAsOwner = pbmToken.connect(pbmDeployer)

      await pbmTokenAsOwner.pause()
      const unpauseContract = pbmTokenAsOwner.unpause()
      const mintToResident = pbmTokenAsOwner.wrapMint(resident.address, pbmAmount(10))

      await expect(unpauseContract).to.emit(pbmToken, 'Unpaused')
      await expect(mintToResident).to.emit(pbmToken, 'Transfer')
      await expect(mintToResident).to.changeTokenBalance(pbmToken, resident.address, pbmAmount(10))
    })
  })

  describe('transaction ', () => {
    it('should be able to dissolve to merchants, with PBM burn', async () => {
      const { pbmToken, dsgdToken, resident, merchant, pbmDeployer, initialResidentBalance } =
        await seedWalletStates()

      const dissolveToMerchant = pbmToken.connect(resident).redeem(merchant.address, pbmAmount(1))

      // Assertions
      await expect(dissolveToMerchant).to.changeTokenBalances(
        pbmToken,
        [resident, merchant],
        [pbmAmount(-1), pbmAmount(0)]
      )

      // Expect dsgd contract to reflect:
      // - resident and PBM owner not losing any dsgd
      // - merchant gain 1 dsgd
      // - pbm contract losing 1 dsgd
      await expect(dissolveToMerchant).to.changeTokenBalances(
        dsgdToken,
        [resident, merchant, pbmToken, pbmDeployer],
        [dsgdAmount(0), dsgdAmount(1), dsgdAmount(-1), dsgdAmount(0)]
      )

      // Burn has token place successfully
      expect(await pbmToken.totalSupply()).to.be.equal(pbmAmount(initialResidentBalance - 1))
    })
    it('should not be able to dissolve to non-merchants', async () => {
      const { pbmToken, resident } = await seedWalletStates()

      const selfDissolve = pbmToken.connect(resident).redeem(resident.address, pbmAmount(1))

      await expect(selfDissolve).to.be.revertedWith('recipient not an approved merchant')
    })
    it('should not be able to dissolve if no ownership of PBM ', async () => {
      const { pbmToken, merchant, initialResidentBalance } = await seedWalletStates()

      const nonHolderDissolve = pbmToken.connect(merchant).redeem(merchant.address, pbmAmount(1))

      await expect(nonHolderDissolve).to.be.revertedWith('ERC20: burn amount exceeds balance')
      expect(await pbmToken.totalSupply()).to.be.equal(pbmAmount(initialResidentBalance))
    })
  })

  describe('contract expiry', () => {
    it('should be able to extend an expiry for active contract', async () => {
      const { pbmToken, pbmDeployer } = await seedWalletStates()
      // Attempts to extend contract expiry to 2024
      await pbmToken.connect(pbmDeployer).extendExpiry(EPOCH_TIME_IN_FUTURE)
      expect(await pbmToken.contractExpiry()).to.be.equal(EPOCH_TIME_IN_FUTURE)
    })

    it('should not be able to shorten expiry for active contract', async () => {
      const { pbmToken, pbmDeployer } = await seedWalletStates()
      const currentExpiryDate = await pbmToken.contractExpiry()

      // Attempt to shorten the expiry date by 1 second
      const reduceExpiryTransaction = pbmToken
        .connect(pbmDeployer)
        .extendExpiry(currentExpiryDate.sub(1))

      await expect(reduceExpiryTransaction).to.be.revertedWith('cannot shorten expiry date')
      expect(await pbmToken.contractExpiry()).to.be.equal(currentExpiryDate)
    })

    it('should not be able to extend an expiry for an already expired contract', async () => {
      const { pbmToken, pbmDeployer } = await seedWalletStates()
      const originalExpiryDate = await pbmToken.contractExpiry()

      // Manipulate HRE to forward world time to expiry date
      await time.increaseTo(originalExpiryDate)

      // Attempts to extend contract expiry to 2024
      const updateExpiryOnExpiredContractTransaction = pbmToken
        .connect(pbmDeployer)
        .extendExpiry(EPOCH_TIME_IN_FUTURE)

      await expect(updateExpiryOnExpiredContractTransaction).to.be.revertedWith('contract expired')
      expect(await pbmToken.contractExpiry()).to.be.equal(originalExpiryDate)
    })

    it('should freeze transaction activities on expiry', async () => {
      const { pbmToken, pbmDeployer, merchant, resident } = await seedWalletStates()
      const currentExpiryDate = await pbmToken.contractExpiry()

      // Manipulate HRE to forward world time to expiry date
      await time.increaseTo(currentExpiryDate)

      // Assert that no redemptions can happen while expired
      await expect(
        pbmToken.connect(resident).redeem(merchant.address, pbmAmount(1))
      ).to.be.revertedWith('contract expired')

      // Assert that no minting can happen while expired
      await expect(
        pbmToken.connect(pbmDeployer).wrapMint(resident.address, pbmAmount(10))
      ).to.be.revertedWith('contract expired')

      // Assert that no transfers can happen while expired
      await expect(
        pbmToken.connect(resident).transfer(pbmDeployer.address, pbmAmount(10))
      ).to.be.revertedWith('contract expired')
    })
  })

  describe('transfers', () => {
    it('can transfer to another identity', async () => {
      const {
        pbmToken,
        resident: firstResident,
        merchant: secondResident,
      } = await seedWalletStates()

      // Transfers to a second resident
      const pbmTransfer = pbmToken
        .connect(firstResident)
        .transfer(secondResident.address, pbmAmount(10))

      await expect(pbmTransfer).to.changeTokenBalances(
        pbmToken,
        [firstResident, secondResident],
        [pbmAmount(-10), pbmAmount(10)]
      )
    })
  })

  describe('contract withdrawal', () => {
    it('should not be able to withdraw before expiry', async () => {
      const { pbmToken, pbmDeployer, dsgdToken } = await seedWalletStates()
      const initialSupply = await pbmToken.totalSupply()

      // Attempts to pull out all existing funds from contract
      const withdrawalTransaction = pbmToken.connect(pbmDeployer).withdraw()

      await expect(withdrawalTransaction).to.be.revertedWith('contract expiry not reached')
      expect(await dsgdToken.balanceOf(pbmToken.address)).to.be.equal(initialSupply)
    })

    it('should be able to withdraw on expiry', async () => {
      const { pbmToken, pbmDeployer, dsgdToken } = await seedWalletStates()
      const originalExpiryTime = await pbmToken.contractExpiry()
      const initialSupply = await pbmToken.totalSupply()

      // Manipulate HRE to forward world time to expiry date
      await time.increaseTo(originalExpiryTime)
      const withdrawalTransaction = pbmToken.connect(pbmDeployer).withdraw()

      // Expect correct flow of dsgd tokens
      await expect(withdrawalTransaction).to.changeTokenBalances(
        dsgdToken,
        [pbmToken.address, pbmDeployer.address],
        [initialSupply.mul(-1), initialSupply]
      )
    })

    it('should not be able to withdraw by non-owner', async () => {
      const { pbmToken, resident } = await seedWalletStates()
      const originalExpiryTime = await pbmToken.contractExpiry()

      // Manipulate HRE to forward world time to expiry date
      await time.increaseTo(originalExpiryTime)
      // Makes transaction without owner credentials
      const withdrawalTransaction = pbmToken.connect(resident).withdraw()

      // Expect correct flow of dsgd tokens
      await expect(withdrawalTransaction).to.be.revertedWith('not owner')
    })
  })
})
