import React from "react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom/client";
import PurchasePDFTemplate from "../pages/PurchasePDFTemplate";
import OrderPDFTemplate from "../pages/OrderPDFTemplate";

export default function ButtonExportPDF({
  filename,
  customerName,
  orderId,
  language,
  // Purchase props
  purchaseData,
  sousPurchaseData,
  // Order props
  orderData,
  orderStatusData,
  // Type indicator
  type = "purchase", // "purchase" or "order"
}) {
  const handleExportPDF = async () => {
    try {
      // Create a temporary container for the PDF template
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "fixed";
      tempContainer.style.top = "-9999px";
      tempContainer.style.left = "-9999px";
      tempContainer.style.width = "210mm"; // A4 width
      tempContainer.style.minHeight = "297mm"; // A4 height
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.padding = "0";
      tempContainer.style.margin = "0";

      document.body.appendChild(tempContainer);

      // Create a React root and render the PDF template
      const root = ReactDOM.createRoot(tempContainer);

      // Render the appropriate PDF template based on type
      await new Promise((resolve) => {
        if (type === "order") {
          root.render(
            <OrderPDFTemplate
              orderData={orderData}
              orderStatusData={orderStatusData}
              language={language}
            />
          );
        } else {
          root.render(
            <PurchasePDFTemplate
              purchaseData={purchaseData}
              sousPurchaseData={sousPurchaseData}
              language={language}
            />
          );
        }

        // Wait for rendering to complete (increased timeout for barcode generation)
        setTimeout(resolve, 500);
      });

      // Capture the rendered template
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "white",
        width: tempContainer.scrollWidth,
        height: tempContainer.scrollHeight,
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate the ratio to fit the image in the PDF
      const ratio = Math.min(
        pdfWidth / (imgWidth * 0.264583),
        pdfHeight / (imgHeight * 0.264583)
      );
      const scaledWidth = imgWidth * 0.264583 * ratio;
      const scaledHeight = imgHeight * 0.264583 * ratio;

      // Center the image
      const x = (pdfWidth - scaledWidth) / 2;
      const y = 10; // Small margin from top

      // Add the main content (barcode is now included in the template)
      pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);

      // Generate filename based on type
      let pdfFilename = filename || (type === "order" ? "order" : "purchase");
      if (customerName) {
        const sanitizedCustomerName = customerName
          .replace(/[^a-z0-9]/gi, "_")
          .toLowerCase();
        pdfFilename += `_${sanitizedCustomerName}`;
      }
      if (orderId) {
        pdfFilename += `_${orderId}`;
      }
      pdfFilename += ".pdf";

      // Save the PDF
      pdf.save(pdfFilename);

      // Cleanup
      root.unmount();
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        language === "ar"
          ? "حدث خطأ أثناء إنشاء ملف PDF"
          : "Une erreur s'est produite lors de la génération du PDF"
      );
    }
  };

  return (
    <button
      id="export-pdf-button"
      className="buttonExport"
      onClick={handleExportPDF}
      style={{
        fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
      }}
    >
      <DocumentArrowDownIcon className="iconAsideBar" />
      <span
        style={{
          fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
        }}
        className="buttonTextDark"
      >
        {language === "ar" ? "تصدير PDF" : "Exporter PDF"}
      </span>
    </button>
  );
}
