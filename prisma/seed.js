require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const FECHA = "2026-11-10";

async function main() {
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Paulo Galarza",
      email: "paulo.galarza@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  const julio = await prisma.user.create({
    data: {
      name: "Julio Esteban Sanchez Verduga",
      email: "jesanchez35@espe.edu.ec",
      password: await bcrypt.hash("user123", 10),
      role: "USER",
    },
  });

  const futbol = await prisma.schedule.create({
    data: {
      court: "Fútbol 1",
      startTime: new Date(`${FECHA}T08:00:00Z`),
      endTime: new Date(`${FECHA}T10:00:00Z`),
    },
  });

  const voley = await prisma.schedule.create({
    data: {
      court: "Vóley 1",
      startTime: new Date(`${FECHA}T10:00:00Z`),
      endTime: new Date(`${FECHA}T12:00:00Z`),
    },
  });

  await prisma.booking.create({
    data: {
      date: new Date(`${FECHA}T08:00:00Z`),
      user: { connect: { id: julio.id } },
      schedule: { connect: { id: futbol.id } },
    },
  });

  await prisma.booking.create({
    data: {
      date: new Date(`${FECHA}T10:00:00Z`),
      user: { connect: { id: admin.id } },
      schedule: { connect: { id: voley.id } },
    },
  });

  const users = await prisma.user.count();
  const schedules = await prisma.schedule.count();
  const bookings = await prisma.booking.count();
  console.log(
    `Seed completado: ${users} usuarios, ${schedules} horarios y ${bookings} reservas`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
