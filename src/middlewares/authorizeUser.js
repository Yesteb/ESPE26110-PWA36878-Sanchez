function authorizeUser(req, res, next) {
  if (Number(req.params.id) !== req.user.id && req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Access denied, not your user" });
  next();
}

module.exports = authorizeUser;
