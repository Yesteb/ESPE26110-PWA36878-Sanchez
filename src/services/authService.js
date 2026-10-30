const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isValidEmail } = require("../utils/validation");

const registerUser = async (email, password, name) => {
  if (!name || !email || !password) {
    throw new Error("name, email y password son obligatorios");
  }
  if (!isValidEmail(email)) {
    throw new Error("El correo electrónico no es válido");
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new Error("El correo ya está registrado");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: "USER",
    },
  });
  return newUser;
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid email or password");
  }
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "4h" },
  );
  return token;
};

module.exports = { registerUser, loginUser };
