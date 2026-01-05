const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'prisma', '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = [
    { email: 'Trung@gmail.com', password: 'admin@123', name: 'Trung' },
    { email: 'Vinh@gmail.com', password: 'admin@123', name: 'Vinh' }
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      const updated = await prisma.user.update({ where: { email: u.email }, data: { name: u.name, password: u.password, role: 'ADMIN' } });
      console.log('Updated:', updated.email);
    } else {
      const created = await prisma.user.create({ data: { email: u.email, password: u.password, name: u.name, role: 'ADMIN' } });
      console.log('Created:', created.email);
    }
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('Error adding admins:', e && e.message ? e.message : e);
  try { await prisma.$disconnect(); } catch {}
  process.exit(1);
});
