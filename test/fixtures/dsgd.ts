import { deployments } from 'hardhat'
import { DSGDToken } from '../../typechain-types'

export const initDsgd = deployments.createFixture(async ({ deployments, ethers }) => {
  await deployments.fixture(['dsgd'])
  const dsgdToken: DSGDToken = await ethers.getContract('DSGDToken')
  const dsgdDeployer = await ethers.getNamedSigner('DSGDDeployer')
  return {
    dsgdToken,
    dsgdDeployer,
  }
})
