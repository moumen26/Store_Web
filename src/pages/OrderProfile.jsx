import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import OrderProfileDetails from "../components/OrderProfileDetails";
import { PhoneIcon } from "@heroicons/react/24/outline";
import OrderProfileDevicesProductTable from "../components/OrderProfileDevicesProductTable";
import ButtonExportPDF from "../components/ButtonExportPdf";
import { useAuthContext } from "../hooks/useAuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useParams } from "react-router-dom";
import OrderStatus from "../components/OrderStatus";
import { useQuery } from "@tanstack/react-query";
import ButtonAdd from "../components/ButtonAdd";
import Modal from "react-modal";
import PaymentHistorique from "../components/PaymentHistorique";
import ConfirmDialog from "../components/ConfirmDialog";
import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import ButtonModify from "../components/ButtonModify";
import { TokenDecoder } from "../util/DecodeToken";
import AddOrderRetunsTableDetails from "../components/AddOrderRetunsTableDetails";
import RetireButton from "../components/RetireButton";

export default function OrderProfile() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const location = useLocation();
  const decodedToken = TokenDecoder();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [Amount, setAmount] = useState(0);
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const [isAddAmountConfirmDialogOpen, setIsAddAmountConfirmDialogOpen] =
    useState(false);
  const handleOpenAddAmountConfirmationDialog = () => {
    setIsAddAmountConfirmDialogOpen(true);
  };
  const handleCloseAddAmountConfirmationDialog = () => {
    setIsAddAmountConfirmDialogOpen(false);
    setAmount(0);
  };

  const [isFullyPaidConfirmationOpen, setisFullyPaidConfirmationOpen] =
    useState(false);
  const handleOpenFullyPaidDialog = () => {
    setisFullyPaidConfirmationOpen(true);
  };
  const handleCloseFullyPaidConfirmationDialog = () => {
    setisFullyPaidConfirmationOpen(false);
  };

  const [isAddPaymentDialogOpen, setisAddPaymentDialogOpen] = useState(false);
  const handleOpenAddPaymentDialog = () => {
    setisAddPaymentDialogOpen(true);
  };
  const handleCloseAddPaymentDialog = () => {
    setisAddPaymentDialogOpen(false);
  };

  const [isDepositConfirmDialogOpen, setisDepositConfirmDialogOpen] =
    useState(false);
  const handleOpenDepositConfirmationDialog = () => {
    setisDepositConfirmDialogOpen(true);
  };
  const handleCloseDepositConfirmationDialog = () => {
    setisDepositConfirmDialogOpen(false);
  };

  const [isUnDepositConfirmDialogOpen, setisUnDepositConfirmDialogOpen] =
    useState(false);
  const handleOpenUnDepositConfirmationDialog = () => {
    setisUnDepositConfirmDialogOpen(true);
  };
  const handleCloseUnDepositConfirmationDialog = () => {
    setisUnDepositConfirmDialogOpen(false);
  };

  const [isCreditedConfirmDialogOpen, setisCreditedConfirmDialogOpen] =
    useState(false);
  const handleOpenCreditedConfirmationDialog = () => {
    setisCreditedConfirmDialogOpen(true);
  };
  const handleCloseCreditedConfirmationDialog = () => {
    setisCreditedConfirmDialogOpen(false);
  };

  const [isUnCreditedConfirmDialogOpen, setisUnCreditedConfirmDialogOpen] =
    useState(false);
  const handleOpenUnCreditedConfirmationDialog = () => {
    setisUnCreditedConfirmDialogOpen(true);
  };
  const handleCloseUnCreditedConfirmationDialog = () => {
    setisUnCreditedConfirmDialogOpen(false);
  };

  const [
    isUpdateReceiptstatusConfirmDialogOpen,
    setisUpdateReceiptstatusConfirmDialogOpen,
  ] = useState(false);
  const handleOpenUpdateReceiptstatusConfirmDialogOpen = () => {
    setisUpdateReceiptstatusConfirmDialogOpen(true);
  };
  const handleCloseUpdateReceiptstatusConfirmDialogOpen = () => {
    setisUpdateReceiptstatusConfirmDialogOpen(false);
  };

  //Modify the order
  const [modifyOrderModal, setModifyOrderModal] = useState(false);

  const handleOpenModifyOrderModal = () => {
    setModifyOrderModal(true);
  };

  const handleCloseModifyOrderModal = () => {
    setModifyOrderModal(false);
  };

  //Add retuns
  const [addRetunsModal, setAddRetunsModal] = useState(false);

  const handleOpenAddRetunsModal = () => {
    setAddRetunsModal(true);
  };

  const handleCloseAddRetunsModal = () => {
    setAddRetunsModal(false);
  };

  const [retireOrder, setRetireOrder] = useState(false);

  const handleOpenRetireOrderModal = () => {
    setRetireOrder(true);
  };

  const handleCloseRetireOrderModal = () => {
    setRetireOrder(false);
  };

  //---------------------------------API calls---------------------------------\\

  const [productsListToUpdate, setProductsListToUpdate] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [submitionLoading, setSubmitionLoading] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  //fetch data
  const fetchOrderData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/Receipt/${id}/${decodedToken?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) {
        return []; // Return an empty array if no data is found
      } else {
        throw new Error("Error receiving order data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: OrderData,
    error: OrderDataError,
    isLoading: OrderDataLoading,
    refetch: refetchOrderData,
  } = useQuery({
    queryKey: ["OrderData", user?.token, location.key, id],
    queryFn: fetchOrderData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });

  //fetch data
  const fetchOrderStatusData = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL_BASE}/ReceiptStatus/all/${id}/${
        decodedToken.id
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error.statusCode === 404) {
        return []; // Return an empty array if no data is found
      } else {
        throw new Error("Error receiving order data");
      }
    }

    return await response.json(); // Return the data if the response is successful
  };
  // useQuery hook to fetch data
  const {
    data: OrderStatusData,
    error: OrderStatusDataError,
    isLoading: OrderStatusDataLoading,
    refetch: refetchOrderStatusData,
  } = useQuery({
    queryKey: ["OrderStatusData", user?.token, location.key, id],
    queryFn: fetchOrderStatusData,
    enabled: !!user?.token, // Ensure the query runs only if the user is authenticated
    refetchOnWindowFocus: true, // Optional: refetch on window focus
  });

  //add full payment API
  const handleOnConfirmFullyPaid = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Receipt/full/payment/${id}/${decodedToken.id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchOrderData();
        setAlertType("success");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseFullyPaidConfirmationDialog();
      } else {
        setAlertType("error");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setAlertType("error");
        setAlertMessage(error.response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error adding new payment: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error adding new payment");
      }
    }
  };

  //add payment API
  const handleOnConfirmAddPayment = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Receipt/payment/${id}/${decodedToken.id}`,
        {
          amount: Amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchOrderData();
        setAlertType("success");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseAddAmountConfirmationDialog();
        handleCloseAddPaymentDialog();
      } else {
        setAlertType("error");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setAlertType("error");
        setAlertMessage(error.response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error adding new payment: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error adding new payment");
      }
    }
  };

  //add payment API
  const handleOnDepositConfirm = async (val) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Receipt/deposit/${id}/${decodedToken.id}`,
        {
          deposit: val,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchOrderData();
        setAlertType("success");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseDepositConfirmationDialog();
        handleCloseUnDepositConfirmationDialog();
      } else {
        setAlertType("error");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setAlertType("error");
        setAlertMessage(error.response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error(
          "Error updating taking without paying: No response received"
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating taking without paying");
      }
    }
  };

  //make it credited API
  const handleOnConfirmCredited = async (val) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Receipt/credit/${id}/${decodedToken.id}`,
        {
          credited: val,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchOrderData();
        setAlertType("success");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseCreditedConfirmationDialog();
        handleCloseUnCreditedConfirmationDialog();
      } else {
        setAlertType("error");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setAlertType("error");
        setAlertMessage(error.response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error updating credited: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating credited");
      }
    }
  };

  //update receipt status API
  const handleUpdateReceiptStatus = async (val) => {
    try {
      setSubmitionLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_APP_URL_BASE +
          `/ReceiptStatus/create/${id}/${decodedToken.id}`,
        {
          products: productsListToUpdate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchOrderStatusData();
        refetchOrderData();
        setAlertType("success");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseModifyOrderModal();
        handleCloseUpdateReceiptstatusConfirmDialogOpen();
        setProductsListToUpdate([]);
      } else {
        setAlertType("error");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setAlertType("error");
        setAlertMessage(error.response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error updating receipt status: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error updating receipt status");
      }
    }
  };
  //cancel order API
  const handleCancelOrder = async () => {
    try {
      setSubmitionLoading(true);
      const response = await axios.patch(
        import.meta.env.VITE_APP_URL_BASE +
          `/Receipt/cancel/${decodedToken.id}/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        refetchOrderData();
        setAlertType("success");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
        handleCloseRetireOrderModal();
      } else {
        setAlertType("error");
        setAlertMessage(response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setAlertType("error");
        setAlertMessage(error.response.data.message);
        setSnackbarOpen(true);
        setSubmitionLoading(false);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error cancel receipt: No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error cancel receipt");
      }
    }
  };
  if (OrderDataLoading || OrderStatusDataLoading) {
    return (
      <div className="pagesContainer h-[100vh]">
        <Header />
        <div className="w-full h-full flex items-center justify-center">
          <CircularProgress color="inherit" />
          {/* <h1>Loading...</h1> */}
        </div>
      </div>
    );
  }

  if (OrderDataError || OrderStatusDataError) {
    return (
      <div className="pagesContainer">
        <Header />
        <div className="customerClass">
          <h2 className="customerClassTitle">no data is available</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="pagesContainer">
      <Header />

      <div id="exportable-content" className="space-y-[32px]">
        <div className="titlePageButton">
          <div className="flex items-center space-x-1">
            <span>Orders</span>
            <ChevronRightIcon className="iconAsideBar" />
            <span>#{OrderData?._id}</span>
          </div>
          <div className="orderProfileButtons">
            {OrderData?.status == 0 &&
              <RetireButton
                showIcon={true}
                buttonSpan="Retire Order"
                onClick={handleOpenRetireOrderModal}
              />
            }
            {OrderData?.status >= 0 &&
              <ButtonModify
                showIcon={true}
                buttonSpan="Modify Order"
                onClick={handleOpenModifyOrderModal}
              />
            }
            <ButtonExportPDF
              filename="Order_Profile"
              customerName={`${OrderData?.client.firstName}_${OrderData?.client.lastName}`}
              orderId={OrderData?._id}
            />
            <ButtonAdd
              showIcon={false}
              buttonSpan="View Payment History"
              onClick={handleOpenModal}
            />
          </div>
        </div>
        <div className="customerClass paddingClass">
          <h2 className="customerClassTitle">Order Details</h2>
          <OrderProfileDetails orderDetails={OrderData} />
        </div>
        <div className="flex space-x-6 h-full">
          <div className="customerClass paddingClass w-[65%]">
            <h2 className="customerClassTitle">Devices in the Order</h2>
            {OrderStatusData?.map((status) => (
              <OrderProfileDevicesProductTable
                orderDetails={status?.products}
                orderDeliveryAmount={0}
              />
            ))}
          </div>
          <div className="w-[35%] flex-col space-y-[32px]">
            <div className="customerClass paddingClass">
              <h2 className="customerClassTitle">Customer</h2>
              <div className="flex-col space-y-1">
                <span className="dashboardLatestOrdersDetails">
                  Contact Information
                </span>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="iconAsideBar text-[#888888]" />
                  <p className="orderProfileSpan">
                    {OrderData?.client.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="flex-col space-y-1">
                <span className="dashboardLatestOrdersDetails">
                  Default Address
                </span>
                <div className="flex-col space-y-1">
                  <p className="orderProfileSpan">
                    {OrderData?.deliveredLocation
                      ? OrderData?.deliveredLocation?.address
                      : "Pickup"}
                  </p>
                  <p className="orderProfileSpan">
                    {OrderData?.client.commune} {OrderData?.client.wilaya}
                  </p>
                  <p className="orderProfileSpan">Algerie</p>
                </div>
              </div>
            </div>
            <OrderStatus
              orderDetails={OrderData}
              user={user}
              refetchOrderData={refetchOrderData}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Payment History"
        className="addNewModal PaymentHistory"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div className="customerClass">
          <div className="flex flex-row justify-between items-center w-full">
            <h2 className="customerClassTitle">Payment History</h2>
            {OrderData.status != 10 ? (
              <div className="flex space-x-4">
                {OrderData.credit == true ? null : OrderData.deposit == false ? (
                  OrderData?.status >= 0 && 
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan="Make it deposit"
                    onClick={handleOpenDepositConfirmationDialog}
                  />
                ) : (
                  OrderData?.status >= 0 && 
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan="Make it undeposit"
                    onClick={handleOpenUnDepositConfirmationDialog}
                  />
                )}
                {OrderData.deposit == true ? null : OrderData.credit ==
                  false ? (
                    OrderData?.status >= 0 && 
                    <ButtonAdd
                      showIcon={false}
                      buttonSpan="Make it credited"
                      onClick={handleOpenCreditedConfirmationDialog}
                    />
                ) : (
                  OrderData?.status >= 0 && 
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan="Make it uncredited"
                    onClick={handleOpenUnCreditedConfirmationDialog}
                  />
                )}
                {OrderData.credit == true ? (
                  OrderData?.status >= 0 && 
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan="Add payment"
                    onClick={handleOpenAddPaymentDialog}
                  />
                ) : (
                  OrderData?.status >= 0 && 
                  <ButtonAdd
                    showIcon={false}
                    buttonSpan="Full payment"
                    onClick={handleOpenFullyPaidDialog}
                  />
                )}
              </div>
            ) : (
              <h2 className="customerClassTitle">{`Fully paid`}</h2>
            )}
          </div>
          <div className="scrollProductHistorique">
            <PaymentHistorique
              data={OrderData.payment}
              isClosed={OrderData.status == 10 ? false : true}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-row justify-center items-center w-full">
            <h2
              className="customerClassTitle"
              style={{ marginInlineEnd: "2%" }}
            >
              Total : {OrderData.total} DA
            </h2>
            <h2 className="customerClassTitle">
              Rest to pay :{" "}
              {OrderData.total -
                OrderData.payment.reduce((sum, pay) => sum + pay.amount, 0)}
              DA
            </h2>
          </div>
          <button
            onClick={handleCloseModal}
            style={{ marginTop: "20px" }}
            className="text-gray-500 cursor-pointer hover:text-gray-700 absolute bottom-5 right-8"
          >
            Close
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isAddPaymentDialogOpen}
        onRequestClose={handleCloseAddPaymentDialog}
        contentLabel="Add payment"
        className="addNewModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div className="customerClass p-0">
          <h2 className="customerClassTitle">Add payment</h2>
          <div className="dialogAddCustomerItem items-center">
            <span>Payment Amount :</span>
            <div className="inputForm">
              <input
                type="number"
                name="amount"
                min={0}
                onChange={handleAmountChange}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-8 mt-[20px]">
          <button
            className="text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={handleCloseAddPaymentDialog}
          >
            Cancel
          </button>
          <button
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={handleOpenAddAmountConfirmationDialog}
          >
            Save
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modifyOrderModal}
        onRequestClose={handleCloseModifyOrderModal}
        contentLabel="Add Retuns"
        className="addNewModal addNewStockModal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
        }}
      >
        <div className="customerClass">
          <AddOrderRetunsTableDetails
            productsListToUpdate={productsListToUpdate}
            setProductsListToUpdate={setProductsListToUpdate}
          />
          <div className="mt-[16px]">
            <div className="flex justify-end space-x-8">
              <button
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={handleCloseModifyOrderModal}
              >
                Cancel
              </button>
              <input
                type="button"
                value={"Save"}
                className="text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={handleOpenUpdateReceiptstatusConfirmDialogOpen}
              />
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={isFullyPaidConfirmationOpen}
        onConfirm={handleOnConfirmFullyPaid}
        onClose={handleCloseFullyPaidConfirmationDialog}
        dialogTitle="Confirm full payment"
        dialogContentText={`Are you sure you want to confirm the full payment?`}
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={retireOrder}
        onConfirm={handleCancelOrder}
        onClose={handleCloseRetireOrderModal}
        dialogTitle="Confirm Retire"
        dialogContentText={`Are you sure you want to cancel this order?`}
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={isAddAmountConfirmDialogOpen}
        onConfirm={handleOnConfirmAddPayment}
        onClose={handleCloseAddAmountConfirmationDialog}
        dialogTitle="Confirm add payment"
        dialogContentText={`Are you sure you want to add this amount: ${Amount}?`}
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={isDepositConfirmDialogOpen}
        onConfirm={() => handleOnDepositConfirm(true)}
        onClose={handleCloseDepositConfirmationDialog}
        dialogTitle="Confirm make it deposit sell"
        dialogContentText={`Are you sure you want to confirm to make deposit sell`}
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={isUnDepositConfirmDialogOpen}
        onConfirm={() => handleOnDepositConfirm(false)}
        onClose={handleCloseUnDepositConfirmationDialog}
        dialogTitle="Confirm make it undeposit sell"
        dialogContentText={`Are you sure you want to confirm to make undeposit sell`}
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={isCreditedConfirmDialogOpen}
        onConfirm={() => handleOnConfirmCredited(true)}
        onClose={handleCloseCreditedConfirmationDialog}
        dialogTitle="Confirm make it credited"
        dialogContentText={`Are you sure you want to confirm to make it credited?`}
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={isUnCreditedConfirmDialogOpen}
        onConfirm={() => handleOnConfirmCredited(false)}
        onClose={handleCloseUnCreditedConfirmationDialog}
        dialogTitle="Confirm make it uncredited"
        dialogContentText={`Are you sure you want to confirm to make it uncredited?`}
        isloading={submitionLoading}
      />

      <ConfirmDialog
        open={isUpdateReceiptstatusConfirmDialogOpen}
        onConfirm={handleUpdateReceiptStatus}
        onClose={handleCloseUpdateReceiptstatusConfirmDialogOpen}
        dialogTitle="Confirm the receipt modification"
        dialogContentText={`Are you sure you want to modify this receipt?`}
        isloading={submitionLoading}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={alertType}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
