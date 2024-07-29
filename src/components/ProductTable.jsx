import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import {TokenDecoder} from "../util/DecodeToken";
import React, { useEffect, useState } from "react";

function Row(props) {
  const {
    row,
    isEditing,
    onEditClick,
    onSaveClick,
    onCancelClick,
    onChange,
    editedRow,
  } = props;
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/Product/${row.productId}`);
  };

  const handleNumericChange = (productId, field, value) => {
    if (!isNaN(value)) {
      onChange(productId, field, value);
    }
  };

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productCode}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productName}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productBrand}</span>
      </TableCell>
      <TableCell className="tableCell">
        {isEditing ? (
          <input
            type="text"
            value={editedRow.productBuyingPrice}
            onChange={(e) =>
              handleNumericChange(
                row.productId,
                "productBuyingPrice",
                e.target.value
              )
            }
            className="editable-input"
          />
        ) : (
          <span className="trTableSpan">{row.productBuyingPrice} DA</span>
        )}
      </TableCell>
      <TableCell className="tableCell">
        {isEditing ? (
          <input
            type="text"
            value={editedRow.productSellPrice}
            onChange={(e) =>
              handleNumericChange(
                row.productId,
                "productSellPrice",
                e.target.value
              )
            }
            className="editable-input"
          />
        ) : (
          <span className="trTableSpan">{row.productSellPrice} DA</span>
        )}
      </TableCell>
      <TableCell className="tableCell">
        {isEditing ? (
          <input
            type="text"
            value={editedRow.productStock}
            onChange={(e) =>
              handleNumericChange(row.productId, "productStock", e.target.value)
            }
            className="editable-input"
          />
        ) : (
          <span className="trTableSpan">{row.productStock}</span>
        )}
      </TableCell>
      <TableCell align="right" className="tableCell w-[100px]">
        <div className="flex items-center justify-end space-x-3">
          {!isEditing && (
            <EyeIcon
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={handleViewClick}
            />
          )}
          {isEditing ? (
            <>
              <button
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => onSaveClick(row.productId)}
              >
                Save
              </button>
              <button
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={() => onCancelClick()}
              >
                Cancel
              </button>
            </>
          ) : (
            <PencilIcon
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => onEditClick(row.productId)}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    productCode: PropTypes.string.isRequired,
    productBuyingPrice: PropTypes.string.isRequired,
    productBrand: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    productSellPrice: PropTypes.string.isRequired,
    productStock: PropTypes.string.isRequired,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  editedRow: PropTypes.object.isRequired,
};

export default function ProductTable({ searchQuery, setFilteredData }) {
  const { user } = useAuthContext();
  const [STOCKData, setSTOCKData] = useState([]);
  const [loading, setLoading] = useState(false);
  const decodedToken = TokenDecoder();
  useEffect(() => {
    const fetchSTOCKData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_URL_BASE}/Stock/${decodedToken.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            setSTOCKData(data);
        } else {
            setSTOCKData([]);
            setRows([]);
            console.error("Error receiving STOCK data:", response.statusText);
        }
      } catch (error) {
          console.error("Error fetching STOCK data:", error);
      } finally {
          setLoading(false);
      }
    };
    fetchSTOCKData();
  }, [user?.token]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (STOCKData.length > 0) {
      const rowsData = STOCKData.map(stock => ({
        productId: stock.product._id,
        productCode: stock.product.code,
        productName: stock.product.name,
        productBrand: stock.product.brand.name,
        productBuyingPrice: stock.price[0],
        productSellPrice: stock.price[stock.price.length - 1],
        productStock: stock.quantity.toString(),
      }));
      setRows(rowsData);
    }
  }, [STOCKData]);

  const handleEditClick = (productId) => {
    setEditingRowId(productId);
    const rowToEdit = rows.find((row) => row.productId === productId);
    setEditedRow(rowToEdit);
  };

  const handleSaveClick = (productId) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.productId === productId ? editedRow : row))
    );
    setEditingRowId(null);
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
  };

  const handleChange = (productId, field, value) => {
    setEditedRow((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredRows = rows.filter(
    (row) =>
      row.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.productBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.productBuyingPrice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.productSellPrice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.productStock.toLowerCase().includes(searchQuery.toLowerCase())
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
              <span className="thTableSpan">Product Code</span>
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
              <span className="thTableSpan pr-1">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.length > 0 ? (
            filteredRows.map((row) => (
              <Row
                key={row.productId}
                row={row}
                isEditing={editingRowId === row.productId}
                onEditClick={handleEditClick}
                onSaveClick={handleSaveClick}
                onCancelClick={handleCancelClick}
                onChange={handleChange}
                editedRow={editedRow}
              />
            ))
          ) : (loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <span className="thTableSpan">loading...</span>
                </TableCell>
              </TableRow>
            ) :(
            <TableRow>
              <TableCell colSpan={7} align="center">
                <span className="thTableSpan">No products found</span>
              </TableCell>
            </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
