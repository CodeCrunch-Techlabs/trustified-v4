import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider, 
  Stack, 
} from "@mui/material"; 
 
import { NFTStorageContext } from "../../../context/NFTStorageContext"; 
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick"; 
import Draggable from "react-draggable"; 
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";
import TemplateEdit from "../../template/TemplateEdit";

function GetTemplate() {
  const value = useContext(NFTStorageContext); 
  const [data, setdata] = useState();
  const [username, setUsername] = useState("Your Name");
  const [docId, setDocId] = useState("");

  const handleImageChange = (e) => {
    
    const image = e.target.files[0];
    value.setPreviewUrl(URL.createObjectURL(image));
    value.uploadCertificate(image);
  };

  const onClose = () => {
    value.setPreviewUrl("");
  };

  const getTemplates = async () => {
    const array = [];
    const q = query(collection(db, "Templates"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const dataWithId = { id: doc.id, ...doc.data() };
      array.push(dataWithId);
    });
    setdata(array);
  };

  useEffect(() => {
    getTemplates();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }; 

  const handleSelectTemp = (id) => {
    setDocId(id);
    value.selectTemplate(id);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <Stack spacing={3} sx={{ margin: "20px" }}>
            {value.template === "" && (
              <Box sx={{ m: 1 }}>
                <Button
                  sx={{ m: 1, color: "#fff" }}
                  variant="contained"
                  component="label"
                >
                  Upload Your Certificate
                  <input
                    onChange={(e) => handleImageChange(e)}
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                  />
                </Button>
              </Box>
            )}

            {value.previewUrl !== "" && (
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                }}
              >
                <CloseIcon />
              </IconButton>
            )}

            {value.previewUrl && (
              <div id="certificateX" style={{width:'800px', height:'600px'}}>
                <img width="800" height="600" src={value.previewUrl} />
                <Draggable
                  position={value.usernamePos}
                  onStop={(e, data) =>
                    value.setUsernamePos({ x: data.x, y: data.y })
                  }
                >
                  <div
                    id="certText"
                    style={{ position: "absolute", color: "red" }}
                  >
                    {username}
                  </div>
                </Draggable>
              </div>
            )}

            {value.previewUrl === "" && value.template === "" && (
              <Divider>
                <Chip label="OR" />
              </Divider>
            )}

            <Slider {...settings}>
              {data &&
                data.map((e, i) => {
                  return (
                    <div
                      key={i}
                      className=""
                      onClick={() => handleSelectTemp(e.id)}
                    >
                      <img src={e.preview} width="200" height="200" />
                    </div>
                  );
                })}
            </Slider>
          </Stack>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {docId && <TemplateEdit id={docId} />}

          {/* {value.template && value.template == "divTotemp1" && (
            <Temp1 />
          )}
          {value.template && value.template == "divTotemp2" && (
            <Temp2 />
          )}
            {value.template && value.template == "divTotemp3" && (
            <Temp3 />
          )}
          {value.template && value.template == "divTotemp4" && (
            <Temp4 />
          )} */}
        </div>
      </div>
    </div>
  );
}

export default GetTemplate;
