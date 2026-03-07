// src/pages/Home.tsx
import React from "react";
import Navbar from "../components/Navbar";

interface HomeProps {
  goToLogin: () => void;
  goToRegister: () => void;
  goToHome:()=>void;
}

const Home: React.FC<HomeProps> = ({ goToLogin, goToRegister,goToHome }) => {
  return (
    <div>
      <Navbar
        onLoginClick={goToLogin}
        onRegisterClick={goToRegister}
        onHomeClick={goToHome}
      />

      <main>
        <p>Bienvenido a la página de la peluquería</p>
      </main>
    </div>
  );
};

export default Home;