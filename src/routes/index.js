const { Router } = require("express");
const authRouter = require("./auth");

const router = Router();

router.use("/auth", authRouter);
// Monta aquí tus routers de los hitos 2, 3 y 4

module.exports = router;
