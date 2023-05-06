import React, { createContext, useEffect, useState } from "react";
import { collection, db, getDocs, query, where } from "../firebase";
import { ethers } from "ethers";
import { chain, chainParams, trustifiedContracts } from "../config";
import trustifiedContractAbi from "../abi/Trustified.json";
import { toast } from "react-toastify";
import { firebaseDataContext } from "./FirebaseDataContext";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { NFTStorage, File } from "nft.storage";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Web3 from "web3";

export const Web3Context = createContext(undefined);

const NFT_STORAGE_TOKEN = process.env.REACT_APP_NFT_STORAGE_TOKEN;
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

export const Web3ContextProvider = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [address, setAddress] = useState();
  const [update, setUpdate] = useState(false);
  const [data, setData] = useState();
  const [userId, setUserId] = useState();
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimer, setClaimer] = useState({});
  const [aLoading, setaLoading] = useState(false);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

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

  async function switchNetwork(chainId) {
    try {
      const chainData = await window.ethereum.request({
        method: "eth_chainId",
        params: [],
      });

      const selectedChain = chainParams.find(
        (chain) => chain.chainId === chainId
      );

      if (chainData !== chainId && selectedChain) {
        const methodName =
          selectedChain.chainId === chainId
            ? "wallet_addEthereumChain"
            : "wallet_switchEthereumChain";

        await window.ethereum.request({
          method: methodName,
          params: [
            selectedChain.chainId === chainId
              ? {
                  chainId: selectedChain.chainId,
                  chainName: selectedChain.chainName,
                  nativeCurrency: {
                    name: selectedChain.chainName,
                    symbol: selectedChain.symbol,
                    decimals: selectedChain.decimals,
                  },
                  rpcUrls: [selectedChain.rpcUrl],
                }
              : { chainId: `${chainId}` },
          ],
        });
        await window.ethereum.request({ method: "eth_chainId" });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setProviderAndSigner(provider, signer);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  function setProviderAndSigner(provider, signer) {
    setProvider(provider);
    setSigner(signer);
  }

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

    // const api = await axios.create({
    //   baseURL: "https://trustified-api-o5zg.onrender.com/trustified/api",
    // });

    const api = await axios.create({
      baseURL: "https://us-central1-trustified-fvm.cloudfunctions.net/api",
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
    if (location?.pathname.indexOf("claim") > -1) {
      window.localStorage.removeItem("address");
      setUpdate(!update);
    } else {
      navigate("/");
      window.localStorage.removeItem("address");
      setUpdate(!update);
      window.location.reload();
    }
    // navigate("/");
    // window.localStorage.removeItem("address");
    // setUpdate(!update);
    // window.location.reload();
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

  const createBadges = function (data, firebasedata, checked, type) {
    return new Promise(async (resolve, reject) => {
      try {
        const trustifiedContract = new ethers.Contract(
          trustifiedContracts[firebasedata.chain].trustified,
          trustifiedContractAbi.abi,
          signer
        );

        var transactionMint = await trustifiedContract.bulkMintERC721(
          data.tokenUris[0],
          parseInt(firebasedata.quantity),
          0,
          checked
        ); // Bulk Mint NFT collection.

        await trustifiedContract.once(
          "TokensMinted",
          async (eventId, tokenIds, issuer) => {
            let txm = await transactionMint.wait();
            firebasedata.contract = trustifiedContract.address;
            firebasedata.userId = userId;
            firebasedata.eventId = parseInt(Number(eventId));
            firebasedata.type = type;
            firebasedata.image = data.tokenUris[0];
            firebasedata.templateId = "";
            firebasedata.Nontransferable = checked == true ? "on" : "off";
            firebasedata.txHash = txm.transactionHash;
            firebasedata.createdBy = txm.from;
            firebasedata.platforms = [];
            await addCollection(firebasedata);

            let nftTokenIds = tokenIds.map((token) => parseInt(Number(token)));
            let object = {
              tokenContract: trustifiedContract.address,
              claimerAddress: "",
              ipfsurl: `https://nftstorage.link/ipfs/${data.tokenUris[0]}/metadata.json`,
              chain: firebasedata.chain,
              name: "",
              type: type,
              claimed: "No",
              eventId: parseInt(Number(eventId)),
              templateId: "",
              Nontransferable: checked == true ? "on" : "off",
              templateId: "",
              title: firebasedata.title,
              description: firebasedata.description,
              expireDate: firebasedata.expireDate,
              issueDate: firebasedata.issueDate,
              position: "",
              uploadObj: "",
              txHash: txm.transactionHash,
              createdBy: txm.from,
              platforms: [],
            };

            const firebaseObj = {
              tokenIds: nftTokenIds,
              eventId: parseInt(Number(eventId)),
              object: object,
              type: type,
            };

            const createApi = await axios.create({
              baseURL:
                "https://us-central1-trustified-fvm.cloudfunctions.net/api",
            });
            let createApiResponse = await createApi
              .post("/create/collector", firebaseObj)
              .then((res) => {
                return res;
              })
              .catch((error) => {
                console.log(error);
              });
            let obj = {
              type: type,
              data: createApiResponse.data,
            };
            const api = await axios.create({
              baseURL:
                "https://us-central1-trustified-fvm.cloudfunctions.net/api",
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
            toast.success("Badges successfully issued!");
            resolve({ isResolved: true });
          }
        );
      } catch (err) {
        return reject(err);
      }
    });
  };

  const createNftFunction = function (
    csvdata,
    formData,
    type,
    templateId,
    position,
    previewUrl,
    uploadObj
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const trustifiedContract = new ethers.Contract(
          trustifiedContracts[formData.chain].trustified,
          trustifiedContractAbi.abi,
          signer
        );

        let transactionMint = await trustifiedContract.bulkMintERC721(
          "",
          parseInt(csvdata.length),
          1,
          formData.Nontransferable === "on" ? true : false
        );

        await trustifiedContract.once(
          "TokensMinted",
          async (eventId, tokenIds, issuer) => {
            let txm = await transactionMint.wait();
            var eventId = eventId;
            formData.contract = trustifiedContract.address;
            formData.userId = userId;
            formData.eventId = parseInt(Number(eventId));
            formData.type = type;
            formData.image = previewUrl ? previewUrl : template.preview;
            formData.templateId = templateId;
            formData.txHash = txm.transactionHash;
            formData.createdBy = issuer;
            formData.platforms = [];
            await addCollection(formData);

            let nftTokenIds = tokenIds.map((token) => parseInt(Number(token)));

            let object = {
              tokenContract: trustifiedContract.address,
              claimerAddress: "",
              ipfsurl: previewUrl ? previewUrl : "",
              chain: formData.chain,
              type: type,
              claimed: "No",
              eventId: parseInt(Number(eventId)),
              templateId: previewUrl ? "" : formData.templateId,
              Nontransferable: formData.Nontransferable,
              templateId: "",
              title: formData.title,
              description: formData.description,
              expireDate: formData.expireDate,
              issueDate: formData.issueDate,
              position: previewUrl ? position : "",
              uploadObj: previewUrl ? uploadObj.name : "",
              txHash: txm.transactionHash,
              createdBy: txm.from,
              platforms: [],
            };

            const firebaseObj = {
              tokenIds: nftTokenIds,
              type: type,
              eventId: parseInt(Number(eventId)),
              csvdata: csvdata,
              object: object,
            };

            const createApi = await axios.create({
              baseURL:
                "https://us-central1-trustified-fvm.cloudfunctions.net/api",
            });
            let createApiResponse = await createApi
              .post("/create/collector", firebaseObj)
              .then((res) => {
                return res;
              })
              .catch((error) => {
                console.log(error);
              });

            let obj = {
              type: type,
              data: createApiResponse.data,
            };

            const api = await axios.create({
              baseURL:
                "https://us-central1-trustified-fvm.cloudfunctions.net/api",
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
            toast.success("Certificate Successfully issued!");
            resolve({ isResolved: true });
          }
        );
      } catch (err) {
        // console.log(err);
        // toast.error("Something want wrong!!", err);
        return reject(err);
      }
    });
  };

  const claimCertificate = async (
    claimToken,
    claimerAddress,
    claimer,
    textcolor,
    textFamily
  ) => {
    setClaimLoading(true);
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
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
      return { imageData };
    });

    const imageFile = new File(
      [pdfBlob.imageData],
      `${claimer?.claimer.replace(/ +/g, "")}.png`,
      {
        type: "image/png",
      }
    );

    const metadata = await client.store({
      name: claimer?.title,
      description: claimer?.description,
      image: imageFile,
      claimer: claimer?.claimer,
      eventId: claimer?.eventId,
      expireDate: claimer?.expireDate,
      issueDate: claimer?.issueDate,
    });

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
            trustifiedContractAbi.abi,
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
              txHash: txt.transactionHash,
            });

            toast.success("Certificate Successfully claimed!");
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
              txHash: txt.transactionHash,
            });

            toast.success("Certificate Successfully claimed!");
            setClaimLoading(false);
          }
        }
      } catch (error) {
        toast.error(
          "Something went wrong! or This certificate is already claimed!"
        );
        setClaimLoading(false);
        console.log(error);
      }
    });
  };

  const claimUploadedCertificate = async (
    claimToken,
    claimerAddress,
    claimer,
    textcolor,
    width,
    height
  ) => {
    setClaimLoading(true);
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const input = document.getElementById("certificateX");
    const pdfWidth = width;
    const pdfHeight = height;
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
      const imageData = await fetch(imgData).then((r) => r.blob());
      return { imageData };
    });

    const imageFile = new File(
      [pdfBlob.imageData],
      `${claimer?.claimer.replace(/ +/g, "")}.png`,
      {
        type: "image/png",
      }
    );

    const metadata = await client.store({
      name: claimer?.title,
      description: claimer?.description,
      image: imageFile,
      claimer: claimer?.claimer,
      eventId: claimer?.eventId,
      expireDate: claimer?.expireDate,
      issueDate: claimer?.issueDate,
    });
    // let meta = await axios.get(
    //   `https://nftstorage.link/ipfs/${metadata.ipnft}/metadata.json`
    // );

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
            trustifiedContractAbi.abi,
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
              txHash: txt.transactionHash,
            });
            toast.success("Certificate Successfully claimed!");
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
              txHash: txt.transactionHash,
            });

            toast.success("Certificate Successfully claimed!");

            setClaimLoading(false);
          }
        }
      } catch (error) {
        setClaimLoading(false);
        if (error.message === "Internal JSON-RPC error.") {
          toast.error("You don't have enough balance to claim certificate!");
        } else if (error.code === "ACTION_REJECTED") {
          toast.error(
            "MetaMask Tx Signature: User denied transaction signature!"
          );
        } else {
          toast.error("Something went wrong!");
        }
      }
    });
  };

  const claimBadges = async (claimToken, claimerAddress) => {
    setClaimLoading(true);
    const q = query(
      collection(db, "Collectors"),
      where("claimToken", "==", claimToken)
    );
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (fire) => {
      try {
        if (fire.data().claimerAddress == "") {
          const trustifiedContract = new ethers.Contract(
            fire.data().tokenContract,
            trustifiedContractAbi.abi,
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
              txHash: txt.transactionHash,
            });
            toast.success("Badge Successfully claimed!");
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
              txHash: txt.transactionHash,
            });
            toast.success("Badge Successfully claimed!");
            setClaimLoading(false);
          }
        }
      } catch (error) {
        setClaimLoading(false);
        if (error.message === "Internal JSON-RPC error.") {
          toast.error("You don't have enough balance to claim certificate!");
        } else if (error.code === "ACTION_REJECTED") {
          toast.error(
            "MetaMask Tx Signature: User denied transaction signature!"
          );
        } else {
          toast.error("Something went wrong!");
        }
      }
    });
  };

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        createNftFunction,
        createBadges,
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
        switchNetwork,
      }}
      {...props}
    >
      {props.children}
    </Web3Context.Provider>
  );
};
