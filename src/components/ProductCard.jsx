import React from "react";

export default function ProductCard({
  productName,
  productImage,
  onClick,
  selected,
}) {
  return (
    <div
      className={`productCard ${selected ? "selected" : ""}`} 
      onClick={onClick}
    >
      <div className="productImage">
        <img src={productImage} alt={productName} />
      </div>
      <div className="productName">
        <span className="productSpan">{productName}</span>
      </div>
    </div>
  );
}
