import React, { useState } from "react";
import Header from "../components/Header";
import ButtonSave from "../components/ButtonSave";
import ButtonCancel from "../components/ButtonCancel";
import AddOrderProfileDetails from "../components/AddOrderProfileDetails";
import AddOrderTableDetails from "../components/AddOrderTableDetails";
import ButtonAdd from "../components/ButtonAdd";
import AddOrderSubTotal from "../components/AddOrderSubTotal";

export default function AddOrder() {
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryAmount, setDeliveryAmount] = useState(50); // Example fixed delivery amount
  const [total, setTotal] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleCalculateTotals = (subtotal, deliveryAmount, total) => {
    setSubtotal(subtotal);
    setDeliveryAmount(deliveryAmount);
    setTotal(total);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="pagesContainer addOrder">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Add a new order</h2>
        <div className="flex items-center space-x-2">
          <ButtonCancel />
          <ButtonSave />
        </div>
      </div>
      <div className="customerClass">
        <h2 className="customerClassTitle">Basic Information</h2>
        <AddOrderProfileDetails />
      </div>
      <div className="pageTable">
        <div className="flex items-center justify-between">
          <h2 className="customerClassTitle">Order Details</h2>
          <ButtonAdd buttonSpan="Add item" onClick={handleOpenModal} />
        </div>
        <div className="pageTableContainer">
          <AddOrderTableDetails
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            onCalculateTotals={handleCalculateTotals}
          />
        </div>
        <div className="W-full flex justify-end">
          <AddOrderSubTotal
            subtotal={subtotal}
            deliveryAmount={deliveryAmount}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
