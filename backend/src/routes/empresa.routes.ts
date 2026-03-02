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
    } else {
      cb(null, "src/uploads/empresa/qr");
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

export default router;