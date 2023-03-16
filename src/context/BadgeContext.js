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
  const { createBadgesNFTCollecion } = web3Context;
  const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

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
      transferable: "off",
      quantity: 0,
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
  const createBadge = async () => {
    try {
      setLoading(true);
      var array = [];

      if (previewUrl) {
        const input = document.getElementById("badgeId");
        const badgeImg = document.getElementById("badge-img");
        const pdfWidth = 290;
        const pdfHeight = 290;

        var pdfBlob = await html2canvas(badgeImg, {
          allowTaint: true,
          scale: 2,
          useCORS: true,
        }).then(async (canvas) => {
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          const imageData = await fetch(imgData).then((r) => r.blob());
          var pdf;
          if (canvas.width > canvas.height) {
            pdf = new jsPDF("l", "pt", [pdfWidth, pdfHeight]);
          } else {
            pdf = new jsPDF("p", "pt", [pdfHeight, pdfWidth]);
          }
          pdf.roundedRect(10, 60, 190, 220, 5, 5, "S");
          pdf.addImage(
            imgData,
            "JPEG",
            0,
            0,
            pdf.internal.pageSize.getWidth(),
            pdf.internal.pageSize.getHeight()
          );


          const pdfBlob = pdf.output("blob");
          return { imageData, pdfBlob };
        });
        const imageFile = new File(
          [pdfBlob.imageData],
          `${labelInfo.formData.title.replace(/ +/g, "")}.png`,
          {
            type: "image/png",
          }
        );
        const pdfFile = new File(
          [pdfBlob.pdfBlob],
          `${labelInfo.formData.title}.pdf`,
          {
            type: "application/pdf",
          }
        );
        const metadata = await client.store({
          name: labelInfo.formData.title,
          description: labelInfo.formData.description,
          image: imageFile,
          pdf: pdfFile,
          claimer: "",
        });
        array.push(metadata.ipnft);
      } else {
        const idd = `badgeToprint${labelInfo.formData.template}`;
        const input = document.getElementById(idd);
        const pdfWidth = 290;
        const pdfHeight = 290;

        var pdfBlob = await html2canvas(input, {
          allowTaint: true,
          scale: 6,
          useCORS: true,
        }).then(async (canvas) => {
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          // const img = new Image(); // create a new image element
          // img.src = imgData; // set the source of the image to the data URL
          const imageData = await fetch(imgData).then((r) => r.blob()); //
          var pdf;
          if (canvas.width > canvas.height) {
            pdf = new jsPDF("l", "pt", [pdfWidth, pdfHeight]);
          } else {
            pdf = new jsPDF("p", "pt", [pdfHeight, pdfWidth]);
          }
          pdf.addImage(
            imgData,
            "JPEG",
            0,
            0,
            pdf.internal.pageSize.getWidth(),
            pdf.internal.pageSize.getHeight()
          );

          const pdfBlob = pdf.output("blob");
          return { imageData, pdfBlob };
        });
        const imageFile = new File(
          [pdfBlob.imageData],
          `${labelInfo.formData.title}.png`,
          {
            type: "image/png",
          }
        );
        const pdfFile = new File(
          [pdfBlob.pdfBlob],
          `${labelInfo.formData.title}.pdf`,
          {
            type: "application/pdf",
          }
        );
        const metadata = await client.store({
          name: labelInfo.formData.title,
          description: labelInfo.formData.description,
          image: imageFile,
          pdf: pdfFile,
          claimer: "",
        });
        array.push(metadata.ipnft);
      }
      if (array.length > 0) {
        await createBadgesNFTCollecion(
          {
            tokenUris: array,
          },
          labelInfo.formData,
          "badge"
        );
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
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
      }}
      {...props}
    >
      {" "}
      {props.children}
    </BadgeContext.Provider>
  );
};
