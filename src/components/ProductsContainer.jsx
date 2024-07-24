import React from "react";
import ProductCard from "./ProductCard";
import ElioImage from "../assets/images/Elio.png";
import PrilImage from "../assets/images/Pril.png";

const allProducts = [
  { id: 1, name: "Elio - 1L", image: ElioImage },
  { id: 2, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Pril - 650mL", image: PrilImage },
];

export default function ProductsContainer({ searchQuery }) {
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
          />
        ))
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
}
