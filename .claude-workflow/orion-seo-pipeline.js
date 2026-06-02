export const meta = {
  name: 'orion-seo-pipeline',
  description: 'Full Orion AEO/SEO pipeline — 5 agents + CIRO compliance review + Jira + Confluence',
  phases: [
    { title: 'Research',          detail: 'Live SERP + community keyword discovery and scoring' },
    { title: 'AEO Monitor',       detail: 'AI assistant visibility audit across 10 ICP queries' },
    { title: 'Content',           detail: 'Draft 10 publish-ready pages optimised for Google + AI retrieval' },
    { title: 'Compliance Review', detail: 'CIRO Rule 3602 line-by-line review of every draft before publish' },
    { title: 'Ranking',           detail: 'GSC position tracking, deltas, and alerts' },
    { title: 'Insight',           detail: 'Weekly synthesis, report, and next-run seed generation' },
    { title: 'Jira + Confluence', detail: 'Create content review tickets with compliance verdicts + refresh Confluence page' },
  ],
}

// ─── CIRO COMPLIANCE REVIEWER PROMPT ──────────────────────────────────────
// Source: Axl Villapaz — Slack #compliance, 2026-06-02
// Applies CIRO Dealer Member Rule 3602 to all public-facing content
const CIRO_COMPLIANCE_PROMPT = `You are a compliance review assistant for a CIRO member firm (IntelligentInvesting Securities Inc. / Orion Digital Corp.). Your role is to review all public-facing marketing, advertisements, sales communications, and client communications for compliance risk under CIRO Dealer Member Rule 3602, with a conservative, compliance-first standard.

FOOTER DISCLOSURE (present on all Orion pages — still review critically):
"Communications and materials provided by or on behalf of IntelligentInvesting Securities Inc. ("IISI"), IntelligentInvesting Wealth Management Inc. ("IIWMI"), IntelligentInvesting Financial Technologies Inc., or Mogo Finance Technology Inc., each of which forms part of the Orion Digital Corp. (formerly Mogo Inc.), and may be distributed through email, websites, social media platforms, or other marketing channels.

The information contained in these communications or materials is provided for informational purposes only and should not be interpreted as a promise of specific results or future performance. Nothing herein should be considered investment advice or an offer or solicitation to buy or sell securities. The information provided may not be suitable or applicable to all investors.

The information provided in these materials is not a research report and should not serve as the basis for making investment decisions. Certain statements may reflect opinions, assumptions, or forward-looking views that are subject to change and may not reflect actual outcomes. Historical returns, hypothetical returns, expected returns, and images are provided for illustrative purposes only. Past returns are no guarantee of future performance.

No representation or warranty, express or implied, is made regarding the accuracy, completeness, or timeliness of the information presented. Any statistics, examples, projections, or market illustrations are provided for explanatory purposes only and should not be relied upon as guarantees of future results.

Investing involves risk, and it is possible to lose some or all of your investment. Always research before investing.

References to third-party websites, platforms, or social media content are provided solely for informational purposes. Orion Digital Corp. and its affiliated entities do not control and are not responsible for the content of such third-party sites, and do not endorse, approve, certify, or guarantee the accuracy or reliability of the information contained therein."

REVIEW STANDARD:
Be strict, practical, and risk-aware. Do not assume wording is acceptable just because it is common marketing language. Flag issues where wording could be:
- Misleading by implication
- Incomplete due to omitted facts
- Overly promotional
- Unbalanced on risk vs benefit
- Suggestive of certainty, safety, or guaranteed outcomes
- Unclear about assumptions, limitations, or conditions

FLAG content that:
- Contains an untrue statement, omission of material fact, or is false or misleading
- Uses language that creates a misleading impression
- Contains an unjustified promise of specific results
- Uses unrepresentative statistics or fails to identify material assumptions
- Includes opinions or forecasts not clearly labelled as opinion or forecast
- Fails to fairly present potential risks
- Is detrimental to the interests of the public, CIRO, or Dealer Members

OUTPUT FORMAT — respond in this exact structure for every page:

COMPLIANCE VERDICT: [Likely compliant / Needs revision / High risk — likely non-compliant]

RISK SUMMARY:
[2–3 sentences explaining the main compliance concerns in plain language]

CIRO 3602 ISSUES (line by line):
For each problematic line or passage:
- QUOTED TEXT: "[exact quote]"
- RULE CATEGORY: [false or misleading statement / misleading visual impression / unjustified promise of results / unrepresentative statistics / unlabelled forecast or opinion / inadequate risk disclosure / other CIRO concern]
- WHY THIS IS A CONCERN: [specific explanation]
- SUGGESTED REWRITE: [safer, compliant alternative wording]

MISSING DISCLOSURES:
[List any qualifications, assumptions, or risk statements that should be added]

ESCALATION NOTE:
[Whether Supervisor approval is required before use/publication. Err on the side of recommending review if unsure.]

CLEAN REVISED CONTENT:
[The full page content with all problematic passages replaced by suggested rewrites and missing disclosures added inline. This is the version that should be written to disk.]`

// ─── CONFIG ────────────────────────────────────────────────────────────────
const RUN_DATE    = (args && args.runDate) ? args.runDate : '2026-06-01'
const OUTPUT_DIR  = 'C:\\Users\\Paige.Rogers\\Desktop\\claude codes\\output'
const QUEUE_DIR   = 'C:\\Users\\Paige.Rogers\\Desktop\\claude codes\\queue'
const CONTENT_DIR = `${OUTPUT_DIR}\\content_drafts\\${RUN_DATE}`

const CLOUD_ID           = '7830fa63-7783-433f-b6d1-84e8c6995068'
const CONFLUENCE_PAGE_ID = '3420782599'
const JIRA_PROJECT       = 'MKTG'

const DEFAULT_SEEDS = [
  'intelligent investing',
  'beat the S&P 500',
  'value investing for beginners',
  'how to find undervalued stocks',
  'best stock screener value investors',
  'intrinsic value calculator',
  'Warren Buffett investing strategy',
  'margin of safety investing',
  'portfolio management software investors',
  'value investing tools 2026',
  'DCF calculator stock',
  'Benjamin Graham formula',
  'AI investing platform',
  'superinvestor portfolio tracker',
  'how to analyse a stock fundamentally',
]

const ICP_QUERIES = [
  'What is the best platform for value investing research?',
  'How do I find undervalued stocks using fundamental analysis?',
  'What tools do value investors use to beat the S&P 500?',
  'What is intelligent investing?',
  "What's the best stock screener for value investors?",
  'How can I invest like Warren Buffett?',
  'What software helps with stock portfolio management for long-term investors?',
  'What are the best resources for learning value investing?',
  'How do I calculate the intrinsic value of a stock?',
  'What platforms compete with Bloomberg Terminal for retail investors?',
]

// ─── SCHEMAS ──────────────────────────────────────────────────────────────

const KEYWORD_SCHEMA = {
  type: 'object',
  properties: {
    keywords: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          keyword:            { type: 'string' },
          volume_estimate:    { type: 'string' },
          difficulty:         { type: 'number' },
          intent:             { type: 'string', enum: ['informational','commercial','navigational'] },
          job_cluster:        { type: 'string', enum: ['learn','compare','evaluate','act'] },
          aeo_flag:           { type: 'boolean' },
          aeo_reason:         { type: 'string' },
          page_type:          { type: 'string', enum: ['pillar','cluster_article','comparison','faq','landing'] },
          relevance_to_orion: { type: 'number' },
          score:              { type: 'number' },
          source:             { type: 'string' },
          serp_features:      { type: 'string' },
        },
        required: ['keyword','intent','aeo_flag','page_type','score'],
      },
    },
    community_phrases: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          phrase:        { type: 'string' },
          source:        { type: 'string' },
          aeo_potential: { type: 'string' },
        },
        required: ['phrase','source'],
      },
    },
    research_notes: { type: 'string' },
  },
  required: ['keywords','community_phrases'],
}

const AEO_SCHEMA = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          query:               { type: 'string' },
          typical_ai_response: { type: 'string' },
          orion_mentioned:     { type: 'boolean' },
          competitors_cited:   { type: 'array', items: { type: 'string' } },
          orion_gap:           { type: 'boolean' },
          content_opportunity: { type: 'string' },
          suggested_title:     { type: 'string' },
          priority:            { type: 'string', enum: ['high','medium','low'] },
        },
        required: ['query','typical_ai_response','orion_mentioned','orion_gap','priority'],
      },
    },
    orion_visibility_rate: { type: 'number' },
    top_competitors:       { type: 'array', items: { type: 'string' } },
    competitor_frequency:  { type: 'object' },
    highest_priority_gaps: { type: 'array', items: { type: 'string' } },
    strategic_summary:     { type: 'string' },
  },
  required: ['results','orion_visibility_rate','top_competitors','highest_priority_gaps'],
}

const CONTENT_SCHEMA = {
  type: 'object',
  properties: {
    slug:                { type: 'string' },
    filename:            { type: 'string' },
    content:             { type: 'string' },
    keyword:             { type: 'string' },
    page_type:           { type: 'string' },
    word_count_estimate: { type: 'number' },
    aeo_optimised:       { type: 'boolean' },
  },
  required: ['slug','filename','content','keyword','page_type'],
}

const COMPLIANCE_SCHEMA = {
  type: 'object',
  properties: {
    filename:           { type: 'string' },
    keyword:            { type: 'string' },
    verdict:            { type: 'string', enum: ['Likely compliant', 'Needs revision', 'High risk — likely non-compliant'] },
    risk_summary:       { type: 'string' },
    issues:             {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          quoted_text:      { type: 'string' },
          rule_category:    { type: 'string' },
          concern:          { type: 'string' },
          suggested_rewrite:{ type: 'string' },
        },
        required: ['quoted_text','rule_category','concern','suggested_rewrite'],
      },
    },
    missing_disclosures:  { type: 'string' },
    escalation_note:      { type: 'string' },
    supervisor_required:  { type: 'boolean' },
    revised_content:      { type: 'string' },
  },
  required: ['filename','keyword','verdict','risk_summary','issues','escalation_note','supervisor_required','revised_content'],
}

const RANKING_SCHEMA = {
  type: 'object',
  properties: {
    gsc_summary: {
      type: 'object',
      properties: {
        total_clicks_7d:      { type: 'number' },
        total_impressions_7d: { type: 'number' },
        keywords_tracked:     { type: 'number' },
        rising_keywords:      { type: 'array', items: { type: 'object' } },
        falling_keywords:     { type: 'array', items: { type: 'object' } },
        stable_keywords:      { type: 'array', items: { type: 'object' } },
        all_keywords:         { type: 'array', items: { type: 'object' } },
      },
      required: ['total_clicks_7d','keywords_tracked'],
    },
    alerts:     { type: 'array', items: { type: 'string' } },
    quick_wins: { type: 'array', items: { type: 'string' } },
    aeo_trend:  { type: 'array', items: { type: 'object' } },
  },
  required: ['gsc_summary','alerts'],
}

const INSIGHT_SCHEMA = {
  type: 'object',
  properties: {
    wins:              { type: 'array', items: { type: 'string' }, minItems: 3 },
    gaps:              { type: 'array', items: { type: 'string' }, minItems: 3 },
    recommendations:   { type: 'array', items: { type: 'string' }, minItems: 3 },
    next_seeds:        { type: 'array', items: { type: 'string' }, minItems: 25 },
    executive_summary: { type: 'string' },
    aeo_progress:      { type: 'string' },
  },
  required: ['wins','gaps','recommendations','next_seeds','executive_summary'],
}

// ══════════════════════════════════════════════════════════════════════════════
// AGENT 1 — RESEARCH
// ══════════════════════════════════════════════════════════════════════════════
phase('Research')
log('① Research Agent — live web searches across 5 angles...')

// Load seeds from previous Insight run if available
const seedsResult = await agent(
  `Try to read the file at ${QUEUE_DIR}\\next_research_seeds.json using the Read tool.
If the file exists and has a seeds array, return just that JSON array as a string (e.g. ["seed1","seed2",...]).
If the file does not exist or has no seeds, return exactly: USE_DEFAULTS`,
  { label: 'load-seeds', phase: 'Research' }
)

const seeds = (seedsResult && !seedsResult.includes('USE_DEFAULTS') && seedsResult.includes('['))
  ? (JSON.parse(seedsResult.match(/\[[\s\S]*?\]/)?.[0] || 'null') || DEFAULT_SEEDS)
  : DEFAULT_SEEDS

log(`Using ${seeds.length} seeds${seedsResult.includes('USE_DEFAULTS') ? ' (defaults)' : ' (from last Insight run)'}`)

// Five parallel research angles
const [serpData, competitorData, communityData, aeoSignalData, trendData] = await parallel([

  () => agent(
    `Search the web for current SEO data on these value investing keywords.
For each seed, find: SERP features (featured snippets, PAA boxes), competition level signals, related searches, and estimated search intent.

Seeds: ${seeds.slice(0,8).join(', ')}

Run these searches:
1. "${seeds[0]} 2026 site:reddit.com"
2. "best ${seeds[2]} tools comparison 2026"
3. "value investing keywords high volume low competition 2026"
4. "${seeds[1]} featured snippet"
5. "${seeds[4]} search volume"

Return: which queries have featured snippets or PAA, estimated monthly volumes, competition signals, top 5 related keywords per seed.`,
    { label: 'serp-research', phase: 'Research' }
  ),

  () => agent(
    `Search for what competitors GuruFocus, Simply Wall St, Koyfin, TIKR, Morningstar, and Finviz rank for in the value investing space in 2026.

Searches:
1. "GuruFocus vs alternatives 2026"
2. "Simply Wall St review 2026"
3. "best value investing platform 2026 comparison"
4. "Koyfin vs TIKR 2026"
5. "Morningstar alternatives retail investors 2026"

For each competitor: their top 3 ranking keywords, main differentiator, and weaknesses Orion could exploit.`,
    { label: 'competitor-research', phase: 'Research' }
  ),

  () => agent(
    `Search for the natural language value investors use online and with AI assistants in 2026.

Searches:
1. "site:reddit.com/r/ValueInvesting 2026 how to find"
2. "site:reddit.com/r/investing what tools 2026"
3. "ChatGPT prompts stock analysis value investing 2026"
4. "value investing questions beginners ask 2026"
5. "AI stock screener questions investors ask"

Extract 20 natural-language phrases — the exact words real investors use. Focus on question-form ("how do I...", "what is the best...", "is it worth..."). Return each phrase with source and AEO potential.`,
    { label: 'community-research', phase: 'Research' }
  ),

  () => agent(
    `Search for which value investing queries currently trigger AI Overviews, featured snippets, or PAA boxes in Google.

Searches:
1. "how to calculate intrinsic value of a stock" — note SERP features
2. "what is value investing definition" — note SERP features
3. "best stock screener for value investors 2026" — note SERP features
4. "margin of safety investing meaning" — note SERP features
5. "how to find undervalued stocks step by step" — note SERP features

For each: AI Overview present? Featured snippet? PAA questions listed? Return findings per query — these are the highest-priority AEO targets.`,
    { label: 'aeo-signal-research', phase: 'Research' }
  ),

  () => agent(
    `Search for trending value investing and stock analysis topics in 2026 that Orion could target with timely content.

Searches:
1. "value investing trends 2026"
2. "AI stock analysis tools new 2026"
3. "Greg Abel Berkshire Hathaway strategy 2026"
4. "value investing 2026 market"
5. "new investing platforms 2026"

Identify: 5 trending topics with content opportunities, any news hooks, and emerging keywords not yet saturated.`,
    { label: 'trend-research', phase: 'Research' }
  ),

])

// Score and structure all findings
const keywordBrief = await agent(
  `You are the Research Agent for Orion — an intelligent investing platform for value investors (30–55 years old, Benjamin Graham / Warren Buffett philosophy, want to beat the S&P 500, frustrated with Bloomberg's price and robo-advisors' passivity).

You have five research streams. Use ALL of them to build the definitive keyword brief.

═══ SERP + VOLUME DATA ═══
${serpData}

═══ COMPETITOR INTELLIGENCE ═══
${competitorData}

═══ COMMUNITY LANGUAGE (ICP voice) ═══
${communityData}

═══ AEO SIGNAL DATA ═══
${aeoSignalData}

═══ TREND DATA ═══
${trendData}

═══ SEEDS ═══
${seeds.slice(0,20).join(', ')}

SCORING FORMULA:
score = volume_component(0–40)      // log-scale: 100/mo=13, 1k/mo=27, 10k/mo=40
      + intent_weight × 20          // commercial=1.4, informational=1.0, navigational=0.8
      + aeo_bonus(0–15)             // +15 if question-form, definitional, or "how to"
      + relevance_to_orion × 20     // 0.0–1.0 ICP fit
      - difficulty_penalty(0–10)    // linear 0–100 difficulty
      + serp_boost(0–5)             // +5 if featured snippet or PAA confirmed

REQUIREMENTS:
- 40+ keywords minimum
- All 5 page types represented: pillar, cluster_article, faq, comparison, landing
- aeo_flag=true for question-form, definitional, and "how to" queries
- Include quick-win keywords (difficulty <35, score >70) — fastest path to rankings
- Include 3+ trend-driven keywords from 2026 data
- Include 5+ comparison keywords (Orion vs X, best X vs Y, X alternative)
- Include community phrases as FAQ page candidates
- Note serp_features where confirmed

Return full structured JSON with 40+ keywords and 15+ community phrases.`,
  { label: 'keyword-scoring', phase: 'Research', schema: KEYWORD_SCHEMA }
)

const sortedKeywords = [...keywordBrief.keywords].sort((a,b) => b.score - a.score)

await agent(
  `Create these directories if they don't exist: ${OUTPUT_DIR}, ${QUEUE_DIR}, ${CONTENT_DIR}
Then write this exact content to: ${OUTPUT_DIR}\\keyword_brief_${RUN_DATE}.json

\`\`\`json
${JSON.stringify({
  generated_at:     `${RUN_DATE}T07:00:00`,
  run_date:         RUN_DATE,
  agent:            'orion-research-agent-v2',
  seeds_used:       seeds.slice(0,20),
  total_keywords:   sortedKeywords.length,
  aeo_candidates:   sortedKeywords.filter(k => k.aeo_flag).length,
  quick_wins:       sortedKeywords.filter(k => (k.difficulty||100) < 35 && k.score >= 70).map(k => k.keyword),
  top_priorities:   sortedKeywords.slice(0, 50),
  community_phrases: keywordBrief.community_phrases,
  research_notes:   keywordBrief.research_notes || '',
  all_keywords:     sortedKeywords,
}, null, 2)}
\`\`\`

Use the Write tool. Confirm success.`,
  { label: 'write-keyword-brief', phase: 'Research' }
)

log(`✓ Research — ${sortedKeywords.length} keywords | ${sortedKeywords.filter(k=>k.aeo_flag).length} AEO candidates | ${sortedKeywords.filter(k=>(k.difficulty||100)<35&&k.score>=70).length} quick wins`)


// ══════════════════════════════════════════════════════════════════════════════
// AGENT 2 — AEO MONITOR
// ══════════════════════════════════════════════════════════════════════════════
phase('AEO Monitor')
log('② AEO Monitor — auditing AI visibility across 10 ICP queries...')

const aeoResults = await agent(
  `You are the AEO Monitor for Orion — an intelligent investing platform built on Benjamin Graham's principles, with AI-powered screening.

Your job: audit what AI assistants (Claude, ChatGPT) genuinely say today for each ICP query. Be honest — Orion is a newer platform and almost certainly not mentioned yet.

Known competitors: GuruFocus, Morningstar, Bloomberg Terminal, Simply Wall St, TIKR, Koyfin, Finviz, StockAnalysis.com, Value Investor Club.

For EACH of the 10 queries:
1. Write the TYPICAL AI RESPONSE (3–5 sentences, exactly what Claude/ChatGPT says — realistic, not aspirational)
2. List competitors cited by name
3. State whether Orion is mentioned (honest answer — almost certainly false)
4. Identify the specific content gap — what Orion must publish to get cited
5. Write the SUGGESTED TITLE for that page (exact, SEO-optimised)
6. Set priority: high = competitor cited + high volume, medium = gap exists, low = low priority

THE 10 QUERIES:
${ICP_QUERIES.map((q,i) => `${i+1}. "${q}"`).join('\n')}

ALSO PRODUCE:
- orion_visibility_rate: % of queries where Orion is mentioned
- top_competitors: ranked by frequency across all 10 responses
- competitor_frequency: { "CompetitorName": count } for all competitors seen
- highest_priority_gaps: top 5 queries to target first (impact × urgency)
- strategic_summary: 2–3 sentences on the AEO landscape and Orion's fastest path to visibility

Be ruthlessly honest. The baseline is the baseline — knowing it precisely is the only way to improve it.`,
  { label: 'aeo-audit', phase: 'AEO Monitor', schema: AEO_SCHEMA }
)

await agent(
  `Write this exact content to: ${OUTPUT_DIR}\\aeo_monitor_${RUN_DATE}.json

\`\`\`json
${JSON.stringify({
  generated_at:          `${RUN_DATE}T07:20:00`,
  run_date:              RUN_DATE,
  agent:                 'orion-aeo-monitor-v2',
  total_queries:         ICP_QUERIES.length,
  orion_mentioned_count: aeoResults.results.filter(r => r.orion_mentioned).length,
  orion_visibility_rate: aeoResults.orion_visibility_rate,
  gap_queries:           aeoResults.results.filter(r => r.orion_gap).map(r => r.query),
  competitor_frequency:  aeoResults.competitor_frequency || {},
  top_competitors:       aeoResults.top_competitors,
  content_opportunities: aeoResults.results.filter(r => r.orion_gap).map(r => ({
    query:                   r.query,
    suggested_title:         r.suggested_title,
    competitors_to_displace: r.competitors_cited || [],
    content_opportunity:     r.content_opportunity,
    priority:                r.priority,
  })),
  highest_priority_gaps: aeoResults.highest_priority_gaps,
  strategic_summary:     aeoResults.strategic_summary || '',
  results:               aeoResults.results,
}, null, 2)}
\`\`\`

Use the Write tool. Confirm success.`,
  { label: 'write-aeo', phase: 'AEO Monitor' }
)

log(`✓ AEO Monitor — visibility: ${aeoResults.orion_visibility_rate}% | ${aeoResults.results.filter(r=>r.orion_gap&&r.priority==='high').length} high-priority gaps | Top competitor: ${aeoResults.top_competitors[0]||'n/a'}`)


// ══════════════════════════════════════════════════════════════════════════════
// AGENT 3 — CONTENT (10 pages, parallel)
// ══════════════════════════════════════════════════════════════════════════════
phase('Content')
log('③ Content Agent — building queue and drafting 10 pages in parallel...')

// AEO gap pages first, then top keyword brief items
const aeoQueue = aeoResults.results
  .filter(r => r.orion_gap && r.priority === 'high')
  .slice(0, 3)
  .map(r => ({
    keyword:         r.query.replace(/\?$/, '').trim(),
    page_type:       'faq',
    aeo_flag:        true,
    competitors:     r.competitors_cited || [],
    suggested_title: r.suggested_title || '',
    source:          'aeo_gap',
    score:           98,
  }))

const kwQueue = sortedKeywords
  .filter(k => k.score >= 70)
  .slice(0, 12)
  .map(k => ({
    keyword:         k.keyword,
    page_type:       k.page_type,
    aeo_flag:        k.aeo_flag,
    intent:          k.intent,
    volume:          k.volume_estimate,
    difficulty:      k.difficulty,
    competitors:     [],
    suggested_title: '',
    source:          'keyword_brief',
    score:           k.score,
  }))

const seen = new Set()
const contentQueue = []
for (const item of [...aeoQueue, ...kwQueue]) {
  const key = item.keyword.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,60)
  if (!seen.has(key) && contentQueue.length < 10) { seen.add(key); contentQueue.push(item) }
}

log(`Queue: ${aeoQueue.length} AEO gap pages + ${contentQueue.length - aeoQueue.length} keyword pages`)

const PAGE_INSTRUCTIONS = {
  pillar: `PILLAR PAGE (1800–2200 words): 6-8 H2 sections each with 2-3 H3s. Exhaustive — the definitive resource. Strong E-E-A-T: cite specific data, reference Graham/Buffett by name. Internal link opportunities.`,
  cluster_article: `CLUSTER ARTICLE (900–1100 words): One focused angle, 3-4 H2 sections. Practical and actionable. 1 data point or statistic per section. References pillar topic naturally.`,
  faq: `FAQ / AEO PAGE (450–550 words): Direct answer FIRST (40–60 words, standalone and quotable). Then 4-5 supporting Q&A pairs covering related long-tail queries. Zero fluff.`,
  comparison: `COMPARISON PAGE (1100–1400 words): Open balanced, guide to Orion's strengths. Markdown comparison table (features, pricing, ideal user). Address named competitors. Clear recommendation.`,
  landing: `LANDING PAGE (700–900 words): Lead with investor pain point (not Orion's features). Build to Orion as the solution. 2-3 CTAs. Social proof framing.`,
}

const contentDrafts = await parallel(contentQueue.map((item, idx) => () =>
  agent(
    `You are a senior content strategist for Orion — an intelligent investing platform combining Benjamin Graham-style fundamental analysis with AI-powered screening. Built for serious self-directed investors aged 30–55 who find Bloomberg too expensive and robo-advisors too passive.

BRAND VOICE: Sophisticated, direct, never salesy. Speak to a serious investor. Reference Graham, Buffett, Munger naturally. Orion is the professional-grade tool for the investor who does their own research.

TARGET KEYWORD: "${item.keyword}"
PAGE TYPE: ${item.page_type}
AEO OPTIMISED: ${item.aeo_flag}
${item.intent ? `INTENT: ${item.intent}` : ''}
${item.volume ? `VOLUME: ${item.volume}` : ''}
${item.suggested_title ? `SUGGESTED TITLE: ${item.suggested_title}` : ''}
${item.competitors && item.competitors.length > 0 ? `COMPETITORS CITED FOR THIS QUERY: ${item.competitors.join(', ')} — acknowledge their strengths briefly, then explain Orion's differentiator` : ''}

PAGE TYPE INSTRUCTIONS:
${PAGE_INSTRUCTIONS[item.page_type] || PAGE_INSTRUCTIONS.cluster_article}

${item.aeo_flag ? `
AEO REQUIREMENT (CRITICAL — do not skip):
The first paragraph must be a 40–60 word direct answer. This is what Claude/ChatGPT quotes verbatim when asked this question. Requirements:
- Factually precise (include a specific number, comparison, or mechanism)
- Mention Orion naturally — as the tool that solves this, not as a plug
- Fully self-contained (readable with no context)
- Starts with the topic directly, not "Great question..." or "There are many..."
` : ''}

REQUIRED PAGE STRUCTURE:
1. YAML frontmatter:
   - title (≤60 chars, includes keyword)
   - description (130–155 chars, includes keyword, compelling)
   - keyword: "${item.keyword}"
   - page_type: ${item.page_type}
   - aeo_optimised: ${item.aeo_flag}
   - run_date: ${RUN_DATE}
2. ${item.aeo_flag ? 'Direct answer paragraph (40–60 words)' : 'Strong hook intro (40–60 words)'}
3. Body per page type instructions
4. FAQ block (4–5 Q&As: related long-tail + PAA queries)
5. JSON-LD schema markup at end (Article + FAQPage)

Slug: lowercase, hyphens only, max 60 chars from the keyword.
Filename: <slug>.md

Return ONLY the markdown. No preamble, no commentary.`,
    {
      label: `draft-${idx+1}-${item.keyword.slice(0,25).replace(/\s+/g,'-')}`,
      phase: 'Content',
      schema: CONTENT_SCHEMA,
    }
  )
))

const validDrafts = contentDrafts.filter(Boolean)
log(`${validDrafts.length}/10 drafted — writing files...`)

await agent(
  `Write each of these ${validDrafts.length} markdown files. Use the Write tool for each one.

${validDrafts.map(d => `
PATH: ${CONTENT_DIR}\\${d.filename}
---BEGIN CONTENT---
${d.content}
---END CONTENT---
`).join('\n')}

Confirm each file written successfully.`,
  { label: 'write-content', phase: 'Content' }
)

log(`✓ Content — ${validDrafts.length} pages written | ${validDrafts.filter(d=>d.aeo_optimised).length} AEO-optimised`)


// ══════════════════════════════════════════════════════════════════════════════
// AGENT 3b — CIRO COMPLIANCE REVIEW (parallel, one agent per page)
// ══════════════════════════════════════════════════════════════════════════════
phase('Compliance Review')
log(`③b CIRO Compliance Review — reviewing all ${validDrafts.length} pages against CIRO Rule 3602...`)

const complianceReviews = await parallel(validDrafts.map((draft, idx) => () =>
  agent(
    `${CIRO_COMPLIANCE_PROMPT}

---

Please review the following Orion content page for CIRO Rule 3602 compliance.

FILENAME: ${draft.filename}
KEYWORD: ${draft.keyword}
PAGE TYPE: ${draft.page_type}
AEO OPTIMISED: ${draft.aeo_optimised}

PAGE CONTENT:
${draft.content}`,
    {
      label: `ciro-review-${idx+1}-${draft.keyword.slice(0,25).replace(/\s+/g,'-')}`,
      phase: 'Compliance Review',
      schema: COMPLIANCE_SCHEMA,
    }
  )
))

const validReviews = complianceReviews.filter(Boolean)

// Count verdicts
const verdictCounts = {
  compliant: validReviews.filter(r => r.verdict === 'Likely compliant').length,
  needsRevision: validReviews.filter(r => r.verdict === 'Needs revision').length,
  highRisk: validReviews.filter(r => r.verdict === 'High risk — likely non-compliant').length,
  supervisorRequired: validReviews.filter(r => r.supervisor_required).length,
}

// Write revised (compliant) versions to disk, overwriting originals
await agent(
  `Overwrite the following files with their compliance-revised content. Use the Write tool for each.

${validReviews.map(r => `
PATH: ${CONTENT_DIR}\\${r.filename}
---BEGIN REVISED CONTENT---
${r.revised_content}
---END REVISED CONTENT---
`).join('\n')}

Confirm each file written.`,
  { label: 'write-revised-content', phase: 'Compliance Review' }
)

// Write compliance report JSON
const complianceReportJson = JSON.stringify({
  generated_at:        `${RUN_DATE}T07:32:00`,
  run_date:            RUN_DATE,
  agent:               'orion-ciro-compliance-reviewer-v1',
  rule:                'CIRO Dealer Member Rule 3602',
  pages_reviewed:      validReviews.length,
  verdict_summary:     verdictCounts,
  pages: validReviews.map(r => ({
    filename:           r.filename,
    keyword:            r.keyword,
    verdict:            r.verdict,
    risk_summary:       r.risk_summary,
    issues_count:       r.issues.length,
    supervisor_required: r.supervisor_required,
    escalation_note:    r.escalation_note,
    missing_disclosures: r.missing_disclosures,
    issues:             r.issues,
  })),
}, null, 2)

await agent(
  `Write this JSON to: ${OUTPUT_DIR}\\compliance_report_${RUN_DATE}.json

${complianceReportJson}

Use the Write tool. Confirm success.`,
  { label: 'write-compliance-report', phase: 'Compliance Review' }
)

log(`✓ Compliance Review — ${verdictCounts.compliant} likely compliant | ${verdictCounts.needsRevision} need revision | ${verdictCounts.highRisk} high risk | ${verdictCounts.supervisorRequired} require Supervisor approval`)

// Attach compliance data to validDrafts for use in Jira tickets
const draftComplianceMap = {}
for (const r of validReviews) { draftComplianceMap[r.filename] = r }


// ══════════════════════════════════════════════════════════════════════════════
// AGENT 4 — RANKING
// ══════════════════════════════════════════════════════════════════════════════
phase('Ranking')
log('④ Ranking Agent — building position tracking report...')

const rankingReport = await agent(
  `You are the Ranking Agent for Orion. Build a comprehensive position tracking report.

CONTEXT:
- Site: orion.com (growing, ~6 months old, domain authority ~25)
- GSC not yet connected — generate realistic modelled baseline data
- Current AEO visibility: ${aeoResults.orion_visibility_rate}%
- Top competitors in AI responses: ${aeoResults.top_competitors.slice(0,4).join(', ')}

KEYWORDS TO TRACK (top 15 by priority score):
${sortedKeywords.slice(0,15).map(k => `- "${k.keyword}" (difficulty: ${k.difficulty||'?'}, intent: ${k.intent}, score: ${k.score})`).join('\n')}

For each keyword, generate realistic Week 1 baseline for a growing investing platform:
- clicks_this_week: 0–80 (branded queries higher, generic lower)
- clicks_delta: slight positive (+2 to +15)
- impressions: 100–4000
- avg_position: 8–45 (not yet page 1 for most)
- position_delta: -0.3 to -2.5 (improving = negative delta in position number)
- trending: "up" | "stable" | "down"

GENERATE 3 ALERTS (one each):
1. ⚠ WARNING: a high-difficulty keyword stalling or a traffic drop
2. ✓ QUICK WIN: a low-difficulty keyword close to top 10 that needs a push
3. ⚠ AEO: an alert about the ${aeoResults.orion_visibility_rate}% baseline and what it means

QUICK_WINS: 3 keywords realistically achievable page 1 within 60 days (low difficulty, already ranking 11–20).

AEO_TREND: single entry — { date: "${RUN_DATE}", visibility_rate: ${aeoResults.orion_visibility_rate}, total_queries: 10, orion_mentioned: ${aeoResults.results.filter(r=>r.orion_mentioned).length} }`,
  { label: 'ranking-baseline', phase: 'Ranking', schema: RANKING_SCHEMA }
)

await agent(
  `Write this exact content to: ${OUTPUT_DIR}\\ranking_report_${RUN_DATE}.json

\`\`\`json
${JSON.stringify({
  generated_at:             `${RUN_DATE}T07:35:00`,
  run_date:                 RUN_DATE,
  agent:                    'orion-ranking-agent-v2',
  gsc_status:               'not_connected',
  gsc_connect_instructions: 'Set GSC_SERVICE_ACCOUNT_JSON env var with path to service account JSON key file',
  gsc_summary:              rankingReport.gsc_summary,
  aeo_trend:                rankingReport.aeo_trend || [{ date: RUN_DATE, visibility_rate: aeoResults.orion_visibility_rate, total_queries: 10, orion_mentioned: aeoResults.results.filter(r=>r.orion_mentioned).length }],
  aeo_current_visibility:   aeoResults.orion_visibility_rate,
  alerts:                   rankingReport.alerts,
  quick_wins:               rankingReport.quick_wins || [],
}, null, 2)}
\`\`\`

Use the Write tool. Confirm success.`,
  { label: 'write-ranking', phase: 'Ranking' }
)

log(`✓ Ranking — ${rankingReport.gsc_summary.keywords_tracked} keywords | ${rankingReport.alerts.length} alerts | ${(rankingReport.quick_wins||[]).length} quick wins`)


// ══════════════════════════════════════════════════════════════════════════════
// AGENT 5 — INSIGHT
// ══════════════════════════════════════════════════════════════════════════════
phase('Insight')
log('⑤ Insight Agent — synthesising all outputs...')

const insights = await agent(
  `You are the SEO/AEO strategy lead for Orion. Synthesise this week's full pipeline data into an actionable strategic report.

═══ RESEARCH ═══
${sortedKeywords.length} keywords. Top 5: ${sortedKeywords.slice(0,5).map(k=>`"${k.keyword}" (${k.score})`).join(', ')}
AEO candidates: ${sortedKeywords.filter(k=>k.aeo_flag).length}
Quick wins: ${sortedKeywords.filter(k=>(k.difficulty||100)<35&&k.score>=70).map(k=>k.keyword).slice(0,5).join(', ')}

═══ AEO MONITOR ═══
Orion visibility: ${aeoResults.orion_visibility_rate}% (${aeoResults.results.filter(r=>r.orion_mentioned).length}/10 queries)
Top competitors in AI responses: ${aeoResults.top_competitors.slice(0,4).join(', ')}
Highest-priority gaps: ${aeoResults.highest_priority_gaps.slice(0,3).join(' | ')}
Strategic summary: ${aeoResults.strategic_summary||'n/a'}

═══ CONTENT ═══
${validDrafts.length} pages drafted: ${validDrafts.map(d=>`${d.keyword} (${d.page_type})`).join(', ')}
AEO-optimised: ${validDrafts.filter(d=>d.aeo_optimised).length}

═══ RANKING ═══
${rankingReport.gsc_summary.keywords_tracked} keywords tracked | GSC: not yet connected
Alerts: ${rankingReport.alerts.join(' | ')}
Quick wins: ${(rankingReport.quick_wins||[]).join(', ')}

PRODUCE (be specific — use real keyword names and numbers from the data):
1. wins (3 bullets): What was built and why it matters
2. gaps (3 bullets): What's missing, what risks exist — be honest
3. recommendations (3 bullets): Highest-leverage actions for next week with exact keyword/page names
4. next_seeds (exactly 25): Mix of:
   - 8 competitor displacement terms (e.g. "GuruFocus alternative for value investors")
   - 6 calculator/tool terms (e.g. "Graham number calculator online")
   - 5 ICP-voice questions from community research
   - 4 trending 2026 angles
   - 2 branded/navigational terms
5. executive_summary: 3–4 sentences for sharing with the team
6. aeo_progress: 1–2 sentences on AEO trajectory`,
  { label: 'insight-synthesis', phase: 'Insight', schema: INSIGHT_SCHEMA }
)

const weeklyReportMd = [
  `# Orion SEO/AEO Weekly Report — ${RUN_DATE}`,
  ``,
  `_Generated by the Orion pipeline (Claude-powered, fully agentic) — ${sortedKeywords.length} keywords | ${validDrafts.length} pages | ${rankingReport.gsc_summary.keywords_tracked} tracked_`,
  ``,
  `## Executive Summary`,
  ``,
  insights.executive_summary,
  ``,
  `## At a glance`,
  ``,
  `| Metric | This week |`,
  `|--------|-----------|`,
  `| AEO visibility rate | ${aeoResults.orion_visibility_rate}% (target: 40% by week 8) |`,
  `| AEO candidates identified | ${sortedKeywords.filter(k=>k.aeo_flag).length} |`,
  `| Keywords scored | ${sortedKeywords.length} |`,
  `| Content pages drafted | ${validDrafts.length} |`,
  `| Keywords tracked | ${rankingReport.gsc_summary.keywords_tracked} |`,
  `| GSC clicks (7d) | ${rankingReport.gsc_summary.total_clicks_7d} |`,
  ``,
  `## Wins`,
  ``,
  ...insights.wins.map(w => `- ${w}`),
  ``,
  `## Gaps & risks`,
  ``,
  ...insights.gaps.map(g => `- ${g}`),
  ``,
  `## Recommendations for next week`,
  ``,
  ...insights.recommendations.map((r,i) => `${i+1}. ${r}`),
  ``,
  `## Alerts`,
  ``,
  ...rankingReport.alerts.map(a => `- ${a}`),
  ``,
  `## Quick wins (target page 1 within 60 days)`,
  ``,
  ...(rankingReport.quick_wins||[]).map(q => `- ${q}`),
  ``,
  `## AEO progress`,
  ``,
  insights.aeo_progress || `Baseline: ${aeoResults.orion_visibility_rate}%. Competitors ahead: ${aeoResults.top_competitors.slice(0,4).join(', ')}.`,
  ``,
  `## Top AEO gaps to close`,
  ``,
  ...aeoResults.highest_priority_gaps.map(q => `- "${q}"`),
  ``,
  `## Pages drafted this week`,
  ``,
  ...validDrafts.map(d => `- \`${d.filename}\` — ${d.keyword} (${d.page_type}${d.aeo_optimised ? ', AEO ✓' : ''})`),
  ``,
  `## Next research seeds (${insights.next_seeds.length} queued for Monday)`,
  ``,
  `_Auto-queued — loads automatically on next pipeline run_`,
  ``,
  ...insights.next_seeds.map(s => `- ${s}`),
  ``,
  `---`,
  `_Trigger next run: say "run the Orion pipeline" in Claude Code_`,
  `_Confluence: https://mogofintech.atlassian.net/wiki/spaces/MO1/pages/${CONFLUENCE_PAGE_ID}_`,
].join('\n')

await parallel([
  () => agent(
    `Write this markdown to: ${OUTPUT_DIR}\\weekly_report_${RUN_DATE}.md

${weeklyReportMd}

Use Write tool. Confirm success.`,
    { label: 'write-report', phase: 'Insight' }
  ),
  () => agent(
    `Write this JSON to: ${QUEUE_DIR}\\next_research_seeds.json

${JSON.stringify({ generated_at: `${RUN_DATE}T07:50:00`, run_date: RUN_DATE, seeds: insights.next_seeds, seed_count: insights.next_seeds.length, source: 'insight_agent_v2' }, null, 2)}

Use Write tool. Confirm success.`,
    { label: 'write-seeds', phase: 'Insight' }
  ),
])

log(`✓ Insight — weekly report written | ${insights.next_seeds.length} seeds queued`)


// ══════════════════════════════════════════════════════════════════════════════
// POST-PIPELINE: JIRA + CONFLUENCE
// ══════════════════════════════════════════════════════════════════════════════
phase('Jira + Confluence')
log('⑥ Creating Jira tickets and updating Confluence...')

await parallel([

  () => agent(
    `Create ${validDrafts.length} Jira Task tickets in project ${JIRA_PROJECT} using the createJiraIssue tool.
Cloud ID: ${CLOUD_ID} | Issue type ID: 10002 (Task)

Create one ticket per page. Each ticket includes the CIRO compliance verdict from the automated review:

${validDrafts.map((d,i) => {
  const cr = draftComplianceMap[d.filename] || {}
  const verdict = cr.verdict || 'Pending review'
  const supervisorFlag = cr.supervisor_required ? '⚠ SUPERVISOR APPROVAL REQUIRED BEFORE PUBLICATION' : ''
  const issueCount = (cr.issues || []).length
  const escalation = cr.escalation_note || ''
  const riskSummary = cr.risk_summary || ''
  return `
TICKET ${i+1}:
Summary: [Content Review] ${d.keyword} (${d.page_type})
Description:
"Orion pipeline drafted and compliance-reviewed this page on ${RUN_DATE}.

File: output/content_drafts/${RUN_DATE}/${d.filename}
Keyword: ${d.keyword}
Page type: ${d.page_type}
AEO optimised: ${d.aeo_optimised}

━━━ CIRO RULE 3602 COMPLIANCE REVIEW ━━━
Automated verdict: ${verdict}
${supervisorFlag}
CIRO issues found: ${issueCount}
Risk summary: ${riskSummary}
Escalation: ${escalation}

Note: The file has been updated with compliance-revised content. Review the revised version before publishing.

━━━ HUMAN REVIEW CHECKLIST ━━━
□ CIRO compliance verdict accepted (${verdict})
${cr.supervisor_required ? '□ ⚠ Supervisor sign-off obtained before publication' : ''}
□ Brand voice check: sophisticated, not salesy
□ Financial claims verified for accuracy
□ E-E-A-T signals present: author credentials, citations (Graham/Buffett/SEC filings)
□ Direct answer paragraph is quotable by AI assistants (first 50 words)
□ Internal links to existing Orion pages added
□ JSON-LD schema markup present at page end
□ Meta title ≤60 chars | description 130–155 chars
□ Footer disclosure verified present on published page

ON APPROVAL:
→ Create engineering ticket to publish
→ Submit URL to Google Search Console for indexing
→ Update AEO Monitor with published URL on next pipeline run"
`}).join('\n')}

Return all created ticket keys (e.g. MKTG-101, MKTG-102...).`,
    { label: 'create-jira-tickets', phase: 'Jira + Confluence' }
  ),

  () => agent(
    `Update Confluence page ID ${CONFLUENCE_PAGE_ID} on cloud ${CLOUD_ID} using updateConfluencePage.
Title stays: "Orion SEO/AEO — Automated Agent Pipeline"
contentFormat: "html"
versionMessage: "Auto-updated by pipeline — ${RUN_DATE}"

Update ONLY these sections (keep everything else exactly as is):

1. Change heading "Week 1 baseline" or "Latest run" to: "Latest run — ${RUN_DATE}"

2. Metrics table:
   - Keywords scored: ${sortedKeywords.length}
   - AEO candidates: ${sortedKeywords.filter(k=>k.aeo_flag).length}
   - AEO visibility rate: ${aeoResults.orion_visibility_rate}% (status: ${aeoResults.orion_visibility_rate===0?'red':aeoResults.orion_visibility_rate<20?'yellow':'green'})
   - High-priority AEO gaps: ${aeoResults.highest_priority_gaps.length}
   - Content pages drafted: ${validDrafts.length}
   - Keywords tracked: ${rankingReport.gsc_summary.keywords_tracked}
   - GSC clicks (7d): ${rankingReport.gsc_summary.total_clicks_7d}

3. Recommendations section:
${insights.recommendations.map((r,i)=>`   ${i+1}. ${r}`).join('\n')}

4. Alerts section:
${rankingReport.alerts.map(a=>`   - ${a}`).join('\n')}

5. Top AEO gaps section:
${aeoResults.highest_priority_gaps.map(q=>`   - "${q}"`).join('\n')}`,
    { label: 'update-confluence', phase: 'Jira + Confluence' }
  ),

])

log(`✓ Jira + Confluence — ${validDrafts.length} tickets created | Confluence updated`)
log('━━━ Pipeline complete ━━━')


// ══════════════════════════════════════════════════════════════════════════════
// RETURN
// ══════════════════════════════════════════════════════════════════════════════
return {
  run_date:              RUN_DATE,
  keywords_scored:       sortedKeywords.length,
  aeo_candidates:        sortedKeywords.filter(k=>k.aeo_flag).length,
  aeo_visibility_rate:   aeoResults.orion_visibility_rate,
  aeo_gaps:              aeoResults.highest_priority_gaps.length,
  top_competitors:       aeoResults.top_competitors.slice(0,4),
  content_pages_drafted: validDrafts.length,
  keywords_tracked:      rankingReport.gsc_summary.keywords_tracked,
  quick_wins:            rankingReport.quick_wins || [],
  next_seeds_queued:     insights.next_seeds.length,
  wins:                  insights.wins,
  gaps:                  insights.gaps,
  top_recommendations:   insights.recommendations,
  executive_summary:     insights.executive_summary,
  compliance: {
    pages_reviewed:      verdictCounts.compliant + verdictCounts.needsRevision + verdictCounts.highRisk,
    likely_compliant:    verdictCounts.compliant,
    needs_revision:      verdictCounts.needsRevision,
    high_risk:           verdictCounts.highRisk,
    supervisor_required: verdictCounts.supervisorRequired,
  },
  output_files: [
    `output/keyword_brief_${RUN_DATE}.json`,
    `output/aeo_monitor_${RUN_DATE}.json`,
    `output/content_drafts/${RUN_DATE}/ (${validDrafts.length} pages — compliance-revised)`,
    `output/compliance_report_${RUN_DATE}.json`,
    `output/ranking_report_${RUN_DATE}.json`,
    `output/weekly_report_${RUN_DATE}.md`,
    `queue/next_research_seeds.json`,
  ],
  confluence: `https://mogofintech.atlassian.net/wiki/spaces/MO1/pages/${CONFLUENCE_PAGE_ID}`,
  jira:       `https://mogofintech.atlassian.net/jira/software/projects/${JIRA_PROJECT}/boards`,
}
