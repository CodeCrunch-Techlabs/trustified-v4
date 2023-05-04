import React, { useContext } from "react";
import { 
  FormHelperText, 
  TextField, 
  Divider,
  Button,
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


          
            <Divider /> 
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default GetCsvFile;
