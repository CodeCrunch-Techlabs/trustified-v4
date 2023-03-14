import React, { useState, createContext } from "react";
import { NFTStorage, File } from "nft.storage";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { Web3Context } from "./Web3Context";
import { firebaseDataContext } from "./FirebaseDataContext";
import axios from "axios";

export const NFTStorageContext = createContext(undefined);

export const NFTStorageContextProvider = (props) => {
  const firebasedatacontext = React.useContext(firebaseDataContext);
  const { getTemplate } = firebasedatacontext;
  const [uploading, setUploading] = useState(false);
  const [csvData, setCsvData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [usernamePos, setUsernamePos] = useState({ x: 112, y: -171 });
  const [template, setTemplate] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [ipfsurl, setIpfsurl] = useState("");

  const [labelInfo, setlabelInfo] = useState({
    formData: {
      title: "",
      description: "",
      chain: "fevm",
      expireDate: "",
      transferable: "off",
    },
  });

  const web3Context = React.useContext(Web3Context);
  const { createNFTCollection } = web3Context;

  const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const setFormdata = (prop) => (event) => {
    setlabelInfo({
      ...labelInfo,
      formData: { ...labelInfo.formData, [prop]: event.target.value },
    });
  };

  const selectTemplate = (id) => {
    setSelectedTemplateId(id);
    getTemplate(id);
  };

  const uploadCertificate = async (file) => {
    setUploading(true);
    const metadata = await client.store({
      name: "certificate",
      description: "certificate preview",
      image: file,
    });
    setIpfsurl(
      metadata.data.image.href.replace(
        "ipfs://",
        "https://nftstorage.link/ipfs/"
      )
    );
    setUploading(false);
  };

  const createCertificateNFT = async () => {
    console.log(ipfsurl);
    try {
      setUploading(true);
      if (ipfsurl) { 
        await createNFTCollection(
          csvData,
          labelInfo.formData,
          "certificate",
          selectedTemplateId,
          usernamePos,
          ipfsurl
        );
      } else {
        await createNFTCollection(
          csvData,
          labelInfo.formData,
          "certificate",
          selectedTemplateId,
          usernamePos,
          ipfsurl
        );
      }

      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <NFTStorageContext.Provider
      value={{
        createCertificateNFT,
        uploading,
        labelInfo,
        csvData,
        setCsvData,
        setFormdata,
        handleClickOpen,
        handleClose,
        open,
        setUsernamePos,
        previewUrl,
        usernamePos,
        setPreviewUrl,
        template,
        setTemplate,
        selectTemplate,
        uploadCertificate,
      }}
      {...props}
    >
      {props.children}
    </NFTStorageContext.Provider>
  );
};