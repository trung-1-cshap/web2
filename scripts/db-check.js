const path = require('path');
// Load prisma/.env if present
require('dotenv').config({ path: path.join(__dirname, '..', 'prisma', '.env') });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Running DB check: selecting up to 10 categories...');
  const cats = await prisma.category.findMany({ take: 10 });
  console.log('Result:', JSON.stringify(cats, null, 2));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('DB check failed:');
  console.error(e && e.message ? e.message : e);
  try { await prisma.$disconnect(); } catch {};
  process.exit(1);
});
