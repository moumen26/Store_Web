import React from "react";

export default function ButtonLight({ buttonSpan, onClick, language }) {
  return (
    <button className="buttonLight" onClick={onClick}>
      <span
        style={{
          fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
        }}
        className="buttonTextDark"
      >
        {buttonSpan}
      </span>
    </button>
  );
}
