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

const allProducts = [
  {
    id: "1",
    code: "0920496",
    name: "Elio - 1L",
    brand: "Cevital",
    image: ElioImage,
    sellPrice: 120,
    buyingPrice: 120,
    stock: 200,
    boxItems: 12,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
  {
    id: "2",
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    buyingPrice: 200,
    stock: 100,
    boxItems: 24,
  },
];

Modal.setAppElement("#root");

export default function ProductsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productState, setProductState] = useState({
    buyingByUnit: true,
    buyingByBox: false,
    addToProposedList: false,
  });

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

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (event) => {
    setProductState({
      ...productState,
      [event.target.name]: event.target.checked,
    });
  };

  const productCatégories = [
    { value: "", label: "-- Select Product Category --" },
    { value: "cosmetique", label: "Cosmetique " },
    { value: "detergent", label: "Detergent" },
  ];
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
        {loadingProduct ? (
          <div className="w-full h-[93%] flex items-center justify-center">
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
                        <select name="productCategory">
                          {productCatégories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="productsContainer p-0 mt-5 h-[90%]">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          productName={product.name}
                          productImage={product.image}
                          onClick={() => handleSelectProduct(product)}
                          selected={
                            selectedProduct && product.id === selectedProduct.id
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
                    <span>Sub Name :</span>
                    <div className="inputForm">
                      <input type="text" name="subName" />
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span>Box Items :</span>
                    <div className="inputForm">
                      <input type="number" name="boxItems" defaultValue={1} />
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span>Buying Price :</span>
                    <div className="inputForm flex items-center">
                      <input type="number" name="buyingPrice" />
                      <span className="ml-2">DA</span>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span>Selling Price :</span>
                    <div className="inputForm flex items-center">
                      <input type="number" name="sellingPrice" />
                      <span className="ml-2">DA</span>
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span>Stock :</span>
                    <div className="inputForm">
                      <input type="number" name="stock" defaultValue={0} />
                    </div>
                  </div>
                  <div className="dialogAddCustomerItem items-center">
                    <span>Limited value :</span>
                    <div className="inputForm">
                      <input type="number" name="stock" defaultValue={0} />
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
            // onClick={}
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
