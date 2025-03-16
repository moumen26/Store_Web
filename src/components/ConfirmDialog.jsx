import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
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
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {!isloading ? (
        <>
          <DialogTitle id="alert-dialog-title">
            <h2 className="customerClassTitle">{dialogTitle}</h2>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span className="trTableSpan">{dialogContentText}</span>
            </DialogContentText>
          </DialogContent>
          <div
            className={`flex justify-end space-x-8 pr-8 items-start h-[40px] mt-2 ${
              language === "ar" ? "gap-x-8" : ""
            }`}
          >
            <button
              onClick={onClose}
              className="text-gray-500 cursor-pointer hover:text-gray-700"
            >
              {language === "ar" ? "إلغاء" : "Annuler"}
            </button>
            <button
              onClick={onConfirm}
              className="text-blue-500 cursor-pointer hover:text-blue-700"
            >
              {language === "ar" ? "تأكيد" : "Confirmer"}
            </button>
          </div>
        </>
      ) : (
        <>
          <DialogTitle id="alert-dialog-title">
            <h2 className="customerClassTitle">{dialogTitle}</h2>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span className="trTableSpan">{dialogContentText}</span>
            </DialogContentText>
          </DialogContent>
          <div className="flex justify-end space-x-8 pr-8 items-start h-[60px] mt-2">
            <CircularProgress color="inherit" />
          </div>
        </>
      )}
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmDialog;
