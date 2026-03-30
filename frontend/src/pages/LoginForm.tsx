import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [ci, setCi] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); //  IMPORTANTE

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/usuarios/login", {
        ci,
        password,
      });

      const data = res.data;

      // guardar token
      localStorage.setItem("token", data.token);

      // guardar usuario
      localStorage.setItem("user", JSON.stringify(data.usuario));

      setSuccess("Inicio de sesión exitoso");

      setCi("");
      setPassword("");

  const rol = data.usuario.role;

setTimeout(() => {
  if (rol === 1) navigate("/admin");
  else if (rol === 4) navigate("/cashier"); 
  else if (rol === 2) navigate("/employee");
  else if (rol === 3) navigate("/client");
  else navigate("/");
}, 1000);

    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || "Error al iniciar sesión");
      } else {
        setError("No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-black relative overflow-hidden">
      
      <div className="absolute w-[500px] h-[500px] bg-orange-500 opacity-10 rounded-full blur-3xl animate-pulse top-[-120px] left-[-120px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-orange-400 opacity-10 rounded-full blur-3xl animate-pulse bottom-[-100px] right-[-100px]"></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-black/90 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-md"
      >

        <h2 className="text-3xl font-semibold text-center text-white mb-6 tracking-wide">
          INICIA<span className="text-orange-500">SESION</span>
        </h2>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        {success && (
          <p className="text-green-400 text-sm mb-4 text-center">{success}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1">CI</label>
          <input
            type="text"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
            placeholder="Ingresa tu CI"
            className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg shadow-lg shadow-orange-500/30 transition duration-300"
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>

      </form>
    </div>
  );
};

export default LoginForm;