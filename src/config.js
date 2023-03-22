export const trustifiedContracts = {
  // fevm: {
  //   transferable: "0xEd1267cc8a15CC61c7812132Ba795dCaC3a84747",
  //   nonTransferable: "0x8Ea48B0b5A7A1cA7A09084E543B692770D685705",
  // }, // Testnet
  fevm: {
    transferable: "0xb0DB3346cA78B21EB86869815B653e3Ee3Bb75af",
    nonTransferable: "0xBF0DDa6f16F7f86e763AD537748632cb41E0Fa3F",
  }, // Mainnet
  mumbai: {
    transferable: "0x5765248ec7070519538d0F764B41f5c4e46f7004",
    nonTransferable: "0xC0c675Eec020d62FC45AD858c4F4E36359C5E191",
  },
  // goerli: {
  //   transferable: "0xF913b6A387e15f0FcDBb1d8ce4c16C34927c0542",
  //   nonTransferable: "0x27C433Cf7d6Af672F2e67498692C56DA1D314A70",
  // },
  bsc: {
    transferable: "0x23f2933945ad729A404B1a632E0E07C06fF84512",
    nonTransferable: "0xa0eF0dACE62ed3e24c9025fDEE52909B14afe7f5",
  },
};

export const chain = {
  3141: "fevm",
  80001: "mumbai",
  // 5: "goerli",
  97: "bsc",
};
