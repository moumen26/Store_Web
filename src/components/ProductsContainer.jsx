import React, { useState } from "react";
import ProductCard from "./ProductCard";
import Modal from "react-modal";
import ProductProfileDetails from "./ProductProfileDetails";
import ProductHistorique from "./ProductHistorique";
import ButtonAdd from "./ButtonAdd";

// Set the app element for accessibility
Modal.setAppElement("#root"); // or the ID of your root element

export default function ProductsContainer({
  searchQuery,
  data,
  selectedCategory,
  language,
}) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      {data?.length > 0 ? (
        <div className="productsContainer">
          {data
            ?.filter(
              (product) =>
                (product.code
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                  product.name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  product.brand?.name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  product.category?.name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())) &&
                (selectedCategory === "" ||
                  product.category?._id === selectedCategory)
            )
            .map((product) => (
              <ProductCard
                key={product._id}
                productName={
                  product.brand?.name + " " + product.name + " " + product.size
                }
                productImage={`${import.meta.env.VITE_APP_FILES_URL}/${
                  product.image
                }`}
                onClick={() => handleSelectProduct(product)}
                selected={
                  selectedProduct && product._id === selectedProduct._id
                }
              />
            ))}
        </div>
      ) : (
        <div className="productsContainerSpan">
          <span
            className="thTableSpan"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar"
              ? "لا توجد منتجات متاحة"
              : "Aucun produit disponible"}
          </span>
        </div>
      )}

      {selectedProduct && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel={language === "ar" ? "تفاصيل المنتج" : "Product Details"}
          className="productModal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
            },
          }}
        >
          <div
            className="customerClass paddingClass px-4 sm:px-6 lg:px-8"
            style={{ direction: language === "ar" ? "rtl" : "ltr" }}
          >
            <h2
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="customerClassTitle text-lg sm:text-xl lg:text-2xl"
            >
              {language === "ar" ? "تفاصيل المنتج" : "Détails du Produit"}
            </h2>

            {/* Image Container - Responsive height */}
            <div className="w-full flex justify-center h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] mt-4">
              <img
                className="text-center object-contain"
                srcSet={`${import.meta.env.VITE_APP_FILES_URL}/${
                  selectedProduct.image
                }`}
                src={`${import.meta.env.VITE_APP_FILES_URL}/${
                  selectedProduct.image
                }`}
                alt={selectedProduct.name}
                style={{ width: "auto", height: "100%" }}
              />
            </div>

            {/* Product Details Grid - Responsive */}
            <div className="flex-col space-y-3 mt-4">
              {/* Product Code */}
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] lg:grid-cols-[180px_1fr] gap-2 sm:gap-3">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="thTableSpan text-sm sm:text-base font-semibold sm:font-normal"
                >
                  {language === "ar" ? "رمز المنتج" : "Code du Produit"}
                </span>
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="trTableSpan text-sm sm:text-base break-all sm:break-normal"
                >
                  {selectedProduct._id}
                </span>
              </div>

              {/* Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] lg:grid-cols-[180px_1fr] gap-2 sm:gap-3">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="thTableSpan text-sm sm:text-base font-semibold sm:font-normal"
                >
                  {language === "ar" ? "اسم" : "Designation"}
                </span>
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="trTableSpan text-sm sm:text-base break-words"
                >
                  {selectedProduct.name} {selectedProduct.size}
                </span>
              </div>

              {/* Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] lg:grid-cols-[180px_1fr] gap-2 sm:gap-3">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="thTableSpan text-sm sm:text-base font-semibold sm:font-normal"
                >
                  {language === "ar" ? "ماركة" : "Marque"}
                </span>
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="trTableSpan text-sm sm:text-base break-words"
                >
                  {selectedProduct.brand.name}
                </span>
              </div>

              {/* Box Items */}
              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] md:grid-cols-[150px_1fr] lg:grid-cols-[180px_1fr] gap-2 sm:gap-3">
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="thTableSpan text-sm sm:text-base font-semibold sm:font-normal"
                >
                  {language === "ar" ? "عناصر لكل صندوق" : "Articles par Boîte"}
                </span>
                <span
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                  }}
                  className="trTableSpan text-sm sm:text-base"
                >
                  {selectedProduct.boxItems}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseModal}
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
                className="text-gray-500 cursor-pointer hover:text-gray-700 text-sm sm:text-base px-4 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                {language === "ar" ? "إغلاق" : "Fermer"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
