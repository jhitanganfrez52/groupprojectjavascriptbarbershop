// hooks/useReservation.ts
import { useState, useEffect } from "react";
import {
  getReservations,
  createReservation,
  updateReservation,
} from "../services/statusClient";
import { Reservation } from "../types/reservationSchema";

export const useReservation = (refreshCash?: () => Promise<void>) => {
  const [data, setData] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  const res = await getReservations();

  const sorted = [...res].sort((a, b) => {
    const dateA = a.date
      ? new Date(`${a.date}T${a.startTime}`)
      : new Date(0);

    const dateB = b.date
      ? new Date(`${b.date}T${b.startTime}`)
      : new Date(0);

    return dateB.getTime() - dateA.getTime(); //  DESC
  });

  setData(sorted);
  setLoading(false);
};

  const addReservation = async (reservation: Partial<Reservation>) => {
    await createReservation(reservation);

    await fetchData();
  };

  const updateStatus = async (id: number, status: Reservation["status"]) => {
    const reserva = data.find(r => r.idReservation === id);

    await updateReservation(id, { status });
      await refreshCash?.(); // 🔥 ahora sí refresca correctamente
    await fetchData();
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