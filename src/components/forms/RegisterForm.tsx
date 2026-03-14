import { useState } from "react";

export default function RegisterForm() {

  const [form, setForm] = useState({
    nombre1: "",
    apellido1: "",
    ciUsuario: "",
    celularUsuario: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">
          Crear Cuenta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-gray-600 text-sm">
              Nombre
            </label>
            <input
              type="text"
              name="nombre1"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm">
              Apellido
            </label>
            <input
              type="text"
              name="apellido1"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Tu apellido"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm">
              CI
            </label>
            <input
              type="text"
              name="ciUsuario"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Carnet de identidad"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm">
              Celular
            </label>
            <input
              type="text"
              name="celularUsuario"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Número de celular"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Contraseña"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Registrarse
          </button>

        </form>
      </div>
    </div>
  );
}