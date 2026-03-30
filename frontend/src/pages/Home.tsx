// src/pages/Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar
        onLoginClick={() => navigate("/login")}
        onRegisterClick={() => navigate("/register")}
        onHomeClick={() => navigate("/")}
      />

      <main>
        <p>Bienvenido a la página de la peluquería</p>
      </main>
    </div>
  );
};

export default Home;