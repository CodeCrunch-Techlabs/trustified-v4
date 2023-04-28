 
import React, { useState } from "react";
import placeholderImage from "../../assets/jk-placeholder-image-768x518.jpg";
import { db } from "../../firebase";
import { LazyLoadImage } from "react-lazy-load-image-component";

const UploadPreview = ({ claimer, id }) => {
  const [loaded, setLoaded] = useState(false); 
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
        <LazyLoadImage
          alt="Image Alt"
          height={claimer.uploadObj.height}
          src={claimer.ipfsurl}
          placeholderSrc={placeholderImage}
          width={claimer.uploadObj.width}
          onLoad={() => setLoaded(!loaded)}
          effect="blur"
        />

        {loaded === true && claimer.status !== "Yes" && (
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
        
      </div>
    </>
  );
};

export default UploadPreview;
