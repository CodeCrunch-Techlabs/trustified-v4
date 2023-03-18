import * as React from "react";
import Paper from "@mui/material/Paper";
import { firebaseDataContext } from "../../context/FirebaseDataContext";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Iconify from "../utils/Iconify";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";

export default function Certificates() {
  const navigate = useNavigate();

  const fireDataContext = React.useContext(firebaseDataContext);
  const {
    getNFTCollections,
    certificatesData,
    generateClaimersExcellSheet,
  } = fireDataContext;

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

  return (
    <>
      {certificates.map((item, index) => { 
        return (
          <div
            className='col-lg-4 col-sm-6 col-12 col-xl-4 col-md-4'
            key={index} 
          >
            <div className='card-root'>
              <img style={{cursor:'pointer'}}  onClick={() => navigateTo(item.eventId)} src={item?.ipfsUrl ? item?.ipfsUrl : '/images/placeholder.jpg'} width="100%" />
              <div className='card-body-cert d-flex justify-content-between'>
                <div >
                  <h4 className="card-h4">{item.name}</h4> 
                </div>
                {loadingStates[index] ? (
                  <CircularProgress />
                ) : (
                <Tooltip title="Download CSV" arrow>
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
                    component="label"> 
                    <Iconify
                    icon="eva:download-outline"
                    width={30}
                    height={30}
                    style={{ cursor: 'pointer' }}
                    
                  />
                    
                  </IconButton> 
                </Tooltip>
               )}  
              </div>
              <p className="card-p">{item.description}</p>
              <div className='card-body-cert d-flex justify-content-between'>
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
            </div>
          </div>
        );
      })}
    </>
  );
}
