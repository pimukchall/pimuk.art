import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
  {
    title: 'Taurus Renovation',
    url: 'https://taurusrenovation.com',
    category: 'Commercial Web Application',
    type: 'Public · Custom Domain',
    year: '2024',
    accent: '#4ade80',
    deployLabel: 'Vercel + Railway',
    deployDetail: 'Custom Domain · Auto CI/CD',
    description: 'ออกแบบและพัฒนาเว็บไซต์เต็มรูปแบบสำหรับธุรกิจรับเหมาก่อสร้างและรีโนเวท ครอบคลุมตั้งแต่ Landing Page จนถึง Backend API และ Database ด้วยตนเองทั้งหมด พร้อม Admin Dashboard สำหรับจัดการ Portfolio Content',
    stack: [
      { group: 'Frontend', items: ['Next.js 15', 'App Router', 'Tailwind CSS v4', 'Framer Motion'] },
      { group: 'Backend', items: ['Express.js 5', 'Prisma ORM', 'MySQL 8', 'RESTful API'] },
      { group: 'Infra', items: ['Vercel', 'Railway', 'Cloudinary', 'Auto Deploy'] },
    ],
    modules: ['Landing Page', 'Project Gallery', 'Design Showcase', 'Furniture Catalog', 'News & Articles', 'Contact & Inquiry', 'Admin Dashboard', 'SEO Optimisation'],
    images: [],
    order: 1,
    published: true,
  },
  {
    title: 'Emperor ERP',
    url: null,
    category: 'Internal Enterprise Platform',
    type: 'Intranet · On-premise',
    year: '2024–Present',
    accent: '#a78bfa',
    deployLabel: 'PM2 + VMware ESXi',
    deployDetail: 'Office Server · Intranet Only',
    description: 'พัฒนาและขยายระบบ ERP ภายในองค์กรอย่างต่อเนื่อง ครอบคลุม Multi-Auth (Local / AD / Microsoft 365 OAuth 2.0), Employee Evaluation, IT Service Desk, Training Assessment, Meeting Room Booking, Supply Requisition บน Nuxt 4 + Node.js / Raw MySQL เพื่อควบคุม Performance เต็มที่',
    stack: [
      { group: 'Frontend', items: ['Nuxt 4', 'Vue 3', 'Vuetify', 'Pinia'] },
      { group: 'Backend', items: ['Node.js / Express', 'Raw MySQL', 'JWT', 'RBAC'] },
      { group: 'Infra', items: ['PM2', 'VMware ESXi', 'Ubuntu Linux', 'Windows Server'] },
    ],
    modules: ['Multi-Auth (Local / AD / M365)', 'Employee Evaluation', 'IT Service Desk', 'Org Structure Chart', 'Internal Training', 'Meeting Room Booking', 'Supply Requisition', 'Network Health Monitor'],
    images: [],
    order: 2,
    published: true,
  },
  {
    title: 'Mavixtech',
    url: 'https://mavixtech.vercel.app',
    category: 'Tech Company Website + CMS',
    type: 'Public · Commercial',
    year: '2025',
    accent: '#38bdf8',
    deployLabel: 'Vercel + Railway',
    deployDetail: 'Serverless · Auto Deploy',
    description: 'เว็บไซต์บริษัทเทคโนโลยีพร้อม Admin CMS เต็มรูปแบบ ออกแบบ UI ที่ทันสมัยด้วย Framer Motion Animation รองรับการจัดการ Projects, News และ Contact Submissions ผ่าน Dashboard พร้อม NextAuth Authentication',
    stack: [
      { group: 'Frontend', items: ['Next.js App Router', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
      { group: 'Backend', items: ['Next.js API Routes', 'Prisma ORM', 'MySQL', 'NextAuth v4'] },
      { group: 'Media', items: ['Cloudinary', 'Image Optimization', 'Sharp'] },
    ],
    modules: ['Home · About · Services', 'Projects Portfolio', 'News & Articles', 'Contact Form', 'Admin Dashboard', 'Project CMS', 'News CMS', 'Contact Management'],
    images: [],
    order: 3,
    published: true,
  },
  {
    title: 'Leo Furniture',
    url: 'https://leo-project-ruby.vercel.app',
    category: 'Multilingual Brand Website + CMS',
    type: 'Public · i18n · Multi-lang',
    year: '2025',
    accent: '#fb923c',
    deployLabel: 'Vercel',
    deployDetail: 'Serverless · Global CDN',
    description: 'เว็บไซต์แบรนด์เฟอร์นิเจอร์คลาสสิกรองรับหลายภาษา (next-intl) พร้อม Product Catalog, Project Portfolio และ Admin CMS ออกแบบ Tree Structure Data Model สำหรับ i18n ที่ Scalable และ Admin Dashboard สำหรับจัดการ Products, Projects และ Inquiries',
    stack: [
      { group: 'Frontend', items: ['Next.js App Router', 'next-intl (i18n)', 'Tailwind CSS v4', 'Framer Motion'] },
      { group: 'Backend', items: ['Next.js API Routes', 'Prisma ORM', 'MySQL', 'NextAuth v4'] },
      { group: 'Infra', items: ['Vercel', 'Cloudinary', 'Sharp', 'SEO + Sitemap'] },
    ],
    modules: ['Multi-language (TH / EN)', 'Collections Catalog', 'Project Portfolio', 'About & Contact', 'Inquiry Form', 'Admin: Products', 'Admin: Projects', 'Admin: Inquiries'],
    images: [],
    order: 4,
    published: true,
  },
];

async function main() {
  const existing = await prisma.project.count();
  if (existing > 0) {
    console.log(`มี ${existing} projects อยู่แล้ว — ข้ามการ seed`);
    return;
  }

  for (const p of projects) {
    await prisma.project.create({ data: p });
    console.log(`✓ ${p.title}`);
  }
  console.log('Seed projects เสร็จแล้ว');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
