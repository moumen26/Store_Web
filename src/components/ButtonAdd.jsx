import { PlusIcon } from "@heroicons/react/16/solid";
import React from "react";

export default function ButtonAdd({ buttonSpan }) {
  return (
    <button className="buttonAdd">
      <PlusIcon className="iconAsideBar" />
      <span className="buttonTextLight">Add {buttonSpan}</span>
    </button>
  );
}
