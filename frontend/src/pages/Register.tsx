import { useState } from "react";
import axios from "axios";
interface RegisterProps {
  goToHome: () => void;
}
const Register = ({ goToHome }: RegisterProps) => {
  const [firstName, setNombre1] = useState("");
  const [lastName, setApellido1] = useState("");
  const [ci, setCiUsuario] = useState("");
  const [phone, setCelularUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/usuarios/register",
        {
         firstName,
      lastName,
      ci,
      phone,
      password,
        }
      );

      setMensaje(response.data.message || "Registro exitoso");
    } catch (error: any) {
      setMensaje(
        error.response?.data?.error || "Error al registrar cliente"
      );
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
      <h2>Registro de Cliente</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setNombre1(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Apellido:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setApellido1(e.target.value)}
            required
          />
        </div>

        <div>
          <label>CI:</label>
          <input
            type="text"
            value={ci}
            onChange={(e) => setCiUsuario(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Celular:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setCelularUsuario(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Registrarse</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default Register;