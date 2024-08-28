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
import { useQuery } from "@tanstack/react-query";

function Row(props) {
  const { row } = props;
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/CustomerProfile/${row.customerId}`);
  };

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.customerId}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">
          <span className="mr-1 trTableSpan">{row.customerFirstName}</span>
          <span className="trTableSpan">{row.customerLastName}</span>
        </span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.customerPhone}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.customerWilaya}</span>
      </TableCell>
      <TableCell align="right" className="tableCell">
        <span className="trTableSpan">{row.customerCommune}</span>
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
    customerId: PropTypes.string.isRequired,
    customerWilaya: PropTypes.string.isRequired,
    customerPhone: PropTypes.string.isRequired,
    customerLastName: PropTypes.string.isRequired,
    customerFirstName: PropTypes.string.isRequired,
    customerCommune: PropTypes.string.isRequired,
  }).isRequired,
};

export default function VendorsTable({ searchQuery, setFilteredData }) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  
  //fetch data
  const fetchCustomersData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/MyStores/sellers/${decodedToken.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) {
        return []; // Return an empty array if no data is found
      } else {
        throw new Error("Error receiving approved users data for this store");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const { 
    data: CustomersData, 
    error: CustomersDataError, 
    isLoading: CustomersDataLoading, 
    refetch: refetchCustomersData 
  } = useQuery({
    queryKey: ['CustomersData', user?.token],
    queryFn: fetchCustomersData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });
  // Refetch data when user changes
  const handleRefetchDataChange = () => {
    refetchCustomersData();
  };

  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (CustomersData?.length > 0) {
      const rowsData = CustomersData.map((data) => ({
        customerFirstName: data.user.firstName,
        customerLastName: data.user.lastName,
        customerId: data.user._id,
        customerPhone: data.user.phoneNumber,
        customerWilaya: data.user.wilaya,
        customerCommune: data.user.commune,
      }));
      setRows(rowsData);
    }else{
      setRows([]);
    }
  }, [CustomersData]);
  const filteredRows = rows.filter(
    (row) =>
      row.customerLastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerWilaya.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerCommune.toLowerCase().includes(searchQuery.toLowerCase())
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
              <span className="thTableSpan">Vendors_ID</span>
            </TableCell>
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
            filteredRows.map((row) => <Row key={row.customerId} row={row} />)
          ) : CustomersDataLoading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                {/* <span className="thTableSpan">loading...</span> */}
                <CircularProgress color="inherit" />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <span className="thTableSpan">No vendors found</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
