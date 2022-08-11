import { DeployFunction } from 'hardhat-deploy/dist/types'
import { networkConfig } from '../helper-hardhat-config'
import { network } from 'hardhat'
import { getDeployedUnderlyingToken } from '../helpers/network'
import { verifyContract } from '../helpers/verify'

const deployFunction: DeployFunction = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments

  const { PBMDeployer } = await getNamedAccounts()

  const chainId = network.config.chainId

  if (!chainId) {
    throw new Error('Chain ID cannot be retrieved')
  }

  const dsgdContractAddress =
    (await deployments.get('DSGDToken')).address || getDeployedUnderlyingToken(chainId)

  const pbmContract = await deploy('PBMToken', {
    from: PBMDeployer,
    args: [dsgdContractAddress, 'Sample Token', 'STN'],
    // Defaults to 1 confirmation, assuming that network deployed to is local testnet
    waitConfirmations: networkConfig[chainId].waitForConfirmations || 1,
    log: true,
  })

  // Verification not needed for chains without access to etherscan (eg; local-nets)
  if (networkConfig[chainId].type !== 'local-net') {
    await verifyContract({
      address: pbmContract.address,
      args: [dsgdContractAddress, 'Sample Token', 'STN'],
    })
  }
}

export default deployFunction
deployFunction.tags = ['all', 'pbm']
