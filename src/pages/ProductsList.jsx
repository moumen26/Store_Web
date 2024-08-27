import React, { useState } from "react";
import Header from "../components/Header";
import ButtonAdd from "../components/ButtonAdd";
import Search from "../components/Search";
import ButtonExportExel from "../components/ButtonExportExel";
import ProductTable from "../components/ProductTable";
import Modal from "react-modal";
import CircularProgress from "@mui/material/CircularProgress";
import ProductCard from "../components/ProductCard";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ElioImage from "../assets/images/Elio.png";
import PrilImage from "../assets/images/Pril.png";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuthContext";
import { Alert, Snackbar } from "@mui/material";
import { TokenDecoder } from "../util/DecodeToken";
import axios from "axios";

Modal.setAppElement("#root");

export default function ProductsList() {
  const { user } = useAuthContext();
  const decodedToken = TokenDecoder();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertType, setAlertType] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('');
  const [submitionLoading, setSubmitionLoading] = useState(false);
  const handleSelectedCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  }
  const [productState, setProductState] = useState({
    buyingByUnit: false,
    buyingByBox: false,
    addToProposedList: false,
  });

  //product form
  const [BuyingPrice, setBuyingPrice] = useState("");
  const handleBuyingPriceChange = (e) => {
    setBuyingPrice(e.target.value);
  }
  const [SellingPrice, setSellingPrice] = useState("");
  const handleSellingPriceChange = (e) => {
    setSellingPrice(e.target.value);
  }
  const [Quantity, setQuantity] = useState("");
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  }
  const [LimitedQuantity, setLimitedQuantity] = useState("");
  const handleLimitedQuantityChange = (e) => {
    setLimitedQuantity(e.target.value);
  }
  const [ExparationDate, setExparationDate] = useState("");
  const handleExparationDateChange = (e) => {
    setExparationDate(e.target.value);
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCheckboxChange = (event) => {
    setProductState({
      ...productState,
      [event.target.name]: event.target.checked,
    });
  };

  //---------------------------------API calls---------------------------------\\

  // fetching Stock data
  const fetchStockData = async () => {
    const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/Stock/store/${decodedToken.id}`,
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
        if(errorData.error.statusCode == 404)
            return [];
        else
            throw new Error("Error receiving Stock data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const { data: StockData, error: StockError, isLoading: StockLoading, refetch: StockRefetch } = useQuery({
      queryKey: ['StockData', user?.token],
      queryFn: fetchStockData,
      enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
      refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // fetching Product data
  const fetchProductData = async () => {
    const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/Product`,
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
        if(errorData.error.statusCode == 404)
            return [];
        else
            throw new Error("Error receiving Product data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const { data: ProductData, error: ProductError, isLoading: ProductLoading, refetch: ProductRefetch } = useQuery({
      queryKey: ['ProductData', user?.token],
      queryFn: fetchProductData,
      enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
      refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // fetching Category data
  const fetchCategoryData = async () => {
    const response = await fetch(import.meta.env.VITE_APP_URL_BASE+`/Category`,
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
        if(errorData.error.statusCode == 404)
            return [];
        else
            throw new Error("Error receiving Category data");
    }
    // Return the data
    return await response.json();
  };
  // useQuery hook to fetch data
  const { data: CategoryData, error: CategoryError, isLoading: CategoryLoading, refetch: CategoryRefetch } = useQuery({
      queryKey: ['CategoryData', user?.token],
      queryFn: fetchCategoryData,
      enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
      refetchOnWindowFocus: true, // Optional: prevent refetching on window focus
  });

  // Refetch data when user changes
  const handleRefetchDataChange = () => {
    StockRefetch();
    ProductRefetch();
    CategoryRefetch();
  }

  //save Stock API
  const handleSaveStock = async () => {
    try {
        setSubmitionLoading(true);
        const response = await axios.post(import.meta.env.VITE_APP_URL_BASE+`/Stock/create`, 
          {
            Product: selectedProduct?._id,
            Quantity: Quantity,
            LimitedQuantity: LimitedQuantity,
            Store: decodedToken.id,
            BuyingPrice: BuyingPrice,
            SellingPrice: SellingPrice,
            ExparationDate: ExparationDate,
            BuyingMathode: productState
          },
          {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              }
          }
        );
        if (response.status === 200) {
          setAlertType(false);
          setSnackbarMessage(response.data.message);
          setSnackbarOpen(true);
          handleRefetchDataChange();
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
          console.error("Error creating stock: No response received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error creating stock");
        }
    }
  };

  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Products Stock</h2>
        <ButtonAdd buttonSpan="Add New Stock" onClick={handleOpenModal} />
      </div>
      <div className="pageTable">
        <div className="w-full flex items-center justify-between">
          <Search
            placeholder="Search by Product..."
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Products" />
        </div>
        <div className="pageTableContainer">
          <ProductTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            STOCKData={StockData}
            isLoading={StockLoading}
            refetch={handleRefetchDataChange}
          />
        </div>
      </div>

      {/* Modal for adding new stock */}
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
            <div className="customerClass">
              <h2 className="customerClassTitle">Add New Stock</h2>
              <div className="addNewStockClass">
                <div className="w-full h-[600px] w-[75%]">
                  <div className="addProductModalHeader">
                    <Search
                      placeholder="Search by Product..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <div className="flex space-x-5 items-center">
                      <span>Category :</span>
                      <div className="selectStoreWilayaCommune w-[300px]">
                        <select name="productCategory" onChange={handleSelectedCategoryChange}>
                          <option value="" >-- Select Product Category --</option>
                          {CategoryData.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="productsContainer p-0 mt-5 h-[90%]">
                    {ProductData?.length > 0 ? (
                      ProductData?.filter((product) =>
                        (product.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())) &&
                        (
                          selectedCategory == '' || product.category?._id == selectedCategory
                        )
                      ).map((product) => (
                        <ProductCard
                          key={product._id}
                          productName={product.name}
                          productImage={`${import.meta.env.VITE_APP_URL_BASE.replace('/api', '')}/files/${product.image}`}
                          onClick={() => handleSelectProduct(product)}
                          selected={
                            selectedProduct && product._id === selectedProduct._id
                          }
                        />
                      ))
                    ) : (
                      <p>No products available</p>
                    )}
                  </div>
                </div>
                <div className="h-[600px] w-[25%] productDetailsStock">
                  <div className="dialogAddCustomerItem items-center">
                    <span>Buying Price :</span>
                    <div className="inputForm flex items-center">
                      <input type="number" name="buyingPrice" onChange={handleBuyingPriceChange}/>
                      <span className="ml-2">DA</span>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span>Selling Price :</span>
                    <div className="inputForm flex items-center">
                      <input type="number" name="sellingPrice" onChange={handleSellingPriceChange}/>
                      <span className="ml-2">DA</span>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span>Stock :</span>
                    <div className="inputForm">
                      <input type="number" name="stock" defaultValue={0} onChange={handleQuantityChange}/>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span>Limited value :</span>
                    <div className="inputForm">
                      <input type="number" name="stock" defaultValue={0} onChange={handleLimitedQuantityChange}/>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span>Exparation Date :</span>
                    <div className="inputForm">
                      <input type="date" name="ExparationDate" onChange={handleExparationDateChange}/>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span>Buying Method :</span>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={productState.buyingByUnit}
                          onChange={handleCheckboxChange}
                          name="buyingByUnit"
                        />
                      }
                      label={<span>Buying by Unit</span>}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={productState.buyingByBox}
                          onChange={handleCheckboxChange}
                          name="buyingByBox"
                        />
                      }
                      label={<span>Buying by Box</span>}
                    />
                  </div>
                  <div className="space-x-0 items-center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={productState.addToProposedList}
                          onChange={handleCheckboxChange}
                          name="addToProposedList"
                        />
                      }
                    />
                    <span>Add to Proposed List</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="flex justify-end space-x-8 items-start absolute bottom-5 right-8">
          <button
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={handleCloseModal}
          >
            Cancel
          </button>
          <button
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={handleSaveStock}
          >
            Save
          </button>
        </div>
      </Modal>
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
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
    </div>
  );
}
