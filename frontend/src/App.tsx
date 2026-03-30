import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/LoginForm";
import Register from "./pages/RegisterForm";
import HomeAdmin from "./pages/Users/HomeAdmin";
import HomeEmployee from "./pages/Users/HomeEmployee";
import HomeClient from "./pages/Users/HomeClient";
import HomeCashier from "./pages/Users/HomeCashier";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<HomeAdmin />} />
        <Route path="/employee" element={<HomeEmployee />} />
        <Route path="/client" element={<HomeClient />} />
        <Route path="/cashier" element={<HomeCashier />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;