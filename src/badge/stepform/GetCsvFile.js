import React, { useContext } from "react";
import {
  FormControlLabel,
  FormHelperText,
  Switch,
  TextField,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { BadgeContext } from "../../context/BadgeContext";

const GetCsvFile = () => {
  const value = useContext(BadgeContext);
  const formdata = value.labelInfo.formData;
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <Stack spacing={3} sx={{ margin: "20px" }}>
            <Box sx={{ m: 1 }}>
              <TextField
                label="Quantity"
                name="quantity"
                id="quantity"
                type="number"
                onChange={value.setFormdata("quantity")}
                value={formdata.quantity}
              />
            </Box>

            <FormControlLabel
              sx={{ m: 2 }}
              control={
                <Switch
                  checked={value.checked}
                  onChange={value.switchHandler}
                />
              }
              label="Soulbound NFT"
            />
            <FormHelperText>Make your NFT non-transferable</FormHelperText>
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default GetCsvFile;
