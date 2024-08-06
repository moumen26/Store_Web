import React, { useState } from "react";
import ProductCard from "./ProductCard";
import ElioImage from "../assets/images/Elio.png";
import PrilImage from "../assets/images/Pril.png";

const allProducts = [
  {
    id: "0920496",
    name: "Elio - 1L",
    brand: "Cevital",
    image: ElioImage,
    price: 120,
  },
  {
    id: "0920490",
    name: "Pril Isis - 650mL",
    brand: "Pril",
    image: PrilImage,
    price: 170,
  },
];

export default function ProductsContainer({ searchQuery, onSelectProduct }) {
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleSelectProduct = (product) => {
    setSelectedProductId(product.id);
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
            selected={product.id === selectedProductId}
          />
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}
