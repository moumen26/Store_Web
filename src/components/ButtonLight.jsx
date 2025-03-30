import React from "react";

export default function ButtonLight({ buttonSpan, onClick, language }) {
  return (
    <button className="buttonLight" onClick={onClick}>
      <span className="buttonTextDark">{buttonSpan}</span>
    </button>
  );
}
