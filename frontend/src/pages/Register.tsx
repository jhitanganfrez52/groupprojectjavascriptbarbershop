import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [nombre1, setNombre1] = useState("");
  const [apellido1, setApellido1] = useState("");
  const [ciUsuario, setCiUsuario] = useState("");
  const [celularUsuario, setCelularUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/usuarios/register",
        {
          nombre1,
          apellido1,
          ciUsuario,
          celularUsuario,
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
      <h2>Registro de Cliente</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre1}
            onChange={(e) => setNombre1(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Apellido:</label>
          <input
            type="text"
            value={apellido1}
            onChange={(e) => setApellido1(e.target.value)}
            required
          />
        </div>

        <div>
          <label>CI:</label>
          <input
            type="text"
            value={ciUsuario}
            onChange={(e) => setCiUsuario(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Celular:</label>
          <input
            type="text"
            value={celularUsuario}
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