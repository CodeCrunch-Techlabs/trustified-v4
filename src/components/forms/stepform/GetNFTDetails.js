import React, { useContext } from "react";
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

function GetNFTDetails() {
  const value = useContext(NFTStorageContext);
  const formdata = value.labelInfo.formData;
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  async function switchNetwork(chainId) {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `${chainId}` }], // chainId must be in HEX with 0x in front
    });
    document.location.reload();
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
                  if (e.target.value == "filecoin" && chainId !== 314) {
                    await switchNetwork(ethers.utils.hexValue(314));
                  } else if (e.target.value == "fevm" && chainId !== 3141) {
                    await switchNetwork(ethers.utils.hexValue(3141));
                  } else if (e.target.value == "mumbai" && chainId !== 137) {
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
                    value="filecoin"
                    control={<Radio />}
                    label="Filecoin(Mainnet)"
                    onChange={value.setFormdata("chain")}
                  />
                  <FormControlLabel
                    value="fevm"
                    control={<Radio />}
                    label="FEVM"
                    onChange={value.setFormdata("chain")}
                  />
                  <FormControlLabel
                    value="mumbai"
                    control={<Radio />}
                    label="Polygon Mumbai"
                    onChange={value.setFormdata("chain")}
                  />
                  <FormControlLabel
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
                  />
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
