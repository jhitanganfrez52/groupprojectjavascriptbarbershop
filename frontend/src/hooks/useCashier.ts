// hooks/useCashier.ts
import { useState, useEffect } from 'react';
import { getCashRegister, createCashRegister } from '../services/cashRegister';
import { CashRegister } from '../types/cashRegisterSchema';

export const useCashier = () => {
  const [data, setData] = useState<CashRegister[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await getCashRegister();
    setData(res);
    setLoading(false);
  };

  const addMovement = async (movement: Partial<CashRegister>) => {
    await createCashRegister(movement);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, addMovement };
};