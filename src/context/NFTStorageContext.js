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
  const [uploadObj, setUploadObj] = useState({});
  const [checked, setChecked] = useState(true);
  const [uploadCert, setUploadCert] = useState(false);

  const [labelInfo, setlabelInfo] = useState({
    formData: {
      title: "",
      description: "",
      chain: "fevm",
      expireDate: "",
      issueDate: new Date(),
      Nontransferable: "on",
    },
  });

  const web3Context = React.useContext(Web3Context);
  const { createNftFunction } = web3Context;

  const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  const switchHandler = (event) => {
    setChecked(event.target.checked);
  };


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
    setUploadCert(true);
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
    setUploadCert(false);
  };

  const createCertificateNFT = async () => {
    try {
      setUploading(true);
      if (ipfsurl) {
        createNftFunction(
          csvData,
          labelInfo.formData,
          "certificate",
          selectedTemplateId,
          usernamePos,
          ipfsurl,
          uploadObj
        ).then((e) => {
          setUploading(false);
          setUploadObj("")
        }); 
      } else {
        createNftFunction(
          csvData,
          labelInfo.formData,
          "certificate",
          selectedTemplateId,
          usernamePos,
          ipfsurl,
          uploadObj
        ).then((res) => {
          setUploading(false);
          setUploadObj("")
        });
      }  
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
        uploadCert,
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
        setUploadObj,
      }}
      {...props}
    >
      {props.children}
    </NFTStorageContext.Provider>
  );
};
