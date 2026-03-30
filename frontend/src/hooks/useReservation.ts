// hooks/useReservation.ts
import { useState, useEffect } from "react";
import {
  getReservations,
  createReservation,
  updateReservation,
} from "../services/statusClient";
import { Reservation } from "../types/reservationSchema";
import { useCashier } from "../hooks/useCashier";
export const useReservation = () => {
  const [data, setData] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
const { fetchData: refreshCash } = useCashier();
  // 🔹 obtener datos
  const fetchData = async () => {
    setLoading(true);
    const res = await getReservations();
    setData(res);
    setLoading(false);
  };

  // 🔹 crear reserva
  const addReservation = async (reservation: Partial<Reservation>) => {
    await createReservation(reservation);
   
await refreshCash(); // 🔥 ACTUALIZA CAJA
    fetchData();
  };

  type Status = "pending" | "confirmed" | "completed" | "cancelled";

const updateStatus = async (id: number, status: Reservation["status"]) => {
  const reserva = data.find(r => r.idReservation === id);

  await updateReservation(id, { status });

  fetchData();
};

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    addReservation,
    updateStatus,
  };
};