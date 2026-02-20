"use client";

const INSTITUTIONS = [
  { name: "MIT", abbr: "MIT" },
  { name: "Oxford University", abbr: "Oxford" },
  { name: "Stanford University", abbr: "Stanford" },
  { name: "Harvard University", abbr: "Harvard" },
  { name: "ETH Zürich", abbr: "ETH Zürich" },
  { name: "Johns Hopkins", abbr: "Johns Hopkins" },
  { name: "Georgetown University", abbr: "Georgetown" },
  { name: "Yale Law School", abbr: "Yale Law" },
  { name: "Sciences Po", abbr: "Sciences Po" },
  { name: "London School of Economics", abbr: "LSE" },
  { name: "Brookings Institution", abbr: "Brookings" },
  { name: "RAND Corporation", abbr: "RAND" },
  { name: "World Bank", abbr: "World Bank" },
  { name: "IMF Research", abbr: "IMF" },
  { name: "OECD", abbr: "OECD" },
  { name: "Carnegie Endowment", abbr: "Carnegie" },
];

function InstitutionChip({ name, abbr }: { name: string; abbr: string }) {
  return (
    <div
      className="flex-shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/[0.07] bg-white/[0.025] mx-3"
      title={name}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60" />
      <span className="text-[13px] font-medium text-white/40 whitespace-nowrap tracking-wide">
        {abbr}
      </span>
    </div>
  );
}

export default function TrustedByMarquee() {
  const doubled = [...INSTITUTIONS, ...INSTITUTIONS];

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#09090b] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#09090b] to-transparent z-10" />
      </div>

      <div className="text-center mb-10">
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/20">
          Trusted by researchers at
        </p>
      </div>

      <div className="flex overflow-hidden">
        <div className="flex animate-marquee">
          {doubled.map((inst, i) => (
            <InstitutionChip key={i} name={inst.name} abbr={inst.abbr} />
          ))}
        </div>
      </div>
    </section>
  );
}
