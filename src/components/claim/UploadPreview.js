import React, { useEffect } from "react";

const UploadPreview = ({ claimer }) => {  
  console.log(claimer,"claimer"); 
  return (
    <>
      <div id="certificateX" style={{position:'relative'}}>
        <img width="800" height="600" src={claimer.ipfsurl} />
        <div style={claimer.uploadObj.style}>
          {claimer?.claimer}
        </div>
      </div>
    </>
  );
};

export default UploadPreview;
