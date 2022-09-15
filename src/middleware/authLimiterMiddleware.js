import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 1000 * 60 * 60 * 3, // 3 hours
  max: 5,
  message: "You try to login too many times. Please try again after 3 hours",
});

export default authLimiter;
