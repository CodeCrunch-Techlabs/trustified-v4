import React, { useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component"; 
const UploadPreview = ({ claimer }) => {
  return (
    <>
      <div id="certificateX" style={{ position: "relative" }}>
        <LazyLoadImage
          src={claimer.ipfsurl}
          width={800}
          height={600}
          PlaceholderSrc="/images/placeholder.jpg"
          alt="Image Alt"
        />
        {/* <img width="800" height="600" src={claimer.ipfsurl} /> */}
        <div style={claimer.uploadObj.style}>{claimer?.claimer}</div>
      </div>
    </>
  );
};

export default UploadPreview;
