import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

function Login() {
  const [ci, setCiUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/usuarios/login`,
        {
          ci,
          password,
        }
      );

      console.log("LOGIN OK:", response.data);
      alert("Login correcto");

      // aquí luego puedes guardar usuario en estado o localStorage
    } catch (err: any) {
      console.error("ERROR LOGIN:", err.response?.data);

      if (err.response) {
        // mensajes que manda tu backend
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