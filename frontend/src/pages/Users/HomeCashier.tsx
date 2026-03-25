import { useEffect, useState } from "react";
import axios from "axios";

interface CashRegister {
  idCashRegister?: number;
  type: "income" | "expense";
  concept: string;
  amount: number;
  method: "cash" | "qr" | "card";
  date: string;
}

function HomeCashier() {
  const [data, setData] = useState<CashRegister[]>([]);
  const [summary, setSummary] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0,
  });

  const [form, setForm] = useState<CashRegister>({
    type: "income",
    concept: "",
    amount: 0,
    method: "cash",
    date: "",
  });

  /* =====================
     OBTENER REGISTROS
  ===================== */
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/caja");
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* =====================
     OBTENER RESUMEN
  ===================== */
  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:3000/caja/summary");
      setSummary(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSummary();
  }, []);

  /* =====================
     MANEJAR FORM
  ===================== */
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =====================
     CREAR REGISTRO
  ===================== */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3000/caja/manual", form);
      fetchData();
      fetchSummary();

      setForm({
        type: "income",
        concept: "",
        amount: 0,
        method: "cash",
        date: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2> Caja</h2>

      {/* =====================
          RESUMEN
      ===================== */}
      <div>
        <p>Ingresos: {summary.ingresos}</p>
        <p>Egresos: {summary.egresos}</p>
        <p>Balance: {summary.balance}</p>
      </div>

      {/* =====================
          FORMULARIO
      ===================== */}
      <form onSubmit={handleSubmit}>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="income">Ingreso</option>
          <option value="expense">Egreso</option>
        </select>

        <input
          type="text"
          name="concept"
          placeholder="Concepto"
          value={form.concept}
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount"
          placeholder="Monto"
          value={form.amount}
          onChange={handleChange}
        />

        <select name="method" value={form.method} onChange={handleChange}>
          <option value="cash">Efectivo</option>
          <option value="qr">QR</option>
          <option value="card">Tarjeta</option>
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <button type="submit">Registrar</button>
      </form>

      {/* =====================
          LISTA
      ===================== */}
      <h3>Movimientos</h3>
      <ul>
        {data.map((item) => (
          <li key={item.idCashRegister}>
            {item.type} - {item.concept} - Bs. {item.amount} - {item.method}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomeCashier;