import * as React from "react";
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

function Row(props) {
  const { row, handleConfirmAlert } = props;
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleViewClick = () => {
    navigate(`/user/${row.userId}`);
  };

  const handleInactiveClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    // Add your confirmation logic here
    setOpen(false);
    handleConfirmAlert(`User ${row.userName} has been activated.`);
  };

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.userName}</span>
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
            <span className="inactiveSpan trTableSpan">Inactive</span>
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
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    userWilaya: PropTypes.string.isRequired,
    userPhone: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    userCommune: PropTypes.string.isRequired,
    userAddress: PropTypes.string.isRequired,
  }).isRequired,
  handleConfirmAlert: PropTypes.func.isRequired,
};

export default function CustomerTable({ searchQuery, setFilteredData }) {
  const rows = [
    {
      userName: "Khaldi Abdelmoumen",
      userId: "0920496",
      userPhone: "0550189087",
      userWilaya: "Blida",
      userCommune: "Ouled Aich",
      userAddress: "Rue Yousfi Abdelkader",
    },
    {
      userName: "Khaldi Abdelmoumen",
      userId: "0920496",
      userPhone: "0550189087",
      userWilaya: "Blida",
      userCommune: "Ouled Aich",
      userAddress: "Rue Yousfi Abdelkader",
    },
    {
      userName: "Khaldi Abdelmoumen",
      userId: "0920496",
      userPhone: "0550189087",
      userWilaya: "Blida",
      userCommune: "Ouled Aich",
      userAddress: "Rue Yousfi Abdelkader",
    },
    {
      userName: "Khaldi Abdelmoumen",
      userId: "0920496",
      userPhone: "0550189087",
      userWilaya: "Blida",
      userCommune: "Ouled Aich",
      userAddress: "Rue Yousfi Abdelkader",
    },
    {
      userName: "Khaldi Abdelmoumen",
      userId: "0920496",
      userPhone: "0550189087",
      userWilaya: "Blida",
      userCommune: "Ouled Aich",
      userAddress: "Rue Yousfi Abdelkader",
    },

    {
      userName: "Khaldi Abdelmoumen",
      userId: "0920496",
      userPhone: "0550189087",
      userWilaya: "Blida",
      userCommune: "Ouled Aich",
      userAddress: "Rue Yousfi Abdelkader",
    },
    {
      userName: "Khaldi Abdelmoumen",
      userId: "0920496",
      userPhone: "0550189087",
      userWilaya: "Blida",
      userCommune: "Ouled Aich",
      userAddress: "Rue Yousfi Abdelkader",
    },
    {
      userName: "Khaldi Abdelmoumen",
      userId: "0920496",
      userPhone: "0550189087",
      userWilaya: "Blida",
      userCommune: "Ouled Aich",
      userAddress: "Rue Yousfi Abdelkader",
    },
    {
      userName: "Khaldi Adel",
      userId: "0920496",
      userPhone: "0550189087",
      userWilaya: "Blida",
      userCommune: "Ouled Aich",
      userAddress: "Rue Yousfi Abdelkader",
    },

    {
      userName: "Khaldi Abdelmoumen",
      userId: "0920496",
      userPhone: "0550189087",
      userWilaya: "Blida",
      userCommune: "Ouled Aich",
      userAddress: "Rue Yousfi Abdelkader",
    },
  ];

  const filteredRows = rows.filter(
    (row) =>
      row.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userWilaya.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.userCommune.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const handleConfirmAlert = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  React.useEffect(() => {
    setFilteredData(filteredRows);
  }, [filteredRows, setFilteredData]);

  return (
    <React.Fragment>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "none" }}
        className="tablePages"
      >
        <Table aria-label="collapsible table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">
                <span className="thTableSpan">Name</span>
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
    </React.Fragment>
  );
}
