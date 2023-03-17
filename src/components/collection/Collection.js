import React from "react";
import {  Box } from "@mui/material";
 
import Certificates from "./Certificates";
import { useNavigate } from "react-router-dom";

function Collections() { 
  const navigate = useNavigate();

  const handleClickNavigate=()=>{
    navigate("/dashboard/temp");
  }
  return (
    <div className="container">
      <div className="row gy-5">
        <div className="col-12">
          <Box sx={{ width: "100%" }}>
            <div className="d-flex justify-content-between  mb-3">
              <h2 className="block-title__title">
                <span>Collections</span>
              </h2>
              <a className="thm-btn header__cta-btn" onClick={handleClickNavigate} >
             <span>Create NFT</span>
           </a>
            </div>
          </Box>
        </div>
        <Certificates />
      </div>
    </div>
  );
}

export default Collections;
