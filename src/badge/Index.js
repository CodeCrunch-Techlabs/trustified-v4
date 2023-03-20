import React from "react";
import Box from "@mui/material/Box";
import Badges from "./Badges";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';

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
            <div className="d-flex justify-content-between  mb-2">
              <div className='cert-coll'>
                <span>Trustified</span>
                 <p >Badges</p>
              </div>

              {/* <h2 className="block-title__title">
                <span>Badges</span>
              </h2>  */}
              <div>
                <a className="thm-btn header__cta-btn" onClick={handleNavigate}>
                  <span><AddIcon />Create Badge</span>
                </a>
              </div>

            </div>
          </Box>
        </div>
        <Badges />
      </div>
    </div>
  );
};

export default Index;
