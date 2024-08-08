import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonAdd from "../components/ButtonAdd";
import VendorsTable from "../components/VendorsTable";
import ButtonExportExel from "../components/ButtonExportExel";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/solid";

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customerFirstName: "",
    customerLastName: "",
    storeName: "",
    storeAddress: "",
    customerPhone: "",
    storeCategory: "",
    storeWilaya: "",
    storeCommune: "",
    customerPhoto: null,
    isVendor: true,
  });
  const [isFormValid, setIsFormValid] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddCustomerClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddCustomer = () => {
    if (validateForm()) {
      console.log("New Customer:", newCustomer);
      setOpenDialog(false);
      setNewCustomer({
        customerFirstName: "",
        customerLastName: "",
        storeName: "",
        storeAddress: "",
        customerPhone: "",
        storeCategory: "",
        storeWilaya: "",
        storeCommune: "",
        customerPhoto: null,
        isVendor: true,
      });
      setImage(null);
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
    setIsFormValid(validateForm({ ...newCustomer, [name]: value }));
  };

  const validateForm = (customer = newCustomer) => {
    return (
      customer.customerFirstName &&
      customer.customerLastName &&
      customer.storeName &&
      customer.storeAddress &&
      customer.customerPhone &&
      customer.storeCategory &&
      customer.storeWilaya &&
      customer.storeCommune
    );
  };

  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setNewCustomer((prev) => ({ ...prev, customerPhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const wilayas = [
    { value: "", label: "-- Select Store Wilaya --" },
    { value: "wilaya1", label: "Wilaya 1" },
    { value: "wilaya2", label: "Wilaya 2" },
  ];

  const communes = [
    { value: "", label: "-- Select Store Commune --" },
    { value: "commune1", label: "Commune 1" },
    { value: "commune2", label: "Commune 2" },
  ];

  const storeCategory = [
    { value: "", label: "-- Select Store Category --" },
    { value: "alimentation", label: "Alimentation" },
    { value: "detergent", label: "Detergent" },
  ];

  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Vendors</h2>
        <ButtonAdd
          buttonSpan="Add New Vendor"
          onClick={handleAddCustomerClick}
        />
      </div>
      <div className="pageTable">
        <div className="w-full flex items-center justify-between">
          <Search
            placeholder="Search by Customer..."
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Vendors" />
        </div>
        <div className="pageTableContainer">
          <VendorsTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
          />
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <div className="dialogAdd">
          <div className="flex items-center space-x-3 title">
            <div className="cercleIcon">
              <UserPlusIcon className="iconAsideBar" />
            </div>
            <h2 className="dialogTitle">Add New Vendor</h2>
          </div>
          {showAlert && (
            <Alert severity="error" onClose={() => setShowAlert(false)}>
              Please fill in all required fields.
            </Alert>
          )}
          <div className="flex-col items-center w-full space-y-[28px] mt-4 p-[20px] pl-[48px] pr-[48px]">
            <div className="dialogAddCustomerItem">
              <span>Picture</span>
              <div className="flex items-center space-x-4">
                <div
                  className="w-[80px] h-[80px] bg-slate-200 rounded-full cursor-pointer flex items-center justify-center relative overflow-hidden"
                  onClick={handleClick}
                >
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <PhotoIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="h-[80px] w-[404px] flex items-center justify-center uploadClass">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <p onClick={handleClick} className="uploadSpan">
                    <span className="text-blue-600">Click to upload</span> or
                    drag and drop SVG, PNG, JPG
                  </p>
                </div>
              </div>
            </div>
            <div className="dialogAddCustomerItem">
              <span>First Name</span>
              <div className="inputForm">
                <input
                  type="text"
                  name="customerFirstName"
                  value={newCustomer.customerFirstName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="dialogAddCustomerItem">
              <span>Last Name</span>
              <div className="inputForm">
                <input
                  type="text"
                  name="customerLastName"
                  value={newCustomer.customerLastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="dialogAddCustomerItem">
              <span>Store Name</span>
              <div className="inputForm">
                <input
                  type="text"
                  name="storeName"
                  value={newCustomer.storeName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="dialogAddCustomerItem">
              <span>Store Category</span>
              <div className="inputForm">
                <select
                  className="selectStoreCategory"
                  name="storeCategory"
                  value={newCustomer.storeCategory}
                  onChange={handleInputChange}
                >
                  {storeCategory.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="dialogAddCustomerItem">
              <span>Number Phone</span>
              <div className="inputForm">
                <input
                  type="phone"
                  name="customerPhone"
                  value={newCustomer.customerPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="dialogAddCustomerItem">
              <span>Address</span>
              <div className="inputForm">
                <input
                  type="text"
                  name="storeAddress"
                  value={newCustomer.storeAddress}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="dialogAddCustomerItem">
              <div className="flex space-x-8">
                <span>Wilaya</span>
                <div className="selectStoreWilayaCommune">
                  <select
                    name="storeWilaya"
                    value={newCustomer.storeWilaya}
                    onChange={handleInputChange}
                  >
                    {wilayas.map((wilaya) => (
                      <option key={wilaya.value} value={wilaya.value}>
                        {wilaya.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex space-x-8">
                <span>Commune</span>
                <div className="selectStoreWilayaCommune">
                  <select
                    name="storeCommune"
                    value={newCustomer.storeCommune}
                    onChange={handleInputChange}
                  >
                    {communes.map((commune) => (
                      <option key={commune.value} value={commune.value}>
                        {commune.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-8 pr-8 items-start h-[40px] mt-2">
            <button
              className="text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={handleCloseDialog}
            >
              Cancel
            </button>
            <button
              className={`text-blue-500 cursor-pointer hover:text-blue-700 ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleAddCustomer}
              disabled={!isFormValid}
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
