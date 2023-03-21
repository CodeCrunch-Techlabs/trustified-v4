import React, { useState } from "react";
import Draggable from "react-draggable";
import { Button } from "@mui/material";
import { SketchPicker } from "react-color";
import { TemplateConext } from "../../context/CreateTemplateContext";
import Upload from "./Editor/Upload";
import SelectFonts from "./Editor/Fonts";
import Popover from "@mui/material/Popover";
import { Box } from "@mui/material";

const DemoTemplate = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const templateConext = React.useContext(TemplateConext);
  const [show, setShow] = useState(false);
  const {
    colors,
    handleChangeColor,
    title,
    setTitle,
    certName,
    setCertName,
    name,
    setName,
    description,
    setDiscription,
    handleDivClick,
    logo,
    setLogo,
    date,
    setDate,
    sign,
    setSign,
    uploadBg,
    uploadLogo,
    uploadSign,
    nodeRef,
    template,
    uploadTemplate,
    imageRef,
    subTitle,
    setSubTitle,
    bgurl,
    logoUrl,
    signUrl,
  } = templateConext;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="container mt-5 mb-5">
      <p>Create Template</p>
      <Upload />
      <SelectFonts />
      <Box sx={{ maxWidth: 200, minWidth: 100, m: 1 }}>
        <div
          style={{
            padding: "5px",
            background: "#fff",
            borderRadius: "1px",
            boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
            display: "inline-block",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          <div
            style={{
              width: "50px",
              height: "20px",
              borderRadius: "2px",
              backgroundColor: colors,
            }}
          ></div>
        </div>
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <SketchPicker color={colors} onChange={handleChangeColor} />
      </Popover>

      <div className="row">
        <div className="col-12 mx-auto">
          <div
            ref={imageRef}
            style={{ position: "relative", height: "600px", width: "800px" }}
          >
            <img
              id="uploadBg"
              width="800"
              height="600"
              src={uploadBg ? uploadBg : "/templates/3.jpg"}
            />
            <Draggable
              position={title}
              onDrag={(e, data) => {
                setTitle({ ...title, x: data.x, y: data.y });
                nodeRef.current = true;
              }}
              onStop={() => {
                nodeRef.current = false;
              }}
              onMouseDown={(e) => {
                handleDivClick(e);
              }}
            >
              <div id="title" style={template.title.style}>
                {template.title.text}
              </div>
            </Draggable>

            <Draggable
              position={subTitle}
              onDrag={(e, data) => {
                setSubTitle({ ...subTitle, x: data.x, y: data.y });
                nodeRef.current = true;
              }}
              onStop={() => {
                nodeRef.current = false;
              }}
              onMouseDown={(e) => {
                handleDivClick(e);
              }}
            >
              <div id="sub-title" style={template.subTitle.style}>
                {template.subTitle.text}
              </div>
            </Draggable>
            <Draggable
              position={certName}
              onDrag={(e, data) => {
                setCertName({ ...certName, x: data.x, y: data.y });
                nodeRef.current = true;
              }}
              onStop={() => {
                nodeRef.current = false;
              }}
              onMouseDown={(e) => {
                handleDivClick(e);
              }}
            >
              <div id="cert-name" style={template.certName.style}>
                {template.certName.text}
              </div>
            </Draggable>
            <Draggable
              position={name}
              onDrag={(e, data) => {
                setName({ ...name, x: data.x, y: data.y });
                nodeRef.current = true;
              }}
              onStop={() => {
                nodeRef.current = false;
              }}
              onMouseDown={(e) => {
                handleDivClick(e);
              }}
            >
              <div id="name" style={template.name.style}>
                {template.name.text}
              </div>
            </Draggable>
            <Draggable
              position={description}
              onDrag={(e, data) => {
                setDiscription({ ...description, x: data.x, y: data.y });
                nodeRef.current = true;
              }}
              onStop={() => {
                nodeRef.current = false;
              }}
              onMouseDown={(e) => {
                handleDivClick(e);
              }}
            >
              <div id="description" style={template.description.style}>
                {template.description.text}
              </div>
            </Draggable>

            <Draggable
              position={date}
              onDrag={(e, data) => {
                setDate({ ...date, x: data.x, y: data.y });
                nodeRef.current = true;
              }}
              onStop={() => {
                nodeRef.current = false;
              }}
              onMouseDown={(e) => {
                handleDivClick(e);
              }}
            >
              <p id="validity" style={template.date.style}>
                {" "}
                {template.date.text}
              </p>
            </Draggable>
            <Draggable
              position={logo}
              onStop={(e, data) => setLogo({ x: data.x, y: data.y })}
            >
              <img
                id="uploadLogo"
                src={uploadLogo ? uploadLogo : "/images/cert2.png"}
                style={template.logo.style}
              />
            </Draggable>
            <Draggable
              position={sign}
              onStop={(e, data) => setSign({ x: data.x, y: data.y })}
            >
              <img
                id="uploadSign"
                src={uploadSign ? uploadSign : "/templates/signature.png"}
                style={template.sign.style}
              />
            </Draggable>
          </div>
        </div>
      </div>
      <Button className="thm-btn header__cta-btn m-2" onClick={uploadTemplate}>
        {" "}
        <span>Save Template</span>
      </Button>
    </div>
  );
};

export default DemoTemplate;
