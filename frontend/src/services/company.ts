import axios from "axios";
import { Company } from "../types/companySchema";

const API_URL = "http://localhost:3000/empresa";

/* =========================
   GET EMPRESA
========================= */
export const getCompany = async () => {
  const res = await axios.get<Company>(API_URL);
  return res.data;
};

/* =========================
    UPDATE EMPRESA
========================= */
export const updateCompany = async (data: Partial<Company>) => {
  const res = await axios.put<{
    message: string;
    company: Company;
  }>(API_URL, data);

  return res.data;
};

/* =========================
    SUBIR LOGO / QR
========================= */
export const uploadCompanyImage = async (
  file: File,
  type: "logo" | "qr"
) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post<{
    message: string;
    url: string;
  }>(`${API_URL}/upload/${type}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};