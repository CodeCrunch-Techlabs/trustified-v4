const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const TrustifiedContract = await hre.ethers.getContractFactory("Trustified");
  const trustifiedContract = await TrustifiedContract.deploy();

  console.log("Trustified nft contract address:", trustifiedContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
