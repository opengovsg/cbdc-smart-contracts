import { deployments } from 'hardhat'
import { dsgdAmount, pbmAmount } from '../helpers'
import { DSGDToken, PBMTokenUpgradeable as PBMToken } from '../../typechain-types'

// See benefits of fixtures here:
// https://hardhat.org/tutorial/testing-contracts#reusing-common-test-setups-with-fixtures
// Note: Hardhat bugs out when nesting fixtures directly. The solution here is having hardhat-deploy
// manage these fixtures via deployments.createFixture

// Fixture for init-ing contracts
export const initBothContracts = deployments.createFixture(async ({ deployments, ethers }) => {
  await deployments.fixture(['dsgd', 'pbm-upgradeable'])

  // Sets up identities
  const pbmDeployer = await ethers.getNamedSigner('PBMDeployer')
  const dsgdDeployer = await ethers.getNamedSigner('DSGDDeployer')

  // Setup contracts
  const pbmToken: PBMToken = await ethers.getContract('PBMTokenUpgradeable')
  const dsgdToken: DSGDToken = await ethers.getContract('DSGDToken')

  return {
    pbmToken,
    pbmDeployer,
    dsgdToken,
    dsgdDeployer,
  }
})

// Fixture for initializing chain state with minimum required wallets
export const seedWalletStates = deployments.createFixture(async ({ ethers }) => {
  const { pbmToken, pbmDeployer, dsgdToken, dsgdDeployer } = await initBothContracts()
  const initialSeedAmount = 10

  // Executes the mint and approve flow
  await dsgdToken.connect(dsgdDeployer).mint(pbmDeployer.address, dsgdAmount(100))
  await dsgdToken.connect(pbmDeployer).approve(pbmToken.address, dsgdAmount(100))

  // TODO: Figure out a better way for dealing with wallet identities
  const [, , resident, merchant] = await ethers.getSigners()

  const pbmTokenAsOwner = pbmToken.connect(pbmDeployer)

  await pbmTokenAsOwner.wrapMint(resident.address, pbmAmount(initialSeedAmount))

  await pbmTokenAsOwner.grantMerchantRole(merchant.address)

  return {
    pbmToken,
    pbmDeployer,
    dsgdToken,
    dsgdDeployer,
    resident,
    merchant,
    initialResidentBalance: initialSeedAmount,
  }
})
