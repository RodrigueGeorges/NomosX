
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brief = await prisma.brief.findUnique({ where: { id } });
  if (!brief) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!brief.publicId) await prisma.brief.update({ where: { id }, data: { publicId: id } });
  return NextResponse.json({ token: id });
}
