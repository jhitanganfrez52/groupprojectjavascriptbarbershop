//src/services/statusClient.ts
import axios from "axios";
import { Reservation } from "../types/reservationSchema";

const API_URL = "http://localhost:3000/reservas";

//  GET todas las reservas
export const getReservations = async () => {
  const res = await axios.get<Reservation[]>(API_URL);
  return res.data;
};

//  GET una reserva por ID
export const getReservationById = async (id: number) => {
  const res = await axios.get<Reservation>(`${API_URL}/${id}`);
  return res.data;
};

//  POST crear reserva
export const createReservation = async (
  data: Partial<Reservation>
) => {
  const res = await axios.post<Reservation>(API_URL, data);
  return res.data;
};

//  PUT actualizar reserva (estado, datos, etc.)
export const updateReservation = async (
  id: number,
  data: Partial<Reservation>
) => {
  const res = await axios.put<Reservation>(
    `${API_URL}/${id}`,
    data
  );
  return res.data;
};

//  DELETE eliminar reserva
export const deleteReservation = async (id: number) => {
  const res = await axios.delete<{ msg: string }>(
    `${API_URL}/${id}`
  );
  return res.data;
};