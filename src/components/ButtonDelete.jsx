import React from "react";

export default function ButtonDelete({ setOnClick }) {
  return (
    <button className="buttonDelete" onClick={setOnClick}>
      <span className="buttonTextDelete">Delete Account</span>
    </button>
  );
}
