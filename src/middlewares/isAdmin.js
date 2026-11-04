function isAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN")
    return res.status(403).json({ error: "Acceso denegado, solo administradores" });
  next();
}

module.exports = isAdmin;
