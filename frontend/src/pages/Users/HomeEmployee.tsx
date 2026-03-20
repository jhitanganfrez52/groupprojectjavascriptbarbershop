import { useEffect, useState } from "react";
import axios from "axios";
import AvailabilityEmployee from "../../components/AvailabilityEmployee";

function HomeEmployee() {
  
  const [services, setServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [originalServices, setOriginalServices] = useState<number[]>([]);

  const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

if (!user || !user.id) {
  alert("Error: no se pudo determinar el empleado logeado");
  return;
}

const employeeId = user.id; 
  useEffect(() => {
    axios.get("http://localhost:3000/admin/servicios")
      .then(res => setServices(res.data))
      .catch(console.error);
  }, []);

  //  Obtener servicios ya asignados al empleado
  useEffect(() => {
    axios.get(`http://localhost:3000/servicios/${employeeId}/services`)
      .then(res => {
        const ids = res.data.Services.map((s: any) => s.idService);
        setSelectedServices(ids);
        setOriginalServices(ids); // guardamos estado original
      })
      .catch(console.error);
  }, []);

  //  Selección checkbox
  const handleSelect = (serviceId: number) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  //  GUARDAR (AGREGAR + ELIMINAR)
  const saveServices = async () => {
  try {
    // 1️⃣ Obtener el usuario logueado desde el JWT/localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const employeeId = user.id;

    if (!employeeId) {
      alert("Error: no se pudo determinar el empleado logueado");
      return;
    }

    // 2️Calcular servicios a agregar y a eliminar
    const toAdd = selectedServices.filter(id => !originalServices.includes(id));
    const toRemove = originalServices.filter(id => !selectedServices.includes(id));

    console.log("Empleado:", employeeId);
    console.log("Agregar:", toAdd);
    console.log("Eliminar:", toRemove);

    // 3Agregar servicios
    for (const serviceId of toAdd) {
      await axios.post("http://localhost:3000/servicios", {
        idUser: employeeId, //  se usa id correcto
        idService: serviceId
      });
    }

    // 4️ Eliminar servicios
    for (const serviceId of toRemove) {
      await axios.delete("http://localhost:3000/servicios", {
        data: {
          idUser: employeeId, //  se usa id correcto
          idService: serviceId
        }
      });
    }

    // 5Confirmar al usuario y actualizar estado
    alert("Servicios actualizados correctamente");
    setOriginalServices([...selectedServices]);

  } catch (error) {
    console.error("Error al guardar servicios:", error);
    alert("Ocurrió un error al guardar los servicios");
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

      <AvailabilityEmployee></AvailabilityEmployee>
    </div>
  );
}

export default HomeEmployee;