import React from "react";

export default function ButtonDark({ buttonSpan }) {
  return (
    // <button className="buttonDark">
    //   <span className="buttonTextLight">{buttonSpan}</span>
    // </button>
    <a
      href="/Dashboard"
      className="buttonDark flex justify-center items-center"
    >
      <span className="buttonTextLight">{buttonSpan}</span>
    </a>
  );
}
