import express, { Router } from "express";
import { accountActivation, currentUser, facebookLogin, forgotPassword, googleLogin, login, register, resetPassword } from "../controllers/auth";
import { requiresSignin } from "../middlewares";
import { runValidation } from "../validators";
import { forgotPasswordValidate, registerValidate, resetPasswordValidate } from "../validators/auth";

const router: Router = express.Router();

router.post("/register", registerValidate, runValidation, register);
router.post('/account-activation', accountActivation);
router.post("/login", login);
router.get("/current-user", requiresSignin, currentUser)
router.put("/forgot-password",forgotPasswordValidate,runValidation, forgotPassword);
router.put("/reset-password",resetPasswordValidate,runValidation, resetPassword);
router.post('/login/google', googleLogin);
router.post('/login/facebook', facebookLogin);

module.exports = router;
