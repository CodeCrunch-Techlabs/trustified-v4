import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./badge.css";
import { Paper, Chip, CircularProgress } from "@mui/material";
import { firebaseDataContext } from "../context/FirebaseDataContext";
import Iconify from "../components/utils/Iconify"; 

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

  return (
    <>
      {badges.map((item, index) => {
        return (
          <div key={index} className='col-lg-4 col-sm-6 col-12 col-xl-4 col-md-4'>
            <div className='badge-root'>
              <img onClick={() => navigateTo(item.eventId)} style={{ cursor: 'pointer' }} src={item?.ipfsUrl ? item?.ipfsUrl : '/images/placeholder.jpg'} width="100%" />
              <div className='badge-body'>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
              </div>
              <div className='badge-card-body d-flex justify-content-between'>
                <div>
                  <h4>EventId</h4>
                  <p>#1</p>
                </div>
                <div>
                  <h4>Chain</h4>
                  <p>FEVM</p>
                </div>
                <div>
                  <h4>TokenId</h4>
                  <p>#5</p>
                </div>
              </div>
              <div className='badge-footer'>
                {loadingStates[index] ? (
                  <CircularProgress />
                ) : (
                  <Tooltip title="Download CSV" arrow>
                    < Button
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
                      endIcon={<Iconify
                        icon="eva:download-outline"
                        width={30}
                        height={30}
                        style={{ cursor: 'pointer' }}
                      />}
                    >
                      Download
                    </ Button>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Badges;
