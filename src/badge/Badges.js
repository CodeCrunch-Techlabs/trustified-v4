import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./badge.css";
import { Paper, Chip, CircularProgress } from "@mui/material";
import { firebaseDataContext } from "../context/FirebaseDataContext";
import Iconify from "../components/utils/Iconify";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { logos } from "../config";

const Badges = () => {
  const navigate = useNavigate();
  const firebaseContext = React.useContext(firebaseDataContext);
  const { getNFTCollections, badgesData, generateClaimersExcellSheet } =
    firebaseContext;

  const [badges, setBadges] = React.useState([]);
  const [loadingStates, setLoadingStates] = React.useState(
    Array(badges.length).fill(false)
  );

  const navigateTo = (id) => {
    navigate(`/dashboard/collectors/${id}`);
  };

  useEffect(() => {
    getNFTCollections();
  }, []);

  useEffect(() => {
    setBadges(badgesData);
  }, [badgesData]);

  const getUrl = (chain) => {
    const url =
      (chain === "fvm" && "https://filfox.info/en/tx") ||
      (chain === "mumbai" && "https://polygonscan.com/tx") ||
      (chain === "goerli" && "https://goerli.etherscan.io/tx") ||
      (chain === "fvmtestnet" && "https://hyperspace.filfox.info/en/tx") ||
      (chain === "bsc" && "https://bscscan.com/tx");
    return url;
  };

  return (
    <div className="container">
      <div className="row">
        {badges.length !== 0 ? (
          badges.map((item, index) => {
            return (
              <div
                key={index}
                className="col-lg-4 col-sm-6 col-12 col-xl-4 col-md-4"
              >
                <div className="badge-root" style={{position:'relative'}}>
                  <div className="fact-one__single">
                    <div className="fact-one__inner">
                      <img
                        onClick={() => navigateTo(item.eventId)}
                        style={{ cursor: "pointer" }}
                        src={
                          item?.ipfsUrl
                            ? item?.ipfsUrl
                            : "/images/placeholder.jpg"
                        }
                        width="100%"
                        alt=""
                      />
                    </div>
                  </div>

                  <div style={{
                    position:'absolute',
                    bottom:'15px',
                    right:'15px',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    textAlign: 'center'
                  }}>
                    <img style={{
                      width: '22px',
                      height: '22px',
                      marginTop: '-5px',
                      marginBottom:'0'
                    }} src={`${logos[item.chain]}`} alt="" />
                  </div>
                  <div className="badge-body mb-0">
                    <h4>{item.name}</h4>
                    <p className="m-0">{item.description}</p>
                  </div>
                  <Chip
                    label={item.issueDate}
                    color="primary"
                    variant="outlined"
                  />
                  <div className="badge-footer mt-2">
                    {loadingStates[index] ? (
                      <CircularProgress />
                    ) : (
                      <Tooltip title="Download CSV" arrow>
                        <Button
                          onClick={async (e) => {
                            const newLoadingStates = [...loadingStates];
                            newLoadingStates[index] = true;
                            setLoadingStates(newLoadingStates);
                            e.stopPropagation();
                            await generateClaimersExcellSheet(
                              item.eventId,
                              item.name,
                              "badge"
                            );
                            newLoadingStates[index] = false;
                            setLoadingStates(newLoadingStates);
                          }}
                          endIcon={
                            <Iconify
                              icon="eva:download-outline"
                              width={30}
                              height={30}
                              style={{ cursor: "pointer" }}
                            />
                          }
                        >
                          Download
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                 <div className="d-flex justify-content-center">
                 <a
                    href={`${getUrl(item?.chain)}/${item.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{fontSize:'16px'}}
                  >
                    View Transaction <OpenInNewIcon fontSize="16" />
                  </a>
                 </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <p>
              No Badges has been issued by you till now. Click on "Create" to
              issue Badges. 
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Badges;
