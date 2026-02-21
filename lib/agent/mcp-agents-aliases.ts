// MCP Agents — Single source of truth
// All agents re-exported from the unified pipeline and dedicated agent modules.
// NO re-export from scout-v2 (deprecated, merged into pipeline-v2).

export {
  // Pipeline orchestration
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
  DEFAULT_ACADEMIC_PROVIDERS,
  // Cache management
  invalidateScoutCache,
  getCacheStatus,
  // Types
  type Providers,
  type RankOptions,
  type ReportFormat,
  type StrategicPipelineOptions,
  type DataLineage,
} from './pipeline-v2';

export { indexAgent, deduplicateSources } from './index-agent';
export { readerAgent } from './reader-agent';
export { analystAgent } from './analyst-agent';
export { strategicAnalystAgent, type StrategicAnalysisOutput } from './strategic-analyst-agent';

// V3 Intelligence Agents
export { analystAgentV3 as analystMultiPass, type MultiPassAnalysis } from './analyst-multipass';
export { readerAgentV3, storeSourceChunks, type ReadingResultV3, type QuantitativeData } from './reader-agent-v3';
export { runCriticalLoopV2 } from './critical-loop-v2';
export { verifyCitations, extractCitations, type VerificationReport, type CitationVerification } from './citation-verifier';
export {
  embedText, embedBatch, embedSource, embedSourcesBatch,
  semanticSearch, filterByRelevanceHybrid, backfillEmbeddings, getEmbeddingStats,
  cosineSimilarity, type HybridRelevanceScore,
} from './semantic-engine';

// V3 Intelligence Agents — Phase 2
export { debateAgent, type DebateResult, type DebatePosition, type DebateArgument } from './debate-agent';
export { metaAnalysisEngine, type MetaAnalysisResult, type ForestPlotEntry, type HeterogeneityStats } from './meta-analysis-engine';
export {
  extractAndStoreConcepts, queryKnowledgeGraph, getLongitudinalInsights,
  type Concept, type ConceptType, type ConceptRelation, type LongitudinalInsight,
} from './knowledge-graph';

// V4 Autonomous Agents
export { primeContext, type PrimedContext } from './context-primer';
export {
  createPipelineState, recordDecision,
  assessAfterScout, assessAfterReader, assessAfterAnalyst, assessAfterCriticalLoop,
  generateExpandedTerms,
  type PipelineState, type OrchestratorDecision, type OrchestratorAction,
} from './orchestrator';
export {
  planEditorialAgenda,
  type EditorialProposal, type EditorialAgenda, type EditorialReason,
} from './editorial-planner';

// V6 Autonomous Publication Engine
export {
  autoPublisher, runAutoPublisher, runStrategicAutoPublisher, dryRunAutoPublisher,
  type AutoPublisherConfig, type AutoPublisherOutput, type PublicationResult, type AutoPublisherLineage,
} from './auto-publisher';
export {
  signalDetector,
  type SignalDetectorOutput,
} from './signal-detector';
export {
  trendAnalyzer,
} from './trend-analyzer';
export {
  contradictionDetector,
} from './contradiction-detector';
export {
  generatePublication,
  type PublicationGeneratorOutput,
} from './publication-generator';
export {
  selectSmartProviders, detectDomain,
  type SmartSelection as SmartProviderSelection,
} from './smart-provider-selector';

// Provider Registry Bridge
export {
  searchExtendedProviders, searchExtendedProvider,
  getExtendedProvidersForDomain, getTotalProviderCount,
  EXTENDED_PROVIDER_CATALOG, DOMAIN_EXTENDED_PROVIDERS,
} from '../providers/registry-bridge';

// Google Knowledge Graph (entity enrichment + validation)
export {
  searchKnowledgeGraph, enrichWithKnowledgeGraph, batchEnrichEntities,
  validateInstitution, validatePerson,
  type KGEntity, type KGSearchResult, type KGEntityEnrichment,
} from '../providers/google-knowledge-graph';

// V5 Harvard Council — PhD Expert System
export {
  runExpertAnalysis, runExpertCouncil, detectRelevantExperts,
  determineOptimalExpertCount, calculateComplexityScore,
  type ExpertAnalysis, type DomainExpertise,
} from './phd-researcher';
export {
  runHarvardCouncil, runReviewBoard, gradeEvidence, synthesizeCouncil,
  type SynthesisReport, type ReviewVerdict, type EvidenceGrade,
} from './review-board';

// Utility modules (used internally by pipeline, exposed for advanced usage)
export { enhanceQuery, generateSearchQueries } from './query-enhancer';
export { rerankSources } from './cohere-reranker';
export { filterByRelevance } from './relevance-scorer';

// Cadence & Governance
export { cadenceEnforcer } from './cadence-enforcer';

// Editorial Gate (signal + draft publication readiness)
export { editorialGate, evaluatePendingSignals, submitDraftToGate } from './editorial-gate';

// Radar Agent (high-novelty source cards)
export { generateRadarCards, getMacroContext } from './radar-agent';

// Macro Refresh (Eurostat/ECB/INSEE macro series)
export { refreshMacroSeries, type MacroRefreshResult } from './macro-refresh';

// Strategic Report Renderer (HTML for strategic reports)
export { renderStrategicReportHTML } from './strategic-report-renderer';

// Domain Classifier (auto-classify sources into domains)
export { classifySourceDomains, classifyBatchSources, classifyUnclassifiedSources } from './domain-classifier';

// Researcher Ownership (domain expert editorial owners + pipeline tier selection)
export {
  RESEARCHER_REGISTRY,
  detectOwners,
  getPrimaryOwner,
  selectPipelineTier,
  getResearcherAgenda,
  getThinkTankAgenda,
  requestResearcherSignOff,
  requiresMultipleResearchers,
  getAllRelevantResearchers,
  type ResearcherOwner,
  type AgendaItem,
  type ResearcherSignOff,
  type PipelineTier,
} from './researcher-ownership';