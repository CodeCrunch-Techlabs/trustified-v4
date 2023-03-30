import React, { useContext } from "react";
import {
  FormControlLabel,
  FormHelperText,
  Switch,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Divider,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { BadgeContext } from "../../context/BadgeContext";

const GetCsvFile = () => {
  const value = useContext(BadgeContext);
  const formdata = value.labelInfo.formData;
  const [validity, setValidity] = React.useState("lifetime");
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

            <Divider />
            {/* <FormControlLabel
              sx={{ m: 2 }}
              control={
                <Switch
                  checked={value.checked}
                  onChange={value.switchHandler}
                />
              }
              label="Soulbound NFT"
            />
            <FormHelperText>Make your NFT non-transferable</FormHelperText> */}
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default GetCsvFile;
