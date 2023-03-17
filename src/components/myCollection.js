import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { firebaseDataContext } from "../context/FirebaseDataContext";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import web3 from "web3";
import { Link, useLocation } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function MyCollection({ show }) {
  const firebaseContext = React.useContext(firebaseDataContext);
  const { myCollection, certLoad, getMyCollection } = firebaseContext;

  const location = useLocation();

  const [value, setValue] = React.useState(0);

  useEffect(() => {
    let add = localStorage.getItem("address");
    console.log(web3.utils.toChecksumAddress(add));

    getMyCollection(web3.utils.toChecksumAddress(add));
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [badgesData, setbadgesData] = useState([]);
  const [certificatesData, setcertificatesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let badges = [];
    let certificates = [];
    if (myCollection.length > 0) {
      for (let i = 0; i < myCollection.length; i++) {
        if (myCollection[i].type == "badge") {
          badges.push(myCollection[i]);
        } else {
          certificates.push(myCollection[i]);
        }
      }
    }

    setbadgesData(badges);
    setcertificatesData(certificates);
  }, [myCollection]);

  return (
    <div
      className={
        location.pathname == "/my-collection"
          ? "bannercontainer container footer-position"
          : "container  footer-position"
      }
    >
      <div className="row">
        <div className="col">
          {myCollection.length > 0 && (
            <>
              <Typography
                variant="h5"
                component="h6"
                sx={{
                  fontWeight: 600,
                  margin: "10px",
                }}
              >
                Your Collection
              </Typography>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="My Badges" {...a11yProps(0)} />
                  <Tab label="My Certificates" {...a11yProps(1)} />
                </Tabs>
              </Box>
            </>
          )}

          <TabPanel value={value} index={0}>
            <div className="row">
              {badgesData.length != 0 &&
                badgesData.map((e, i) => { 
                  return (
                    <div
                      key={i}
                      className="col-12 col-lg-4 col-sm-6 col-md-4"
                    >
                      <div
                        className="mt-2 template-card mb-2"
                        style={{ display: "grid" }}
                      >

                        <Link to={e.ipfsurl} target="_blank" style={{width:'50%'}}>
                          <img
                            height="auto"
                            width="100%"
                            className="claimBadge"
                            src={e.ipfsurl}
                            alt={e.title}
                          />
                        </Link> 

                        <Typography
                          variant="body"
                          component="a"
                          href={e.pdf}
                          target="_blank"
                          sx={{
                            textTransform: "uppercase",
                            fontWeight: 600,
                            margin: '10px',
                            color: "#84a8fb",
                            textDecoration: "none",
                          }}
                        >
                          {e.title}
                        </Typography>
                      </div>
                    </div>
                  );
                })}
              {certLoad && <CircularProgress />}
              {badgesData.length === 0 && show == true && !certLoad && (
                <div className="col">
                  <h4>No Collection!</h4>
                </div>
              )}
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="row">
              {certificatesData.length != 0 &&
                certificatesData.map((e, i) => {
                  return (
                    <div key={i} className="col-12 col-lg-4 col-sm-6 col-md-4">
                      <div
                        className="mt-2 template-card mb-2"
                        style={{ display: "grid" }}
                      >
                        <Typography
                          variant="body"
                          component="a"
                          href={e.pdf}
                          target="_blank"
                          sx={{
                            textTransform: "uppercase",
                            fontWeight: 600,
                            color: "#84a8fb",
                            textDecoration: "none",
                          }}
                        >
                          {e.title}
                        </Typography>
                        <Typography
                          variant="body"
                          component="p"
                          sx={{
                            color: "#74727a",
                            marginBottom: '20px',
                            textDecoration: "none",
                          }}
                        >
                          {e.description}
                        </Typography>


                        <Link to={e.ipfsurl} target="_blank">
                          <img
                            height="auto"
                            width="100%"
                            className="claimCertificate"
                            src={e.ipfsurl}
                            alt={e.title}
                          />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              {loading && <CircularProgress />}
              {certificatesData.length === 0 && show == true && (
                <h4>No Collection!</h4>
              )}
            </div>
          </TabPanel>
        </div>
      </div>
    </div>
  );
}
