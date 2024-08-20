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

const allProducts = [
  {
    id: "0920496",
    name: "Elio - 1L",
    brand: "Cevital",
    image: ElioImage,
    sellPrice: 120,
    buyingPrice: 120,
    stock: 200,
    boxItems: 12,
  },
  {
    id: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    sellPrice: 170,
    buyingPrice: 200,
    boxItems: 24,
  },
];

export default function ProductsContainer({ searchQuery, onSelectProduct }) {
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

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="productsContainer">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            productName={product.name}
            productImage={product.image}
            onClick={() => handleSelectProduct(product)}
            selected={selectedProduct && product.id === selectedProduct.id}
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
            },
            content: {
              border: "none",
              borderRadius: "8px",
              padding: "20px",
              maxWidth: "90%",
              margin: "auto",
              height: "80%",
            },
          }}
        >
          <div className="customerClass">
            <h2 className="customerClassTitle">Product Details</h2>
            <ProductProfileDetails product={selectedProduct} />
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
                  src={selectedProduct.image}
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
              className="text-gray-500 cursor-pointer hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
