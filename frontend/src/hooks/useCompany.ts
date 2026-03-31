import { useState, useEffect } from "react";
import {
  getCompany,
  updateCompany,
  uploadCompanyImage,
} from "../services/company";
import { Company } from "../types/companySchema";

export const useCompany = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     GET EMPRESA
  ========================= */
  const fetchCompany = async () => {
    setLoading(true);
    try {
      const res = await getCompany();
      setCompany(res);
    } catch (error) {
      console.error("Error al obtener empresa:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UPDATE EMPRESA
  ========================= */
  const editCompany = async (data: Partial<Company>) => {
    try {
      await updateCompany(data);
      await fetchCompany(); //  refresca automáticamente
    } catch (error) {
      console.error("Error al actualizar empresa:", error);
    }
  };

  /* =========================
      SUBIR IMAGEN
  ========================= */
  const uploadImage = async (file: File, type: "logo" | "qr") => {
    try {
      await uploadCompanyImage(file, type);
      await fetchCompany(); //  refresca automáticamente
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
  };

  /* =========================
      INIT
  ========================= */
  useEffect(() => {
    fetchCompany();
  }, []);

  return {
    company,
    loading,
    fetchCompany,
    editCompany,
    uploadImage,
  };
};