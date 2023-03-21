import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Badges from "./Badges";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const Index = () => {
  const navigate = useNavigate();

  const handleNavigate = async () => {
    const add = window.localStorage.getItem("address");
    const q = query(collection(db, "UserProfile"), where("Address", "==", add));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await toast.info("Please create profile first!");
      navigate("/dashboard/profile");
    } else {
      navigate("/dashboard/badge");
    }
  };

  return (
    <div className="container">
      <div className="row gy-5">
        <div className="col-12">
          <Box sx={{ width: "100%" }}>
            <div className="d-flex justify-content-between  mb-2">
              <div className="cert-coll">
                <span>Trustified</span>
                <p>Badges</p>
              </div>

              {/* <h2 className="block-title__title">
                <span>Badges</span>
              </h2>  */}
              <div>
                <a className="thm-btn header__cta-btn" onClick={handleNavigate}>
                  <span>
                    <AddIcon />
                    Create Badge
                  </span>
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
