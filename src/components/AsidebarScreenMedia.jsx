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
import Logo from "../assets/Logo-mosagro.png";

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
      !event.target.closest(".Sidebar") &&
      !event.target.closest(".toggleIcon")
    ) {
      setIsSidebarOpen(false);
    }
  };

  const handleProductsClick = () => setIsProductsOpen((prev) => !prev);
  const handleOrdersClick = () => setIsOrdersOpen((prev) => !prev);
  const handleAchatsClick = () => setIsAchatsOpen((prev) => !prev);

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

  return (
    <div
      className={`asideMedia fixed z-50 md:hidden ${
        isSidebarOpen ? "asidemediaActive" : ""
      }`}
    >
      {/* Toggle Icon for Sidebar */}
      <div
        className="toggleIcon cursor-pointer fixed top-4 left-4 z-50 bg-white rounded-full shadow-md p-2"
        style={{
          [language === "ar" ? "right" : "left"]: "1rem",
          [language === "ar" ? "left" : "right"]: "auto",
        }}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        )}
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        />
      )}

      {/* Sidebar */}
      {isSidebarOpen && (
        <aside
          className={`asidebarMedia fixed top-0 bottom-0 bg-white w-[80vw] max-w-xs shadow-lg transition-transform duration-300
            ${language === "ar" ? "right-0" : "left-0"}
            ${
              isSidebarOpen
                ? "translate-x-0"
                : language === "ar"
                ? "translate-x-full"
                : "-translate-x-full"
            }
          `}
          style={{ direction: language === "ar" ? "rtl" : "ltr" }}
        >
          {/* Logo */}
          <div className="flex justify-center items-center h-[10%] p-10">
            <img src={Logo} alt="Store Logo" />
          </div>
          <ul className="topAsideBar flex-col space-y-[8px]">
            <li className="Sidebar">
              <NavLink to="/Dashboard" className="flex items-center">
                <div
                  className={`flex items-center itemAsideBar ${
                    location.pathname === "/Dashboard" ? "asideItemActive" : ""
                  }`}
                >
                  <Squares2X2Icon className="iconAsideBar" />
                  <span className="ml-3">
                    {language === "ar" ? "الرئيسية" : "Dashboard"}
                  </span>
                </div>
              </NavLink>
            </li>
            <div className="flex-col space-y-[8px] Sidebar">
              <li className="flex-col space-y-[8px]">
                <div className="flex items-center cursor-pointer">
                  <div
                    className={`flex items-center justify-between itemAsideBar`}
                    onClick={handleProductsClick}
                  >
                    <div className="flex">
                      <ArchiveBoxIcon className="iconAsideBar" />
                      <span className="ml-3">
                        {language === "ar" ? "المنتجات" : "Produits"}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`iconPages ${
                        isProductsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                {isProductsOpen && (
                  <div className="flex-col space-y-[8px]">
                    <NavLink to="/ProductsList" className="flex items-center">
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/ProductsList"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">
                          {language === "ar"
                            ? "مخزون المنتجات"
                            : "Stocks des produits"}
                        </span>
                      </div>
                    </NavLink>
                    <NavLink to="/ProductsGrid" className="flex items-center">
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/ProductsGrid"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">
                          {language === "ar"
                            ? "قائمة المنتجات"
                            : "Liste des produits"}
                        </span>
                      </div>
                    </NavLink>
                  </div>
                )}
              </li>
            </div>
            <div className="flex-col space-y-[8px] Sidebar">
              <li className="flex-col space-y-[8px]">
                <div className="flex items-center cursor-pointer">
                  <div
                    className={`flex items-center justify-between itemAsideBar`}
                    onClick={handleOrdersClick}
                  >
                    <div className="flex">
                      <ShoppingBagIcon className="iconAsideBar" />
                      <span className="ml-3">
                        {language === "ar" ? "الطلبات" : "Commandes"}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`iconPages ${
                        isOrdersOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                {isOrdersOpen && (
                  <div className="flex-col space-y-[8px]">
                    <NavLink to="/Orders" className="flex items-center">
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/Orders"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">
                          {language === "ar"
                            ? "أحدث الطلبات"
                            : "Dernières commandes"}
                        </span>
                      </div>
                    </NavLink>
                    <NavLink to="/CreditOrders" className="flex items-center">
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/CreditOrders"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">
                          {language === "ar"
                            ? "الطلبات بالائتمان"
                            : "Commandes à crédit"}
                        </span>
                      </div>
                    </NavLink>
                    <NavLink to="/ReturnsOrders" className="flex items-center">
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/ReturnsOrders"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">
                          {language === "ar"
                            ? "طلبات الإرجاع"
                            : "Commandes de retour"}
                        </span>
                      </div>
                    </NavLink>
                    <NavLink to="/OrdersArchive" className="flex items-center">
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/OrdersArchive"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">
                          {language === "ar"
                            ? "أرشيف الطلبات"
                            : "Archive des commandes"}
                        </span>
                      </div>
                    </NavLink>
                  </div>
                )}
              </li>
            </div>
            <div className="flex-col space-y-[8px] Sidebar">
              <li className="flex-col space-y-[8px]">
                <div className="flex items-center cursor-pointer">
                  <div
                    className={`flex items-center justify-between itemAsideBar`}
                    onClick={handleAchatsClick}
                  >
                    <div className="flex">
                      <ClipboardDocumentCheckIcon className="iconAsideBar" />
                      <span className="ml-3">
                        {language === "ar" ? "المشتريات" : "Achats"}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`iconPages ${
                        isAchatsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                {isAchatsOpen && (
                  <div className="flex-col space-y-[8px]">
                    <NavLink to="/Purchases" className="flex items-center">
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/Purchases"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">
                          {language === "ar"
                            ? "أحدث المشتريات"
                            : "Derniers achats"}
                        </span>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/CreditPurchases"
                      className="flex items-center"
                    >
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/CreditPurchases"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">
                          {language === "ar"
                            ? "المشتريات بالائتمان"
                            : "Achats à crédit"}
                        </span>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/ReturnsPurchases"
                      className="flex items-center"
                    >
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/ReturnsPurchases"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">
                          {language === "ar"
                            ? "إرجاع المشتريات"
                            : "Retours d'achats"}
                        </span>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/PuchasesArchive"
                      className="flex items-center"
                    >
                      <div
                        className={`flex items-center itemAsideBar ${
                          location.pathname === "/PuchasesArchive"
                            ? "asideItemActive"
                            : ""
                        }`}
                      >
                        <Square2StackIcon className="iconAsideBar opacity-0" />
                        <span className="ml-3">
                          {language === "ar"
                            ? "أرشيف المشتريات"
                            : "Archive des achats"}
                        </span>
                      </div>
                    </NavLink>
                  </div>
                )}
              </li>
            </div>
            <li className="Sidebar">
              <NavLink to="/Customers" className=" flex items-center">
                <div
                  className={`flex items-center itemAsideBar ${
                    location.pathname === "/Customers" ? "asideItemActive" : ""
                  }`}
                >
                  <UserGroupIcon className="iconAsideBar" />
                  <span className="ml-3">
                    {language === "ar" ? "العملاء" : "Clients"}
                  </span>
                </div>
              </NavLink>
            </li>
            <li className="Sidebar">
              <NavLink to="/Vendors" className=" flex items-center">
                <div
                  className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                    location.pathname === "/Vendors" ? "asideItemActive" : ""
                  }`}
                >
                  <UsersIcon className="iconAsideBar" />
                  <span className="ml-3">
                    {language === "ar" ? "البائعين" : "Vendeurs"}
                  </span>
                </div>
              </NavLink>
            </li>
            <li className="Sidebar">
              <NavLink to="/Fournisseurs" className=" flex items-center">
                <div
                  className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                    location.pathname === "/Fournisseurs"
                      ? "asideItemActive"
                      : ""
                  }`}
                >
                  <UserIcon className="iconAsideBar" />
                  <span className="ml-3">
                    {language === "ar" ? "الموردين" : "Fournisseurs"}
                  </span>
                </div>
              </NavLink>
            </li>
            <li className="Sidebar">
              <NavLink to="/Authentication" className=" flex items-center">
                <div
                  className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                    location.pathname === "/Authentication"
                      ? "asideItemActive"
                      : ""
                  }`}
                >
                  <UserPlusIcon className="iconAsideBar" />
                  <span className="ml-3">
                    {language === "ar"
                      ? "مصادقة الزبائن"
                      : "Autorisation clients"}
                  </span>
                </div>
              </NavLink>
            </li>
            <li className="Sidebar">
              <NavLink to="/Losses" className=" flex items-center">
                <div
                  className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                    location.pathname === "/Losses" ? "asideItemActive" : ""
                  }`}
                >
                  <ArrowTrendingDownIcon className="iconAsideBar" />
                  <span className="ml-3">
                    {language === "ar" ? "الخسائر" : "Pertes"}
                  </span>
                </div>
              </NavLink>
            </li>
            <li className="Sidebar">
              <NavLink to="/Publicite" className=" flex items-center">
                <div
                  className={`flex items-center itemAsideBar AuthenticationItemAsideBar  ${
                    location.pathname === "/Publicite" ? "asideItemActive" : ""
                  }`}
                >
                  <DevicePhoneMobileIcon className="iconAsideBar" />
                  <span className="ml-3">
                    {language === "ar" ? "الإعلانات" : "Publicité"}
                  </span>
                </div>
              </NavLink>
            </li>
            <li className="Sidebar">
              <NavLink to="/Settings" className="flex items-center">
                <div
                  className={`flex items-center itemAsideBar ${
                    location.pathname === "/Settings" ? "asideItemActive" : ""
                  }`}
                >
                  <Cog6ToothIcon className="iconAsideBar" />
                  <span className="ml-3">
                    {language === "ar" ? "الإعدادات" : "Settings"}
                  </span>
                </div>
              </NavLink>
            </li>
            <li className="Sidebar">
              <NavLink
                to="/SignUp"
                className=" flex items-center"
                onClick={submitLogout}
              >
                <div
                  className={`flex items-center itemAsideBar ${
                    location.pathname === "/SignUp" ? "asideItemActive" : ""
                  }`}
                >
                  <ArrowLeftStartOnRectangleIcon className="iconAsideBar" />
                  <span className="ml-3">
                    {language === "ar" ? "تسجيل الخروج" : "Log out"}
                  </span>
                </div>
              </NavLink>
            </li>
          </ul>
        </aside>
      )}
    </div>
  );
}
