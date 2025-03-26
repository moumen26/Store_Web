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
                productImage={`${import.meta.env.VITE_APP_URL_BASE.replace(
                  "/api",
                  ""
                )}/files/${product.image}`}
                onClick={() => handleSelectProduct(product)}
                selected={
                  selectedProduct && product._id === selectedProduct._id
                }
              />
            ))}
        </div>
      ) : (
        <div className="productsContainerSpan">
          <span className="thTableSpan">
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
            className="customerClass paddingClass"
            style={{ direction: language === "ar" ? "rtl" : "ltr" }}
          >
            <h2 className="customerClassTitle">
              {language === "ar" ? "تفاصيل المنتج" : "Détails du Produit"}
            </h2>
            <div className="w-full flex justify-center h-[300px]">
              <img
                className="text-center"
                srcSet={`${import.meta.env.VITE_APP_URL_BASE.replace(
                  "/api",
                  ""
                )}/files/${selectedProduct.image}`}
                src={`${import.meta.env.VITE_APP_URL_BASE.replace(
                  "/api",
                  ""
                )}/files/${selectedProduct.image}`}
                alt={selectedProduct.name}
                style={{ width: "auto", height: "100%" }}
              />
            </div>
            <div className="flex-col space-y-3 mt-4">
              <div
                className={`flex space-x-3 ${
                  language === "ar" ? "gap-x-3" : ""
                }`}
              >
                <span className="thTableSpan">
                  {language === "ar" ? "رمز المنتج" : "Code du Produit"}
                </span>
                <span className="trTableSpan">{selectedProduct._id}</span>
              </div>
              <div
                className={`flex space-x-3 ${
                  language === "ar" ? "gap-x-3" : ""
                }`}
              >
                {" "}
                <span className="thTableSpan">
                  {language === "ar" ? "اسم" : "Nom"}
                </span>
                <span className="trTableSpan">
                  {selectedProduct.name} {selectedProduct.size}
                </span>
              </div>
              <div
                className={`flex space-x-3 ${
                  language === "ar" ? "gap-x-3" : ""
                }`}
              >
                {" "}
                <span className="thTableSpan">
                  {language === "ar" ? "ماركة" : "Marque"}
                </span>
                <span className="trTableSpan">
                  {selectedProduct.brand.name}
                </span>
              </div>
              <div
                className={`flex space-x-3 ${
                  language === "ar" ? "gap-x-3" : ""
                }`}
              >
                {" "}
                <span className="thTableSpan">
                  {language === "ar" ? "عناصر لكل صندوق" : "Articles par Boîte"}
                </span>
                <span className="trTableSpan">{selectedProduct.boxItems}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="text-gray-500 cursor-pointer hover:text-gray-700 mt-[20px]"
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
