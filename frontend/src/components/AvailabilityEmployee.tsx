//frontend/src/components/AvailabilityEmployee.tsx
import { useEffect, useState } from "react";
import axios from "axios";

function AvailabilityEmployee() {
const storedUser = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;

const employeeId = user?.id; // o idUser según tu backend

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availabilities, setAvailabilities] = useState<any[]>([]);

  // cargar disponibilidades
  useEffect(() => {
    axios.get(`http://localhost:3000/disponibilidades/empleado/${employeeId}`)
      .then(res => setAvailabilities(res.data))
      .catch(console.error);
  }, []);

  //  guardar disponibilidad
  const handleSave = async () => {
    try {

      if (!date || !startTime || !endTime) {
        alert("Completa todos los campos");
        return;
      }

      // evitar fechas pasadas
      const today = new Date().toISOString().split("T")[0];
      if (date < today) {
        alert("No puedes seleccionar fechas pasadas");
        return;
      }

      await axios.post("http://localhost:3000/disponibilidades", {
        employeeId,
        date,
        startTime,
        endTime
      });

      alert("Disponibilidad guardada");

      // recargar lista
      const res = await axios.get(`http://localhost:3000/disponibilidades/empleado/${employeeId}`);
      setAvailabilities(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <h2>Registrar disponibilidad</h2>

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      <input
        type="time"
        value={startTime}
        onChange={e => setStartTime(e.target.value)}
      />

      <input
        type="time"
        value={endTime}
        onChange={e => setEndTime(e.target.value)}
      />

      <button onClick={handleSave}>
        Guardar
      </button>

      <h3>Mis horarios</h3>

      {availabilities.map(a => (
        <div key={a.idAvailability}>
          📅 {a.date} | 🕒 {a.startTime} - {a.endTime}
        </div>
      ))}

    </div>
  );
}

export default AvailabilityEmployee;