// Verification related helpers here

import { run } from 'hardhat'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const verifyContract = async ({ address, args }: { address: string; args?: any }) => {
  console.log('Verifying contract...')
  try {
    await run('verify:verify', {
      address,
      constructorArguments: args,
    })
  } catch (e: any) {
    if (e.message.toLowerCase().includes('already verified')) {
      console.log('Contract already verified!')
    } else {
      console.log(e)
    }
  }
}
