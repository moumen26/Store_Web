import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/ProductsList";
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
function App() {
  return (
    <BrowserRouter>
      <main>
        <Asidebar />
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Customers" element={<Customers />} />
          <Route path="/ProductsList" element={<ProductsList />} />
          <Route path="/ProductsGrid" element={<ProductsGrid />} />
          <Route path="/Orders" element={<Orders />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Authentication" element={<Authentication />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/CustomerProfile" element={<CustomerProfile />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
