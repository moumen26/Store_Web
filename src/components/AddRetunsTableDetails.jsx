import React, { useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { TrashIcon } from "@heroicons/react/24/outline";
import Modal from "react-modal";
import Search from "./Search";
import ProductContainerAddReturns from "./ProductContainerAddReturns";
import ButtonAdd from "./ButtonAdd";
import ConfirmDialog from "./ConfirmDialog";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { Alert, Snackbar } from "@mui/material";

function AddRetunsTableDetails({
  productsListToUpdate,
  setProductsListToUpdate
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]); // Store selected products here
  const [newProduct, setNewProduct] = useState(null); // To store currently selected product
  const [unitType, setUnitType] = useState("perUnit"); // Default to "perUnit"
  const [addReturnsModal, setAddReturnsModal] = useState(false);

  // For the confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const [ClientQuantity, setClientQuantity] = useState(0);
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [submitionLoading, setSubmitionLoading] = useState(false);

  // Handler for search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handler for closing the modal
  const handleCloseReturnsModal = () => {
    setAddReturnsModal(false);
    setNewProduct(null); // Reset selected product when modal closes
    setClientQuantity(0); // Reset quantity when modal closes
    setUnitType("perUnit"); // Reset unit type
  };

  // Handler for product selection via radio button
  const handleSelectProduct = (product) => {
    setNewProduct(product);
  };

  // Handler for quantity input change
  const handleProductQuantityChange = (e) => {
    setClientQuantity(e.target.value);
  };

  // Add selected product to the table
  const handleAddItem = () => {
    //check if the selected product is already in the list
    const isProductExist = products.find((product) => product.product._id === newProduct.product._id);
    if(isProductExist){
      setAlertMessage("Product already exists in the list");
      setAlertType("error");
      setSnackbarOpen(true);
    }else if(!newProduct){
      setAlertMessage("Please select a product");
      setAlertType("error");
      setSnackbarOpen(true);
    }else {
      let newQuantity = ClientQuantity;
      if(unitType == "perBox"){
        newQuantity = newQuantity * Number(newProduct.product.boxItems);
      }
      if(!newQuantity || newQuantity <= 0){
        setAlertMessage("Quantity must be greater than 0");
        setAlertType("error");
        setSnackbarOpen(true);
      }else if(newQuantity > newProduct.quantity){
        setAlertMessage("Quantity must be less than the available quantity");
        setAlertType("error");
        setSnackbarOpen(true);
      }else{
        const newItem = {
            ...newProduct,
            newQuantity: newQuantity,
            unitType, // Add unit type to the product
          };
          setProducts([...products, newItem]);
          setProductsListToUpdate([...productsListToUpdate, 
            {
              stock: newItem.stock,
              product: newItem.product._id,
              quantity: newItem.newQuantity
            }
          ]);
          handleCloseReturnsModal(); // Close modal after adding product
      }
    }
    
  };

  // Open the confirm dialog
  const handleOpenConfirmDialog = (index) => {
    setRowToDelete(index);
    setConfirmDialogOpen(true);
  };

  // Confirm deletion of a row
  const handleConfirmDelete = () => {
    if (rowToDelete !== null) {
      setProducts(products.filter((_, index) => index !== rowToDelete));
      setProductsListToUpdate(productsListToUpdate.filter((_, index) => index !== rowToDelete));
      setConfirmDialogOpen(false);
    }
  };

  // Cancel deletion of a row
  const handleCancelDelete = () => {
    setRowToDelete(null);
    setConfirmDialogOpen(false);
  };

  // Table row component to display product details
  const OrderRow = ({ row, index }) => {
    const productAmount = Number(row.price) * Number(row.newQuantity);
    const newQuantity = Number(row.quantity) - Number(row.newQuantity);
    const totalAmount = Number(row.price) * Number(newQuantity);
    return (
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="tableRow"
      >
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.product.name} {row.product.size}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.product.brand.name}</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{row.price} DA</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">- {row.newQuantity} unity</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{newQuantity} unity</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">- {productAmount} DA</span>
        </TableCell>
        <TableCell className="tableCell">
          <span className="trTableSpan">{totalAmount} DA</span>
        </TableCell>
        <TableCell align="right" className="tableCell">
          <div className="flex items-center justify-end space-x-3">
            <TrashIcon
              className="h-6 w-6 text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => handleOpenConfirmDialog(index)}
            />
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-[16px]">
        <h2 className="customerClassTitle">Add Returns</h2>
        <ButtonAdd
          showIcon={true}
          buttonSpan="Add Item"
          onClick={() => setAddReturnsModal(true)}
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
                <span className="thTableSpan">Product</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Brand</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Price</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Refund quantity</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">New quantity</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">Refund amount</span>
              </TableCell>
              <TableCell className="tableCell">
                <span className="thTableSpan">New amount</span>
              </TableCell>
              <TableCell align="right" className="tableCell">
                <span className="thTableSpan">Action</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((row, index) => (
                <OrderRow key={index} row={row} index={index} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <span>Add products</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        isOpen={addReturnsModal}
        onRequestClose={handleCloseReturnsModal}
        contentLabel="Add Returns"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 },
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
          <h2 className="dialogTitle">Add Returns to the Order</h2>
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
                  <select name="productCategory"></select>
                </div>
              </div>
            </div>
            <div className="h-[55vh]">
              <ProductContainerAddReturns
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
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
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
                    value={ClientQuantity}
                    min={0}
                    onChange={handleProductQuantityChange}
                  />
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
                onClick={handleAddItem}
                className="text-blue-500 cursor-pointer hover:text-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={alertType}>
              {alertMessage}
            </Alert>
          </Snackbar>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onClose={handleCancelDelete}
        dialogTitle="Confirm Deletion"
        dialogContentText="Are you sure you want to delete this item?"
      />

    </div>
  );
}

export default AddRetunsTableDetails;
