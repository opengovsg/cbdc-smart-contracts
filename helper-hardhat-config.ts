import { getUnixTimestamp } from './helpers/utils'

interface DeploymentConfigItem {
  name: string
  type: 'main-net' | 'test-net' | 'local-net'
  underlyingTokenAddress?: string
  waitForConfirmations?: number
  expiryDate: number
}

export const deploymentConfig: { [chainId: string]: DeploymentConfigItem } = {
  // Refer to chainIds via https://chainlist.org/
  default: {
    name: 'hardhat',
    type: 'local-net',
    expiryDate: getUnixTimestamp('2025-01-01T00:00:00+08'),
  },
  31337: {
    name: 'localhost',
    type: 'local-net',
    expiryDate: getUnixTimestamp('2025-01-01T00:00:00+08'),
  },
  80001: {
    name: 'polygonMumbai',
    underlyingTokenAddress: '0x81F00542e82e456001196f8c3c747fC1A5dDca80',
    type: 'test-net',
    waitForConfirmations: 6,
    expiryDate: getUnixTimestamp('2023-01-01T08:00:00+08'),
  },
  137: {
    name: 'polygon',
    type: 'main-net',
    underlyingTokenAddress: '0x7BA5F45234bD6BA3ABDF82Db5A3980214B57eB9d',
    waitForConfirmations: 12,
    expiryDate: getUnixTimestamp('2022-11-25T23:59:59+08'),
  },
}

export const DSGD_DECIMALS = 18
export const PBM_DECIMALS = 18
