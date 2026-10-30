const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const getUserBookings = async (userId) => {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: { schedule: true },
  });
  return bookings;
};

module.exports = { getUserBookings };
