import React from "react";

export default function ButtonSave({ setOnClick, language }) {
  return (
    <button className="buttonDarkSave" onClick={setOnClick}>
      <span
        style={{
          fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
        }}
        className="buttonTextLight"
      >
        {language === "ar" ? "حفظ" : "Enregistrer"}
      </span>
    </button>
  );
}
