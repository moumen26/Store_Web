import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

import Logo from "../assets/Logo-mosagro.png"; // Adjust the path as necessary

export default function PurchasePDFTemplate({
  purchaseData,
  sousPurchaseData,
  language,
}) {
  const barcodeRef = useRef(null);

  // Generate barcode when component mounts
  useEffect(() => {
    if (barcodeRef.current && purchaseData?._id) {
      try {
        JsBarcode(barcodeRef.current, purchaseData._id, {
          format: "CODE128",
          width: 3,
          height: 80,
          displayValue: true,
          fontSize: 14,
          margin: 5,
        });
      } catch (error) {
        console.warn("Could not generate barcode:", error);
      }
    }
  }, [purchaseData?._id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-DZ" : "fr-FR");
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-DZ" : "fr-FR").format(
      number
    );
  };

  const calculateTotal = (products, discount = 0) => {
    const subtotal = products.reduce((sum, product) => {
      return sum + product.quantity * product.price;
    }, 0);
    return subtotal - discount;
  };

  const calculateBoxDisplay = (item, language) => {
    if (!item?.sousStock?.stock?.product?.boxItems) return "";

    let totalBoxes = item.quantity / item.sousStock.stock.product.boxItems;
    const decimalPart = totalBoxes % 1;
    let remainingItems = 0;

    if (decimalPart === 0.5) {
      totalBoxes = Math.floor(totalBoxes) + 0.5;
    } else {
      totalBoxes = Math.floor(totalBoxes);
      remainingItems = item.quantity % item.sousStock.stock.product.boxItems;
    }

    if (totalBoxes < 1) {
      totalBoxes = 0;
    }

    const boxText =
      language === "ar"
        ? `${
            totalBoxes > 0
              ? `${totalBoxes} ${totalBoxes === 1 ? "علبة" : "علب"}`
              : ""
          }`
        : `${
            totalBoxes > 0
              ? `${totalBoxes} ${totalBoxes === 1 ? "boîte" : "boîtes"}`
              : ""
          }`;

    const itemsText =
      language === "ar"
        ? `${
            remainingItems > 0
              ? ` ${remainingItems} ${remainingItems === 1 ? "قطعة" : "قطع"}`
              : ""
          }`
        : `${
            remainingItems > 0
              ? ` ${remainingItems} ${
                  remainingItems === 1 ? "pièce" : "pièces"
                }`
              : ""
          }`;

    return `${boxText}${
      totalBoxes > 0 && remainingItems > 0 ? "+" : ""
    }${itemsText}`;
  };

  return (
    <div
      id="pdf-template"
      style={{
        fontFamily:
          language === "ar" ? "Cairo-Regular, sans-serif" : "Arial, sans-serif",
        direction: language === "ar" ? "rtl" : "ltr",
        padding: "10px 30px",
        backgroundColor: "white",
        color: "black",
        fontSize: "11px",
        lineHeight: "1.4",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {/* Header with Logo and Barcode */}
      <div
        style={{
          marginBottom: "30px",
        }}
      >
        {/* Logo and Barcode row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo on the left */}
          <div
            style={{
              flex: "0 0 auto",
            }}
          >
            <img
              src={Logo}
              alt="Company Logo"
              style={{
                maxHeight: "80px",
                maxWidth: "200px",
                height: "auto",
                width: "auto",
              }}
            />
          </div>

          {/* Barcode on the right */}
          {/* <div
            style={{
              flex: "0 0 auto",
            }}
          >
            {purchaseData?._id && (
              <canvas
                ref={barcodeRef}
                style={{
                  maxWidth: "250px",
                  minHeight: "50px",
                  height: "auto",
                }}
              />
            )}
          </div> */}
        </div>

        {/* Title row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {/* Title */}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              paddingTop: "10px",
            }}
          >
            <h1
              style={{
                margin: "0 0 15px 0",
                fontSize: "24px",
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
                fontWeight: "bold",
                color: "#0d3a71",
              }}
            >
              {language === "ar" ? "فاتورة شراء" : "Bon d'Achat"}
            </h1>
            <div
              style={{
                width: "100px",
                height: "3px",
                backgroundColor: "#0d3a71",
                margin: "10px auto",
                borderRadius: "2px",
              }}
            ></div>
          </div>
        </div>

        {/* Purchase Number and Date */}
        <div
          style={{
            fontSize: "14px",
            color: "#666",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "رقم الفاتورة:" : "N° Facture:"} #
            {purchaseData?._id}
          </span>
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "التاريخ:" : "Date:"}{" "}
            {formatDate(purchaseData?.createdAt)}
          </span>
        </div>
      </div>

      {/* Purchase and Supplier Info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginBottom: "30px",
        }}
      >
        {/* Purchase Details */}
        <div>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "3px",
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "تفاصيل الشراء" : "DÉTAILS D'ACHAT"}
          </div>
          <div
            style={{
              marginBottom: "2px",
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            <strong
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "المجموع الكلي:" : "Montant Total:"}
            </strong>{" "}
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {formatNumber(purchaseData?.totalAmount)}{" "}
              {language === "ar" ? "دج" : "DA"}
            </span>
          </div>

          <div style={{ marginBottom: "2px" }}>
            <strong
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "الخصم:" : "Remise:"}
            </strong>{" "}
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {purchaseData?.discount || 0}%
            </span>
          </div>

          <div style={{ marginBottom: "2px" }}>
            <strong
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "الحالة:" : "Statut:"}
            </strong>{" "}
            <span
              style={{
                color: purchaseData?.closed ? "#22c55e" : "#ef4444",
                fontWeight: "bold",
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {purchaseData?.closed
                ? language === "ar"
                  ? "مدفوع"
                  : "Payé"
                : language === "ar"
                ? "غير مدفوع"
                : "Non payé"}
            </span>
          </div>

          <div style={{ fontSize: "10px" }}>
            <strong
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "نوع الدفع:" : "Type de paiement:"}
            </strong>{" "}
            <span
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {purchaseData?.deposit
                ? language === "ar"
                  ? "عربون"
                  : "Acompte"
                : purchaseData?.credit
                ? language === "ar"
                  ? "آجل"
                  : "Crédit"
                : language === "ar"
                ? "نقدي"
                : "Comptant"}
            </span>
          </div>
        </div>

        {/* Supplier Details */}
        <div style={{ textAlign: language === "ar" ? "left" : "right" }}>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "3px",
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "معلومات المورد" : "INFORMATIONS FOURNISSEUR"}
          </div>
          <div style={{ marginBottom: "2px" }}>
            <strong
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "الاسم:" : "Nom:"}
            </strong>{" "}
            {purchaseData?.fournisseur?.firstName}{" "}
            {purchaseData?.fournisseur?.lastName}
          </div>
          <div style={{ marginBottom: "2px" }}>
            <strong
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "الهاتف:" : "Téléphone:"}
            </strong>{" "}
            {purchaseData?.fournisseur?.phoneNumber || "N/A"}
          </div>

          <div style={{ fontSize: "10px" }}>
            <strong
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "العنوان:" : "Adresse:"}
            </strong>{" "}
            {purchaseData?.fournisseur?.commune} -{" "}
            {purchaseData?.fournisseur?.wilaya}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div style={{ marginBottom: "30px" }}>
        {sousPurchaseData?.map((sousPurchase, index) => {
          const products = sousPurchase?.sousStocks || [];
          const subtotal = products.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          );

          return (
            <div key={sousPurchase._id} style={{ marginBottom: "20px" }}>
              {sousPurchaseData.length > 1 && (
                <h4
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "14px",
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    color: "#666",
                  }}
                >
                  {language === "ar"
                    ? `الجزء ${index + 1}`
                    : `Partie ${index + 1}`}
                </h4>
              )}

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #ddd",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                        backgroundColor: "#0d3a71",
                        color: "white",
                        padding: "8px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        textAlign: "center",
                        border: "1px solid #0d3a71",
                        width: "60px",
                      }}
                    >
                      {language === "ar" ? "الكمية" : "Quantité"}
                    </th>
                    <th
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                        backgroundColor: "#0d3a71",
                        color: "white",
                        padding: "8px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        textAlign: language === "ar" ? "right" : "left",
                        border: "1px solid #0d3a71",
                      }}
                    >
                      {language === "ar" ? "الوصف" : "Description"}
                    </th>
                    <th
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                        backgroundColor: "#0d3a71",
                        color: "white",
                        padding: "8px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        textAlign: "center",
                        border: "1px solid #0d3a71",
                        width: "100px",
                      }}
                    >
                      {language === "ar" ? "سعر الوحدة" : "Prix unitaire"}
                    </th>
                    <th
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                        backgroundColor: "#0d3a71",
                        color: "white",
                        padding: "8px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        textAlign: "center",
                        border: "1px solid #0d3a71",
                        width: "140px",
                      }}
                    >
                      {language === "ar" ? "المجموع" : "Total"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <td
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "10px",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: language === "ar" ? "right" : "left",
                          fontSize: "10px",
                        }}
                      >
                        <div
                          style={{ fontWeight: "bold", marginBottom: "2px" }}
                        >
                          {item?.sousStock?.stock?.product?.name || "N/A"}
                        </div>
                        {item?.sousStock?.stock?.product?.size && (
                          <div style={{ fontSize: "9px", color: "#666" }}>
                            {item.sousStock.stock.product.size}
                          </div>
                        )}
                        {calculateBoxDisplay(item, language) && (
                          <div
                            style={{
                              fontSize: "9px",
                              color: "#666",
                              fontStyle: "italic",
                            }}
                          >
                            ({calculateBoxDisplay(item, language)})
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "10px",
                        }}
                      >
                        {formatNumber(item.price)}{" "}
                        {language === "ar" ? "دج" : "DA"}
                      </td>
                      <td
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "10px",
                        }}
                      >
                        {formatNumber(item.quantity * item.price)}{" "}
                        {language === "ar" ? "دج" : "DA"}
                      </td>
                    </tr>
                  ))}

                  {/* Add empty rows to fill space */}
                  {Array.from(
                    { length: Math.max(0, 6 - products.length) },
                    (_, index) => (
                      <tr key={`empty-${index}`}>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f8f9fa",
                          }}
                        ></td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f8f9fa",
                          }}
                        ></td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f8f9fa",
                          }}
                        ></td>
                        <td
                          style={{
                            padding: "12px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f8f9fa",
                          }}
                        ></td>
                      </tr>
                    )
                  )}

                  {/* Subtotal Row */}
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: language === "ar" ? "right" : "left",
                        fontWeight: "bold",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      {language === "ar" ? "المجموع الفرعي:" : "SOUS-TOTAL"}
                    </td>
                    <td
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {formatNumber(subtotal)} {language === "ar" ? "دج" : "DA"}
                    </td>
                  </tr>

                  {/* Discount Row (if applicable) */}
                  {purchaseData?.discount > 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: language === "ar" ? "right" : "left",
                          fontWeight: "bold",
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        {language === "ar" ? "الخصم:" : "REMISE"}
                      </td>
                      <td
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#ef4444",
                        }}
                      >
                        -{formatNumber(purchaseData.discount)}{" "}
                        {language === "ar" ? "دج" : "DA"}
                      </td>
                    </tr>
                  )}

                  {/* Final Total Row */}
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                        border: "1px solid #ddd",
                        padding: "12px 8px",
                        textAlign: language === "ar" ? "right" : "left",
                        fontWeight: "bold",
                        fontSize: "12px",
                        backgroundColor: "#0d3a71",
                        color: "white",
                      }}
                    >
                      {language === "ar" ? "المجموع الكلي:" : "TOTAL TTC"}
                    </td>
                    <td
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                        border: "1px solid #ddd",
                        padding: "12px 8px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "14px",
                        backgroundColor: "#0d3a71",
                        color: "white",
                      }}
                    >
                      {formatNumber(subtotal - (purchaseData?.discount || 0))}{" "}
                      {language === "ar" ? "دج" : "DA"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* Payment History */}
      {purchaseData?.payment && purchaseData.payment.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              margin: "0 0 15px 0",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#0d3a71",
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "سجل الدفعات" : "Historique des Paiements"}
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    backgroundColor: "#0d3a71",
                    color: "white",
                    padding: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
                    border: "1px solid #0d3a71",
                  }}
                >
                  {language === "ar" ? "التاريخ" : "Date"}
                </th>
                <th
                  style={{
                    backgroundColor: "#0d3a71",
                    color: "white",
                    padding: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontFamily:
                      language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    border: "1px solid #0d3a71",
                  }}
                >
                  {language === "ar" ? "المبلغ" : "Montant"}
                </th>
              </tr>
            </thead>
            <tbody>
              {purchaseData.payment.map((payment, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {formatDate(payment.date)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      fontWeight: "bold",
                    }}
                  >
                    {formatNumber(payment.amount)}{" "}
                    {language === "ar" ? "دج" : "DA"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              textAlign: language === "ar" ? "left" : "right",
              marginTop: "10px",
              fontSize: "14px",
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            <div style={{ marginBottom: "5px" }}>
              <strong
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar" ? "إجمالي المدفوع:" : "Total Payé:"}{" "}
                {formatNumber(
                  purchaseData.payment.reduce((sum, pay) => sum + pay.amount, 0)
                )}{" "}
                {language === "ar" ? "دج" : "DA"}
              </strong>
            </div>
            <div
              style={{
                color: "#ef4444",
                fontWeight: "bold",
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "المتبقي:" : "Reste à payer:"}{" "}
              {formatNumber(
                purchaseData.totalAmount -
                  purchaseData.payment.reduce((sum, pay) => sum + pay.amount, 0)
              )}{" "}
              {language === "ar" ? "دج" : "DA"}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          borderTop: "3px solid #0d3a71",
          paddingTop: "10px",
          marginTop: "10px",
          backgroundColor: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
          position: "absolute",
          bottom: "20px",
          left: "0",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <div
            style={{ flex: 1, textAlign: language === "ar" ? "right" : "left" }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#666",
                fontStyle: "italic",
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar"
                ? `تاريخ الطباعة: ${new Date().toLocaleDateString("ar-DZ")}`
                : `Date d'impression: ${new Date().toLocaleDateString(
                    "fr-FR"
                  )}`}
            </div>
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
                color: "#0d3a71",
              }}
            >
              {language === "ar" ? "شكراً لثقتكم" : "Merci de votre confiance"}
            </div>
          </div>

          <div
            style={{ flex: 1, textAlign: language === "ar" ? "left" : "right" }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#0d3a71",
                fontWeight: "bold",
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "موزاجرو" : "MOSAGRO"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
