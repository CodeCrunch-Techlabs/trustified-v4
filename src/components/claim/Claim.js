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

  const { token } = useParams();

  const [add, setAddress] = useState("");

  useEffect(() => {
    getClaimer(token);
  }, [token]);

  async function switchNetwork(chainId) {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `${chainId}` }], // chainId must be in HEX with 0x in front
    });
    document.location.reload();
  }


  return (
    <section className="banner-one footer-position" id="banner">
      <div className="bannercontainer container">
        <div className="row">
          <div className="col-xl-12 col-lg-8">
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
                  style={{ width: "50%", margin: "auto" }}
                >
                  <div className="card-root claim-card">
                    <div className="justify-content-center d-flex">
                      <h4 className="card-h4 claim-h4">{claimer?.title}</h4>
                    </div>
                    <p className="card-p claim-des">{claimer?.description}</p>
                    <div className="card-body-cert d-flex justify-content-between">
                      <div>
                        <h4>TokenId</h4>
                        <p>#{claimer?.tokenId}</p>
                      </div>
                      <div>
                        <h4>Chain</h4>
                        <p>{claimer?.chain}</p>
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
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-6 mx-auto text-center">
                  <div className="row">
                    <div className="col-10 mx-auto text-center">
                      <TextField
                        name="Address"
                        label="Wallet Address"
                        fullWidth
                        className="m-3 address"
                        onChange={(e) => setAddress(e.target.value)}
                        sx={{ background: "white" }}
                      />
                    </div>

                    <div className="col-2 mx-auto text-center">
                      <a
                        className="thm-btn header__cta-btn claimBtn"
                        onClick={async () => {
                          const { chainId } = await provider.getNetwork();
                          if (claimer.chain == "fevm" && chainId !== 3141) {
                            await switchNetwork(ethers.utils.hexValue(3141));
                          } else if (
                            claimer.chain == "mumbai" &&
                            chainId !== 80001
                          ) {
                            await switchNetwork(ethers.utils.hexValue(80001));
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
                              await claimUploadedCertificate(
                                token,
                                add,
                                claimer,
                                claimer?.uploadObj.style.color
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
                        <span>{claimLoading ? "Claiming..." : " Claim"}</span>
                      </a>
                    </div>
                  </div>

                  <div className="mt-2">
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
          </div>
        </div>
      </div>
      <Divider sx={{ m: 3 }} />
      {show && <MyCollection show={show}></MyCollection>}
    </section>
  );
}
