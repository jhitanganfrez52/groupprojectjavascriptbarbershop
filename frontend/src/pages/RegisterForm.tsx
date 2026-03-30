import { useState } from "react";
import axios from "axios";
import { z } from "zod";
const schema = z.object({
  nombre1: z.string().min(2),
  apellido1: z.string().min(2),
  ciUsuario: z.string().min(5),
  celularUsuario: z.string().min(7),
  password: z.string().min(6),
});
export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre1: "",
    apellido1: "",
    ciUsuario: "",
    celularUsuario: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const result = schema.safeParse(form);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      setError(firstError || "Datos inválidos");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/usuarios/register", {
        firstName: form.nombre1,
        lastName: form.apellido1,
        ci: form.ciUsuario,
        phone: form.celularUsuario,
        password: form.password,
      });

      // axios ya devuelve data directo
      console.log(res.data);

      setSuccess("Usuario creado correctamente ✅");

      setForm({
        nombre1: "",
        apellido1: "",
        ciUsuario: "",
        celularUsuario: "",
        password: "",
      });
    } catch (err: any) {
      //  manejo correcto de errores en axios
      if (err.response) {
        setError(err.response.data.error || "Error del servidor");
      } else if (err.request) {
        setError("No se pudo conectar con el servidor");
      } else {
        setError("Error desconocido");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
          Crear Cuenta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <input
            type="text"
            name="nombre1"
            value={form.nombre1}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="text"
            name="apellido1"
            value={form.apellido1}
            onChange={handleChange}
            placeholder="Apellido"
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="text"
            name="ciUsuario"
            value={form.ciUsuario}
            onChange={handleChange}
            placeholder="CI"
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="text"
            name="celularUsuario"
            value={form.celularUsuario}
            onChange={handleChange}
            placeholder="Celular"
            className="w-full border p-2 rounded-lg"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full border p-2 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}