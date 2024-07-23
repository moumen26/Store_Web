import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function Search({ placeholder }) {
  return (
    <div className="inputForm bg-white">
      <MagnifyingGlassIcon className="inputIcon" />
      <input type="search" placeholder={placeholder} />
    </div>
  );
}
