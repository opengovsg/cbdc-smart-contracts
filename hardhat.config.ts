import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-gas-reporter'
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@primitivefi/hardhat-dodoc'
import 'hardhat-deploy'
import '@openzeppelin/hardhat-upgrades'

import { getPrivateKeyForRole } from './helpers/network'

// RPC Envs
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || ''

// API Envs
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || ''
const COIN_MARKET_API_KEY = process.env.COIN_MARKET_API_KEY || ''

const NODE_ENV = process.env.NODE_ENV || ''

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  defaultNetwork: 'hardhat',
  networks: {
    // NOTE: Hardhat accounts remain deterministic for all hardhat node instances (not tied to machine)
    // see https://hardhat.org/hardhat-network/docs/overview#running-stand-alone-in-order-to-support-wallets-and-other-software
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    ...(NODE_ENV === 'staging' && {
      polygonMumbai: {
        url: POLYGON_RPC_URL,
        accounts: [getPrivateKeyForRole('DSGD_DEPLOYER'), getPrivateKeyForRole('PBM_DEPLOYER')],
        chainId: 80001,
      },
    }),

    // TODO: Override config to using a manual gas ticker for polygon
    // See EIP-1559 implementation discrepancy for Polygon Mainnet
    ...(NODE_ENV === 'production' && {
      polygon: {
        url: POLYGON_RPC_URL,
        accounts: [getPrivateKeyForRole('DSGD_DEPLOYER'), getPrivateKeyForRole('PBM_DEPLOYER')],
        chainId: 137,
      },
    }),
  },
  namedAccounts: {
    DSGDDeployer: 0, // For all networks, default the first account as DSGD admin (index 0)
    PBMDeployer: 1, // For all networks, default the first account as PBM admin (index 1)
  },

  // Plugin configurations //
  etherscan: {
    apiKey: {
      polygonMumbai: POLYGONSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    token: 'MATIC',
    currency: 'SGD',
    outputFile: 'gas-report.txt',
    noColors: true,
    coinmarketcap: COIN_MARKET_API_KEY,
  },
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v5',
  },
  dodoc: {
    runOnCompile: false,
    include: ['PBMToken'],
  },
}

export default config
