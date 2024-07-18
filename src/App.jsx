import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Asidebar from "./components/AsideBar";

function App() {
  return (
    <BrowserRouter>
      <main>
        {/* <Asidebar /> */}
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/Customers" element={<Customers />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
