import express from "express";
import authLimiterMiddleware from "../middleware/authLimiterMiddleware";
import controller from "../controllers/authController";

const router = express.Router();

router.post("/login", authLimiterMiddleware, controller.login);
router.post("/register", controller.register);
// router.post("/resetPassword", auth, controller.updatePassword);

export default router;
