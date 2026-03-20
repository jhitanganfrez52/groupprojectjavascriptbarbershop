import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";
interface LoginProps {
  goToHome: () => void;
  goToAdmin: () => void;
  goToEmployee: () => void;
  goToClient: () => void;
  goToCashier: () => void;
}
function Login({ goToHome, goToAdmin,
  goToEmployee,
  goToClient,
  goToCashier,}: LoginProps) {
  
  const [ci, setCiUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await axios.post(`${API_URL}/usuarios/login`, {
      ci,
      password,
    });

    const token = response.data.token;
    const usuario = response.data.usuario; // aquí está el ID, nombre, rol
    const role = usuario.role;

    // Guardar en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(usuario)); // guardar usuario completo

    alert("Login correcto");

    // redirección por rol
    if (role === 1) {
      goToAdmin();
    } else if (role === 2) {
      goToEmployee();
    } else if (role === 3) {
      goToClient();
    } else if (role === 4) {
      goToCashier();
    }
  } catch (err: any) {
    console.error("ERROR LOGIN:", err.response?.data);

    if (err.response) {
      setError(err.response.data.error);
    } else {
      setError("No se pudo conectar con el servidor");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <div>
      <h2>Login</h2>

      <button onClick={goToHome}>
        Volver al inicio
      </button>
    </div>
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>CI:</label>
          <input
            type="text"
            value={ci}
            onChange={(e) => setCiUsuario(e.target.value)}
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;