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
            <Divider /> 
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default GetCsvFile;
