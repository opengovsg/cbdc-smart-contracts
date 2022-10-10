import { DeployFunction } from 'hardhat-deploy/dist/types'
import { ethers, network, upgrades } from 'hardhat'
import { getDeployedUnderlyingToken } from '../helpers/network'

const tentativeExpiryDate = 1672531200

const deployFunction: DeployFunction = async ({ deployments }) => {
  console.log('fired deployment')
  const pbmDeployer = await ethers.getNamedSigner('PBMDeployer')

  const chainId = network.config.chainId

  if (!chainId) {
    throw new Error('Chain ID cannot be retrieved')
  }

  const dsgdContractAddress =
    (await deployments.get('DSGDToken')).address || getDeployedUnderlyingToken(chainId)

  const Pbm = await ethers.getContractFactory('PBMToken', { signer: pbmDeployer })

  const pbmContract = await upgrades.deployProxy(
    Pbm,
    [dsgdContractAddress, 'PBM Sample Token', 'XPBM', tentativeExpiryDate],
    { kind: 'transparent' }
  )

  await pbmContract.deployed()

  console.log('pbm contract is at address', pbmContract.address)
  console.log('pbm contract is at address', pbmContract.address)

  // Console.log('waiting to verify')
  //
  // await verifyContract({ address: pbmContract.address, args: [] })
}

export default deployFunction
deployFunction.tags = ['all', 'pbm-upgradeable', 'deploy']
