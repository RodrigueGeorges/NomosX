/**
 * RADAR Worker
 * 
 * Identifies weak signals and emerging trends from high-novelty sources
 * Generates radar cards for dashboard
 */

import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { logger } from '../../../shared/logging/Logger';
import { z } from 'zod';

export interface RadarJobPayload {
  limit?: number;
  minNoveltyScore?: number;
  correlationId: string;
}

const RadarCardSchema = z.object({
  title: z.string(),
  signal: z.string(),
  why_it_matters: z.string(),
  sources: z.array(z.string()),
  confidence: z.enum(['high', 'medium', 'low']),
});

type RadarCard = z.infer<typeof RadarCardSchema>;

export interface RadarJobResult {
  cards: RadarCard[];
  sourceCount: number;
  duration: number;
}

export class RadarWorker {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly openai: OpenAI
  ) {}

  async process(job: Job<RadarJobPayload>): Promise<RadarJobResult> {
    const startTime = Date.now();
    const { limit = 5, minNoveltyScore = 60, correlationId } = job.data;

    const log = logger.child({ 
      correlationId,
      jobId: job.id,
      worker: 'RADAR'
    });

    log.info({ limit, minNoveltyScore }, 'Starting radar signal detection');

    try {
      // 1. Fetch recent high-novelty sources
      const sources = await this.prisma.source.findMany({
        where: {
          noveltyScore: { gte: minNoveltyScore },
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        },
        orderBy: [
          { noveltyScore: 'desc' },
          { createdAt: 'desc' },
        ],
        take: 20, // Get top 20 for analysis
        select: {
          id: true,
          title: true,
          abstract: true,
          year: true,
          provider: true,
          noveltyScore: true,
        },
      });

      if (sources.length === 0) {
        log.info('No high-novelty sources found');
        return {
          cards: [],
          sourceCount: 0,
          duration: Date.now() - startTime,
        };
      }

      log.info({ sourceCount: sources.length }, 'Fetched high-novelty sources');

      // 2. Build context for LLM
      const sourceContext = sources.map((s, idx) => 
        `[SRC-${idx + 1}] ${s.title}\n${s.abstract || 'No abstract'}\nNovelty: ${s.noveltyScore}/100\n`
      ).join('\n\n');

      // 3. Prompt GPT to identify signals
      const prompt = `You are a trend analyst for a strategic think tank.

Analyze these high-novelty academic papers and identify ${limit} emerging signals or weak trends.

A good signal is:
- Novel or unexpected
- Has potential strategic impact
- Not yet mainstream
- Backed by credible research

For each signal, provide:
- title: Clear, compelling signal name
- signal: What we're seeing (2-3 sentences)
- why_it_matters: Strategic implications (2-3 sentences)
- sources: Array of source IDs (e.g., ["SRC-1", "SRC-3"])
- confidence: high/medium/low

SOURCES:
${sourceContext}

Return ONLY a valid JSON array of ${limit} radar cards, no markdown, no explanation.

Format:
[
  {
    "title": "AI-driven carbon accounting",
    "signal": "Emerging research shows...",
    "why_it_matters": "This could disrupt...",
    "sources": ["SRC-1", "SRC-3"],
    "confidence": "high"
  }
]`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a strategic trend analyst. Always return valid JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0].message.content || '{"cards": []}';
      const parsed = JSON.parse(content);
      const cards = z.array(RadarCardSchema).parse(parsed.cards || parsed);

      log.info({ cardCount: cards.length }, 'Radar signals identified');

      const duration = Date.now() - startTime;

      return {
        cards,
        sourceCount: sources.length,
        duration,
      };

    } catch (error) {
      log.error({ error }, 'Radar signal detection failed');
      throw error;
    }
  }
}
