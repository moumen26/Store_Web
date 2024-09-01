import React, { useRef, useState } from "react";
import Header from "../components/Header";
import ButtonSave from "../components/ButtonSave";
import ButtonCancel from "../components/ButtonCancel";
import ButtonAdd from "../components/ButtonAdd";
import AddAchatProfileDetails from "../components/AddAchatProfileDetails";
import AddAchatTableDetails from "../components/AddAchatTableDetails";
import AddAchatSubTotal from "../components/AddAchatSubTotal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AddAchat() {
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryAmount, setDeliveryAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Products, setProducts] = useState([]);
  const [OpenConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const handleOpenConfirmationDialog = () => {
    setOpenConfirmationDialog(true);
  };

  const handleCalculateTotals = (subtotal, deliveryAmount, total) => {
    setSubtotal(subtotal);
    setDeliveryAmount(deliveryAmount);
    setTotal(total);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmAchatSubmit = () => {
    setOpenConfirmationDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenConfirmationDialog(false);
  };

  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };

  return (
    <div className="pagesContainer addOrder">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Add a new achat</h2>
        <div className="flex items-center space-x-2">
          <ButtonCancel />
          <ButtonSave setOnClick={handleOpenConfirmationDialog} />
        </div>
      </div>
      <div className="customerClass">
        <h2 className="customerClassTitle">Basic Information</h2>
        <AddAchatProfileDetails />
      </div>
      <div className="pageTable">
        <div className="flex items-center justify-between">
          <h2 className="customerClassTitle">Achat Details</h2>
          <ButtonAdd buttonSpan="Add item" onClick={handleOpenModal} />
        </div>
        <div className="pageTableContainer">
          <AddAchatTableDetails
            isModalOpen={isModalOpen}
            handleCloseModal={handleCloseModal}
            onCalculateTotals={handleCalculateTotals}
            deliveryAmount={deliveryAmount}
            setAPIProducts={setProducts}
          />
        </div>
        <div className="w-full flex justify-end">
          <AddAchatSubTotal total={total} />
        </div>
      </div>
      <ConfirmDialog
        open={OpenConfirmationDialog}
        onConfirm={handleConfirmAchatSubmit}
        onClose={handleCloseDialog}
        dialogTitle="Confirm achat submition"
        dialogContentText={`Are you sure you want to submit this achat?`}
      />
    </div>
  );
}
