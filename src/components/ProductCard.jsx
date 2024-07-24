import React from "react";

export default function ProductCard({ productName, productImage }) {
  return (
    <div className="productCard">
      <div className="productImage">
        <img src={productImage} alt={productName} />
      </div>
      <div className="productName">
        <span className="productSpan">{productName}</span>
      </div>
    </div>
  );
}
