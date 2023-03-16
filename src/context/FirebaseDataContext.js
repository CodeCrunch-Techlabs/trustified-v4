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

  function createDataCollector(
    claimToken,
    tokenContract,
    tokenId,
    claimerAddress,
    ipfsurl,
    name,
    claimed,
    type,
    transferable,
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
      transferable,
      eventId 
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
    chain
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
    };
  }

  useEffect(() => {
    getIssuers();
    getNFTCollections();
  }, []);

  async function addCollection(data) {
    setLoading(true);
    await addDoc(collection(db, "Collections"), {
      userId: data.userId,
      name: data.title,
      description: data.description,
      collectionContract: data.contract,
      chain: data.chain,
      issueDate: new Date(),
      eventId: data.eventId,
      type: data.type,
      transferable: data.transferable,
      image: data.image,
      templateId: data.templateId,
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
      transferable: data.transferable,
      eventId: data.eventId,
      templateId: data.templateId,
      title: data.title,
      description: data.description,
      expireDate: data.expireDate,
      position: data.position,
      uploadObj: data.uploadCertData,
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
    });
  }

  async function updateCollectorsForBadges(data) {
    const collectorRef = doc(db, "Collectors", data.id);
    await updateDoc(collectorRef, {
      claimerAddress: data.claimerAddress,
      claimed: data.claimed,
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
            e.data().transferable,
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

        console.log(fire.data(),"fire");

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

        if (fire.data().type == "badge") {
          let meta = await axios.get(fire.data().ipfsurl);
          obj.ipfsurl = meta.data.image.replace(
            "ipfs://",
            "https://nftstorage.link/ipfs/"
          );
        } else if (fire.data().ipfsurl == "") {
          obj.ipfsurl = "";
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
    const arryb = [];
    const arryc = [];
    const add = window.localStorage.getItem("address");
    const q = query(collection(db, "UserProfile"), where("Address", "==", add));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (fire) => {
      const qr = query(
        collection(db, "Collections"),
        where("userId", "==", fire.id)
      );
      const snap = await getDocs(qr);

      snap.forEach(async (e) => {
        // let meta = await axios.get(
        //   `https://nftstorage.link/ipfs/${e.data().image}/metadata.json`
        // );
        var date = new Date(e.data().issueDate.seconds * 1000);
        var dd = String(date.getDate()).padStart(2, "0");
        var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = date.getFullYear();

        date = mm + "/" + dd + "/" + yyyy;
        if (e.data().type == "badge") {
          let meta = await axios.get(
            `https://nftstorage.link/ipfs/${e.data().image}/metadata.json`
          );

          arryb.push(
            createDataCollection(
              e.data().collectionContract,
              e.data().name,
              e.data().description,
              date,
              e.data().expireDate,
              e.data().type,
              e.data().eventId,
              meta.data.image.replace(
                "ipfs://",
                "https://nftstorage.link/ipfs/"
              ),
              e.data().chain
            )
          );
        } else {
          arryc.push(
            createDataCollection(
              e.data().collectionContract,
              e.data().name,
              e.data().description,
              date,
              e.data().expireDate,
              e.data().type,
              e.data().eventId,
              e
                .data()
                .image.replace("ipfs://", "https://nftstorage.link/ipfs/"),
              e.data().chain
            )
          );
        }

        setBadgesData(arryb);
        setCertificates(arryc);
      });
    });
  }

  async function getMyCollection(address) {
   if(address){
  setCertLoad(true) ;
    var array = [];
    const q = query(
      collection(db, "Collectors"),
      where("claimerAddress", "==", address)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (fire) => {
      console.log(fire.data().ipfsurl, "ipfsurl");
      var obj;
      if (fire.exists) {
        obj = fire.data();
        const d = await axios.get(fire.data().ipfsurl);
        obj.ipfsurl = d.data.image.replace(
          "ipfs://",
          "https://nftstorage.link/ipfs/"
        );
        obj.pdf = d.data.pdf.replace(
          "ipfs://",
          "https://nftstorage.link/ipfs/"
        );

        array.push(obj);
      }
      let arr = [];
      for (let i = 0; i < array.length; i++) {
        arr[i] = array[i];
      }
      setMyCollection(arr);
    });
   setCertLoad(false) 
   } else {
    toast.error("Please provide address!");
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
        setCertLoad,
      }}
      {...props}
    >
      {props.children}
    </firebaseDataContext.Provider>
  );
};
