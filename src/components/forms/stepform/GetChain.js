import React, { useContext, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Button,
  TextField,
  FormHelperText,
  Divider,
} from "@mui/material";
import CSVReader from "react-csv-reader";

import { NFTStorageContext } from "../../../context/NFTStorageContext";
import { async } from "@firebase/util";

function GetChain() {
  const value = useContext(NFTStorageContext);
  const formdata = value.labelInfo.formData;
  const setCsvData = value.setCsvData;
  const [validity, setValidity] = useState("lifetime");
  const [upload, setUpload] = useState(false);
  const [fileName, setFileName] = useState("");

  return (
    <div>
      <Stack spacing={3} sx={{ margin: "20px" }}>
        {/* {validity == "limited" ? (
          <Box sx={{ display: "flex", justifyContent: "start", m: 2 }}>
            <TextField
              id="date"
              label="Expire Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              name="expireDate"
              onChange={value.setFormdata("expireDate")}
              value={formdata.expireDate}
            />
          </Box>
        ) : (
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Validity
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={validity}
              >
                <Stack
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                  spacing={2}
                >
                  <FormControlLabel
                    value="limited"
                    control={<Radio />}
                    label="Limited"
                    onChange={(e) => setValidity(e.target.value)}
                  />
                  <FormControlLabel
                    value="lifetime"
                    control={<Radio />}
                    label="Lifetime"
                    onChange={(e) => setValidity(e.target.value)}
                  />
                </Stack>
              </RadioGroup>
            </FormControl>
          </Box>
        )} */}
        {/* <Divider /> */}

        {/* <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <FormLabel id="demo-controlled-radio-buttons-group">
              NFT Type
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={formdata.Nontransferable}
            >
              <Stack
                direction="row"
                justifyContent="start"
                alignItems="center"
                spacing={2}
              >
                <FormControlLabel
                  value="off"
                  control={<Radio />}
                  label="Transferable"
                  onChange={value.setFormdata("Nontransferable")}
                />
                <FormControlLabel
                  value="on"
                  control={<Radio />}
                  label="Non-transferable(Soulbound NFT)"
                  onChange={value.setFormdata("Nontransferable")}
                />
              </Stack>
            </RadioGroup>
            <FormHelperText>Make your NFT non-transferable</FormHelperText>
          </FormControl>
        </Box> */}

        <Stack spacing={3} sx={{ margin: "20px" }}>
          <span>Upload excel sheet of collectors data</span>
          <Box sx={{ m: 1 }}>
            <Button
              sx={{ m: 1, color: "white" }}
              variant="contained"
              component="label"
              disabled={upload}
            >
              {upload ? "Uploading..." : "Upload File"}
              <CSVReader
                inputStyle={{ display: "none" }}
                onFileLoaded={async (data, file) => {
                  setUpload(true);

                  data.shift();
                  var result = data.map(function (row) {
                    return {
                      name: row[0],
                    };
                  });
                  await setCsvData(result);
                  setTimeout(function () {
                    setUpload(false);
                    setFileName(file.name);
                  }, 2000);
                }}
              />
            </Button>
            {fileName && (
              <FormHelperText sx={{ fontWeight: "bold" }}>
                {fileName}
              </FormHelperText>
            )}
          </Box>
        </Stack>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button
            variant="contained"
            style={{ color: "white" }}
            onClick={value.handleAddLink}
            sx={{ mt: 1, mr: 1 }}
            disabled={value.links.length > 2 ? true : false}
          >
            Add Links
          </Button>
          <FormHelperText>Where people can find you?</FormHelperText>
        </Box>

        <Box>
          {value.links.map((link, index) => (
            <TextField
              key={index}
              sx={{ marginRight: "5px" }}
              id="outlined-size-small"
              size="small"
              label="Link"
              name="link"
              type="text"
              onChange={(e) => value.handleLinkChange(e, index)}
              value={link}
            />
          ))}
        </Box>
      </Stack>
    </div>
  );
}

export default GetChain;
