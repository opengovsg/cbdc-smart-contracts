import { DeployFunction } from 'hardhat-deploy/dist/types'
import { deploymentConfig } from '../helper-hardhat-config'
import { network } from 'hardhat'
import { verifyContract } from '../helpers/verify'

const deployFunction: DeployFunction = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments

  const { DSGDDeployer } = await getNamedAccounts()

  const chainId = network.config.chainId

  if (!chainId) {
    throw new Error('Chain ID cannot be retrieved')
  }

  const pbmContract = await deploy('DSGDToken', {
    from: DSGDDeployer,
    args: [],
    // Defaults to 1 confirmation, assuming that network deployed to is local testnet
    waitConfirmations: deploymentConfig[chainId].waitForConfirmations || 1,
    log: true,
  })

  // Verification not needed for chains without access to etherscan (eg; local-nets)
  if (deploymentConfig[chainId].type !== 'local-net') {
    await verifyContract({
      address: pbmContract.address,
      args: [],
    })
  }
}

export default deployFunction
deployFunction.tags = ['dsgd']
