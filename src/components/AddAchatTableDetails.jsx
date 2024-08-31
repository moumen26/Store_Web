import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ConfirmDialog from "./ConfirmDialog";
import Modal from "react-modal";
import Search from "./Search";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ProductCard from "./ProductCard";
import { useAuthContext } from "../hooks/useAuthContext";
import { TokenDecoder } from "../util/DecodeToken";
import { useQuery } from "@tanstack/react-query";

function AddAchatTableDetails({
  isModalOpen,
  handleCloseModal,
  onCalculateTotals,
  deliveryAmount,
  setAPIProducts
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const [rows, setRows] = useState([
    {
      productId: "0920496",
      productName: "Elio - 1L",
      productBrand: "Cevital",
      productQuantity: 5,
      productPrice: 120,
    },
    {
      productId: "0920490",
      productName: "Pril Isis - 650ml",
      productBrand: "Pril",
      productQuantity: 5,
      productPrice: 190,
    },
  ]);
  const [newItem, setNewItem] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [deletedProductName, setDeletedProductName] = useState("");
  const [unitType, setUnitType] = useState("perUnit");
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const [ClientQuantity, setClientQuantity] = useState(0);
  const handleClientQuantityChange = (e) => {
    setClientQuantity(e.target.value);
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const handleSelectedCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const [buyingPrice, setBuyingPrice] = useState(0);
  const handleBuyingPriceChange = (e) => {
    setBuyingPrice(e.target.value);
  };

  const [sellingPrice, setSellingPrice] = useState(0);
  const handleSellingPriceChange = (e) => {
    setSellingPrice(e.target.value);
  };  

  useEffect(() => {
    const calculateTotals = () => {
      const subtotal = rows.reduce(
        (acc, row) => acc + row.productQuantity * row.productPrice,
        0
      );
      const total = subtotal + deliveryAmount;
      onCalculateTotals(subtotal, deliveryAmount, total);
    };
    calculateTotals();
  }, [rows, deliveryAmount, onCalculateTotals]);

  const handleDeleteClick = (productId) => {
    const productToDelete = rows.find((row) => row.productId === productId);
    setDeleteItemId(productId);
    setDeletedProductName(productToDelete.productName);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setRows(rows.filter((row) => row.productId !== deleteItemId));
    setIsConfirmDialogOpen(false);
    setDeleteItemId(null);
    setSnackbarOpen(true);
    setAlertMessage(`Product "${deletedProductName}" has been deleted.`);
    setAlertType("error");
  };

  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
    setDeleteItemId(null);
  };

  const handleAddItem = () => {
    if (!newItem || !newItem.product._id) {
      setAlertMessage("Please select a product.");
      setAlertType("error");
      setSnackbarOpen(true);
      return;
    }

    let productQuantity = ClientQuantity;
  
    if (productQuantity <= 0) {
      setAlertMessage("Please enter a valid quantity.");
      setAlertType("error");
      setSnackbarOpen(true);
      return;
    }
  
    if (unitType === "perBox") {
      productQuantity = Number(productQuantity) * Number(newItem.product.product.boxItems);
    }
  
    // Update newItem with the correct ClientQuantity
    const updatedItem = {
      ...newItem,
      ClientQuantity: productQuantity,
      uniqueId: Date.now().toString()
    };

    // Add the updated item to the rows
    setRows([...rows, updatedItem]);
    setAPIProducts((prevState) => ([
      ...prevState,
      {
        stock: updatedItem.product._id,
        quantity: updatedItem.ClientQuantity,
        price: updatedItem.product.selling,
      }
    ]));
  
    handleCloseModal();
    setNewItem(null);
    setClientQuantity(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  const OrderRow = ({
    row,
    onDelete,
  }) => {

    const productAmount = row.productPrice * row.productQuantity;

    return (
      <TableRow
        key={row.productId}
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
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
          <span className="trTableSpan">{row.productQuantity}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.productPrice} DA</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{productAmount} DA</span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <div className="flex items-center justify-end space-x-3">
            <TrashIcon
              className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => onDelete(row.uniqueId)}
            />
          </div>
        </TableCell>
      </TableRow>
    );
  };

  //---------------------------------API calls---------------------------------\\
  
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  // fetching Product data
  const fetchProductData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Product/store/${decodedToken.id}`,
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
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving Product data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: ProductData,
    error: ProductError,
    isLoading: ProductLoading,
    refetch: ProductRefetch,
  } = useQuery({
    queryKey: ["ProductData", user?.token, location.key],
    queryFn: fetchProductData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // fetching Category data
  const fetchCategoryData = async () => {
    const response = await fetch(
      import.meta.env.VITE_APP_URL_BASE + `/Category/store/${decodedToken.id}`,
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
      const errorData = await response.json();
      if (errorData.error.statusCode == 404) return [];
      else throw new Error("Error receiving Category data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const {
    data: CategoryData = [],
    error: CategoryError,
    isLoading: CategoryLoading,
    refetch: CategoryRefetch,
  } = useQuery({
    queryKey: ["CategoryData", user?.token],
    queryFn: fetchCategoryData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });
  return (
    <>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "none" }}
        className="tablePages"
      >
        <Table>
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
                <span className="thTableSpan">Quantity</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Price</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Amount</span>
              </TableCell>
              <TableCell align="right" className="tableCell">
                <span className="thTableSpan pr-1">Action</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <OrderRow
                  key={row.productId}
                  row={row}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {rows.length === 0 ? (
                    <span>Add products</span>
                  ) : (
                    <CircularProgress size={24} />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Add New Stock"
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
            overflowY: "auto",
          },
        }}
      >
        {ProductLoading || CategoryLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress color="inherit" />
          </div>
        ) : (
        <>
          <div className="customerClass addProductAchat">
            <h2 className="customerClassTitle">Add Product to Achat</h2>
            <div className="addNewStockClass flex-col">
              <div className="w-full h-[500px] w-[100%]">
                <div className="addProductModalHeader">
                  <Search
                    placeholder="Search by Product..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <div className="flex space-x-5 items-center">
                    <span>Category :</span>
                    <div className="selectStoreWilayaCommune w-[300px]">
                      <select
                        name="productCategory"
                        onChange={handleSelectedCategoryChange}
                      >
                        {CategoryData ?
                          <>
                            <option value="">-- Select Product Category --</option>
                            {CategoryData.map((category) => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </>
                          :
                          <option value="">No categories available</option>
                        }
                      </select>
                    </div>
                  </div>
                </div>

                <div className="productsContainer p-0 mt-5 h-[90%]">
                  {ProductData?.length > 0 ? (
                    ProductData?.map((product) => (
                      <ProductCard
                        key={product._id}
                        productName={product.brand?.name + ' ' + product.name + ' ' + product.size}
                        productImage={`${import.meta.env.VITE_APP_URL_BASE.replace('/api', '')}/files/${product.image}`}
                        onClick={() => handleSelectProduct(product)}
                        selected={selectedProduct && product._id === selectedProduct._id}
                      />
                    ))
                  ) : (
                    <p>No products available</p>
                  )}
                </div>
              </div>
              <>
                <div className=" border-0 mt-8 w-[100%] flex-row productDetailsStock">
                  <div className="dialogAddCustomerItem items-center">
                    <span>Buying Price :</span>
                    <div className="inputForm flex items-center">
                      <input
                        type="number"
                        name="buyingPrice"
                        //   onChange={handleBuyingPriceChange}
                      />
                      <span className="ml-2">DA</span>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span>Selling Price :</span>
                    <div className="inputForm flex items-center">
                      <input
                        type="number"
                        name="sellingPrice"
                        //   onChange={handleSellingPriceChange}
                      />
                      <span className="ml-2">DA</span>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span>Stock :</span>
                    <div className="inputForm">
                      <input
                        type="number"
                        name="stock"
                        defaultValue={0}
                        //   onChange={handleQuantityChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-8 items-start absolute bottom-5 right-8">
                  <button
                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                    // onClick={handleSaveStock}
                  >
                    Save
                  </button>
                </div>
              </>
            </div>
          </div>
        </>
        )}
      </Modal>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        dialogTitle="Confirm Delete"
        dialogContentText={`Are you sure you want to delete ${deletedProductName}?`}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={alertType}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddAchatTableDetails;
