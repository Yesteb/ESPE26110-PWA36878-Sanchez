const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const createSchedule = async (court, startTime, endTime) => {
  if (!court || !startTime || !endTime) {
    throw new Error("court, startTime y endTime son obligatorios");
  }
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (isNaN(start) || isNaN(end)) {
    throw new Error("startTime y endTime deben ser fechas válidas");
  }
  if (start >= end) {
    throw new Error("startTime debe ser anterior a endTime");
  }
  const schedule = await prisma.schedule.create({
    data: { court, startTime: start, endTime: end },
  });
  return schedule;
};

const getAllBookings = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      schedule: true,
    },
  });
  return bookings;
};

module.exports = { createSchedule, getAllBookings };
