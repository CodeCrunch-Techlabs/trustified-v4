import React, { useContext } from "react";
import {
  TextareaAutosize,
  TextField,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box,
} from "@mui/material";
import { ethers } from "ethers";
import { BadgeContext } from "../../context/BadgeContext";
import { Web3Context } from "../../context/Web3Context";

function GetTitle() {
  const value = useContext(BadgeContext);
  const formdata = value.labelInfo.formData;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const web3Context = React.useContext(Web3Context);
  const { switchNetwork } = web3Context;

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
      <Box sx={{ minWidth: 120 }}>
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
              if (e.target.value == "fvm" && chainId !== 314) {
                await switchNetwork(ethers.utils.hexValue(314));
              } else if (e.target.value == "fvmtestnet" && chainId !== 3141) {
                await switchNetwork(ethers.utils.hexValue(3141));
              } else if (e.target.value == "mumbai" && chainId !== 80001) {
                await switchNetwork(ethers.utils.hexValue(80001));
              } else if (e.target.value == "celotestnet" && chainId !== 44787) {
                await switchNetwork(ethers.utils.hexValue(44787));
              } else if (
                e.target.value == "arbitrumtestnet" &&
                chainId !== 421613
              ) {
                await switchNetwork(ethers.utils.hexValue(421613));
              } else if (
                e.target.value == "ethereumtestnet" &&
                chainId !== 11155111
              ) {
                await switchNetwork(ethers.utils.hexValue(11155111));
              }

              // setChain(e.target.value)
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
              {/* <FormControlLabel
                value="arbitrumtestnet"
                control={<Radio />}
                label="Arbitrum Goerli"
                onChange={value.setFormdata("chain")}
              /> */}
              <FormControlLabel
                value="ethereumtestnet"
                control={<Radio />}
                label="Ethereum Sepolia"
                onChange={value.setFormdata("chain")}
              />
            </Stack>
          </RadioGroup>
        </FormControl>
      </Box>
    </div>
  );
}

export default GetTitle;
