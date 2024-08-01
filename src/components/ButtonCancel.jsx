import React from "react";
import { useNavigate } from "react-router-dom";

export default function ButtonCancel() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <button className="buttonLight" onClick={handleCancel}>
      <span className="buttonTextDark">Cancel</span>
    </button>
  );
}
