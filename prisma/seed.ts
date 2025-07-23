import { PrismaClient, ServiceType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const services = Object.values(ServiceType);

    for(const service of services){
        await prisma.service.upsert({
            where : { name : service },
            update: {},
            create: { name: service, description: `${service} services` }
        })
    }

    console.log("Default Services seeded")
}

main().catch((e) => console.error(e))
      .finally(() => prisma.$disconnect());