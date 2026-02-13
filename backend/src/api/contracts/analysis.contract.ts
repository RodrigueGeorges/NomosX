/**
 * API Contracts for Analysis Endpoints
 * 
 * Type-safe contracts using Zod for validation + TypeScript types
 */

import { z } from 'zod';

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

export const CreateAnalysisRunRequestSchema = z.object({
  question: z.string().min(10).max(2000),
  mode: z.enum(["brief", "council"]),
  providers: z
    .array(z.enum(["openalex", "crossref", "semanticscholar", "thesesfr"]))
    .optional(),
  maxSources: z.number().int().min(5).max(50).optional().default(12),
});

export type CreateAnalysisRunRequest = z.infer<
  typeof CreateAnalysisRunRequestSchema
>;

export const GetAnalysisRunRequestSchema = z.object({
  runId: z.string().uuid(),
});

export type GetAnalysisRunRequest = z.infer<typeof GetAnalysisRunRequestSchema>;

export const SubmitFeedbackRequestSchema = z.object({
  runId: z.string().uuid(),
  overallRating: z.number().int().min(1).max(5),
  usefulness: z.number().int().min(1).max(5),
  trustworthiness: z.number().int().min(1).max(5),
  completeness: z.number().int().min(1).max(5),
  comment: z.string().max(5000).optional(),
  wasUsedForDecision: z.boolean().optional(),
});

export type SubmitFeedbackRequest = z.infer<typeof SubmitFeedbackRequestSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const ClaimDTOSchema = z.object({
  id: z.string(),
  text: z.string(),
  claimType: z.enum(["factual", "causal", "evaluative", "normative"]),
  category: z
    .enum(["economic", "technical", "ethical", "political", "social", "environmental"])
    .optional(),
  confidence: z.number().min(0).max(1),
  trustScore: z.number().min(0).max(1).optional(),
  trustLevel: z.enum(["low", "medium", "high"]).optional(),
  evidenceCount: z.number().int(),
  isVerified: z.boolean(),
  hasContradiction: z.boolean(),
  needsMoreEvidence: z.boolean(),
  isReliable: z.boolean(),
  createdAt: z.string().datetime(),
});

export type ClaimDTO = z.infer<typeof ClaimDTOSchema>;

export const AnalysisRunDTOSchema = z.object({
  id: z.string(),
  correlationId: z.string(),
  question: z.string(),
  mode: z.enum(["brief", "council"]),
  status: z.enum(["PENDING", "RUNNING", "COMPLETED", "FAILED", "CANCELLED"]),
  
  // Trust & Quality
  trustScore: z.number().min(0).max(1).optional(),
  qualityScore: z.number().min(0).max(1).optional(),
  completeness: z.number().min(0).max(1).optional(),
  
  // Metrics
  claimCount: z.number().int(),
  evidenceCount: z.number().int(),
  sourcesUsed: z.array(z.string()),
  
  // Quality breakdown
  citationCoverage: z.number().min(0).max(1).optional(),
  sourceQuality: z.number().min(0).max(1).optional(),
  evidenceStrength: z.number().min(0).max(1).optional(),
  contradictionRate: z.number().min(0).max(1).optional(),
  
  // Cost
  tokensUsed: z.number().int(),
  costUsd: z.number(),
  
  // Timing
  startedAt: z.string().datetime().optional(),
  finishedAt: z.string().datetime().optional(),
  duration: z.number().int().optional(),
  
  // Output
  outputHtml: z.string().optional(),
  
  createdAt: z.string().datetime(),
});

export type AnalysisRunDTO = z.infer<typeof AnalysisRunDTOSchema>;

export const CreateAnalysisRunResponseSchema = z.object({
  run: AnalysisRunDTOSchema,
  message: z.string(),
});

export type CreateAnalysisRunResponse = z.infer<
  typeof CreateAnalysisRunResponseSchema
>;

export const GetAnalysisRunResponseSchema = z.object({
  run: AnalysisRunDTOSchema,
  claims: z.array(ClaimDTOSchema).optional(),
});

export type GetAnalysisRunResponse = z.infer<
  typeof GetAnalysisRunResponseSchema
>;

// ============================================================================
// ERROR SCHEMAS
// ============================================================================

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.any()).optional(),
    correlationId: z.string(),
    timestamp: z.string().datetime(),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// ============================================================================
// OPENAPI SPECIFICATION
// ============================================================================

export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "NomosX Analysis API",
    version: "1.0.0",
    description: "Evidence-first agentic research platform",
  },
  servers: [
    {
      url: "https://api.nomosx.ai/v1",
      description: "Production",
    },
    {
      url: "http://localhost:3000/api/v1",
      description: "Development",
    },
  ],
  paths: {
    "/analysis": {
      post: {
        summary: "Create new analysis run",
        operationId: "createAnalysisRun",
        tags: ["Analysis"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateAnalysisRunRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Analysis run created",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateAnalysisRunResponse",
                },
              },
            },
          },
          "400": {
            description: "Invalid request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded",
          },
        },
      },
    },
    "/analysis/{runId}": {
      get: {
        summary: "Get analysis run details",
        operationId: "getAnalysisRun",
        tags: ["Analysis"],
        parameters: [
          {
            name: "runId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        responses: {
          "200": {
            description: "Analysis run details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GetAnalysisRunResponse",
                },
              },
            },
          },
          "404": {
            description: "Run not found",
          },
        },
      },
    },
    "/analysis/{runId}/feedback": {
      post: {
        summary: "Submit feedback for analysis run",
        operationId: "submitFeedback",
        tags: ["Feedback"],
        parameters: [
          {
            name: "runId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/SubmitFeedbackRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Feedback submitted",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      CreateAnalysisRunRequest: CreateAnalysisRunRequestSchema,
      CreateAnalysisRunResponse: CreateAnalysisRunResponseSchema,
      GetAnalysisRunResponse: GetAnalysisRunResponseSchema,
      SubmitFeedbackRequest: SubmitFeedbackRequestSchema,
      AnalysisRunDTO: AnalysisRunDTOSchema,
      ClaimDTO: ClaimDTOSchema,
      ErrorResponse: ErrorResponseSchema,
    },
  },
};
