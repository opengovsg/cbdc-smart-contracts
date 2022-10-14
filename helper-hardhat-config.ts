interface NetworkConfigItem {
  name: string
  type: 'main-net' | 'test-net' | 'local-net'
  underlyingTokenAddress?: string
  waitForConfirmations?: number
  expiryDate?: number
}

export const networkConfig: { [chainId: string]: NetworkConfigItem } = {
  // Refer to chainIds via https://chainlist.org/
  default: {
    name: 'hardhat',
    type: 'local-net',
  },
  31337: {
    name: 'localhost',
    type: 'local-net',
  },
  5: {
    name: 'goerli',
    underlyingTokenAddress: 'insert-address-for-goerli-dsgd-here',
    type: 'test-net',
    waitForConfirmations: 6,
  },
  80001: {
    name: 'polygonMumbai',
    underlyingTokenAddress: '0x81F00542e82e456001196f8c3c747fC1A5dDca80',
    type: 'test-net',
    waitForConfirmations: 6,
    expiryDate: 1672531200,
  },
  137: {
    name: 'polygon',
    type: 'main-net',
    waitForConfirmations: 12,
  },
}

export const DSGD_DECIMALS = 18
export const PBM_DECIMALS = 18
