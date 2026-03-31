import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: any, file: Express.Multer.File) => {
    const type = req.params.type as string; //  FIX

    // Validar tipo
    if (!["logo", "qr"].includes(type)) {
      throw new Error("Tipo inválido. Usa 'logo' o 'qr'");
    }

    return {
      folder: "company",
      public_id: type === "qr" ? "company_qr" : "company_logo",
      resource_type: "image",
    };
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo se permiten imágenes"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});