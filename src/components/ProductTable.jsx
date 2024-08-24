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
import { TokenDecoder } from "../util/DecodeToken";
import ProductProfileDetails from "./ProductProfileDetails";
import ProductHistorique from "./ProductHistorique";
import ButtonAdd from "./ButtonAdd";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";

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
              onClick={() => onViewClick(row.productId)}
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
    productSize: PropTypes.string.isRequired,
    productSellPrice: PropTypes.string.isRequired,
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

export default function ProductTable({ searchQuery, setFilteredData }) {
  const { user } = useAuthContext();
  const [STOCKData, setSTOCKData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productData, setProductData] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const decodedToken = TokenDecoder();

  useEffect(() => {
    const fetchSTOCKData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_URL_BASE}/Stock/${decodedToken.id}`,
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
          setSTOCKData(data);
        } else {
          setSTOCKData([]);
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

  useEffect(() => {
    if (selectedProductId) {
      const fetchProductData = async () => {
        setLoadingProduct(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_APP_URL_BASE}/Product/${selectedProductId}`,
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
            setProductData(data);
          } else {
            setProductData(null);
            console.error("Error receiving Product data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching Product data:", error);
        } finally {
          setLoadingProduct(false);
        }
      };
      fetchProductData();
    }
  }, [selectedProductId, user?.token]);

  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (STOCKData.length > 0) {
      const rowsData = STOCKData.map((stock) => ({
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

  const handleEditClick = (productId) => {
    setEditingRowId(productId);
    const rowToEdit = rows.find((row) => row.productId === productId);
    setEditedRow(rowToEdit);
  };

  const handleViewClick = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleSaveClick = (stockId) => {
    const updatedRows = rows.map((row) =>
      row.stockId === stockId ? editedRow : row
    );
    setRows(updatedRows);
    setEditingRowId(null);
  };

  const handleCancelClick = () => {
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
    setProductData(null);
  };

  const filteredRows = rows.filter((row) =>
    row.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <span className="thTableSpan">Stock</span>
              </TableCell>
              <TableCell align="right">
                <span className="thTableSpan">Actions</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
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
                  isEditing={editingRowId === row.productId}
                  onEditClick={handleEditClick}
                  onViewClick={handleViewClick}
                  onSaveClick={handleSaveClick}
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
        {loadingProduct ? (
          <div className="w-full h-[93%] flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        ) : productData ? (
          <>
            <div className="customerClass">
              <h2 className="customerClassTitle">Product Details</h2>
              <ProductProfileDetails product={productData} />
            </div>
            <div className="flex justify-between mt-[16px]">
              <div className="w-[70%]">
                <div className="customerClass">
                  <div className="flex items-center justify-between">
                    <h2 className="customerClassTitle">Product History</h2>
                    <ButtonAdd buttonSpan="Add New Stock" />
                  </div>
                  <div className="scrollProductHistorique mt-[16px]">
                    <ProductHistorique />
                  </div>
                </div>
              </div>
              <div className="w-[25%] h-fit flex-col space-y-5">
                <h2 className="customerClassTitle">Product Image</h2>
                <div className="w-full flex justify-center h-[390px]">
                  <img
                    className="text-center"
                    // src={product.image}
                    // alt={product.name}
                    style={{ width: "auto", height: "100%" }}
                  />
                </div>
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
    </>
  );
}

ProductTable.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setFilteredData: PropTypes.func.isRequired,
};
