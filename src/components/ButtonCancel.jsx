import React from "react";
import { useNavigate } from "react-router-dom";

export default function ButtonCancel({ language }) {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <button className="buttonLight" onClick={handleCancel}>
      <span className="buttonTextDark">
        {language === "ar" ? "إلغاء" : "Annuler"}
      </span>
    </button>
  );
}
