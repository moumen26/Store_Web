import React from "react";

export default function ProductCard({
  productName,

  productQuantity = "",
  productPrice = "",
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
      <div className="productName flex-col items-center space-y-1">
        <span
          style={{
            fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
          }}
          className="productSpan text-center"
        >
          {productName}
        </span>

        {productQuantity && (
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
            className="productSpan"
          >
            {productQuantity} unity
          </span>
        )}
        {productPrice && (
          <span
            className="productSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {productPrice} DA
          </span>
        )}
      </div>
    </div>
  );
}
