import React from "react";

export default function PurchasePDFTemplate({
  purchaseData,
  sousPurchaseData,
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

    if (language === "ar") {
      return `${
        totalBoxes > 0
          ? `${totalBoxes} ${totalBoxes === 1 ? "علبة" : "علب"}`
          : ""
      }${totalBoxes > 0 && remainingItems > 0 ? "+" : ""}${
        remainingItems > 0
          ? ` ${remainingItems} ${remainingItems === 1 ? "قطعة" : "قطع"}`
          : ""
      }`;
    } else {
      return `${
        totalBoxes > 0
          ? `${totalBoxes} ${totalBoxes === 1 ? "boîte" : "boîtes"}`
          : ""
      }${totalBoxes > 0 && remainingItems > 0 ? "+" : ""}${
        remainingItems > 0
          ? ` ${remainingItems} ${remainingItems === 1 ? "pièce" : "pièces"}`
          : ""
      }`;
    }
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
          {language === "ar" ? "فاتورة شراء" : "Facture d'Achat"}
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
            {language === "ar" ? "رقم الفاتورة:" : "N° Facture:"} #
            {purchaseData?._id}
          </span>
          <span>
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
          gap: "30px",
          marginBottom: "30px",
        }}
      >
        {/* Purchase Details */}
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
            {language === "ar" ? "تفاصيل الشراء" : "Détails d'Achat"}
          </h3>

          <div style={{ marginBottom: "8px" }}>
            <strong>
              {language === "ar" ? "المجموع الكلي:" : "Montant Total:"}
            </strong>
            <span style={{ float: language === "ar" ? "left" : "right" }}>
              {formatNumber(purchaseData?.totalAmount)}{" "}
              {language === "ar" ? "دج" : "DA"}
            </span>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "الخصم:" : "Remise:"}</strong>
            <span style={{ float: language === "ar" ? "left" : "right" }}>
              {purchaseData?.discount || 0}%
            </span>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "الحالة:" : "Statut:"}</strong>
            <span
              style={{
                float: language === "ar" ? "left" : "right",
                color: purchaseData?.closed ? "#22c55e" : "#ef4444",
                fontWeight: "bold",
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

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "عربون:" : "Acompte:"}</strong>
            <span
              style={{
                float: language === "ar" ? "left" : "right",
                color: purchaseData?.deposit ? "#22c55e" : "#ef4444",
              }}
            >
              {purchaseData?.deposit
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
                color: purchaseData?.credit ? "#22c55e" : "#ef4444",
              }}
            >
              {purchaseData?.credit
                ? language === "ar"
                  ? "نعم"
                  : "Oui"
                : language === "ar"
                ? "لا"
                : "Non"}
            </span>
          </div>
        </div>

        {/* Supplier Details */}
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
            {language === "ar" ? "المورد" : "Fournisseur"}
          </h3>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "الاسم:" : "Nom:"}</strong>
            <div>{purchaseData?.fournisseur?.name || "N/A"}</div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "الهاتف:" : "Téléphone:"}</strong>
            <div>{purchaseData?.fournisseur?.phoneNumber || "N/A"}</div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "العنوان:" : "Adresse:"}</strong>
            <div>{purchaseData?.fournisseur?.address || "N/A"}</div>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <strong>{language === "ar" ? "الولاية:" : "Wilaya:"}</strong>
            <div>
              {purchaseData?.fournisseur?.commune} -{" "}
              {purchaseData?.fournisseur?.wilaya}
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
                        {item?.sousStock?.stock?.product?.name || "N/A"}
                        {item?.sousStock?.stock?.product?.size && (
                          <span> - {item.sousStock.stock.product.size}</span>
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

                  {/* Discount Row */}
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
                      {language === "ar" ? "الخصم" : "Remise"}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {formatNumber(purchaseData?.discount || 0)}{" "}
                      {language === "ar" ? "دج" : "DA"}
                    </td>
                  </tr>

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
                      {language === "ar"
                        ? "المجموع قبل الخصم"
                        : "Total sans remise"}
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
                      {language === "ar" ? "المجموع الكلي" : "Total final"}
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
              {purchaseData.payment.map((payment, index) => (
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
                  purchaseData.payment.reduce((sum, pay) => sum + pay.amount, 0)
                )}{" "}
                {language === "ar" ? "دج" : "DA"}
              </strong>
            </div>
            <div style={{ color: "#ef4444", fontWeight: "bold" }}>
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
