import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  Logger.log('========== START SEEDING! ==========');
  Logger.log('========== SEEDING COMPLETED! ==========');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
