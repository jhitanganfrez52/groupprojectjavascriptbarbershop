import { useState } from "react";
import axios from "axios";
import ServiceClient from "../../components/ServiceClient";
import EmployeeClient from "../../components/EmployeeClient";
import DateClient from "../../components/DateClient";

function HomeClient() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || !user.id) {
    alert("Error: usuario no encontrado");
    return null;
  }

  const clientId = user.id;

  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
const [availabilityId, setAvailabilityId] = useState<number | null>(null);
  /* =========================
     CREAR RESERVA
  ========================= */
  const tryReserve = async () => {
    if (
      !selectedService ||
      !availabilityId ||
      !startTime ||
      !endTime ||
      !date
    ) {
      alert("Completa todos los datos");
      return;
    }

    try {
      await axios.post("http://localhost:3000/reservas", {
        clientId,
        availabilityId, // ✅ CORRECTO
        date,
        startTime,
        endTime,
        services: [selectedService],
        detail: "Reserva desde cliente",
      });

      alert("Reserva creada 🔥");

      // 🔄 limpiar formulario (opcional)
      setStartTime("");
      setEndTime("");
    } catch (error: any) {
      console.error(error);

      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Error al crear reserva");
      }
    }
  };

  return (
    <div>
      <h2>Crear Reserva</h2>

      <ServiceClient
        onSelectService={(id) => {
          setSelectedService(id);
        }}
      />

      <EmployeeClient
        selectedService={selectedService}
        onSelectEmployee={(id) => {
          setSelectedEmployee(id);
        }}
      />

      <DateClient
        selectedEmployee={selectedEmployee}
        onSelectAvailability={(date, start, end, availabilityId) => {
          setDate(date);
          setStartTime(start);
          setEndTime(end);
          setAvailabilityId(availabilityId);
        }}
      />

      {/* ✅ BOTÓN */}
      <button
        onClick={tryReserve}
        
        style={{
          marginTop: "20px",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Generar Reserva
      </button>
    </div>
  );
}

export default HomeClient;