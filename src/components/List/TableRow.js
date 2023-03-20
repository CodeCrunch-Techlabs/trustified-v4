import React, { useEffect, useState } from "react";
import { CircularProgress, TableCell } from "@mui/material";
import axios from "axios";


const TableRowComponent = ({ id, value,url, event, type }) => {
  const [pdf, setPdf] = useState("");
  const [image, setImage]= useState(""); 

  useEffect(() => {
    if (id == "ipfsurl") {
      getUserSMetadata(value);
      getUserSMetadataImg(value);
    } 
  }, [event, value]);

  const getUserSMetadata = async (url) => {
    let d = await axios.get(url); 
    const rep = d.data.pdf.replace(
      "ipfs://",
      "https://nftstorage.link/ipfs/"
    ); 
    setPdf(rep);
  };

  const getUserSMetadataImg = async (url) => {
    let d = await axios.get(url); 
    const rep = d.data.image.replace(
      "ipfs://",
      "https://nftstorage.link/ipfs/"
    );

    setImage(rep);
  };
  return (
    <TableCell key={id}>
      {id == "ipfsurl" ? (
        <a target="_blank" href={type == "badge" ? image : pdf}>
          Preview
        </a>
      ) : (
        value
      )}
    </TableCell>
  );
};

export default TableRowComponent;
