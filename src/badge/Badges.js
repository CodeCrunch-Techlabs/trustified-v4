import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./badge.css";
import { Paper, Chip, CircularProgress } from "@mui/material";
import { firebaseDataContext } from "../context/FirebaseDataContext";
import Iconify from "../components/utils/Iconify";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "@mui/material";
import Divider from '@mui/material/Divider';

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
    <div className="container">
      <div className="row">
        {badges.map((item, index) => { 
          return (
            <div key={index} className='col-lg-4 col-sm-6 col-12 col-xl-4 col-md-4'>
              <div className='badge-root'>
              <div className="fact-one__single">
                <div className="fact-one__inner">
                <img onClick={() => navigateTo(item.eventId)} style={{ cursor: 'pointer' }} src={item?.ipfsUrl ? item?.ipfsUrl : '/images/placeholder.jpg'} width="100%" />
              </div>
              </div>
                <div className='badge-body mb-0'>
                  <h4>{item.name}</h4>
                  <p className="m-0">{item.description}</p>
                </div> 
                <Chip label={item.issueDate} color="primary" variant="outlined" /> 
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
      </div>
    </div>
  );
};

export default Badges;
