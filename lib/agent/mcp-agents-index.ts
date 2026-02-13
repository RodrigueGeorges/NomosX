// MCP Agents Index — Single entry point for all NomosX agents
// Uses the unified pipeline (pipeline-v2) as sole backend.

import {
  scout,
  index,
  rank,
  read,
  analyst,
  citationGuard,
  renderBriefHTML,
  runFullPipeline,
  runStrategicPipeline,
  runPipeline,
  runIntelligenceSweep,
  invalidateScoutCache,
  getCacheStatus,
  indexAgent,
  readerAgent,
  analystAgent,
  strategicAnalystAgent,
  enhanceQuery,
  rerankSources,
  // V3 Intelligence Agents — Phase 1
  analystMultiPass,
  readerAgentV3,
  runCriticalLoopV2,
  verifyCitations,
  extractCitations,
  embedText,
  embedBatch,
  embedSource,
  embedSourcesBatch,
  semanticSearch,
  filterByRelevanceHybrid,
  backfillEmbeddings,
  getEmbeddingStats,
  storeSourceChunks,
  // V3 Intelligence Agents — Phase 2
  debateAgent,
  metaAnalysisEngine,
  extractAndStoreConcepts,
  queryKnowledgeGraph,
  getLongitudinalInsights,
  // V4 Autonomous Agents
  primeContext,
  createPipelineState,
  assessAfterScout,
  assessAfterReader,
  assessAfterAnalyst,
  assessAfterCriticalLoop,
  generateExpandedTerms,
  planEditorialAgenda,
  // V5 Harvard Council
  runExpertAnalysis,
  runExpertCouncil,
  detectRelevantExperts,
  runHarvardCouncil,
  runReviewBoard,
  gradeEvidence,
  synthesizeCouncil,
  // V6 Autonomous Publication Engine
  autoPublisher,
  runAutoPublisher,
  runStrategicAutoPublisher,
  dryRunAutoPublisher,
  signalDetector,
  trendAnalyzer,
  contradictionDetector,
  generatePublication,
  selectSmartProviders,
  detectDomain,
  // Provider Registry Bridge
  searchExtendedProviders,
  searchExtendedProvider,
  getExtendedProvidersForDomain,
  getTotalProviderCount,
  EXTENDED_PROVIDER_CATALOG,
  DOMAIN_EXTENDED_PROVIDERS,
  // Google Knowledge Graph
  searchKnowledgeGraph,
  enrichWithKnowledgeGraph,
  batchEnrichEntities,
  validateInstitution,
  validatePerson,
} from './mcp-agents-aliases';

export const mcpAgents = {
  // Core pipeline agents
  scout,
  index,
  rank,
  read,
  analyst,
  citationGuard,
  renderBriefHTML,

  // Dedicated agent modules
  indexAgent,
  readerAgent,
  analystAgent,
  strategicAnalystAgent,

  // V3 Intelligence Agents
  analystMultiPass,
  readerAgentV3,
  runCriticalLoopV2,
  verifyCitations,
  extractCitations,

  // Semantic Engine
  embedText,
  embedBatch,
  embedSource,
  embedSourcesBatch,
  semanticSearch,
  filterByRelevanceHybrid,
  backfillEmbeddings,
  getEmbeddingStats,
  storeSourceChunks,

  // V3 Phase 2: Debate, Meta-Analysis, Knowledge Graph
  debateAgent,
  metaAnalysisEngine,
  extractAndStoreConcepts,
  queryKnowledgeGraph,
  getLongitudinalInsights,

  // V4 Autonomous Agents
  primeContext,
  createPipelineState,
  assessAfterScout,
  assessAfterReader,
  assessAfterAnalyst,
  assessAfterCriticalLoop,
  generateExpandedTerms,
  planEditorialAgenda,

  // V5 Harvard Council — PhD Expert System
  runExpertAnalysis,
  runExpertCouncil,
  detectRelevantExperts,
  runHarvardCouncil,
  runReviewBoard,
  gradeEvidence,
  synthesizeCouncil,

  // V6 Autonomous Publication Engine
  autoPublisher,
  runAutoPublisher,
  runStrategicAutoPublisher,
  dryRunAutoPublisher,
  signalDetector,
  trendAnalyzer,
  contradictionDetector,
  generatePublication,
  selectSmartProviders,
  detectDomain,

  // Provider Registry Bridge
  searchExtendedProviders,
  searchExtendedProvider,
  getExtendedProvidersForDomain,
  getTotalProviderCount,
  EXTENDED_PROVIDER_CATALOG,
  DOMAIN_EXTENDED_PROVIDERS,

  // Google Knowledge Graph (entity enrichment + validation)
  searchKnowledgeGraph,
  enrichWithKnowledgeGraph,
  batchEnrichEntities,
  validateInstitution,
  validatePerson,

  // Pipeline orchestration
  runFullPipeline,
  runStrategicPipeline,
  runPipeline,
  runIntelligenceSweep,

  // Cache management
  invalidateScoutCache,
  getCacheStatus,

  // Utility
  enhanceQuery,
  rerankSources,
};

export type {
  Providers, RankOptions, ReportFormat, StrategicPipelineOptions, DataLineage,
  MultiPassAnalysis, ReadingResultV3, QuantitativeData,
  VerificationReport, CitationVerification, HybridRelevanceScore,
  DebateResult, DebatePosition, DebateArgument,
  MetaAnalysisResult, ForestPlotEntry, HeterogeneityStats,
  Concept, ConceptType, ConceptRelation, LongitudinalInsight,
  PrimedContext, PipelineState, OrchestratorDecision, OrchestratorAction,
  EditorialProposal, EditorialAgenda, EditorialReason,
  ExpertAnalysis, DomainExpertise,
  SynthesisReport, ReviewVerdict, EvidenceGrade,
  AutoPublisherConfig, AutoPublisherOutput, PublicationResult, AutoPublisherLineage,
  SignalDetectorOutput, PublicationGeneratorOutput, SmartProviderSelection,
  KGEntity, KGSearchResult, KGEntityEnrichment,
} from './mcp-agents-aliases';
export default mcpAgents;
