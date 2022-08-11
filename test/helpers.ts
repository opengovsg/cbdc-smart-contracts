import { ethers } from 'hardhat'
import { DSGD_DECIMALS, PBM_DECIMALS } from '../helper-hardhat-config'

export function dsgdAmount(amount: number) {
  return ethers.utils.parseUnits(String(amount), DSGD_DECIMALS)
}

export function pbmAmount(amount: number) {
  return ethers.utils.parseUnits(String(amount), PBM_DECIMALS)
}
