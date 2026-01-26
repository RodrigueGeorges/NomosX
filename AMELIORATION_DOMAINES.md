# Amélioration : Sélection de Domaines

**Ajout d'un système de catégories prédéfinies (Économie, Science, Écologie, Médecine, etc.)**

---

## 🎯 Problème Actuel

❌ L'utilisateur doit créer manuellement des Topics pour chaque domaine
❌ Pas de filtrage visuel par domaine dans l'interface
❌ Pas de suggestions de recherche par catégorie
❌ Difficile de découvrir les domaines disponibles

---

## ✅ Solution Proposée

Ajouter un **système de domaines prédéfinis** avec :
1. Catégories visuelles dans l'interface
2. Filtrage automatique par domaine
3. Suggestions de recherche contextuelles
4. Stats par domaine dans le dashboard

---

## 📊 Architecture Technique

### 1. Nouvelle Table `Domain`

```prisma
// prisma/schema.prisma

model Domain {
  id          String   @id @default(cuid())
  slug        String   @unique  // "economie", "science", "medecine"
  name        String               // "Économie"
  nameEn      String               // "Economics"
  icon        String               // Emoji ou icon name
  color       String               // Hex color
  description String?
  keywords    String[]             // Mots-clés de détection automatique
  jelCodes    String[]             // JEL codes (pour économie)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  // Relations
  topics      Topic[]
  sources     SourceDomain[]
  
  @@index([slug])
}

model SourceDomain {
  sourceId  String
  domainId  String
  score     Float    // Confiance 0-1
  source    Source   @relation(fields: [sourceId], references: [id], onDelete: Cascade)
  domain    Domain   @relation(fields: [domainId], references: [id], onDelete: Cascade)
  
  @@id([sourceId, domainId])
  @@index([domainId, score])
}

// Modifier Topic
model Topic {
  // ... champs existants
  domainId   String?
  domain     Domain?  @relation(fields: [domainId], references: [id], onDelete: SetNull)
}
```

---

### 2. Domaines Prédéfinis

```typescript
// lib/domains.ts

export const PREDEFINED_DOMAINS = [
  {
    slug: "economie",
    name: "Économie",
    nameEn: "Economics",
    icon: "💰",
    color: "#4C6EF5",  // Blue
    keywords: [
      "economics", "economy", "économie", "fiscal", "monetary",
      "gdp", "inflation", "unemployment", "finance", "banking",
      "trade", "market", "investment", "tax", "budget"
    ],
    jelCodes: ["E", "F", "G", "H"],  // JEL classification
  },
  {
    slug: "science",
    name: "Sciences",
    nameEn: "Sciences",
    icon: "🔬",
    color: "#A78BFA",  // Purple
    keywords: [
      "physics", "chemistry", "mathematics", "astronomy",
      "physique", "chimie", "mathématiques", "astronomie",
      "quantum", "particle", "molecule", "theorem", "equation"
    ],
    jelCodes: [],
  },
  {
    slug: "ecologie",
    name: "Écologie & Climat",
    nameEn: "Ecology & Climate",
    icon: "🌍",
    color: "#5EEAD4",  // Cyan
    keywords: [
      "climate", "environment", "ecology", "écologie", "biodiversity",
      "emissions", "carbon", "renewable", "sustainability", "pollution",
      "deforestation", "ocean", "atmosphere", "conservation"
    ],
    jelCodes: ["Q"],  // Environmental economics
  },
  {
    slug: "medecine",
    name: "Médecine & Santé",
    nameEn: "Medicine & Health",
    icon: "⚕️",
    color: "#FB7185",  // Rose
    keywords: [
      "medicine", "health", "médecine", "santé", "disease",
      "treatment", "diagnosis", "patient", "clinical", "therapy",
      "drug", "vaccine", "surgery", "epidemiology", "hospital"
    ],
    jelCodes: ["I"],  // Health economics
  },
  {
    slug: "technologie",
    name: "Technologie & IA",
    nameEn: "Technology & AI",
    icon: "🤖",
    color: "#FCD34D",  // Yellow
    keywords: [
      "technology", "artificial intelligence", "ai", "machine learning",
      "deep learning", "neural network", "algorithm", "computing",
      "software", "data science", "automation", "robotics"
    ],
    jelCodes: [],
  },
  {
    slug: "sociologie",
    name: "Sociologie & Société",
    nameEn: "Sociology & Society",
    icon: "👥",
    color: "#F97316",  // Orange
    keywords: [
      "sociology", "society", "sociologie", "social", "culture",
      "education", "inequality", "poverty", "migration", "demographics",
      "behavior", "identity", "community", "welfare"
    ],
    jelCodes: ["J", "Z"],  // Labor, Welfare
  },
  {
    slug: "politique",
    name: "Politique & Droit",
    nameEn: "Politics & Law",
    icon: "⚖️",
    color: "#8B5CF6",  // Violet
    keywords: [
      "politics", "policy", "law", "politique", "droit", "government",
      "regulation", "legislation", "democracy", "election", "vote",
      "constitution", "court", "justice", "rights"
    ],
    jelCodes: ["K"],  // Law economics
  },
  {
    slug: "energie",
    name: "Énergie",
    nameEn: "Energy",
    icon: "⚡",
    color: "#FBBF24",  // Amber
    keywords: [
      "energy", "énergie", "power", "electricity", "renewable",
      "solar", "wind", "nuclear", "fossil", "oil", "gas",
      "battery", "grid", "efficiency"
    ],
    jelCodes: ["Q4"],  // Energy economics
  },
];
```

---

### 3. Agent de Classification Automatique

```typescript
// lib/agent/domain-classifier.ts

import { PREDEFINED_DOMAINS } from "@/lib/domains";
import prisma from "@/lib/db";

/**
 * Classifie automatiquement une source dans un ou plusieurs domaines
 * Basé sur : title, abstract, topics, jelCodes
 */
export async function classifySourceDomains(sourceId: string) {
  const source = await prisma.source.findUnique({
    where: { id: sourceId },
    select: {
      title: true,
      abstract: true,
      topics: true,
      jelCodes: true,
    },
  });

  if (!source) return;

  // Combine tout le texte
  const text = [
    source.title,
    source.abstract || "",
    source.topics.join(" "),
  ].join(" ").toLowerCase();

  const matches: Array<{ domainSlug: string; score: number }> = [];

  // Score pour chaque domaine
  for (const domain of PREDEFINED_DOMAINS) {
    let score = 0;

    // Check keywords
    for (const keyword of domain.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }

    // Check JEL codes (pour économie)
    if (domain.jelCodes.length > 0 && source.jelCodes.length > 0) {
      for (const jelCode of source.jelCodes) {
        const jelPrefix = jelCode.charAt(0);
        if (domain.jelCodes.includes(jelPrefix)) {
          score += 5; // JEL codes = forte confiance
        }
      }
    }

    // Normaliser score (0-1)
    const maxKeywords = domain.keywords.length;
    const normalizedScore = Math.min(score / (maxKeywords * 0.3), 1);

    if (normalizedScore > 0.1) {  // Seuil minimum
      matches.push({ domainSlug: domain.slug, score: normalizedScore });
    }
  }

  // Créer liens SourceDomain
  for (const match of matches) {
    const domain = await prisma.domain.findUnique({
      where: { slug: match.domainSlug },
    });

    if (domain) {
      await prisma.sourceDomain.upsert({
        where: {
          sourceId_domainId: { sourceId, domainId: domain.id },
        },
        create: {
          sourceId,
          domainId: domain.id,
          score: match.score,
        },
        update: {
          score: match.score,
        },
      });
    }
  }

  return matches;
}

/**
 * Classifie toutes les sources d'un batch
 */
export async function classifyBatchSources(sourceIds: string[]) {
  const results = await Promise.allSettled(
    sourceIds.map((id) => classifySourceDomains(id))
  );

  return {
    success: results.filter((r) => r.status === "fulfilled").length,
    failed: results.filter((r) => r.status === "rejected").length,
  };
}
```

---

### 4. Composant UI : Sélecteur de Domaines

```tsx
// components/DomainSelector.tsx

"use client";
import { useState } from "react";
import { PREDEFINED_DOMAINS } from "@/lib/domains";
import Badge from "./ui/Badge";

type Props = {
  selected: string[];  // Slugs de domaines sélectionnés
  onChange: (selected: string[]) => void;
  mode?: "single" | "multiple";
};

export default function DomainSelector({ selected, onChange, mode = "multiple" }: Props) {
  function toggle(slug: string) {
    if (mode === "single") {
      onChange([slug]);
    } else {
      if (selected.includes(slug)) {
        onChange(selected.filter((s) => s !== slug));
      } else {
        onChange([...selected, slug]);
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {PREDEFINED_DOMAINS.map((domain) => {
        const isSelected = selected.includes(domain.slug);
        return (
          <button
            key={domain.slug}
            onClick={() => toggle(domain.slug)}
            className={`
              px-4 py-3 rounded-2xl border-2 transition-all
              flex items-center gap-3 hover:scale-[1.02]
              ${isSelected 
                ? "border-accent bg-accent/10 text-accent" 
                : "border-border bg-panel text-muted hover:border-accent/40"
              }
            `}
            style={{
              borderColor: isSelected ? domain.color : undefined,
              backgroundColor: isSelected ? `${domain.color}15` : undefined,
            }}
          >
            <span className="text-2xl">{domain.icon}</span>
            <div className="text-left">
              <div className="font-semibold text-sm">{domain.name}</div>
              <div className="text-xs opacity-70">{domain.nameEn}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
```

---

### 5. Page Search Améliorée

```tsx
// app/search/page.tsx (avec filtrage par domaine)

"use client";
import { useState } from "react";
import Shell from "@/components/Shell";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DomainSelector from "@/components/DomainSelector";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    
    // Construire query avec domaines
    const params = new URLSearchParams({
      q: query,
      domains: selectedDomains.join(","),
    });
    
    const res = await fetch(`/api/search?${params}`);
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  }

  return (
    <Shell>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-semibold tracking-tight">Recherche</h1>
        <p className="text-muted mt-2">
          Recherchez dans la base académique par mots-clés et domaines
        </p>

        {/* Sélecteur de domaines */}
        <div className="mt-8">
          <label className="block text-sm font-medium mb-3">
            Domaines (optionnel)
          </label>
          <DomainSelector
            selected={selectedDomains}
            onChange={setSelectedDomains}
            mode="multiple"
          />
        </div>

        {/* Barre de recherche */}
        <div className="mt-6 flex gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: inflation expectations, quantum computing..."
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <Button onClick={search} disabled={!query || loading}>
            {loading ? "Recherche..." : "Rechercher"}
          </Button>
        </div>

        {/* Filtres actifs */}
        {selectedDomains.length > 0 && (
          <div className="mt-4 flex gap-2 items-center">
            <span className="text-sm text-muted">Filtres :</span>
            {selectedDomains.map((slug) => {
              const domain = PREDEFINED_DOMAINS.find((d) => d.slug === slug);
              return (
                <Badge key={slug} variant="success">
                  {domain?.icon} {domain?.name}
                </Badge>
              );
            })}
            <button
              onClick={() => setSelectedDomains([])}
              className="text-xs text-muted hover:text-text"
            >
              Effacer
            </button>
          </div>
        )}

        {/* Résultats */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {results.map((result: any) => (
            <Card key={result.id} hoverable>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge>{result.provider}</Badge>
                  <Badge variant="success">QS {result.qualityScore}</Badge>
                </div>
                <h3 className="mt-3 font-semibold">{result.title}</h3>
                
                {/* Afficher domaines de la source */}
                <div className="flex gap-2 mt-2">
                  {result.domains?.map((d: any) => (
                    <Badge key={d.slug} style={{ backgroundColor: `${d.color}20`, color: d.color }}>
                      {d.icon} {d.name}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted line-clamp-3">
                  {result.abstract}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}
```

---

### 6. API Endpoint Modifié

```typescript
// app/api/search/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const domainsParam = searchParams.get("domains") || "";
  const domainSlugs = domainsParam ? domainsParam.split(",") : [];

  // Si domaines spécifiés, filtrer
  const domainFilter = domainSlugs.length > 0
    ? {
        domains: {
          some: {
            domain: {
              slug: { in: domainSlugs },
            },
            score: { gte: 0.2 },  // Seuil de confiance
          },
        },
      }
    : {};

  const results = await prisma.source.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { abstract: { contains: q, mode: "insensitive" } },
        { topics: { hasSome: [q] } },
      ],
      ...domainFilter,
    },
    take: 20,
    orderBy: { qualityScore: "desc" },
    include: {
      domains: {
        include: { domain: true },
        orderBy: { score: "desc" },
        take: 3,
      },
    },
  });

  return NextResponse.json({
    results: results.map((r) => ({
      id: r.id,
      title: r.title,
      abstract: r.abstract,
      year: r.year,
      qualityScore: r.qualityScore,
      provider: r.provider,
      domains: r.domains.map((sd) => ({
        slug: sd.domain.slug,
        name: sd.domain.name,
        icon: sd.domain.icon,
        color: sd.domain.color,
        score: sd.score,
      })),
    })),
  });
}
```

---

### 7. Dashboard avec Stats par Domaine

```tsx
// app/settings/page.tsx (onglet Monitoring)

<div>
  <h2 className="text-2xl font-semibold mb-4">Par Domaine</h2>
  <div className="grid md:grid-cols-4 gap-4">
    {stats.byDomain.map((item) => (
      <Card key={item.domainSlug}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm text-muted">{item.name}</p>
              <p className="text-3xl font-bold">{item.count}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-2 rounded-full"
            style={{ backgroundColor: `${item.color}30` }}
          >
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: item.color,
                width: `${(item.count / stats.totalSources) * 100}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
</div>
```

---

## 🚀 Plan d'Implémentation

### Phase 1 : Base (1-2h)
1. Ajouter modèles `Domain` et `SourceDomain` à `schema.prisma`
2. Run migration : `npx prisma db push`
3. Créer `lib/domains.ts` avec domaines prédéfinis
4. Seed DB avec domaines :
   ```typescript
   // scripts/seed-domains.mjs
   import { PREDEFINED_DOMAINS } from "./lib/domains.js";
   import prisma from "./lib/db.js";
   
   for (const d of PREDEFINED_DOMAINS) {
     await prisma.domain.create({ data: d });
   }
   ```

### Phase 2 : Classification (1-2h)
1. Créer `lib/agent/domain-classifier.ts`
2. Intégrer dans pipeline INDEX :
   ```typescript
   // lib/agent/index-agent.ts
   import { classifySourceDomains } from "./domain-classifier";
   
   export async function indexAgent(sourceIds: string[]) {
     // ... code existant ...
     
     // Après enrichissement
     await classifyBatchSources(sourceIds);
   }
   ```

### Phase 3 : UI (2-3h)
1. Créer composant `DomainSelector.tsx`
2. Modifier `app/search/page.tsx` avec filtrage
3. Modifier `app/api/search/route.ts` avec query domaines
4. Ajouter stats domaines dans `app/settings/page.tsx`

### Phase 4 : Topics Enhancement (1h)
1. Ajouter `domainId` à Topics (migration)
2. Modifier modal Topic pour sélectionner domaine
3. Auto-suggest query keywords selon domaine sélectionné

---

## ✅ Résultat Final

L'utilisateur pourra :
- ✅ **Sélectionner visuellement** Économie, Science, Écologie, Médecine, etc.
- ✅ **Filtrer la recherche** par un ou plusieurs domaines
- ✅ **Voir les domaines** de chaque source (badges colorés)
- ✅ **Créer Topics** liés à un domaine spécifique
- ✅ **Voir statistiques** par domaine dans le dashboard
- ✅ **Classification automatique** des sources par domaine

---

**Temps estimé : 5-8 heures** pour implémentation complète

**Impact utilisateur : Majeur** — Découverte et filtrage beaucoup plus intuitifs 🎯
