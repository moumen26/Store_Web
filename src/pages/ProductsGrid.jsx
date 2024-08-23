import React, { useRef, useState } from "react";
import Header from "../components/Header";
import ButtonAdd from "../components/ButtonAdd";
import Search from "../components/Search";
import ProductsContainer from "../components/ProductsContainer";
import Modal from "react-modal";
import CircularProgress from "@mui/material/CircularProgress";
import ProductCard from "../components/ProductCard";
import ElioImage from "../assets/images/Elio.png";
import PrilImage from "../assets/images/Pril.png";
import { PhotoIcon } from "@heroicons/react/16/solid";

// Example product data
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
];

// Set the app element for accessibility
Modal.setAppElement("#root");

export default function ProductsGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false); // New state for the add product modal
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter products based on search query
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const handleCloseAddProductModal = () => {
    setIsAddProductModalOpen(false);
  };

  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Products Grid</h2>
        <ButtonAdd buttonSpan="Add New Product" onClick={handleOpenModal} />
      </div>
      <div className="pageTable">
        <div className="w-full flex items-center justify-between">
          <Search
            placeholder="Search by Product..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="pageTableContainer">
          <ProductsContainer
            searchQuery={searchQuery}
            onProductClick={handleSelectProduct}
          />
        </div>
      </div>
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
              <h2 className="customerClassTitle">Add Product</h2>
              <div className="flex justify-between items-center">
                <Search
                  placeholder="Search by Product..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <ButtonAdd
                  buttonSpan="Add New Product To Stock"
                  onClick={handleOpenAddProductModal}
                />
              </div>
            </div>
            <div className="productsContainer h-[78%]">
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
          </>
        )}
        <div className="flex justify-end space-x-8 pr-8 items-start">
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
      {/* New Modal for Adding Product */}
      <Modal
        isOpen={isAddProductModalOpen}
        onRequestClose={handleCloseAddProductModal}
        contentLabel="Add New Product"
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
            height: "45%",
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
                  <span>Product Brand :</span>
                  <div className="inputForm">
                    <input type="text" name="productName" />
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

              <div className="flex justify-end space-x-8 absolute bottom-5 right-8">
                <button
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                  onClick={handleCloseAddProductModal}
                >
                  Cancel
                </button>
                <button className="text-blue-500 cursor-pointer hover:text-blue-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
