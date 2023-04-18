import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { ethers } from "ethers";

import { NFTStorageContext } from "../../../context/NFTStorageContext";
import { toast } from "react-toastify";

function GetNFTDetails() {
  const provider = new ethers.providers.Web3Provider(window.ethereum); 
  const value = useContext(NFTStorageContext);
  const formdata = value.labelInfo.formData; 
 
 
  async function switchNetwork(chainId) { 
    try {
      // check if the chain ID is already available in MetaMask
      const chainData = await window.ethereum.request({
        method: "eth_chainId",
        params: [],
      }); 
 
      if (chainData !== chainId && chainId === ethers.utils.hexValue(80001)) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `${chainId}` }], // chainId must be in HEX with 0x in front
        });
        document.location.reload();
      }

      if (chainData !== chainId && chainId === ethers.utils.hexValue(314)) {
        
        // chain ID is not available, add the chain to MetaMask
        const rpcUrl = "https://api.node.glif.io/rpc/v1"; // replace with your RPC URL
        const chainName = "Filecoin Mainnet"; // replace with your chain name
        const symbol = "FIL"; // replace with your chain symbol
        const decimals = 18; // replace with your token's decimals
        const chainParams = {
          chainId: chainId,
          chainName: chainName,
          nativeCurrency: {
            name: chainName,
            symbol: symbol,
            decimals: decimals,
          },
          rpcUrls: [rpcUrl],
        };
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [chainParams],
        });
      } else {
        
        // chain ID is not available, add the chain to MetaMask
        const rpcUrl = "https://api.hyperspace.node.glif.io/rpc/v1"; // replace with your RPC URL
        const chainName = "Filecoin hyperspace"; // replace with your chain name
        const symbol = "tFIL"; // replace with your chain symbol
        const decimals = 18; // replace with your token's decimals
        const chainParams = {
          chainId: chainId,
          chainName: chainName,
          nativeCurrency: {
            name: chainName,
            symbol: symbol,
            decimals: decimals,
          },
          rpcUrls: [rpcUrl],
        };
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [chainParams],
        });
      }
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `${chainId}` }], // chainId must be in HEX with 0x in front
      });
      document.location.reload();
    } catch (error) {
      toast.error(error.message);
    }
  }


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
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Select Your Network
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={formdata.chain}
                onChange={async (e) => {
                  const { chainId } = await provider.getNetwork();
                  console.log(chainId, "=>", e.target.value, "chainId chainId");
                  if (e.target.value == "fvm" && chainId !== 314) {
                    console.log("call main");
                    await switchNetwork(ethers.utils.hexValue(314));

                  } else if (
                    e.target.value == "fvmtestnet" &&
                    chainId !== 3141
                  ) {
                    console.log("call test");
                    await switchNetwork(ethers.utils.hexValue(3141));

                  } else if (e.target.value == "mumbai" && chainId !== 80001) {
                    console.log("call mumbai");
                    await switchNetwork(ethers.utils.hexValue(80001));
                  } else if (e.target.value == "goerli" && chainId !== 5) {
                    await switchNetwork(ethers.utils.hexValue(5));
                  } else if (e.target.value == "bsc" && chainId !== 97) {
                    await switchNetwork(ethers.utils.hexValue(97));
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
                 {/*   <FormControlLabel
                    value="goerli"
                    control={<Radio />}
                    label="Goerli"
                    onChange={value.setFormdata("chain")}
                  />
                  <FormControlLabel
                    value="bsc"
                    control={<Radio />}
                    label="BSC"
                    onChange={value.setFormdata("chain")}
                  /> */}
                </Stack>
              </RadioGroup>
            </FormControl>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default GetNFTDetails;
