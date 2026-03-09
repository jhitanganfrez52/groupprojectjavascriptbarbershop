import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/admin/servicios";
type Service = {
  idService: number;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
};

function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);

  const [form, setForm] = useState({
    name: "",
    price: 0,
    durationMinutes: 0,
    description: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // cargar servicios
  const getServices = async () => {
    const res = await axios.get(API);
    setServices(res.data);
  };

  useEffect(() => {
    getServices();
  }, []);

  // manejar inputs
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
    } else {
      await axios.post(API, form);
    }

    setForm({
      name: "",
      price: 0,
      durationMinutes: 0,
      description: "",
    });

    setEditingId(null);
    getServices();

  } catch (error) {
    console.error("Error:", error);
  }
};
  // editar
const handleEdit = (service: Service) => {
  setForm({
    name: service.name,
    price: service.price,
    durationMinutes: service.durationMinutes,
    description: service.description
  });

  setEditingId(service.idService);
};
  // eliminar
  const handleDelete = async (id: number) => {
  await axios.delete(`${API}/${id}`);
  getServices();
};

  return (
    <div>
      <h2>Administrar Servicios</h2>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
        />

        <input
          type="number"
          name="durationMinutes"
          placeholder="Duración (min)"
          value={form.durationMinutes}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Actualizar" : "Crear"}
        </button>
      </form>

      <hr />

      {/* LISTA DE SERVICIOS */}
      <h3>Lista de servicios</h3>

      <ul>
  {services.map((s) => (
    <li key={s.idService}>
      <strong>{s.name}</strong> - ${s.price} - {s.durationMinutes} min

      <button onClick={() => handleEdit(s)}>
        Editar
      </button>

      <button onClick={() => handleDelete(s.idService)}>
        Eliminar
      </button>
    </li>
  ))}
</ul>
    </div>
  );
}

export default ServicesAdmin;