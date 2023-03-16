import * as React from "react";
import Paper from "@mui/material/Paper";
import { firebaseDataContext } from "../../context/FirebaseDataContext";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Iconify from "../utils/Iconify";
import Tooltip from "@mui/material/Tooltip";

export default function Certificates() {
  const navigate = useNavigate();

  const fireDataContext = React.useContext(firebaseDataContext);
  const {
    getNFTCollections,
    certificatesData,
    generateClaimersExcellSheet,
    exportLoading,
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
            key={index}
            className="col-lg-3 col-md-4 col-sm-6 col-12"
            onClick={() => navigateTo(item.eventId)}
          >
            <Paper className="certificatesCard">
              <img
                className="certificate"
                src={item?.ipfsUrl}
                alt={item.name}
              />

              <span className="certificateDescription"> {item.name}</span>
              <span className="optionspan">
                <Chip
                  label={item.issueDate}
                  color="primary"
                  variant="outlined"
                />
                {loadingStates[index] ? (
                  <CircularProgress />
                ) : (
                  <Tooltip title="Download">
                    <Iconify
                      icon="mdi:download-circle-outline"
                      width={30}
                      height={30}
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
                    />
                  </Tooltip>
                )}
              </span>
            </Paper>
          </div>
        );
      })}
    </>
  );
}
