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
  celotestnet: {
    trustified: "0x236b936792C05e48Fc98573F4C4019144704306a",
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
  97: "bsc",
  44787: "celotestnet", // 
  421613: "arbitrumtestnet", // GOERLI
  10200: "gnosistestnet",
  11155111: "ethereumtestnet", //SEPOLIA
};

export const logos={
  mumbai:'/assets/logo/mumbai.png',
  ether:'/assets/logo/ethereum.png',
  celo:'/assets/logo/celo.png',
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
  celotestnet: "https://alfajores-blockscout.celo-testnet.org/tx",
  arbitrumtestnet: "https://goerli-rollup-explorer.arbitrum.io/tx",
  ethereumtestnet: "https://sepolia.etherscan.io/tx",
  gnosistestnet:"https://gnosisscan.io/tx",
  bsc:"https://testnet.bscscan.com/tx"
}; 

export const  networkIds = {
  fvm: 314,
  fvmtestnet: 3141,
  mumbai: 80001,
  celotestnet: 44787,
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
