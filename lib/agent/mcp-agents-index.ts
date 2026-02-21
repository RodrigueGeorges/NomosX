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
  generateSearchQueries,
  filterByRelevance,
  cosineSimilarity,
  cadenceEnforcer,
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
  recordDecision,
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
  // Editorial Gate
  editorialGate,
  evaluatePendingSignals,
  submitDraftToGate,
  // Radar + Macro
  generateRadarCards,
  getMacroContext,
  refreshMacroSeries,
  // Strategic Renderer
  renderStrategicReportHTML,
  // Domain Classifier
  classifySourceDomains,
  classifyBatchSources,
  classifyUnclassifiedSources,
  // Researcher Ownership
  RESEARCHER_REGISTRY,
  detectOwners,
  getPrimaryOwner,
  selectPipelineTier,
  getResearcherAgenda,
  getThinkTankAgenda,
  requestResearcherSignOff,
} from './mcp-agents-aliases';

// V7 Autonomous Intelligence — Agent Memory, Researcher Identity, Devil's Advocate
import {
  buildMemoryInjection,
  recordAgentPerformance,
  computeCalibration,
  extractLessons,
  storeLesson,
  autoDetectFailureModes,
} from './agent-memory';
import { loadCalibratedThresholds } from './orchestrator';
import {
  buildResearcherProfile,
  storeResearcherPosition,
  storePrediction,
  storeExpertAnalysisMemory,
  detectPositionEvolution,
} from './researcher-identity';
import {
  runDevilsAdvocate,
} from './devils-advocate';
import { runPredictionAuditor } from './prediction-auditor';
import {
  recordProviderCall,
  isProviderHealthy,
  getHealthyProviders,
  getProviderHealthReport,
  resetProvider,
} from './provider-health-tracker';
import {
  recordSourceUsage,
  updateSourceReputations,
  getTopReputationSources,
  getSourceReputationReport,
} from './source-reputation-agent';

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
  recordDecision,
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
  determineOptimalExpertCount,
  calculateComplexityScore,
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

  // Editorial Gate (signal + draft publication readiness)
  editorialGate,
  evaluatePendingSignals,
  submitDraftToGate,

  // Radar + Macro
  generateRadarCards,
  getMacroContext,
  refreshMacroSeries,

  // Strategic Renderer
  renderStrategicReportHTML,

  // Domain Classifier
  classifySourceDomains,
  classifyBatchSources,
  classifyUnclassifiedSources,

  // Researcher Ownership — domain expert editorial owners + pipeline tier selection
  RESEARCHER_REGISTRY,
  detectOwners,
  getPrimaryOwner,
  selectPipelineTier,
  getResearcherAgenda,
  getThinkTankAgenda,
  requestResearcherSignOff,
  requiresMultipleResearchers,
  getAllRelevantResearchers,

  // V7 Autonomous Intelligence — Self-Learning & Adversarial Gate
  buildMemoryInjection,
  recordAgentPerformance,
  computeCalibration,
  extractLessons,
  storeLesson,
  autoDetectFailureModes,
  loadCalibratedThresholds,
  buildResearcherProfile,
  storeResearcherPosition,
  storePrediction,
  storeExpertAnalysisMemory,
  detectPositionEvolution,
  runDevilsAdvocate,

  // V8 Self-Improving Infrastructure
  runPredictionAuditor,
  recordProviderCall,
  isProviderHealthy,
  getHealthyProviders,
  getProviderHealthReport,
  resetProvider,
  recordSourceUsage,
  updateSourceReputations,
  getTopReputationSources,
  getSourceReputationReport,

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
  generateSearchQueries,
  filterByRelevance,
  cosineSimilarity,
  cadenceEnforcer,
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
  MacroRefreshResult,
  ResearcherOwner, AgendaItem, ResearcherSignOff, PipelineTier,
} from './mcp-agents-aliases';

export type {
  Agents, AgentPerformanceRecord, AgentLesson, AgentCalibration, MemoryInjection, FailureMode,
} from './agent-memory';
export type {
  ResearcherPosition, PredictionRecord, ResearcherProfile, PositionUpdate,
} from './researcher-identity';
export type {
  AdvocateChallenge, AdvocateReport, ChallengeType, InstitutionComparison, ComparisonScore,
} from './devils-advocate';
export default mcpAgents;
