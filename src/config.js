import { ethers } from "ethers";

export const trustifiedContracts = {
  fvmtestnet: {
    trustified: "0x3dCb4abD4B024688e63e51fA717E2233D20528A9",
    trustifiedIssuernft: "0xD444CC7FE5C98775Fa7890Ca74Cd3b39eD028502",
  }, // Testnet
  fvm: {
    trustified: "0xb93F6F074107C4dd6707879874D1C017450898FC",
    trustifiedIssuernft: "",
  }, // Mainnet
  mumbai: {
    trustified: "0x991B9cCD378096afEd03787E020bA5f7FDA9d393", //v5
    trustifiedIssuernft: "0xf62398e2fF9Eca3F564e83F06d19941d8c960914",
    //trustified: "0xA7683AEDEcECc2C85EBB6D0f93a1AE852bBeA077", v4
  },
  polygon: {
    trustified: "0xf8545458E45168C268016BBA7eFfD54c4CF2808C",
    trustifiedIssuernft: "",
  },
  celotestnet: {
    trustified: "0xF913b6A387e15f0FcDBb1d8ce4c16C34927c0542",
    trustifiedIssuernft: "0xA5564Fe4AD705cFa5FE159eD7529AA172188Afe9",
  },
  celomainnet: {
    trustified: "0xb1D54e85A8e069DE67acaa73b15B1B8c28224Aff",
  },
  arbitrumtestnet: {
    trustified: "0x5BCdF0e733cF9Ab425f8c285540a0EEC5e5461f2",
    trustifiedIssuernft: "0x41390b635F19C28cb3dB705dB18e147104587fB0",
  },
  gnosistestnet: {
    trustified: "",
    trustifiedIssuernft: "",
  },
  ethereumtestnet: {
    trustified: "0xF16b1872B09E9B7676fd5187d36601f4C6245288",
    trustifiedIssuernft: "0x27C433Cf7d6Af672F2e67498692C56DA1D314A70",
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
  42220: "celomainnet",
  421613: "arbitrumtestnet", // GOERLI
  10200: "gnosistestnet",
  11155111: "ethereumtestnet", //SEPOLIA
};

export const logos = {
  mumbai: "/assets/logo/mumbai.png",
  polygon: "/assets/logo/mumbai.png",
  ether: "/assets/logo/ethereum.png",
  celo: "/assets/logo/celo.png",
  celomainnet: "/assets/logo/celo.png",
  fvm: "/assets/logo/fvm.png",
  fvmtestnet: "/assets/logo/fvm.png",
  gnosis: "/assets/logo/gnosis.png",
  arbitrum: "/assets/logo/arbitrum.png",
  bsc: "/assets/logo/bsc.png",
};

export const networkURL = {
  fvm: "https://filfox.info/en/tx",
  fvmtestnet: "https://hyperspace.filfox.info/en/tx",
  mumbai: "https://polygonscan.com/tx",
  polygon: "https://polygonscan.com/tx",
  celotestnet: "https://alfajores-blockscout.celo-testnet.org/tx",
  celomainnet: "https://celoscan.io/tx",
  arbitrumtestnet: "https://goerli-rollup-explorer.arbitrum.io/tx",
  ethereumtestnet: "https://sepolia.etherscan.io/tx",
  gnosistestnet: "https://gnosisscan.io/tx",
  bsc: "https://testnet.bscscan.com/tx",
};

export const networkIds = {
  fvm: 314,
  fvmtestnet: 3141,
  mumbai: 80001,
  polygon: 137,
  celotestnet: 44787,
  celomainnet: 42220,
  arbitrumtestnet: 421613,
  ethereumtestnet: 11155111,
  gnosistestnet: 10200,
  bsc: 97,
};

export const chainParams = [
  {
    chainId: ethers.utils.hexValue(137),
    rpcUrl: "https://polygon-rpc.com/",
    chainName: "Polygon",
    symbol: "MATIC",
    decimals: 18,
  },
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
  {
    chainId: ethers.utils.hexValue(42220),
    rpcUrl: "https://forno.celo.org",
    chainName: "Celo Mainnet",
    symbol: "CELO",
    decimals: 18,
  },
];

export const multiChains = [
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
    image: "/assets/coin.png",
    chainId: 137,
    priority: 0,
  },
  {
    label: "Polygon Mumbai",
    value: "mumbai",
    image: "/assets/coin.png",
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

export const fsize = [
  12, 14, 16, 18, 20, 24, 26, 30, 32, 36, 40, 42, 48, 50, 54, 60,
];
export const fbold = [100, 200, 300, 400, 500, 600, 700, 800, 900];
export const fontList = [
  "Roboto",
  "Borsok",
  "Open Sans",
  "Lato ",
  "Poppins",
  "Zeyada",
  "Babylonica",
  "Dancing Script",
  "Lobster",
  "Pacifico",
  "Caveat",
  "Satisfy",
  "Great Vibes",
  "Ole",
  "Coiny",
  "Kenia",
  "Rubik Beastly",
  "Londrina Sketch",
  "Neonderthaw",
  "Kumar One",
  "Ribeye",
  "Emblema One",
  "Ewert",
  "Kavoon",
  "Moul",
  "Rubik Moonrocks",
  "Rubik Iso",
  "Unifraktur Cook",
  "Germania One",
  "Monoton",
  "Orbitron",
  "Rampart One",
];
