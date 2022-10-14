import { DeploymentsExtension } from 'hardhat-deploy/dist/types'

export const getPastDeployment = async (name: string, deployments: DeploymentsExtension) => {
  try {
    return await deployments.get(name)
  } catch (e) {
    return null
  }
}
