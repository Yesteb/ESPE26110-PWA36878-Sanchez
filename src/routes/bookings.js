const { Router } = require("express");
const { create, getById, update, remove } = require("../controllers/bookingController");
const authenticateToken = require("../middlewares/auth");
const authorizeBooking = require("../middlewares/authorizeBooking");
const router = Router();

router.post("/", authenticateToken, create);
router.get("/:id", authenticateToken, authorizeBooking, getById);
router.put("/:id", authenticateToken, authorizeBooking, update);
router.delete("/:id", authenticateToken, authorizeBooking, remove);

module.exports = router;
