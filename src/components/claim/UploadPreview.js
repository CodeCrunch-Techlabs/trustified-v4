import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";


const UploadPreview = ({ claimer ,id}) => {   

  return (
    <>
      <div id="certificateX" style={{position:'relative'}}>
      <LazyLoadImage src={claimer.ipfsurl}
        width={800} height={600}
        PlaceholderSrc="/images/placeholder.jpg"
        alt="Image Alt"
      />
        {/* <img width="800" height="600" src={claimer.ipfsurl} /> */}
        <div style={claimer.uploadObj.style}>
          {claimer?.claimer}
        </div>
        <div  style={{
            position:'absolute',
            transform: `translate(${555.327}px, ${-35.1444}px`,
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
