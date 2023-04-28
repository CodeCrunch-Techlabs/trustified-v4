import React, { useEffect, useState } from "react";
import { TextField,CircularProgress } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { Web3Context } from "../../context/Web3Context";
import { firebaseDataContext } from "../../context/FirebaseDataContext";
import MyCollection from "../myCollection";
import { ethers } from "ethers";
import TemplatePreview from "./Preview";
import UploadPreview from "./UploadPreview"; 
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { toast } from "react-toastify";
import Iconify from "../../components/utils/Iconify";

export default function Claim() {
  const web3Context = React.useContext(Web3Context);
  const {
    claimCertificate,
    claimLoading, 
    claimUploadedCertificate,
    claimBadges,
    switchNetwork,
  } = web3Context;

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getMyCollection, getClaimer, claimer } = firebaseContext;
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [id, setId] = useState("");
  const [show, setShow] = useState(false);
  const { token } = useParams();
  const [add, setAddress] = useState("");

  useEffect(() => {
    getClaimer(token);
    getUrl();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // async function switchNetwork(chainId) {
  //   await window.ethereum.request({
  //     method: "wallet_switchEthereumChain",
  //     params: [{ chainId: `${chainId}` }], // chainId must be in HEX with 0x in front
  //   });
  //   document.location.reload();
  // }

  const getUrl = (chain) => {
    const url =
      (chain === "fvm" && "https://filfox.info/en/tx") ||
      (chain === "mumbai" && "https://polygonscan.com/tx") ||
      (chain === "fvmtestnet" && "https://hyperspace.filfox.info/en/tx") ||
      (chain === "celotestnet" &&
        "https://alfajores-blockscout.celo-testnet.org/tx") ||
      (chain === "arbitrumtestnet" &&
        "https://goerli-rollup-explorer.arbitrum.io/tx") ||
      (chain === "ethereumtestnet" && "https://sepolia.etherscan.io/tx");
    return url;
  };

  async function getCertId() {
    let network = getNetworkToken(claimer?.chain);
    var certId = `${network}#${claimer?.eventId}#${claimer?.tokenId}`;
    setId(certId);
  }
  useEffect(() => {
    getCertId();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimer]);

  const getNetworkToken = (network) => {
    var net;
    if (network === "fvmtestnet") {
      net = "fvmtestnet";
    } else if (network === "fvm") {
      net = "fvm";
    } else if (network === "mumbai") {
      net = "mumbai";
    } else if (network === "goerli") {
      net = "goerli";
    } else {
      net = "bsc";
    }
    return net;
  };
  return (
    <section className="footer-position" id="banner">
      <div className="bannercontainer container">
        <div className="row">
          <div className="col-xl-8 col-lg-8 col-12 col-md-8 col-sm-10 mx-auto">
            <div className="banner-one__claimcontent">
              {claimer ? (
                <div
                  className="py-4"
                  style={{ justifyContent: "center", display: "flex" }}
                >
                  {claimer?.type === "badge" ? (
                    <img className="claimBadge" src={claimer?.ipfsurl} alt="" />
                  ) : (
                    <>
                      {claimer?.position !=="" &&
                      claimer?.position !== undefined ? (
                        <UploadPreview claimer={claimer} id={id} />
                      ) : (
                        <TemplatePreview
                          id={id}
                          data={claimer?.template}
                          name={claimer?.claimer}
                          issueDate={claimer?.issueDate}
                        />
                      )}
                    </>
                  )}
                </div>
              ) : (
                <CircularProgress />
              )}

              {claimer && (
                <div
                  className="justify-content-center"
                  style={{ margin: "auto" }}
                >
                  <div className="card-root claim-card">
                    <div className="justify-content-center d-flex">
                      <h4 className="card-h4 claim-h4">{claimer?.title}</h4>
                    </div>
                    <p className="card-p claim-des">{claimer?.description}</p>
                    <div>
                      {claimer?.platforms.map((link) => (
                        <div>
                          <Link to={link} target="_blank">
                            {link}
                          </Link>
                        </div>
                      ))}
                    </div>
                    <div
                      className="card-body-cert d-flex"
                      style={{ justifyContent: "space-evenly" }}
                    >
                      <div>
                        <h4>Certificate Id</h4>
                        <p>{id}</p>
                      </div>
                      <div>
                        <h4>TokenId</h4>
                        <p>#{claimer?.tokenId}</p>
                      </div>
                      <div>
                        <h4>Chain</h4>
                        <p style={{ textTransform: "capitalize" }}>
                          {claimer?.chain}
                        </p>
                      </div>
                      <div>
                        <h4>Type</h4>
                        <p>
                          {claimer?.nfttype === "on"
                            ? "Non-Transferrable"
                            : "Transferrable"}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`${getUrl(claimer?.chain)}/${claimer.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Transaction <OpenInNewIcon />
                    </a>
                    {claimer.status === "Yes" && (
                      <div className="mt-4">
                        <button className="thm-btn header__cta-btn">
                          <span>
                            Claimed
                            <Iconify
                              icon={"material-symbols:done"}
                              width={30}
                              height={30}
                              sx={{ color: "green" }}
                            />
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 col-xl-8 col-lg-8 col-md-8 col-sm-10  mx-auto text-center">
            {claimer?.status === "Yes" ? (
              ""
            ) : (
              <div className="d-flex justify-content-start">
                <TextField
                  name="Address"
                  label="Wallet Address"
                  fullWidth
                  className="address mr-2"
                  onChange={(e) => setAddress(e.target.value)}
                  sx={{ background: "white" }}
                />
                <button
                  className="thm-btn header__cta-btn"
                  onClick={async () => {
                    if (claimer.status === "Yes") {
                      toast.error("This certificate is already claimed!");
                      return;
                    }
                    if (add === "") {
                      toast.error("Please Enter Address!");
                      return;
                    }
                    const { chainId } = await provider.getNetwork();
                    if (claimer.chain === "fvm" && chainId !== 314) {
                      await switchNetwork(ethers.utils.hexValue(314));
                    } else if (
                      claimer.chain === "fvmtestnet" &&
                      chainId !== 3141
                    ) {
                      await switchNetwork(ethers.utils.hexValue(3141));
                    } else if (
                      claimer.chain === "mumbai" &&
                      chainId !== 80001
                    ) {
                      await switchNetwork(ethers.utils.hexValue(80001));
                    } else if (
                      claimer.chain == "celotestnet" &&
                      chainId !== 44787
                    ) {
                      await switchNetwork(ethers.utils.hexValue(44787));
                    } else if (
                      claimer.chain == "arbitrumtestnet" &&
                      chainId !== 421613
                    ) {
                      await switchNetwork(ethers.utils.hexValue(421613));
                    } else if (
                      claimer.chain == "ethereumtestnet" &&
                      chainId !== 11155111
                    ) {
                      await switchNetwork(ethers.utils.hexValue(11155111));
                    }

                    if (claimer?.type === "badge") {
                      await claimBadges(token, add);
                    } else {
                      if (
                        claimer?.position !== "" &&
                        claimer?.position !== undefined
                      ) {
                        await claimUploadedCertificate(
                          token,
                          add,
                          claimer,
                          claimer?.uploadObj.style.color,
                          claimer?.uploadObj.width,
                          claimer?.uploadObj.height
                        );
                      } else {
                        await claimCertificate(
                          token,
                          add,
                          claimer,
                          claimer?.template.name.style.color,
                          claimer?.template.name.style.fontFamily
                        );
                      }
                    }
                  }}
                >
                  <span> Claim</span>
                </button>
              </div>
            )}

            {claimLoading && (
              <>
                <div id="cover-spin"></div>
                <p id="cover-spin-text">
                  {claimer?.type} is being claimed! Please do not refresh!😎
                </p>
              </>
            )}
            <div className="mt-4">
              <button
                className="thm-btn header__cta-btn"
                onClick={() => {
                  getMyCollection(add);
                  setShow(true);
                }}
              >
                <span>Browse Collection</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {show && <MyCollection show={show}></MyCollection>}
    </section>
  );
}
