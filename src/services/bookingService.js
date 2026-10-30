const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const httpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateBooking = async (date, scheduleId) => {
  if (!date || !scheduleId) {
    throw httpError(400, "date y scheduleId son obligatorios");
  }
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    throw httpError(400, "date debe ser una fecha válida");
  }
  const id = Number(scheduleId);
  if (!Number.isInteger(id)) {
    throw httpError(400, "scheduleId debe ser un número entero");
  }
  const schedule = await prisma.schedule.findUnique({ where: { id } });
  if (!schedule) {
    throw httpError(404, "El horario no existe");
  }
  return { date: parsedDate, scheduleId: id };
};

const getBookingById = async (id) => {
  return prisma.booking.findUnique({
    where: { id },
    include: { schedule: true },
  });
};

const createBooking = async (userId, date, scheduleId) => {
  const data = await validateBooking(date, scheduleId);
  const occupied = await prisma.booking.findFirst({
    where: { date: data.date, scheduleId: data.scheduleId },
  });
  if (occupied) {
    throw httpError(400, "El horario ya está ocupado");
  }
  return prisma.booking.create({
    data: { ...data, userId },
    include: { schedule: true },
  });
};

const updateBooking = async (id, date, scheduleId) => {
  const data = await validateBooking(date, scheduleId);
  const occupied = await prisma.booking.findFirst({
    where: { date: data.date, scheduleId: data.scheduleId, NOT: { id } },
  });
  if (occupied) {
    throw httpError(400, "El horario ya está ocupado");
  }
  return prisma.booking.update({
    where: { id },
    data,
    include: { schedule: true },
  });
};

const deleteBooking = async (id) => {
  await prisma.booking.delete({ where: { id } });
};

module.exports = {
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
