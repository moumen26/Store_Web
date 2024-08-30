import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthContext } from "../hooks/useAuthContext";
import ProductProfileDetails from "./ProductProfileDetails";
import ProductProfileDetailsV2 from "./ProductProfileDetailsV2";
import ProductHistorique from "./ProductHistorique";
import ProductArchiveHistorique from "./ProductArchiveHistorique";
import ButtonAdd from "./ButtonAdd";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { Alert, Snackbar } from "@mui/material";
import axios from "axios";

// Set the app element for accessibility
Modal.setAppElement("#root");

function Row(props) {
  const {
    row,
    isEditing,
    onEditClick,
    onViewClick,
    onSaveClick,
    onCancelClick,
    onChange,
    editedRow,
  } = props;

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productCode}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productName}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productSize}</span>
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
              onChange(row.productId, "productBuyingPrice", e.target.value)
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
              onChange(row.productId, "productSellPrice", e.target.value)
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
              onChange(row.productId, "productStock", e.target.value)
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
              onClick={() => onViewClick(row.stockId)}
            />
          )}
          {isEditing ? (
            <>
              <button
                className="text-green-500 cursor-pointer hover:text-green-700"
                onClick={() => onSaveClick(row.stockId)}
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
              onClick={() => onEditClick(row.stockId)}
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
    productBuyingPrice: PropTypes.number.isRequired,
    productBrand: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    productSize: PropTypes.string.isRequired,
    productSellPrice: PropTypes.number.isRequired,
    productStock: PropTypes.string.isRequired,
    stockId: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onViewClick: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  editedRow: PropTypes.object.isRequired,
};

export default function ProductTable({ searchQuery, STOCKData, isLoading, refetch }) {
  const { user } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [submitionLoading, setSubmitionLoading] = useState(false);

  const handleEditClick = (stockId) => {
    setSelectedStockId(stockId);
    setEditingRowId(stockId);
    const rowToEdit = rows.find((row) => row.stockId === stockId);
    setEditedRow(rowToEdit);
  };
  const handleViewClick = (stockId) => {
    setSelectedStockId(stockId);
    setIsModalOpen(true);
  };
  const handleCancelClick = () => {
    setSelectedStockId(null);
    setEditingRowId(null);
    setEditedRow({});
  };
  const handleChange = (productId, field, value) => {
    setEditedRow((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStockId(null);
  };
  
  useEffect(() => {
    if (STOCKData?.length > 0) {
      const rowsData = STOCKData?.map((stock) => ({
        productId: stock.product._id,
        productCode: stock.product.code,
        productName: stock.product.name,
        productSize: stock.product.size,
        productBrand: stock.product.brand.name,
        productBuyingPrice: stock.buying,
        productSellPrice: stock.selling,
        productStock: stock.quantity.toString(),
        stockId: stock._id,
        image: stock.product.image,
      }));
      setRows(rowsData);
    }
  }, [STOCKData]);

  const filteredRows = rows.filter((row) =>
    row.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //---------------------------------API calls---------------------------------\\
  
  // fetching specific Stock data
  const fetchStockById = async () => {
    const response = await fetch(
        `${import.meta.env.VITE_APP_URL_BASE}/Stock/${selectedStockId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
            },
        }
    );

    // Handle the error state
    if (!response.ok) {
        if (response.status === 404) {
            return []; 
        } else {
            throw new Error("Error receiving Stock data: " + response.statusText);
        }
    }

    // Return the fetched Stock data
    return await response.json();
  };
  // useQuery hook to fetch data for a specific Stock
  const { data: StockData, error: StockError, isLoading: StockLoading, refetch: StockRefetch } = useQuery({
      queryKey: ['StockData', selectedStockId, user?.token],
      queryFn: () => fetchStockById(), // Call the fetch function with selectedStockId
      enabled: !!selectedStockId && !!user?.token, // Ensure the query runs only if the Stock ID and token are available
      refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // update the stock data
  const handleUpdateStock = async (stockID) => {
    try {
        setSubmitionLoading(true);
        const response = await axios.patch(import.meta.env.VITE_APP_URL_BASE+`/Stock/update/${stockID}`, 
          {
            BuyingPrice: editedRow?.productBuyingPrice,
            SellingPrice: editedRow?.productSellPrice,
            Quantity: editedRow?.productStock
          },
          {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              }
          }
        );
        if (response.status === 200) {
          setEditingRowId(null);
          setAlertType(false);
          setSnackbarMessage(response.data.message);
          setSnackbarOpen(true);
          refetch();
          setSubmitionLoading(false);
        } else {
          setAlertType(true);
          setSnackbarMessage(response.data.message);
          setSnackbarOpen(true);
          setSubmitionLoading(false);
        }
    } catch (error) {
        if (error.response) {
          setAlertType(true);
          setSnackbarMessage(error.response.data.message);
          setSnackbarOpen(true);
          setSubmitionLoading(false);
        } else if (error.request) {
          // Request was made but no response was received
          console.error("Error updating stock: No response received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error updating stock",error);
        }
    }
  };
  
  return (
    <>
      <TableContainer
        component={Paper}
        className="tablePages"
        style={{ boxShadow: "none" }}
      >
        <Table aria-label="collapsible table">
          <TableHead className="tableHead">
            <TableRow>
              <TableCell>
                <span className="thTableSpan">Product Code</span>
              </TableCell>
              <TableCell>
                <span className="thTableSpan">Name</span>
              </TableCell>
              <TableCell>
                <span className="thTableSpan">Size</span>
              </TableCell>
              <TableCell>
                <span className="thTableSpan">Brand</span>
              </TableCell>
              <TableCell>
                <span className="thTableSpan">Buying Price</span>
              </TableCell>
              <TableCell>
                <span className="thTableSpan">Selling Price</span>
              </TableCell>
              <TableCell>
                <span className="thTableSpan">Stock unity</span>
              </TableCell>
              <TableCell align="right">
                <span className="thTableSpan">Actions</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <Row
                  key={row.productId}
                  row={row}
                  isEditing={editingRowId === row.stockId}
                  onEditClick={handleEditClick}
                  onViewClick={handleViewClick}
                  onSaveClick={handleUpdateStock}
                  onCancelClick={handleCancelClick}
                  onChange={handleChange}
                  editedRow={editedRow}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Product Details"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            border: "none",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "90%",
            margin: "auto",
            height: "80%",
            zIndex: 1001,
          },
        }}
      >
        {StockLoading ? (
          <div className="w-full h-[93%] flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        ) : StockData ? (
          <>
            <div className="customerClass">
              <h2 className="customerClassTitle">Product Details</h2>
              <ProductProfileDetails data={StockData} isLoading={StockLoading}/>
              <ProductProfileDetailsV2 data={StockData} isLoading={StockLoading}/>
            </div>
            <div className="flex justify-between mt-[16px]">
              <div className="w-[70%]">
                <div className="customerClass">
                  <div className="flex items-center justify-between">
                    <h2 className="customerClassTitle">Current stock</h2>
                    <ButtonAdd buttonSpan="Add New Stock" />
                  </div>
                  <div className="scrollProductHistorique mt-[16px]">
                    <ProductHistorique selectedStockId={selectedStockId}/>
                  </div>
                </div>
                
              </div>
              <div className="w-[25%] h-fit flex-col space-y-5">
                <h2 className="customerClassTitle">Product Image</h2>
                <div className="w-full flex justify-center h-[390px]">
                  <img
                    className="text-center"
                    srcSet={`${import.meta.env.VITE_APP_URL_BASE.replace('/api', '')}/files/${StockData?.product?.image}`}
                    src={`${import.meta.env.VITE_APP_URL_BASE.replace('/api', '')}/files/${StockData?.product?.image}`}
                    alt={StockData?.product?.name}
                    style={{ width: "auto", height: "100%" }}
                  />
                </div>
              </div>
            </div>
            <div className="customerClass">
              <div className="flex items-center justify-between">
                <h2 className="customerClassTitle">Stock history</h2>
              </div>
              <div className="scrollProductHistorique mt-[16px]">
                <ProductArchiveHistorique selectedStockId={selectedStockId}/>
              </div>
            </div>
          </>
        ) : (
          <div className="h-[93%] w-full flex items-center justify-center">
            <p>Product not found</p>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={handleCloseModal}
            style={{ marginTop: "20px" }}
            className="text-gray-500 cursor-pointer hover:text-gray-700 pr-8"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity= {alertType ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

ProductTable.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setFilteredData: PropTypes.func.isRequired,
};
