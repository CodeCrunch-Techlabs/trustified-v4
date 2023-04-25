// import React, { useEffect, useState } from "react";
// import { CircularProgress, TableCell } from "@mui/material";
// import axios from "axios";


// const TableRowComponent = ({ id, value,url, event, type }) => {
//   const [pdf, setPdf] = useState("");
//   const [image, setImage]= useState(""); 

//   useEffect(() => {
//     if (id == "ipfsurl") {
//       getUserSMetadata(value);
//       getUserSMetadataImg(value);
//     } 
//   }, [event, value]);

//   const getUserSMetadata = async (url) => {
//     let d = await axios.get(url); 
//     const rep = d.data.pdf.replace(
//       "ipfs://",
//       "https://nftstorage.link/ipfs/"
//     ); 
//     setPdf(rep);
//   };

//   const getUserSMetadataImg = async (url) => {
//     let d = await axios.get(url); 
//     const rep = d.data.image.replace(
//       "ipfs://",
//       "https://nftstorage.link/ipfs/"
//     );

//     setImage(rep);
//   };
//   return (
//     <TableCell key={id}>
//       {id == "ipfsurl" ? (
//         <a target="_blank" href={type == "badge" ? image : pdf}>
//           Preview
//         </a>
//       ) : (
//         value
//       )}
//     </TableCell>
//   );
// };

// export default TableRowComponent;
import React, { useEffect, useState } from "react";
import { CircularProgress, TableCell } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const TableRowComponent = ({ id, value, url, event, type, token, status }) => {
  const navigate = useNavigate();
  const [pdf, setPdf] = useState("");
  const [image, setImage] = useState("");
  useEffect(() => {
    if (id === "ipfsurl" && status === "Yes") {
      // getUserSMetadata(url);
      getUserSMetadataImg(url);
    }
  }, [event, url]);
  // const getUserSMetadata = async (url) => {
  //   console.log(url,"url");
  //   let d = await axios.get(url);
  //   const rep = d.data.pdf.replace(
  //     "ipfs://",
  //     "https://nftstorage.link/ipfs/"
  //   );
  //   setPdf(rep);
  // };
  const getUserSMetadataImg = async (url) => {
    let d = await axios.get(url);
    const rep = d.data.image.replace(
      "ipfs://",
      "https://nftstorage.link/ipfs/"
    );
    setImage(rep);
  };
  const handleNavigate = (token) => {
    navigate(`/claim/${token}`);
  }
  return (
    <TableCell key={id}>
      {status === 'Yes' && id === "ipfsurl" ?  (
        <a target="_blank" href={image}>
          Preview
        </a>
      ) : (
        id !== "ipfsurl" && value
      )
      }
      {
        status === 'No' && id === "ipfsurl"  && <p style={{ cursor: 'pointer', color: 'dodgerblue' }} onClick={() => handleNavigate(token)}>
          Preview
        </p>
      }
    </TableCell >
  );
};
export default TableRowComponent;
