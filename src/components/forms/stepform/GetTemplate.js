import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import WebFont from 'webfontloader';
import { NFTStorageContext } from "../../../context/NFTStorageContext";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";
import Draggable from "react-draggable";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";
import TemplateEdit from "../../template/TemplateEdit";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SketchPicker } from 'react-color';
import Popover from '@mui/material/Popover';

function GetTemplate() {
  const value = useContext(NFTStorageContext);
  const [data, setdata] = useState();
  const [username, setUsername] = useState({
    x: 143.8812255859375,
    y: -570.6504516601562
  });
  const [selectedFont, setSelectedFont] = useState("Roboto");
  const [fontSize, setFontSize] = useState(24);
  const [colors, setColor] = useState("#36219e");
  const [docId, setDocId] = useState("");
  const [bold, setBold] = useState(500);
  const [selectedElement, setSelectedElement] = useState(null);
  const [show, setShow] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useMemo(() => {
    WebFont.load({
      google: {
        families: ['Roboto',
          'Borsok', 'Open Sans',
          'Lato ', 'Poppins', 'Zeyada',
          'Babylonica', 'Dancing Script',
          'Lobster', 'Pacifico', 'Caveat',
          'Satisfy', 'Great Vibes', 'Ole', 'Coiny', 'Kenia', 'Rubik Beastly', 'Londrina Sketch', 'Neonderthaw',
          'Kumar One', 'Ribeye', 'Emblema One', 'Ewert', 'Kavoon', 'Moul', 'Rubik Moonrocks', 'Rubik Iso',
          'Unifraktur Cook', 'Germania One', 'Monoton', 'Orbitron', 'Rampart One'
        ],
      },
      active: () => setSelectedFont('Roboto'),
    });
  }, []);

  const textName = {
    name: {
      text: 'Your Name',
      style: {
        position: 'absolute',
        color: username?.color?.hex ? username?.color?.hex : '#860a1e',
        fontSize: `${username?.size}px` ? `${username?.size}px` : '40px',
        textAlign: 'center',
        margin: '10px auto',
        fontFamily: username?.font ? username?.font : 'Poppins',
        fontWeight: username?.bold ? username?.bold : 800,
        transform: `translate(${username.x}px, ${username.y}px)`
      }
    }
  }; 
  useEffect(() => {
    if (selectedElement === "certText") {
      setUsername({ ...username, font: selectedFont, color: colors, size: fontSize, bold: bold });
      value.setUploadObj(textName);
    }
  }, [selectedFont, colors, fontSize, bold])


  const handleDivClick = (event) => {
    event.stopPropagation();
    setSelectedElement(event.currentTarget.id);
  };
 
  const handleFontChange = useCallback(event => {
    setSelectedFont(event.target.value);
  }, []);

  const handleSizeChange = useCallback(e => {
    setFontSize(e.target.value)
  }, []);

  const handleBoldChange = useCallback(e => {
    setBold(e.target.value)
  }, []);

  const handleChangeColor = (color) => {
    setColor(color)
  }
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

  const handleSelectTemp = (id) => {
    setDocId(id);
    value.selectTemplate(id);
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

  const fsize = [12, 14, 16, 18, 20, 24, 26, 30, 32, 36, 40, 42, 48, 50, 54, 60];
  const fbold = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  const fontList = ['Roboto',
    'Borsok', 'Open Sans',
    'Lato ', 'Poppins', 'Zeyada',
    'Babylonica', 'Dancing Script',
    'Lobster', 'Pacifico', 'Caveat',
    'Satisfy', 'Great Vibes', 'Ole', 'Coiny', 'Kenia', 'Rubik Beastly', 'Londrina Sketch', 'Neonderthaw',
    'Kumar One', 'Ribeye', 'Emblema One', 'Ewert', 'Kavoon', 'Moul', 'Rubik Moonrocks', 'Rubik Iso',
    'Unifraktur Cook', 'Germania One', 'Monoton', 'Orbitron', 'Rampart One'
  ];



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

            {
              value.previewUrl !== "" && <Stack sx={{ my: 2 }} direction="row">
                <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Font</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedFont}
                      label="Select Font"
                      onChange={handleFontChange}
                    >
                      {
                        fontList.map((e) => {
                          return <MenuItem style={{ fontFamily: e }} value={e}>{e}</MenuItem>
                        })
                      }
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Font Size</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={fontSize}
                      label="Select Font"
                      onChange={handleSizeChange}
                    >

                      {
                        fsize.map((e) => {
                          return <MenuItem value={e}>{e}</MenuItem>
                        })
                      }
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                  <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">Font weight</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={bold}
                      label="Font weight"
                      onChange={handleBoldChange}
                    >

                      {
                        fbold.map((e) => {
                          return <MenuItem value={e}>{e}</MenuItem>
                        })
                      }
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
                  <div style={{
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                  }} onClick={handleClick}>
                    <div style={{
                      width: '50px',
                      height: '20px',
                      borderRadius: '2px',
                      backgroundColor: colors,
                    }}></div>
                  </div>
                </Box>

                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <SketchPicker color={colors} onChange={handleChangeColor} />
                </Popover>
              </Stack>
            }


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
              <div id="certificateX" style={{ width: '800px', height: '600px' }}>
                <img width="800" height="600" src={value.previewUrl} />
                <Draggable
                  position={username}
                  onStop={(e, data) =>
                     setUsername({ ...username, x: data.x, y: data.y })
                  }
                  onMouseDown={(e) => {
                    handleDivClick(e);
                  }}
                >
                  <div
                    id="certText"
                    style={textName.name.style}
                  >
                    {textName.name.text}
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
