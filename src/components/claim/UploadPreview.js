import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";


const UploadPreview = ({ claimer ,id}) => {    
  return (
    <>
      <div id="certificateX" style={{ position: "relative" }}>
        <LazyLoadImage
          src={claimer.ipfsurl}
          width={claimer.uploadObj.width}
          height={claimer.uploadObj.height}
          PlaceholderSrc="/images/placeholder.jpg"
          alt="Image Alt"
        />
        {/* <img width="800" height="600" src={claimer.ipfsurl} /> */}
        <div style={claimer.uploadObj.style} >
          {claimer?.claimer}
        </div>
        <div  style={{
            position:'absolute', 
            right:0,
            padding:'0 5px',
            bottom:0,
            color: claimer.uploadObj.style.color,
            fontSize:'18px'
            }}>
            {id}
          </div>
      </div>
    </>
  );
};

export default UploadPreview;
