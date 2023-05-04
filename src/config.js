import { ethers } from "ethers"; 

export const trustifiedContracts = {
  fvmtestnet: {
    trustified: "0xAe743cd66102D46a11Bd27CfABf6Fc1840f8978b",
  }, // Testnet
  fvm: {
    trustified: "0xb93F6F074107C4dd6707879874D1C017450898FC",
  }, // Mainnet
  mumbai: {
    trustified: "0xA7683AEDEcECc2C85EBB6D0f93a1AE852bBeA077",
  },
  polygon: {
    trustified: "0xf8545458E45168C268016BBA7eFfD54c4CF2808C",
  },
  celotestnet: {
    trustified: "0x236b936792C05e48Fc98573F4C4019144704306a",
  },
  celomainnet: {
    trustified: "0xb1D54e85A8e069DE67acaa73b15B1B8c28224Aff",
  },
  arbitrumtestnet: {
    trustified: "0x6b2e241Cb89C58bfa662FBf83aB56b788B6D22FD",
  },
  gnosistestnet: {
    trustified: "",
  },
  ethereumtestnet: {
    trustified: "0x06a8fa03F246adCC8D1Ce4f3A8f8323125A51b1a",
  },

  // bsc: {
  //   trustified: "0x0FE82cBB448A89Dd912EbC4117B927616826AcCC",
  // },
};

export const chain = {
  3141: "fvmtestnet",
  314: "fvm",
  80001: "mumbai",
  137: "polygon",
  97: "bsc",
  44787: "celotestnet", // 
  42220:"celomainnet",
  421613: "arbitrumtestnet", // GOERLI
  10200: "gnosistestnet",
  11155111: "ethereumtestnet", //SEPOLIA
};

export const logos={
  mumbai:'/assets/logo/mumbai.png',
  polygon:'/assets/logo/mumbai.png',
  ether:'/assets/logo/ethereum.png',
  celo:'/assets/logo/celo.png',
  celomainnet:'/assets/logo/celo.png',
  fvm:'/assets/logo/fvm.png',
  fvmtestnet:'/assets/logo/fvm.png',
  gnosis:'/assets/logo/gnosis.png',
  arbitrum:'/assets/logo/arbitrum.png',
  bsc:'/assets/logo/bsc.png',
}

export const networkURL = {
  fvm: "https://filfox.info/en/tx",
  fvmtestnet: "https://hyperspace.filfox.info/en/tx",
  mumbai:  "https://polygonscan.com/tx",
  polygon:"https://polygonscan.com/tx",
  celotestnet: "https://alfajores-blockscout.celo-testnet.org/tx",
  celomainnet: "https://celoscan.io/tx",
  arbitrumtestnet: "https://goerli-rollup-explorer.arbitrum.io/tx",
  ethereumtestnet: "https://sepolia.etherscan.io/tx",
  gnosistestnet:"https://gnosisscan.io/tx",
  bsc:"https://testnet.bscscan.com/tx"
}; 

export const  networkIds = {
  fvm: 314,
  fvmtestnet: 3141,
  mumbai: 80001,
  polygon:137,
  celotestnet: 44787,
  celomainnet:42220,
  arbitrumtestnet: 421613,
  ethereumtestnet: 11155111,
  gnosistestnet:10200,
  bsc:97
}; 

export const  chainParams = [
  {
    chainId: ethers.utils.hexValue(80001),
    rpcUrl: "https://rpc-mumbai.maticvigil.com/",
    chainName: "Matic Mumbai",
    symbol: "MATIC",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(314),
    rpcUrl: "https://api.node.glif.io/rpc/v1",
    chainName: "Filecoin Mainnet",
    symbol: "FIL",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(3141),
    rpcUrl: "https://api.hyperspace.node.glif.io/rpc/v1",
    chainName: "Filecoin Hyperspace",
    symbol: "tFIL",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(44787),
    rpcUrl: "https://alfajores-forno.celo-testnet.org",
    chainName: "Celo Testnet",
    symbol: "CELO",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(421613),
    rpcUrl: "https://goerli-rollup.arbitrum.io/rpc",
    chainName: "Arbitrum Goerli",
    symbol: "AGOR",
    decimals: 18,
  },
  {
    chainId: ethers.utils.hexValue(11155111),
    rpcUrl: "https://rpc2.sepolia.org",
    chainName: "Ethereum Sepolia",
    symbol: "ETH",
    decimals: 18,
  },
];
    

export  const multiChains = [
  {
    label: "FVM(Mainnet)",
    value: "fvm",
    image: "/assets/filecoin.png",
    chainId: 314,
    priority: 0,
  },
  {
    label: "FVM Testnet(Hyperspace)",
    value: "fvmtestnet",
    image: "/assets/filecoin.png",
    chainId: 3141,
    priority: 1,
  },
  {
    label: "Polygon",
    value: "polygon",
    image:  "/assets/coin.png",
    chainId: 137,
    priority: 0,
  },
  {
    label: "Polygon Mumbai",
    value: "mumbai",
    image:  "/assets/coin.png",
    chainId: 80001,
    priority: 1,
  },
  {
    label: "Alfajores Testnet(Celo)",
    value: "celotestnet",
    image: "/assets/celo.png",
    chainId: 44787,
    priority: 1,
  },
  {
    label: "Celo Mainnet",
    value: "celomainnet",
    image: "/assets/celo.png",
    chainId: 42220,
    priority: 1,
  },
  {
    label: "Arbitrum Goerli",
    value: "arbitrumtestnet",
    image: "/assets/airbitrum.png",
    chainId: 421613,
    priority: 1,
  },
  {
    label: "Ethereum Sepolia",
    value: "ethereumtestnet",
    image: "https://request-icons.s3.eu-west-1.amazonaws.com/eth.svg",
    chainId: 11155111,
    priority: 0,
  },
];