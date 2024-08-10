import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonAdd from "../components/ButtonAdd";
import CustomerTable from "../components/CustomerTable";
import ButtonExportExel from "../components/ButtonExportExel";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/solid";

export default function Fournisseurs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newFournisseur, setNewFournisseur] = useState({
    fournisseurFirstName: "",
    fournisseurLastName: "",
    fournisseurAddress: "",
    fournisseurPhone: "",
    fournisseurWilaya: "",
    fournisseurCommune: "",
    fournisseurPhoto: null,
  });
  const [isFormValid, setIsFormValid] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddFournisseurClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddFournisseur = () => {
    if (validateForm()) {
      console.log("New Fournisseur:", newFournisseur);
      setOpenDialog(false);
      setNewFournisseur({
        fournisseurFirstName: "",
        fournisseurLastName: "",
        fournisseurAddress: "",
        fournisseurPhone: "",
        fournisseurWilaya: "",
        fournisseurCommune: "",
        fournisseurPhoto: null,
      });
      setImage(null);
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFournisseur((prev) => ({ ...prev, [name]: value }));
    setIsFormValid(validateForm({ ...newFournisseur, [name]: value }));
  };

  const validateForm = (fournisseur = newFournisseur) => {
    return (
      fournisseur.fournisseurFirstName &&
      fournisseur.fournisseurLastName &&
      fournisseur.fournisseurAddress &&
      fournisseur.fournisseurPhone &&
      fournisseur.fournisseurWilaya &&
      fournisseur.fournisseurCommune
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
        setNewFournisseur((prev) => ({
          ...prev,
          fournisseurPhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const wilayas = [
    { value: "", label: "-- Select Fournisseur Wilaya --" },
    { value: "wilaya1", label: "Wilaya 1" },
    { value: "wilaya2", label: "Wilaya 2" },
  ];

  const communes = [
    { value: "", label: "-- Select Fournisseur Commune --" },
    { value: "commune1", label: "Commune 1" },
    { value: "commune2", label: "Commune 2" },
  ];

  return (
    <div className="pagesContainer">
      <Header />
      <div className="w-full flex items-center justify-between">
        <h2 className="pagesTitle">Fournisseurs</h2>
        <ButtonAdd
          buttonSpan="Add New Fournisseur"
          onClick={handleAddFournisseurClick}
        />
      </div>
      <div className="pageTable">
        <div className="w-full flex items-center justify-between">
          <Search
            placeholder="Search by Fournisseur..."
            onChange={handleSearchChange}
          />
          <ButtonExportExel data={filteredData} filename="Fournisseurs" />
        </div>
        <div className="pageTableContainer">
         
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
            <h2 className="dialogTitle">Add New Fournisseur</h2>
          </div>
          {showAlert && (
            <Alert severity="error" onClose={() => setShowAlert(false)}>
              Please fill in all required fields.
            </Alert>
          )}
          <div className="flex-col items-center w-full space-y-8 mt-4 p-[20px] pl-[48px] pr-[48px]">
            <div className="dialogAddCustomerItem items-center">
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
            <div className="dialogAddCustomerItem items-center">
              <span>First Name</span>
              <div className="inputForm">
                <input
                  type="text"
                  name="fournisseurFirstName"
                  value={newFournisseur.fournisseurFirstName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="dialogAddCustomerItem items-center">
              <span>Last Name</span>
              <div className="inputForm">
                <input
                  type="text"
                  name="fournisseurLastName"
                  value={newFournisseur.fournisseurLastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="dialogAddCustomerItem items-center">
              <span>Number Phone</span>
              <div className="inputForm">
                <input
                  type="phone"
                  name="fournisseurPhone"
                  value={newFournisseur.fournisseurPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="dialogAddCustomerItem items-center">
              <span>Address</span>
              <div className="inputForm">
                <input
                  type="text"
                  name="fournisseurAddress"
                  value={newFournisseur.fournisseurAddress}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="dialogAddCustomerItem items-center">
              <div className="flex space-x-8 items-center">
                <span>Wilaya</span>
                <div className="selectStoreWilayaCommune">
                  <select
                    name="fournisseurWilaya"
                    value={newFournisseur.fournisseurWilaya}
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
              <div className="flex space-x-8 items-center">
                <span>Commune</span>
                <div className="selectStoreWilayaCommune">
                  <select
                    name="fournisseurCommune"
                    value={newFournisseur.fournisseurCommune}
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
              onClick={handleAddFournisseur}
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
