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
    navigate(`/products/${row.productId}`);
  };

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productId}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productName}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productBrand}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productBuyingPrice} DA</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productSellPrice} DA</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productStock}</span>
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
    productId: PropTypes.string.isRequired,
    productBuyingPrice: PropTypes.string.isRequired,
    productBrand: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    productSellPrice: PropTypes.string.isRequired,
  }).isRequired,
};

export default function ProductTable({ searchQuery, setFilteredData }) {
  const rows = [
    {
      productId: "0920496",
      productName: "Elio - 1L",
      productBrand: "Cevital",
      productBuyingPrice: "120.00",
      productSellPrice: "115.00",
      productStock: "100",
    },
    {
      productId: "0920496",
      productName: "Elio - 1L",
      productBrand: "Cevital",
      productBuyingPrice: "120.00",
      productSellPrice: "115.00",
      productStock: "100",
    },
      {
      productId: "0920496",
      productName: "Elio - 1L",
      productBrand: "Cevital",
      productBuyingPrice: "120.00",
      productSellPrice: "115.00",
      productStock: "100",
    },

      {
      productId: "0920496",
      productName: "Elio - 1L",
      productBrand: "Cevital",
      productBuyingPrice: "120.00",
      productSellPrice: "115.00",
      productStock: "100",
    },
      {
      productId: "0920496",
      productName: "Elio - 1L",
      productBrand: "Cevital",
      productBuyingPrice: "120.00",
      productSellPrice: "115.00",
      productStock: "100",
    },
      {
      productId: "0920496",
      productName: "Elio - 1L",
      productBrand: "Cevital",
      productBuyingPrice: "120.00",
      productSellPrice: "115.00",
      productStock: "100",
    },

  ];

  const filteredRows = rows.filter(
    (row) =>
      row.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.productBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.productBuyingPrice
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      row.productSellPrice.toLowerCase().includes(searchQuery.toLowerCase())
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
              <span className="thTableSpan">Product_ID</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Product</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Brand</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Buying Price</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Sell Price</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Stock</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.length > 0 ? (
            filteredRows.map((row) => <Row key={row.productId} row={row} />)
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <span className="thTableSpan">No products found</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
