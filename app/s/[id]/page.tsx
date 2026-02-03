
import Shell from "@/components/Shell";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils"

export default async function SharedBrief({ params }: { params: { id: string } }) {
  const id = params.id;
  const brief = await prisma.brief.findFirst({ where: { OR: [{ publicId: id }, { id }] } });
  if (!brief) return <Shell><h1 className="text-4xl transition-all duration-200 hover:opacity-80">Not found</h1></Shell>;

  return (
    <Shell>
      <h1 className="text-4xl font-semibold transition-all duration-200 hover:opacity-80">Shared Brief</h1>
      <p className="text-muted mt-2 transition-all duration-200 hover:opacity-80">Read-only public view.</p>
      <div className="mt-8 prose prose-invert max-w-none transition-all duration-200 hover:opacity-80" dangerouslySetInnerHTML={{ __html: brief.html }} />
    </Shell>
  );
}
