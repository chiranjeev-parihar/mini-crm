import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Hash the default admin password
  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  // Upsert default admin user (won't duplicate on re-run)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@minicrm.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@minicrm.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Default admin user created:');
  console.log(`   Name:  ${admin.name}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role:  ${admin.role}`);
  console.log(`   ID:    ${admin.id}\n`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('🎉 Seeding complete!\n');
  })
  .catch(async (error) => {
    console.error('❌ Seeding failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
