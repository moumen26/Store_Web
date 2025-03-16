import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function Search({ placeholder, language, value, onChange }) {
  return (
    <div className="inputForm searchInput bg-white"
    >
      <MagnifyingGlassIcon className="inputIcon" />
      <input
      className={`${language === "ar" ? "mr-2" : ""}`}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
