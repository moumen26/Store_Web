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

function App() {
  const { user } = useAuthContext();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
  if (!isOnline) {
    return (
      <div className="w-full h-full flex items-center justify-center flex-col">
        <CircularProgress color="error" />
        <h1 style={{
          color: 'red'
        }}
        >Pas de connexion Internet ...</h1>
      </div>
    );
  }
  //
  return (
    <BrowserRouter>
      <main>
        {user ? <Asidebar /> : <SignIn />}
        {user ? <AsidebarScreenMedia /> : <SignIn />}
        <Routes>
          {/* private routes */}
          <Route index element={user ? <Dashboard /> : <SignIn />} />
          <Route
            path="/Dashboard"
            element={user ? <Dashboard /> : <SignIn />}
          />
          <Route
            path="/Customers"
            element={user ? <Customers /> : <SignIn />}
          />
          <Route
            path="/Purchases"
            element={user ? <Purchases /> : <SignIn />}
          />
          <Route
            path="/ReturnsOrders"
            element={user ? <ReturnsOrders /> : <SignIn />}
          />
          <Route
            path="/ReturnsPurchases"
            element={user ? <ReturnsPurchases /> : <SignIn />}
          />
          <Route
            path="/Publicite"
            element={user ? <Publicité /> : <SignIn />}
          />
          <Route
            path="/CreditPurchases"
            element={user ? <CreditPurchases /> : <SignIn />}
          />
          <Route path="/Losses" element={user ? <Losses /> : <SignIn />} />
          <Route
            path="/Fournisseurs"
            element={user ? <Fournisseurs /> : <SignIn />}
          />
          <Route
            path="/FournisseurProfile/:id"
            element={user ? <FournisseurProfile /> : <SignIn />}
          />
          <Route path="/Vendors" element={user ? <Vendors /> : <SignIn />} />
          <Route
            path="/AddOrder/:id"
            element={user ? <AddOrder /> : <SignIn />}
          />
          <Route
            path="/AddAchat/:id"
            element={user ? <AddAchat /> : <SignIn />}
          />
          <Route
            path="/ProductsList"
            element={user ? <ProductsList /> : <SignIn />}
          />
          <Route
            path="/PuchasesArchive"
            element={user ? <PuchasesArchive /> : <SignIn />}
          />
          <Route
            path="/ProductsGrid"
            element={user ? <ProductsGrid /> : <SignIn />}
          />
          <Route
            path="/PurchaseProfile/:id"
            element={user ? <PurchaseProfile /> : <SignIn />}
          />
          <Route
            path="/Product/:id"
            element={user ? <ProductDetails /> : <SignIn />}
          />
          <Route 
            path="/Orders" 
            element={user ? <Orders /> : <SignIn />} 
          />
          <Route 
            path="/Orders/InPreparation" 
            element={user ? <OrdersInPreparation /> : <SignIn />} 
          />
          <Route
            path="/OrdersArchive"
            element={user ? <OrdersArchive /> : <SignIn />}
          />
          <Route
            path="/CreditOrders"
            element={user ? <CreditOrders /> : <SignIn />}
          />
          <Route path="/Settings" element={user ? <Settings /> : <SignIn />} />
          <Route
            path="/Authentication"
            element={user ? <Authentication /> : <SignIn />}
          />
          <Route
            path="/Client/:id"
            element={user ? <Authentication /> : <SignIn />}
          />
          <Route
            path="/CustomerProfile/:id"
            element={user ? <CustomerProfile /> : <SignIn />}
          />
          <Route
            path="/NAPCustomerProfile/:id"
            element={user ? <NonApprovedCustomer /> : <SignIn />}
          />
          <Route
            path="/OrderProfile/:id"
            element={user ? <OrderProfile /> : <SignIn />}
          />
          <Route
            path="/LetsUpYourAccount"
            element={user ? <LetsUpYourAccount /> : <SignIn />}
          />
          {/* public routes */}
          <Route
            path="/SignUp"
            element={!user ? <SignUp /> : <Navigate to="/" />}
          />
          <Route
            path="/VerifyCode/:id"
            element={!user ? <VerifyCode /> : <Navigate to="/" />}
          />
          <Route
            path="/SignIn"
            element={!user ? <SignIn /> : <Navigate to="/" />}
          />
          <Route
            path="/UpYourAccount/:id"
            element={!user ? <UpYourAccount /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
