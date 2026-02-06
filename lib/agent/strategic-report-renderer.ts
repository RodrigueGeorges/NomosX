/**
 * Strategic Report HTML Renderer
 * Renders comprehensive 10-15 page Strategic Reports with:
 * - Professional styling
 * - Table of contents
 * - Section numbering
 * - Source references
 * - Charts placeholders
 */

import { StrategicAnalysisOutput } from './strategic-analyst-agent';
import { AgentRole,assertPermission } from '../governance/index';

const esc = (s: string) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatCitations = (text: string) => {
  return esc(text).replace(
    /\[SRC-(\d+)\]/g,
    '<sup class="citation" data-src="$1">[$1]</sup>'
  );
};

const STYLES = `
<style>
  :root {
    --primary: #1e3a5f;
    --secondary: #2c5282;
    --accent: #3182ce;
    --success: #38a169;
    --warning: #d69e2e;
    --danger: #e53e3e;
    --gray-50: #f7fafc;
    --gray-100: #edf2f7;
    --gray-200: #e2e8f0;
    --gray-300: #cbd5e0;
    --gray-600: #718096;
    --gray-700: #4a5568;
    --gray-800: #2d3748;
    --gray-900: #1a202c;
  }
  
  * { box-sizing: border-box; }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.7;
    color: var(--gray-800);
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 24px;
    background: white;
  }
  
  /* Header */
  .report-header {
    border-bottom: 3px solid var(--primary);
    padding-bottom: 24px;
    margin-bottom: 32px;
  }
  
  .report-brand {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--gray-600);
    margin-bottom: 8px;
  }
  
  .report-title {
    font-size: 2.5em;
    font-weight: 700;
    color: var(--primary);
    margin: 0 0 16px 0;
    line-height: 1.2;
  }
  
  .report-meta {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    font-size: 0.9em;
    color: var(--gray-600);
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8em;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .badge-critical { background: #fed7d7; color: #c53030; }
  .badge-high { background: #feebc8; color: #c05621; }
  .badge-medium { background: #fefcbf; color: #975a16; }
  .badge-low { background: #c6f6d5; color: #276749; }
  
  .badge-confidence-high { background: #c6f6d5; color: #276749; }
  .badge-confidence-medium { background: #fefcbf; color: #975a16; }
  .badge-confidence-low { background: #fed7d7; color: #c53030; }
  
  /* Table of Contents */
  .toc {
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    padding: 24px;
    margin: 32px 0;
  }
  
  .toc-title {
    font-size: 1.1em;
    font-weight: 600;
    color: var(--primary);
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--gray-200);
  }
  
  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
    columns: 2;
    column-gap: 32px;
  }
  
  .toc-list li {
    margin-bottom: 8px;
    break-inside: avoid;
  }
  
  .toc-list a {
    color: var(--gray-700);
    text-decoration: none;
    font-size: 0.95em;
  }
  
  .toc-list a:hover {
    color: var(--accent);
  }
  
  .toc-num {
    color: var(--gray-400);
    margin-right: 8px;
    font-weight: 500;
  }
  
  /* Sections */
  .section {
    margin: 48px 0;
    page-break-inside: avoid;
  }
  
  .section-title {
    font-size: 1.5em;
    font-weight: 700;
    color: var(--primary);
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--gray-200);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .section-num {
    background: var(--primary);
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8em;
    flex-shrink: 0;
  }
  
  .subsection-title {
    font-size: 1.15em;
    font-weight: 600;
    color: var(--secondary);
    margin: 24px 0 12px 0;
  }
  
  /* Executive Summary Box */
  .executive-summary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    color: white;
    padding: 32px;
    border-radius: 12px;
    margin: 32px 0;
  }
  
  .executive-summary h2 {
    color: white;
    border-bottom-color: rgba(255,255,255,0.3);
    margin-top: 0;
  }
  
  .executive-summary p {
    font-size: 1.05em;
    line-height: 1.8;
  }
  
  .executive-summary .citation {
    color: rgba(255,255,255,0.8);
  }
  
  /* Key Findings */
  .key-findings {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin: 24px 0;
  }
  
  .finding-card {
    background: var(--gray-50);
    border-left: 4px solid var(--accent);
    padding: 16px;
    border-radius: 0 8px 8px 0;
  }
  
  .finding-card p {
    margin: 0;
    font-size: 0.95em;
  }
  
  /* Content paragraphs */
  .content {
    font-size: 1em;
    line-height: 1.8;
  }
  
  .content p {
    margin: 16px 0;
  }
  
  /* Tables */
  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 0.9em;
  }
  
  .data-table th {
    background: var(--gray-100);
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: var(--gray-700);
    border-bottom: 2px solid var(--gray-300);
  }
  
  .data-table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--gray-200);
    vertical-align: top;
  }
  
  .data-table tr:hover {
    background: var(--gray-50);
  }
  
  /* Impact badges */
  .impact-positive { color: var(--success); font-weight: 600; }
  .impact-negative { color: var(--danger); font-weight: 600; }
  .impact-mixed { color: var(--warning); font-weight: 600; }
  
  .magnitude-high { font-weight: 700; }
  .magnitude-medium { font-weight: 500; }
  .magnitude-low { font-weight: 400; opacity: 0.8; }
  
  /* Debate Section */
  .debate-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin: 24px 0;
  }
  
  @media (max-width: 700px) {
    .debate-grid { grid-template-columns: 1fr; }
  }
  
  .debate-position {
    padding: 24px;
    border-radius: 12px;
  }
  
  .debate-for {
    background: #e6fffa;
    border: 2px solid #38b2ac;
  }
  
  .debate-for h4 { color: #234e52; }
  
  .debate-against {
    background: #fff5f5;
    border: 2px solid #fc8181;
  }
  
  .debate-against h4 { color: #742a2a; }
  
  .debate-synthesis {
    background: var(--gray-50);
    border: 2px solid var(--gray-300);
    padding: 24px;
    border-radius: 12px;
    margin-top: 24px;
  }
  
  /* Scenarios */
  .scenario-card {
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    padding: 24px;
    margin: 16px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  .scenario-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .scenario-name {
    font-weight: 600;
    font-size: 1.1em;
    color: var(--primary);
  }
  
  .probability-high { background: #c6f6d5; color: #276749; }
  .probability-medium { background: #fefcbf; color: #975a16; }
  .probability-low { background: #e2e8f0; color: #4a5568; }
  
  /* Recommendations */
  .recommendations-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 24px 0;
  }
  
  @media (max-width: 700px) {
    .recommendations-grid { grid-template-columns: 1fr; }
  }
  
  .rec-card {
    padding: 20px;
    border-radius: 8px;
  }
  
  .rec-immediate { background: #fff5f5; border-left: 4px solid var(--danger); }
  .rec-short { background: #fefcbf; border-left: 4px solid var(--warning); }
  .rec-long { background: #e6fffa; border-left: 4px solid var(--success); }
  .rec-risk { background: var(--gray-100); border-left: 4px solid var(--gray-600); }
  
  .rec-card h4 {
    margin: 0 0 12px 0;
    font-size: 0.95em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .rec-card ul {
    margin: 0;
    padding-left: 20px;
  }
  
  .rec-card li {
    margin: 8px 0;
    font-size: 0.95em;
  }
  
  /* Citations */
  .citation {
    color: var(--accent);
    font-size: 0.75em;
    cursor: help;
    font-weight: 600;
  }
  
  /* Sources */
  .sources-section {
    background: var(--gray-50);
    padding: 32px;
    border-radius: 12px;
    margin-top: 48px;
  }
  
  .source-item {
    padding: 12px 0;
    border-bottom: 1px solid var(--gray-200);
    display: grid;
    grid-template-columns: 60px 1fr;
    gap: 16px;
    align-items: start;
  }
  
  .source-item:last-child {
    border-bottom: none;
  }
  
  .source-num {
    background: var(--primary);
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.85em;
    text-align: center;
  }
  
  .source-details {
    font-size: 0.9em;
  }
  
  .source-title {
    font-weight: 600;
    color: var(--gray-800);
  }
  
  .source-meta {
    color: var(--gray-600);
    font-size: 0.9em;
    margin-top: 4px;
  }
  
  /* Evidence Quality Meter */
  .quality-meter {
    background: var(--gray-100);
    border-radius: 8px;
    padding: 24px;
    margin: 24px 0;
  }
  
  .quality-score {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .score-value {
    font-size: 3em;
    font-weight: 700;
    color: var(--primary);
  }
  
  .score-label {
    font-size: 0.9em;
    color: var(--gray-600);
  }
  
  .quality-bar {
    height: 12px;
    background: var(--gray-200);
    border-radius: 6px;
    overflow: hidden;
  }
  
  .quality-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--danger) 0%, var(--warning) 50%, var(--success) 100%);
    border-radius: 6px;
    transition: width 0.5s ease;
  }
  
  /* Print styles */
  @media print {
    body { padding: 0; max-width: none; }
    .section { page-break-inside: avoid; }
    .no-print { display: none; }
  }
</style>
`;

export function renderStrategicReportHTML(
  analysis: StrategicAnalysisOutput,
  sources: any[]
): string {
  assertPermission(AgentRole.EDITOR, "write:draft");

  const urgencyClass = `badge-${analysis.urgencyLevel}`;
  const confidenceClass = `badge-confidence-${analysis.confidenceLevel}`;

  const renderKeyFindings = () => {
    if (!analysis.keyFindings?.length) return "";
    return `
      <div class="key-findings">
        ${analysis.keyFindings
          .slice(0, 5)
          .map(
            (f) => `
          <div class="finding-card">
            <p>${formatCitations(f)}</p>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  };

  const renderKeyStudies = () => {
    if (!analysis.keyStudies?.length) return "";
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Contribution</th>
            <th>Limitations</th>
          </tr>
        </thead>
        <tbody>
          ${analysis.keyStudies
            .map(
              (study) => `
            <tr>
              <td><strong>${formatCitations(study.citation)}</strong></td>
              <td>${formatCitations(study.contribution)}</td>
              <td>${formatCitations(study.limitations)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  };

  const renderThemes = () => {
    if (!analysis.themes?.length) return "";
    return analysis.themes
      .map(
        (theme) => `
      <div class="subsection-title">${esc(theme.name)}</div>
      <div class="content">
        <p>${formatCitations(theme.description)}</p>
        <p><strong>Evidence:</strong> ${formatCitations(theme.evidence)}</p>
        <p><em>Sources: ${theme.sources?.join(", ") || "N/A"}</em></p>
      </div>
    `
      )
      .join("");
  };

  const renderDebate = () => {
    if (!analysis.debate) return "";
    const { position1, position2, synthesis, nuances } = analysis.debate;
    return `
      <div class="debate-grid">
        <div class="debate-position debate-for">
          <h4>📗 ${esc(position1.label)}</h4>
          <p>${formatCitations(position1.arguments)}</p>
          <p><strong>Evidence:</strong> ${formatCitations(position1.evidence)}</p>
          <p><em>Proponents: ${formatCitations(position1.proponents)}</em></p>
        </div>
        <div class="debate-position debate-against">
          <h4>📕 ${esc(position2.label)}</h4>
          <p>${formatCitations(position2.arguments)}</p>
          <p><strong>Evidence:</strong> ${formatCitations(position2.evidence)}</p>
          <p><em>Proponents: ${formatCitations(position2.proponents)}</em></p>
        </div>
      </div>
      <div class="debate-synthesis">
        <h4>⚖️ Synthesis</h4>
        <p>${formatCitations(synthesis)}</p>
        ${nuances ? `<p><strong>Nuances:</strong> ${formatCitations(nuances)}</p>` : ""}
      </div>
    `;
  };

  const renderEvidenceQuality = () => {
    if (!analysis.evidenceQuality) return "";
    const eq = analysis.evidenceQuality;
    const scorePercent = (eq.overallScore / 10) * 100;
    return `
      <div class="quality-meter">
        <div class="quality-score">
          <span class="score-value">${eq.overallScore}</span>
          <span class="score-label">/10<br/>Overall Evidence Quality</span>
        </div>
        <div class="quality-bar">
          <div class="quality-fill" style="width: ${scorePercent}%"></div>
        </div>
      </div>
      <div class="content">
        <p><strong>Methodology:</strong> ${formatCitations(eq.methodology)}</p>
        <p><strong>Sample Sizes:</strong> ${formatCitations(eq.sampleSizes)}</p>
        <p><strong>Replication:</strong> ${formatCitations(eq.replication)}</p>
        <p><strong>Potential Biases:</strong> ${formatCitations(eq.biases)}</p>
        <p><strong>Evidence Gaps:</strong> ${formatCitations(eq.gaps)}</p>
      </div>
    `;
  };

  const renderStakeholders = () => {
    if (!analysis.stakeholderAnalysis?.length) return "";
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Stakeholder</th>
            <th>Impact</th>
            <th>Magnitude</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${analysis.stakeholderAnalysis
            .map(
              (s) => `
            <tr>
              <td><strong>${esc(s.stakeholder)}</strong></td>
              <td class="impact-${s.impact}">${s.impact.toUpperCase()}</td>
              <td class="magnitude-${s.magnitude}">${s.magnitude.toUpperCase()}</td>
              <td>${formatCitations(s.details)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  };

  const renderScenarios = () => {
    if (!analysis.scenarios?.length) return "";
    return analysis.scenarios
      .map(
        (s) => `
      <div class="scenario-card">
        <div class="scenario-header">
          <span class="scenario-name">${esc(s.name)}</span>
          <span class="badge probability-${s.probability}">${s.probability.toUpperCase()} PROBABILITY</span>
        </div>
        <p>${formatCitations(s.description)}</p>
        <p><strong>Implications:</strong> ${formatCitations(s.implications)}</p>
        <p><strong>Early Signals:</strong> ${formatCitations(s.signals)}</p>
      </div>
    `
      )
      .join("");
  };

  const renderRecommendations = () => {
    if (!analysis.recommendations) return "";
    const r = analysis.recommendations;
    return `
      <div class="recommendations-grid">
        <div class="rec-card rec-immediate">
          <h4>🚨 Immediate Actions</h4>
          <ul>${(r.immediate || []).map((i) => `<li>${formatCitations(i)}</li>`).join("")}</ul>
        </div>
        <div class="rec-card rec-short">
          <h4>📅 Short-Term (3-12 months)</h4>
          <ul>${(r.shortTerm || []).map((i) => `<li>${formatCitations(i)}</li>`).join("")}</ul>
        </div>
        <div class="rec-card rec-long">
          <h4>🎯 Long-Term (1-5 years)</h4>
          <ul>${(r.longTerm || []).map((i) => `<li>${formatCitations(i)}</li>`).join("")}</ul>
        </div>
        <div class="rec-card rec-risk">
          <h4>🛡️ Risk Mitigation</h4>
          <ul>${(r.riskMitigation || []).map((i) => `<li>${formatCitations(i)}</li>`).join("")}</ul>
        </div>
      </div>
    `;
  };

  const renderImplementation = () => {
    if (!analysis.implementation) return "";
    const impl = analysis.implementation;
    return `
      <div class="content">
        <p><strong>Prerequisites:</strong></p>
        <ul>${(impl.prerequisites || []).map((p) => `<li>${formatCitations(p)}</li>`).join("")}</ul>
        <p><strong>Timeline:</strong> ${formatCitations(impl.timeline)}</p>
        <p><strong>Resources Required:</strong> ${formatCitations(impl.resources)}</p>
        <p><strong>Success Metrics:</strong></p>
        <ul>${(impl.metrics || []).map((m) => `<li>${formatCitations(m)}</li>`).join("")}</ul>
        <p><strong>Anticipated Obstacles:</strong></p>
        <ul>${(impl.obstacles || []).map((o) => `<li>${formatCitations(o)}</li>`).join("")}</ul>
      </div>
    `;
  };

  const renderSources = () => {
    return sources
      .map((s, i) => {
        const authors =
          s.authors
            ?.map((sa: any) => sa.author?.name)
            .filter(Boolean)
            .slice(0, 3)
            .join(", ") || "Unknown";
        return `
        <div class="source-item">
          <span class="source-num">SRC-${i + 1}</span>
          <div class="source-details">
            <div class="source-title">${esc(s.title)}</div>
            <div class="source-meta">
              ${authors} ${s.year ? `(${s.year})` : ""} • ${esc(s.provider)} • 
              Quality: ${s.qualityScore || 0}/100 • Citations: ${s.citationCount || 0}
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  };

  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(analysis.title)} — NomosX Strategic Report</title>
  ${STYLES}
</head>
<body>
  <article>
    <!-- Header -->
    <header class="report-header">
      <div class="report-brand">NomosX Strategic Intelligence Report</div>
      <h1 class="report-title">${esc(analysis.title)}</h1>
      <div class="report-meta">
        <span class="meta-item">📅 ${now}</span>
        <span class="meta-item">📊 ${sources.length} sources analyzed</span>
        <span class="meta-item">
          <span class="badge ${urgencyClass}">${analysis.urgencyLevel} urgency</span>
        </span>
        <span class="meta-item">
          <span class="badge ${confidenceClass}">${analysis.confidenceLevel} confidence</span>
        </span>
      </div>
    </header>

    <!-- Table of Contents -->
    <nav class="toc">
      <h3 class="toc-title">Table of Contents</h3>
      <ol class="toc-list">
        <li><a href="#executive"><span class="toc-num">1</span>Executive Summary</a></li>
        <li><a href="#literature"><span class="toc-num">2</span>Literature Review</a></li>
        <li><a href="#themes"><span class="toc-num">3</span>Thematic Analysis</a></li>
        <li><a href="#debate"><span class="toc-num">4</span>Debate & Perspectives</a></li>
        <li><a href="#evidence"><span class="toc-num">5</span>Evidence Assessment</a></li>
        <li><a href="#stakeholders"><span class="toc-num">6</span>Stakeholder Impact</a></li>
        <li><a href="#scenarios"><span class="toc-num">7</span>Scenario Planning</a></li>
        <li><a href="#recommendations"><span class="toc-num">8</span>Recommendations</a></li>
        <li><a href="#implementation"><span class="toc-num">9</span>Implementation</a></li>
        <li><a href="#conclusion"><span class="toc-num">10</span>Conclusion</a></li>
      </ol>
    </nav>

    <!-- Section 1: Executive Summary -->
    <section id="executive" class="executive-summary">
      <h2 class="section-title"><span class="section-num">1</span> Executive Summary</h2>
      <div class="content">
        <p>${formatCitations(analysis.executiveSummary)}</p>
      </div>
      <h3 class="subsection-title" style="color: white; border-bottom: 1px solid rgba(255,255,255,0.3);">Key Findings</h3>
      ${renderKeyFindings()}
    </section>

    <!-- Section 2: Literature Review -->
    <section id="literature" class="section">
      <h2 class="section-title"><span class="section-num">2</span> Literature Review</h2>
      <div class="content">
        <p>${formatCitations(analysis.literatureOverview)}</p>
      </div>
      
      <h3 class="subsection-title">Theoretical Frameworks</h3>
      <div class="content">
        <p>${formatCitations(analysis.theoreticalFrameworks)}</p>
      </div>
      
      <h3 class="subsection-title">Methodological Approaches</h3>
      <div class="content">
        <p>${formatCitations(analysis.methodologicalApproaches)}</p>
      </div>
      
      <h3 class="subsection-title">Key Studies</h3>
      ${renderKeyStudies()}
    </section>

    <!-- Section 3: Thematic Analysis -->
    <section id="themes" class="section">
      <h2 class="section-title"><span class="section-num">3</span> Thematic Analysis</h2>
      ${renderThemes()}
      
      <h3 class="subsection-title">Consensus</h3>
      <div class="content">
        <p>${formatCitations(analysis.consensus)}</p>
      </div>
      
      <h3 class="subsection-title">Controversies</h3>
      <div class="content">
        <p>${formatCitations(analysis.controversies)}</p>
      </div>
      
      <h3 class="subsection-title">Emerging Trends</h3>
      <div class="content">
        <p>${formatCitations(analysis.emergingTrends)}</p>
      </div>
    </section>

    <!-- Section 4: Debate & Perspectives -->
    <section id="debate" class="section">
      <h2 class="section-title"><span class="section-num">4</span> Debate & Perspectives</h2>
      ${renderDebate()}
    </section>

    <!-- Section 5: Evidence Assessment -->
    <section id="evidence" class="section">
      <h2 class="section-title"><span class="section-num">5</span> Evidence Quality Assessment</h2>
      ${renderEvidenceQuality()}
    </section>

    <!-- Section 6: Stakeholder Impact -->
    <section id="stakeholders" class="section">
      <h2 class="section-title"><span class="section-num">6</span> Stakeholder Impact Analysis</h2>
      ${renderStakeholders()}
    </section>

    <!-- Section 7: Scenario Planning -->
    <section id="scenarios" class="section">
      <h2 class="section-title"><span class="section-num">7</span> Scenario Planning</h2>
      ${renderScenarios()}
    </section>

    <!-- Section 8: Recommendations -->
    <section id="recommendations" class="section">
      <h2 class="section-title"><span class="section-num">8</span> Strategic Recommendations</h2>
      ${renderRecommendations()}
    </section>

    <!-- Section 9: Implementation -->
    <section id="implementation" class="section">
      <h2 class="section-title"><span class="section-num">9</span> Implementation Roadmap</h2>
      ${renderImplementation()}
    </section>

    <!-- Section 10: Conclusion -->
    <section id="conclusion" class="section">
      <h2 class="section-title"><span class="section-num">10</span> Conclusion</h2>
      <div class="content">
        <p>${formatCitations(analysis.conclusion)}</p>
      </div>
      
      <h3 class="subsection-title">Open Questions</h3>
      <ul>
        ${(analysis.openQuestions || []).map((q) => `<li>${formatCitations(q)}</li>`).join("")}
      </ul>
      
      <h3 class="subsection-title">What Would Change Our Mind</h3>
      <div class="content">
        <p>${formatCitations(analysis.whatChangesMind)}</p>
      </div>
    </section>

    <!-- Sources -->
    <section class="sources-section">
      <h2 class="section-title">Sources</h2>
      ${renderSources()}
    </section>

    <!-- Footer -->
    <footer style="margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--gray-200); text-align: center; color: var(--gray-600); font-size: 0.85em;">
      <p>Generated by <strong>NomosX</strong> — The Agentic Think Tank</p>
      <p>This report was produced through automated analysis of ${sources.length} sources. Always verify critical findings with primary sources.</p>
    </footer>
  </article>
</body>
</html>`;
}
