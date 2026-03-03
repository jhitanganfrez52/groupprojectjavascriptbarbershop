// src/pages/Home.tsx
import React from "react";
import Navbar from "../components/Navbar";

interface HomeProps {
  goToLogin: () => void;
}

const Home: React.FC<HomeProps> = ({ goToLogin }) => {
  return (
    <div>
      <Navbar onLoginClick={goToLogin} />
      <main>
        <p>Bienvenido a la página de la peluquería</p>
      </main>
    </div>
  );
};

export default Home;