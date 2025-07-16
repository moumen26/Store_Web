import React from "react";
import FacebokIcon from "../assets/icons/FacebookLight.png";

export default function ButtonFacebok({ language }) {
  const isArabic = language === "ar";

  return (
    <button
      className={`buttonFacebook flex items-center justify-center ${
        isArabic ? "flex-row-reverse" : ""
      }`}
    >
      <img
        src={FacebokIcon}
        alt="Facebook"
        className={`w-5 h-5 ${isArabic ? "ml-2" : "mr-2"}`}
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
