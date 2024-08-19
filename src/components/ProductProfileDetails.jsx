import PropTypes from "prop-types";
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { PencilIcon } from "@heroicons/react/24/outline";

function ProductProfileRow({
  product,
  isEditing,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onChange,
  editedProduct,
  showSubName,
  showBoxItems,
}) {
  const handleNumericChange = (field, value) => {
    if (!isNaN(value) || value === "") {
      onChange(field, value);
    }
  };

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }} className="tableRow">
      <TableCell className="tableCell">
        <span className="trTableSpan">{product.id}</span>
      </TableCell>
      {showSubName && (
        <TableCell className="tableCell">
          {isEditing ? (
            <input
              type="text"
              value={editedProduct.subName}
              onChange={(e) => onChange("subName", e.target.value)}
              className="editable-input"
            />
          ) : (
            <span className="trTableSpan">{product.subName}</span>
          )}
        </TableCell>
      )}
      <TableCell className="tableCell">
        <span className="trTableSpan">{product.name}</span>
      </TableCell>
      <TableCell className="tableCell">
        <span className="trTableSpan">{product.brand}</span>
      </TableCell>
      {showBoxItems && (
        <TableCell className="tableCell">
          <span className="trTableSpan">{product.boxItems}</span>
        </TableCell>
      )}
      <TableCell className="tableCell">
        {isEditing ? (
          <input
            type="number"
            value={editedProduct.buyingPrice}
            onChange={(e) => handleNumericChange("buyingPrice", e.target.value)}
            className="editable-input"
            min="0"
          />
        ) : (
          <span className="trTableSpan">{product.buyingPrice} DA</span>
        )}
      </TableCell>
      <TableCell className="tableCell">
        {isEditing ? (
          <input
            type="number"
            value={editedProduct.sellPrice}
            onChange={(e) => handleNumericChange("sellPrice", e.target.value)}
            className="editable-input"
            min="0"
          />
        ) : (
          <span className="trTableSpan">{product.sellPrice} DA</span>
        )}
      </TableCell>
      <TableCell className="tableCell">
        {isEditing ? (
          <input
            type="number"
            value={editedProduct.stock}
            onChange={(e) => handleNumericChange("stock", e.target.value)}
            className="editable-input"
            min="0"
          />
        ) : (
          <span className="trTableSpan">{product.stock}</span>
        )}
      </TableCell>
      <TableCell className="tableCell w-[100px]">
        <div className="flex items-center justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                className="text-green-500 cursor-pointer hover:text-green-700"
                onClick={onSaveClick}
              >
                Save
              </button>
              <button
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={onCancelClick}
              >
                Cancel
              </button>
            </>
          ) : (
            <PencilIcon
              className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={onEditClick}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

ProductProfileRow.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    buyingPrice: PropTypes.number.isRequired,
    sellPrice: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    subName: PropTypes.string,
    boxItems: PropTypes.number,
  }).isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onSaveClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  editedProduct: PropTypes.object.isRequired,
  showSubName: PropTypes.bool.isRequired,
  showBoxItems: PropTypes.bool.isRequired,
};

export default function ProductProfileDetails({ product, onSave, onCancel }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({ ...product });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave(editedProduct);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedProduct({ ...product });
    setIsEditing(false);
    onCancel();
  };

  const handleChange = (field, value) => {
    setEditedProduct((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const showSubName = product.subName !== undefined;
  const showBoxItems = product.boxItems !== undefined;

  return (
    <TableContainer
      component={Paper}
      style={{ boxShadow: "none" }}
      className="tablePages"
    >
      <Table aria-label="product profile details">
        <TableHead className="tableHead">
          <TableRow>
            <TableCell className="tableCell">
              <span className="thTableSpan">Product Code</span>
            </TableCell>
            {showSubName && (
              <TableCell className="tableCell">
                <span className="thTableSpan">Sub Name</span>
              </TableCell>
            )}
            <TableCell className="tableCell">
              <span className="thTableSpan">Name</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Brand</span>
            </TableCell>
            {showBoxItems && (
              <TableCell className="tableCell">
                <span className="thTableSpan">Box Items</span>
              </TableCell>
            )}
            <TableCell className="tableCell">
              <span className="thTableSpan">Buying Price</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Selling Price</span>
            </TableCell>
            <TableCell className="tableCell">
              <span className="thTableSpan">Stock</span>
            </TableCell>
            <TableCell align="right" className="tableCell">
              <span className="thTableSpan">Action</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ProductProfileRow
            product={product}
            isEditing={isEditing}
            onEditClick={handleEditClick}
            onSaveClick={handleSaveClick}
            onCancelClick={handleCancelClick}
            onChange={handleChange}
            editedProduct={editedProduct}
            showSubName={showSubName}
            showBoxItems={showBoxItems}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ProductProfileDetails.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    buyingPrice: PropTypes.number.isRequired,
    sellPrice: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    subName: PropTypes.string,
    boxItems: PropTypes.number,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
