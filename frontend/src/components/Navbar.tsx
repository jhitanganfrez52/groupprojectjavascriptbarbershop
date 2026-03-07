// src/components/Navbar.tsx
import React from "react";

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onHomeClick:()=> void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onRegisterClick }) => {
  return (
    <nav>
      <h1>Peluquería</h1>

      <button onClick={onLoginClick}>
        Iniciar sesión
      </button>

      <button onClick={onRegisterClick}>
        Registrarse
      </button>
      
    </nav>
  );
};

export default Navbar;