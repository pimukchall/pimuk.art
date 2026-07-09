import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'pimuk@pimuk.art';
  const password = process.env.ADMIN_PASSWORD ?? 'changeme';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  const hashedPassword = await hash(password, 12);
  await prisma.user.create({ data: { email, name: 'Pimuk', hashedPassword } });
  console.log(`✓ Admin created: ${email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
