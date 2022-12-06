<h1 align="center">
  <br>
  <a href="https://github.com/opengovsg/cbdc-smart-contracts/wiki" width="2000"><img src="https://user-images.githubusercontent.com/28633094/205862423-648d3290-a9fe-46aa-9730-f88857bad81b.png" alt="OGP PBM Token"  width="200"></a>
  <br>
  RedeemX Smart Contracts
  <br>
  Project Orchid: Government Vouchers
</h1>

## About

This repository contains the smart contracts used for OGP PBM Tokens, a purpose bound money approach for the government usecase. This serves as part of a wider trial under Project Orchid. Read more about the project via the [Project Orchid Whitepaper](https://www.mas.gov.sg/publications/monographs-or-information-paper/2022/project-orchid-whitepaper). 

For more specific engineering and technical decisions, refer to the [wiki page in this repository ](https://github.com/opengovsg/cbdc-smart-contracts/wiki)


## Getting Started

### Pre-requisities
This project requires the NodeJS environment `> 14.0`, along with either yarn/npm as package manager. Instructions provided will be for npm. 



### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/datagovsg/cbdc-smart-contracts.git
   ```
2. Install the required NPM packages for development
   ```sh
   npm install
   ```

### Setting up

#### Environment variables
An `.env.example` file has been added to provide a template for the environment variables required to get you up to speed. Refer to the table below for the purposes of these variables.

| Name                      | Description                                                                                                                     | Required |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------|
| PBM_DEPLOYER_PRIVATE_KEY  | Private key to be used for deploying the PBM Contract                                                                           | Y        |
| DSGD_DEPLOYER_PRIVATE_KEY | Private key to be used for deploying the DSGD Contract                                                                          | Y        |
| POLYGON_RPC_URL           | RPC url used for the Polygon testnet/mainnet networks. It is recommended to create a dedicated RPC. More details provided below | Y        |
| POLYGONSCAN_API_KEY       | Polygonscan key used for verifying contracts on the polygonscan explorer (only for Polygon Mainnet/Mumbai Testnet)              | N        |
| COIN_MARKET_API_KEY       | API key for the CoinMarket API. This is used for calculating gas fees in FIAT currency specified (SGD)                          | N        |


## Usage

CBDC Contracts have been developed with the [hardhat](https://hardhat.org/) development framework. Hardhat provides a series of built-in plugins, which include gas reporting, chai test helpers and network helpers as part of the hardhat-toolbox. 



### Tests

Tests in hardhat utilises the mocha + chai framework, along with [waffle](https://getwaffle.io/) matchers specific to ethereum contract development and testing. Fixtures have been setted up to bring the test runner to the correct chain state.

Gas reporting is automatically configured to analyse gas usages in tests. A gas report will be generated per each successful test run in `/gas-report.txt`

To run tests: 
   ```sh
   npm run test
   ```


### Deployments

Deployments should only be run after the necessary required environment variables above are populated. We have also provided a `helper-hardhat-config.ts` to adjust the various deployment configurations for deployment. 

   ```sh
   npm run deploy:pbm
   
#   For running a custom deployment: 
#   npm run deploy --{tags}
   ```
For local deployments and tests, default hardhat node accounts are used. 


**Additional Information**

Deployments are managed by `hardhat-deploy`. These scripts have been written in a sequential manner with all scripts containing `tags` and `dependencies`. 
- `tags` are used for setting an identifier to a particular deployment
- `dependencies` are an array of tags that a particular deployment will rely on. Running a deployment with a dependency array will also automatically create deployments for its dependencies (if depolyments dont already exits).


Successful deployments are cached and stored in the `./deployments` file. Hardhat deploy will automatically re-use already existing deployments wherever possible

### Hardhat Plugins
The following hardhat plugins have also been utilised for a better development experience. The respective depedencies/packages have already been included in this package. 


- `hardhat-deploy` - for managing contract deployments
- `hardhat-upgrades` - an OpenZeppelin plugin for managing upgradeable OpenZepellin contracts.
- `hardhat-dodoc`- documentation generator based on solidity's NatSpec comments. Use `npm run gen:docs` to generate your documentation in the docs folder.

These will already be made available to you on running `npm install`. Configurations can be overriden from `hardhat.config.ts`



