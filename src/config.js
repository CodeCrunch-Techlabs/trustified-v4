export const trustifiedContracts = {
  fevm: {
    transferable: "0x936986f5097C9C05c85065cfcB74e68d3A6c4c95",
    nonTransferable: "0x1FB2EeFb0e204c2e23a6Dd99007e30907171693B",
  }, // Testnet
  filecoin: {
    transferable: "0xca54f41be0b77436b972e61746943cc9f24737a8",
    nonTransferable: "0xee6800b4c43084ace7233dcf98ec27243fb959e8",
  }, // Mainnet
  // mumbai: {
  //   transferable: "0x5765248ec7070519538d0F764B41f5c4e46f7004",
  //   nonTransferable: "0xC0c675Eec020d62FC45AD858c4F4E36359C5E191",
  // },
  mumbai: {
    transferable: "0xf1F1980c1D53EDA70C3D16c1E07b389546947ee1",
    nonTransferable: "0x542d3C54EcA63bB99577b2224DdCD85b194ee1EA",
  },
  goerli: {
    transferable: "0xF913b6A387e15f0FcDBb1d8ce4c16C34927c0542",
    nonTransferable: "0x27C433Cf7d6Af672F2e67498692C56DA1D314A70",
  }, // Need to update
  bsc: {
    transferable: "0x23f2933945ad729A404B1a632E0E07C06fF84512",
    nonTransferable: "0xa0eF0dACE62ed3e24c9025fDEE52909B14afe7f5",
  },
};

export const chain = {
  3141: "fevm",
  314: "filecoin",
  80001: "mumbai",
  5: "goerli",
  97: "bsc",
};
