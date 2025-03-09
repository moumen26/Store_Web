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
import ButtonAdd from "./ButtonAdd";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { Alert, Radio, RadioGroup, Snackbar } from "@mui/material";
import axios from "axios";
import FormControlLabel from "@mui/material/FormControlLabel";
import { TokenDecoder } from "../util/DecodeToken";
import ConfirmDialog from "./ConfirmDialog";

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
    handleOpenStockStatusConfirmationDialog,
  } = props;
  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.stockId}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">
          {row.productBrand} {row.productName} {row.productSize}
        </span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{row.productBuyingPrice} DA</span>
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
        <span className="trTableSpan">{row.productStock}</span>
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

export default function ProductTable({
  searchQuery,
  STOCKData,
  isLoading,
  refetch,
}) {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState(null);
  const [selectedStockStatusId, setSelectedStockStatusId] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const [Quantity, setQuantity] = useState(0);
  const [QuantityPerBox, setQuantityPerBox] = useState(0);
  const [QuantityPerUnity, setQuantityPerUnity] = useState(0);
  const handleQuantityPerBoxChange = (e) => {
    setQuantityPerBox(e.target.value);

    const boxQuantity = Number(
      Number(e.target.value) * Number(StockData?.product?.boxItems)
    );
    if (boxQuantity > 0)
      setQuantity(Number(boxQuantity) + Number(QuantityPerUnity));
    else setQuantity(Number(QuantityPerUnity));
  };
  const handleQuantityPerUnityChange = (e) => {
    setQuantityPerUnity(e.target.value);
    const boxQuantity = Number(
      Number(QuantityPerBox) * Number(StockData?.product?.boxItems)
    );
    if (boxQuantity > 0)
      setQuantity(Number(boxQuantity) + Number(e.target.value));
    else setQuantity(Number(e.target.value));
  };

  const [BuyingPrice, setBuyingPrice] = useState(0);
  const handleBuyingPriceChange = (e) => {
    setBuyingPrice(e.target.value);
  };
  const [SellingPrice, setSellingPrice] = useState(0);
  const handleSellingPriceChange = (e) => {
    setSellingPrice(e.target.value);
  };
  const [ExparationDate, setExparationDate] = useState("");
  const handleExparationDateChange = (e) => {
    setExparationDate(e.target.value);
  };
  //clear form
  const clearForm = () => {
    setExparationDate("");
    setQuantity(0);
    setSellingPrice(0);
    setBuyingPrice(0);
  };

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

  const [modalIsOpenAddNewStockProduct, setModalIsOpenAddNewStockProduct] =
    useState(false);

  const handleOpenModalAddNewStockProduct = () => {
    setModalIsOpenAddNewStockProduct(true);
  };

  const handleCloseModalAddNewStockProduct = () => {
    clearForm();
    setModalIsOpenAddNewStockProduct(false);
  };

  const [
    openDeleteStockStatusConfirmationDialog,
    setOpenDeleteStockStatusConfirmationDialog,
  ] = useState(false);
  const handleOpenStockStatusConfirmationDialog = (val) => {
    setOpenDeleteStockStatusConfirmationDialog(true);
    setSelectedStockStatusId(val);
  };
  const handleCloseStockStatusConfirmationDialog = () => {
    setOpenDeleteStockStatusConfirmationDialog(false);
    setSelectedStockStatusId(null);
  };

  useEffect(() => {
    if (STOCKData?.length > 0) {
      const rowsData = STOCKData?.map((stock) => ({
        productId: stock.product?._id,
        productName: stock.product?.name,
        productSize: stock.product?.size,
        productBrand: stock.product?.brand.name,
        productBuyingPrice: stock.buying,
        productSellPrice: stock.selling,
        productStock: stock.quantity.toString(),
        stockId: stock._id,
        image: stock.product?.image,
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
  const {
    data: StockData,
    error: StockError,
    isLoading: StockLoading,
    refetch: StockRefetch,
  } = useQuery({
    queryKey: ["StockData", selectedStockId, user?.token],
    queryFn: () => fetchStockById(), // Call the fetch function with selectedStockId
    enabled: !!selectedStockId && !!user?.token, // Ensure the query runs only if the Stock ID and token are available
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // fetching specific Stock status data
  const fetchStockStatusById = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/StockStatus/${
        decodedToken?.id
      }/${selectedStockId}`,
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
        throw new Error(
          "Error receiving Stock Status data: " + response.statusText
        );
      }
    }

    // Return the fetched product data
    return await response.json();
  };
  // useQuery hook to fetch data for a specific StockStatus
  const {
    data: StockStatusData,
    error: StockStatusError,
    isLoading: StockStatusLoading,
    refetch: StockStatusRefetch,
  } = useQuery({
    queryKey: ["StockStatusData", selectedStockId, user?.token],
    queryFn: () => fetchStockStatusById(), // Call the fetch function with selectedStockId
    enabled: !!selectedStockId && !!user?.token, // Ensure the query runs only if the product ID and token are available
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // update the stock data
  const handleUpdateStock = async (stockID) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE + `/Stock/update/${stockID}`,
        {
          BuyingPrice: editedRow?.productBuyingPrice,
          SellingPrice: editedRow?.productSellPrice,
          Quantity: editedRow?.productStock,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
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
        console.error("Error updating stock");
      }
    }
  };

  // create new stock Status
  const handleAddNewStockStatus = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE +
          `/StockStatus/create/${decodedToken?.id}/${selectedStockId}`,
        {
          BuyingPrice: BuyingPrice,
          SellingPrice: SellingPrice,
          Quantity: Quantity,
          ExparationDate: ExparationDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        StockStatusRefetch();
        StockRefetch();
        refetch();
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseModalAddNewStockProduct();
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
        console.error("Error creating stock: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error creating stock");
      }
    }
  };
  // delete stock Status
  const handleDeleteStockStatus = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.delete(
        import.meta.env.VITE_APP_URL_BASE +
          `/StockStatus/delete/${decodedToken?.id}/${selectedStockStatusId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        StockStatusRefetch();
        StockRefetch();
        refetch();
        setAlertType(false);
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseStockStatusConfirmationDialog();
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
        console.error("Error deleting stock status: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error deleting stock status");
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
                <span className="thTableSpan">Code Stock</span>
              </TableCell>
              <TableCell>
                <span className="thTableSpan">Nom</span>
              </TableCell>
              <TableCell>
                <span className="thTableSpan">Prix d'achat</span>
              </TableCell>
              <TableCell>
                <span className="thTableSpan">Prix de vente</span>
              </TableCell>
              <TableCell>
                <span className="thTableSpan">Unité de stock</span>
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
                  <CircularProgress color="inherit" />
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
                  handleOpenStockStatusConfirmationDialog={
                    handleOpenStockStatusConfirmationDialog
                  }
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
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
        className="addNewModal addNewStockModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        {StockLoading ? (
          <div className="h-[80%] flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        ) : StockData ? (
          <>
            <div className="customerClass">
              <h2 className="customerClassTitle">Détails du produit</h2>
              <ProductProfileDetails
                data={StockData}
                isLoading={StockLoading}
              />
            </div>
            <div className="flex justify-between">
              <div className="w-[70%]">
                <div className="customerClass pt-0">
                  <ProductProfileDetailsV2
                    data={StockData}
                    setAlertType={setAlertType}
                    setSnackbarMessage={setSnackbarMessage}
                    setSnackbarOpen={setSnackbarOpen}
                    handleRefetchDataChange={StockRefetch}
                  />
                  <div className="flex items-center justify-between mt-[24px]">
                    <h2 className="customerClassTitle">Historique du stock</h2>
                    <ButtonAdd
                      buttonSpan="Ajouter un nouveau stock"
                      onClick={handleOpenModalAddNewStockProduct}
                    />
                  </div>
                  <div className="scrollProductHistorique mt-[8px]">
                    <ProductHistorique
                      StockStatusData={StockStatusData}
                      StockStatusLoading={StockStatusLoading}
                      handleOpenStockStatusConfirmationDialog={
                        handleOpenStockStatusConfirmationDialog
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="w-[25%] h-fit flex-col space-y-5 mt-[16px]">
                <h2 className="customerClassTitle">Image du Produit</h2>
                <div className="w-full flex justify-center h-[380px]">
                  <img
                    className="text-center"
                    srcSet={`${import.meta.env.VITE_APP_URL_BASE.replace(
                      "/api",
                      ""
                    )}/files/${StockData?.product?.image}`}
                    src={`${import.meta.env.VITE_APP_URL_BASE.replace(
                      "/api",
                      ""
                    )}/files/${StockData?.product?.image}`}
                    alt={StockData?.product?.name}
                    style={{ width: "auto", height: "100%" }}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                style={{ marginTop: "20px" }}
                className="text-gray-500 cursor-pointer hover:text-gray-700 pr-8"
              >
                Fermer
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="h-[93%] w-full flex items-center justify-center">
              <span className="thTableSpan">Aucun produit disponible</span>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                style={{ marginTop: "20px" }}
                className="text-gray-500 cursor-pointer hover:text-gray-700 pr-8"
              >
                Fermer
              </button>
            </div>
          </>
        )}
      </Modal>

      <Modal
        isOpen={modalIsOpenAddNewStockProduct}
        onRequestClose={handleCloseModalAddNewStockProduct}
        contentLabel="Add Address Modal"
        className="addNewModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div className="customerClass p-0">
          <h2 className="customerClassTitle">Ajouter un Nouveau Stock</h2>
          <div className="productDetailsStockProduct">
            <div className="dialogAddCustomerItem items-center">
              <span>Prix d'achat :</span>
              <div className="inputForm flex items-center">
                <input
                  type="number"
                  name="buyingPrice"
                  value={BuyingPrice}
                  min={0}
                  onChange={handleBuyingPriceChange}
                />
                <span className="ml-2">DA</span>
              </div>
            </div>
            <div className="dialogAddCustomerItem items-center">
              <span>Prix de vente :</span>
              <div className="inputForm flex items-center">
                <input
                  type="number"
                  name="sellingPrice"
                  value={SellingPrice}
                  min={0}
                  onChange={handleSellingPriceChange}
                />
                <span className="ml-2">DA</span>
              </div>
            </div>
            <div className="dialogAddCustomerItem items-center">
              <span>Date d'expiration :</span>
              <div className="inputForm">
                <input
                  type="date"
                  name="ExparationDate"
                  value={ExparationDate}
                  onChange={handleExparationDateChange}
                />
              </div>
            </div>
            <div className="dialogAddCustomerItem items-center">
              <span>Quantity per box:</span>
              <div className="inputForm">
                <input
                  type="number"
                  name="stock"
                  value={QuantityPerBox}
                  min={0}
                  onChange={handleQuantityPerBoxChange}
                />
              </div>
              <span>Quantity per unity:</span>
              <div className="inputForm">
                <input
                  type="number"
                  name="stock"
                  value={QuantityPerUnity}
                  min={0}
                  onChange={handleQuantityPerUnityChange}
                />
              </div>
            </div>
            <div className="dialogAddCustomerItem items-center">
              <span>Toatal quantité :</span>
              <span>{Quantity} unity</span>
            </div>
          </div>
          <div className="flex justify-end space-x-8 items-start mt-[20px]">
            <button
              className="text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={handleCloseModalAddNewStockProduct}
            >
              Annuler
            </button>
            <button
              className="text-blue-500 cursor-pointer hover:text-blue-700"
              onClick={handleAddNewStockStatus}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={openDeleteStockStatusConfirmationDialog}
        onConfirm={handleDeleteStockStatus}
        onClose={handleCloseStockStatusConfirmationDialog}
        dialogTitle={"Confirmer la suppression d'un stock"}
        dialogContentText={`Etes-vous sûr de vouloir mettre à jour votre stock ? Cette action diminuera votre quantité de stock actuelle, assurez-vous de supprimer le bon stock`}
        isloading={submitionLoading}
      />
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={alertType ? "error" : "success"}
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
