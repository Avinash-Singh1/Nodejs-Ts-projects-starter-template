
import { Router } from "express";
import { login, mainRoutes, register } from "../controllers/indexController";
const router= Router();
router.get("/",mainRoutes);
router.post("/register",register);
router.post("/login",login);

export default router;