import React, { useState } from "react";
import ProductCard from "./ProductCard";
import ElioImage from "../assets/images/Elio.png";
import PrilImage from "../assets/images/Pril.png";
import Modal from "react-modal";
import ProductProfileDetails from "./ProductProfileDetails";
import ProductHistorique from "./ProductHistorique";
import ButtonAdd from "./ButtonAdd";

// Set the app element for accessibility
Modal.setAppElement("#root"); // or the ID of your root element

export default function ProductsContainer({ searchQuery, onSelectProduct, data, selectedCategory }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    onSelectProduct(product);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  return (
    <div className="productsContainer">
      {data?.length > 0 ? (
        data?.filter((product) =>
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
            productName={product.brand?.name + ' ' + product.name + ' ' + product.size}
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

      {selectedProduct && (
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
              zIndex: 1001,

              height: "80%",
            },
          }}
        >
          <div className="customerClass">
            <h2 className="customerClassTitle">Product Details</h2>
            <ProductProfileDetails data={selectedProduct} />
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
                  srcSet={`${import.meta.env.VITE_APP_URL_BASE.replace('/api', '')}/files/${selectedProduct.image}`}
                  src={`${import.meta.env.VITE_APP_URL_BASE.replace('/api', '')}/files/${selectedProduct.image}`}
                  alt={selectedProduct.name}
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
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
