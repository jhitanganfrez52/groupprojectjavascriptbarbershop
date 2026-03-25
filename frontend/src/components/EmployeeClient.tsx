import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  selectedService: number | null;
  onSelectEmployee: (employeeId: number) => void;
}

function EmployeeClient({ selectedService, onSelectEmployee }: Props) {
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    if (selectedService) {
      axios.get(`http://localhost:3000/servicios/${selectedService}/empleados`)
        .then(res => setEmployees(res.data))
        .catch(console.error);
    }
  }, [selectedService]);

  return (
    <div>
      <h3>Empleado</h3>
      <select onChange={(e) => onSelectEmployee(Number(e.target.value))}>
        <option value="">Selecciona empleado</option>

        {employees.map(e => (
          <option key={e.idUser} value={e.idUser}>
            {e.firstName} {e.lastName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EmployeeClient;