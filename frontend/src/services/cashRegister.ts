// services/cashRegister.ts
import axios from 'axios';
import { CashRegister } from '../types/cashRegisterSchema';
export const getCashRegister = async () => {
  const res = await axios.get<CashRegister[]>('http://localhost:3000/caja');
  return res.data;
};

export const createCashRegister = async (data: Partial<CashRegister>) => {
  const res = await axios.post<CashRegister>('http://localhost:3000/caja/manual', data);
  return res.data;
};