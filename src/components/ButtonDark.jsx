import React from "react";

export default function ButtonDark({ buttonSpan, setOnClick, language }) {
  return (
    <button className="buttonDark" onClick={setOnClick}>
      <span
        style={{ fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "" }}
        className="buttonTextLight"
      >
        {buttonSpan}
      </span>
    </button>
  );
}
