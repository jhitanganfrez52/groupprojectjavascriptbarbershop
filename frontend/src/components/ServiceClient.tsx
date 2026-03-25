import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  onSelectService: (serviceId: number) => void;
}

function ServiceClient({ onSelectService }: Props) {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/admin/servicios")
      .then(res => setServices(res.data));
  }, []);

  return (
    <div>
      <h3>Servicio</h3>
      <select onChange={(e) => onSelectService(Number(e.target.value))}>
        <option value="">Selecciona un servicio</option>
        {services.map(s => (
          <option key={s.idService} value={s.idService}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ServiceClient;