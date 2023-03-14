import React from "react";

const TemplatePreview = ({ data, name }) => {
  
  return (
    <>
      {data && (
        <div
          id="create-temp"
          style={{
            position: "relative",
            width: data.width,
            height: data.height,
          }}
        >
          <img src={data.bgImage} width={data.width} height={data.height} />
          <div style={data.title.style}>
            {data.title.text}
          </div>
          <div style={data.subTitle.style}>
            {data.subTitle.text}
          </div>
          <div style={data.certName.style}>
            {data.certName.text}
          </div>
          <div id="certName" style={data.name.style}>
            {name}
          </div>
          <div style={data.description.style}>
            {data.description.text}
          </div>
          <div id="validity" style={data.date.style}>
            {data.date.text}
          </div>

          <label htmlFor="upload-button" style={data.logo.style}>
            <img src={data.logo.img} style={{ cursor: "pointer" }} width="80" />
          </label>

          <label htmlFor="upload-sign" style={data.sign.style}>
            <img
              src={data.sign.img}
              style={{ cursor: "pointer" }}
              width="100"
            />
          </label>
        </div>
      )}
    </>
  );
};

export default TemplatePreview;
