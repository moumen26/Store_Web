import React from "react";

export default function OrderPDFTemplate({
  orderData,
  orderStatusData,
  language,
}) {
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
      "-2": language === "ar" ? "تم إلغاء الطلب من قبل المتجر" : "Annulé par le magasin",
      "-1": language === "ar" ? "تم إلغاء الطلب من قبل العميل" : "Annulé par le client",
      "0": language === "ar" ? "في الانتظار" : "En attente",
      "1": language === "ar" ? "قيد التحضير" : "En préparation", 
      "2": language === "ar" ? "جاهز للتسليم" : "Prêt pour livraison",
      "3": language === "ar" ? "تم التسليم" : "Livré",
      "4": language === "ar" ? "تم الإرجاع" : "Retourné",
      "10": language === "ar" ? "مكتمل" : "Terminé",
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
          language === "ar" ? "Cairo, Arial, sans-serif" : "Arial, sans-serif",
        direction: language === "ar" ? "rtl" : "ltr",
        padding: "20px",
        backgroundColor: "white",
        color: "black",
        fontSize: "12px",
        lineHeight: "1.4",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
          borderBottom: "2px solid #333",
          paddingBottom: "15px",
        }}
      >
        <h1
          style={{
            margin: "0 0 10px 0",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {language === "ar" ? "فاتورة طلب" : "Facture de Commande"}
        </h1>
        <div
          style={{
            fontSize: "14px",
            color: "#666",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            {language === "ar" ? "رقم الطلب:" : "N° Commande:"} #
            {orderData?._id}
          </span>
          <span>
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
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        {/* Order Details */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "5px",
            backgroundColor: "#fafafa",
          }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#333",
              borderBottom: "1px solid #ddd",
              paddingBottom: "5px",
            }}
          >
            {language === "ar" ? "تفاصيل الطلب" : "Détails de la Commande"}
          </h3>

          <div style={{ marginBottom: "8px" }}>
            <strong>
              {language === "ar" ? "المجموع الكلي:" : "Montant Total:"}
            </strong>
            <span style={{ float: language === "ar" ? "left" : "right" }}>
              {formatNumber(orderData?.total)} {language === "ar" ? "دج" : "DA"}
            </span>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "حالة الطلب:" : "Statut:"}</strong>
            <span
              style={{
                float: language === "ar" ? "left" : "right",
                color:
                  orderData?.status === 10
                    ? "#22c55e"
                    : orderData?.status === -1
                    ? "#ef4444"
                    : "#f59e0b",
                fontWeight: "bold",
              }}
            >
              {getStatusText(orderData?.status)}
            </span>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "عربون:" : "Acompte:"}</strong>
            <span
              style={{
                float: language === "ar" ? "left" : "right",
                color: orderData?.deposit ? "#22c55e" : "#ef4444",
              }}
            >
              {orderData?.deposit
                ? language === "ar"
                  ? "نعم"
                  : "Oui"
                : language === "ar"
                ? "لا"
                : "Non"}
            </span>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "آجل:" : "Crédit:"}</strong>
            <span
              style={{
                float: language === "ar" ? "left" : "right",
                color: orderData?.credit ? "#22c55e" : "#ef4444",
              }}
            >
              {orderData?.credit
                ? language === "ar"
                  ? "نعم"
                  : "Oui"
                : language === "ar"
                ? "لا"
                : "Non"}
            </span>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>
              {language === "ar" ? "نوع التسليم:" : "Type de livraison:"}
            </strong>
            <span style={{ float: language === "ar" ? "left" : "right" }}>
              {orderData?.deliveredLocation
                ? language === "ar"
                  ? "توصيل"
                  : "Livraison"
                : language === "ar"
                ? "استلام"
                : "Retrait"}
            </span>
          </div>
        </div>

        {/* Client Details */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "5px",
            backgroundColor: "#fafafa",
          }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#333",
              borderBottom: "1px solid #ddd",
              paddingBottom: "5px",
            }}
          >
            {language === "ar" ? "العميل" : "Client"}
          </h3>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "الاسم:" : "Nom:"}</strong>
            <div>
              {orderData?.client?.firstName} {orderData?.client?.lastName}
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "الهاتف:" : "Téléphone:"}</strong>
            <div>{orderData?.client?.phoneNumber || "N/A"}</div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "العنوان:" : "Adresse:"}</strong>
            <div>
              {orderData?.deliveredLocation?.address ||
                (language === "ar" ? "استلام من المتجر" : "Retrait en magasin")}
            </div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "الولاية:" : "Wilaya:"}</strong>
            <div>
              {orderData?.client?.commune} - {orderData?.client?.wilaya}
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            margin: "0 0 15px 0",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {language === "ar" ? "المنتجات" : "Produits"}
        </h3>

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
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: language === "ar" ? "right" : "left",
                        fontWeight: "bold",
                      }}
                    >
                      {language === "ar" ? "المنتجات" : "Produits"}
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {language === "ar" ? "الكمية" : "Qté"}
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {language === "ar" ? "العلب" : "Boîtes"}
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {language === "ar" ? "الوحدة" : "Unité"}
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
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
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: language === "ar" ? "right" : "left",
                        }}
                      >
                        {item?.product?.name || "N/A"}
                        {item?.product?.size && (
                          <span> - {item.product.size}</span>
                        )}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {calculateBoxDisplay(item, language)}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        {formatNumber(item.price)}{" "}
                        {language === "ar" ? "دج" : "DA"}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        {formatNumber(item.quantity * item.price)}{" "}
                        {language === "ar" ? "دج" : "DA"}
                      </td>
                    </tr>
                  ))}

                  {/* Subtotal Row */}
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: language === "ar" ? "right" : "left",
                        fontWeight: "bold",
                      }}
                    >
                      {language === "ar" ? "المجموع الفرعي" : "Sous-total"}
                    </td>
                    <td
                      style={{
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
                          colSpan="4"
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: language === "ar" ? "right" : "left",
                            fontWeight: "bold",
                          }}
                        >
                          {language === "ar"
                            ? "مبلغ التوصيل"
                            : "Frais de livraison"}
                        </td>
                        <td
                          style={{
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
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <td
                      colSpan="4"
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: language === "ar" ? "right" : "left",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {language === "ar" ? "المجموع الكلي" : "Total général"}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "14px",
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
              color: "#333",
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
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {language === "ar" ? "التاريخ" : "Date"}
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
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
                    }}
                  >
                    {formatDate(payment.date)}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "center",
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
            }}
          >
            <div style={{ marginBottom: "5px" }}>
              <strong>
                {language === "ar" ? "إجمالي المدفوع:" : "Total Payé:"}{" "}
                {formatNumber(
                  orderData.payment.reduce((sum, pay) => sum + pay.amount, 0)
                )}{" "}
                {language === "ar" ? "دج" : "DA"}
              </strong>
            </div>
            <div style={{ color: "#ef4444", fontWeight: "bold" }}>
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
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid #ddd",
          textAlign: "center",
          color: "#666",
          fontSize: "10px",
        }}
      >
        <div>
          {language === "ar"
            ? `تم إنشاء هذه الفاتورة في ${formatDate(new Date())}`
            : `Facture générée le ${formatDate(new Date())}`}
        </div>
      </div>
    </div>
  );
}
