import React from "react";
import { useNavigate } from "react-router-dom";

export default function ButtonCancel({ language }) {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <button className="buttonLight" onClick={handleCancel}>
      <span
        style={{
          fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
        }}
        className="buttonTextDark"
      >
        {language === "ar" ? "إلغاء" : "Annuler"}
      </span>
    </button>
  );
}
