import { useEffect, useState } from "react";
import { useCompany } from "../hooks/useCompany";
import { companySchema } from "../types/companySchema";

const CompanyEdit = () => {
  const { company, editCompany, uploadImage, loading } = useCompany();

  const [form, setForm] = useState({
    companyName: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  /* cargar datos */
  useEffect(() => {
    if (company) {
      setForm({
        companyName: company.companyName || "",
        phoneNumber: company.phoneNumber || "",
        email: company.email || "",
        address: company.address || "",
      });
    }
  }, [company]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* submit con ZOD */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const result = companySchema.safeParse({
      ...form,
      phoneNumber: form.phoneNumber || null,
      email: form.email || null,
      address: form.address || null,
    });

    if (!result.success) {
      console.log(result.error.format());
      return;
    }
/* submit con ZOD */
const handleSubmit = async (e: any) => {
  e.preventDefault();

};
    await editCompany(result.data);
  };

  /* subir imagen */
  const handleImage = async (e: any, type: "logo" | "qr") => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadImage(file, type);
  };

  if (loading || !company) return <p>Cargando...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">

      {/* IMÁGENES */}
      <div className="flex gap-6 justify-center">
        <div>
          <img src={company.logoImage || ""} className="w-24 h-24 border" />
          <input type="file" onChange={(e) => handleImage(e, "logo")} />
        </div>

        <div>
          <img src={company.qrImage || ""} className="w-24 h-24 border" />
          <input type="file" onChange={(e) => handleImage(e, "qr")} />
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full border p-2"
        />

        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Teléfono"
          className="w-full border p-2"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Dirección"
          className="w-full border p-2"
        />

        <button className="w-full bg-red-500 text-white p-2">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default CompanyEdit;