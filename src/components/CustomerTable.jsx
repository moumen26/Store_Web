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

function Row(props) {
  const { row } = props;
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/customers/${row.customerId}`);
  };

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.customerId}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.customerName}</span>
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
    customerName: PropTypes.string.isRequired,
    customerCommune: PropTypes.string.isRequired,
  }).isRequired,
};

export default function CustomerTable({ searchQuery, setFilteredData }) {
  const rows = [
    {
      customerName: "Khaldi Abdelmoumen",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },
    {
      customerName: "Khaldi Abdelmoumen",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },
    {
      customerName: "Khaldi Abdelmoumen",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },
    {
      customerName: "Khaldi Abdelmoumen",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },
    {
      customerName: "Khaldi Abdelmoumen",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },

    {
      customerName: "Khaldi Abdelmoumen",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },
    {
      customerName: "Khaldi Abdelmoumen",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },
    {
      customerName: "Khaldi Abdelmoumen",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },

    {
      customerName: "Khaldi Abdelmoumen",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },
    {
      customerName: "Khaldi Abdelmoumen",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },
    {
      customerName: "Khaldi Abdelmoumen",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },
    {
      customerName: "Khaldi Adel",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },
    {
      customerName: "Khaldi Abdelmoumen",
      customerId: "0920496",
      customerPhone: "0550189087",
      customerWilaya: "Blida",
      customerCommune: "Ouled Aich",
    },
  ];

  const filteredRows = rows.filter(
    (row) =>
      row.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerWilaya.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.customerCommune.toLowerCase().includes(searchQuery.toLowerCase())
  );

  React.useEffect(() => {
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
              <span className="thTableSpan">Customer_ID</span>
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
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <span className="thTableSpan">No customers found</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
