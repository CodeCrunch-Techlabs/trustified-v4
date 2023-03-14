import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { EditText, EditTextarea } from "react-edit-text";
import { db } from "../../firebase";

const TemplateEdit = ({ id }) => {
  const [data, setdata] = useState();
  const [uploadLogo, setLogo] = useState("");
  const [uploadSign, setSignature] = useState("");

  const getTemplates = async () => {
    const docRef = doc(db, "Templates", id);
    const querySnapshot = await getDoc(docRef);

    setdata(querySnapshot.data());
  };

  useEffect(() => {
    getTemplates();
  }, [id]);

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setLogo(URL.createObjectURL(image));
  };
  const handleSignature = (e) => {
    const image = e.target.files[0];
    setSignature(URL.createObjectURL(image));
  };

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
          <div contentEditable={true} style={data.title.style}>
            {data.title.text}
          </div>
          <div contentEditable={true} style={data.subTitle.style}>
            {data.subTitle.text}
          </div>
          <div contentEditable={true} style={data.certName.style}>
            {data.certName.text}
          </div>
          <div id="certName" contentEditable={true} style={data.name.style}>
            {data.name.text}
          </div>
          <div contentEditable={true} style={data.description.style}>
            {data.description.text}
          </div>
          <div id="validity" contentEditable={true} style={data.date.style}>
            {data.date.text}
          </div>
          <input
            id="upload-button"
            style={{ display: "none" }}
            onChange={(e) => handleImageChange(e)}
            hidden
            accept="image/*"
            multiple
            type="file"
          />
          <label htmlFor="upload-button" style={data.logo.style}>
            <img
              src={uploadLogo ? uploadLogo : data.logo.img}
              style={{ cursor: "pointer" }}
              width="80"
            />
          </label>

          <input
            id="upload-sign"
            style={{ display: "none" }}
            onChange={(e) => handleSignature(e)}
            hidden
            accept="image/*"
            multiple
            type="file"
          />
          <label htmlFor="upload-sign" style={data.sign.style}>
            <img
              src={uploadSign ? uploadSign : data.sign.img}
              style={{ cursor: "pointer" }}
              width="100"
            />
          </label>
        </div>
      )}
    </>
  );
};

export default TemplateEdit;
