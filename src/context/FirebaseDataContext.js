import { getDoc } from "firebase/firestore";
import React, { useState, createContext, useEffect } from "react";

import {
  collection,
  addDoc,
  db,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "../firebase";
import Iconify from "../components/utils/Iconify";

import axios from "axios";
import { toast } from "react-toastify";
import Web3 from "web3";

export const firebaseDataContext = createContext(undefined);

export const FirebaseDataContextProvider = (props) => {
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [rowsIssuer, setRowsIssuer] = useState([]);
  const [rowsCollection, setRowsCollection] = useState([]);
  const [badgesData, setBadgesData] = useState([]);
  const [certificatesData, setCertificates] = useState([]);
  const [claim, setClaim] = useState([]);
  const [myCollection, setMyCollection] = useState([]);
  const [claimer, setClaimer] = useState();
  const [template, setTemplate] = useState();
  const [type, setType] = useState("");
  const [certLoad, setCertLoad] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  function createDataCollector(
    claimToken,
    tokenContract,
    tokenId,
    claimerAddress,
    ipfsurl,
    name,
    claimed,
    type,
    Nontransferable,
    eventId
  ) {
    return {
      claimToken,
      tokenContract,
      tokenId,
      claimerAddress,
      ipfsurl,
      name,
      claimed,
      type,
      Nontransferable,
      eventId,
    };
  }
  function createDataCollection(
    id,
    name,
    description,
    issueDate,
    expireDate,
    type,
    eventId,
    ipfsUrl,
    chain,
    txHash,
    createdBy
  ) {
    return {
      id,
      name,
      description,
      issueDate,
      expireDate,
      type,
      eventId,
      ipfsUrl,
      chain,
      txHash,
      createdBy,
    };
  }

  useEffect(() => {
    getIssuers();
    getNFTCollections();
  }, []);

  async function addCollection(data) {  
    const dd = {
      userId: data.userId,
      name: data.title,
      description: data.description,
      collectionContract: data.contract,
      chain: data.chain,
      issueDate: data.issueDate,
      eventId: data.eventId,
      type: data.type,
      Nontransferable: data.Nontransferable,
      image: data.image,
      templateId: data.templateId,
      txHash: data.txHash,
      createdBy: data.createdBy,
      platforms: data.platforms,
    } 
    setLoading(true);
    await addDoc(collection(db, "Collections"), {
      userId: data.userId,
      name: data.title,
      description: data.description,
      collectionContract: data.contract,
      chain: data.chain,
      issueDate: data.issueDate,
      eventId: data.eventId,
      type: data.type,
      Nontransferable: data.Nontransferable,
      image: data.image,
      templateId: data.templateId,
      txHash: data.txHash,
      createdBy: data.createdBy,
      platforms: data.platforms,
    });

    setLoading(false);
    setUpdated(!updated);
  }

  async function addCollectors(data) {
    setLoading(true);
    await addDoc(collection(db, "Collectors"), {
      claimToken: data.token,
      tokenContract: data.tokenContract,
      tokenId: data.tokenId,
      claimerAddress: data.claimerAddress,
      ipfsurl: data.ipfsurl,
      chain: data.chain,
      name: data.name,
      claimed: data.claimed,
      type: data.type,
      Nontransferable: data.Nontransferable,
      eventId: data.eventId,
      templateId: data.templateId,
      title: data.title,
      description: data.description,
      expireDate: data.expireDate,
      issueDate: data.issueDate,
      position: data.position,
      uploadObj: data.uploadCertData,
      txHash: data.txHash,
      createdBy: data.createdBy,
      platforms: data.platforms,
    });
    setLoading(false);
    setUpdated(!updated);
  }

  async function updateCollectors(data) {
    const collectorRef = doc(db, "Collectors", data.id);
    await updateDoc(collectorRef, {
      claimerAddress: data.claimerAddress,
      claimed: data.claimed,
      ipfsurl: data.ipfsurl,
      txHash: data.txHash,
    });
  }

  async function updateCollectorsForBadges(data) {
    const collectorRef = doc(db, "Collectors", data.id);
    await updateDoc(collectorRef, {
      claimerAddress: data.claimerAddress,
      claimed: data.claimed,
      txHash: data.txHash,
    });
  }

  async function getCollections(userId) {
    try {
      const collections = query(
        collection(db, "Collections"),
        where("userId", "==", userId)
      );

      const collectionSnapshot = await getDocs(collections);

      const collectionList = collectionSnapshot.docs.map((doc) => doc.data());
      setCollections(collectionList);
    } catch (error) {
      console.log(error);
    }
  }

  async function getClaimers(eventId) {
    const arry = [];
    try {
      setLoading(true);
      const collectors = query(
        collection(db, "Collectors"),
        where("eventId", "==", parseInt(eventId))
      );
      const collectorsSnapshot = await getDocs(collectors);
      collectorsSnapshot.forEach((e) => {
        setType(e.data().type);
        arry.push(
          createDataCollector(
            e.data().claimToken,
            e.data().tokenContract,
            e.data().tokenId,
            e.data().claimerAddress,
            e.data().ipfsurl,
            e.data().name,
            e.data().claimed,
            e.data().type,
            e.data().Nontransferable,
            e.data().eventId
          )
        );
      });
      setClaim(arry);
      setLoading(false);
      return arry;
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function generateClaimersExcellSheet(eventId, eventTitle, type) {
    setExportLoading(true);
    let claimers = await getClaimers(eventId);
    var arr = [];
    for (let i = 0; i < claimers.length; i++) {
      if (type == "badge") {
        arr.push({
          ClaimUrl: `https://trustified.xyz/claim/${claimers[i].claimToken}`,
        });
      } else {
        arr.push({
          Name: claimers[i].name,
          ClaimUrl: `https://trustified.xyz/claim/${claimers[i].claimToken}`,
        });
      }
    }
    let obj = {
      type: type,
      data: arr,
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

    setExportLoading(false);

    const blob = new Blob([response.data], { type: "text/csv" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${eventTitle}.csv`;
    downloadLink.click();
  }

  async function getClaimer(claimToken) {
    try {
      setLoading(true);
      const q = query(
        collection(db, "Collectors"),
        where("claimToken", "==", claimToken)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (fire) => {
        var obj = {};

        const template =
          fire.data().type == "badge"
            ? ""
            : fire.data().position != "" && fire.data().position != undefined
            ? ""
            : await getTemplate(fire.data().templateId);
        obj.template = template;
        obj.chain = fire.data().chain;
        obj.type = fire.data().type;
        obj.claimer = fire.data().name;
        obj.description = fire.data().description;
        obj.title = fire.data().title;
        obj.uploadObj = fire.data().uploadObj;
        obj.issueDate = fire.data().issueDate;
        obj.eventId = fire.data().eventId;
        obj.tokenId = fire.data().tokenId;
        obj.status = fire.data().claimed;
        obj.nfttype = fire.data().Nontransferable;
        obj.expireDate = fire.data().expireDate;
        obj.createdBy = fire.data().createdBy;
        obj.txHash = fire.data().txHash;
        obj.platforms = fire.data().platforms;

        if (fire.data().type == "badge") {
          let meta = await axios.get(fire.data().ipfsurl);

          obj.ipfsurl = meta.data.image.replace(
            "ipfs://",
            "https://nftstorage.link/ipfs/"
          );
          obj.price = meta.data.price;
        } else if (fire.data().ipfsurl == "") {
          obj.ipfsurl = "";
        } else if (fire.data().claimed == "Yes") {
          let meta = await axios.get(fire.data().ipfsurl);
          obj.ipfsurl = meta.data.image.replace(
            "ipfs://",
            "https://nftstorage.link/ipfs/"
          );
        } else {
          obj.ipfsurl = fire.data().ipfsurl;
        }

        obj.expireDate = fire.data().expireDate;
        obj.position = fire.data().position;
        setClaimer(obj);
      });
      setLoading(true);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function getIssuers(id) {
    // const arry = [];
    // const q = query(collection(db, "Collectors"),where("collectionContract", "==", id));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach(async (fire) => {
    //   arry.push(
    //     createDataIssuer(
    //       fire.data().Name,
    //       fire.data().UserName,
    //       fire.data().Address,
    //       fire.data().Bio
    //     )
    //   );
    //   setRowsIssuer(arry);
    // });
  }

  async function getNFTCollections() {
    const add = window.localStorage.getItem("address");
    const q = query(collection(db, "UserProfile"), where("Address", "==", add));
    const querySnapshot = await getDocs(q);

    const badgesData = [];
    const certificates = [];

    for (const fire of querySnapshot.docs) {
      const qr = query(
        collection(db, "Collections"),
        where("userId", "==", fire.id)
      );
      const snap = await getDocs(qr);

      for (const e of snap.docs) {
        const date = new Date(e.data().issueDate.seconds * 1000);
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        const formattedDate = `${mm}/${dd}/${yyyy}`;
        const imageUrl =
          e.data().type === "badge"
            ? `https://nftstorage.link/ipfs/${e.data().image}/metadata.json`
            : `${e.data().image}`;

        const meta =
          e.data().type === "badge" ? await axios.get(imageUrl) : null;
        const data = createDataCollection(
          e.data().collectionContract,
          e.data().name,
          e.data().description,
          formattedDate,
          e.data().expireDate,
          e.data().type,
          e.data().eventId,
          e.data().type === "badge"
            ? meta.data.image.replace(
                "ipfs://",
                "https://nftstorage.link/ipfs/"
              )
            : imageUrl,
          e.data().chain,
          e.data().txHash,
          e.data().createdBy
        );

        if (e.data().type === "badge") {
          badgesData.push(data);
        } else {
          certificates.push(data);
        }
      }
    }
    setBadgesData(badgesData);
    setCertificates(certificates);
  }

  async function getMyCollection(address) {
    let add =
      address == ""
        ? Web3.utils.toChecksumAddress(localStorage.getItem("address"))
        : address;

    if (add) {
      setCertLoad(true);
      var array = [];
      const q = query(
        collection(db, "Collectors"),
        where("claimerAddress", "==", add)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (fire) => {
        var obj;
        if (fire.exists) {
          obj = fire.data();
          const d = await axios.get(fire.data().ipfsurl);
          obj.ipfsurl = d.data.image.replace(
            "ipfs://",
            "https://nftstorage.link/ipfs/"
          );
          // obj.pdf = d.data.pdf.replace(
          //   "ipfs://",
          //   "https://nftstorage.link/ipfs/"
          // );

          array.push(obj);
        }
        let arr = [];
        for (let i = 0; i < array.length; i++) {
          arr[i] = array[i];
        }
        setMyCollection(arr);
      });
      setCertLoad(false);
    }
  }

  const getTemplate = async (id) => {
    const docRef = doc(db, "Templates", id);
    const querySnapshot = await getDoc(docRef);
    setTemplate(querySnapshot.data());
    return querySnapshot.data();
  };

  const getTemplates = async () => {
    const docRef = doc(db, "Templates");
    const querySnapshot = await getDoc(docRef);
    // setTemplates(querySnapshot.data());
    return querySnapshot.data();
  };

  return (
    <firebaseDataContext.Provider
      value={{
        addCollection,
        getCollections,
        addCollectors,
        updateCollectors,
        updateCollectorsForBadges,
        getTemplates,
        updated,
        loading,
        collections,
        rowsIssuer,
        rowsCollection,
        badgesData,
        certificatesData,
        claim,
        claimer,
        getClaimers,
        getClaimer,
        getMyCollection,
        getNFTCollections,
        generateClaimersExcellSheet,
        myCollection,
        getTemplate,
        template,
        type,
        certLoad,
        exportLoading,
        setCertLoad,
      }}
      {...props}
    >
      {props.children}
    </firebaseDataContext.Provider>
  );
};
