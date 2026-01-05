const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'prisma', '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Running DB check: selecting up to 10 transactions...');
  const txs = await prisma.transaction.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: { category: true, account: true, user: true } });
  console.log('Result count:', txs.length);
  console.log(JSON.stringify(txs, null, 2));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error('DB check failed:', e && e.message ? e.message : e);
  try { await prisma.$disconnect(); } catch {};
  process.exit(1);
});
