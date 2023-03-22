import React, { createContext, useEffect, useState } from "react";
import { collection, db, getDocs, query, where } from "../firebase";
import { ethers } from "ethers";
import { chain, trustifiedContracts } from "../config";
import trustifiedContractAbi from "../abi/Trustified.json";
import trustifiedNonTransferableContractAbi from "../abi/TrustifiedNonTransferable.json";
import { toast } from "react-toastify";
import { firebaseDataContext } from "./FirebaseDataContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { NFTStorage, File } from "nft.storage";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { async } from "@firebase/util";

export const Web3Context = createContext(undefined);

const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

export const Web3ContextProvider = (props) => {
  const navigate = useNavigate();
  const [address, setAddress] = useState();
  const [update, setUpdate] = useState(false);
  const [data, setData] = useState();
  const [userId, setUserId] = useState();
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimer, setClaimer] = useState({});
  const [aLoading, setaLoading] = useState(false);

  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();

  const [csvData, setCsvData] = useState([]);

  const firebasedatacontext = React.useContext(firebaseDataContext);
  const {
    addCollection,
    addCollectors,
    updateCollectors,
    template,
    updateCollectorsForBadges,
  } = firebasedatacontext;

  useEffect(() => {
    getFirestoreData();
  }, [update]);

  let add = localStorage.getItem("address");

  useEffect(() => {
    const initialize = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      setProvider(provider);
      setSigner(signer);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAddress(accounts[0]);
    };

    if (add) {
      initialize();
    }
  }, [add]);

  const connectWallet = async (issuerName) => {
    const { ethereum } = window;
    setaLoading(true);

    if (!ethereum) {
      alert("Please install the Metamask Extension!");
    }
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      // await issueCredId(issuerName, accounts[0]);
      setAddress(accounts[0]);
      window.localStorage.setItem("address", accounts[0]);
      setUpdate(!update);
      setaLoading(false);
    } catch (err) {
      setaLoading(false);
      if (err.code === 4902) {
        try {
          setaLoading(true);
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          // await issueCredId(issuerName, accounts[0]);
          setAddress(accounts[0]);
          window.localStorage.setItem("address", accounts[0]);
          setUpdate(!update);
          setaLoading(false);
        } catch (err) {
          setaLoading(false);
          alert(err.message);
        }
      }
    }
  };

  const loginWithTrustified = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install the Metamask Extension!");
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const { chainId } = await provider.getNetwork();

    let currentChain = chain[chainId];

    let obj = {
      chain: currentChain,
      userAddress: accounts[0],
    };

    const api = await axios.create({
      baseURL: "https://trustified-api-o5zg.onrender.com/trustified/api",
    });
    let response = await api
      .post("/login", obj)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
      });

    if (response.data.status == true) {
      setAddress(accounts[0]);
      window.localStorage.setItem("address", accounts[0]);
      setUpdate(!update);
    } else {
      toast.error("You don't have Trustified NFT");
    }

    // const trustifiedContract = new ethers.Contract(
    //   trustifiedContracts[currentChain].transferable,
    //   trustifiedContractAbi.abi,
    //   signer
    // );
    // const trustifiedNonTransferableContract = new ethers.Contract(
    //   trustifiedContracts[currentChain].nonTransferable,
    //   trustifiedNonTransferableContractAbi.abi,
    //   signer
    // );

    // let balance1 = await trustifiedContract.balanceOf(accounts[0]);
    // let balance2 = await trustifiedNonTransferableContract.balanceOf(
    //   accounts[0]
    // );

    // if (Number(balance1) > 0 || Number(balance2) > 0) {
    //   setAddress(accounts[0]);
    //   window.localStorage.setItem("address", accounts[0]);
    //   setUpdate(!update);
    // } else {
    //   toast.error("You don't have Trustified NFT");
    // }
  };

  const disconnectWallet = () => {
    navigate("/");
    window.localStorage.removeItem("address");
    setUpdate(!update);
    window.location.reload();
  };
  const shortAddress = (addr) =>
    addr.length > 10 && addr.startsWith("0x")
      ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
      : addr;

  const getFirestoreData = async () => {
    const add = window.localStorage.getItem("address");
    const q = query(collection(db, "UserProfile"), where("Address", "==", add));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((fire) => {
      setData(fire.data());
      setUserId(fire.id);
    });
  };

  function generateClaimToken(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678910";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const createBadgesNFTCollecion = async (
    data,
    firebasedata,
    checked,
    type
  ) => {
    try {
      const trustifiedContract = new ethers.Contract(
        checked == true
          ? trustifiedContracts[firebasedata.chain].nonTransferable
          : trustifiedContracts[firebasedata.chain].transferable,
        checked == true
          ? trustifiedNonTransferableContractAbi.abi
          : trustifiedContractAbi.abi,
        signer
      );
      var transactionMint;
      if (type == "badge") {
        transactionMint = await trustifiedContract.bulkMintERC721(
          data.tokenUris[0],
          parseInt(firebasedata.quantity),
          0
        ); // Bulk Mint NFT collection.
      }

      let txm = await transactionMint.wait();

      if (txm) {
        var event;

        setTimeout(async () => {
          const mintStaus = await trustifiedContract.getMintStatus();
          if (mintStaus == true) {
            if (type == "badge") {
              event = await txm.events[parseInt(firebasedata.quantity)];
            }

            var eventId = event?.args[1];

            firebasedata.contract = trustifiedContract.address;
            firebasedata.userId = userId;
            firebasedata.eventId = parseInt(Number(eventId));
            firebasedata.type = type;
            firebasedata.image = data.tokenUris[0];
            firebasedata.templateId = "";
            firebasedata.Nontransferable = checked == true ? "on" : "off";
            await addCollection(firebasedata);

            let tokenIds = await trustifiedContract.getTokenIds(
              Number(eventId)
            );

            var array = [];
            for (let i = 0; i < tokenIds.length; i++) {
              let obj = {};
              let claimToken = generateClaimToken(20);

              if (type == "badge") {
                array.push({
                  ClaimUrl: `https://trustified.xyz/claim/${claimToken}`,
                });
              }

              obj.token = claimToken;
              obj.tokenContract = trustifiedContract.address;
              obj.tokenId = parseInt(Number(tokenIds[i]));
              obj.claimerAddress = "";
              obj.ipfsurl = `https://nftstorage.link/ipfs/${data.tokenUris[0]}/metadata.json`;
              obj.chain = firebasedata.chain;
              obj.name = "";
              obj.type = type;
              obj.claimed = "No";
              obj.eventId = parseInt(Number(eventId));
              obj.templateId = "";
              obj.Nontransferable = checked == true ? "on" : "off";
              obj.templateId = "";
              obj.title = firebasedata.title;
              obj.description = firebasedata.description;
              obj.expireDate = firebasedata.expireDate;
              obj.issueDate = firebasedata.issueDate;
              obj.position = "";
              obj.uploadCertData = "";

              await addCollectors(obj);
            } // Generating CSV file with unique link and storing data in firebase.

            let obj = {
              type: type,
              data: array,
            };

            const api = await axios.create({
              baseURL: "https://trustified-backend.onrender.com/trustified/api",
            });
            let response = await api
              .post("/export/csv", obj)
              .then((res) => {
                return res;
              })
              .catch((error) => {
                console.log(error);
              });

            const blob = new Blob([response.data], { type: "text/csv" });

            const downloadLink = document.createElement("a");
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${firebasedata.title}.csv`;
            downloadLink.click();

            toast.success("Successfully created NFT collection!!");
          }
        }, 7000);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something want wrong!!", err);
    }
  };

  const createNFTCollection = async (
    csvdata,
    formData,
    type,
    templateId,
    position,
    previewUrl,
    uploadObj
  ) => {
    try {
      const trustifiedContract = new ethers.Contract(
        formData.Nontransferable == "on"
          ? trustifiedContracts[formData.chain].nonTransferable
          : trustifiedContracts[formData.chain].transferable,
        formData.Nontransferable == "on"
          ? trustifiedNonTransferableContractAbi.abi
          : trustifiedContractAbi.abi,
        signer
      );
      let transactionMint = await trustifiedContract.bulkMintERC721(
        "",
        parseInt(csvdata.length),
        1
      );
      let txm = await transactionMint.wait();
      if (txm) {
        let event = await txm.events[parseInt(csvdata?.length)];
        var eventId = event?.args[1];
        formData.contract = trustifiedContract.address;
        formData.userId = userId;
        formData.eventId = parseInt(Number(eventId));
        formData.type = type;
        formData.image = previewUrl ? previewUrl : template.preview;
        formData.templateId = templateId;
        await addCollection(formData);

        let tokenIds = await trustifiedContract.getTokenIds(
          parseInt(Number(eventId))
        );

        var array = [];

        for (let i = 0; i < tokenIds.length; i++) {
          let obj = {};
          let claimToken = generateClaimToken(20);

          if (type == "badge") {
            array.push({
              ClaimUrl: `https://trustified.xyz/claim/${claimToken}`,
            });
          } else {
            array.push({
              Name: csvdata[i].name,
              ClaimUrl: `https://trustified.xyz/claim/${claimToken}`,
            });
          }

          obj.token = claimToken;
          obj.tokenContract = trustifiedContract.address;
          obj.tokenId = parseInt(Number(tokenIds[i]));
          obj.claimerAddress = "";
          obj.ipfsurl = previewUrl ? previewUrl : "";
          obj.chain = formData.chain;
          obj.name = csvdata[i].name;
          obj.type = type;
          obj.claimed = "No";
          obj.eventId = parseInt(Number(eventId));
          obj.Nontransferable = formData.Nontransferable;
          obj.templateId = previewUrl ? "" : templateId;
          obj.title = formData.title;
          obj.description = formData.description;
          obj.expireDate = formData.expireDate;
          obj.issueDate = formData.issueDate;
          obj.position = previewUrl ? position : "";
          obj.uploadCertData = previewUrl ? uploadObj.name : "";
          await addCollectors(obj);
        } // Generating CSV file with unique link and storing data in firebase.
        let obj = {
          type: type,
          data: array,
        };

        const api = await axios.create({
          baseURL: "https://trustified-backend.onrender.com/trustified/api",
        });
        let response = await api
          .post("/export/csv", obj)
          .then((res) => {
            return res;
          })
          .catch((error) => {
            console.log(error);
          });

        const blob = new Blob([response.data], { type: "text/csv" });

        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${formData.title}.csv`;
        downloadLink.click();
        toast.success("Successfully created NFT collection!!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something want wrong!!", err);
    }
  };

  const claimCertificate = async (
    claimToken,
    claimerAddress,
    claimer,
    textcolor,
    textFamily
  ) => {
    setClaimLoading(true);
    const input = document.getElementById("create-temp");
    const pdfWidth = 800;
    const pdfHeight = 600;
    const canvasWidth = pdfWidth * 1;
    const canvasHeight = pdfHeight * 1;

    var pdfBlob = await html2canvas(input, {
      width: canvasWidth,
      height: canvasHeight,
      scale: 2,
      allowTaint: true,
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
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

      var text = `Certificate Id: #${claimer?.tokenId}`;

      // Set the font size and style for the footer text

      pdf.setFontSize(17);
      pdf.setFont(textFamily);
      pdf.setTextColor(textcolor);

      // Get the number of pages in the document
      var pageCount = pdf.internal.getNumberOfPages();

      // Loop through each page and add the footer text
      for (var i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text(
          text,
          pdf.internal.pageSize.getWidth() -
            pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() -
            10,
          pdf.internal.pageSize.getHeight() - 10
        );
      }
      const pdfBlob = pdf.output("blob");
      return { imageData, pdfBlob };
    });

    const imageFile = new File(
      [pdfBlob.imageData],
      `${claimer?.claimer.replace(/ +/g, "")}.png`,
      {
        type: "image/png",
      }
    );
    const pdfFile = new File(
      [pdfBlob.pdfBlob],
      `${claimer?.claimer.replace(/ +/g, "")}.pdf`,
      {
        type: "application/pdf",
      }
    );
    const metadata = await client.store({
      name: claimer?.title,
      description: claimer?.description,
      image: imageFile,
      pdf: pdfFile,
      claimer: claimer?.claimer,
      eventId: claimer?.eventId,
      expireDate: claimer?.expireDate,
      issueDate: claimer?.issueDate,
    }); 

    let meta = await axios.get(
      `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`
    );

    const q = query(
      collection(db, "Collectors"),
      where("claimToken", "==", claimToken)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (fire) => { 
      try {
        if (fire.data().claimerAddress == "") {
          const trustifiedContract = new ethers.Contract(
            fire.data().tokenContract,
            fire.data().Nontransferable == "on"
              ? trustifiedNonTransferableContractAbi.abi
              : trustifiedContractAbi.abi,
            signer
          );

          let transferTokenTransaction = await trustifiedContract.transferToken(
            fire.data().tokenContract,
            claimerAddress,
            fire.data().tokenId,
            `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`,
            1
          );

          const txt = await transferTokenTransaction.wait(); 

          if (txt) {
            setClaimer(fire.data());
            await updateCollectors({
              id: fire.id,
              claimerAddress: claimerAddress,
              claimed: "Yes",
              ipfsurl: `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`,
            });

            toast.success("Claimed Certificate Successfully!");
            setClaimLoading(false);
          }
        } else {
          const trustifiedContract = new ethers.Contract(
            fire.data().tokenContract,
            trustifiedContractAbi.abi,
            signer
          ); 

          let transferTokenTransaction = await trustifiedContract.transferToken(
            address,
            claimerAddress,
            fire.data().tokenId,
            `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`,
            1
          );

          const txt = await transferTokenTransaction.wait();

          if (txt) {
            setClaimer(fire.data());
            await updateCollectors({
              id: fire.id,
              claimerAddress: claimerAddress,
              claimed: "Yes",
              ipfsurl: `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`,
            });

            toast.success("Claimed Certificate Successfully!");
            setClaimLoading(false);
          }
        }
      } catch (error) {
        toast.error("This certificate is already claimed!");
        setClaimLoading(false);
        console.log(error);
      }
    });
  };

  const claimUploadedCertificate = async (
    claimToken,
    claimerAddress,
    claimer,
    textcolor
  ) => {
    setClaimLoading(true);

    const input = document.getElementById("certificateX");
    const pdfWidth = 800;
    const pdfHeight = 600;
    const canvasWidth = pdfWidth * 1;
    const canvasHeight = pdfHeight * 1;

    var pdfBlob = await html2canvas(input, {
      allowTaint: true,
      useCORS: true,
      width: canvasWidth,
      height: canvasHeight,
      scale: 2,
    }).then(async (canvas) => {
      const imgData = canvas.toDataURL("image/png");
      // const img = new Image(); // create a new image element
      // img.src = imgData; // set the source of the image to the data URL
      const imageData = await fetch(imgData).then((r) => r.blob()); //

      var pdf;
      if (canvas.width > canvas.height) {
        pdf = new jsPDF("l", "pt", [pdfWidth, pdfHeight]);
      } else {
        pdf = new jsPDF("p", "pt", [pdfHeight, pdfWidth]);
      }

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

      var text = `Certificate Id: #${claimer?.tokenId}`;

      // Set the font size and style for the footer text
      pdf.setFontSize(17);
      pdf.setFont("italic");
      pdf.setTextColor(textcolor);

      // Get the number of pages in the document
      var pageCount = pdf.internal.getNumberOfPages();

      // Loop through each page and add the footer text
      for (var i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text(
          text,
          pdf.internal.pageSize.getWidth() -
            pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() -
            10,
          pdf.internal.pageSize.getHeight() - 10
        );
      }

      const pdfBlob = pdf.output("blob");
      return { imageData, pdfBlob };
    });

    const imageFile = new File(
      [pdfBlob.imageData],
      `${claimer?.claimer.replace(/ +/g, "")}.png`,
      {
        type: "image/png",
      }
    );
    const pdfFile = new File(
      [pdfBlob.pdfBlob],
      `${claimer?.claimer.replace(/ +/g, "")}.pdf`,
      {
        type: "application/pdf",
      }
    );
    const metadata = await client.store({
      name: claimer?.title,
      description: claimer?.description,
      image: imageFile,
      pdf: pdfFile,
      claimer: claimer?.claimer,
      eventId: claimer?.eventId,
      expireDate: claimer?.expireDate,
      issueDate: claimer?.issueDate,
    });

    let meta = await axios.get(
      `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`
    );

    const q = query(
      collection(db, "Collectors"),
      where("claimToken", "==", claimToken)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (fire) => {
      try {
        if (fire.data().claimerAddress == "") {
          const trustifiedContract = new ethers.Contract(
            fire.data().tokenContract,
            fire.data().Nontransferable == "on"
              ? trustifiedNonTransferableContractAbi.abi
              : trustifiedContractAbi.abi,
            signer
          );

          let transferTokenTransaction = await trustifiedContract.transferToken(
            fire.data().tokenContract,
            claimerAddress,
            fire.data().tokenId,
            `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`,
            1
          );

          const txt = await transferTokenTransaction.wait();

          if (txt) {
            setClaimer(fire.data());
            await updateCollectors({
              id: fire.id,
              claimerAddress: claimerAddress,
              claimed: "Yes",
              ipfsurl: `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`,
            });
            toast.success("Claimed Certificate Successfully!");

            setClaimLoading(false);
          }
        } else {
          const trustifiedContract = new ethers.Contract(
            fire.data().tokenContract,
            trustifiedContractAbi.abi,
            signer
          );

          let transferTokenTransaction = await trustifiedContract.transferToken(
            address,
            claimerAddress,
            fire.data().tokenId,
            `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`,
            1
          );

          const txt = await transferTokenTransaction.wait();

          if (txt) {
            setClaimer(fire.data());
            await updateCollectors({
              id: fire.id,
              claimerAddress: claimerAddress,
              claimed: "Yes",
              ipfsurl: `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`,
            });

            toast.success("Claimed Certificate Successfully!");

            setClaimLoading(false);
          }
        }
      } catch (error) {
        toast.error("This certificate is already claimed!");
        setClaimLoading(false);
        console.log(error);
      }
    });
  };

  const claimBadges = async (claimToken, claimerAddress) => {
    setClaimLoading(true);
    const q = query(
      collection(db, "Collectors"),
      where("claimToken", "==", claimToken)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (fire) => {
      try {
        if (fire.data().claimerAddress == "") {
          const trustifiedContract = new ethers.Contract(
            fire.data().tokenContract,
            fire.data().Nontransferable == "on"
              ? trustifiedNonTransferableContractAbi.abi
              : trustifiedContractAbi.abi,
            signer
          );

          let transferTokenTransaction = await trustifiedContract.transferToken(
            fire.data().tokenContract,
            claimerAddress,
            fire.data().tokenId,
            "",
            0
          );

          const txt = await transferTokenTransaction.wait();

          if (txt) {
            setClaimer(fire.data());
            await updateCollectorsForBadges({
              id: fire.id,
              claimerAddress: claimerAddress,
              claimed: "Yes",
            });
            toast.success("Claimed Certificate Successfully!");
            window.open(fire.data().ipfsurl, "_blank");
            setClaimLoading(false);
          }
        } else {
          const trustifiedContract = new ethers.Contract(
            fire.data().tokenContract,
            trustifiedContractAbi.abi,
            signer
          );

          let transferTokenTransaction = await trustifiedContract.transferToken(
            address,
            claimerAddress,
            fire.data().tokenId,
            "",
            0
          );

          const txt = await transferTokenTransaction.wait();

          if (txt) {
            setClaimer(fire.data());
            await updateCollectorsForBadges({
              id: fire.id,
              claimerAddress: claimerAddress,
              claimed: "Yes",
            });
            toast.success("Claimed Certificate Successfully!");
            window.open(fire.data().ipfsurl, "_blank");
            setClaimLoading(false);
          }
        }
      } catch (error) {
        toast.error("This certificate is already claimed!");
        setClaimLoading(false);
        console.log(error);
      }
    });
  };

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        createNFTCollection,
        createBadgesNFTCollecion,
        shortAddress,
        disconnectWallet,
        claimCertificate,
        claimUploadedCertificate,
        loginWithTrustified,
        getFirestoreData,
        claimBadges,
        claimLoading,
        setUpdate,
        csvData,
        address,
        update,
        data,
        claimer,
        userId,
        aLoading,
      }}
      {...props}
    >
      {props.children}
    </Web3Context.Provider>
  );
};
