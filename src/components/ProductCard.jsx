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
        <img 
          srcSet={productImage}
          src={productImage} 
          alt={productName} 
          loading="lazy"
        />
      </div>
      <div className="productName">
        <span className="productSpan">{productName}</span>
      </div>
    </div>
  );
}
