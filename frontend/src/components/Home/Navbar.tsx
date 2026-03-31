import React, { useEffect, useState } from "react";

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onHomeClick: () => void;
}

interface Company {
  companyName: string;
  logoImage: string | null;
}

const Navbar: React.FC<NavbarProps> = ({
  onLoginClick,
  onRegisterClick,
  onHomeClick,
}) => {
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch("http://localhost:3000/empresa");
        const data = await res.json();
        setCompany(data);
      } catch (error) {
        console.error("Error al obtener empresa:", error);
      }
    };

    fetchCompany();
  }, []);

  return (
    <nav className="w-full bg-red-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      
      {/* Logo + Nombre (click = Home) */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={onHomeClick}
      >
        {company?.logoImage ? (
          <img
            src={company.logoImage}
            alt="Logo"
            className="h-10 w-10 object-cover rounded-full bg-white"
          />
        ) : (
          <div className="h-10 w-10 bg-white text-red-600 flex items-center justify-center rounded-full font-bold">
            {company?.companyName?.charAt(0) || "P"}
          </div>
        )}

        <h1 className="text-lg font-semibold">
          {company?.companyName || "Peluquería"}
        </h1>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          onClick={onLoginClick}
          className=" text-red-600 px-4 py-1 rounded hover:bg-gray-200 transition"
        >
          Iniciar sesión
        </button>

        <button
          onClick={onRegisterClick}
          className="border border-white px-4 py-1 rounded hover:bg-white hover:text-red-600 transition"
        >
          Registrarse
        </button>
      </div>

    </nav>
  );
};

export default Navbar;