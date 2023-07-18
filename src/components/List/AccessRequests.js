import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Stack,
  Box,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Card,
  TableBody,
  TablePagination,
} from "@mui/material";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import Iconify from "../../components/utils/Iconify";
import { Web3Context } from "../../context/Web3Context";
import { firebaseDataContext } from "../../context/FirebaseDataContext";

import { collection, db, query, where, getDocs } from "../../firebase";
import moment from "moment/moment";
import TableSortLabel from '@mui/material/TableSortLabel';

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

const Requests = () => {
  const [requests, setRequests] = React.useState([]);
  const navigate = useNavigate();
  const web3Context = React.useContext(Web3Context);
  const firebaseContext = React.useContext(firebaseDataContext);
  const {
    shortAddress,
    updateIssuerAccess,
    updateIssuer,
    data,
    checkAllowList,
  } = web3Context;
  const {
    updateStatus,
    updateStatusLoading,
    getIssuers,
    updateIssuerNFT,
    // updatedata,
  } = firebaseContext;
 
const [orderBy, setOrderBy] = useState(''); // The currently sorted column
const [order, setOrder] = useState('asc');


  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    {
      id: "Name",
      label: "Name",
    },
    {
      id: "Address",
      label: "Address",
    },
    {
      id: "type",
      label: "Type",
    },
    {
      id: "CreatedAt",
      label: "Request Date",
    },
    {
      id: "status",
      label: "Status",
    }
  ];


  useEffect(() => {
    const init = async () => {
      try {
        let allowed = await checkAllowList();
        if (allowed) {
          const profiles = query(collection(db, "UserProfile"));

          const profileSnapshot = await getDocs(profiles);

          const profileList = profileSnapshot.docs.map((doc) => {
            let obj = doc?.data();
            obj.id = doc?.id;
            return obj;
          });
          console.log(profileList, "profileList");
          setRequests(profileList);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, [updateStatusLoading]);

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
  
    setOrderBy(column);
    setOrder(newOrder);

   
  
    // Sort the data based on the column and order
    const sortedData = requests.sort((a, b) => { 

      if (column === 'CreatedAt') {
        const dateA =  moment(a[column].toDate()).format('LL');
        const dateB = moment(b[column].toDate()).format('LL');
        if (dateA < dateB) return isAsc ? -1 : 1;
        if (dateA > dateB) return isAsc ? 1 : -1;
        return 0;
      } 

      if (a[column] < b[column]) return isAsc ? -1 : 1;
      if (a[column] > b[column]) return isAsc ? 1 : -1;
      return 0;
    });
  
    setRequests([...sortedData]);
  };

  return (
    <>
      <Container pl={0} pr={0}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h4" gutterBottom>
            Access Requests
          </Typography>
          <button
            className="thm-btn header__cta-btn"
            onClick={async () => {
              let issuers = await getIssuers();
              await updateIssuerAccess(issuers);
              await updateIssuerNFT();
            }}
          >
            <span>{updateIssuer ? "Updating..." : "Update Access"}</span>
          </button>
        </Stack>
        <Stack>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => handleSort(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>

                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests && requests
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((request, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{request.Name}</TableCell>
                          <TableCell>
                            <p
                              style={{
                                border: "1px solid #eee",
                                padding: "3px 15px",
                                borderRadius: "20px",
                                fontWeight: "bolder",
                                width: "fit-content",
                              }}
                            >
                              {shortAddress(request.Address)}
                            </p>
                          </TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>{moment(request.CreatedAt.toDate()).format('LL')}</TableCell>
                          <TableCell>
                            {request.status === "approved" ? (
                              <Chip
                                label={request.status}
                                color="success"
                                variant="outlined"
                              />
                            ) : request.status == "rejected" ? (
                              <Chip
                                style={{
                                  color: "red",
                                  border: "1px solid red",
                                }}
                                label="Rejected"
                                variant="outlined"
                              />
                            ) : (
                              <>
                                <Chip
                                  style={{
                                    color: "dodgerblue",
                                    border: "1px solid dodgerblue",
                                  }}
                                  label={"Approve"}
                                  variant="outlined"
                                  onClick={() =>
                                    updateStatus(request, "approved")
                                  }
                                />
                                &nbsp;
                                <Chip
                                  style={{
                                    color: "red",
                                    border: "1px solid red",
                                  }}
                                  label={"Reject"}
                                  variant="outlined"
                                  onClick={() =>
                                    updateStatus(request, "rejected")
                                  }
                                />
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 50]}
              component="div"
              count={requests.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
};

export default Requests;
