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
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

function Row(props) {
  const { row } = props;
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/FournisseurProfile/${row.fournisseurId}`);
    // navigate("/CustomerProfile", { state: { customer: row } });
  };

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">
          <span className="mr-1 trTableSpan">{row.fournisseurFirstName}</span>
          <span className="trTableSpan">{row.fournisseurLastName}</span>
        </span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.fournisseurPhone}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.fournisseurWilaya}</span>
      </TableCell>
      <TableCell align="right" className="tableCell">
        <span className="trTableSpan">{row.fournisseurCommune}</span>
      </TableCell>
      <TableCell align="right" className="tableCell">
        <div className="flex justify-end pr-3">
          <EyeIcon
            className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={handleViewClick}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    fournisseurId: PropTypes.string.isRequired,
    fournisseurWilaya: PropTypes.string.isRequired,
    fournisseurPhone: PropTypes.string.isRequired,
    fournisseurLastName: PropTypes.string.isRequired,
    fournisseurFirstName: PropTypes.string.isRequired,
    fournisseurCommune: PropTypes.string.isRequired,
  }).isRequired,
};

export default function FournisseurTable({ searchQuery, setFilteredData, data, loading }) {  
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (data?.length > 0) {
      const rowsData = data.map((data) => ({
        fournisseurFirstName: data.firstName,
        fournisseurLastName: data.lastName,
        fournisseurId: data._id,
        fournisseurPhone: data.phoneNumber,
        fournisseurWilaya: data.wilaya,
        fournisseurCommune: data.commune,
      }));
      setRows(rowsData);
    }
  }, [data]);
  const filteredRows = rows.filter(
    (row) =>
      row.fournisseurLastName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      row.fournisseurFirstName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      row.fournisseurPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.fournisseurWilaya.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.fournisseurCommune.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setFilteredData(filteredRows);
  }, [filteredRows, setFilteredData]);

  return (
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
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Commune</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.length > 0 ? (
            filteredRows.map((row) => <Row key={row.fournisseurId} row={row} />)
          ) : loading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                {/* <span className="thTableSpan">loading...</span> */}
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <span className="thTableSpan">No Fournisseur found</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
