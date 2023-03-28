import html2canvas from "html2canvas";
import React, { useState, createContext, useEffect } from "react";
import { NFTStorage, File } from "nft.storage";
import jsPDF from "jspdf";
import { Web3Context } from "./Web3Context";
export const BadgeContext = createContext(undefined);
export const BadgeContextProvider = (props) => {
  const [open, setOpen] = React.useState(false);
  const [uploadLogo, setLogo] = useState("");
  const [csvData, setCsvData] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const web3Context = React.useContext(Web3Context);
  const { createBadges } = web3Context;
  const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
  const [checked, setChecked] = useState(true);

  const [previewUrl, setPreviewUrl] = useState("");
  const [usernamePos, setUsernamePos] = useState({ x: 112, y: -171 });

  const [labelInfo, setlabelInfo] = useState({
    formData: {
      title: "",
      description: "",
      template: "",
      name: "",
      chain: "fevm",
      badgeName: "",
      Nontransferable: true,
      quantity: 0,
      expireDate: "",
      issueDate: new Date(),
    },
  });
  const handleChangeLogo = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setLogo(url);
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

  const switchHandler = (event) => {
    setChecked(event.target.checked);
  };

  const createBadge = async () => {
    try {
      setLoading(true);
      var array = [];

      if (previewUrl) {
        const badgeImg = document.getElementById("badge-img");
        var pdfBlob = await html2canvas(badgeImg, {
          allowTaint: true,
          scale: 2,
          useCORS: true,
        }).then(async (canvas) => {
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          const imageData = await fetch(imgData).then((r) => r.blob());
          return { imageData };
        });
        const imageFile = new File(
          [pdfBlob.imageData],
          `${labelInfo.formData.title.replace(/ +/g, "")}.png`,
          {
            type: "image/png",
          }
        );

        const metadata = await client.store({
          name: labelInfo.formData.title,
          description: labelInfo.formData.description,
          image: imageFile,
          claimer: "",
          expireDate: labelInfo.formData.expireDate,
          issueDate: labelInfo.formData.issueDate,
          price: "0.001",
        });
        array.push(metadata.ipnft);
      } else {
        const idd = `badgeToprint${labelInfo.formData.template}`;
        const input = document.getElementById(idd);
        var pdfBlob = await html2canvas(input, {
          allowTaint: true,
          scale: 2,
          useCORS: true,
        }).then(async (canvas) => {
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          const imageData = await fetch(imgData).then((r) => r.blob());
          return { imageData };
        });
        const imageFile = new File(
          [pdfBlob.imageData],
          `${labelInfo.formData.title}.png`,
          {
            type: "image/png",
          }
        );
        const metadata = await client.store({
          name: labelInfo.formData.title,
          description: labelInfo.formData.description,
          image: imageFile,
          claimer: "",
          expireDate: labelInfo.formData.expireDate,
          issueDate: labelInfo.formData.issueDate,
           price: "0.001",
        });

        array.push(metadata.ipnft);
      }

      if (array.length > 0) {
        createBadges(
          {
            tokenUris: array,
          },
          labelInfo.formData,
          checked,
          "badge"
        ).then((response) => {
          setLoading(false);
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <BadgeContext.Provider
      value={{
        labelInfo,
        setFormdata,
        handleClickOpen,
        handleClose,
        open,
        handleChangeLogo,
        uploadLogo,
        csvData,
        setCsvData,
        loading,
        createBadge,
        setUsernamePos,
        previewUrl,
        usernamePos,
        setPreviewUrl,
        checked,
        switchHandler,
      }}
      {...props}
    >
      {" "}
      {props.children}
    </BadgeContext.Provider>
  );
};
