import {
  ArchiveBoxIcon,
  ArrowTrendingDownIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  DevicePhoneMobileIcon,
  ShoppingBagIcon,
  Square2StackIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/16/solid";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import Logo from "../assets/Dark.png";

// Updated color scheme matching your #19213D palette
const tailwindColors = {
  // Primary colors from your palette
  primary: "#19213D", // Neutral 800 - Main color
  primaryLight: "#353E5C", // Neutral 700 - Lighter shade
  secondary: "#2388FF", // Primary Blue - Accent color
  secondaryLight: "#C3DDFF", // Secondary Blue 200
  background: "#E3EFFF", // Secondary Blue 100 - Light background

  // Additional colors
  white: "#fff",
  black: "#000",
  grey: "#ededed",
  greyDark: "#888888",
  red: "#ff0000",
  green: "#298f00",
};

export default function Asidebar({ language }) {
  const location = useLocation();

  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAchatsOpen, setIsAchatsOpen] = useState(false);

  // Auto-expand the dropdown when a child route is active
  useEffect(() => {
    const path = location.pathname;

    // Check if the current path matches any product routes
    if (path.includes("/Products")) {
      setIsProductsOpen(true);
    }

    // Check if the current path matches any order routes
    if (
      path.includes("/Orders") ||
      path.includes("CreditOrders") ||
      path.includes("ReturnsOrders") ||
      path.includes("OrdersArchive")
    ) {
      setIsOrdersOpen(true);
    }

    // Check if the current path matches any purchases routes
    if (
      path.includes("/Purchases") ||
      path.includes("CreditPurchases") ||
      path.includes("ReturnsPurchases") ||
      path.includes("PuchasesArchive")
    ) {
      setIsAchatsOpen(true);
    }
  }, [location.pathname]);

  const handleProductsClick = () => {
    setIsProductsOpen((prevState) => !prevState);
  };

  const handleOrdersClick = () => {
    setIsOrdersOpen((prevState) => !prevState);
  };

  const handleAchatsClick = () => {
    setIsAchatsOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".sidebar")) {
      setIsProductsOpen(false);
      setIsOrdersOpen(false);
      setIsAchatsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { logout } = useLogout();

  const submitLogout = () => {
    logout();
  };

  // Updated classes with dark sidebar background
  const activeItemClass = "bg-[#2388FF] text-white border-[#2388FF] shadow-sm";
  const hoverItemClass = "hover:bg-[#353E5C] hover:text-white";
  const normalItemClass = "text-[#C3DDFF]";
  const iconClass = "text-[#E3EFFF]";
  const chevronClass = "text-[#C3DDFF]";

  // Style for active submenu items
  const activeSubmenuClass =
    "bg-[#2388FF] text-white font-medium border-l-2 border-[#2388FF]";
  const normalSubmenuClass =
    "text-[#E3EFFF] font-normal hover:bg-[#353E5C] hover:text-white";

  return (
    <aside
      className={`w-[17%] h-screen fixed top-0 ${
        language === "ar" ? "right-0 border-l" : "left-0 border-r"
      } border-[#353E5C] bg-[#19213D] shadow-lg overflow-y-auto p-6 pt-10 transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex justify-center mb-10">
        <div className={`flex items-center justify-center`}>
          <img src={Logo} alt="Store Logo" className="w-[85%]" />
        </div>
      </div>

      <ul className="flex flex-col space-y-2 list-none p-0 m-0">
        <li>
          <NavLink
            to="/Dashboard"
            className={({ isActive }) => `flex items-center`}
          >
            <div
              className={`flex items-center w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                location.pathname === "/" || location.pathname === "/Dashboard"
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
                {language === "fr" ? "Dashboard" : "الرئيسية"}
              </span>
            </div>
          </NavLink>
        </li>

        <div className="flex flex-col space-y-2 sidebar">
          <li className="flex flex-col space-y-2">
            <div className="flex items-center cursor-pointer w-full">
              <div
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                  location.pathname.includes("/Products") ? activeItemClass : ""
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
                <NavLink
                  to="/ProductsList"
                  className={({ isActive }) => `flex items-center`}
                >
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr"
                        ? "Stocks des produits"
                        : "مخزون المنتجات"}
                    </span>
                  </div>
                </NavLink>
                <NavLink
                  to="/ProductsGrid"
                  className={({ isActive }) => `flex items-center`}
                >
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr"
                        ? "Liste des produits"
                        : "قائمة المنتجات"}
                    </span>
                  </div>
                </NavLink>
              </div>
            )}
          </li>
        </div>

        <div className="flex flex-col space-y-2 sidebar">
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
                <NavLink
                  to="/Orders"
                  className={({ isActive }) => `flex items-center`}
                >
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr"
                        ? "Dernières commandes"
                        : "أحدث الطلبات"}
                    </span>
                  </div>
                </NavLink>
                <NavLink
                  to="/Orders/InPreparation"
                  className={({ isActive }) => `flex items-center`}
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr"
                        ? "Commandes en cours"
                        : "الطلبات قيد التحضير"}
                    </span>
                  </div>
                </NavLink>
                <NavLink
                  to="/CreditOrders"
                  className={({ isActive }) => `flex items-center`}
                >
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr"
                        ? "Commandes à crédit"
                        : "الطلبات بالائتمان"}
                    </span>
                  </div>
                </NavLink>
                <NavLink
                  to="/ReturnsOrders"
                  className={({ isActive }) => `flex items-center`}
                >
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr"
                        ? "Commandes de retour"
                        : "طلبات الإرجاع"}
                    </span>
                  </div>
                </NavLink>
                <NavLink
                  to="/OrdersArchive"
                  className={({ isActive }) => `flex items-center`}
                >
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr"
                        ? "Archive des commandes"
                        : "أرشيف الطلبات"}
                    </span>
                  </div>
                </NavLink>
              </div>
            )}
          </li>
        </div>

        <div className="flex flex-col space-y-2 sidebar">
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
                <NavLink
                  to="/Purchases"
                  className={({ isActive }) => `flex items-center`}
                >
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr" ? "Derniers achats" : "أحدث المشتريات"}
                    </span>
                  </div>
                </NavLink>
                <NavLink
                  to="/CreditPurchases"
                  className={({ isActive }) => `flex items-center`}
                >
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr"
                        ? "Achats à crédit"
                        : "المشتريات بالائتمان"}
                    </span>
                  </div>
                </NavLink>
                <NavLink
                  to="/ReturnsPurchases"
                  className={({ isActive }) => `flex items-center`}
                >
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr"
                        ? "Retours d'achats"
                        : "إرجاع المشتريات"}
                    </span>
                  </div>
                </NavLink>
                <NavLink
                  to="/PuchasesArchive"
                  className={({ isActive }) => `flex items-center`}
                >
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
                          language === "ar" ? "Cairo-Regular, sans-serif" : "",
                      }}
                    >
                      {language === "fr"
                        ? "Archive des achats"
                        : "أرشيف المشتريات"}
                    </span>
                  </div>
                </NavLink>
              </div>
            )}
          </li>
        </div>

        <li>
          <NavLink
            to="/Customers"
            className={({ isActive }) => `flex items-center`}
          >
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
                  location.pathname === "/Customers" ? "text-white" : iconClass
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
          <NavLink
            to="/Vendors"
            className={({ isActive }) => `flex items-center`}
          >
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
                  location.pathname === "/Vendors" ? "text-white" : iconClass
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
          <NavLink
            to="/Fournisseurs"
            className={({ isActive }) => `flex items-center`}
          >
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
          <NavLink
            to="/Authentication"
            className={({ isActive }) => `flex items-center`}
          >
            <div
              className={`flex items-center w-full px-4 py-3 rounded-lg ${normalItemClass} font-medium text-sm ${hoverItemClass} transition-all duration-200 ${
                location.pathname === "/Authentication" ? activeItemClass : ""
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
                {language === "fr" ? "Autorisation clients" : "مصادقة الزبائن"}
              </span>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/Losses"
            className={({ isActive }) => `flex items-center`}
          >
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
                {language === "fr" ? "Pertes" : "الخسائر"}
              </span>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/Publicite"
            className={({ isActive }) => `flex items-center`}
          >
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
                  location.pathname === "/Publicite" ? "text-white" : iconClass
                }`}
              />
              <span
                className={`${language === "ar" ? "mr-3" : "ml-3"}`}
                style={{
                  fontFamily:
                    language === "ar" ? "Cairo-Regular, sans-serif" : "",
                }}
              >
                {language === "fr" ? "Publicité" : "الإعلانات"}
              </span>
            </div>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
