import React, { useEffect } from "react";

const UploadPreview = ({ claimer }) => {
  useEffect(() => {
    const input = document.getElementById("certificateX");
    var inputText = document.getElementById("certText");
    inputText.style.position = "absolute";
    inputText.style.fontFamily = "Pinyon Script";
    inputText.style.fontSize = "24px";
    inputText.style.position = "absolute";
    inputText.style.transform =
      `translate(${claimer.position.x}px,${claimer.position.y}px)`;
  });

  return (
    <>
      <div id="certificateX" style={{position:'relative'}}>
        <img width="800" height="600" src={claimer.ipfsurl} />
        <div id="certText" style={{ position: "absolute" }}>
          {claimer?.claimer}
        </div>
      </div>
    </>
  );
};

export default UploadPreview;
