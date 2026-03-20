import { useEffect, useState } from "react";
import axios from "axios";

function CreateReservation() {

const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

if (!user || !user.id) {
  alert("Error: no se pudo determinar el cliente logueado");
  return null; 
}

const clientId = user.id; //  recupera id

  const [services, setServices] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [availabilities, setAvailabilities] = useState<any[]>([]);

  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<number | null>(null);
const [selectedService, setSelectedService] = useState<number | null>(null);
  //  cargar servicios
  useEffect(() => {
    axios.get("http://localhost:3000/admin/servicios")
      .then(res => setServices(res.data));
  }, []);

  //  cargar empleados
  useEffect(() => {
    axios.get("http://localhost:3000/usuarios")
      .then(res => setEmployees(res.data));
  }, []);

  //  cargar disponibilidades al elegir empleado
  useEffect(() => {
    if (selectedEmployee) {
      axios.get(`http://localhost:3000/disponibilidades/empleado/${selectedEmployee}`)
        .then(res => setAvailabilities(res.data));
    }
  }, [selectedEmployee]);

  useEffect(() => {
  if (selectedService) {
    axios.get(`http://localhost:3000/servicios/${selectedService}/empleados`)
    
      .then(res => setEmployees(res.data))
      .catch(console.error);
  }
}, [selectedService]);

  //  crear reserva
  const handleReserve = async () => {
    try {

      if (!selectedEmployee || !selectedAvailability || selectedServices.length === 0) {
        alert("Completa todos los datos");
        return;
      }

      const selectedSlot = availabilities.find(a => a.idAvailability === selectedAvailability);

      await axios.post("http://localhost:3000/reservas", {
        clientId,
        availabilityId: selectedAvailability,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        detail: "Reserva desde app",
        services: selectedServices
      });

      alert("Reserva creada ");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <h2>Crear Reserva</h2>

      {/* SERVICIOS */}
<h3>Servicio</h3>

<select
  onChange={(e) => {
    const serviceId = Number(e.target.value);
    setSelectedService(serviceId);
    setSelectedServices([serviceId]);

    //  reset dependencias
    setEmployees([]);
    setSelectedEmployee(null);
    setAvailabilities([]);
  }}
>
  <option value="">Selecciona un servicio</option>

  {services.map(s => (
    <option key={s.idService} value={s.idService}>
      {s.name}
    </option>
  ))}
</select>
      {/* EMPLEADO */}
      <h3>Empleado</h3>
      <select
  onChange={e => {
    const empId = Number(e.target.value);
    setSelectedEmployee(empId);

    // reset horarios
    setAvailabilities([]);
    setSelectedAvailability(null);
  }}
>
  <option value="">Selecciona empleado</option>

  {employees.map(e => (
    <option key={e.idUser} value={e.idUser}>
  {e.firstName} {e.lastName}
</option>
  ))}
</select>

      {/* DISPONIBILIDAD */}
      <h3>Horario</h3>
      {availabilities.map(a => (
        <div key={a.idAvailability}>
          <input
            type="radio"
            name="availability"
            onChange={() => setSelectedAvailability(a.idAvailability)}
          />
          {a.date} | {a.startTime} - {a.endTime}
        </div>
      ))}

      <button onClick={handleReserve}>
        Reservar
      </button>

    </div>
  );
}

export default CreateReservation;