// src/components/Navbar.tsx
import React from "react";

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  return (
    <nav>
      <h1>Peluquería</h1>
      <button onClick={onLoginClick}>Iniciar sesión</button>
    </nav>
  );
};

export default Navbar;