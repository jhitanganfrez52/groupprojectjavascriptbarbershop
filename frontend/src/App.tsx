import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [page, setPage] = useState<"home" | "login" | "register">("home");

  return (
    <div>
      {page === "home" && <Home goToLogin={() => setPage("login")} />}
      {page === "login" && <Login />}
      {page === "register" && <Register />}
    </div>
  );
}

export default App;