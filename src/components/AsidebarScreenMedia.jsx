import {
  ArchiveBoxIcon,
  ArrowTrendingDownIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  Square2StackIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  DevicePhoneMobileIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/16/solid";
// import Logo from "../assets/Logo-mosagro.png";
import Logo from "../assets/Dark.png";

export default function AsidebarScreenMedia({ language = "fr" }) {
  const location = useLocation();
  const { logout } = useLogout();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAchatsOpen, setIsAchatsOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    if (
      !event.target.closest(".sidebar-container") &&
      !event.target.closest(".toggle-button")
    ) {
      setIsSidebarOpen(false);
    }
  };

  const handleProductsClick = () => setIsProductsOpen((prev) => !prev);
  const handleOrdersClick = () => setIsOrdersOpen((prev) => !prev);
  const handleAchatsClick = () => setIsAchatsOpen((prev) => !prev);

  // Auto-expand the dropdown when a child route is active
  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/Products")) {
      setIsProductsOpen(true);
    }

    if (
      path.includes("/Orders") ||
      path.includes("CreditOrders") ||
      path.includes("ReturnsOrders") ||
      path.includes("OrdersArchive")
    ) {
      setIsOrdersOpen(true);
    }

    if (
      path.includes("/Purchases") ||
      path.includes("CreditPurchases") ||
      path.includes("ReturnsPurchases") ||
      path.includes("PuchasesArchive")
    ) {
      setIsAchatsOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const submitLogout = () => {
    logout();
  };

  // Styling classes matching the desktop version
  const activeItemClass = "bg-[#2388FF] text-white border-[#2388FF] shadow-sm";
  const hoverItemClass = "hover:bg-[#353E5C] hover:text-white";
  const normalItemClass = "text-[#C3DDFF]";
  const iconClass = "text-[#E3EFFF]";
  const chevronClass = "text-[#C3DDFF]";

  const activeSubmenuClass =
    "bg-[#2388FF] text-white font-medium border-l-2 border-[#2388FF]";
  const normalSubmenuClass =
    "text-[#E3EFFF] font-normal hover:bg-[#353E5C] hover:text-white";

  return (
    <div
      className={`fixed z-50 md:hidden ${
        language === "ar" ? "direction-rtl" : ""
      }`}
    >
      {/* Toggle Button */}
      <div
        className={`toggle-button cursor-pointer fixed top-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 ${
          language === "ar" ? "right-4" : "left-4"
        }`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <XMarkIcon className="h-5 w-5 text-gray-700" />
        ) : (
          <Bars3Icon className="h-5 w-5 text-gray-700" />
        )}
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-container fixed top-0 bottom-0 bg-[#19213D] w-[85vw] max-w-sm shadow-2xl transition-transform duration-300 z-50 overflow-y-auto
          ${language === "ar" ? "right-0" : "left-0"}
          ${
            isSidebarOpen
              ? "translate-x-0"
              : language === "ar"
              ? "translate-x-full"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex justify-center items-center py-8 px-4 border-b border-[#353E5C]">
          <img src={Logo} alt="Store Logo" className="w-48 h-auto" />
        </div>

        {/* Navigation */}
        <div className="p-4">
          <ul className="flex flex-col space-y-2">
            {/* Dashboard */}
            <li>
              <NavLink to="/Dashboard" className="flex items-center">
                <div
                  className={`flex items-center w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                    location.pathname === "/" ||
                    location.pathname === "/Dashboard"
                      ? activeItemClass
                      : ""
                  } ${
                    language === "ar"
                      ? "flex-row-reverse border-r-4 pr-3"
                      : "border-l-4"
                  }`}
                >
                  <Squares2X2Icon
                    className={`w-5 h-5 ${
                      location.pathname === "/" ||
                      location.pathname === "/Dashboard"
                        ? "text-white"
                        : iconClass
                    }`}
                  />
                  <span
                    className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "fr" ? "Tableau de Bord" : "الرئيسية"}
                  </span>
                </div>
              </NavLink>
            </li>

            {/* Products */}
            <li className="flex flex-col space-y-2">
              <div className="flex items-center cursor-pointer w-full">
                <div
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                    location.pathname.includes("/Products")
                      ? activeItemClass
                      : ""
                  } ${
                    language === "ar"
                      ? "flex-row-reverse border-r-4 pr-3"
                      : "border-l-4"
                  }`}
                  onClick={handleProductsClick}
                >
                  <div
                    className={`flex items-center ${
                      language === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <ArchiveBoxIcon
                      className={`w-5 h-5 ${
                        location.pathname.includes("/Products")
                          ? "text-white"
                          : iconClass
                      }`}
                    />
                    <span
                      className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr" ? "Produits" : "المنتجات"}
                    </span>
                  </div>
                  <ChevronDownIcon
                    className={`w-4 h-4 ${chevronClass} transition-transform duration-200 ${
                      isProductsOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              {isProductsOpen && (
                <div className="flex flex-col space-y-1 pl-4">
                  <NavLink to="/ProductsList" className="flex items-center">
                    <div
                      className={`flex items-center w-full px-4 py-2 rounded-lg ${
                        location.pathname === "/ProductsList"
                          ? activeSubmenuClass
                          : normalSubmenuClass
                      } text-xs transition-all duration-200 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          language === "ar" ? "mr-7" : "ml-7"
                        }`}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "fr"
                          ? "Liste des Produits"
                          : "مخزون المنتجات"}
                      </span>
                    </div>
                  </NavLink>
                  <NavLink to="/ProductsGrid" className="flex items-center">
                    <div
                      className={`flex items-center w-full px-4 py-2 rounded-lg ${
                        location.pathname === "/ProductsGrid"
                          ? activeSubmenuClass
                          : normalSubmenuClass
                      } text-xs transition-all duration-200 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          language === "ar" ? "mr-7" : "ml-7"
                        }`}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "fr"
                          ? "Catalogue Produits"
                          : "قائمة المنتجات"}
                      </span>
                    </div>
                  </NavLink>
                </div>
              )}
            </li>

            {/* Orders */}
            <li className="flex flex-col space-y-2">
              <div className="flex items-center cursor-pointer">
                <div
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                    location.pathname.includes("/Orders") ||
                    location.pathname.includes("CreditOrders") ||
                    location.pathname.includes("ReturnsOrders") ||
                    location.pathname.includes("OrdersArchive")
                      ? activeItemClass
                      : ""
                  } ${
                    language === "ar"
                      ? "flex-row-reverse border-r-4 pr-3"
                      : "border-l-4"
                  }`}
                  onClick={handleOrdersClick}
                >
                  <div
                    className={`flex items-center ${
                      language === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <ShoppingBagIcon
                      className={`w-5 h-5 ${
                        location.pathname.includes("/Orders") ||
                        location.pathname.includes("CreditOrders") ||
                        location.pathname.includes("ReturnsOrders") ||
                        location.pathname.includes("OrdersArchive")
                          ? "text-white"
                          : iconClass
                      }`}
                    />
                    <span
                      className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr" ? "Commandes" : "الطلبات"}
                    </span>
                  </div>
                  <ChevronDownIcon
                    className={`w-4 h-4 ${chevronClass} transition-transform duration-200 ${
                      isOrdersOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              {isOrdersOpen && (
                <div className="flex flex-col space-y-1 pl-4">
                  <NavLink to="/Orders" className="flex items-center">
                    <div
                      className={`flex items-center w-full px-4 py-2 rounded-lg ${
                        location.pathname === "/Orders"
                          ? activeSubmenuClass
                          : normalSubmenuClass
                      } text-xs transition-all duration-200 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          language === "ar" ? "mr-7" : "ml-7"
                        }`}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "fr"
                          ? "Commandes Récentes"
                          : "أحدث الطلبات"}
                      </span>
                    </div>
                  </NavLink>
                  <NavLink
                    to="/Orders/InPreparation"
                    className="flex items-center"
                  >
                    <div
                      className={`flex items-center w-full px-4 py-2 rounded-lg ${
                        location.pathname === "/Orders/InPreparation"
                          ? activeSubmenuClass
                          : normalSubmenuClass
                      } text-xs transition-all duration-200 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          language === "ar" ? "mr-7" : "ml-7"
                        }`}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "fr"
                          ? "Commandes en Préparation"
                          : "الطلبات قيد التحضير"}
                      </span>
                    </div>
                  </NavLink>
                  <NavLink to="/CreditOrders" className="flex items-center">
                    <div
                      className={`flex items-center w-full px-4 py-2 rounded-lg ${
                        location.pathname === "/CreditOrders"
                          ? activeSubmenuClass
                          : normalSubmenuClass
                      } text-xs transition-all duration-200 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          language === "ar" ? "mr-7" : "ml-7"
                        }`}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "fr"
                          ? "Commandes à Crédit"
                          : "الطلبات بالائتمان"}
                      </span>
                    </div>
                  </NavLink>
                  <NavLink to="/ReturnsOrders" className="flex items-center">
                    <div
                      className={`flex items-center w-full px-4 py-2 rounded-lg ${
                        location.pathname === "/ReturnsOrders"
                          ? activeSubmenuClass
                          : normalSubmenuClass
                      } text-xs transition-all duration-200 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          language === "ar" ? "mr-7" : "ml-7"
                        }`}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "fr"
                          ? "Retours Clients"
                          : "طلبات الإرجاع"}
                      </span>
                    </div>
                  </NavLink>
                  <NavLink to="/OrdersArchive" className="flex items-center">
                    <div
                      className={`flex items-center w-full px-4 py-2 rounded-lg ${
                        location.pathname === "/OrdersArchive"
                          ? activeSubmenuClass
                          : normalSubmenuClass
                      } text-xs transition-all duration-200 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          language === "ar" ? "mr-7" : "ml-7"
                        }`}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "fr"
                          ? "Archives des Commandes"
                          : "أرشيف الطلبات"}
                      </span>
                    </div>
                  </NavLink>
                </div>
              )}
            </li>

            {/* Purchases */}
            <li className="flex flex-col space-y-2">
              <div className="flex items-center cursor-pointer">
                <div
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                    location.pathname.includes("/Purchases") ||
                    location.pathname.includes("CreditPurchases") ||
                    location.pathname.includes("ReturnsPurchases") ||
                    location.pathname.includes("PuchasesArchive")
                      ? activeItemClass
                      : ""
                  } ${
                    language === "ar"
                      ? "flex-row-reverse border-r-4 pr-3"
                      : "border-l-4"
                  }`}
                  onClick={handleAchatsClick}
                >
                  <div
                    className={`flex items-center ${
                      language === "ar" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <ClipboardDocumentCheckIcon
                      className={`w-5 h-5 ${
                        location.pathname.includes("/Purchases") ||
                        location.pathname.includes("CreditPurchases") ||
                        location.pathname.includes("ReturnsPurchases") ||
                        location.pathname.includes("PuchasesArchive")
                          ? "text-white"
                          : iconClass
                      }`}
                    />
                    <span
                      className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                      style={{
                        fontFamily:
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr" ? "Achats" : "المشتريات"}
                    </span>
                  </div>
                  <ChevronDownIcon
                    className={`w-4 h-4 ${chevronClass} transition-transform duration-200 ${
                      isAchatsOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
              {isAchatsOpen && (
                <div className="flex flex-col space-y-1 pl-4">
                  <NavLink to="/Purchases" className="flex items-center">
                    <div
                      className={`flex items-center w-full px-4 py-2 rounded-lg ${
                        location.pathname === "/Purchases"
                          ? activeSubmenuClass
                          : normalSubmenuClass
                      } text-xs transition-all duration-200 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          language === "ar" ? "mr-7" : "ml-7"
                        }`}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "fr"
                          ? "Achats Récents"
                          : "أحدث المشتريات"}
                      </span>
                    </div>
                  </NavLink>
                  <NavLink to="/CreditPurchases" className="flex items-center">
                    <div
                      className={`flex items-center w-full px-4 py-2 rounded-lg ${
                        location.pathname === "/CreditPurchases"
                          ? activeSubmenuClass
                          : normalSubmenuClass
                      } text-xs transition-all duration-200 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          language === "ar" ? "mr-7" : "ml-7"
                        }`}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "fr"
                          ? "Achats à Crédit"
                          : "المشتريات بالائتمان"}
                      </span>
                    </div>
                  </NavLink>
                  <NavLink to="/ReturnsPurchases" className="flex items-center">
                    <div
                      className={`flex items-center w-full px-4 py-2 rounded-lg ${
                        location.pathname === "/ReturnsPurchases"
                          ? activeSubmenuClass
                          : normalSubmenuClass
                      } text-xs transition-all duration-200 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          language === "ar" ? "mr-7" : "ml-7"
                        }`}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "fr"
                          ? "Retours Fournisseurs"
                          : "إرجاع المشتريات"}
                      </span>
                    </div>
                  </NavLink>
                  <NavLink to="/PuchasesArchive" className="flex items-center">
                    <div
                      className={`flex items-center w-full px-4 py-2 rounded-lg ${
                        location.pathname === "/PuchasesArchive"
                          ? activeSubmenuClass
                          : normalSubmenuClass
                      } text-xs transition-all duration-200 ${
                        language === "ar" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          language === "ar" ? "mr-7" : "ml-7"
                        }`}
                        style={{
                          fontFamily:
                            language === "ar"
                              ? "Cairo-Regular, sans-serif"
                              : "",
                        }}
                      >
                        {language === "fr"
                          ? "Archives des Achats"
                          : "أرشيف المشتريات"}
                      </span>
                    </div>
                  </NavLink>
                </div>
              )}
            </li>

            {/* Other Navigation Items */}
            <li>
              <NavLink to="/Customers" className="flex items-center">
                <div
                  className={`flex items-center w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                    location.pathname === "/Customers" ? activeItemClass : ""
                  } ${
                    language === "ar"
                      ? "flex-row-reverse border-r-4 pr-3"
                      : "border-l-4"
                  }`}
                >
                  <UserGroupIcon
                    className={`w-5 h-5 ${
                      location.pathname === "/Customers"
                        ? "text-white"
                        : iconClass
                    }`}
                  />
                  <span
                    className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "fr" ? "Clients" : "العملاء"}
                  </span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink to="/Vendors" className="flex items-center">
                <div
                  className={`flex items-center w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                    location.pathname === "/Vendors" ? activeItemClass : ""
                  } ${
                    language === "ar"
                      ? "flex-row-reverse border-r-4 pr-3"
                      : "border-l-4"
                  }`}
                >
                  <UsersIcon
                    className={`w-5 h-5 ${
                      location.pathname === "/Vendors"
                        ? "text-white"
                        : iconClass
                    }`}
                  />
                  <span
                    className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "fr" ? "Vendeurs" : "البائعين"}
                  </span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink to="/Fournisseurs" className="flex items-center">
                <div
                  className={`flex items-center w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                    location.pathname === "/Fournisseurs" ? activeItemClass : ""
                  } ${
                    language === "ar"
                      ? "flex-row-reverse border-r-4 pr-3"
                      : "border-l-4"
                  }`}
                >
                  <UserIcon
                    className={`w-5 h-5 ${
                      location.pathname === "/Fournisseurs"
                        ? "text-white"
                        : iconClass
                    }`}
                  />
                  <span
                    className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "fr" ? "Fournisseurs" : "الموردين"}
                  </span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink to="/Authentication" className="flex items-center">
                <div
                  className={`flex items-center w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                    location.pathname === "/Authentication"
                      ? activeItemClass
                      : ""
                  } ${
                    language === "ar"
                      ? "flex-row-reverse border-r-4 pr-3"
                      : "border-l-4"
                  }`}
                >
                  <UserPlusIcon
                    className={`w-5 h-5 ${
                      location.pathname === "/Authentication"
                        ? "text-white"
                        : iconClass
                    }`}
                  />
                  <span
                    className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "fr"
                      ? "Authentification Clients"
                      : "مصادقة الزبائن"}
                  </span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink to="/Losses" className="flex items-center">
                <div
                  className={`flex items-center w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                    location.pathname === "/Losses" ? activeItemClass : ""
                  } ${
                    language === "ar"
                      ? "flex-row-reverse border-r-4 pr-3"
                      : "border-l-4"
                  }`}
                >
                  <ArrowTrendingDownIcon
                    className={`w-5 h-5 ${
                      location.pathname === "/Losses" ? "text-white" : iconClass
                    }`}
                  />
                  <span
                    className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "fr" ? "Pertes & Casse" : "الخسائر"}
                  </span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink to="/Publicite" className="flex items-center">
                <div
                  className={`flex items-center w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                    location.pathname === "/Publicite" ? activeItemClass : ""
                  } ${
                    language === "ar"
                      ? "flex-row-reverse border-r-4 pr-3"
                      : "border-l-4"
                  }`}
                >
                  <DevicePhoneMobileIcon
                    className={`w-5 h-5 ${
                      location.pathname === "/Publicite"
                        ? "text-white"
                        : iconClass
                    }`}
                  />
                  <span
                    className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "fr" ? "Marketing & Publicité" : "الإعلانات"}
                  </span>
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink to="/Settings" className="flex items-center">
                <div
                  className={`flex items-center w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                    location.pathname === "/Settings" ? activeItemClass : ""
                  } ${
                    language === "ar"
                      ? "flex-row-reverse border-r-4 pr-3"
                      : "border-l-4"
                  }`}
                >
                  <Cog6ToothIcon
                    className={`w-5 h-5 ${
                      location.pathname === "/Settings"
                        ? "text-white"
                        : iconClass
                    }`}
                  />
                  <span
                    className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "fr" ? "Paramètres" : "الإعدادات"}
                  </span>
                </div>
              </NavLink>
            </li>

            {/* Logout */}
            <li>
              <div
                className="flex items-center cursor-pointer"
                onClick={submitLogout}
              >
                <div
                  className={`flex items-center w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                    language === "ar"
                      ? "flex-row-reverse border-r-4 pr-3"
                      : "border-l-4"
                  }`}
                >
                  <ArrowLeftStartOnRectangleIcon
                    className={`w-5 h-5 ${iconClass}`}
                  />
                  <span
                    className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                    style={{
                      fontFamily:
                        language === "ar" ? "Cairo-Regular, sans-serif" : "",
                    }}
                  >
                    {language === "fr" ? "Déconnexion" : "تسجيل الخروج"}
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
