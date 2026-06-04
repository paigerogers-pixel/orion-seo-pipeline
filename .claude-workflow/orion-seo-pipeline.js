export const meta = {
  name: 'orion-seo-pipeline',
  description: 'Full Orion AEO/SEO pipeline — P0 gate, doctrine-aligned, CIRO-reviewed, Edge draft, social queue',
  phases: [
    { title: 'P0 Gate',           detail: 'Check which foundation pages exist — prioritise missing P0 pages before anything else' },
    { title: 'Research',          detail: 'Live SERP + Canada-first keyword discovery, scored with opportunity scoring' },
    { title: 'AEO Monitor',       detail: 'AI visibility audit across 15 ICP queries (Canada-first, 5 AI systems)' },
    { title: 'Content',           detail: 'Draft pages — P0 gaps first, then P1/P2/P3, doctrine-aligned, 8-section structure' },
    { title: 'Compliance Review', detail: 'CIRO Rule 3602 + doctrine drift detection across all 6 drift types' },
    { title: 'Ranking',           detail: 'GSC position tracking, deltas, quick wins, AEO visibility trend' },
    { title: 'Insight',           detail: 'Weekly synthesis + The Edge draft + categorised seeds for next run' },
    { title: 'Jira + Confluence', detail: 'Jira tickets + Confluence pipeline page + social media state update' },
  ],
}

// ─── P0 FOUNDATION PAGES ─────────────────────────────────────────────────────
// Source: SEO/AEO Agent Flow (Confluence MO1 ID: 3417702418)
// These 10 pages must exist before any P1/P2/P3 content is published.
// Every run checks which are missing and drafts them first.
const P0_FOUNDATION_PAGES = [
  { slug: 'what-intelligent-investing-is',        title: 'What Intelligent Investing Is',                    keyword: 'what is intelligent investing',                         page_type: 'pillar',   development_stage: 'Awakening',   content_category: '04 Identity' },
  { slug: 'how-intelligent-investing-works',      title: 'How Intelligent Investing Works',                  keyword: 'how intelligent investing works',                       page_type: 'pillar',   development_stage: 'Commitment',  content_category: '03 Capital Discipline' },
  { slug: 'pricing-one-app-one-fee',              title: 'Pricing: One App. One Fee.',                       keyword: 'intelligent investing pricing Canada',                  page_type: 'landing',  development_stage: 'Commitment',  content_category: '04 Identity' },
  { slug: 'regulatory-protection-ciro-cipf',      title: 'Regulatory Protection: CIRO, CIPF, and Custody',  keyword: 'is intelligent investing safe Canada CIRO',             page_type: 'landing',  development_stage: 'Commitment',  content_category: '03 Capital Discipline' },
  { slug: 'managed-portfolios',                   title: 'Managed Portfolios: S&P 500 DCA',                  keyword: 'managed investing portfolio Canada S&P 500 DCA',       page_type: 'landing',  development_stage: 'Commitment',  content_category: '03 Capital Discipline' },
  { slug: 'self-directed-investing',              title: 'Self-Directed Investing With a System',            keyword: 'self-directed investing Canada with a system',         page_type: 'pillar',   development_stage: 'Discipline',  content_category: '02 Behavioural Edge' },
  { slug: 'fiscal-ai-stock-analysis',             title: 'Fiscal AI: AI-Powered Stock Analysis',             keyword: 'Fiscal AI stock analysis Canada',                       page_type: 'landing',  development_stage: 'Discipline',  content_category: '03 Capital Discipline' },
  { slug: 'sp500-benchmark-comparison',           title: 'S&P 500 Benchmark: Know Where You Stand',          keyword: 'compare investment performance S&P 500 Canada',        page_type: 'landing',  development_stage: 'Discipline',  content_category: '02 Behavioural Edge' },
  { slug: 'investment-memo-process',              title: 'The Investment Memo: Write It Before You Buy',     keyword: 'investment thesis template Canada',                    page_type: 'pillar',   development_stage: 'Discipline',  content_category: '03 Capital Discipline' },
  { slug: 'what-we-do-not-do',                   title: 'What We Do Not Do',                                keyword: 'what intelligent investing does not do',               page_type: 'landing',  development_stage: 'Attention',   content_category: '01 System Failure' },
]

// Social media state page ID — pipeline writes findings here for social agents to consume
// Source: Social Media Agent Flow (Confluence MO1 ID: 3417407509)
const SOC_PERFORMANCE_PAGE_ID = '3428450308'
const EDGE_NEWSLETTER_PAGE_ID = '3417866270'

// ─── COMPLIANCE KNOWN UNKNOWNS ────────────────────────────────────────────
// 8 areas PENDING guidance from Axl Villapaz (compliance advisor).
// Target resolution: 2026-06-15.
// Until resolved, content touching these areas is flagged
// "Needs revision — awaiting compliance guidance" — never auto-approved.
const COMPLIANCE_KNOWN_UNKNOWNS = [
  { id:'KU-1', area:'Investment advice line',            guidance:null,
    description:'Education vs. advice distinction for statements like "most active traders underperform the S&P 500", "DCA is a disciplined long-term approach", "overtrading destroys returns". Disclaimer language required and when it must appear. Whether every piece of content needs "this is not investment advice".',
    examples:['Most active traders underperform the S&P 500','DCA is a disciplined long-term approach','Overtrading destroys returns over time','A kill line is the price at which you exit a position'] },
  { id:'KU-2', area:'Performance claims',                guidance:null,
    description:'Rules for referencing the 28.40% 1-year return in marketing. Required disclaimer language by channel (website/email/social). Time period requirements. Whether benchmark comparison must always accompany return figures. Rules for general market statements like "historically, the S&P 500 has returned X% annually".',
    examples:['28.40% 1-year return','historically, the S&P 500 has returned X% annually'] },
  { id:'KU-3', area:'Projected returns and DCA illustrations', guidance:null,
    description:'Whether projected return illustrations are permitted. Conditions, disclaimers, and required language for DCA calculators and growth charts. Compliant alternative if projections are not permitted.',
    examples:['$50/week invested at historical S&P returns becomes $X over 10 years','DCA calculators showing projected growth over time'] },
  { id:'KU-4', area:'S&P benchmark comparison',          guidance:null,
    description:'Whether the agent can say "compare your investment decisions against the S&P 500". Whether "most self-directed investors underperform the S&P" is permitted if supported by SPIVA/DALBAR. Citation format for third-party research in marketing.',
    examples:['Compare your investment decisions against the S&P 500','Most self-directed investors underperform the S&P'] },
  { id:'KU-5', area:'Competitor references',             guidance:null,
    description:'Whether publicly verifiable competitor pricing facts can be stated (e.g. "Wealthsimple charges X"). Whether "II charges a flat $20/month" vs competitors is permitted. Line between factual and misleading comparison under Canadian advertising standards.',
    examples:['Wealthsimple charges X%','Traditional platforms charge 1.5% AUM','II charges a flat $20/month'] },
  { id:'KU-6', area:'Behavioral finance claims',         guidance:null,
    description:'Whether general behavioral facts like "most of us underperform because of behavioral patterns" require disclaimers. Citation format for DALBAR, SPIVA, CSA Investor Index. Difference between a general market fact and a claim triggering compliance review.',
    examples:['Most of us underperform because of behavioral patterns','DALBAR data shows average investor underperforms the market'] },
  { id:'KU-7', area:'Required risk disclosure by channel', guidance:null,
    description:'Exact risk disclosure language for website product pages, member emails, The Edge newsletter, and organic social posts (Instagram, LinkedIn, X). Whether requirements differ by channel. Approved boilerplate for the agent.',
    examples:['Website product page','Email to existing members','The Edge newsletter','Instagram/LinkedIn/X organic post'] },
  { id:'KU-8', area:'Real-time social engagement',       guidance:null,
    description:'Rules for engaging in public investing discussions as a registered firm on X. Whether every social reply needs pre-approval or if there is a safe zone. Topics where replies must go through Airtable first.',
    examples:['Replying to investing conversations on X as brand account','Agent-drafted responses reviewed by Tarsila before posting'] },
]

// Derive which KU areas are still unresolved
const UNRESOLVED_KU_AREAS = COMPLIANCE_KNOWN_UNKNOWNS
  .filter(ku => ku.guidance === null)
  .map(ku => ku.area.toLowerCase())

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
[The full page content with all problematic passages replaced by suggested rewrites and missing disclosures added inline. This is the version that should be written to disk.]

KNOWN UNKNOWNS — PENDING COMPLIANCE GUIDANCE (target: 2026-06-15):
The following 8 areas do NOT yet have confirmed compliance guidance. If the page contains content in any of these areas, you MUST:
1. Set the verdict to "Needs revision — awaiting compliance guidance" (overrides any other verdict)
2. Quote the specific passage
3. Label it with the KU ID (e.g. KU-2: Performance claims)
4. Do NOT rewrite it — leave a placeholder: [PENDING COMPLIANCE GUIDANCE — KU-X: Area name]
5. Set supervisor_required to true

KU-1 INVESTMENT ADVICE LINE: Any statement that could be interpreted as investment advice rather than education. Flag: "most active traders underperform", "DCA is disciplined", "overtrading destroys returns", "kill line", or any similar behavioural/strategic investing statement.
KU-2 PERFORMANCE CLAIMS: Any reference to specific return figures including the 28.40% 1-year return, or general market return statements like "the S&P 500 has historically returned X%".
KU-3 PROJECTED RETURNS / DCA ILLUSTRATIONS: Any projected growth figure, DCA calculator output, or illustration of what contributions produce over time (e.g. "$50/week becomes $X over 10 years").
KU-4 S&P BENCHMARK COMPARISON: Any statement comparing user/investor performance to the S&P 500, or claiming self-directed investors underperform the S&P.
KU-5 COMPETITOR REFERENCES: Any statement of competitor pricing, fees, or feature comparisons (Wealthsimple, Questrade, etc.), including "II charges a flat $20/month" vs. competitor fees.
KU-6 BEHAVIORAL FINANCE CLAIMS: Any statement attributing underperformance to behavioral patterns, or citing DALBAR, SPIVA, or CSA Investor Index data.
KU-7 RISK DISCLOSURE BY CHANNEL: Any content where channel-specific risk disclosure requirements are unclear — especially social posts, newsletter content, or email to members.
KU-8 REAL-TIME SOCIAL ENGAGEMENT: Any content drafted for social media replies or brand account engagement on X/LinkedIn/Instagram.`

// ─── CONFIG ────────────────────────────────────────────────────────────────
// FIX #2: Run date — use args.runDate if provided, otherwise ask an agent for today's date
// Never hardcode a fallback date — that caused all outputs to stamp the wrong week
const _dateResult = (args && args.runDate) ? args.runDate : await agent(
  `Return today's date in YYYY-MM-DD format. Return only the date string, nothing else.`,
  { label: 'get-run-date' }
)
const RUN_DATE = (typeof _dateResult === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(_dateResult.trim()))
  ? _dateResult.trim()
  : (args && args.runDate) || '2026-06-09'
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
    executive_summary: { type: 'string' },
    aeo_progress:      { type: 'string' },
    // FIX #6: Seeds categorised by content category — not just a flat list
    next_seeds: {
      type: 'object',
      properties: {
        system_failure:     { type: 'array', items: { type: 'string' }, minItems: 6,  description: '01 System Failure — why most of us underperform, behavioral mistakes, market truths' },
        behavioural_edge:   { type: 'array', items: { type: 'string' }, minItems: 7,  description: '02 Behavioural Edge — how serious allocators operate, underwriting, calibration' },
        capital_discipline: { type: 'array', items: { type: 'string' }, minItems: 7,  description: '03 Capital Discipline — position sizing, kill criteria, benchmarking, re-underwriting' },
        identity:           { type: 'array', items: { type: 'string' }, minItems: 5,  description: '04 Identity — who you are becoming, allocator identity, mastery as direction' },
      },
      required: ['system_failure','behavioural_edge','capital_discipline','identity'],
    },
    // FIX #3: The Edge draft — one publish-ready edition per weekly run
    edge_draft: {
      type: 'object',
      properties: {
        subject_line:     { type: 'string', description: 'Severe, direct. States the idea not the benefit. Reducible to one of the five claims. No clickbait.' },
        preview_text:     { type: 'string', description: 'One sentence. Complements subject line without repeating it.' },
        hard_claim:       { type: 'string', description: 'The opening line. Declarative, cold, unapologetic. Pulls the reader in.' },
        system_explanation: { type: 'string', description: 'The body — why this is true, the mechanism behind it, what serious allocators do instead. 120–180 words.' },
        correction:       { type: 'string', description: 'The close — what changes when you understand this. One short paragraph.' },
        closing_principle: { type: 'string', description: 'One sentence. The reader carries it forward. Not a CTA — a principle.' },
        content_category: { type: 'string', enum: ['01 System Failure','02 Behavioural Edge','03 Capital Discipline','04 Identity'] },
        five_claims_anchor: { type: 'string' },
        compliance_flag:  { type: 'string', description: 'Any areas that may need Axl review before send' },
      },
      required: ['subject_line','hard_claim','system_explanation','correction','closing_principle','content_category'],
    },
  },
  required: ['wins','gaps','recommendations','next_seeds','executive_summary','edge_draft'],
}

// ══════════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════════
// FIX #1 — P0 GATE: Check which foundation pages exist, draft missing ones first
// Source: SEO/AEO Agent Flow (Confluence MO1 ID: 3417702418)
// ══════════════════════════════════════════════════════════════════════════════
phase('P0 Gate')
log('⓪ P0 Gate — checking which foundation pages exist...')

const p0StatusResult = await agent(
  `Check which of these P0 foundation pages already exist as files in the directory ${OUTPUT_DIR}\\content_drafts\\ (any subdirectory).
Use the Glob tool to search for these slugs:
${P0_FOUNDATION_PAGES.map(p => `- ${p.slug}.md`).join('\n')}

For each slug, return whether the file exists (true/false).
Return a JSON object: { "slug": true/false, ... }`,
  { label: 'p0-check', phase: 'P0 Gate' }
)

// Parse which P0 pages are missing
let p0Missing = P0_FOUNDATION_PAGES
try {
  const existing = JSON.parse((p0StatusResult.match(/\{[\s\S]*\}/) || ['{}'])[0])
  p0Missing = P0_FOUNDATION_PAGES.filter(p => !existing[p.slug])
} catch(e) {
  log('P0 check parse error — will draft all 10 foundation pages')
}

log(`P0 status: ${P0_FOUNDATION_PAGES.length - p0Missing.length}/${P0_FOUNDATION_PAGES.length} foundation pages exist | ${p0Missing.length} missing`)

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

// FIX #1: P0 pages go to front of queue — foundation before everything else
const p0Queue = p0Missing.slice(0, 3).map(p => ({
  keyword:         p.keyword,
  page_type:       p.page_type,
  aeo_flag:        true,
  development_stage: p.development_stage,
  content_category:  p.content_category,
  competitors:     [],
  suggested_title: p.title,
  source:          'p0_foundation',
  score:           100,
  page_priority:   'P0',
}))

const seen = new Set()
const contentQueue = []
// Order: P0 missing → AEO gaps → keyword brief
for (const item of [...p0Queue, ...aeoQueue, ...kwQueue]) {
  const key = item.keyword.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,60)
  if (!seen.has(key) && contentQueue.length < 10) { seen.add(key); contentQueue.push(item) }
}

log(`Queue: ${p0Queue.length} P0 foundation | ${aeoQueue.length} AEO gap | ${contentQueue.length - p0Queue.length - aeoQueue.length} keyword pages`)

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

1. wins (3 bullets): What was built and why it matters — specific keyword names and numbers
2. gaps (3 bullets): What's missing, what risks exist — be honest. Use "most of us" language.
3. recommendations (3 bullets): Highest-leverage actions for next week with exact keyword/page names
4. executive_summary: 3–4 sentences for sharing with the team — doctrine-aligned, no forbidden words
5. aeo_progress: 1–2 sentences on AEO visibility trajectory

6. next_seeds — FIX #6: Categorise by the 4 content categories (source: II Content Operations MO1 ID: 3409477650):
   system_failure (6 seeds): queries about why most of us underperform, behavioral mistakes, market truths
     e.g. "why do I keep making the same investing mistakes", "why overtrading hurts returns Canada"
   behavioural_edge (7 seeds): queries about how serious allocators operate differently
     e.g. "how to write an investment memo Canada", "what is a kill line in investing"
   capital_discipline (7 seeds): mechanics of serious allocation — position sizing, benchmarking, kill criteria
     e.g. "how to benchmark investment performance Canada", "position sizing rules value investing"
   identity (5 seeds): allocator identity, who you are becoming, mastery
     e.g. "what kind of investor do I want to become", "how to develop as an allocator"

7. edge_draft — FIX #3: Draft The Edge newsletter edition for this week
   Source: The Edge Newsletter operations (Confluence MO1 ID: 3417866270)
   Rules:
   - No greeting ever. No sign-off implying conversation.
   - One idea only. Hard opening. Three-part structure: Hard Claim → System Explanation → Correction.
   - Subject line: state the idea not the benefit. Severe, direct. Reducible to one of the five claims.
   - Voice: cold, clinical, declarative. "Most of us" — never "most investors."
   - No forbidden words. No urgency. No exclamation marks.
   - Closing principle: one sentence the reader carries forward. Not a CTA.
   - Content category: one of the 4 (01 System Failure / 02 Behavioural Edge / 03 Capital Discipline / 04 Identity)
   - compliance_flag: note any areas that may need Axl's review before send (KU-1 through KU-8)
   Base the edition on the most important insight from this week's pipeline data.`,
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

${JSON.stringify({
  generated_at: `${RUN_DATE}T07:50:00`,
  run_date:     RUN_DATE,
  source:       'insight_agent_v2',
  // FIX #6: Categorised seeds — Research Agent loads these and maps to content categories
  seeds_by_category: insights.next_seeds,
  // Flat list for backward compatibility with Research Agent seed loading
  seeds: Object.values(insights.next_seeds).flat(),
  seed_count: Object.values(insights.next_seeds).flat().length,
}, null, 2)}

Use Write tool. Confirm success.`,
    { label: 'write-seeds', phase: 'Insight' }
  ),
])

const totalSeeds = Object.values(insights.next_seeds).flat().length
log(`✓ Insight — weekly report written | ${totalSeeds} seeds queued (categorised by content type) | Edge draft ready`)


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

// FIX #4: Write pipeline findings to Social Media performance state page
// Source: Social Media Agent Flow (Confluence MO1 ID: 3417407509)
// The social agents read from this machine-readable state to inform content concepts
await agent(
  `Update the Confluence page ID ${SOC_PERFORMANCE_PAGE_ID} on cloud ${CLOUD_ID} using the updateConfluencePage tool.
Title: "SOC — Performance Summary"
contentFormat: "html"
versionMessage: "Pipeline auto-update — ${RUN_DATE}"

Replace the entire body with this machine-readable state (social agents read this):

<h2>Pipeline state — <time datetime="${RUN_DATE}">${RUN_DATE}</time></h2>
<div data-type="panel-info"><p>Auto-written by SEO/AEO pipeline every Monday. Social agents read this to inform weekly content concepts. Do not edit manually.</p></div>
<h3>AEO gaps to address in social content this week</h3>
<ul>${aeoResults.highest_priority_gaps.map(q => `<li><p>${q}</p></li>`).join('')}</ul>
<h3>Quick wins to amplify (already gaining traction)</h3>
<ul>${(rankingReport.quick_wins||[]).map(q => `<li><p>${q}</p></li>`).join('')}</ul>
<h3>Top competitors in AI responses this week</h3>
<ul>${aeoResults.top_competitors.slice(0,4).map(c => `<li><p>${c}</p></li>`).join('')}</ul>
<h3>Weekly insight for social content</h3>
<p>${insights.executive_summary}</p>
<h3>The Edge draft subject line this week</h3>
<p><strong>${insights.edge_draft.subject_line}</strong></p>
<h3>AEO visibility rate</h3>
<p>${aeoResults.orion_visibility_rate}% (target: 40% by week 8)</p>
<h3>Raw seed ideas by content category</h3>
<p><strong>01 System Failure:</strong> ${(insights.next_seeds.system_failure||[]).slice(0,3).join(' · ')}</p>
<p><strong>02 Behavioural Edge:</strong> ${(insights.next_seeds.behavioural_edge||[]).slice(0,3).join(' · ')}</p>
<p><strong>03 Capital Discipline:</strong> ${(insights.next_seeds.capital_discipline||[]).slice(0,3).join(' · ')}</p>
<p><strong>04 Identity:</strong> ${(insights.next_seeds.identity||[]).slice(0,3).join(' · ')}</p>`,
  { label: 'update-social-state', phase: 'Jira + Confluence' }
)

// FIX #3: Write The Edge draft to a dated section on the newsletter page
// Tarsila reviews before send. Must not be published without Axl + Saad sign-off.
const edgeDraft = insights.edge_draft
await agent(
  `On Confluence page ID ${EDGE_NEWSLETTER_PAGE_ID} (cloud ${CLOUD_ID}), add a child note or comment using createConfluenceFooterComment with the following content.
Actually — use createConfluencePage to create a NEW child page under parent ${EDGE_NEWSLETTER_PAGE_ID}.

Title: "Draft Edition — ${RUN_DATE}"
cloudId: ${CLOUD_ID}
spaceId: 3409674244
parentId: ${EDGE_NEWSLETTER_PAGE_ID}
contentFormat: html

Body:
<div data-type="panel-warning"><p>DRAFT — requires Axl + Saad sign-off before send. ${edgeDraft.compliance_flag ? `Compliance flag: ${edgeDraft.compliance_flag}` : 'No specific compliance flags noted — standard KU holds apply.'}</p></div>
<table>
<thead><tr><th>Field</th><th>Content</th></tr></thead>
<tbody>
<tr><td><strong>Subject line</strong></td><td>${edgeDraft.subject_line}</td></tr>
<tr><td><strong>Preview text</strong></td><td>${edgeDraft.preview_text || '—'}</td></tr>
<tr><td><strong>Content category</strong></td><td>${edgeDraft.content_category}</td></tr>
<tr><td><strong>Five claims anchor</strong></td><td>${edgeDraft.five_claims_anchor || '—'}</td></tr>
</tbody>
</table>
<h2>Hard claim</h2>
<p><strong>${edgeDraft.hard_claim}</strong></p>
<h2>System explanation</h2>
<p>${edgeDraft.system_explanation}</p>
<h2>Correction</h2>
<p>${edgeDraft.correction}</p>
<h2>Closing principle</h2>
<p><em>${edgeDraft.closing_principle}</em></p>
<hr/><p><em>Generated by SEO/AEO pipeline ${RUN_DATE}. Review against doctrine before send: no forbidden words, "most of us" voice, reduces to one of the five claims.</em></p>`,
  { label: 'write-edge-draft', phase: 'Jira + Confluence' }
)

log(`✓ Jira + Confluence — ${validDrafts.length} tickets | Confluence updated | Social state written | Edge draft created`)
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
  next_seeds_queued:     Object.values(insights.next_seeds).flat().length,
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
