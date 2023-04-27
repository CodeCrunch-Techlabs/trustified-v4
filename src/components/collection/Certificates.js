/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { firebaseDataContext } from "../../context/FirebaseDataContext";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Iconify from "../utils/Iconify";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { logos } from "../../config";

export default function Certificates() {
  const navigate = useNavigate();

  const fireDataContext = React.useContext(firebaseDataContext);
  const { getNFTCollections, certificatesData, generateClaimersExcellSheet } =
    fireDataContext;

  const [certificates, setCertificates] = React.useState([]);
  const [loadingStates, setLoadingStates] = React.useState(
    Array(certificates.length).fill(false)
  );

  React.useEffect(() => {
    getNFTCollections();
  }, []);

  React.useEffect(() => {
    setCertificates(certificatesData);
  }, [certificatesData]);

  const navigateTo = (id) => {
    navigate(`/dashboard/collectors/${id}`);
  };

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
        {certificates.length !== 0 ? (
          certificates.map((item, index) => {
            return (
              <div
                className="col-lg-4 col-sm-6 col-12 col-xl-4 col-md-4"
                key={index}
              >
                <div className="card-root" style={{ position: 'relative' }}>
                  <img
                    style={{ cursor: "pointer" }}
                    onClick={() => navigateTo(item.eventId)}
                    src={
                      item?.ipfsUrl ? item?.ipfsUrl : "/images/placeholder.jpg"
                    }
                    width="100%"
                    alt=""
                  />

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
                      marginTop: '-5px'
                    }} src={`${logos[item.chain]}`} alt="" />
                  </div>

                  <div className="card-body-cert">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="">{item.name}</h4>
                      </div>
                      {loadingStates[index] ? (
                        <CircularProgress />
                      ) : (
                        <div>
                          <Tooltip
                            title="Download CSV"
                            arrow
                            style={{ alignItems: "baseline" }}
                          >
                            <IconButton
                              onClick={async (e) => {
                                const newLoadingStates = [...loadingStates];
                                newLoadingStates[index] = true;
                                setLoadingStates(newLoadingStates);
                                e.stopPropagation();
                                await generateClaimersExcellSheet(
                                  item.eventId,
                                  item.name,
                                  "certificate"
                                );
                                newLoadingStates[index] = false;
                                setLoadingStates(newLoadingStates);
                              }}
                              color="primary"
                              component="label"
                            >
                              <Iconify
                                icon="eva:download-outline"
                                width={20}
                                height={20}
                                style={{ cursor: "pointer" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="card-p">{item.description}</p>
                  <div className="card-body-cert d-flex justify-content-between">
                    <div>
                      <h4>Issue </h4>
                      <p>{item.issueDate}</p>
                    </div>
                    <div>
                      <h4>EventId</h4>
                      <p>#{item.eventId}</p>
                    </div>
                    <div>
                      <h4>Chain</h4>
                      <p>{item.chain}</p>
                    </div>
                  </div>

                  <div className="card-body-cert d-flex justify-content-center">
                    <a
                      href={`${getUrl(item?.chain)}/${item.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '16px' }}
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
              No certificates has been issued by you till now. Click on "Create"
              to issue certificates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
