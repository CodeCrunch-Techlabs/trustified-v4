import React, { useEffect, useState } from "react";
import { TextField, Divider, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { Web3Context } from "../../context/Web3Context";
import { firebaseDataContext } from "../../context/FirebaseDataContext";
import MyCollection from "../myCollection";
import { ethers } from "ethers";
import TemplatePreview from "./Preview";
import UploadPreview from "./UploadPreview";
import Chip from "@mui/material/Chip";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function Claim() {
  const web3Context = React.useContext(Web3Context);
  const {
    claimCertificate,
    claimLoading,
    connectWallet,
    address,
    claimUploadedCertificate,
    claimBadges,
  } = web3Context;

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getMyCollection, getClaimer, claimer } = firebaseContext;

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [show, setShow] = useState(false);
  const [url, setUrl] = useState("");

  const { token } = useParams();

  const [add, setAddress] = useState("");

  useEffect(() => {
    getClaimer(token);
    getUrl();
  }, [token]);

  async function switchNetwork(chainId) {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `${chainId}` }], // chainId must be in HEX with 0x in front
    });
    document.location.reload();
  }

  const getUrl = () => {
    // console.log(claimer,"claimer");
    // const url = claimer.chain === 'filecoin' && "https://filfox.info/en/message" ||
    //   claimer.chain === 'mumbai' && "https://polygonscan.com/tx" ||
    //   claimer.chain === 'goerli' && "https://goerli.etherscan.io/tx" ||
    //   claimer.chain === "fevm"  && "https://bscscan.com/tx" ||
    //   claimer.chain === 'bsc' && "https://bscscan.com/tx";

    //   console.log(url,"url");
    // setUrl(url);
  }

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
                  {claimer?.type == "badge" ? (
                    <img className="claimBadge" src={claimer?.ipfsurl} />
                  ) : (
                    <>
                      {claimer?.position != "" &&
                        claimer?.position != undefined ? (
                        <UploadPreview claimer={claimer} />
                      ) : (
                        <TemplatePreview
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
                    <div className="card-body-cert d-flex" style={{ justifyContent: 'space-evenly' }}>
                      <div>
                        <h4>TokenId</h4>
                        <p>#{claimer?.tokenId}</p>
                      </div>
                      <div>
                        <h4>Chain</h4>
                        <p style={{textTransform:'capitalize'}}>{claimer?.chain}</p>
                      </div>
                      <div>
                        <h4>Type</h4>
                        <p>
                          {claimer?.nfttype == "on"
                            ? "Non-Transferrable"
                            : "Transferrable"}
                        </p>
                      </div>
                    </div>
                    <a href={`${url}/${claimer.txHash}`} target="_blank"  >View Transaction <OpenInNewIcon /></a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 col-xl-8 col-lg-8 col-md-8 col-sm-10  mx-auto text-center">
            <div className="d-flex justify-content-start">
              <TextField
                name="Address"
                label="Wallet Address"
                fullWidth
                className="address mr-2"
                onChange={(e) => setAddress(e.target.value)}
                sx={{ background: "white" }}
              />
              <a
                className="thm-btn header__cta-btn"
                onClick={async () => {
                  const { chainId } = await provider.getNetwork();
                  if (claimer.chain == "filecoin" && chainId !== 314) {
                    await switchNetwork(ethers.utils.hexValue(314));
                  } else if (
                    claimer.chain == "fevm" &&
                    chainId !== 3141
                  ) {
                    await switchNetwork(ethers.utils.hexValue(3141));
                  } else if (
                    claimer.chain == "mumbai" &&
                    chainId !== 137
                  ) {
                    await switchNetwork(ethers.utils.hexValue(137));
                  } else if (
                    claimer.chain == "goerli" &&
                    chainId !== 5
                  ) {
                    await switchNetwork(ethers.utils.hexValue(5));
                  } else if (claimer.chain == "bsc" && chainId !== 97) {
                    await switchNetwork(ethers.utils.hexValue(97));
                  }

                  if (claimer?.type == "badge") {
                    await claimBadges(token, add);
                  } else {
                    if (
                      claimer?.position != "" &&
                      claimer?.position != undefined
                    ) {
                      console.log("call upload");
                      await claimUploadedCertificate(
                        token,
                        add,
                        claimer,
                        claimer?.uploadObj.style.color
                      );
                    } else {
                      console.log("call cert");
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
                <span>{claimLoading ?
                  <>
                    <CircularProgress />
                    <div id="cover-spin"></div>
                    <p id="cover-spin-text">Please don't refresh! {claimer?.type} is being minted! 😎 </p>
                  </>
                  : " Claim"}</span>
              </a>
            </div>

            <div className="mt-4">
              <a
                className="thm-btn header__cta-btn"
                onClick={() => {
                  getMyCollection(add);
                  setShow(true);
                }}
              >
                <span>Browse Collection</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {show && <MyCollection show={show}></MyCollection>}
    </section>
  );
}