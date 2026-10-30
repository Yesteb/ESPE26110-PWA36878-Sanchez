const { Router } = require("express");
const authRouter = require("./auth");
const adminRouter = require("./admin");
const bookingsRouter = require("./bookings");

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/bookings", bookingsRouter);

module.exports = router;
