import React from "react";

export default function ButtonDelete({ setOnClick, language = "fr" }) {
  return (
    <button className="buttonDelete" onClick={setOnClick}>
      <span className="buttonTextDelete">
        {language === "ar" ? "حذف الحساب" : "Supprimer le compte"}
      </span>
    </button>
  );
}
