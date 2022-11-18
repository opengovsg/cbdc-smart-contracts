import { DeploymentsExtension } from 'hardhat-deploy/dist/types'
import moment from 'moment'

export const getPastDeployment = async (name: string, deployments: DeploymentsExtension) => {
  try {
    return await deployments.get(name)
  } catch (e) {
    return null
  }
}

export const getUnixTimestamp = (dateString: string) => {
  if (!moment(dateString).isValid()) {
    throw new Error('date string provided is not parseable')
  }

  return moment(dateString).unix()
}
