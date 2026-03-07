import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import HomeAdmin from "./pages/Users/HomeAdmin";
import HomeEmployee from "./pages/Users/HomeEmployee";
import HomeClient from "./pages/Users/HomeClient";
import HomeCashier from "./pages/Users/HomeCashier";

function App() {
  const [page, setPage] = useState<
    | "home"
    | "login"
    | "register"
    | "admin"
    | "employee"
    | "client"
    | "cashier"
  >("home");

  return (
    <div>
      {page === "home" && (
        <Home
          goToLogin={() => setPage("login")}
          goToRegister={() => setPage("register")}
          goToHome={() => setPage("home")}
        />
      )}

      {page === "login" && (
        <Login
          goToHome={() => setPage("home")}
          goToAdmin={() => setPage("admin")}
          goToEmployee={() => setPage("employee")}
          goToClient={() => setPage("client")}
          goToCashier={() => setPage("cashier")}
        />
      )}

      {page === "register" && (
        <Register goToHome={() => setPage("home")} />
      )}

      {page === "admin" && <HomeAdmin />}
      {page === "employee" && <HomeEmployee />}
      {page === "client" && <HomeClient />}
      {page === "cashier" && <HomeCashier />}
    </div>
  );
}

export default App;