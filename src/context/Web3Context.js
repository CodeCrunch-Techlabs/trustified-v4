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
    initialize();
  }, []);

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

  const createBadgesNFTCollecion = async (data, firebasedata, type) => {
    try {
      const trustifiedContract = new ethers.Contract(
        firebasedata.transferable == "on"
          ? trustifiedContracts[firebasedata.chain].nonTransferable
          : trustifiedContracts[firebasedata.chain].transferable,
        firebasedata.transferable == "on"
          ? trustifiedNonTransferableContractAbi.abi
          : trustifiedContractAbi.abi,
        signer
      );
      var transactionMint;
      if (type == "badge") {
        console.log(
          data.tokenUris[0],
          parseInt(firebasedata.quantity),
          "test1"
        );
        transactionMint = await trustifiedContract.bulkMintBadgesERC721(
          data.tokenUris[0],
          parseInt(firebasedata.quantity)
        ); // Bulk Mint NFT collection.
      } else {
        transactionMint = await trustifiedContract.bulkMintERC721(
          data.tokenUris
        ); // Bulk Mint NFT collection.
      }

      let txm = await transactionMint.wait();
      if (txm) {
        var event;
        if (type == "badge") {
          event = await txm.events[parseInt(firebasedata.quantity)];
        } else {
          event = await txm.events[parseInt(data?.tokenUris?.length)];
        }

        var eventId = event?.args[1];
        firebasedata.contract = trustifiedContract.address;
        firebasedata.userId = userId;
        firebasedata.eventId = parseInt(Number(eventId));
        firebasedata.type = type;
        firebasedata.image = data.tokenUris[0];
        firebasedata.templateId = "";
        await addCollection(firebasedata);

        let tokenIds = await trustifiedContract.getTokenIds(
          parseInt(Number(eventId))
        );


        var array = [];
        for (let i = 0; i < tokenIds.length; i++) {
          let obj = {};
          let claimToken = generateClaimToken(5);
          const tokenCID = await trustifiedContract.tokenURI(
            Number(tokenIds[i])
          );

          let d = await axios.get(
            `https://nftstorage.link/ipfs/${tokenCID}/metadata.json`
          );
          // https://trustified.xyz/
          if (type == "badge") {
            array.push({
              ClaimUrl: `https://trustified.xyz/claim/${claimToken}`,
            });
          } else {
            array.push({
              Name: d.data.claimer,
              ClaimUrl: `https://trustified.xyz/claim/${claimToken}`,
            });
          }

          obj.token = claimToken;
          obj.tokenContract = trustifiedContract.address;
          obj.tokenId = parseInt(Number(tokenIds[i]));
          obj.claimerAddress = "";
          obj.ipfsurl = `https://nftstorage.link/ipfs/${tokenCID}/metadata.json`;
          obj.chain = firebasedata.chain;
          obj.name = d.data.claimer;
          obj.type = type;
          obj.claimed = "No";
          obj.eventId = parseInt(Number(eventId));
          obj.templateId = "";
          obj.transferable = firebasedata.transferable;
          obj.templateId = "";
          obj.title = firebasedata.title;
          obj.description = firebasedata.description;
          obj.expireDate = "";
          obj.position = "";

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

        var hiddenElement = document.createElement("a");
        hiddenElement.href =
          "data:text/csv;charset=utf-8," + encodeURI(response.data);
        hiddenElement.target = "_blank";
        //provide the name for the CSV file to be downloaded
        hiddenElement.download = `${firebasedata.title}.csv`;
        hiddenElement.click();
        toast.success("Successfully created NFT collection!!");
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
    previewUrl
  ) => {
    try {
      const trustifiedContract = new ethers.Contract(
        formData.transferable == "on"
          ? trustifiedContracts[formData.chain].nonTransferable
          : trustifiedContracts[formData.chain].transferable,
        formData.transferable == "on"
          ? trustifiedNonTransferableContractAbi.abi
          : trustifiedContractAbi.abi,
        signer
      );
      let transactionMint = await trustifiedContract.bulkMintERC721(
        parseInt(csvdata.length)
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
          let claimToken = generateClaimToken(5);

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
          obj.transferable = formData.transferable;
          obj.templateId = previewUrl ? "" : templateId;
          obj.title = formData.title;
          obj.description = formData.description;
          obj.expireDate = formData.expireDate;
          obj.position = previewUrl ? position : "";

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

        var hiddenElement = document.createElement("a");
        hiddenElement.href =
          "data:text/csv;charset=utf-8," + encodeURI(response.data);
        hiddenElement.target = "_blank";
        //provide the name for the CSV file to be downloaded
        hiddenElement.download = `${formData.title}.csv`;
        hiddenElement.click();
        toast.success("Successfully created NFT collection!!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something want wrong!!", err);
    }
  };

  const claimCertificate = async (claimToken, claimerAddress, claimer) => {
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
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      // pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height); 
      // pdf.save('my-pdf.pdf'); 
      // const imgData = canvas.toDataURL("image/png");
      const imageData = await fetch(imgData).then((r) => r.blob());  
      var pdf;
      if (canvas.width > canvas.height) {
        pdf =  new jsPDF('l', 'pt', [pdfWidth, pdfHeight]); 
      } else {
        pdf = new jsPDF("p", "pt", [pdfHeight, pdfWidth]);
      } 
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

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
            fire.data().transferable == "on"
              ? trustifiedNonTransferableContractAbi.abi
              : trustifiedContractAbi.abi,
            signer
          );

          let transferTokenTransaction = await trustifiedContract.transferToken(
            fire.data().tokenContract,
            claimerAddress,
            fire.data().tokenId,
            `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json` 
          );

          const txt = await transferTokenTransaction.wait();

          if (txt) {
            setClaimer(fire.data());
            await updateCollectors({
              id: fire.id,
              claimerAddress: claimerAddress,
              claimed: "Yes",
              ipfsurl: `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json` ,
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
            `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json` 
          );

          const txt = await transferTokenTransaction.wait();

          if (txt) {
            setClaimer(fire.data());
            await updateCollectors({
              id: fire.id,
              claimerAddress: claimerAddress,
              claimed: "Yes",
              ipfsurl: `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json` ,
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
    claimer
  ) => {
    setClaimLoading(true);

    const input = document.getElementById("certificateX");


    var pdfBlob = await html2canvas(input, {
      allowTaint: true,
      useCORS: true,
      height: 600,
      width: 800,
      scale:4,
    }).then(async (canvas) => {
      const imgData = canvas.toDataURL("image/png");
      // const img = new Image(); // create a new image element
      // img.src = imgData; // set the source of the image to the data URL
      const imageData = await fetch(imgData).then((r) => r.blob()); //

      var pdf;
      if (canvas.width > canvas.height) {
        pdf = new jsPDF("l", "mm", [canvas.width, canvas.height]);
      } else {
        pdf = new jsPDF("p", "mm", [canvas.height, canvas.width]);
      }

      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);

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
            fire.data().transferable == "on"
              ? trustifiedNonTransferableContractAbi.abi
              : trustifiedContractAbi.abi,
            signer
          );

          let transferTokenTransaction = await trustifiedContract.transferToken(
            fire.data().tokenContract,
            claimerAddress,
            fire.data().tokenId,
            `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`
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
            `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`
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
            fire.data().transferable == "on"
              ? trustifiedNonTransferableContractAbi.abi
              : trustifiedContractAbi.abi,
            signer
          );

          let transferTokenTransaction =
            await trustifiedContract.transferBadgesToken(
              fire.data().tokenContract,
              claimerAddress,
              fire.data().tokenId
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

          let transferTokenTransaction =
            await trustifiedContract.transferBadgesToken(
              address,
              claimerAddress,
              fire.data().tokenId
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
