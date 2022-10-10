import { DeployFunction } from 'hardhat-deploy/dist/types'
import { network, ethers, upgrades } from 'hardhat'
import { getDeployedUnderlyingToken } from '../helpers/network'

const tentativeExpiryDate = 1672531200

// NOTE: This deployment uses a separate `hardhat-upgrades` package for deployment
// This library is maintained by OZ, and deployments tracking is reflected in .openzepellin
// hardhat-deploy is only used for it's save/get deployment artifact feature
// hardhat-deploy's upgradeable deployment features lack some OZ features
// Tracking issue https://github.com/wighawag/hardhat-deploy/issues/355

const deployFunction: DeployFunction = async ({ deployments }) => {
  // Get Deployment configurations
  const { save, log } = deployments
  const pbmDeployer = await ethers.getNamedSigner('PBMDeployer')

  const chainId = network.config.chainId

  if (!chainId) {
    throw new Error('Chain ID cannot be retrieved')
  }

  // Retrieve underlying token deployment details (if any)
  const dsgdContractAddress =
    (await deployments.get('DSGDToken')).address || getDeployedUnderlyingToken(chainId)

  // Deploy with contract factory
  const PbmUpgradeableToken = await ethers.getContractFactory('PBMTokenUpgradeable', {
    signer: pbmDeployer,
  })
  // See https://docs.openzeppelin.com/upgrades-plugins/1.x/#how-plugins-work
  const proxy = await upgrades.deployProxy(
    PbmUpgradeableToken,
    [dsgdContractAddress, 'PBM Sample Token Upgradeable', 'UPBM', tentativeExpiryDate],
    { kind: 'transparent' }
  )

  await proxy.deployed()
  const transactionReceipt = await proxy.deployTransaction.wait()

  log(
    `[custom] deployed "PBMTokenUpgradeable" (tx: ${proxy.deployTransaction.hash}) at ${proxy.address} with ${transactionReceipt.gasUsed} gas.`
  )

  // Manually saving/updating deployment artifact with hardhat-deploy
  const deploymentArtifact = await deployments.getExtendedArtifact('PBMTokenUpgradeable')
  const proxyDeployments = {
    address: proxy.address,
    ...deploymentArtifact,
  }

  await save('PBMTokenUpgradeable', proxyDeployments)
}

export default deployFunction
deployFunction.tags = ['pbm-upgradeable']
deployFunction.dependencies = ['dsgd']
