import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

import Logo from "../assets/Logo-mosagro.png"; // Adjust the path as necessary

export default function OrderPDFTemplate({
  orderData,
  orderStatusData,
  language,
}) {
  const barcodeRef = useRef(null);

  // Generate barcode when component mounts
  useEffect(() => {
    if (barcodeRef.current && orderData?._id) {
      try {
        JsBarcode(barcodeRef.current, orderData._id, {
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
  }, [orderData?._id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ar" ? "ar-DZ" : "fr-FR");
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-DZ" : "fr-FR").format(
      number
    );
  };

  const getStatusText = (status, language = "fr") => {
    const statusMap = {
      "-2":
        language === "ar"
          ? "تم إلغاء الطلب من قبل المتجر"
          : "Annulé par le magasin",
      "-1":
        language === "ar"
          ? "تم إلغاء الطلب من قبل العميل"
          : "Annulé par le client",
      0: language === "ar" ? "في الانتظار" : "En attente",
      1: language === "ar" ? "قيد التحضير" : "En préparation",
      2: language === "ar" ? "جاهز للتسليم" : "Prêt pour livraison",
      3: language === "ar" ? "تم التسليم" : "Livré",
      4: language === "ar" ? "تم الإرجاع" : "Retourné",
      10: language === "ar" ? "مكتمل" : "Terminé",
    };
    return statusMap[status?.toString()] || statusMap["0"];
  };

  const calculateBoxDisplay = (item, language) => {
    if (!item?.product?.boxItems) return "";

    let totalBoxes = item.quantity / item.product.boxItems;
    const decimalPart = totalBoxes % 1;
    let remainingItems = 0;

    if (decimalPart === 0.5) {
      totalBoxes = Math.floor(totalBoxes) + 0.5;
    } else {
      totalBoxes = Math.floor(totalBoxes);
      remainingItems = item.quantity % item.product.boxItems;
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
          <div
            style={{
              flex: "0 0 auto",
            }}
          >
            {orderData?._id && (
              <canvas
                ref={barcodeRef}
                style={{
                  maxWidth: "250px",
                  minHeight: "50px",
                  height: "auto",
                }}
              />
            )}
          </div>
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
              {language === "ar" ? "فاتورة طلب" : "Bon de Commande"}
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

        {/* Order Number and Date */}
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
            {language === "ar" ? "رقم الطلب:" : "N° Commande:"} #
            {orderData?._id}
          </span>
          <span
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "التاريخ:" : "Date:"}{" "}
            {formatDate(orderData?.createdAt)}
          </span>
        </div>
      </div>

      {/* Order and Client Info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginBottom: "30px",
        }}
      >
        {/* Order Details */}
        <div>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "3px",
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "تفاصيل الطلب" : "DÉTAILS DE LA COMMANDE"}
          </div>
          <div style={{ marginBottom: "2px" }}>
            <strong
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "المجموع الكلي:" : "Montant Total:"}
            </strong>{" "}
            {formatNumber(orderData?.total)} {language === "ar" ? "دج" : "DA"}
          </div>

          <div>
            <strong
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
            >
              {language === "ar" ? "نوع التسليم:" : "Type de livraison:"}
            </strong>{" "}
            {orderData?.deliveredLocation
              ? language === "ar"
                ? "توصيل"
                : "Livraison"
              : language === "ar"
              ? "استلام"
              : "Retrait"}
          </div>
        </div>

        {/* Client Details */}
        <div style={{ textAlign: language === "ar" ? "left" : "right" }}>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "3px",
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "معلومات العميل" : "INFORMATIONS CLIENT"}
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
            {orderData?.client?.firstName} {orderData?.client?.lastName}
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
            {orderData?.client?.phoneNumber || "N/A"}
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
            {orderData?.client?.commune} - {orderData?.client?.wilaya}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div style={{ marginBottom: "30px" }}>
        {orderStatusData?.map((statusData, index) => {
          const products = statusData?.products || [];
          const subtotal = products.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          );

          return (
            <div key={index} style={{ marginBottom: "20px" }}>
              {orderStatusData.length > 1 && (
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
                          {item?.product?.name || "N/A"}
                        </div>
                        {item?.product?.size && (
                          <div style={{ fontSize: "9px", color: "#666" }}>
                            {item.product.size}
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

                  {/* Delivery Fee Row (if applicable) */}
                  {orderData?.deliveredLocation &&
                    orderData?.deliveryAmount > 0 && (
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
                          {language === "ar"
                            ? "مبلغ التوصيل:"
                            : "FRAIS DE LIVRAISON"}
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
                          }}
                        >
                          {formatNumber(orderData.deliveryAmount)}{" "}
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
                      {formatNumber(
                        subtotal + (orderData?.deliveryAmount || 0)
                      )}{" "}
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
      {orderData?.payment && orderData.payment.length > 0 && (
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
              {orderData.payment.map((payment, index) => (
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
                  orderData.payment.reduce((sum, pay) => sum + pay.amount, 0)
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
                orderData.total -
                  orderData.payment.reduce((sum, pay) => sum + pay.amount, 0)
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
