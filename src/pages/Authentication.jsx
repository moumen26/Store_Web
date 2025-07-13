import React, { useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import ButtonAdd from "../components/ButtonAdd";
import AuthenticationTable from "../components/AuthenticationTable";
import ButtonExportExel from "../components/ButtonExportExel";
import { EqualsIcon } from "@heroicons/react/16/solid";

export default function Authentication({ onToggle, toggleLanguage, language }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div
      className="pagesContainer"
      style={{ direction: language === "ar" ? "rtl" : "ltr" }}
    >
      <div className="pagesContainerTop">
        <div className="flexHeader">
          <div onClick={onToggle} className="equalsIcon">
            <EqualsIcon className="iconAsideBarClose" />
          </div>
          <Header toggleLanguage={toggleLanguage} language={language} />
        </div>{" "}
        <div className="titlePageButton h-[48px]">
          <h2
            className="pagesTitle"
            style={{
              fontFamily: language === "ar" ? "Cairo-Regular, sans-serif" : "",
            }}
          >
            {language === "ar" ? "مصادقة الزبائن" : "Autorisation clients"}
          </h2>
          {/* <ButtonAdd buttonSpan="New Customer" /> */}
        </div>
      </div>

      <div
        className="pageTable"
        style={{
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          boxShadow: "0 0 4px rgba(0, 0, 0, 0.05), 0 0 2px rgba(0, 0, 0, 0.03)",
          background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
        }}
      >
        <div className="addProductModalHeader">
          <Search
            placeholder={
              language === "ar"
                ? "البحث عن طريق الزبون..."
                : "Rechercher par client..."
            }
            onChange={handleSearchChange}
            language={language}
          />
          <ButtonExportExel
            data={filteredData}
            filename={
              language === "ar"
                ? "مصادقة المستخدمين"
                : "Authentification des utilisateurs"
            }
            language={language}
          />
        </div>
        <div className="pageTableContainer">
          <AuthenticationTable
            searchQuery={searchQuery}
            setFilteredData={setFilteredData}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}
