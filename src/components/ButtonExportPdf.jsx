import React from "react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import JsBarcode from "jsbarcode";

export default function ButtonExportPDF({
  filename,
  customerName,
  orderId,
  language,
}) {
  const handleExportPDF = () => {
    const input = document.getElementById("exportable-content");
    const button = document.getElementById("export-pdf-button");

    // Temporarily hide the button
    button.classList.add("hidden");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const padding = 5; // Set your desired padding here

      // Create a canvas for the barcode
      const barcodeCanvas = document.createElement("canvas");
      JsBarcode(barcodeCanvas, orderId, { format: "CODE128" });

      // Convert the barcode canvas to an image
      const barcodeData = barcodeCanvas.toDataURL("image/png");

      // Calculate the position for the barcode to be at the top right
      const barcodeWidth = 50;
      const barcodeHeight = 20;
      const barcodeX = pdfWidth - barcodeWidth - padding;
      const barcodeY = padding;

      // Add the barcode to the PDF
      pdf.addImage(
        barcodeData,
        "PNG",
        barcodeX,
        barcodeY,
        barcodeWidth,
        barcodeHeight
      );

      // Adjust content positioning
      const adjustedContentHeight = pdfHeight - barcodeHeight - 2 * padding;
      const adjustedContentY = barcodeHeight + 2 * padding;

      // Add the main content to the PDF
      pdf.addImage(
        imgData,
        "PNG",
        padding,
        adjustedContentY,
        pdfWidth - 2 * padding,
        adjustedContentHeight
      );

      // Sanitize customerName to be filesystem-safe
      const sanitizedCustomerName = customerName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      pdf.save(`${filename}_${sanitizedCustomerName}_${orderId}.pdf`);

      // Show the button again
      button.classList.remove("hidden");
    });
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
