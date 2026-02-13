/**
 * Unit Tests for ClaimExtractor
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { ClaimExtractor } from "../../../../src/domain/claim/services/ClaimExtractor";
import { Logger } from "../../../../src/shared/logging/Logger";
import OpenAI from "openai";

describe("ClaimExtractor", () => {
  let extractor: ClaimExtractor;
  let mockOpenAI: OpenAI;
  let mockLogger: Logger;

  beforeEach(() => {
    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    } as any;

    mockOpenAI = {
      chat: {
        completions: {
          create: vi.fn(),
        },
      },
    } as any;

    extractor = new ClaimExtractor(mockOpenAI, mockLogger);
  });

  describe("deterministic extraction", () => {
    it("should extract claims with citations", async () => {
      const analysisText = `
        According to recent research, carbon taxes reduce emissions by 15% [SRC-1].
        Studies show that renewable energy adoption increases with subsidies [SRC-2].
        The data indicates strong correlation between policy and outcomes [SRC-3].
      `;

      const claims = await extractor.extract({
        runId: "test-run",
        analysisText,
        correlationId: "test-corr",
      });

      expect(claims.length).toBeGreaterThan(0);
      expect(claims[0].text).toContain("carbon taxes");
      expect(claims[0].claimType).toBe("factual");
    });

    it("should classify causal claims correctly", async () => {
      const analysisText = `
        Tax increases lead to reduced consumption [SRC-1].
        This policy causes economic growth [SRC-2].
      `;

      const claims = await extractor.extract({
        runId: "test-run",
        analysisText,
        correlationId: "test-corr",
      });

      const causalClaims = claims.filter((c) => c.claimType === "causal");
      expect(causalClaims.length).toBeGreaterThan(0);
    });
  });

  describe("LLM fallback", () => {
    it("should fall back to LLM when deterministic fails", async () => {
      const analysisText = "Some text without clear citations";

      (mockOpenAI.chat.completions.create as any).mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                claims: [
                  {
                    text: "Extracted claim",
                    claimType: "factual",
                    confidence: 0.8,
                  },
                ],
              }),
            },
          },
        ],
      });

      const claims = await extractor.extract({
        runId: "test-run",
        analysisText,
        correlationId: "test-corr",
      });

      expect(claims.length).toBe(1);
      expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should throw on LLM failure", async () => {
      const analysisText = "Some text";

      (mockOpenAI.chat.completions.create as any).mockRejectedValue(
        new Error("API Error")
      );

      await expect(
        extractor.extract({
          runId: "test-run",
          analysisText,
          correlationId: "test-corr",
        })
      ).rejects.toThrow("API Error");

      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
