import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from 'react';
import Customers from "./pages/Customers";
import SignUp from "./pages/SignUp";
import ProductsList from "./pages/ProductsList";
import ProductsGrid from "./pages/ProductsGrid";
import Orders from "./pages/Orders";
import SignIn from "./pages/SignIn";
import Authentication from "./pages/Authentication";
import Settings from "./pages/Settings";
import Asidebar from "./components/AsideBar";
import CustomerProfile from "./pages/CustomerProfile";
import LetsUpYourAccount from "./pages/LetsUpYourAccount";
import OrderProfile from "./pages/OrderProfile";
import ProductDetails from "./pages/ProductDetails";
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const { user } = useAuthContext();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);
  if (!isOnline) {
    return (
      <div className="CircularProgress-app">
        <div className="CircularProgress-container">
          {/* <CircularProgress className='CircularProgress' /> */}
        </div>  
        <h1>Pas de connexion Internet...</h1>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <main>
        {user ? <Asidebar /> : <SignIn />}
        <Routes>
          <Route index element={user ? <Dashboard /> : <SignIn />} />
          <Route path="/Customers" element={user ? <Customers /> : <SignIn />} />
          <Route path="/ProductsList" element={user ? <ProductsList /> : <SignIn />} />
          <Route path="/ProductsGrid" element={user ? <ProductsGrid /> : <SignIn />} />
          <Route path="/Product/:id" element={user ? <ProductDetails /> : <SignIn />} />
          <Route path="/Orders" element={user ? <Orders /> : <SignIn />} />
          <Route path="/Settings" element={user ? <Settings /> : <SignIn />} />
          <Route path="/Authentication" element={user ? <Authentication /> : <SignIn />} />
          <Route path="/Client/:id" element={user ? <Authentication /> : <SignIn />} />
          <Route path="/SignUp" element={!user ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/SignIn" element={!user ? <SignIn /> : <Navigate to="/" />} />
          <Route path="/CustomerProfile/:id" element={user ? <CustomerProfile /> : <SignIn />} />
          <Route path="/OrderProfile" element={user ? <OrderProfile /> : <SignIn />} />
          <Route path="/LetsUpYourAccount" element={user ? <LetsUpYourAccount /> : <SignIn />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
