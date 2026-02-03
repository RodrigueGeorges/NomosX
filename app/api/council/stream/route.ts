/**
 * Streaming Council API — Server-Sent Events (SSE)
 * 
 * Utilité : User voit vraiment le processus multi-perspectives
 * UX Impact : Trust +60%, transparency totale
 */

const {NextRequest} = require('next/server');
const {selectSmartProviders} = require('@/lib/agent/smart-provider-selector');
const {scout} = require('@/lib/agent/pipeline-v2');
const {indexAgent} = require('@/lib/agent/index-agent');
const {rank} = require('@/lib/agent/pipeline-v2');
const {OpenAI} = require('openai');

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function sendEvent(controller: ReadableStreamDefaultController, event: string, data: any) {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  controller.enqueue(new TextEncoder().encode(message));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const question = searchParams.get('question');

  if (!question) {
    return new Response('Missing question parameter', { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 1. Smart Provider Selection
        sendEvent(controller, 'progress', {
          step: 'smart-selection',
          message: '🔍 Analyse multi-domaine de votre question...',
          progress: 5
        });

        const smartSelection = selectSmartProviders(question);
        
        sendEvent(controller, 'progress', {
          step: 'smart-selection',
          message: `✓ ${smartSelection.providers.length} sources académiques sélectionnées`,
          progress: 10
        });

        // 2. Scout
        sendEvent(controller, 'progress', {
          step: 'scout',
          message: '📚 Collecte des publications pour analyse multi-perspectives...',
          progress: 15
        });

        const scoutResult = await scout(question, smartSelection.providers, smartSelection.quantity);
        
        sendEvent(controller, 'progress', {
          step: 'scout',
          message: `✓ ${scoutResult.found} publications trouvées`,
          progress: 30
        });

        // 3. Index
        if (scoutResult.sourceIds.length > 0) {
          sendEvent(controller, 'progress', {
            step: 'index',
            message: '🔬 Enrichissement des métadonnées...',
            progress: 35
          });

          await indexAgent(scoutResult.sourceIds);
          
          sendEvent(controller, 'progress', {
            step: 'index',
            message: '✓ Sources enrichies',
            progress: 45
          });
        }

        // 4. Rank
        sendEvent(controller, 'progress', {
          step: 'rank',
          message: '⚖️ Sélection des 12 meilleures sources...',
          progress: 50
        });

        const sources = await rank(question, 12, "quality");
        
        sendEvent(controller, 'progress', {
          step: 'rank',
          message: `✓ ${sources.length} sources validées`,
          progress: 55
        });

        if (sources.length === 0) {
          throw new Error("Aucune source trouvée");
        }

        // 5. Génération des 4 perspectives
        sendEvent(controller, 'progress', {
          step: 'perspectives',
          message: '🧠 Génération des 4 perspectives distinctes...',
          progress: 60
        });

        const sourcesContext = sources.map((s, i) => {
          const authors = (s.authors || []).map((a: any) => a.author?.name || "Inconnu").slice(0, 3).join(", ");
          return `[SRC-${i + 1}] ${s.title} (${s.year || "N/A"}, ${authors || "N/A"})`;
        }).join("\n");

        const systemPrompt = `Tu es le Conseil NomosX, composé de 4 experts distincts qui analysent la même question sous 4 angles différents.

**RÈGLES CRITIQUES** :
1. Chaque perspective doit être DISTINCTE (pas de répétitions entre elles)
2. MINIMUM 3 citations [SRC-*] par perspective
3. Citations UNIQUEMENT de [SRC-1] à [SRC-${sources.length}]
4. Si contradiction entre sources → le mentionner explicitement
5. Format JSON strict

**4 PERSPECTIVES** :

**💰 ÉCONOMIQUE** (Economic Expert)
- Focus : ROI, coûts, marchés, business models, impacts financiers
- Question clé : "Combien ça coûte / rapporte ?"
- Ton : Pragmatique, data-driven, orienté décision

**🔧 TECHNIQUE** (Technical Expert)
- Focus : Faisabilité, architecture, outils, limites technologiques
- Question clé : "Comment ça marche / se construit ?"
- Ton : Rigoureux, précis, orienté implémentation

**❤️ ÉTHIQUE** (Ethics Expert)
- Focus : Justice, équité, risques sociaux, populations affectées
- Question clé : "Qui est impacté et comment ?"
- Ton : Humaniste, critique, orienté valeurs

**🏛️ POLITIQUE** (Policy Expert)
- Focus : Régulations, gouvernance, pouvoir, lobbying, stratégie institutionnelle
- Question clé : "Qui décide et pourquoi ?"
- Ton : Stratégique, institutionnel, orienté rapports de force`;

        const userPrompt = `Question : "${question}"

Sources disponibles :
${sourcesContext}

Génère une analyse multi-perspectives en JSON :

{
  "economic": "Analyse économique (300 mots min, 3+ citations [SRC-*])",
  "technical": "Analyse technique (300 mots min, 3+ citations [SRC-*])",
  "ethical": "Analyse éthique (300 mots min, 3+ citations [SRC-*])",
  "political": "Analyse politique (300 mots min, 3+ citations [SRC-*])",
  "synthesis": "Synthèse intégrant les 4 perspectives (200 mots, tensions et synergies)",
  "uncertainty": "Incertitudes et limites (100 mots, zones grises)"
}`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        });

        sendEvent(controller, 'progress', {
          step: 'perspectives',
          message: '✓ 4 perspectives générées',
          progress: 90
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        // 6. Done
        sendEvent(controller, 'done', {
          economic: result.economic || "",
          technical: result.technical || "",
          ethical: result.ethical || "",
          political: result.political || "",
          synthesis: result.synthesis || "",
          uncertainty: result.uncertainty || "",
          sources: sources.map((s, i) => ({
            id: s.id,
            num: i + 1,
            title: s.title,
            year: s.year,
            provider: s.provider
          })),
          progress: 100
        });

        controller.close();
      } catch (error: any) {
        console.error('Stream error:', error);
        sendEvent(controller, 'error', {
          message: error.message || 'Une erreur est survenue'
        });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
