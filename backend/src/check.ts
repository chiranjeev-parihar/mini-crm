import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@minicrm.com' } });
  if (!user) {
    console.log('User not found!');
    return;
  }
  console.log('User:', user.email);
  const valid = await bcrypt.compare('Admin@123', user.password);
  console.log('Is valid:', valid);
}

main().finally(() => prisma.$disconnect());
