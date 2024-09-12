import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Dialog from "@mui/material/Dialog";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ConfirmDialog from "./ConfirmDialog";
import Search from "./Search";
import Modal from "react-modal";

import ProductsContainerAddOrder from "./ProductContainerAddOrder";
import ButtonAdd from "./ButtonAdd";

function AddRetunsTableDetails() {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSelectProduct = (product) => {
    setNewItem((prevState) => ({
      ...prevState,
      product: product,
    }));
  };
  const handleProductQuantityChange = (e) => {
    const value = e.target.value;
    setClientQuantity(value);
  };

  const [addReturnsModal, setAddReturnsModal] = useState(false);

  const handleOpenReturnsModal = () => {
    setAddReturnsModal(true);
  };

  const handleCloseReturnsModal = () => {
    setAddReturnsModal(false);
  };

  const OrderRow = ({ row }) => {
    return (
      <TableRow
        // key={row.product._id}
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
        <TableCell className="tableCell">
          <span className="trTableSpan">{/* {row.product._id} */}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">
            {/* {row.product.product.name + " " + row.product.product.size} */}
          </span>
        </TableCell>
        <TableCell className="tableCell">
          {/* <span className="trTableSpan">{row.product.product.brand?.name}</span> */}
        </TableCell>
        <TableCell className="tableCell">
          {/* <span className="trTableSpan">{row.ClientQuantity}</span> */}
        </TableCell>
        <TableCell className="tableCell">
          {/* <span className="trTableSpan">{row.product.selling} DA</span> */}
        </TableCell>
        <TableCell className="tableCell">
          {/* <span className="trTableSpan">{productAmount} DA</span> */}
        </TableCell>
        <TableCell align="right" className="tableCell">
          <div className="flex items-center justify-end space-x-3">
            <TrashIcon
              className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
              //   onClick={() => onDelete(row.uniqueId)}
            />
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-[16px]">
        <h2 className="customerClassTitle">Add Retuns</h2>
        <ButtonAdd
          showIcon={true}
          buttonSpan="Add Item"
          onClick={handleOpenReturnsModal}
        />
      </div>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "none" }}
        className="tablePages"
      >
        <Table>
          <TableHead className="tableHead">
            <TableRow>
              <TableCell className="tableCell">
                <span className="thTableSpan">Product_ID</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Product</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Brand</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Quantity</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Price</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Amount</span>
              </TableCell>
              <TableCell align="right" className="tableCell">
                <span className="thTableSpan pr-1">Action</span>
              </TableCell>
            </TableRow>
          </TableHead>
          {/* <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <OrderRow
                  key={row.uniqueId}
                  row={row}
                  //   onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {rows.length === 0 ? (
                    <span>Add products</span>
                  ) : (
                    <CircularProgress size={24} />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody> */}
        </Table>
      </TableContainer>

      <Modal
        isOpen={addReturnsModal}
        onRequestClose={handleCloseReturnsModal}
        contentLabel="Add Retuns"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            border: "none",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "90%",
            margin: "auto",
            height: "fit-content",
            zIndex: 1001,
            overflowY: "auto",
          },
        }}
      >
        <div className="customerClass space-y-0 pb-0">
          <h2 className="dialogTitle">Add Retuns to the Order</h2>
          <div className="space-y-[24px]">
            <div className="addProductModalHeader">
              <Search
                placeholder="Search by Product..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <div className="flex space-x-5 items-center">
                <span>Category :</span>
                <div className="selectStoreWilayaCommune w-[300px]">
                  <select
                    name="productCategory"
                    // onChange={handelCategoryChange}
                  >
                    {/* <option value="">-- Select Product Category --</option>
                    {CategoryData?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))} */}
                  </select>
                </div>
              </div>
            </div>
            <div className="h-[55vh]">
              <ProductsContainerAddOrder
                searchQuery={searchQuery}
                onSelectProduct={handleSelectProduct}
              />
            </div>
            <div className="flex flex-col space-y-2 mb-4">
              <div className="dialogAddCustomerItem items-center justify-end space-x-4">
                <span>Unit Type :</span>
                <RadioGroup
                  aria-label="unit-type"
                  name="unit-type"
                  //   value={unitType}
                  //   onChange={(e) => setUnitType(e.target.value)}
                >
                  <div className="w-[500px]">
                    <FormControlLabel
                      value="perUnit"
                      control={
                        <Radio
                          sx={{
                            "&.Mui-checked": { color: "#26667e" },
                          }}
                        />
                      }
                      label={<span>Per Unit</span>}
                    />
                    <FormControlLabel
                      value="perBox"
                      control={
                        <Radio
                          sx={{
                            "&.Mui-checked": { color: "#26667e" },
                          }}
                        />
                      }
                      label={<span>Per Box</span>}
                    />
                  </div>
                </RadioGroup>
              </div>
              <div className="dialogAddCustomerItem items-center justify-end space-x-4">
                <span>Quantity :</span>
                <div className="inputForm">
                  <input
                    type="number"
                    name="productQuantity"
                    // value={ClientQuantity}
                    min={0}
                    // onChange={handleProductQuantityChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-8 items-start mt-[20px]">
            <button
              onClick={handleCloseReturnsModal}
              className="text-gray-500 cursor-pointer hover:text-gray-700"
            >
              Close
            </button>
            <button
            //   onClick={handleAddItem}
              className="text-blue-500 cursor-pointer hover:text-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AddRetunsTableDetails;
