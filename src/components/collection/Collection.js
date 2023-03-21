import React from "react";
import { Box } from "@mui/material";

import Certificates from "./Certificates";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, InputBase, Paper } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

function Collections() {
  const navigate = useNavigate();

  const handleClickNavigate = async () => {
    const add = window.localStorage.getItem("address");
    const q = query(collection(db, "UserProfile"), where("Address", "==", add));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      toast.info("Please create profile first!");
      navigate("/dashboard/profile");
    } else {
      navigate("/dashboard/certificate");
    }
  };
  return (
    <div className="container">
      <div className="row gy-5">
        <div className="col-12">
          <Box sx={{ width: "100%" }}>
            <div className="d-flex justify-content-between">
              {/* <div className='search '>
                    <SearchIcon color='disabled' className='m-2' />
                    <InputBase
                        fullWidth
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Certificate Collections"
                        inputProps={{ 'aria-label': 'search Certificate' }}
                    />
                </div> */}
              <div className="cert-coll">
                <span>Trustified</span>
                <p>Certificates</p>
              </div>

              <div>
                <a
                  className="thm-btn header__cta-btn"
                  onClick={handleClickNavigate}
                >
                  <span>
                    <AddIcon /> Create Certificates{" "}
                  </span>
                </a>
              </div>
            </div>
          </Box>
        </div>
        <Certificates />
      </div>
    </div>
  );
}

export default Collections;
