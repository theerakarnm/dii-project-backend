import express from "express";
const router = express.Router();

router.post("/login", authLimiterMiddleware, authentication.loginAgent);
router.post("/register", auth, authentication.registerAgent);
router.post("/resetPassword", auth, authentication.updatePassword);

export default router;
