import { deploymentConfig } from '../helper-hardhat-config'

type Role = 'DSGD_DEPLOYER' | 'PBM_DEPLOYER'

// TODO: Consider using mnemonic once wallet management is clearer for DSGD vs PBM
export function getPrivateKeyForRole(role: Role): string {
  const privateKey = process.env[`${role}_PRIVATE_KEY`]
  if (!privateKey) {
    throw new Error('Envar for private key not found. Check naming convention.')
  }

  return privateKey
}

export function getDeployedUnderlyingToken(chainId: number): string | undefined {
  return deploymentConfig[chainId].underlyingTokenAddress
}
