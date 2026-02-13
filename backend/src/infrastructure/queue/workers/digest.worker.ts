/**
 * DIGEST Worker
 * 
 * Creates weekly summaries for topic subscriptions
 * Generates email-safe HTML digests
 */

import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { logger } from '../../../shared/logging/Logger';

export interface DigestJobPayload {
  topicId: string;
  period: string; // e.g., "2026-W03"
  limit?: number;
  correlationId: string;
}

export interface DigestJobResult {
  digestId: string;
  sourceCount: number;
  duration: number;
}

export class DigestWorker {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly openai: OpenAI
  ) {}

  async process(job: Job<DigestJobPayload>): Promise<DigestJobResult> {
    const startTime = Date.now();
    const { topicId, period, limit = 10, correlationId } = job.data;

    const log = logger.child({ 
      correlationId,
      topicId,
      period,
      jobId: job.id,
      worker: 'DIGEST'
    });

    log.info('Starting digest generation');

    try {
      // 1. Fetch topic
      const topic = await this.prisma.topic.findUnique({
        where: { id: topicId },
        select: {
          id: true,
          name: true,
          query: true,
          tags: true,
        },
      });

      if (!topic) {
        throw new Error(`Topic not found: ${topicId}`);
      }

      // 2. Find sources from last 7 days matching topic
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const sources = await this.prisma.source.findMany({
        where: {
          createdAt: { gte: weekAgo },
          OR: [
            { topics: { hasSome: topic.tags } },
            { title: { contains: topic.query, mode: 'insensitive' } },
          ],
        },
        orderBy: [
          { noveltyScore: 'desc' },
          { qualityScore: 'desc' },
        ],
        take: limit,
        select: {
          id: true,
          title: true,
          abstract: true,
          year: true,
          authors: {
            include: {
              author: {
                select: { name: true },
              },
            },
            take: 3,
          },
          qualityScore: true,
          noveltyScore: true,
        },
      });

      if (sources.length === 0) {
        // No new sources - create minimal digest
        const digest = await this.prisma.digest.create({
          data: {
            topicId,
            period,
            subject: `${topic.name} - Aucune nouvelle recherche cette semaine`,
            html: `<p>Aucune nouvelle publication n'a été trouvée pour "${topic.name}" cette semaine.</p>`,
            sources: [],
          },
        });

        log.info({ digestId: digest.id }, 'Empty digest created');

        return {
          digestId: digest.id,
          sourceCount: 0,
          duration: Date.now() - startTime,
        };
      }

      log.info({ sourceCount: sources.length }, 'Fetched sources for digest');

      // 3. Build context
      const sourceContext = sources.map((s, idx) => {
        const authors = s.authors.map(sa => sa.author.name).join(', ');
        return `[SRC-${idx + 1}] ${s.title}\nAuthors: ${authors}\nYear: ${s.year}\n${s.abstract || 'No abstract'}\nQuality: ${s.qualityScore}/100, Novelty: ${s.noveltyScore}/100\n`;
      }).join('\n\n');

      // 4. Generate digest with GPT
      const prompt = `You are writing a weekly research digest for topic: "${topic.name}".

Create an engaging, email-safe HTML digest highlighting the most significant sources from this week.

Structure:
1. Brief intro (1-2 sentences)
2. Highlight 3-5 most significant sources with:
   - Title and authors [SRC-X]
   - Why it matters (2-3 sentences)
3. "Signals" section: emerging trends or patterns
4. Keep under 500 words

SOURCES:
${sourceContext}

Return ONLY HTML (no <html>, <body> tags), suitable for email. Use inline styles for formatting.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a research analyst writing weekly digests. Always return clean HTML.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      });

      const html = completion.choices[0].message.content || '<p>Digest generation failed.</p>';

      // 5. Save digest
      const digest = await this.prisma.digest.create({
        data: {
          topicId,
          period,
          subject: `${topic.name} - Digest ${period}`,
          html,
          sources: sources.map(s => s.id),
        },
      });

      log.info({ digestId: digest.id }, 'Digest created');

      const duration = Date.now() - startTime;

      return {
        digestId: digest.id,
        sourceCount: sources.length,
        duration,
      };

    } catch (error) {
      log.error({ error }, 'Digest generation failed');
      throw error;
    }
  }
}
