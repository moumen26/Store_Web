import React, { useState, useEffect, useRef } from "react";
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
import { PhotoIcon } from "@heroicons/react/16/solid";
import ButtonAdd from "./ButtonAdd";

function AddAchatTableDetails({
  isModalOpen,
  isRemiseModalOpen,
  handleCloseModal,
  handleRemiseCloseModal,
  onCalculateTotals,
  deliveryAmount,
  setAPIProducts,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const [rows, setRows] = useState([]);
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
    setNewItem((prevState) => ({
      ...prevState,
      product: product,
    }));
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

  const [sellingPrice, setSellingPrice] = useState(buyingPrice);
  const handleSellingPriceChange = (e) => {
    setSellingPrice(e.target.value);
  };

  const [isAddProdutModalOpen, setIsAddProdutModalOpen] = useState(false);

  const handleOpenAddProductModal = () => {
    setIsAddProdutModalOpen(true);
  };

  const handleCloseAddProductModal = () => {
    setIsAddProdutModalOpen(false);
  };

  useEffect(() => {
    const calculateTotals = () => {
      const subtotal = rows.reduce(
        (acc, row) => acc + row.unityQuantity * row.buying,
        0
      );
      const total = subtotal + deliveryAmount;
      onCalculateTotals(subtotal, deliveryAmount, total);
    };
    calculateTotals();
  }, [rows, deliveryAmount, onCalculateTotals]);

  const handleDeleteClick = (uniqueId) => {
    setDeleteItemId(uniqueId);
    const deletedProduct = rows.find((row) => row.uniqueId === uniqueId);
    setDeletedProductName(deletedProduct.product.name);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    const updatedRows = rows.filter((row) => row.uniqueId !== deleteItemId);
    setRows(updatedRows);

    const updatedAPIProducts = updatedRows.map((updatedItem) => ({
      name: updatedItem.product.name,
      productID: updatedItem.productID,
      quantity: updatedItem.quantity,
      unityQuantity: updatedItem.unityQuantity,
      buying: updatedItem.buying,
      selling: updatedItem.selling,
    }));

    setAPIProducts(updatedAPIProducts);
    setIsConfirmDialogOpen(false);
    setDeletedProductName("");
    setDeleteItemId(null);
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

    if (ClientQuantity <= 0 || buyingPrice <= 0 || sellingPrice <= 0) {
      setAlertMessage("Please enter a valid quantity and prices.");
      setAlertType("error");
      setSnackbarOpen(true);
      return;
    }

    if (Number(buyingPrice) > Number(sellingPrice)) {
      setAlertMessage(
        "The selling price must be higher than the buying price."
      );
      setAlertType("error");
      setSnackbarOpen(true);
      return;
    }

    const productQuantity =
      Number(ClientQuantity) * Number(newItem.product.boxItems);

    // Update newItem with the correct ClientQuantity
    const updatedItem = {
      ...newItem,
      name: newItem.product.name,
      quantity: ClientQuantity,
      unityQuantity: productQuantity,
      buying: buyingPrice,
      selling: sellingPrice,
      uniqueId: Date.now().toString(),
    };

    // Add the updated item to the rows
    setRows([...rows, updatedItem]);
    setAPIProducts((prevState) => [
      ...prevState,
      {
        name: updatedItem.product.name,
        productID: updatedItem.product._id,
        quantity: updatedItem.quantity,
        buying: buyingPrice,
        selling: sellingPrice,
      },
    ]);

    handleCloseModal();
    setNewItem(null);
    setClientQuantity(0);
    setBuyingPrice(0);
    setSellingPrice(0);
    setSelectedProduct(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const OrderRow = ({ row, onDelete }) => {
    const productAmount = Number(row.buying) * Number(row.unityQuantity);

    return (
      <TableRow
        key={row.productId}
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.product._id}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.product.name}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.product.brand.name}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.quantity}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.unityQuantity}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.buying} DA</span>
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
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };
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
                <span className="thTableSpan">Box</span>
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
                <TableCell colSpan={8} align="center">
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
                  <div className="addProductToAchatButton">
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
                            {CategoryData ? (
                              <>
                                <option value="">
                                  -- Select Product Category --
                                </option>
                                {CategoryData.map((category) => (
                                  <option
                                    key={category._id}
                                    value={category._id}
                                  >
                                    {category.name}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <option value="">No categories available</option>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                    <ButtonAdd
                      buttonSpan="Add New Product"
                      onClick={handleOpenAddProductModal}
                    />
                  </div>

                  <div className="productsContainer p-0 mt-5 h-[90%]">
                    {ProductData?.length > 0 ? (
                      ProductData?.map((product) => (
                        <ProductCard
                          key={product._id}
                          productName={
                            product.brand?.name +
                            " " +
                            product.name +
                            " " +
                            product.size
                          }
                          productImage={`${import.meta.env.VITE_APP_URL_BASE.replace(
                            "/api",
                            ""
                          )}/files/${product.image}`}
                          onClick={() => handleSelectProduct(product)}
                          selected={
                            selectedProduct &&
                            product._id === selectedProduct._id
                          }
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
                          value={buyingPrice}
                          min={0}
                          onChange={handleBuyingPriceChange}
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
                          value={sellingPrice}
                          min={0}
                          onChange={handleSellingPriceChange}
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
                          value={ClientQuantity}
                          min={0}
                          onChange={handleClientQuantityChange}
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
                      onClick={handleAddItem}
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

      <Modal
        isOpen={isAddProdutModalOpen}
        onRequestClose={handleCloseAddProductModal}
        contentLabel="Add new Product"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            border: "none",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "40%",
            margin: "auto",
            height: "70%",
            zIndex: 1001,
            overflowY: "auto",
          },
        }}
      >
        <div className="customerClass">
          <h2 className="customerClassTitle">Add New Product to Stock</h2>
          <div className="mt-[16px]">
            <form>
              <div className="flex-col space-y-8">
                <div className="dialogAddCustomerItem items-center">
                  <span>Product Name :</span>
                  <div className="inputForm">
                    <input type="text" name="productName" />
                  </div>
                </div>
                <div className="dialogAddCustomerItem items-center">
                  <span>Product Size :</span>
                  <div className="inputForm">
                    <input type="text" name="productName" />
                  </div>
                </div>
                <div className="dialogAddCustomerItem items-center">
                  <span>BoxItems :</span>
                  <div className="inputForm">
                    <input type="number" name="productName" />
                  </div>
                </div>
                <div className="dialogAddCustomerItem items-center">
                  <span>Product Category :</span>
                  <div className="selectStoreWilayaCommune w-[500px]">
                    <select name="productCategory">
                      <option value="">-- Select Product Category --</option>
                      {/* {CategoryData?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))} */}
                    </select>
                  </div>
                </div>
                <div className="dialogAddCustomerItem items-center">
                  <span>Product Brand :</span>
                  <div className="selectStoreWilayaCommune w-[500px]">
                    <select name="productCategory">
                      <option value="">-- Select Product Brand --</option>
                      {/* {BrandData?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))} */}
                    </select>
                  </div>
                </div>
                <div className="dialogAddCustomerItem items-center">
                  <span>Product Picture :</span>
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-[80px] h-[80px] bg-slate-200 rounded-full cursor-pointer flex items-center justify-center relative overflow-hidden"
                      onClick={handleClick}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <PhotoIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="h-[80px] w-[404px] flex items-center justify-center uploadClass">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                      />
                      <p onClick={handleClick} className="uploadSpan">
                        <span className="text-blue-600">Click to upload </span>
                        or drag and drop SVG, PNG, JPG
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-8 bottom-5 right-8 absolute">
                <button
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={handleCloseAddProductModal}
                >
                  Cancel
                </button>
                <input
                  type="button"
                  value={"Save"}
                  className="text-blue-500 cursor-pointer hover:text-blue-700"
                  // onClick={handleSavePRODUCT}
                />
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isRemiseModalOpen}
        onRequestClose={handleCloseAddProductModal}
        contentLabel="Add Remise"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            border: "none",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "40%",
            margin: "auto",
            height: "fit-content",
            zIndex: 1001,
            overflowY: "auto",
          },
        }}
      >
        <div className="customerClass pb-0">
          <h2 className="customerClassTitle">Add Remise</h2>
          <div className="mt-[16px]">
            <form>
              <div className="flex-col space-y-8">
                <div className="dialogAddCustomerItem items-center">
                  <span>Remise Value :</span>
                  <div className="inputForm relative">
                    <input type="text" name="remise" className="pr-10" />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-8 mt-[20px]">
                <button
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={handleRemiseCloseModal}
                >
                  Cancel
                </button>
                <input
                  type="button"
                  value={"Save"}
                  className="text-blue-500 cursor-pointer hover:text-blue-700"
                  // onClick={handleSavePRODUCT}
                />
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
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
