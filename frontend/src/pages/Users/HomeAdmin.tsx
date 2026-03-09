//src/pages/Users/HomeAdmin.tsx
import { useState } from "react";
import axios from "axios";
import ServicesAdmin from "../../components/ServicesAdmin";
const API_URL = "http://localhost:3000/admin/usuarios";

function HomeAdmin() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ci, setCi] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("2");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      
      const response = await axios.post(
  API_URL,
  {
    firstName,
    lastName,
    ci,
    phone,
    password,
    roleId: Number(roleId),
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      alert("Usuario creado correctamente");

      console.log(response.data);

      // limpiar formulario
      setFirstName("");
      setLastName("");
      setCi("");
      setPhone("");
      setPassword("");
      setRoleId("2");

    } catch (error) {
      console.error(error);
      alert("Error al crear usuario");
    }
  };

  return (
    <div>
      <h2>Panel Administrador</h2>

      <h3>Registrar empleado / cliente</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label>Apellido</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <label>CI</label>
          <input
            value={ci}
            onChange={(e) => setCi(e.target.value)}
          />
        </div>

        <div>
          <label>Teléfono</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Rol</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            <option value="2">EMPLOYEE</option>
            <option value="3">CLIENT</option>
            <option value="4">CASHIER</option>
          </select>
        </div>

        <button type="submit">
          Crear Usuario
        </button>
      </form>
      <ServicesAdmin></ServicesAdmin>
    </div>
  );
}

export default HomeAdmin;