import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  generateRegisterOptions,
  verifyRegister,
  generateLoginOptions,
  verifyLogin,
  deleteCredential
} from "../controllers/fidoController.js";

const router = express.Router();

router.post("/register/options", authMiddleware, generateRegisterOptions);
router.post("/register/verify", authMiddleware, verifyRegister);
router.delete("/credentials/:credentialId", authMiddleware, deleteCredential);

router.post("/login/options", generateLoginOptions);
router.post("/login/verify", verifyLogin);

export default router;
