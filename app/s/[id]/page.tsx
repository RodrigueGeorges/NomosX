
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function SharedBrief({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brief = await prisma.brief.findFirst({ where: { OR: [{ publicId: id }, { id }] } });
  if (!brief) notFound();

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">N</span>
          </div>
          <span className="text-sm text-white/50">NomosX — Shared Brief</span>
        </div>
        <h1 className="text-3xl font-semibold mb-2">Shared Brief</h1>
        <p className="text-white/50 text-sm mb-8">Read-only public view.</p>
        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: brief.html }} />
      </div>
    </div>
  );
}
