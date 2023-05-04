import React, { useContext, useEffect } from "react";
import {
  TextareaAutosize,
  TextField,
  Autocomplete,
  Stack,
  FormLabel,
  Box,
  Dialog,
} from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import filecoinImage from "../../assets/filecoin.png";
import polygonImage from "../../assets/coin.png";
import celoImage from "../../assets/celo.png";
import airbitrum from "../../assets/airbitrum.png";
import { ethers } from "ethers";
import { BadgeContext } from "../../context/BadgeContext";
import { Web3Context } from "../../context/Web3Context";
import { networkIds } from "../../config";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    height: "50vh",
    Width: "41vw",
    padding: "10px",
  },
}));

function GetTitle() {
  const classes = useStyles();
  const value = useContext(BadgeContext);
  const formdata = value.labelInfo.formData;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
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
      label: "Polygon",
      value: "polygon",
      image: polygonImage,
      chainId: 137,
      priority: 0,
    },
    {
      label: "Polygon Mumbai",
      value: "mumbai",
      image: polygonImage,
      chainId: 80001,
      priority: 1,
    },
    {
      label: "Alfajores Testnet(Celo)",
      value: "celotestnet",
      image: celoImage,
      chainId: 44787,
      priority: 1,
    },
    {
      label: "Celo Mainnet",
      value: "celomainnet",
      image: celoImage,
      chainId: 42220,
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

  // async function switchNetwork(chainId) {
  //   await window.ethereum.request({
  //     method: "wallet_switchEthereumChain",
  //     params: [{ chainId: `${chainId}` }], // chainId must be in HEX with 0x in front
  //   });
  //   document.location.reload();
  // }

  return (
    <div>
      <Stack spacing={3} sx={{ margin: "10px" }}>
        <TextField
          fullwidth={"true"}
          label="Title"
          name="title"
          id="title"
          type="title"
          onChange={value.setFormdata("title")}
          value={formdata.title}
        />
        <TextareaAutosize
          fullwidth={"true"}
          name="description"
          id="description"
          type="text"
          label="Description"
          placeholder="Description"
          aria-label="minimum height"
          minRows={5}
          maxRows={6}
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
              const selectedchain = newValue !== null ? newValue?.value : "";



              const { chainId } = await provider.getNetwork();
              if (chainId !== newValue.chainId) {
                await switchNetwork(
                  ethers.utils.hexValue(newValue.chainId)
                );
              }
              // if (selectedchain == "fvm" && chainId !== 314) {
              //   await switchNetwork(ethers.utils.hexValue(314));
              // } else if (selectedchain == "fvmtestnet" && chainId !== 3141) {
              //   await switchNetwork(ethers.utils.hexValue(3141));
              // } else if (selectedchain == "mumbai" && chainId !== 80001) {
              //   await switchNetwork(ethers.utils.hexValue(80001));
              // } else if (selectedchain == "celotestnet" && chainId !== 44787) {
              //   await switchNetwork(ethers.utils.hexValue(44787));
              // } else if (
              //   selectedchain == "arbitrumtestnet" &&
              //   chainId !== 421613
              // ) {
              //   await switchNetwork(ethers.utils.hexValue(421613));
              // } else if (
              //   selectedchain == "ethereumtestnet" &&
              //   chainId !== 11155111
              // ) {
              //   await switchNetwork(ethers.utils.hexValue(11155111));
              // }

              
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

      {/* <Box sx={{ minWidth: 120 }}>
        <FormControl fullwidth={"true"}>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Select Your Network
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={formdata.chain}
            onChange={async (e) => {
              const { chainId } = await provider.getNetwork();  
              const selectedNetworkId = networkIds[e.target.value]; 
              if (selectedNetworkId && chainId !== selectedNetworkId) {
                await switchNetwork(ethers.utils.hexValue(selectedNetworkId));
              }
            
            }}
          >
            <Stack
              direction="row"
              justifyContent="start"
              alignItems="center"
              spacing={2}
            >
              <FormControlLabel
                value="fvm"
                control={<Radio />}
                label="FVM(Mainnet)"
                onChange={value.setFormdata("chain")}
              />
              <FormControlLabel
                value="fvmtestnet"
                control={<Radio />}
                label="FVM Testnet(Hyperspace)"
                onChange={value.setFormdata("chain")}
              />
              <FormControlLabel
                value="mumbai"
                control={<Radio />}
                label="Polygon Mumbai"
                onChange={value.setFormdata("chain")}
              />
              <FormControlLabel
                value="celotestnet"
                control={<Radio />}
                label="Alfajores Testnet(Celo)"
                onChange={value.setFormdata("chain")}
              />
              <FormControlLabel
                value="arbitrumtestnet"
                control={<Radio />}
                label="Arbitrum Goerli"
                onChange={value.setFormdata("chain")}
              />
            
              <FormControlLabel
                value="ethereumtestnet"
                control={<Radio />}
                label="Ethereum Sepolia"
                onChange={value.setFormdata("chain")}
              />
            </Stack>
          </RadioGroup>
        </FormControl>
      </Box> */}
    </div>
  );
}

export default GetTitle;
