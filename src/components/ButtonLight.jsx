import React from "react";

export default function ButtonLight({ buttonSpan, onClick }) {
  return (
    <button className="buttonLight" onClick={onClick}>
      <span className="buttonTextDark">{buttonSpan}</span>
    </button>
  );
}
