import { useEffect, useState } from "react";
import axios from "axios";

function HomeEmployee() {

  const [services, setServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [originalServices, setOriginalServices] = useState<number[]>([]);

  const employeeId = 1;

  // 🔹 Obtener todos los servicios
  useEffect(() => {
    axios.get("http://localhost:3000/admin/servicios")
      .then(res => setServices(res.data))
      .catch(console.error);
  }, []);

  // 🔹 Obtener servicios ya asignados al empleado
  useEffect(() => {
    axios.get(`http://localhost:3000/servicios/${employeeId}/services`)
      .then(res => {
        const ids = res.data.Services.map((s: any) => s.id);
        setSelectedServices(ids);
        setOriginalServices(ids); // guardamos estado original
      })
      .catch(console.error);
  }, []);

  // 🔹 Selección checkbox
  const handleSelect = (serviceId: number) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  // 🔥 GUARDAR (AGREGAR + ELIMINAR)
  const saveServices = async () => {
    try {

      // servicios a agregar
      const toAdd = selectedServices.filter(id => !originalServices.includes(id));

      // servicios a eliminar
      const toRemove = originalServices.filter(id => !selectedServices.includes(id));

      // 🔹 agregar
      for (const serviceId of toAdd) {
        await axios.post("http://localhost:3000/servicios", {
          idUser: employeeId,
          idService: serviceId
        });
      }

      // 🔹 eliminar
      for (const serviceId of toRemove) {
        await axios.delete("http://localhost:3000/servicios", {
          data: {
            idUser: employeeId,
            idService: serviceId
          }
        });
      }

      alert("Servicios actualizados correctamente");

      // actualizar estado original
      setOriginalServices(selectedServices);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <h2>Selecciona los servicios que puedes realizar</h2>

      {services.map(service => (
        <div key={service.idService}>
          <label>
            <input
              type="checkbox"
              checked={selectedServices.includes(service.idService)}
              onChange={() => handleSelect(service.idService)}
            />
            {service.name}
          </label>
        </div>
      ))}

      <button onClick={saveServices}>
        Guardar servicios
      </button>

    </div>
  );
}

export default HomeEmployee;