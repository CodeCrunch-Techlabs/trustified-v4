import React, { useState } from "react";
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
                fontSize: "18px",
              }}
            >
              {id}
            </div>
          </>
        )}

        {/* <img width="800" height="600" src={claimer.ipfsurl} /> */}
      </div>
    </>
  );
};

export default UploadPreview;
