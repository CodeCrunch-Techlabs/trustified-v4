import React, { useContext, useEffect } from "react";
import {
  TextField,
  Box,
  FormLabel,
  Stack,
  Autocomplete,
  Dialog,
} from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import filecoinImage from "../../../assets/filecoin.png";
import polygonImage from "../../../assets/coin.png";
import celoImage from "../../../assets/celo.png";
import airbitrum from "../../../assets/airbitrum.png";

import { ethers } from "ethers";

import { NFTStorageContext } from "../../../context/NFTStorageContext";
import { Web3Context } from "../../../context/Web3Context";
import { networkIds } from "../../../config";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    height: "45vh",
    Width: "41vw",
    padding: "10px",
  },
}));

function GetNFTDetails() {
  const classes = useStyles();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const value = useContext(NFTStorageContext);
  const formdata = value.labelInfo.formData;
  const web3Context = React.useContext(Web3Context);
  const { switchNetwork } = web3Context;

  const [open, setOpen] = React.useState(false);

  const [selectedChain, setSelectedChain] = React.useState({
    label: "",
    value: "",
    image: "",
    chainId: "",
    priority: "",
  });

  const chains = [
    {
      label: "FVM(Mainnet)",
      value: "fvm",
      image: filecoinImage,
      chainId: 314,
      priority: 0,
    },
    {
      label: "FVM Testnet(Hyperspace)",
      value: "fvmtestnet",
      image: filecoinImage,
      chainId: 3141,
      priority: 1,
    },
    {
      label: "Polygon Mumbai",
      value: "mumbai",
      image: polygonImage,
      chainId: 80001,
      priority: 0,
    },
    {
      label: "Alfajores Testnet(Celo)",
      value: "celotestnet",
      image: celoImage,
      chainId: 44787,
      priority: 1,
    },
    {
      label: "Arbitrum Goerli",
      value: "arbitrumtestnet",
      image: airbitrum,
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

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
          <Stack spacing={3} sx={{ margin: "10px" }}>
            <p> Provide NFT certificate details</p>
            <TextField
              fullWidth
              label="Title"
              name="title"
              id="title"
              type="title"
              onChange={value.setFormdata("title")}
              value={formdata.title}
            />

            <TextField
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={4}
              onChange={value.setFormdata("description")}
              value={formdata.description}
            />
          </Stack>

          <Box sx={{ minWidth: 120, margin: "10px" }}>
            <FormLabel id="demo-controlled-radio-buttons-group">
              Select Your Network
            </FormLabel>

            <div className="d-flex justify-content-start">
              {chains
                .filter((chain) => chain.priority == 0)
                .map((chainCom) => (
                  <div
                    class="MuiButtonBase-root MuiChip-root jss160 MuiChip-outlined MuiChip-sizeSmall MuiChip-clickable chainChip"
                    tabindex="0"
                    role="button"
                    data-testid="NetworkChip-mainnet"
                    style={{
                      marginRight: "4px",
                      borderColor:
                        selectedChain.label == chainCom.label
                          ? "#282727"
                          : "#E4E4E4",
                    }}
                    onClick={async () => {
                      const { chainId } = await provider.getNetwork();
                      if (chainId !== chainCom.chainId) {
                        await switchNetwork(
                          ethers.utils.hexValue(chainCom.chainId)
                        );
                      }
                      setSelectedChain(chainCom);
                      value.setAutoCompleteData(chainCom.value);
                    }}
                  >
                    <img
                      src={chainCom.image}
                      style={{ height: "20px", width: "20px" }}
                      alt=""
                      class="MuiChip-avatar jss159 MuiChip-avatarSmall"
                      aria-hidden="true"
                    />
                    <span class="MuiChip-label MuiChip-labelSmall">
                      {chainCom.label}
                    </span>
                    <span class="MuiTouchRipple-root"></span>
                  </div>
                ))}

              {/* <div
            class="MuiButtonBase-root MuiChip-root jss160 MuiChip-outlined MuiChip-sizeSmall MuiChip-clickable chainChip"
            tabindex="0"
            role="button"
            data-testid="NetworkChip-mainnet"
            style={{
              marginRight: "4px",
              borderColor:
                selectedChain == "Ethereum Sepolia" ? "#282727" : "#E4E4E4",
            }}
            onClick={async () => {
              const { chainId } = await provider.getNetwork();
              if (chainId !== 11155111) {
                await switchNetwork(ethers.utils.hexValue(11155111));
              }
              setSelectedChain("Ethereum Sepolia");
              value.setAutoCompleteData("ethereumtestnet");
            }}
          >
            <img
              src="https://request-icons.s3.eu-west-1.amazonaws.com/eth.svg"
              style={{ height: "20px", width: "20px" }}
              alt=""
              class="MuiChip-avatar jss159 MuiChip-avatarSmall"
              aria-hidden="true"
            />
            <span class="MuiChip-label MuiChip-labelSmall">Ethereum</span>
            <span class="MuiTouchRipple-root"></span>
          </div>
          <div
            class="MuiButtonBase-root MuiChip-root jss160 MuiChip-outlined MuiChip-sizeSmall MuiChip-clickable chainChip"
            tabindex="0"
            role="button"
            data-testid="NetworkChip-mainnet"
            style={{ marginRight: "4px" }}
            onClick={async () => {
              const { chainId } = await provider.getNetwork();
              if (chainId !== 80001) {
                await switchNetwork(ethers.utils.hexValue(80001));
              }
              setSelectedChain("Polygon Mumbai");
              value.setAutoCompleteData("mumbai");
            }}
          >
            <img
              src={polygonImage}
              style={{ height: "20px", width: "20px" }}
              alt=""
              class="MuiChip-avatar jss159 MuiChip-avatarSmall"
              aria-hidden="true"
            />
            <span class="MuiChip-label MuiChip-labelSmall">Polygon</span>
            <span class="MuiTouchRipple-root"></span>
          </div> */}
              {selectedChain.priority == 1 && (
                <div
                  class="MuiButtonBase-root MuiChip-root jss160 MuiChip-outlined MuiChip-sizeSmall MuiChip-clickable chainChip"
                  tabindex="0"
                  role="button"
                  data-testid="NetworkChip-mainnet"
                  style={{
                    marginRight: "4px",
                    borderColor: "#282727",
                  }}
                >
                  <img
                    src={selectedChain.image}
                    style={{ height: "20px", width: "20px" }}
                    alt=""
                    class="MuiChip-avatar jss159 MuiChip-avatarSmall"
                    aria-hidden="true"
                  />
                  <span class="MuiChip-label MuiChip-labelSmall">
                    {selectedChain.label}
                  </span>
                  <span class="MuiTouchRipple-root"></span>
                </div>
              )}
              <div
                class="MuiButtonBase-root MuiChip-root jss160 MuiChip-outlined MuiChip-sizeSmall MuiChip-clickable chainChip"
                tabindex="0"
                role="button"
                style={{ padding: "0px 15px 0px 15px" }}
                onClick={() => {
                  setOpen(true);
                }}
              >
                <span class="MuiChip-label MuiChip-labelSmall">...</span>
                <span class="MuiTouchRipple-root"></span>
              </div>
            </div>

            <Dialog
              classes={{ paper: classes.dialogPaper }}
              onClose={() => setOpen(false)}
              open={open}
            >
              <Autocomplete
                open={true}
                disablePortal
                id="combo-box-demo"
                options={chains}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Type a Network" />
                )}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <img loading="lazy" width="20" src={option.image} alt="" />
                    {option.label}
                  </Box>
                )}
                value={selectedChain.label}
                onChange={async (e, newValue) => {
                  const selectedchain =
                    newValue !== null ? newValue?.value : "";

                  const { chainId } = await provider.getNetwork();
                  if (selectedchain == "fvm" && chainId !== 314) {
                    await switchNetwork(ethers.utils.hexValue(314));
                  } else if (
                    selectedchain == "fvmtestnet" &&
                    chainId !== 3141
                  ) {
                    await switchNetwork(ethers.utils.hexValue(3141));
                  } else if (selectedchain == "mumbai" && chainId !== 80001) {
                    await switchNetwork(ethers.utils.hexValue(80001));
                  } else if (
                    selectedchain == "celotestnet" &&
                    chainId !== 44787
                  ) {
                    await switchNetwork(ethers.utils.hexValue(44787));
                  } else if (
                    selectedchain == "arbitrumtestnet" &&
                    chainId !== 421613
                  ) {
                    await switchNetwork(ethers.utils.hexValue(421613));
                  } else if (
                    selectedchain == "ethereumtestnet" &&
                    chainId !== 11155111
                  ) {
                    await switchNetwork(ethers.utils.hexValue(11155111));
                  }

                  value.setAutoCompleteData(selectedchain);
                  setSelectedChain(newValue);

                  setOpen(false);
                }}
                openOnFocus={true}
                autoHighlight={true}
                autoSelect={true}
                disableClearable={true}
              />
            </Dialog>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default GetNFTDetails;
