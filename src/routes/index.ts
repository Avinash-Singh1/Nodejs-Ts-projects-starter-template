// src/routes/index.ts
import { Router } from "express";
import doctorRoutes from "./doctor"; // note: file name is Doctor.ts (case-sensitive on some OS)
import registrationRoutes from "./registration";
import usersRoutes from "./users";
// import other routers...

const router = Router();

// mount doctor routes at /doctor
router.use("/doctor", doctorRoutes);

// mount other routers
router.use("/registration", registrationRoutes);
router.use("/users", usersRoutes);

export default router;
