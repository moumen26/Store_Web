import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import Customers from "./pages/Customers";
import SignUp from "./pages/SignUp";
import ProductsList from "./pages/ProductsList";
import ProductsGrid from "./pages/ProductsGrid";
import Orders from "./pages/Orders";
import OrdersInPreparation from "./pages/OrdersInPreparation";
import SignIn from "./pages/SignIn";
import Authentication from "./pages/Authentication";
import Settings from "./pages/Settings";
import Asidebar from "./components/AsideBar";
import CustomerProfile from "./pages/CustomerProfile";
import LetsUpYourAccount from "./pages/LetsUpYourAccount";
import OrderProfile from "./pages/OrderProfile";
import ProductDetails from "./pages/ProductDetails";
import NonApprovedCustomer from "./pages/NonApprovedCustomer";
import { useAuthContext } from "./hooks/useAuthContext";
import Vendors from "./pages/Vendors";
import AddOrder from "./pages/AddOrder";
import OrdersArchive from "./pages/OrdersArchive";
import Fournisseurs from "./pages/Fournisseurs";
import CreditOrders from "./pages/CreditOrders";
import VerifyCode from "./pages/VerifyCode";
import UpYourAccount from "./pages/UpyourAccount";
import Purchases from "./pages/Purchases";
import CreditPurchases from "./pages/CreditPurchases";
import FournisseurProfile from "./pages/FournisseurProfile";
import AddAchat from "./pages/AddAchat";
import PurchaseProfile from "./pages/PurchaseProfile";
import PuchasesArchive from "./pages/PuchasesArchive";
import Losses from "./pages/Losses";
import Publicité from "./pages/Publicité";
import ReturnsPurchases from "./pages/ReturnsPurchases";
import ReturnsOrders from "./pages/ReturnsOrders";
import AsidebarScreenMedia from "./components/AsidebarScreenMedia";
import { CircularProgress } from "@mui/material";
import Logo from "../src/assets/Logo-error.png";

function App() {
  const { user } = useAuthContext();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [language, setLanguage] = useState("fr"); // Default language is French

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    console.log("isCollapsed:", isCollapsed);
  };

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "fr" ? "ar" : "fr"));
  };

  const text = {
    fr: {
      noInternet: "Pas de connexion Internet ...",
      tryAgainLater: "Veuillez vérifier votre connexion et réessayer",
      dashboard: "Tableau de bord",
      customers: "Clients",
      purchases: "Achats",
      returnsOrders: "Retours de commandes",
      returnsPurchases: "Retours d'achats",
      publicity: "Publicité",
      creditPurchases: "Achats à crédit",
      losses: "Pertes",
      suppliers: "Fournisseurs",
      vendors: "Vendeurs",
      addOrder: "Ajouter une commande",
      addPurchase: "Ajouter un achat",
      productsList: "Liste des produits",
      purchasesArchive: "Archive des achats",
      productsGrid: "Grille des produits",
      purchaseProfile: "Profil d'achat",
      productDetails: "Détails du produit",
      orders: "Commandes",
      ordersInPreparation: "Commandes en préparation",
      ordersArchive: "Archive des commandes",
      creditOrders: "Commandes à crédit",
      settings: "Paramètres",
      authentication: "Authentification",
      clientProfile: "Profil du client",
      nonApprovedClientProfile: "Profil du client non approuvé",
      orderProfile: "Profil de la commande",
      letsUpYourAccount: "Améliorons votre compte",
      signUp: "S'inscrire",
      verifyCode: "Vérifier le code",
      signIn: "Se connecter",
      upYourAccount: "Améliorer votre compte",
    },
    ar: {
      noInternet: "لا يوجد اتصال بالإنترنت...",
      tryAgainLater: "يرجى التحقق من الاتصال وحاول مرة أخرى.",
      dashboard: "لوحة القيادة",
      customers: "العملاء",
      purchases: "المشتريات",
      returnsOrders: "إرجاع الطلبات",
      returnsPurchases: "إرجاع المشتريات",
      publicity: "الإعلانات",
      creditPurchases: "المشتريات بالائتمان",
      losses: "الخسائر",
      suppliers: "الموردين",
      vendors: "البائعين",
      addOrder: "إضافة طلب",
      addPurchase: "إضافة شراء",
      productsList: "قائمة المنتجات",
      purchasesArchive: "أرشيف المشتريات",
      productsGrid: "شبكة المنتجات",
      purchaseProfile: "ملف الشراء",
      productDetails: "تفاصيل المنتج",
      orders: "الطلبات",
      ordersInPreparation: "الطلبات قيد التحضير",
      ordersArchive: "أرشيف الطلبات",
      creditOrders: "الطلبات بالائتمان",
      settings: "الإعدادات",
      authentication: "المصادقة",
      clientProfile: "ملف العميل",
      nonApprovedClientProfile: "ملف العميل غير المعتمد",
      orderProfile: "ملف الطلب",
      letsUpYourAccount: "لنرفع حسابك",
      signUp: "التسجيل",
      verifyCode: "التحقق من الرمز",
      signIn: "تسجيل الدخول",
      upYourAccount: "رفع حسابك",
    },
  };

  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    // Create a bouncing effect every 2 seconds
    const interval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 500);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!isOnline) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col gap-6">
        <div className="flex flex-col items-center">
          <div
            className={`transition-transform duration-500 mb-4 ${
              bounce ? "translate-y-2" : ""
            }`}
          >
            <img
              src={Logo}
              alt="Logo"
              className="w-[100px] opacity-80 animate-pulse"
            />
          </div>
          <h1
            style={{
              fontFamily: language === "ar" ? "Cairo, sans-serif" : "",
            }}
            className="text-red-500 text-xl font-medium"
          >
            {text[language].noInternet}
          </h1>
          <p
            style={{
              fontFamily: language === "ar" ? "Cairo, sans-serif" : "",
            }}
            className="text-gray-500"
          >
            {text[language].tryAgainLater ||
              "Please check your connection and try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <main
        className={`flex ${
          isCollapsed && window.innerWidth > 1023
            ? "main-collapsed"
            : "main-expanded"
        } ${language === "ar" ? "flex-ar" : ""}`}
      >
        {user ? (
          <Asidebar
            language={language}
            onToggle={handleToggle}
            isCollapsed={isCollapsed}
          />
        ) : (
          <SignIn
            onToggle={handleToggle}
            language={language}
            toggleLanguage={toggleLanguage}
          />
        )}
        {user ? (
          <AsidebarScreenMedia />
        ) : (
          <SignIn
            onToggle={handleToggle}
            language={language}
            toggleLanguage={toggleLanguage}
          />
        )}
        <Routes>
          {/* private routes */}
          <Route
            index
            element={
              user ? (
                <Dashboard
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Dashboard"
            element={
              user ? (
                <Dashboard
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Customers"
            element={
              user ? (
                <Customers
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Purchases"
            element={
              user ? (
                <Purchases
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/ReturnsOrders"
            element={
              user ? (
                <ReturnsOrders
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/ReturnsPurchases"
            element={
              user ? (
                <ReturnsPurchases
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Publicite"
            element={
              user ? (
                <Publicité
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/CreditPurchases"
            element={
              user ? (
                <CreditPurchases
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Losses"
            element={
              user ? (
                <Losses
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Fournisseurs"
            element={
              user ? (
                <Fournisseurs
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/FournisseurProfile/:id"
            element={
              user ? (
                <FournisseurProfile
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Vendors"
            element={
              user ? (
                <Vendors
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/AddOrder/:id"
            element={
              user ? (
                <AddOrder
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/AddAchat/:id"
            element={
              user ? (
                <AddAchat
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/ProductsList"
            element={
              user ? (
                <ProductsList
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/PuchasesArchive"
            element={
              user ? (
                <PuchasesArchive
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/ProductsGrid"
            element={
              user ? (
                <ProductsGrid
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/PurchaseProfile/:id"
            element={
              user ? (
                <PurchaseProfile
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Product/:id"
            element={
              user ? (
                <ProductDetails
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Orders"
            element={
              user ? (
                <Orders
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Orders/InPreparation"
            element={
              user ? (
                <OrdersInPreparation
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/OrdersArchive"
            element={
              user ? (
                <OrdersArchive
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/CreditOrders"
            element={
              user ? (
                <CreditOrders
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Settings"
            element={
              user ? (
                <Settings
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Authentication"
            element={
              user ? (
                <Authentication
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/Client/:id"
            element={
              user ? (
                <Authentication
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/CustomerProfile/:id"
            element={
              user ? (
                <CustomerProfile
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/NAPCustomerProfile/:id"
            element={
              user ? (
                <NonApprovedCustomer
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/OrderProfile/:id"
            element={
              user ? (
                <OrderProfile
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          <Route
            path="/LetsUpYourAccount"
            element={
              user ? (
                <LetsUpYourAccount
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              )
            }
          />
          {/* public routes */}
          <Route
            path="/SignUp"
            element={
              !user ? (
                <SignUp
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/VerifyCode/:id"
            element={
              !user ? (
                <VerifyCode
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/SignIn"
            element={
              !user ? (
                <SignIn
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/UpYourAccount/:id"
            element={
              !user ? (
                <UpYourAccount
                  onToggle={handleToggle}
                  language={language}
                  toggleLanguage={toggleLanguage}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
