import * as React from "react";
import Dialog from "@mui/material/Dialog";
import PropTypes from "prop-types";
import { CircularProgress } from "@mui/material";

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  dialogTitle,
  dialogContentText,
  language,
  isloading = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          borderRadius: 12,
          padding: 0,
          minWidth: "320px",
          maxWidth: "500px",
          direction: language === "ar" ? "rtl" : "ltr",
          boxShadow:
            "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)",
        },
      }}
    >
      <div
        className="customerClass"
        style={{
          padding: "24px",
          background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
          borderRadius: 8,
        }}
      >
        {/* Header */}
        <div>
          <h2
            className="customerClassTitle text-lg font-semibold"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
              marginBottom: "8px",
              color: "#1F2937",
            }}
          >
            {dialogTitle}
          </h2>
        </div>

        {/* Content */}
        <div className="mb-2">
          <p
            className="text-gray-600 leading-relaxed"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            {dialogContentText}
          </p>
        </div>

        {/* Actions */}
        {!isloading ? (
          <div
            className={`flex justify-end ${
              language === "ar" ? "gap-x-4" : "space-x-4"
            }`}
          >
            <button
              onClick={onClose}
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="text-gray-500 cursor-pointer hover:text-gray-700"
            >
              {language === "ar" ? "إلغاء" : "Annuler"}
            </button>
            <button
              onClick={onConfirm}
              style={{
                fontFamily:
                  language === "ar" ? "Cairo-Regular, sans-serif" : "",
              }}
              className="text-blue-500 cursor-pointer hover:text-blue-700"
            >
              {language === "ar" ? "تأكيد" : "Confirmer"}
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center py-4">
            <div className="flex items-center gap-3">
              <CircularProgress size={20} style={{ color: "#6B7280" }} />
              <span
                className="text-gray-600 text-sm"
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "ar"
                  ? "جاري المعالجة..."
                  : "Traitement en cours..."}
              </span>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  dialogContentText: PropTypes.string.isRequired,
  language: PropTypes.string,
  isloading: PropTypes.bool,
};

export default ConfirmDialog;
