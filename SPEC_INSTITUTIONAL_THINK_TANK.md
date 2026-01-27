# NomosX Institutional Think Tank — Full Specification

**Version**: 1.0  
**Date**: 2026-01-27  
**Status**: SPEC ONLY — No implementation code

---

## 0) ONE-PARAGRAPH VISION

NomosX pivots from a research assistant to an **autonomous institutional think tank** that publishes rarely but with authority. Unlike chatbots that respond on-demand, NomosX operates on a **proactive signal-driven cadence**: it continuously monitors academic and institutional sources across defined verticals (EU Policy, Climate Industry, AI Labor), detects meaningful signals (new evidence, contradictions, trend breaks), and only publishes when evidence thresholds are met. **Silence is a feature**—if no signal meets the bar, nothing is published. Every claim in every publication is traceable to source evidence with methodology scores. The system enforces strict publication rhythm rules per vertical, runs an adversarial critical-thinking loop before any output, and produces institutional-grade publications (Research Briefs, Policy Notes, Data Notes, Dossiers) that decision-makers can trust. This is not a content farm; it is an evidence-governed intelligence operation.

---

## 1) SYSTEM OVERVIEW (END-TO-END LOOP)

### 1.1 The Institutional Loop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NomosX Institutional Loop                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  INGEST  │───▶│  SIGNAL  │───▶│ EDITORIAL    │───▶│ PUBLICATION      │  │
│  │          │    │  ENGINE  │    │ GATE         │    │ PIPELINE         │  │
│  └──────────┘    └──────────┘    └──────────────┘    └──────────────────┘  │
│       │                                                       │             │
│       │              ┌─────────────────────────────┐          │             │
│       │              │    CRITICAL LOOP            │          │             │
│       │              │  ┌─────────────────────┐    │          │             │
│       │              │  │ METHODOLOGY_JUDGE   │    │          │             │
│       │              │  │ ADVERSARIAL_REVIEWER│    │          │             │
│       │              │  │ DECISION_CALIBRATOR │    │          │             │
│       │              │  └─────────────────────┘    │          │             │
│       │              └─────────────────────────────┘          │             │
│       │                                                       ▼             │
│       │         ┌──────────────┐    ┌──────────────┐    ┌──────────┐       │
│       │         │   FEEDBACK   │◀───│  DISTRIBUTE  │◀───│ PUBLISH  │       │
│       │         │   LOOP       │    │              │    │          │       │
│       │         └──────────────┘    └──────────────┘    └──────────┘       │
│       │                │                                                    │
│       └────────────────┴────────────────────────────────────────────────────┘
│                        (Continuous improvement)                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Entry Points

| Entry Point | Trigger | Description |
|-------------|---------|-------------|
| **Scheduled Ingest** | Cron (daily 02:00 UTC) | Automatic multi-provider ingestion |
| **Scheduled Signal Build** | Cron (daily 03:00 UTC) | Process new sources into signals |
| **Scheduled Editorial Precheck** | Cron (daily 06:00 UTC) | Evaluate signals for publication |
| **Publish Window** | Cron (10:00, 16:00 UTC) | Execute approved publications |
| **Weekly Bulletin** | Cron (Monday 10:00 UTC) | Generate and send digests |
| **Manual Signal Trigger** | Admin API | Force signal evaluation |
| **Manual Publish** | Admin API | Force publication (bypasses cadence) |

### 1.3 System States

| State | Description | Transitions |
|-------|-------------|-------------|
| `NEW` | Signal detected, not yet evaluated | → HELD, PUBLISHED, REJECTED |
| `HELD` | Awaiting more evidence or cooldown | → PUBLISHED, REJECTED, EXPIRED |
| `PUBLISHED` | Publication complete and distributed | Terminal |
| `REJECTED` | Did not meet thresholds | Terminal |
| `EXPIRED` | Held too long, no longer relevant | Terminal |

### 1.4 Stored Artifacts

| Entity | Purpose | Key Fields |
|--------|---------|------------|
| `Vertical` | Domain classification | slug, name, config |
| `Signal` | Detected research event | type, noveltyScore, impactScore, confidenceScore |
| `EditorialDecision` | Gate decision trace | decision, reasons[], verticalId |
| `Publication` | Final output | type, html, trustScore, claimCount |
| `PublicationRun` | Orchestration trace | status, steps[], duration |
| `PublicationClaim` | Claim-level audit | text, claimType, evidenceSpans[] |
| `QualityCheck` | Pre-publish validation | checkType, passed, details |
| `CadenceCounter` | Rate limiting | verticalId, windowStart, count |

### 1.5 Success Criteria (Measurable)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Publication frequency | ≤3/day global, ≤5/week per vertical | CadenceCounter |
| Trust score | ≥75/100 for all publications | Publication.trustScore |
| Citation coverage | 100% FACT claims have [SRC-*] | QualityCheck |
| Silence ratio | ≥40% of days with 0 publications | Daily metrics |
| Feedback rating | ≥4.0/5.0 average | RunFeedback |
| False positive rate | <5% rejected after publish | Manual audit |

---

## 2) PUBLICATION RHYTHM (CADENCE)

### 2.1 Global Rules

```json
{
  "global_cadence": {
    "max_publications_per_day": 3,
    "max_publications_per_week": 12,
    "quiet_hours_utc": { "start": "22:00", "end": "06:00" },
    "publish_windows_utc": ["10:00", "16:00"],
    "silence_policy": {
      "enabled": true,
      "description": "Allow 0 publications for unlimited days if thresholds not met"
    },
    "emergency_override": {
      "enabled": true,
      "requires_admin_approval": true,
      "max_burst": 5
    }
  }
}
```

### 2.2 Vertical Rules

```json
{
  "verticals": {
    "EU_POLICY": {
      "slug": "eu-policy",
      "name": "EU Policy & Regulation",
      "max_publications_per_week": 5,
      "allowed_types": ["RESEARCH_BRIEF", "POLICY_NOTE", "UPDATE_NOTE", "DOSSIER"],
      "thresholds": {
        "min_trust_score": 75,
        "min_novelty_score": 60,
        "min_impact_score": 50,
        "min_sources": 5
      },
      "cooldown_hours": 24,
      "update_burst": {
        "trigger": "MACRO_SHOCK",
        "max_extra_per_day": 2,
        "duration_hours": 48
      }
    },
    "CLIMATE_INDUSTRY": {
      "slug": "climate-industry",
      "name": "Climate & Industrial Transition",
      "max_publications_per_week": 4,
      "allowed_types": ["RESEARCH_BRIEF", "DATA_NOTE", "UPDATE_NOTE"],
      "thresholds": {
        "min_trust_score": 80,
        "min_novelty_score": 65,
        "min_impact_score": 55,
        "min_sources": 6
      },
      "cooldown_hours": 36,
      "update_burst": {
        "trigger": "DATA_RELEASE",
        "max_extra_per_day": 1,
        "duration_hours": 24
      }
    },
    "AI_LABOR": {
      "slug": "ai-labor",
      "name": "AI & Labor Markets",
      "max_publications_per_week": 4,
      "allowed_types": ["RESEARCH_BRIEF", "POLICY_NOTE", "DATA_NOTE"],
      "thresholds": {
        "min_trust_score": 75,
        "min_novelty_score": 70,
        "min_impact_score": 60,
        "min_sources": 5
      },
      "cooldown_hours": 30,
      "update_burst": {
        "trigger": "MAJOR_STUDY",
        "max_extra_per_day": 1,
        "duration_hours": 24
      }
    }
  }
}
```

### 2.3 Output Scheduling

| Output | Schedule | Description |
|--------|----------|-------------|
| **Publications** | 10:00, 16:00 UTC (if approved) | Main publication windows |
| **Weekly Bulletin** | Monday 10:00 UTC | Digest per subscribed vertical |
| **Monthly State of Domain** | 1st of month 10:00 UTC | V1.5 — Out of scope for code |

### 2.4 Cadence Implementation

**Enforcement Points:**

1. **Editorial Gate (Hard Block)**: Before any publication is approved, check:
   - `CadenceCounter` for vertical and global limits
   - Cooldown window since last publication in vertical
   - Quiet hours check

2. **DB Counters**: `CadenceCounter` table with rolling windows:
   ```sql
   -- Check daily limit
   SELECT COUNT(*) FROM "Publication" 
   WHERE "verticalId" = $1 
   AND "publishedAt" >= NOW() - INTERVAL '24 hours';
   ```

3. **Queue Throttling**: BullMQ rate limiter on `publish_finalize` queue:
   ```javascript
   {
     limiter: {
       max: 3,        // max 3 jobs
       duration: 86400000  // per 24 hours
     }
   }
   ```

---

## 3) PUBLICATION TYPES & TEMPLATES

### 3.1 Types Overview

| Type | Pages | Use Case | Frequency |
|------|-------|----------|-----------|
| `RESEARCH_BRIEF` | 1 | Single finding synthesis | High |
| `UPDATE_NOTE` | 1-2 | New evidence on existing topic | Medium |
| `DATA_NOTE` | 2-3 | Statistical/data-driven analysis | Medium |
| `POLICY_NOTE` | 2-4 | Policy implications analysis | Low |
| `DOSSIER` | 5-15 | Comprehensive topic review | Rare (V1.5) |

### 3.2 Template Specifications

#### 3.2.1 RESEARCH_BRIEF

```json
{
  "type": "RESEARCH_BRIEF",
  "max_words": 800,
  "sections": [
    {
      "heading": "Key Finding",
      "required": true,
      "max_words": 100,
      "claim_types_allowed": ["FACT", "INTERPRETATION"],
      "min_citations": 2
    },
    {
      "heading": "Evidence Base",
      "required": true,
      "max_words": 200,
      "claim_types_allowed": ["FACT"],
      "min_citations": 3
    },
    {
      "heading": "Methodology Assessment",
      "required": true,
      "max_words": 150,
      "claim_types_allowed": ["FACT", "INTERPRETATION"],
      "min_citations": 1
    },
    {
      "heading": "Implications",
      "required": true,
      "max_words": 150,
      "claim_types_allowed": ["INTERPRETATION", "SCENARIO"],
      "min_citations": 1
    },
    {
      "heading": "Limitations & Uncertainty",
      "required": true,
      "max_words": 100,
      "claim_types_allowed": ["FACT", "INTERPRETATION"],
      "min_citations": 0
    },
    {
      "heading": "What Would Change Our Mind",
      "required": true,
      "max_words": 100,
      "claim_types_allowed": ["SCENARIO"],
      "min_citations": 0
    }
  ],
  "bibliography": {
    "format": "APA",
    "min_sources": 5,
    "max_sources": 12
  },
  "forbidden_patterns": [
    "clearly shows",
    "proves that",
    "undeniably",
    "without doubt",
    "everyone agrees",
    "it is certain"
  ]
}
```

#### 3.2.2 UPDATE_NOTE

```json
{
  "type": "UPDATE_NOTE",
  "max_words": 1200,
  "sections": [
    {
      "heading": "What Changed",
      "required": true,
      "max_words": 150,
      "claim_types_allowed": ["FACT"],
      "min_citations": 2
    },
    {
      "heading": "Previous Understanding",
      "required": true,
      "max_words": 200,
      "claim_types_allowed": ["FACT"],
      "min_citations": 2
    },
    {
      "heading": "New Evidence",
      "required": true,
      "max_words": 300,
      "claim_types_allowed": ["FACT"],
      "min_citations": 3
    },
    {
      "heading": "Revised Assessment",
      "required": true,
      "max_words": 250,
      "claim_types_allowed": ["INTERPRETATION", "SCENARIO"],
      "min_citations": 2
    },
    {
      "heading": "Limitations & Uncertainty",
      "required": true,
      "max_words": 150,
      "claim_types_allowed": ["FACT", "INTERPRETATION"],
      "min_citations": 0
    },
    {
      "heading": "What Would Change Our Mind",
      "required": true,
      "max_words": 100,
      "claim_types_allowed": ["SCENARIO"],
      "min_citations": 0
    }
  ],
  "bibliography": {
    "format": "APA",
    "min_sources": 6,
    "max_sources": 15
  },
  "forbidden_patterns": [
    "clearly shows",
    "proves that",
    "undeniably",
    "without doubt"
  ]
}
```

#### 3.2.3 DATA_NOTE

```json
{
  "type": "DATA_NOTE",
  "max_words": 2000,
  "sections": [
    {
      "heading": "Data Summary",
      "required": true,
      "max_words": 200,
      "claim_types_allowed": ["FACT"],
      "min_citations": 2
    },
    {
      "heading": "Methodology",
      "required": true,
      "max_words": 300,
      "claim_types_allowed": ["FACT"],
      "min_citations": 2
    },
    {
      "heading": "Key Findings",
      "required": true,
      "max_words": 400,
      "claim_types_allowed": ["FACT"],
      "min_citations": 4
    },
    {
      "heading": "Statistical Significance",
      "required": true,
      "max_words": 200,
      "claim_types_allowed": ["FACT"],
      "min_citations": 2
    },
    {
      "heading": "Interpretation",
      "required": true,
      "max_words": 300,
      "claim_types_allowed": ["INTERPRETATION"],
      "min_citations": 2
    },
    {
      "heading": "Limitations & Uncertainty",
      "required": true,
      "max_words": 200,
      "claim_types_allowed": ["FACT", "INTERPRETATION"],
      "min_citations": 1
    },
    {
      "heading": "What Would Change Our Mind",
      "required": true,
      "max_words": 100,
      "claim_types_allowed": ["SCENARIO"],
      "min_citations": 0
    }
  ],
  "bibliography": {
    "format": "APA",
    "min_sources": 8,
    "max_sources": 20
  },
  "forbidden_patterns": [
    "clearly shows",
    "proves that",
    "undeniably"
  ]
}
```

#### 3.2.4 POLICY_NOTE

```json
{
  "type": "POLICY_NOTE",
  "max_words": 3000,
  "sections": [
    {
      "heading": "Executive Summary",
      "required": true,
      "max_words": 200,
      "claim_types_allowed": ["FACT", "INTERPRETATION"],
      "min_citations": 2
    },
    {
      "heading": "Policy Context",
      "required": true,
      "max_words": 300,
      "claim_types_allowed": ["FACT"],
      "min_citations": 3
    },
    {
      "heading": "Evidence Review",
      "required": true,
      "max_words": 600,
      "claim_types_allowed": ["FACT"],
      "min_citations": 5
    },
    {
      "heading": "Stakeholder Perspectives",
      "required": true,
      "max_words": 400,
      "claim_types_allowed": ["FACT", "INTERPRETATION"],
      "min_citations": 3
    },
    {
      "heading": "Policy Options",
      "required": true,
      "max_words": 500,
      "claim_types_allowed": ["INTERPRETATION", "SCENARIO"],
      "min_citations": 3
    },
    {
      "heading": "Recommendations",
      "required": true,
      "max_words": 300,
      "claim_types_allowed": ["INTERPRETATION", "SCENARIO"],
      "min_citations": 2
    },
    {
      "heading": "Limitations & Uncertainty",
      "required": true,
      "max_words": 200,
      "claim_types_allowed": ["FACT", "INTERPRETATION"],
      "min_citations": 1
    },
    {
      "heading": "What Would Change Our Mind",
      "required": true,
      "max_words": 150,
      "claim_types_allowed": ["SCENARIO"],
      "min_citations": 0
    }
  ],
  "bibliography": {
    "format": "APA",
    "min_sources": 10,
    "max_sources": 25
  },
  "forbidden_patterns": [
    "clearly shows",
    "proves that",
    "undeniably",
    "must immediately",
    "only option"
  ]
}
```

#### 3.2.5 DOSSIER (V1.5 — Structure Only)

```json
{
  "type": "DOSSIER",
  "max_words": 10000,
  "sections": [
    { "heading": "Executive Summary", "required": true },
    { "heading": "Introduction & Scope", "required": true },
    { "heading": "Methodology", "required": true },
    { "heading": "Literature Review", "required": true },
    { "heading": "Evidence Analysis", "required": true },
    { "heading": "Debate: Arguments For", "required": true },
    { "heading": "Debate: Arguments Against", "required": true },
    { "heading": "Synthesis", "required": true },
    { "heading": "Policy Implications", "required": false },
    { "heading": "Future Research Directions", "required": true },
    { "heading": "Limitations & Uncertainty", "required": true },
    { "heading": "What Would Change Our Mind", "required": true },
    { "heading": "Appendix: Data Tables", "required": false }
  ],
  "bibliography": {
    "format": "APA",
    "min_sources": 25,
    "max_sources": 100
  },
  "note": "V1.5 — Full generation out of scope, structure exists for manual completion"
}
```

### 3.3 Output Formats

| Format | Use Case | Implementation |
|--------|----------|----------------|
| **HTML** | In-app display | Existing `renderBriefHTML()` extended |
| **PDF** | Export/download | Existing PDF export |
| **Share Page** | Public link | Existing `/s/[publicId]` route |
| **Email HTML** | Weekly Bulletin | Simplified HTML, inline styles |

### 3.4 Citation Format

- **In-text**: `[SRC-###]` where ### is 1-indexed source number
- **Clickable**: Each `[SRC-N]` links to bibliography entry
- **Bibliography**: APA format with DOI/URL

Example:
```
Carbon taxes reduce emissions by 10-15% [SRC-1][SRC-3], though effects vary by sector [SRC-2].

---
Sources:
[SRC-1] Smith, J. (2024). Carbon Tax Effectiveness. Journal of Climate Policy. https://doi.org/...
[SRC-2] Chen, L. et al. (2023). Sectoral Impacts of Carbon Pricing. Nature Climate Change.
[SRC-3] EU Commission (2024). Carbon Border Adjustment Mechanism: First Year Review.
```

---

## 4) SIGNAL ENGINE

### 4.1 Signal Types

| Signal Type | Description | Trigger Conditions |
|-------------|-------------|-------------------|
| `NEW_EVIDENCE` | Fresh research on tracked topic | noveltyScore ≥ 70, qualityScore ≥ 75 |
| `CONTRADICTION` | Conflicting findings detected | ClaimContradiction.severity ≥ 0.7 |
| `TREND_BREAK` | Significant shift in consensus | ≥3 sources in 7 days with opposing claims |
| `DATA_RELEASE` | New official data published | Provider in [imf, worldbank, oecd, eurostat] |
| `POLICY_CHANGE` | Regulatory/policy update | Provider in [eeas, un, nato], type = "directive" |
| `METHODOLOGY_SHIFT` | New research approach emerging | ≥2 sources with novel methods in 14 days |

### 4.2 Signal Detection Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Signal Detection Pipeline                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │ New Sources  │───▶│ Classifier   │───▶│ Signal       │                  │
│  │ (from SCOUT) │    │ (vertical +  │    │ Detector     │                  │
│  │              │    │  topic)      │    │              │                  │
│  └──────────────┘    └──────────────┘    └──────────────┘                  │
│                                                 │                           │
│                                                 ▼                           │
│                      ┌──────────────────────────────────────┐              │
│                      │         Signal Scoring               │              │
│                      │  ┌─────────────────────────────────┐ │              │
│                      │  │ noveltyScore  (0-100)          │ │              │
│                      │  │ impactScore   (0-100)          │ │              │
│                      │  │ confidenceScore (0-100)        │ │              │
│                      │  │ urgencyScore  (0-100)          │ │              │
│                      │  └─────────────────────────────────┘ │              │
│                      └──────────────────────────────────────┘              │
│                                                 │                           │
│                                                 ▼                           │
│                      ┌──────────────────────────────────────┐              │
│                      │         Signal Storage               │              │
│                      │  status: NEW | HELD | PUBLISHED |    │              │
│                      │          REJECTED | EXPIRED          │              │
│                      └──────────────────────────────────────┘              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Signal Scoring Formulas

```typescript
interface SignalScores {
  noveltyScore: number;    // How new/unique is this signal?
  impactScore: number;     // How significant for decision-makers?
  confidenceScore: number; // How reliable is the underlying evidence?
  urgencyScore: number;    // How time-sensitive?
}

// Composite score for editorial prioritization
function computeSignalPriority(scores: SignalScores): number {
  return (
    scores.noveltyScore * 0.25 +
    scores.impactScore * 0.30 +
    scores.confidenceScore * 0.30 +
    scores.urgencyScore * 0.15
  );
}

// Novelty Score (0-100)
function computeNoveltyScore(signal: Signal): number {
  const sourceNovelty = avgNoveltyScore(signal.sources);
  const topicNovelty = isNewTopic(signal) ? 20 : 0;
  const contradictionBonus = signal.hasContradiction ? 15 : 0;
  return clamp(sourceNovelty + topicNovelty + contradictionBonus, 0, 100);
}

// Impact Score (0-100)
function computeImpactScore(signal: Signal): number {
  const citationWeight = avgCitationScore(signal.sources) * 0.3;
  const institutionalWeight = hasInstitutionalSource(signal) ? 25 : 0;
  const policyRelevance = matchesPolicyKeywords(signal) ? 20 : 0;
  const dataWeight = hasQuantitativeData(signal) ? 15 : 0;
  return clamp(citationWeight + institutionalWeight + policyRelevance + dataWeight, 0, 100);
}

// Confidence Score (0-100)
function computeConfidenceScore(signal: Signal): number {
  const sourceQuality = avgQualityScore(signal.sources);
  const sourceCount = Math.min(signal.sources.length * 5, 25);
  const methodologyScore = avgMethodologyScore(signal.sources);
  const replicationBonus = hasReplication(signal) ? 15 : 0;
  return clamp(sourceQuality * 0.4 + sourceCount + methodologyScore * 0.2 + replicationBonus, 0, 100);
}

// Urgency Score (0-100)
function computeUrgencyScore(signal: Signal): number {
  const recencyScore = computeRecencyScore(signal.sources);
  const policyDeadline = hasUpcomingDeadline(signal) ? 30 : 0;
  const trendAcceleration = detectTrendAcceleration(signal) ? 20 : 0;
  return clamp(recencyScore * 0.5 + policyDeadline + trendAcceleration, 0, 100);
}
```

### 4.4 Signal Thresholds

| Threshold | Value | Description |
|-----------|-------|-------------|
| `MIN_PRIORITY_FOR_CONSIDERATION` | 50 | Below this, signal is auto-rejected |
| `MIN_PRIORITY_FOR_PUBLICATION` | 65 | Required to pass editorial gate |
| `HIGH_PRIORITY_THRESHOLD` | 80 | Fast-track to next publish window |
| `EMERGENCY_THRESHOLD` | 90 | Bypass cadence limits (admin approval) |

### 4.5 Signal Lifecycle

```
NEW ──┬──▶ HELD (awaiting more evidence or cooldown)
      │         │
      │         ├──▶ PUBLISHED (met thresholds, passed gate)
      │         │
      │         ├──▶ REJECTED (thresholds not met after review)
      │         │
      │         └──▶ EXPIRED (held > 14 days, no longer relevant)
      │
      ├──▶ PUBLISHED (immediate high-priority)
      │
      └──▶ REJECTED (below MIN_PRIORITY_FOR_CONSIDERATION)
```

---

## 5) EDITORIAL GATE

### 5.1 Gate Checks (Ordered)

| Order | Check | Type | Failure Action |
|-------|-------|------|----------------|
| 1 | `CADENCE_CHECK` | Hard | HOLD until window opens |
| 2 | `THRESHOLD_CHECK` | Hard | REJECT if below minimums |
| 3 | `QUALITY_CHECK` | Hard | REJECT if quality < 75 |
| 4 | `CITATION_CHECK` | Hard | REJECT if citation coverage < 100% for FACT claims |
| 5 | `FORBIDDEN_PATTERN_CHECK` | Hard | REJECT if forbidden phrases detected |
| 6 | `METHODOLOGY_REVIEW` | Soft | FLAG for human review if score < 60 |
| 7 | `ADVERSARIAL_REVIEW` | Soft | FLAG if counter-arguments weak |
| 8 | `DECISION_CALIBRATION` | Soft | FLAG if confidence intervals too wide |

### 5.2 Gate Decision Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Editorial Gate Decision Flow                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Signal ──▶ CADENCE_CHECK ──┬──▶ FAIL ──▶ HOLD (queue for next window)     │
│                             │                                               │
│                             └──▶ PASS ──▶ THRESHOLD_CHECK ──┬──▶ FAIL ──▶ REJECT
│                                                             │               │
│                                                             └──▶ PASS      │
│                                                                   │         │
│                                                                   ▼         │
│                                          QUALITY_CHECK ──┬──▶ FAIL ──▶ REJECT
│                                                          │                  │
│                                                          └──▶ PASS         │
│                                                                │            │
│                                                                ▼            │
│                                          CITATION_CHECK ──┬──▶ FAIL ──▶ REJECT
│                                                           │                 │
│                                                           └──▶ PASS        │
│                                                                 │           │
│                                                                 ▼           │
│                                     FORBIDDEN_PATTERN_CHECK ──┬──▶ FAIL ──▶ REJECT
│                                                               │             │
│                                                               └──▶ PASS    │
│                                                                    │        │
│                                                                    ▼        │
│                              ┌─────────────────────────────────────────┐   │
│                              │         CRITICAL LOOP                   │   │
│                              │  ┌─────────────────────────────────┐    │   │
│                              │  │ METHODOLOGY_REVIEW              │    │   │
│                              │  │ ADVERSARIAL_REVIEW              │    │   │
│                              │  │ DECISION_CALIBRATION            │    │   │
│                              │  └─────────────────────────────────┘    │   │
│                              │                                         │   │
│                              │  Any FLAG? ──┬──▶ YES ──▶ HOLD (human) │   │
│                              │              │                          │   │
│                              │              └──▶ NO ──▶ APPROVE        │   │
│                              └─────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Editorial Decision Record

```typescript
interface EditorialDecision {
  id: string;
  signalId: string;
  verticalId: string;
  decision: "APPROVE" | "HOLD" | "REJECT";
  reasons: string[];
  checks: {
    cadence: { passed: boolean; details: string };
    threshold: { passed: boolean; details: string };
    quality: { passed: boolean; score: number };
    citation: { passed: boolean; coverage: number };
    forbiddenPatterns: { passed: boolean; matches: string[] };
    methodology: { passed: boolean; score: number; flagged: boolean };
    adversarial: { passed: boolean; score: number; flagged: boolean };
    calibration: { passed: boolean; score: number; flagged: boolean };
  };
  humanReviewRequired: boolean;
  humanReviewedBy?: string;
  humanReviewedAt?: Date;
  createdAt: Date;
}
```

---

## 6) CRITICAL LOOP (ADVERSARIAL AGENTS)

### 6.1 Overview

The Critical Loop runs **before** any publication is approved. It consists of three adversarial agents that challenge the analysis:

1. **METHODOLOGY_JUDGE**: Evaluates research methodology quality
2. **ADVERSARIAL_REVIEWER**: Generates counter-arguments and challenges
3. **DECISION_CALIBRATOR**: Assesses confidence intervals and uncertainty

### 6.2 METHODOLOGY_JUDGE Agent

**Purpose**: Score methodology quality of underlying sources

**Input**:
- Sources with extracted methods from READER agent
- Publication draft

**Output**:
```typescript
interface MethodologyJudgment {
  overallScore: number; // 0-100
  breakdown: {
    studyDesign: number;      // RCT > observational > theoretical
    sampleSize: number;       // Adequacy assessment
    statisticalRigor: number; // Methods appropriateness
    replicability: number;    // Can it be reproduced?
    biasRisk: number;         // Conflicts, funding, selection bias
  };
  concerns: string[];
  recommendations: string[];
  passThreshold: boolean; // score >= 60
}
```

**Scoring Rubric**:
| Study Design | Score |
|--------------|-------|
| Meta-analysis of RCTs | 95-100 |
| Randomized Controlled Trial | 85-95 |
| Quasi-experimental | 70-85 |
| Observational (large N) | 60-70 |
| Observational (small N) | 40-60 |
| Case study | 30-40 |
| Theoretical/Opinion | 20-30 |

### 6.3 ADVERSARIAL_REVIEWER Agent

**Purpose**: Generate strongest possible counter-arguments

**Input**:
- Publication draft with all claims
- Source evidence

**Output**:
```typescript
interface AdversarialReview {
  overallScore: number; // 0-100 (how well does publication handle counter-arguments)
  counterArguments: Array<{
    targetClaim: string;
    counterArgument: string;
    strength: "strong" | "moderate" | "weak";
    sourceSupport: string[]; // [SRC-N] if counter has evidence
  }>;
  blindSpots: string[]; // Perspectives not considered
  steelManVersion: string; // Strongest version of opposing view
  recommendations: string[];
  passThreshold: boolean; // score >= 55
}
```

**Prompt Structure**:
```
You are an adversarial reviewer. Your job is to find the STRONGEST possible 
counter-arguments to this analysis. Do not be charitable. Be rigorous.

For each major claim, provide:
1. The strongest counter-argument
2. Evidence that supports the counter-argument (if any)
3. Blind spots in the analysis
4. The "steel man" version of the opposing view

Rate how well the current draft handles these challenges (0-100).
```

### 6.4 DECISION_CALIBRATOR Agent

**Purpose**: Assess confidence intervals and uncertainty quantification

**Input**:
- Publication draft
- All claims with confidence scores

**Output**:
```typescript
interface CalibrationAssessment {
  overallScore: number; // 0-100
  claimAssessments: Array<{
    claim: string;
    statedConfidence: number;
    calibratedConfidence: number;
    gap: number; // Overconfidence if positive
    reasoning: string;
  }>;
  uncertaintyQuantification: {
    adequate: boolean;
    missing: string[];
    recommendations: string[];
  };
  hedgingQuality: {
    score: number;
    overHedged: string[];
    underHedged: string[];
  };
  passThreshold: boolean; // score >= 50
}
```

**Calibration Rules**:
- Single source claim: max 60% confidence
- 2-3 sources agreeing: max 75% confidence
- 4+ sources agreeing: max 85% confidence
- Meta-analysis: max 90% confidence
- Never 100% confidence for empirical claims

### 6.5 Critical Loop Integration

```typescript
async function runCriticalLoop(
  draft: PublicationDraft,
  sources: Source[],
  readings: ReadingResult[]
): Promise<CriticalLoopResult> {
  
  // Run all three agents in parallel
  const [methodology, adversarial, calibration] = await Promise.all([
    methodologyJudge(draft, sources, readings),
    adversarialReviewer(draft, sources),
    decisionCalibrator(draft)
  ]);
  
  // Compute composite score
  const compositeScore = (
    methodology.overallScore * 0.35 +
    adversarial.overallScore * 0.35 +
    calibration.overallScore * 0.30
  );
  
  // Determine if human review needed
  const needsHumanReview = 
    !methodology.passThreshold ||
    !adversarial.passThreshold ||
    !calibration.passThreshold ||
    compositeScore < 60;
  
  return {
    compositeScore,
    methodology,
    adversarial,
    calibration,
    needsHumanReview,
    recommendations: [
      ...methodology.recommendations,
      ...adversarial.recommendations,
      ...calibration.uncertaintyQuantification.recommendations
    ]
  };
}
```

---

## 7) CLAIM-LEVEL AUDIT

### 7.1 Claim Types

| Type | Description | Citation Required | Example |
|------|-------------|-------------------|---------|
| `FACT` | Empirical statement | **YES** (mandatory) | "Carbon taxes reduce emissions by 10-15% [SRC-1]" |
| `INTERPRETATION` | Analysis of facts | YES (recommended) | "This suggests policy effectiveness [SRC-2]" |
| `SCENARIO` | Hypothetical/future | NO | "If trends continue, we might see..." |
| `OPINION` | Editorial judgment | NO | "We believe this warrants attention" |

### 7.2 Claim Extraction

Every publication undergoes claim extraction:

```typescript
interface PublicationClaim {
  id: string;
  publicationId: string;
  text: string;
  claimType: "FACT" | "INTERPRETATION" | "SCENARIO" | "OPINION";
  section: string;
  confidence: number; // 0-1
  citations: string[]; // [SRC-1, SRC-3]
  evidenceSpans: EvidenceSpan[];
  methodologyScore?: number;
  hasContradiction: boolean;
  contradictedBy?: string[];
}
```

### 7.3 Evidence Binding

Each FACT claim must be bound to source evidence:

```typescript
interface EvidenceSpan {
  id: string;
  claimId: string;
  sourceId: string;
  text: string; // Exact quote or paraphrase
  startPos: number;
  endPos: number;
  relevanceScore: number; // 0-1
  strengthScore: number; // 0-1
  evidenceType: "direct_quote" | "paraphrase" | "statistical" | "methodological";
}
```

### 7.4 Citation Coverage Validation

```typescript
function validateCitationCoverage(publication: Publication): ValidationResult {
  const claims = extractClaims(publication);
  const factClaims = claims.filter(c => c.claimType === "FACT");
  
  const uncitedFacts = factClaims.filter(c => c.citations.length === 0);
  const coverage = (factClaims.length - uncitedFacts.length) / factClaims.length;
  
  return {
    passed: coverage === 1.0, // 100% required
    coverage,
    uncitedClaims: uncitedFacts.map(c => c.text),
    totalFactClaims: factClaims.length,
    citedFactClaims: factClaims.length - uncitedFacts.length
  };
}
```

### 7.5 Contradiction Detection

```typescript
interface ContradictionCheck {
  claim1Id: string;
  claim2Id: string;
  contradictionType: "logical" | "factual" | "temporal" | "methodological";
  severity: number; // 0-1
  explanation: string;
  resolution?: string;
}

async function detectContradictions(claims: PublicationClaim[]): Promise<ContradictionCheck[]> {
  // Use LLM to detect contradictions between claims
  // Flag for human review if severity > 0.7
}
```

---

## 8) DATA MODEL EXTENSIONS

### 8.1 New Prisma Models

```prisma
// ============================================================================
// VERTICALS & CONFIGURATION
// ============================================================================

model Vertical {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String?  @db.Text
  
  // Configuration (JSON)
  config      Json     // VerticalConfig type
  
  // Status
  isActive    Boolean  @default(true)
  
  // Relations
  signals            Signal[]
  publications       Publication[]
  editorialDecisions EditorialDecision[]
  cadenceCounters    CadenceCounter[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([isActive])
}

// ============================================================================
// SIGNALS
// ============================================================================

model Signal {
  id          String   @id @default(cuid())
  
  // Classification
  verticalId  String
  signalType  String   // NEW_EVIDENCE, CONTRADICTION, TREND_BREAK, etc.
  
  // Content
  title       String
  summary     String   @db.Text
  
  // Scores
  noveltyScore    Int
  impactScore     Int
  confidenceScore Int
  urgencyScore    Int
  priorityScore   Int  // Composite
  
  // Status
  status      String   @default("NEW") // NEW, HELD, PUBLISHED, REJECTED, EXPIRED
  
  // Sources
  sourceIds   String[]
  
  // Metadata
  detectedAt  DateTime @default(now())
  expiresAt   DateTime?
  
  // Relations
  vertical           Vertical           @relation(fields: [verticalId], references: [id])
  editorialDecisions EditorialDecision[]
  publications       Publication[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([verticalId])
  @@index([status])
  @@index([signalType])
  @@index([priorityScore])
  @@index([detectedAt])
}

// ============================================================================
// EDITORIAL DECISIONS
// ============================================================================

model EditorialDecision {
  id          String   @id @default(cuid())
  
  // Links
  signalId    String
  verticalId  String
  
  // Decision
  decision    String   // APPROVE, HOLD, REJECT
  reasons     String[]
  
  // Check Results (JSON)
  checks      Json     // EditorialChecks type
  
  // Human Review
  humanReviewRequired Boolean  @default(false)
  humanReviewedBy     String?
  humanReviewedAt     DateTime?
  humanNotes          String?  @db.Text
  
  // Relations
  signal   Signal   @relation(fields: [signalId], references: [id], onDelete: Cascade)
  vertical Vertical @relation(fields: [verticalId], references: [id])
  
  createdAt DateTime @default(now())
  
  @@index([signalId])
  @@index([verticalId])
  @@index([decision])
  @@index([humanReviewRequired])
}

// ============================================================================
// PUBLICATIONS (ENHANCED)
// ============================================================================

model Publication {
  id          String   @id @default(cuid())
  
  // Classification
  verticalId  String
  signalId    String?
  type        String   // RESEARCH_BRIEF, UPDATE_NOTE, DATA_NOTE, POLICY_NOTE, DOSSIER
  
  // Content
  title       String
  html        String   @db.Text
  wordCount   Int
  
  // Quality Metrics
  trustScore      Int
  qualityScore    Int
  citationCoverage Float  // 0-1
  
  // Claim Stats
  claimCount      Int    @default(0)
  factClaimCount  Int    @default(0)
  citedClaimCount Int    @default(0)
  
  // Critical Loop Results (JSON)
  criticalLoopResult Json?
  
  // Sources
  sourceIds   String[]
  
  // Publishing
  publicId    String?  @unique
  publishedAt DateTime?
  
  // Distribution
  distributedAt DateTime?
  viewCount     Int      @default(0)
  
  // Relations
  vertical Vertical  @relation(fields: [verticalId], references: [id])
  signal   Signal?   @relation(fields: [signalId], references: [id])
  claims   PublicationClaim[]
  runs     PublicationRun[]
  checks   QualityCheck[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([verticalId])
  @@index([type])
  @@index([trustScore])
  @@index([publishedAt])
  @@index([publicId])
}

// ============================================================================
// PUBLICATION CLAIMS
// ============================================================================

model PublicationClaim {
  id            String   @id @default(cuid())
  publicationId String
  
  // Content
  text          String   @db.Text
  claimType     String   // FACT, INTERPRETATION, SCENARIO, OPINION
  section       String
  
  // Quality
  confidence    Float    // 0-1
  citations     String[] // [SRC-1, SRC-3]
  
  // Methodology
  methodologyScore Int?
  
  // Contradictions
  hasContradiction Boolean  @default(false)
  contradictedBy   String[]
  
  // Relations
  publication   Publication    @relation(fields: [publicationId], references: [id], onDelete: Cascade)
  evidenceSpans PublicationEvidenceSpan[]
  
  createdAt DateTime @default(now())
  
  @@index([publicationId])
  @@index([claimType])
  @@index([hasContradiction])
}

// ============================================================================
// PUBLICATION EVIDENCE SPANS
// ============================================================================

model PublicationEvidenceSpan {
  id       String @id @default(cuid())
  claimId  String
  sourceId String
  
  // Span
  text     String @db.Text
  startPos Int
  endPos   Int
  
  // Quality
  relevanceScore Float
  strengthScore  Float
  evidenceType   String // direct_quote, paraphrase, statistical, methodological
  
  // Relations
  claim PublicationClaim @relation(fields: [claimId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@index([claimId])
  @@index([sourceId])
}

// ============================================================================
// PUBLICATION RUNS (ORCHESTRATION)
// ============================================================================

model PublicationRun {
  id            String   @id @default(cuid())
  publicationId String
  
  // Orchestration
  correlationId String   @unique
  status        String   @default("PENDING") // PENDING, RUNNING, COMPLETED, FAILED
  
  // Steps (JSON array)
  steps         Json     // PublicationStep[]
  
  // Timing
  startedAt     DateTime?
  finishedAt    DateTime?
  duration      Int?     // milliseconds
  
  // Cost
  tokensUsed    Int      @default(0)
  costUsd       Float    @default(0)
  
  // Error
  lastError     String?  @db.Text
  retryCount    Int      @default(0)
  
  // Relations
  publication Publication @relation(fields: [publicationId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([publicationId])
  @@index([correlationId])
  @@index([status])
}

// ============================================================================
// QUALITY CHECKS
// ============================================================================

model QualityCheck {
  id            String   @id @default(cuid())
  publicationId String
  
  // Check
  checkType     String   // CADENCE, THRESHOLD, QUALITY, CITATION, FORBIDDEN_PATTERN, METHODOLOGY, ADVERSARIAL, CALIBRATION
  passed        Boolean
  score         Float?
  
  // Details (JSON)
  details       Json
  
  // Relations
  publication Publication @relation(fields: [publicationId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@index([publicationId])
  @@index([checkType])
  @@index([passed])
}

// ============================================================================
// CADENCE COUNTERS
// ============================================================================

model CadenceCounter {
  id          String   @id @default(cuid())
  verticalId  String?  // null = global counter
  
  // Window
  windowType  String   // DAILY, WEEKLY
  windowStart DateTime
  windowEnd   DateTime
  
  // Count
  count       Int      @default(0)
  maxAllowed  Int
  
  // Relations
  vertical Vertical? @relation(fields: [verticalId], references: [id])
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([verticalId, windowType, windowStart])
  @@index([verticalId])
  @@index([windowStart, windowEnd])
}
```

### 8.2 TypeScript Types

```typescript
// Vertical Configuration
interface VerticalConfig {
  maxPublicationsPerWeek: number;
  allowedTypes: PublicationType[];
  thresholds: {
    minTrustScore: number;
    minNoveltyScore: number;
    minImpactScore: number;
    minSources: number;
  };
  cooldownHours: number;
  updateBurst?: {
    trigger: string;
    maxExtraPerDay: number;
    durationHours: number;
  };
}

// Publication Types
type PublicationType = 
  | "RESEARCH_BRIEF" 
  | "UPDATE_NOTE" 
  | "DATA_NOTE" 
  | "POLICY_NOTE" 
  | "DOSSIER";

// Signal Types
type SignalType = 
  | "NEW_EVIDENCE"
  | "CONTRADICTION"
  | "TREND_BREAK"
  | "DATA_RELEASE"
  | "POLICY_CHANGE"
  | "METHODOLOGY_SHIFT";

// Claim Types
type ClaimType = "FACT" | "INTERPRETATION" | "SCENARIO" | "OPINION";

// Editorial Checks
interface EditorialChecks {
  cadence: { passed: boolean; details: string };
  threshold: { passed: boolean; details: string };
  quality: { passed: boolean; score: number };
  citation: { passed: boolean; coverage: number };
  forbiddenPatterns: { passed: boolean; matches: string[] };
  methodology: { passed: boolean; score: number; flagged: boolean };
  adversarial: { passed: boolean; score: number; flagged: boolean };
  calibration: { passed: boolean; score: number; flagged: boolean };
}

// Publication Step
interface PublicationStep {
  name: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  startedAt?: Date;
  finishedAt?: Date;
  duration?: number;
  tokensUsed?: number;
  costUsd?: number;
  error?: string;
  output?: any;
}
```

---

## 9) AGENT CATALOG (NEW AGENTS)

### 9.1 Agent Overview

| Agent | Purpose | Input | Output |
|-------|---------|-------|--------|
| `SIGNAL_DETECTOR` | Detect signals from new sources | Sources[] | Signal[] |
| `SIGNAL_SCORER` | Score signals for prioritization | Signal | SignalScores |
| `EDITORIAL_GATE` | Evaluate signal for publication | Signal, Vertical | EditorialDecision |
| `METHODOLOGY_JUDGE` | Score methodology quality | Sources[], Draft | MethodologyJudgment |
| `ADVERSARIAL_REVIEWER` | Generate counter-arguments | Draft, Sources[] | AdversarialReview |
| `DECISION_CALIBRATOR` | Assess confidence calibration | Draft | CalibrationAssessment |
| `PUBLICATION_GENERATOR` | Generate publication content | Signal, Sources[], Template | Publication |
| `CLAIM_EXTRACTOR` | Extract and classify claims | Publication | PublicationClaim[] |
| `EVIDENCE_BINDER` | Bind claims to source evidence | Claims[], Sources[] | EvidenceSpan[] |
| `CADENCE_ENFORCER` | Check and enforce rate limits | Vertical, Timestamp | CadenceResult |

### 9.2 SIGNAL_DETECTOR Agent

**File**: `lib/agent/signal-detector.ts`

**Purpose**: Detect meaningful signals from newly ingested sources

**Input**:
```typescript
interface SignalDetectorInput {
  sources: Source[];
  verticals: Vertical[];
  existingSignals: Signal[]; // To avoid duplicates
}
```

**Process**:
1. Classify sources by vertical
2. For each vertical:
   a. Check for NEW_EVIDENCE (novelty ≥ 70, quality ≥ 75)
   b. Check for CONTRADICTION (compare with existing claims)
   c. Check for TREND_BREAK (compare with recent signals)
   d. Check for DATA_RELEASE (institutional providers)
   e. Check for POLICY_CHANGE (policy providers)
3. Deduplicate signals
4. Store new signals with status NEW

**Output**:
```typescript
interface SignalDetectorOutput {
  detected: number;
  byType: Record<SignalType, number>;
  signals: Signal[];
}
```

**Determinism**: ⚠️ Semi-deterministic (depends on source content)

### 9.3 PUBLICATION_GENERATOR Agent

**File**: `lib/agent/publication-generator.ts`

**Purpose**: Generate publication content from signal and sources

**Input**:
```typescript
interface PublicationGeneratorInput {
  signal: Signal;
  sources: Source[];
  readings: ReadingResult[];
  template: PublicationTemplate;
  vertical: Vertical;
}
```

**Process**:
1. Build structured context from sources + readings
2. Select appropriate template based on signal type
3. Generate each section according to template constraints:
   - Enforce word limits
   - Enforce claim type restrictions
   - Enforce citation requirements
4. Validate against forbidden patterns
5. Extract and classify claims
6. Bind evidence to claims
7. Compute quality metrics

**Output**:
```typescript
interface PublicationGeneratorOutput {
  publication: Publication;
  claims: PublicationClaim[];
  evidenceSpans: PublicationEvidenceSpan[];
  metrics: {
    wordCount: number;
    claimCount: number;
    citationCoverage: number;
    qualityScore: number;
  };
}
```

**Determinism**: ⚠️ Semi-deterministic (LLM variance, temp=0.2)

### 9.4 CADENCE_ENFORCER Agent

**File**: `lib/agent/cadence-enforcer.ts`

**Purpose**: Check and enforce publication rate limits

**Input**:
```typescript
interface CadenceEnforcerInput {
  verticalId: string;
  timestamp: Date;
  isEmergency?: boolean;
}
```

**Process**:
1. Check global daily limit (max 3)
2. Check global weekly limit (max 12)
3. Check vertical weekly limit
4. Check cooldown since last publication in vertical
5. Check quiet hours
6. If emergency, check admin approval

**Output**:
```typescript
interface CadenceResult {
  allowed: boolean;
  reason?: string;
  nextWindowAt?: Date;
  counters: {
    globalDaily: { current: number; max: number };
    globalWeekly: { current: number; max: number };
    verticalWeekly: { current: number; max: number };
  };
  cooldownRemaining?: number; // hours
}
```

**Determinism**: ✅ Fully deterministic

---

## 10) JOB QUEUE EXTENSIONS

### 10.1 New Job Types

| Job Type | Priority | Description |
|----------|----------|-------------|
| `SIGNAL_DETECT` | 9 | Detect signals from new sources |
| `SIGNAL_SCORE` | 8 | Score detected signals |
| `EDITORIAL_EVALUATE` | 7 | Run editorial gate checks |
| `CRITICAL_LOOP` | 6 | Run adversarial review |
| `PUBLICATION_GENERATE` | 5 | Generate publication content |
| `PUBLICATION_VALIDATE` | 4 | Validate publication quality |
| `PUBLICATION_FINALIZE` | 3 | Finalize and store publication |
| `PUBLICATION_DISTRIBUTE` | 2 | Distribute to subscribers |

### 10.2 Job Flow

```
SCOUT (existing)
    │
    ▼
INDEX (existing)
    │
    ▼
SIGNAL_DETECT ──▶ For each new source batch
    │
    ▼
SIGNAL_SCORE ──▶ For each detected signal
    │
    ▼
EDITORIAL_EVALUATE ──▶ At scheduled times (06:00 UTC)
    │
    ├──▶ REJECT ──▶ Update signal status
    │
    ├──▶ HOLD ──▶ Queue for later evaluation
    │
    └──▶ APPROVE
           │
           ▼
    CRITICAL_LOOP ──▶ Run adversarial agents
           │
           ├──▶ FLAG ──▶ HOLD for human review
           │
           └──▶ PASS
                  │
                  ▼
           PUBLICATION_GENERATE
                  │
                  ▼
           PUBLICATION_VALIDATE
                  │
                  ├──▶ FAIL ──▶ Retry or reject
                  │
                  └──▶ PASS
                         │
                         ▼
                  PUBLICATION_FINALIZE ──▶ At publish windows (10:00, 16:00 UTC)
                         │
                         ▼
                  PUBLICATION_DISTRIBUTE
```

### 10.3 Rate Limiting

```typescript
// BullMQ rate limiter configuration
const publishQueue = new Queue("publish", {
  limiter: {
    max: 3,           // max 3 publications
    duration: 86400000 // per 24 hours (ms)
  }
});

// Vertical-specific rate limiting
async function checkVerticalLimit(verticalId: string): Promise<boolean> {
  const counter = await prisma.cadenceCounter.findFirst({
    where: {
      verticalId,
      windowType: "WEEKLY",
      windowEnd: { gte: new Date() }
    }
  });
  
  if (!counter) return true; // No counter = allowed
  
  const config = await getVerticalConfig(verticalId);
  return counter.count < config.maxPublicationsPerWeek;
}
```

---

## 11) API ENDPOINTS

### 11.1 New Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/verticals` | List all verticals |
| `GET` | `/api/verticals/:slug` | Get vertical details |
| `GET` | `/api/signals` | List signals (with filters) |
| `GET` | `/api/signals/:id` | Get signal details |
| `POST` | `/api/signals/:id/evaluate` | Trigger editorial evaluation |
| `GET` | `/api/publications` | List publications (with filters) |
| `GET` | `/api/publications/:id` | Get publication details |
| `GET` | `/api/publications/:id/claims` | Get publication claims |
| `GET` | `/api/publications/:id/audit` | Get full audit trail |
| `POST` | `/api/admin/publish` | Force publish (admin only) |
| `POST` | `/api/admin/cadence/reset` | Reset cadence counters (admin only) |
| `GET` | `/api/metrics/cadence` | Get current cadence status |
| `GET` | `/api/metrics/quality` | Get quality metrics |

### 11.2 Endpoint Specifications

#### GET /api/signals

```typescript
// Query parameters
interface SignalsQuery {
  verticalId?: string;
  status?: SignalStatus;
  signalType?: SignalType;
  minPriority?: number;
  since?: Date;
  limit?: number;
  offset?: number;
}

// Response
interface SignalsResponse {
  signals: Signal[];
  total: number;
  hasMore: boolean;
}
```

#### GET /api/publications/:id/audit

```typescript
// Response
interface PublicationAuditResponse {
  publication: Publication;
  signal: Signal;
  editorialDecision: EditorialDecision;
  criticalLoopResult: CriticalLoopResult;
  claims: PublicationClaim[];
  evidenceSpans: PublicationEvidenceSpan[];
  qualityChecks: QualityCheck[];
  run: PublicationRun;
  sources: Source[];
}
```

---

## 12) SCHEDULED FUNCTIONS

### 12.1 Function Schedule

| Function | Schedule | Description |
|----------|----------|-------------|
| `daily-ingest` | 02:00 UTC | Ingest from all providers |
| `signal-build` | 03:00 UTC | Detect signals from new sources |
| `editorial-precheck` | 06:00 UTC | Evaluate pending signals |
| `publish-window-1` | 10:00 UTC | Execute approved publications |
| `publish-window-2` | 16:00 UTC | Execute approved publications |
| `weekly-bulletin` | Monday 10:00 UTC | Generate and send digests |
| `cadence-reset` | 00:00 UTC | Reset daily counters |
| `signal-expire` | 04:00 UTC | Expire old held signals |

### 12.2 Netlify Configuration

```toml
# netlify.toml additions

[[functions]]
  name = "signal-build"
  schedule = "0 3 * * *"  # Every day at 3 AM UTC

[[functions]]
  name = "editorial-precheck"
  schedule = "0 6 * * *"  # Every day at 6 AM UTC

[[functions]]
  name = "publish-window-1"
  schedule = "0 10 * * *"  # Every day at 10 AM UTC

[[functions]]
  name = "publish-window-2"
  schedule = "0 16 * * *"  # Every day at 4 PM UTC

[[functions]]
  name = "cadence-reset"
  schedule = "0 0 * * *"  # Every day at midnight UTC

[[functions]]
  name = "signal-expire"
  schedule = "0 4 * * *"  # Every day at 4 AM UTC
```

---

## 13) UI COMPONENTS (NEW)

### 13.1 Component Overview

| Component | Purpose | Location |
|-----------|---------|----------|
| `VerticalSelector` | Select vertical for filtering | Dashboard, Library |
| `SignalCard` | Display signal with scores | Signals page |
| `SignalTimeline` | Timeline of signals by vertical | Dashboard |
| `PublicationCard` | Display publication summary | Library, Home |
| `PublicationViewer` | Full publication with claims | Publication page |
| `ClaimAuditPanel` | Show claim with evidence binding | Publication page |
| `CadenceIndicator` | Show current cadence status | Dashboard header |
| `QualityBadge` | Trust/quality score display | Cards, headers |
| `EditorialDecisionLog` | Show gate decision history | Admin panel |
| `CriticalLoopResults` | Display adversarial review | Publication audit |

### 13.2 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Overview with signals, cadence, recent publications |
| Signals | `/signals` | List and filter signals by vertical/status |
| Publications | `/publications` | Browse publications by vertical/type |
| Publication Detail | `/publications/[id]` | Full publication with audit trail |
| Vertical | `/verticals/[slug]` | Vertical-specific view |
| Admin | `/admin` | Cadence controls, manual publish, settings |

### 13.3 Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  NomosX Think Tank                              [Cadence: 1/3 today]        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  VERTICALS                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                          │   │
│  │  │ EU Policy│  │ Climate  │  │ AI Labor │                          │   │
│  │  │ 2/5 week │  │ 1/4 week │  │ 0/4 week │                          │   │
│  │  └──────────┘  └──────────┘  └──────────┘                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────┐   │
│  │  PENDING SIGNALS (3)         │  │  RECENT PUBLICATIONS (5)         │   │
│  │  ┌────────────────────────┐  │  │  ┌────────────────────────────┐  │   │
│  │  │ 🔴 NEW_EVIDENCE        │  │  │  │ Carbon Tax Effectiveness   │  │   │
│  │  │ Priority: 78           │  │  │  │ EU Policy • 2h ago         │  │   │
│  │  │ EU Policy              │  │  │  │ Trust: 82/100              │  │   │
│  │  └────────────────────────┘  │  │  └────────────────────────────┘  │   │
│  │  ┌────────────────────────┐  │  │  ┌────────────────────────────┐  │   │
│  │  │ 🟡 CONTRADICTION       │  │  │  │ AI Job Displacement Update │  │   │
│  │  │ Priority: 72           │  │  │  │ AI Labor • 1d ago          │  │   │
│  │  │ Climate                │  │  │  │ Trust: 79/100              │  │   │
│  │  └────────────────────────┘  │  │  └────────────────────────────┘  │   │
│  └──────────────────────────────┘  └──────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  NEXT PUBLISH WINDOW: 10:00 UTC (in 2h 15m)                         │   │
│  │  Approved: 1 publication queued                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 14) MIGRATION PATH

### 14.1 Phase 1: Data Model (Week 1)

1. Add new Prisma models (Vertical, Signal, EditorialDecision, Publication, etc.)
2. Run migration: `npx prisma migrate dev --name institutional_think_tank`
3. Seed initial verticals (EU_POLICY, CLIMATE_INDUSTRY, AI_LABOR)
4. Backfill existing briefs to Publication model

### 14.2 Phase 2: Signal Engine (Week 2)

1. Implement SIGNAL_DETECTOR agent
2. Implement SIGNAL_SCORER agent
3. Add signal-build scheduled function
4. Test signal detection on existing sources

### 14.3 Phase 3: Editorial Gate (Week 3)

1. Implement CADENCE_ENFORCER agent
2. Implement editorial gate checks (hard checks first)
3. Add editorial-precheck scheduled function
4. Test cadence enforcement

### 14.4 Phase 4: Critical Loop (Week 4)

1. Implement METHODOLOGY_JUDGE agent
2. Implement ADVERSARIAL_REVIEWER agent
3. Implement DECISION_CALIBRATOR agent
4. Integrate critical loop into editorial gate

### 14.5 Phase 5: Publication Pipeline (Week 5)

1. Implement PUBLICATION_GENERATOR agent
2. Implement CLAIM_EXTRACTOR agent
3. Implement EVIDENCE_BINDER agent
4. Add publication templates
5. Add publish-window scheduled functions

### 14.6 Phase 6: UI & Polish (Week 6)

1. Build dashboard with vertical/signal views
2. Build publication viewer with audit trail
3. Build admin panel for cadence control
4. End-to-end testing

### 14.7 Rollback Plan

Each phase is independently reversible:
- Phase 1: Drop new tables, restore Brief model
- Phase 2-4: Disable scheduled functions, revert to existing pipeline
- Phase 5: Revert to existing renderBriefHTML
- Phase 6: Revert UI to existing components

---

## 15) TESTING STRATEGY

### 15.1 Unit Tests

| Component | Test File | Coverage Target |
|-----------|-----------|-----------------|
| Signal scoring | `signal-scorer.test.ts` | 90% |
| Cadence enforcement | `cadence-enforcer.test.ts` | 95% |
| Citation validation | `citation-validator.test.ts` | 95% |
| Forbidden patterns | `forbidden-patterns.test.ts` | 100% |
| Claim extraction | `claim-extractor.test.ts` | 85% |

### 15.2 Integration Tests

| Flow | Test File | Description |
|------|-----------|-------------|
| Signal → Publication | `signal-to-publication.test.ts` | Full pipeline |
| Editorial Gate | `editorial-gate.test.ts` | All gate checks |
| Critical Loop | `critical-loop.test.ts` | Adversarial agents |
| Cadence Limits | `cadence-limits.test.ts` | Rate limiting |

### 15.3 E2E Tests

| Scenario | Test File | Description |
|----------|-----------|-------------|
| Happy path | `e2e/publish-happy-path.spec.ts` | Signal → Publication |
| Cadence block | `e2e/cadence-block.spec.ts` | Verify rate limiting |
| Human review | `e2e/human-review.spec.ts` | Flag → Review → Approve |
| Emergency publish | `e2e/emergency-publish.spec.ts` | Admin override |

### 15.4 Quality Metrics Tests

```typescript
describe("Publication Quality", () => {
  it("should have 100% citation coverage for FACT claims", async () => {
    const publication = await generateTestPublication();
    const coverage = computeCitationCoverage(publication);
    expect(coverage).toBe(1.0);
  });

  it("should have trust score >= 75", async () => {
    const publication = await generateTestPublication();
    expect(publication.trustScore).toBeGreaterThanOrEqual(75);
  });

  it("should not contain forbidden patterns", async () => {
    const publication = await generateTestPublication();
    const matches = detectForbiddenPatterns(publication.html);
    expect(matches).toHaveLength(0);
  });
});
```

---

## 16) OBSERVABILITY

### 16.1 Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `signals_detected_total` | Counter | Total signals detected |
| `signals_by_type` | Counter | Signals by type |
| `signals_by_status` | Gauge | Current signal status distribution |
| `publications_total` | Counter | Total publications |
| `publications_by_vertical` | Counter | Publications per vertical |
| `cadence_utilization` | Gauge | % of cadence limit used |
| `editorial_gate_pass_rate` | Gauge | % signals passing gate |
| `critical_loop_flag_rate` | Gauge | % flagged for human review |
| `trust_score_avg` | Gauge | Average publication trust score |
| `citation_coverage_avg` | Gauge | Average citation coverage |

### 16.2 Alerts

| Alert | Condition | Severity |
|-------|-----------|----------|
| `CadenceExhausted` | Daily limit reached | Warning |
| `LowTrustScore` | Publication trust < 70 | Critical |
| `HighFlagRate` | >50% flagged for review | Warning |
| `SignalBacklog` | >20 signals in NEW status | Warning |
| `PublishWindowMissed` | No publish in 48h | Info |
| `CriticalLoopFailure` | Agent error | Critical |

### 16.3 Dashboards

**Grafana Dashboard: NomosX Think Tank**

Panels:
1. Publications per day (bar chart)
2. Cadence utilization (gauge)
3. Signal pipeline funnel (sankey)
4. Trust score distribution (histogram)
5. Editorial gate pass/fail (pie)
6. Critical loop scores (time series)
7. Vertical activity (heatmap)

---

## 17) SECURITY & ACCESS CONTROL

### 17.1 Roles

| Role | Permissions |
|------|-------------|
| `viewer` | Read publications, signals |
| `analyst` | + Create signals manually |
| `editor` | + Approve/reject signals, human review |
| `admin` | + Force publish, reset cadence, manage verticals |

### 17.2 API Authentication

- All endpoints require JWT authentication
- Admin endpoints require `role: admin`
- Rate limiting: 100 req/min per user

### 17.3 Audit Trail

All actions are logged to `AuditLog`:
- Signal creation/status changes
- Editorial decisions
- Human reviews
- Publications
- Admin overrides

---

## 18) COST ESTIMATION

### 18.1 LLM Costs (per publication)

| Agent | Tokens (avg) | Cost (GPT-4o) |
|-------|--------------|---------------|
| READER | 4,000 | $0.04 |
| ANALYST | 8,000 | $0.08 |
| METHODOLOGY_JUDGE | 3,000 | $0.03 |
| ADVERSARIAL_REVIEWER | 4,000 | $0.04 |
| DECISION_CALIBRATOR | 2,000 | $0.02 |
| PUBLICATION_GENERATOR | 6,000 | $0.06 |
| CLAIM_EXTRACTOR | 2,000 | $0.02 |
| **Total per publication** | ~29,000 | **~$0.29** |

### 18.2 Monthly Projections

| Scenario | Publications/month | LLM Cost | Infra Cost | Total |
|----------|-------------------|----------|------------|-------|
| Conservative | 30 | $8.70 | $50 | ~$60 |
| Normal | 60 | $17.40 | $50 | ~$70 |
| High | 90 | $26.10 | $75 | ~$100 |

---

## 19) OUT OF SCOPE (V1.5+)

The following features are explicitly **out of scope** for V1:

1. **DOSSIER generation** — Template exists, full generation deferred
2. **Monthly State of Domain** — Scheduled for V1.5
3. **Multi-language publications** — English/French only in V1
4. **Custom verticals** — Fixed set in V1
5. **Public API** — Internal only in V1
6. **Email distribution** — Manual share links in V1
7. **Collaborative editing** — Single-author in V1
8. **Version history** — No publication versioning in V1
9. **A/B testing** — No template experiments in V1
10. **External integrations** — No Slack/Teams/Notion in V1

---

## 20) GLOSSARY

| Term | Definition |
|------|------------|
| **Vertical** | Domain/topic area (e.g., EU Policy, Climate) |
| **Signal** | Detected research event warranting attention |
| **Editorial Gate** | Quality/cadence checks before publication |
| **Critical Loop** | Adversarial review process |
| **Cadence** | Publication rate limits |
| **Trust Score** | Composite quality metric (0-100) |
| **Claim** | Individual assertion in publication |
| **Evidence Span** | Source text supporting a claim |
| **Publish Window** | Scheduled time for publications |
| **Cooldown** | Minimum time between publications in vertical |

---

## 21) APPENDIX: EXAMPLE PUBLICATION

### RESEARCH_BRIEF Example

```html
<article class="nomosx-publication research-brief">
  <header>
    <div class="meta">
      <span class="vertical">EU Policy</span>
      <span class="type">Research Brief</span>
      <span class="date">2026-01-27</span>
      <span class="trust-score">Trust: 82/100</span>
    </div>
    <h1>Carbon Border Adjustment Mechanism: First-Year Evidence</h1>
  </header>

  <section class="key-finding">
    <h2>Key Finding</h2>
    <p>
      The EU's Carbon Border Adjustment Mechanism (CBAM) has reduced carbon 
      leakage in covered sectors by an estimated 8-12% in its first year of 
      operation [SRC-1][SRC-3], though implementation challenges persist in 
      developing country exporters [SRC-2].
    </p>
  </section>

  <section class="evidence-base">
    <h2>Evidence Base</h2>
    <p>
      Analysis draws on 8 peer-reviewed studies and 3 institutional reports. 
      The European Commission's monitoring data [SRC-1] shows a 9.2% reduction 
      in embedded carbon in covered imports. Independent verification by 
      Öko-Institut [SRC-3] estimates 8-12% reduction using alternative 
      methodology. World Bank analysis [SRC-2] documents compliance costs 
      averaging 2.3% of export value for developing country producers.
    </p>
  </section>

  <section class="methodology-assessment">
    <h2>Methodology Assessment</h2>
    <p>
      Evidence quality is moderate-to-high. Commission data [SRC-1] uses 
      comprehensive customs declarations but may undercount indirect emissions. 
      Academic studies [SRC-3][SRC-4] employ difference-in-differences designs 
      with appropriate controls. Sample sizes range from 847 to 12,400 firms.
    </p>
  </section>

  <section class="implications">
    <h2>Implications</h2>
    <p>
      For policymakers: CBAM appears effective at reducing carbon leakage but 
      requires enhanced technical assistance for developing country compliance 
      [SRC-2]. For industry: Early compliance investments correlate with 
      competitive advantage in EU market access [SRC-5].
    </p>
  </section>

  <section class="limitations">
    <h2>Limitations & Uncertainty</h2>
    <p>
      First-year data may not reflect long-term equilibrium effects. 
      Counterfactual estimation relies on pre-CBAM trends that may not hold. 
      Developing country impacts may be underestimated due to informal sector 
      exclusion from surveys.
    </p>
  </section>

  <section class="what-changes-mind">
    <h2>What Would Change Our Mind</h2>
    <p>
      Evidence of significant trade diversion to non-EU markets would suggest 
      leakage displacement rather than reduction. Studies showing no effect 
      after controlling for energy price changes would challenge causal claims.
    </p>
  </section>

  <footer class="bibliography">
    <h2>Sources</h2>
    <ol>
      <li>[SRC-1] European Commission (2026). CBAM Implementation Report: Year One. Brussels.</li>
      <li>[SRC-2] World Bank (2025). Carbon Border Adjustments and Developing Countries. Policy Research Working Paper.</li>
      <li>[SRC-3] Öko-Institut (2026). Independent Assessment of CBAM Effectiveness. Berlin.</li>
      <li>[SRC-4] Branger, F. et al. (2025). Carbon Leakage Under Border Adjustment. Journal of Environmental Economics.</li>
      <li>[SRC-5] McKinsey & Company (2026). CBAM Compliance and Competitive Positioning.</li>
    </ol>
  </footer>

  <aside class="audit-info">
    <p>Publication ID: pub_abc123</p>
    <p>Signal ID: sig_xyz789</p>
    <p>Claims: 12 (8 FACT, 3 INTERPRETATION, 1 SCENARIO)</p>
    <p>Citation Coverage: 100%</p>
    <p>Critical Loop Score: 78/100</p>
  </aside>
</article>
```

---

**END OF SPECIFICATION**

*Document Version: 1.0*  
*Last Updated: 2026-01-27*  
*Status: SPEC ONLY — No implementation code*

