import React from "react"; 
import Box from "@mui/material/Box"; 
import Badges from "./Badges";
import { useNavigate } from "react-router-dom";
 
 
const Index = () => {  
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/dashboard/badges");
  }

  return (
    <div className="container">
      <div className="row gy-5">
        <div className="col-12">
          <Box sx={{ width: "100%" }}>
            <div className="d-flex justify-content-between  mb-3">
              <h2 className="block-title__title">
                <span>Badges</span>
              </h2> 
              <a className="thm-btn header__cta-btn" onClick={handleNavigate}>
                <span>Create Badge</span>
              </a>

            </div>
          </Box>
        </div>
        <Badges />
      </div>
    </div>
  );
};

export default Index;
