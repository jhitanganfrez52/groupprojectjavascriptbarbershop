import { useState } from "react";
import axios from "axios";
interface Props {
  selectedEmployee: number | null;
  onSelectAvailability: (
    date: string,
    start: string,
    end: string,
    availabilityId: number | null
  ) => void;
}

function DateClient({ selectedEmployee, onSelectAvailability }: Props) {

  const [date, setDate] = useState("");
  const [hours, setHours] = useState<string[]>([]);
  const [duration, setDuration] = useState(30);
const [availabilityId, setAvailabilityId] = useState<number | null>(null);
  /* =========================
     SUMAR MINUTOS
  ========================= */
  const addMinutes = (time: string, mins: number) => {
    let [h, m] = time.split(":").map(Number);

    let total = h * 60 + m + mins;

    const newH = Math.floor(total / 60);
    const newM = total % 60;

    return `${newH.toString().padStart(2, "0")}:${newM
      .toString()
      .padStart(2, "0")}:00`;
  };

  /* =========================
     CARGAR HORAS DESDE BACKEND
  ========================= */
  const loadHours = async (selectedDate: string) => {
  setDate(selectedDate);

  if (!selectedEmployee) return;

  try {
    const res = await axios.get(
      `http://localhost:3000/disponibilidades/horas/${selectedEmployee}/${selectedDate}`
    );
const slots = res.data.slots;
const availability = res.data.availabilityId;

setHours(slots);
setAvailabilityId(availability);

// 👇 GUARDA TAMBIÉN EN UNA VARIABLE LOCAL SI QUIERES DEBUG
console.log("SET availabilityId:", availability);
  } catch (error) {
    console.error(error);
    setHours([]);
  }
};

  return (
    <div>

      {/* 📅 FECHA */}
      <h3>Fecha</h3>
      <input
        type="date"
        value={date}
        onChange={(e) => loadHours(e.target.value)}
      />

 {/* 🔥 PICKER DE HORAS */}
      <h3>Horas disponibles</h3>

      <select
       onChange={(e) => {
  const start = e.target.value;
  if (!start || !availabilityId) return;

  const end = addMinutes(start, duration);

  onSelectAvailability(date, start, end, availabilityId);
}}
      >
        <option value="">Selecciona hora</option>

        {Array.isArray(hours) && hours.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      {/* ⏱ DURACIÓN */}
      <h3>Duración (minutos)</h3>
      <input
        type="number"
        value={duration}
        min={15}
        max={180}
        onChange={(e) => setDuration(Number(e.target.value))}
      />

     

    </div>
  );
}

export default DateClient;