import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import { set } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";

function Row(props) {
  const { row, handleConfirmAlert } = props;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleViewClick = () => {
    navigate(`/NAPCustomerProfile/${row.userId}`);
  };

  const handleInactiveClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      console.log(row.storeID);
      console.log(row.token);
      const response = await fetch(
        `${import.meta.env.VITE_APP_URL_BASE}/MyStores/approve/${row.storeID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${row?.token}`,
          },
          body: JSON.stringify({
            user: row.userId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOpen(false);
        handleConfirmAlert(`${data.message}`);
      }
      if (!response.ok) {
        const data = await response.json();
        setOpen(false);
        handleConfirmAlert(`${data.message}`);
      }
    } catch (error) {
      console.error("Error activating user to acces store:", error);
    }
  };
  return (
    <Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
        <TableCell className="tableCell">
          <span className="trTableSpan">
            <span className="mr-1 trTableSpan">{row.userFirstName}</span>
            <span className="trTableSpan">{row.userLastName}</span>
          </span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.userPhone}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.userWilaya}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.userCommune}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.userAddress}</span>
        </TableCell>
        <TableCell className="tableCell">
          <div className="activeClass" onClick={handleInactiveClick}>
            <div className="cercleActive"></div>
            <span className="inactiveSpan trTableSpan">{row.status}</span>
          </div>
        </TableCell>
        <TableCell align="right" className="tableCell w-[100px]">
          <div className="flex justify-end pr-3">
            <EyeIcon
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={handleViewClick}
            />
          </div>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    userWilaya: PropTypes.string.isRequired,
    userPhone: PropTypes.string.isRequired,
    userFirstName: PropTypes.string.isRequired,
    userLastName: PropTypes.string.isRequired,
    userCommune: PropTypes.string.isRequired,
    userAddress: PropTypes.array.isRequired,
    status: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    storeID: PropTypes.string.isRequired,
  }).isRequired,
  handleConfirmAlert: PropTypes.func.isRequired,
};

export default function CustomerTable({ searchQuery, setFilteredData }) {
  const { user } = useAuthContext();
  const [NotApprovedUsersData, setNotApprovedUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const decodedToken = TokenDecoder();
  const fetchNotApprovedUsersData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_URL_BASE}/MyStores/notApprovedUsers/${
          decodedToken.id
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotApprovedUsersData(data);
      } else {
        setNotApprovedUsersData([]);
        setRows([]);
        console.error(
          "Error receiving not approved users data for this store:",
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        "Error fetching not approved users data for this store:",
        error
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotApprovedUsersData();
  }, [user?.token]);
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (NotApprovedUsersData.length > 0) {
      const rowsData = NotApprovedUsersData.map((data) => {
        // Find the store object for the current store id
        const currentStore = data.stores.find(
          (store) => store.store === decodedToken.id
        );
        return {
          userFirstName: data.user.firstName,
          userLastName: data.user.lastName,
          userId: data.user._id,
          userPhone: data.user.phoneNumber,
          userWilaya: data.user.wilaya,
          userCommune: data.user.commune,
          userAddress: data.user.storeAddresses,
          status: currentStore ? currentStore.status : "",
          token: user?.token,
          storeID: decodedToken.id,
        };
      });
      setRows(rowsData);
    }
  }, [NotApprovedUsersData, decodedToken.id]);

  const filteredRows = rows.filter(
    (row) =>
      row.userFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userWilaya.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userCommune.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleConfirmAlert = (message) => {
    fetchNotApprovedUsersData();
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    setFilteredData(filteredRows);
  }, [filteredRows, setFilteredData]);

  return (
    <Fragment>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "none" }}
        className="tablePages"
      >
        <Table aria-label="collapsible table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">
                <span className="thTableSpan">Full Name</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Phone Number</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Wilaya</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Commune</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Address</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Status</span>
              </TableCell>
              <TableCell align="right" className="tableCell">
                <span className="thTableSpan">Action</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <Row
                  key={row.userId}
                  row={row}
                  handleConfirmAlert={handleConfirmAlert}
                />
              ))
            ) : loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {/* <span className="thTableSpan">loading...</span> */}
                  <CircularProgress color="inherit" />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <span className="thTableSpan">No users found</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
