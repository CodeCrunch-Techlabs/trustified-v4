/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useState } from "react";
import {
  Box,
  Stack,
  Button,
  TextField,
  FormHelperText,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import CSVReader from "react-csv-reader";

import { NFTStorageContext } from "../../../context/NFTStorageContext";
import { toast } from "react-toastify";

function GetChain({ message, visiblity, setVisibility, quantityMessage }) {
  const value = useContext(NFTStorageContext);
  const formdata = value.labelInfo.formData;
  const setCsvData = value.setCsvData;
  const [upload, setUpload] = useState(false);
  const [fileName, setFileName] = useState("");

  const generateCsv = () => {
    const rows = [["John Doe"]];

    var csv = "Display Name\n";

    rows.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `sample.csv`;
    downloadLink.click();
  };

  return (
    <div>
      <Stack spacing={3} sx={{ margin: "20px" }}>
        <Box sx={{ m: 1 }}>
          <TextField
            label="Quantity"
            name="quantity"
            id="quantity"
            type="number"
            onChange={value.setFormdata("quantity")}
            value={formdata.quantity}
            error={quantityMessage.length > 0}
            helperText={quantityMessage !== "" ? quantityMessage : ""}
          />
        </Box>

        <Box sx={{ m: 1 }}>
          <FormControl fullwidth={"true"}>
            <Stack
              direction="row"
              justifyContent="start"
              alignItems="center"
              spacing={2}
            >
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={visiblity}
                onChange={(e) => {
                  setVisibility(e.target.value);
                }}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="With Name"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Without Name"
                />
              </RadioGroup>
            </Stack>
          </FormControl>
          <FormHelperText sx={{ fontWeight: "bold" }}>
            Name should be added into certificate or not
          </FormHelperText>
        </Box>

        {visiblity == true || visiblity == "true" ? (
          <>
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
                    if (
                      data[0].indexOf("Display Name") > -1 ||
                      data[0].indexOf("Name") > -1
                    ) {
                      setUpload(true);
                      data.shift();
                      var result = data
                        .map(function (row) {
                          return {
                            name: row[0],
                          };
                        })
                        .filter((row) => row.name !== "");

                      await setCsvData(result);
                      setTimeout(function () {
                        setUpload(false);
                        setFileName(file.name);
                      }, 2000);
                    } else {
                      toast.error(
                        "Display Name column is required in csv file!"
                      );
                    }
                  }}
                />
              </Button>
              <a href="#" onClick={generateCsv}>
                Download sample file
              </a>
              {fileName ? (
                <FormHelperText sx={{ fontWeight: "bold" }}>
                  {fileName}
                </FormHelperText>
              ) : (
                <FormHelperText sx={{ fontWeight: "bold" }}>
                  Make sure the first column should be the Name you want to add
                  in certificate.
                </FormHelperText>
              )}

              {message && (
                <FormHelperText sx={{ fontWeight: "bold", color: "red" }}>
                  {message}
                </FormHelperText>
              )}
            </Box>
          </>
        ) : (
          ""
        )}
      </Stack>
    </div>
  );
}

export default GetChain;
