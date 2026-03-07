import { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Company } from "../models/Company.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "imageLogo") {
      cb(null, "src/uploads/empresa/logo");
    } else if (file.fieldname === "imageQr") {
      cb(null, "src/uploads/empresa/qr");
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

/* =========================
   CREAR EMPRESA
========================= */

router.post(
  "/",
  upload.fields([
    { name: "imageLogo", maxCount: 1 },
    { name: "imageQr", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as any;

      const logoPath = files?.imageLogo
        ? `/uploads/empresa/logo/${files.imageLogo[0].filename}`
        : null;

      const qrPath = files?.imageQr
        ? `/uploads/empresa/qr/${files.imageQr[0].filename}`
        : null;

   const empresa = await Company.create({
  companyName: req.body.companyName,
  logoImage: logoPath,
  qrImage: qrPath,
});

      res.status(201).json(empresa);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

/* =========================
   OBTENER EMPRESA
========================= */

router.get("/", async (_req: Request, res: Response) => {
  try {
    const empresa = await Company.findOne();
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ error });
  }
});

/* =========================
   ACTUALIZAR EMPRESA
========================= */
router.put(
  "/:id",
  upload.fields([
    { name: "imageLogo", maxCount: 1 },
    { name: "imageQr", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const empresa = await Company.findByPk(id);
      if (!empresa) return res.status(404).json({ message: "Empresa no encontrada" });

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Actualizar logo
      if (files?.imageLogo) {
        if (empresa.logoImage) {
          const oldPath = path.join(
            process.cwd(),
            "src",
            empresa.logoImage.replace("/uploads/", "uploads/")
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        empresa.logoImage = `/uploads/empresa/logo/${files.imageLogo[0].filename}`;
      }

      // Actualizar QR
      if (files?.imageQr) {
        if (empresa.logoImage) {
          const oldPath = path.join(
            process.cwd(),
            "src",
            empresa.logoImage.replace("/uploads/", "uploads/")
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        empresa.qrImage = `/uploads/empresa/qr/${files.imageQr[0].filename}`;
      }

      // Actualizar datos
     empresa.companyName = req.body.companyName ?? empresa.companyName;
empresa.phoneNumber = req.body.phoneNumber ?? empresa.phoneNumber;
empresa.email = req.body.email ?? empresa.email;
empresa.address = req.body.address ?? empresa.address;
      await empresa.save();

      res.json(empresa);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar empresa", error });
    }
  }
);
export default router;
