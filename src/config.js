import { ethers } from "ethers";

export const trustifiedContracts = {
  fvmtestnet: {
    trustified: "0x164262560566Cc30eFD1e67ce363fF7F3f9FC941",
    trustifiedIssuernft: "0x6c7aE2f26C0a97C8F6287369fc69aB9eB09fB03a",
  }, // Testnet
  fvm: {
    trustified: "0xb93F6F074107C4dd6707879874D1C017450898FC",
    trustifiedIssuernft: "",
  }, // Mainnet
  mumbai: {
    trustified: "0x480a90061Eb948DdDe5cABD6529D2e9eD3298b3d", //v5
    trustifiedIssuernft: "0xa0f03408984424cdDc9688b5FED0AbCDBa6b4fEF",
    //trustified: "0xA7683AEDEcECc2C85EBB6D0f93a1AE852bBeA077", v4
  },
  polygon: {
    trustified: "0xf8545458E45168C268016BBA7eFfD54c4CF2808C",
    trustifiedIssuernft: "",
  },
  celotestnet: {
    trustified: "0x8907F6f3040fB8f4A9794BfaAFf8F1ac136F8f06",
    trustifiedIssuernft: "0x66c820B0559A97611918D3d496eEb46BAE3e7202",
  },
  celomainnet: {
    trustified: "0xb1D54e85A8e069DE67acaa73b15B1B8c28224Aff",
  },
  arbitrumtestnet: {
    trustified: "0x2c01ECa5DF2Fb1Ae9166744b14363984dD27199A",
    trustifiedIssuernft: "0x28719360690e874f7411D2e81C9F470080A7A886",
  },
  gnosistestnet: {
    trustified: "",
    trustifiedIssuernft: "",
  },
  ethereumtestnet: {
    trustified: "0x0C4DCc2dc216fF3Fe1A7A4F6c9B5D71cbA10AFC2",
    trustifiedIssuernft: "0x74eE14CD4f92131042acc08cE50176B351dF31e0",
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
  mumbai: "https://mumbai.polygonscan.com/tx",
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


export const ipfsDataCollections = [
  {
    id: "1V5id9XvCovxj54diaRF",
    name: "Test Cert",
    description: "Testing cert function",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeigro7dne6fhrwjrzsszuqstyyoqgsowksloo35aq7z6ms7lkodj54/fil.png",
  },
  {
    id: "23mwz8uhMYfQhZ9aG5kA",
    name: "Test without name and with airdrop",
    description: "Test without name and with airdrop",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibey2lwkhyf2xdvwv3rkonqiwnfs224blldcisrfuyu5xctyr7riq/testcer.jpg",
  },
  {
    id: "2qksvPUppF7MSuGD7Cu0",
    name: "FVM Early Builders Cohort F/1",
    description:
      "The FVM Early Builders Cohort is the first batch of developers to build with the Filecoin EVM (FEVM)! They were essential to helping shape the FEVM in 2022 and helped revolutionize the web3 ecosystem, by bringing on-chain programmability to the Filecoin network when FEVM launched on March 14th 2023.",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeidt7ts447nenligsuuxztp6on4g424mmbnrccttwzl45kz3ao42rq/FVM Early Builder Cert.png",
  },
  {
    id: "4z0EiiCgHAFAwm3n8zqc",
    name: "Fellowship 2",
    description: "test felloship",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibe563rz7d2z7lrf2wqoeiqnijmbidw6fgz2rfao43goz7uvppqsm/MicrosoftTeams-image (72).png",
  },
  {
    id: "Ab0vSIXDVRtMGPYNu5Db",
    name: "Fellowship1",
    description: "tets",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibe563rz7d2z7lrf2wqoeiqnijmbidw6fgz2rfao43goz7uvppqsm/MicrosoftTeams-image (72).png",
  },
  {
    id: "B33BLxFhYIS3H5zuQ40o",
    name: "dafdsfds",
    description: "fdsf",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeib4ml734wqmoaib5bmgrwxjclwmv5f673gogedy66munm42btj5bi/Farza.png",
  },
  {
    id: "ComExUass269CZOZVYLl",
    name: "sad",
    description: "sadsadsad",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeiajvz2vjdouodirdurxvfx6ihpiirzxvszbzeqfe7jlnajigijj34/FVM Early Builder Cert.png",
  },
  {
    id: "E7BJsKHYy2F5XDW7TEc4",
    name: "Test with claim url 31",
    description: "Test with claim url 31",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeiepjlndq6ujx77k5tegno4v2t56dk76wkqdel2cca2wh2bpyn3ci4/chainlinewizard-logo.png",
  },
  {
    id: "ElpYDkmyTR2ElrqzZkzP",
    name: "Test airdrop with Name 30",
    description: "Test airdrop with Name 30",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibe563rz7d2z7lrf2wqoeiqnijmbidw6fgz2rfao43goz7uvppqsm/MicrosoftTeams-image (72).png",
  },
  {
    id: "IbhLZC8LoTczrZRHmv6W",
    name: "Test certi",
    description: "Test",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeiejb3kclnxsqzamqjipkqf7es3komle5nhx5f6skcqppwi4gl4atm/0355SG18Et.png",
  },
  {
    id: "Ik8p52LEzzTpU6vQmify",
    name: "Celo certificates",
    description: "test certificates",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibe563rz7d2z7lrf2wqoeiqnijmbidw6fgz2rfao43goz7uvppqsm/MicrosoftTeams-image (72).png",
  },
  {
    id: "Iy0VtwKIU4nFhkPn2taw",
    name: "FVM Early Builders F/1 Cohort",
    description:
      "The FVM Early Builders Cohort is the first batch of developers to build with the Filecoin EVM (FEVM)! They were essential to helping shape the FEVM in 2022 and helped revolutionize the web3 ecosystem, by bringing on-chain programmability to the Filecoin network when FEVM launched on March 14th 2023.",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeidt7ts447nenligsuuxztp6on4g424mmbnrccttwzl45kz3ao42rq/FVM Early Builder Cert.png",
  },
  {
    id: "MYbQetZXfDwdjJMiNypp",
    name: "dsdmfmdf",
    description: "dsfdsf",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeib4ml734wqmoaib5bmgrwxjclwmv5f673gogedy66munm42btj5bi/Farza.png",
  },
  {
    id: "MlqHNmKLEP8jBhLz8bXb",
    name: "Test without name but with airdrop",
    description: "Test without name but with airdrop",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibey2lwkhyf2xdvwv3rkonqiwnfs224blldcisrfuyu5xctyr7riq/testcer.jpg",
  },
  {
    id: "Mm5qyzqYYzkPDd2hqUwo",
    name: "Buildspace Test Certificate",
    description:
      "Buidspace is a startup that provides a platform for people who want to create products from an idea by providing them with access to tools, resources, and a community of like-minded individuals. Buidspace aims to make it easier for anyone with an idea to turn it into a tangible product, regardless of their background or skillset.This certificate is not officially issued by the Buildspace team, It's a demo by Trustified team to present usecase of NFT certificates/badges for Buildspace builders and founders.",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeie2j7b6v2xj4oolzkiy2qgpl6o4ewi3huvshehhmi3lvhgc6icah4/Certificate of Completion.png",
  },
  {
    id: "R8pkCwBV4rXqcXgecB6d",
    name: "Nights & Weekends Cohort S3 Builder Certificate",
    description:
      "Buidspace is a startup that provides a platform for people who want to create products from an idea by providing them with access to tools, resources, and a community of like-minded individuals. Buidspace aims to make it easier for anyone with an idea to turn it into a tangible product, regardless of their background or skillset. This certificate is not officially issued by the Buildspace team, It's a demo by Trustified team to present usecase of NFT certificates/badges for Buildspace builders and founders.",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibpohe2ul65nms3eqiefpl4crquvqyebhiq3af6rh3cai45nwrkg4/builders certificate.png",
  },
  {
    id: "RC6RwTwsmY4TFfu1m3We",
    name: "safsdf",
    description: "sdfsd",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeidu65fxvpvxw2xg2zpggmgz6hqvr3xmkbfh2ahwwdssvg3nesuxgq/ArbitrumOneLogo.svg",
  },
  {
    id: "RnjcQ0m6CfAK0XINaGYA",
    name: "Buildspcae test",
    description: "test for buildspace",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeib4ml734wqmoaib5bmgrwxjclwmv5f673gogedy66munm42btj5bi/Farza.png",
  },
  {
    id: "T2N0sOrZbBWKpyX4aQdL",
    name: "Test certificate",
    description: "test cert",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibey2lwkhyf2xdvwv3rkonqiwnfs224blldcisrfuyu5xctyr7riq/testcer.jpg",
  },
  {
    id: "TggJb1eTkctUQh2JJNw6",
    name: "Test with Name",
    description: "Test with Name",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibe563rz7d2z7lrf2wqoeiqnijmbidw6fgz2rfao43goz7uvppqsm/MicrosoftTeams-image (72).png",
  },
  {
    id: "V1vghkDCRBgiIKbzoFA1",
    name: "Grant test Certificates",
    description: "this are the test certificates",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibe563rz7d2z7lrf2wqoeiqnijmbidw6fgz2rfao43goz7uvppqsm/MicrosoftTeams-image (72).png",
  },
  {
    id: "VH2zx7jbDWA5XmtiIEEQ",
    name: "test optimized",
    description: "test",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeigndt3lkxpn3e554hfwykpuuleningtw24cz7uhozgwh2znlo566u/MicrosoftTeams-image (73).png",
  },
  {
    id: "X2vLbBBK6RnygATzeJ9T",
    name: "sad",
    description: "sadsadsad",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeiajvz2vjdouodirdurxvfx6ihpiirzxvszbzeqfe7jlnajigijj34/FVM Early Builder Cert.png",
  },
  {
    id: "YgTojPCLroPCMWKhc61b",
    name: "sdffds",
    description: "fdsf",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeib4ml734wqmoaib5bmgrwxjclwmv5f673gogedy66munm42btj5bi/Farza.png",
  },
  {
    id: "bNkwxhdT8YYZHGDSJ8FR",
    name: "ww",
    description: "wwwwww",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeia3226klut7cyudcr6ha3ovvxgfvdw6ddenx33kxo2oaswbye24ra/Screenshot 2023-04-28 001545.png",
  },
  {
    id: "eFhxtiIH7Y8A3js5ezGb",
    name: "Test airdrop without Name 30",
    description: "Test airdrop without Name 30",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibey2lwkhyf2xdvwv3rkonqiwnfs224blldcisrfuyu5xctyr7riq/testcer.jpg",
  },
  {
    id: "hO5Fd2NDntOBrbToQcjP",
    name: "Buildspace - Test Certificate",
    description:
      "Buidspace is a startup that provides a platform for people who want to create products from an idea by providing them with access to tools, resources, and a community of like-minded individuals. Buidspace aims to make it easier for anyone with an idea to turn it into a tangible product, regardless of their background or skillset. This certificate is not officially issued by the Buildspace team, It's a demo by Trustified team to present usecase of NFT certificates/badges for Buildspace builders and founders.",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeie2j7b6v2xj4oolzkiy2qgpl6o4ewi3huvshehhmi3lvhgc6icah4/Certificate of Completion.png",
  },
  {
    id: "izuLFKDR8omnZ9jvGQHI",
    name: "Test claimurl with Name 30",
    description: "Test claimurl with Name 30",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibe563rz7d2z7lrf2wqoeiqnijmbidw6fgz2rfao43goz7uvppqsm/MicrosoftTeams-image (72).png",
  },
  {
    id: "j5YzGsBVth7tXM5Rghnw",
    name: "Final test",
    description: "test final",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibe563rz7d2z7lrf2wqoeiqnijmbidw6fgz2rfao43goz7uvppqsm/MicrosoftTeams-image (72).png",
  },
  {
    id: "j67b1NA5EXJ9MXSlfRJu",
    name: "Test airdrop without Name",
    description: "Test airdrop without Name",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibey2lwkhyf2xdvwv3rkonqiwnfs224blldcisrfuyu5xctyr7riq/testcer.jpg",
  },
  {
    id: "jSMMseRVTUywQqeJgii3",
    name: "ndasf",
    description: "dfsdf",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeigndt3lkxpn3e554hfwykpuuleningtw24cz7uhozgwh2znlo566u/MicrosoftTeams-image (73).png",
  },
  {
    id: "jZWlJfx6a3CctuSYc1DF",
    name: "Test without Name",
    description: "Test without Name",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibey2lwkhyf2xdvwv3rkonqiwnfs224blldcisrfuyu5xctyr7riq/testcer.jpg",
  },
  {
    id: "lbpTevsflsmpoHtdFsCD",
    name: "nights & weekends cohort s3 builder certificate",
    description:
      "Buidspace is a startup that provides a platform for people who want to create products from an idea by providing them with access to tools, resources, and a community of like-minded individuals. Buidspace aims to make it easier for anyone with an idea to turn it into a tangible product, regardless of their background or skillset. This certificate is not officially issued by the Buildspace team, It's a demo by Trustified team to present usecase of NFT certificates/badges for Buildspace builders and founders.",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeiguwz3zvk57jgnlauzhbrg3rubqhitibeburzzk36yxw6glanezrm/Buidspace certificate.png",
  },
  {
    id: "mrYZCek8dA9CrniTZuiV",
    name: "asdsds",
    description: "sdfds",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibvwhfyw3q5an4ierrqlth4aruubailk2wz23a75n77egyy4szila/Igq83CrtdgYZJ6pGj3.gif",
  },
  {
    id: "n8WOXo8IssLGvJAGIgbb",
    name: "Buildspcae test",
    description: "test for buildspace",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeib4ml734wqmoaib5bmgrwxjclwmv5f673gogedy66munm42btj5bi/Farza.png",
  },
  {
    id: "nVQaKzqSZuAUZVvlIOIx",
    name: "Test claimurl without Name 30",
    description: "Test claimurl without Name 30",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibey2lwkhyf2xdvwv3rkonqiwnfs224blldcisrfuyu5xctyr7riq/testcer.jpg",
  },
  {
    id: "p2Z5les7B4WyMCyJFZfM",
    name: "Test Claim url with Name",
    description: "Test Claim url with Name",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibe563rz7d2z7lrf2wqoeiqnijmbidw6fgz2rfao43goz7uvppqsm/MicrosoftTeams-image (72).png",
  },
  {
    id: "tArVaeW0w2yvqiEpQxcu",
    name: "Test Certificates",
    description: "test one",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibe563rz7d2z7lrf2wqoeiqnijmbidw6fgz2rfao43goz7uvppqsm/MicrosoftTeams-image (72).png",
  },
  {
    id: "zJSohvS3RASTl073TUnJ",
    name: "Test with claim url and without Name",
    description: "Test with claim url and without Name",
    claimer: "",
    expireDate: "",
    issueDate: {},
    image:
      "https://nftstorage.link/ipfs/bafybeibey2lwkhyf2xdvwv3rkonqiwnfs224blldcisrfuyu5xctyr7riq/testcer.jpg",
  },
];