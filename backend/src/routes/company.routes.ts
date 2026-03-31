import { Router, Request, Response } from "express";
import { Company } from "../models/Company.js";
import { upload } from "../middleware/uploads.js";
const router = Router();
/* =========================
   POST CREAR EMPRESA
========================= */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      phoneNumber,
      email,
      address,
    } = req.body;

    // validar mínimo
    if (!companyName) {
      return res.status(400).json({
        message: "El nombre de la empresa es obligatorio",
      });
    }

    // opcional: evitar duplicado (solo 1 empresa)
    const existing = await Company.findByPk(1);
    if (existing) {
      return res.status(400).json({
        message: "La empresa ya existe",
      });
    }

    const company = await Company.create({
      idCompany: 1, //  fijo como usas en GET
      companyName,
      phoneNumber: phoneNumber || null,
      email: email || null,
      address: address || null,
      logoImage: null,
      qrImage: null,
    });

    return res.status(201).json({
      message: "Empresa creada correctamente",
      company,
    });

  } catch (error) {
    console.error("Error al crear empresa:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});
/* =========================
    SUBIR LOGO / QR
========================= */
router.post(
  "/upload/:type",
  upload.single("image"), // ESTO FALTABA
  async (req: Request, res: Response) => {
  try {
    const file = req.file as any;
    const type = req.params.type as string;

    if (!file) {
      return res.status(400).json({ message: "No se subió ninguna imagen" });
    }

    if (!["logo", "qr"].includes(type)) {
      return res.status(400).json({
        message: "Tipo inválido. Usa 'logo' o 'qr'",
      });
    }

    const company = await Company.findByPk(1);

    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    if (type === "logo") {
      company.logoImage = file.path;
    } else {
      company.qrImage = file.path;
    }

    await company.save();

    return res.status(200).json({
      message: `${type.toUpperCase()} actualizado correctamente`,
      url: file.path,
    });

  } catch (error) {
    console.error("Error al subir imagen:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

/* =========================
    GET EMPRESA
========================= */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const company = await Company.findByPk(1);

    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    return res.status(200).json(company);

  } catch (error) {
    console.error("Error al obtener empresa:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

/* =========================
    PUT ACTUALIZAR EMPRESA
========================= */
router.put("/", async (req: Request, res: Response) => {
  try {
    const {
      companyName,
      phoneNumber,
      email,
      address
    } = req.body;

    const company = await Company.findByPk(1);

    if (!company) {
      return res.status(404).json({ message: "Empresa no encontrada" });
    }

    if (companyName !== undefined) company.companyName = companyName;
    if (phoneNumber !== undefined) company.phoneNumber = phoneNumber;
    if (email !== undefined) company.email = email;
    if (address !== undefined) company.address = address;

    await company.save();

    return res.status(200).json({
      message: "Empresa actualizada correctamente",
      company,
    });

  } catch (error) {
    console.error("Error al actualizar empresa:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;