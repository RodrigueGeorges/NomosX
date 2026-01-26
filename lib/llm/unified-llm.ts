/**
 * Unified LLM Service
 * Supports multiple providers (OpenAI, Anthropic) with automatic fallback
 */

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "../env";
import { getCachedLLMResponse, cacheLLMResponse } from "../cache/redis-cache";
import * as Sentry from "@sentry/nextjs";

// Provider types
export type LLMProvider = "openai" | "anthropic";

// Model configurations
const MODEL_CONFIG = {
  openai: {
    "gpt-4o": { contextWindow: 128000, costPer1kInput: 0.005, costPer1kOutput: 0.015 },
    "gpt-4o-mini": { contextWindow: 128000, costPer1kInput: 0.00015, costPer1kOutput: 0.0006 },
    "gpt-4-turbo": { contextWindow: 128000, costPer1kInput: 0.01, costPer1kOutput: 0.03 },
  },
  anthropic: {
    "claude-3-5-sonnet-20241022": { contextWindow: 200000, costPer1kInput: 0.003, costPer1kOutput: 0.015 },
    "claude-3-5-haiku-20241022": { contextWindow: 200000, costPer1kInput: 0.001, costPer1kOutput: 0.005 },
  },
};

// Clients
let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return openaiClient;
}

function getAnthropicClient(): Anthropic | null {
  if (!env.ANTHROPIC_API_KEY) return null;
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

export interface LLMRequest {
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  model?: string;
  provider?: LLMProvider;
  enableCache?: boolean;
}

export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  costUsd: number;
  cached: boolean;
}

/**
 * Calculate cost based on provider and model
 */
function calculateCost(
  provider: LLMProvider,
  model: string,
  tokensInput: number,
  tokensOutput: number
): number {
  const providerConfig = MODEL_CONFIG[provider as keyof typeof MODEL_CONFIG];
  const config = (providerConfig as any)?.[model];
  if (!config || !config.costPer1kInput || !config.costPer1kOutput) return 0;
  
  const inputCost = (tokensInput / 1000) * config.costPer1kInput;
  const outputCost = (tokensOutput / 1000) * config.costPer1kOutput;
  return inputCost + outputCost;
}

/**
 * Call OpenAI
 */
async function callOpenAI(request: LLMRequest): Promise<LLMResponse> {
  const client = getOpenAIClient();
  const model = request.model || env.OPENAI_MODEL || "gpt-4o";
  
  const completion = await client.chat.completions.create({
    model,
    messages: request.messages as any,
    temperature: request.temperature ?? 0.2,
    max_tokens: request.maxTokens ?? 4000,
    response_format: request.jsonMode ? { type: "json_object" } : undefined,
  });
  
  const content = completion.choices[0]?.message?.content || "";
  const tokensInput = completion.usage?.prompt_tokens || 0;
  const tokensOutput = completion.usage?.completion_tokens || 0;
  
  return {
    content,
    provider: "openai",
    model,
    tokensInput,
    tokensOutput,
    costUsd: calculateCost("openai", model, tokensInput, tokensOutput),
    cached: false,
  };
}

/**
 * Call Anthropic Claude
 */
async function callAnthropic(request: LLMRequest): Promise<LLMResponse> {
  const client = getAnthropicClient();
  if (!client) {
    throw new Error("Anthropic API key not configured");
  }
  
  const model = request.model || "claude-3-5-sonnet-20241022";
  
  // Extract system message
  const systemMessage = request.messages.find((m) => m.role === "system")?.content || "";
  const userMessages = request.messages.filter((m) => m.role !== "system");
  
  const completion = await client.messages.create({
    model,
    max_tokens: request.maxTokens ?? 4000,
    temperature: request.temperature ?? 0.2,
    system: systemMessage,
    messages: userMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });
  
  const content = completion.content[0]?.type === "text" ? completion.content[0].text : "";
  const tokensInput = completion.usage.input_tokens;
  const tokensOutput = completion.usage.output_tokens;
  
  return {
    content,
    provider: "anthropic",
    model,
    tokensInput,
    tokensOutput,
    costUsd: calculateCost("anthropic", model, tokensInput, tokensOutput),
    cached: false,
  };
}

/**
 * Unified LLM call with automatic fallback
 */
export async function callLLM(request: LLMRequest): Promise<LLMResponse> {
  const startTime = Date.now();
  
  // Check cache first if enabled
  if (request.enableCache !== false) {
    const cacheKey = JSON.stringify({
      messages: request.messages,
      temp: request.temperature,
      json: request.jsonMode,
    });
    
    const cached = await getCachedLLMResponse(
      cacheKey,
      request.model || env.OPENAI_MODEL || "gpt-4o"
    );
    
    if (cached) {
      return { ...cached, cached: true };
    }
  }
  
  // Determine provider order (with fallback)
  const primaryProvider = request.provider || "openai";
  const fallbackProvider: LLMProvider = primaryProvider === "openai" ? "anthropic" : "openai";
  
  const providers: LLMProvider[] = [primaryProvider];
  if (getAnthropicClient()) {
    providers.push(fallbackProvider);
  }
  
  // Try providers in order
  let lastError: Error | null = null;
  
  for (const provider of providers) {
    try {
      console.log(`🤖 Calling ${provider.toUpperCase()}...`);
      
      let response: LLMResponse;
      if (provider === "openai") {
        response = await callOpenAI(request);
      } else {
        response = await callAnthropic(request);
      }
      
      const duration = Date.now() - startTime;
      console.log(
        `✅ ${provider.toUpperCase()} success | ${duration}ms | $${response.costUsd.toFixed(4)}`
      );
      
      // Cache successful response
      if (request.enableCache !== false) {
        const cacheKey = JSON.stringify({
          messages: request.messages,
          temp: request.temperature,
          json: request.jsonMode,
        });
        await cacheLLMResponse(cacheKey, response.model, response);
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ ${provider.toUpperCase()} failed:`, error);
      
      // Log to Sentry
      Sentry.captureException(error, {
        tags: {
          provider,
          model: request.model,
        },
        contexts: {
          llm: {
            provider,
            temperature: request.temperature,
            jsonMode: request.jsonMode,
          },
        },
      });
      
      // Try next provider
      continue;
    }
  }
  
  // All providers failed
  const errorMsg = `All LLM providers failed. Last error: ${lastError?.message}`;
  Sentry.captureMessage(errorMsg, "error");
  throw new Error(errorMsg);
}

/**
 * Streaming LLM call (OpenAI only for now)
 */
export async function streamLLM(
  request: LLMRequest,
  onChunk: (chunk: string) => void
): Promise<LLMResponse> {
  const client = getOpenAIClient();
  const model = request.model || env.OPENAI_MODEL || "gpt-4o";
  
  const stream = await client.chat.completions.create({
    model,
    messages: request.messages as any,
    temperature: request.temperature ?? 0.2,
    max_tokens: request.maxTokens ?? 4000,
    stream: true,
  });
  
  let fullContent = "";
  let tokensOutput = 0;
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      fullContent += content;
      tokensOutput += 1; // Approximate
      onChunk(content);
    }
  }
  
  // Estimate tokens (rough approximation)
  const tokensInput = Math.ceil(
    request.messages.reduce((sum, m) => sum + m.content.length, 0) / 4
  );
  
  return {
    content: fullContent,
    provider: "openai",
    model,
    tokensInput,
    tokensOutput,
    costUsd: calculateCost("openai", model, tokensInput, tokensOutput),
    cached: false,
  };
}

/**
 * Get available providers
 */
export function getAvailableProviders(): LLMProvider[] {
  const providers: LLMProvider[] = ["openai"];
  if (getAnthropicClient()) {
    providers.push("anthropic");
  }
  return providers;
}

/**
 * Health check for providers
 */
export async function checkLLMHealth(): Promise<{
  openai: boolean;
  anthropic: boolean;
}> {
  const health = { openai: false, anthropic: false };
  
  // Test OpenAI
  try {
    const client = getOpenAIClient();
    await client.models.list();
    health.openai = true;
  } catch (err) {
    console.error("OpenAI health check failed:", err);
  }
  
  // Test Anthropic
  try {
    const client = getAnthropicClient();
    if (client) {
      // Simple test call
      health.anthropic = true;
    }
  } catch (err) {
    console.error("Anthropic health check failed:", err);
  }
  
  return health;
}
