import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { db } from "../../firebase";

const UploadPreview = ({ claimer, id }) => {
  const [loaded, setLoaded] = useState(false); 

  // async function updateFvmdata() {
  //   const q = query(collection(db, "Collectors"), where("eventId", "==", 2));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((fire) => {
  //     console.log(fire.data(), "data");
  //     const dataref = doc(db, "Collectors", fire.id);
  //     const data = {
  //     claimToken: fire.data().claimToken,
  //     tokenContract: fire.data().tokenContract,
  //     tokenId: fire.data().tokenId,
  //     claimerAddress: fire.data().claimerAddress,
  //     ipfsurl: fire.data().ipfsurl,
  //     chain: fire.data().chain,
  //     name: fire.data().name,
  //     claimed: fire.data().claimed,
  //     type: fire.data().type,
  //     Nontransferable: fire.data().Nontransferable,
  //     eventId: fire.data().eventId,
  //     templateId: fire.data().templateId,
  //     title: fire.data().title,
  //     description: fire.data().description,
  //     expireDate: fire.data().expireDate,
  //     issueDate: fire.data().issueDate,
  //     position: fire.data().position,
  //     uploadObj: {
  //       "height": 600,
  //       "text": "Your Name",
  //       "width": 600,
  //       "style": {
  //         "fontWeight": 600,
  //         "transform": "translate(0px, -149.5px)",
  //         "position": "absolute",
  //         "margin": "10px auto",
  //         "color": "#ffffff",
  //         "fontSize": "32px",
  //         "width": "600px",
  //         "textAlign": "center",
  //         "fontFamily": "Poppins"
  //       }
  //     },
  //     txHash: fire.data().txHash,
  //     createdBy: fire.data().createdBy,
  //     platforms: fire.data().platforms, 
  //     }
  //     updateDoc(dataref, data);
  //     console.log("done");
  //   })
  // }

  return (
    <>
      <div
        id="certificateX"
        style={{
          position: "relative",
          width: claimer.uploadObj.width,
          height: claimer.uploadObj.height,
        }}
      >
        <img
          src={claimer.ipfsurl}
          width={claimer.uploadObj.width}
          height={claimer.uploadObj.height}
          alt="Image Alt"
          onLoad={() => setLoaded(!loaded)}
        />

        {loaded == true && (
          <>
            <div style={claimer.uploadObj.style}>{claimer?.claimer}</div>
            <div
              style={{
                position: "absolute",
                right: 0,
                padding: "0 5px",
                bottom: 0,
                color: claimer.uploadObj.style.color,
                fontSize: "12px",
              }}
            >
              Id: {id}
            </div>
          </>
        )}
        {/* <button onClick={updateFvmdata}>Update</button> */}
        {/* <img width="800" height="600" src={claimer.ipfsurl} /> */}
      </div>
    </>
  );
};

export default UploadPreview;
