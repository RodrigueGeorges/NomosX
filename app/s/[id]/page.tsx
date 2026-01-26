
import Shell from "@/components/Shell";
import { prisma } from "@/lib/db";

export default async function SharedBrief({ params }: { params: { id: string } }) {
  const id = params.id;
  const brief = await prisma.brief.findFirst({ where: { OR: [{ publicId: id }, { id }] } });
  if (!brief) return <Shell><h1 className="text-3xl">Not found</h1></Shell>;

  return (
    <Shell>
      <h1 className="text-3xl font-semibold">Shared Brief</h1>
      <p className="text-muted mt-2">Read-only public view.</p>
      <div className="mt-8 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: brief.html }} />
    </Shell>
  );
}
