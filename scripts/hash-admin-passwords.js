const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'prisma', '.env') });
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admins = [
    { email: 'Trung@gmail.com', password: 'admin@123' },
    { email: 'Vinh@gmail.com', password: 'admin@123' }
  ];

  for (const a of admins) {
    const user = await prisma.user.findUnique({ where: { email: a.email } });
    if (!user) {
      console.log('User not found, creating:', a.email);
      const hashed = bcrypt.hashSync(a.password, 10);
      const created = await prisma.user.create({ data: { email: a.email, password: hashed, name: a.email.split('@')[0], role: 'ADMIN' } });
      console.log('Created:', created.email);
    } else {
      // If password already looks hashed (starts with $2a$ or $2b$), skip
      if (typeof user.password === 'string' && user.password.startsWith('$2')) {
        console.log('Already hashed, skipping:', a.email);
      } else {
        const hashed = bcrypt.hashSync(a.password, 10);
        await prisma.user.update({ where: { email: a.email }, data: { password: hashed, role: 'ADMIN' } });
        console.log('Updated hashed password for:', a.email);
      }
    }
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('Error:', e && e.message ? e.message : e);
  try { await prisma.$disconnect(); } catch (err) {}
  process.exit(1);
});
