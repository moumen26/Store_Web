import React from "react";
import FacebokIcon from "../assets/icons/FacebookLight.png";

export default function ButtonFacebok({ language }) {
  const isArabic = language === "ar";

  return (
    <button
      className={`buttonFacebook flex items-center ${
        isArabic ? "flex-row-reverse bg-red-400" : ""
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <img
        src={FacebokIcon}
        alt="Facebook"
        className={isArabic ? "ml-2" : "mr-2"}
      />
      <span
        style={{
          fontFamily: isArabic ? "Cairo-Regular, sans-serif" : "",
        }}
        className="buttonTextDark"
      >
        {isArabic ? "تسجيل الدخول عبر فيسبوك" : "Se connecter avec Facebook"}
      </span>
    </button>
  );
}
