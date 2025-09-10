// src/routes/Doctor.ts
import { Router } from "express";
import { verifyAuthToken } from "../utils/auth";
import validate from "../middlewares/validate";
import * as schema from "../schemas/doctorSchema";
import doctorController from "../controllers/doctorController";

const router = Router();

router.get(
  "/list",
  verifyAuthToken,            // <-- enable authentication
  validate(schema.getDoctorList, "query"),
  doctorController.getDoctorPatientList
);

export default router;
