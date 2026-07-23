import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const project = await prisma.project.create({
    data: {
      title: body.title,
      url: body.url ?? null,
      category: body.category,
      type: body.type,
      year: body.year,
      accent: body.accent,
      deployLabel: body.deployLabel,
      deployDetail: body.deployDetail,
      description: body.description,
      stack: body.stack,
      modules: body.modules,
      imageUrl: body.imageUrl ?? null,
      images: body.images ?? [],
      order: Number(body.order) || 0,
      published: Boolean(body.published),
    },
  });
  return NextResponse.json(project, { status: 201 });
}
