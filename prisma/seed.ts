import { PrismaClient, ServiceType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // --- 1. Seed Services ---
  const services = Object.values(ServiceType);

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service },
      update: {},
      create: { name: service, description: `${service} services` },
    });
  }

  console.log("Default Services seeded");

  // --- 2. Create Demo Users ---
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Customer
  const customer = await prisma.user.upsert({
    where: { email: "customer@test.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@test.com",
      password: hashedPassword,
      role: "CUSTOMER",
      address: "Ghansoli",
    },
  });

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      name: "Demo Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "ADMIN",
      address: "Ghansoli",
    },
  });

  // Technician (linked to a service, e.g., PLUMBING)
  const plumbingService = await prisma.service.findUnique({
    where: { name: "PLUMBING" },
  });

  const technicianUser = await prisma.user.upsert({
    where: { email: "technician@test.com" },
    update: {},
    create: {
      name: "Demo Technician",
      email: "technician@test.com",
      password: hashedPassword,
      role: "TECHNICIAN",
      city:"Mumbai",
      address: "Ghansoli, Navi Mumbai",
    },
  });

  if (plumbingService) {
    await prisma.technician.upsert({
      where: { userId: technicianUser.id },
      update: {},
      create: {
        userId: technicianUser.id,
        serviceId: plumbingService.id,
        bio: "Experienced plumber with 5 years in field",
        verified: true,
      },
    });
  }

  console.log("Demo Users seeded");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
