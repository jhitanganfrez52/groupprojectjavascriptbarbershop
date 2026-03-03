import { Router, Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { Empresa } from "../models/Empresa.js";

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

      const empresa = await Empresa.create({
        nombreEmpresa: req.body.nombre,
        imageLogo: logoPath,
        imageQR: qrPath,
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
    const empresa = await Empresa.findOne();
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

      const empresa = await Empresa.findByPk(id);
      if (!empresa) return res.status(404).json({ message: "Empresa no encontrada" });

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Actualizar logo
      if (files?.imageLogo) {
        if (empresa.imageLogo) {
          const oldPath = path.join(
            process.cwd(),
            "src",
            empresa.imageLogo.replace("/uploads/", "uploads/")
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        empresa.imageLogo = `/uploads/empresa/logo/${files.imageLogo[0].filename}`;
      }

      // Actualizar QR
      if (files?.imageQr) {
        if (empresa.imageQR) {
          const oldPath = path.join(
            process.cwd(),
            "src",
            empresa.imageQR.replace("/uploads/", "uploads/")
          );
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        empresa.imageQR = `/uploads/empresa/qr/${files.imageQr[0].filename}`;
      }

      // Actualizar datos
      empresa.nombreEmpresa = req.body.nombreEmpresa ?? empresa.nombreEmpresa;
      empresa.numeroE = req.body.numeroE ?? empresa.numeroE;
      empresa.correoE = req.body.correoE ?? empresa.correoE;
      empresa.direccionE = req.body.direccionE ?? empresa.direccionE;

      await empresa.save();

      res.json(empresa);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar empresa", error });
    }
  }
);
export default router;
