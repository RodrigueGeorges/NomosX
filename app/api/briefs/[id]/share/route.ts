
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const brief = await prisma.brief.findUnique({ where: { id } });
  if (!brief) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!brief.publicId) await prisma.brief.update({ where: { id }, data: { publicId: id } });
  return NextResponse.json({ token: id });
}
