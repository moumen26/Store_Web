import React from "react";
import ProductCard from "./ProductCard";

import ElioImage from "../assets/images/Elio.png";

const products = [
  { id: 1, name: "Elio - 1L", image: ElioImage },
  { id: 2, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
  { id: 3, name: "Elio - 1L", image: ElioImage },
];

export default function ProductsContainer() {
  return (
    <div className="productsContainer">
      {products.length > 0 ? (
        products.map((product) => (
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
