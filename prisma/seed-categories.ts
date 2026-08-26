import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'เงินเดือน', type: 'INCOME' as const, order: 1 },
  { name: 'รายได้เสริม', type: 'INCOME' as const, order: 2 },
  { name: 'อาหาร', type: 'EXPENSE' as const, order: 1 },
  { name: 'ค่าเดินทาง', type: 'EXPENSE' as const, order: 2 },
  { name: 'บิล/ค่าน้ำค่าไฟ', type: 'EXPENSE' as const, order: 3 },
  { name: 'ช้อปปิ้ง', type: 'EXPENSE' as const, order: 4 },
  { name: 'บันเทิง', type: 'EXPENSE' as const, order: 5 },
  { name: 'สุขภาพ', type: 'EXPENSE' as const, order: 6 },
  { name: 'โอนระหว่างบัญชี', type: 'TRANSFER' as const, order: 1 },
];

async function main() {
  const existing = await prisma.category.count();
  if (existing > 0) {
    console.log(`มี ${existing} categories อยู่แล้ว — ข้ามการ seed`);
    return;
  }

  for (const c of categories) {
    await prisma.category.create({ data: c });
    console.log(`✓ ${c.name}`);
  }
  console.log('Seed categories เสร็จแล้ว');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
