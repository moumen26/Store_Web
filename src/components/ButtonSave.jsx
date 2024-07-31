import React from "react";

export default function ButtonSave({ setOnClick }) {
  return (
    <button className="buttonDarkSave" onClick={setOnClick}>
      <span className="buttonTextLight">Save</span>
    </button>
  );
}
