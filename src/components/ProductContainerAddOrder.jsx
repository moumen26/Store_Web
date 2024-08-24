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
    code: "0920490",
    subName: "Pril 650mL",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    sellPrice: 170,
    sellPrice: 170,
    buyingPrice: 200,
    boxItems: 24,
    stock: 100,
  },
];

export default function ProductsContainerAddOrder({ searchQuery, onSelectProduct }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    onSelectProduct(product);
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
    </div>
  );
}
