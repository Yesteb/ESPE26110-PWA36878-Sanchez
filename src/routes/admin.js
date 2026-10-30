const { Router } = require("express");
const { postSchedule, listBookings } = require("../controllers/adminController");
const authenticateToken = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const router = Router();

router.use(authenticateToken, isAdmin);

router.post("/schedules", postSchedule);
router.get("/bookings", listBookings);

module.exports = router;
