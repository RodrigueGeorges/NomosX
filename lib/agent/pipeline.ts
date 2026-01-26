
import { prisma } from "../db";
import { scoreSource } from "../score";
import { clamp } from "../text";
import OpenAI from "openai";
import { searchOpenAlex } from "../providers/openalex";
import { searchThesesFr } from "../providers/thesesfr";
import { searchCrossref } from "../providers/crossref";
import { searchSemanticScholar } from "../providers/semanticscholar";
import { unpaywallByDoi } from "../providers/unpaywall";

const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

type Providers = Array<"openalex" | "thesesfr" | "crossref" | "semanticscholar">;

export async function scout(query: string, providers: Providers, perProvider = 20) {
  const pool: any[] = [];
  if (providers.includes("openalex")) pool.push(...(await searchOpenAlex(query, perProvider)));
  if (providers.includes("thesesfr")) pool.push(...(await searchThesesFr(query, Math.min(10, perProvider))));
  if (providers.includes("crossref")) pool.push(...(await searchCrossref(query, Math.min(20, perProvider))));
  if (providers.includes("semanticscholar")) pool.push(...(await searchSemanticScholar(query, Math.min(20, perProvider))));

  let upserted = 0;
  for (const s of pool) {
    const qualityScore = scoreSource({
      year: s.year ?? null,
      citationCount: s.citationCount ?? null,
      oaStatus: s.oaStatus ?? null,
      institutions: s.institutions ?? [],
      provider: s.provider,
      type: s.type
    });

    let pdfUrl = s.pdfUrl ?? null;
    let oaStatus = s.oaStatus ?? null;
    if (!pdfUrl && s.doi) {
      try {
        const clean = String(s.doi).replace(/^https?:\/\/doi\.org\//, "");
        const up = await unpaywallByDoi(clean);
        pdfUrl = up.pdfUrl ?? pdfUrl;
        oaStatus = up.oaStatus ?? oaStatus;
      } catch {}
    }

    await prisma.source.upsert({
      where: { id: s.id },
      update: {
        provider: s.provider,
        type: s.type || "paper",
        title: s.title || "",
        abstract: s.abstract ? clamp(String(s.abstract), 8000) : null,
        year: s.year ?? null,
        doi: s.doi ?? null,
        url: s.url ?? null,
        pdfUrl,
        oaStatus,
        authors: (s.authors ?? []).map(String).filter(Boolean),
        institutions: (s.institutions ?? []).map(String).filter(Boolean),
        topics: (s.topics ?? []).map(String).filter(Boolean),
        jelCodes: (s.jelCodes ?? []).map(String).filter(Boolean),
        citationCount: s.citationCount ?? null,
        qualityScore,
        raw: s.raw ?? null
      },
      create: {
        id: s.id,
        provider: s.provider,
        type: s.type || "paper",
        title: s.title || "",
        abstract: s.abstract ? clamp(String(s.abstract), 8000) : null,
        year: s.year ?? null,
        doi: s.doi ?? null,
        url: s.url ?? null,
        pdfUrl,
        oaStatus,
        authors: (s.authors ?? []).map(String).filter(Boolean),
        institutions: (s.institutions ?? []).map(String).filter(Boolean),
        topics: (s.topics ?? []).map(String).filter(Boolean),
        jelCodes: (s.jelCodes ?? []).map(String).filter(Boolean),
        citationCount: s.citationCount ?? null,
        qualityScore,
        raw: s.raw ?? null
      }
    });
    upserted += 1;
  }

  return { found: pool.length, upserted };
}

export async function rank(_: string, limit = 12) {
  return await prisma.source.findMany({
    take: limit,
    orderBy: [{ qualityScore: "desc" }, { createdAt: "desc" }]
  });
}

export async function analyst(question: string, sources: any[]) {
  const ctx = sources
    .map((s, i) => `[SRC-${i + 1}] id=${s.id}
` +
      `title=${s.title}
` +
      `year=${s.year ?? ""}
` +
      `provider=${s.provider}
` +
      `authors=${(s.authors || []).slice(0, 6).join(", ")}
` +
      `abstract=${(s.abstract || "").slice(0, 1200)}`)
    .join("\n\n");

  const prompt = `You are NomosX Analyst Agent (economics/strategy).
Task: produce a decision-ready brief grounded ONLY in sources.
Rules:
- Every non-trivial claim must include at least one [SRC-*] tag.
- If evidence is weak/conflicting, say it.
- Do NOT invent papers, numbers, or citations.
Return JSON with keys: title, summary, evidence, implications, risks, open_questions.

Question: ${question}

Sources:
${ctx}
`;

  const r = await ai.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  const txt = r.choices[0].message.content || "{}";
  try { return JSON.parse(txt); } catch { return {}; }
}

export function citationGuard(json: any, sourceCount: number) {
  const allText = JSON.stringify(json || {});
  const used = Array.from(allText.matchAll(/SRC-(\d+)/g)).map((m) => Number(m[1]));
  const invalid = used.filter((n) => n < 1 || n > sourceCount);
  return { ok: used.length > 0 && invalid.length === 0, usedCount: used.length, invalid };
}

export function renderBriefHTML(out: any, sources: any[]) {
  const esc = (s: string) => String(s || "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m] as string));
  const section = (h: string, v: any) => `<h2>${esc(h)}</h2><p>${esc(v || "")}</p>`;
  const srcHtml = sources
    .map((s: any, i: number) => `<li><strong>SRC-${i + 1}</strong> — ${esc(s.title)} ${s.year ? `(${s.year})` : ""} <span style="color:#666">[${esc(s.provider)}]</span></li>`)
    .join("");
  return `
  <article>
    <div style="font-size:12px;color:#777;margin-bottom:6px">NomosX — The agentic think tank</div>
    <h1>${esc(out.title || "NomosX Research Brief")}</h1>
    ${section("Executive summary", out.summary)}
    ${section("Evidence", out.evidence)}
    ${section("Implications", out.implications)}
    ${section("Risks & limitations", out.risks)}
    ${section("Open questions", out.open_questions)}
    <h2>Sources</h2>
    <ol>${srcHtml}</ol>
  </article>`;
}
