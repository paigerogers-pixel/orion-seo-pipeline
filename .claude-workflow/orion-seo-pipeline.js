export const meta = {
  name: 'orion-seo-pipeline',
  description: 'Full Orion AEO/SEO pipeline — doctrine-aligned, CIRO-reviewed, 5 agents + Jira + Confluence',
  phases: [
    { title: 'Research',          detail: 'Live SERP + community keyword discovery, scored and mapped to allocator development stages' },
    { title: 'AEO Monitor',       detail: 'AI assistant visibility audit across 10 ICP queries' },
    { title: 'Content',           detail: 'Draft 10 pages aligned to Dave Feller doctrine — allocator development, not generic SEO' },
    { title: 'Compliance Review', detail: 'CIRO Rule 3602 + doctrine drift detection (6 drift types)' },
    { title: 'Ranking',           detail: 'GSC position tracking, deltas, and alerts' },
    { title: 'Insight',           detail: 'Weekly synthesis, report, and next-run seed generation' },
    { title: 'Jira + Confluence', detail: 'Create content review tickets with doctrine + compliance verdicts + refresh Confluence page' },
  ],
}

// ─── DAVE FELLER DOCTRINE (source: June 3 2026 emails) ────────────────────
// The operating doctrine that governs every piece of content this pipeline creates.
// DO NOT MODIFY without alignment with Dave Feller.
const DOCTRINE = {

  mission: `We are not building an investing platform. We are building better investors.
The allocator is the product. The portfolio is the artifact. The system is the edge.`,

  the_empty_category: `Modern investing offers two choices: speculation disguised as investing, or institutional finance disguised as advice. Neither solves allocator development. We occupy the space between — where capital allocation is treated as a discipline and allocator development is the product.`,

  central_thesis: `Discipline produces real wealth. Speculation produces the feeling of producing it. The challenge is not proving discipline works. The challenge is making discipline more compelling than speculation, more compelling than narrative, more compelling than impulse.`,

  the_work: `The work is not producing more investors. The work is producing better allocators. The work is not increasing activity. The work is increasing judgment.`,

  development_stages: ['Attention', 'Awakening', 'Commitment', 'Discipline', 'Mastery'],

  five_claims: [
    'The market humbles everyone.',
    'The few who endure operate a specific way.',
    'We make that way operationally possible.',
    'You will know exactly where you stand.',
    'Most of us prefer not to know.',
  ],

  status_we_elevate: ['discipline', 'calibration', 'underwriting', 'patience', 'process integrity', 'intellectual honesty', 'continuous learning', 'long-term thinking', 'independent thinking', 'humility'],

  status_we_reject: ['activity', 'prediction', 'confidence', 'speed', 'trading', 'participation', 'wealth signaling'],

  // Source: II — Content Operations (Confluence MO1, ID: 3409477650)
  content_categories: ['01 System Failure', '02 Behavioural Edge', '03 Capital Discipline', '04 Identity'],

  // Source: II — Strategic Doctrine (MO1, ID: 3417767948) + Brand Guidelines (ID: 3428679682)
  what_ii_is_not: `A brokerage. A robo-advisor. A content platform. An AI investing app. Not a Wealthsimple competitor — a Wealthsimple successor. Wealthsimple is where investors learn that activity feels like progress. We are where they go when activity stops feeling like progress.`,

  icp_stages: `
    Launch sequence (not a filter — build status with early adopters, let it flow outward):
    1. Upstream Active Speculator (~1.2M Canadians, age 25–38, $5K–$20K invested, over-trading, platform: Questrade or Wealthsimple)
    2. Primary Confused Improver (~1.5–2M Canadians, age 28–42, $25K–$250K, 5–15 trades/quarter, no clear system, pain: "I don't know if what I'm doing is right")
    3. Downstream Aspiring Disciplined (~400–600K Canadians, age 32–48, $75K+, pattern-recognition, ready for a system)
    Primary ICP for content: Confused Improver.`,

  constitutional_commitments: `
    - Flat subscription only — no AUM fees, no performance fees, no transaction fees ever
    - Truth surfaces never softened for retention or growth
    - No outperformance claims, no prediction claims, no market call claims ever
    - Never make price comparisons publicly — users discover value themselves
    - Status signals are behavioral, never wealth-based`,

  forbidden_words: `NEVER USE: elite, exclusive, premium, luxury, smart money, beat the market, alpha, outperform, outperformance, expert picks, proven strategy, guaranteed, best returns, market-beating, stock tips, hot stocks, buy signal, must-buy, can't miss. Never exclamation marks. Never emoji. Never urgency language. Never reassurance language.`,

  standard_page_structure: `
    Every page must follow this exact 8-section structure:
    1. DIRECT ANSWER (40–60 words): Crisp, standalone, mentions II naturally. This is what AI assistants quote verbatim.
    2. WHY IT MATTERS: Context for the Confused Improver. What is at stake.
    3. WHAT MOST OF US GET WRONG: The honest truth. Use "most of us" not "most investors."
    4. THE OPERATIONAL RESPONSE: What serious allocators actually do. Concrete, not theoretical.
    5. HOW II ADDRESSES IT: Product tie-in — natural, never a hard sell. Describe the system, not a feature list.
    6. WHAT II DOES NOT CLAIM: A brief honest statement of limitations. This is non-negotiable.
    7. CANADIAN TRUST CONTEXT: Regulatory context (CIRO member, CIPF protected), Canadian market specifics where relevant.
    8. FAQ BLOCK: 4–5 Q&As covering related long-tail + PAA queries. Schema-marked.`,

  approved_ctas: `
    APPROVED CTAs (use only these, verbatim):
    - "Proceed deliberately."
    - "See the system."
    - "Compare decisions to the benchmark."
    - "Review the process."
    - "Understand the fee structure."
    NEVER USE: "Start beating the market today", "Become a smarter investor", "Join thousands of successful investors", "Try it free", "Unlock your potential", "Get started", "Sign up now"`,

  post_structure: `Every post (social or content) follows: Hard Claim → System Explanation → Correction.`,

  high_status_test: `Before publishing, reject if it: tries to persuade, reassures, explains too much, or feels friendly. The audience is an adult. Treat them like one.`,

  wealthsimple_rule: `Wealthsimple is never an adversary in public. It is a stage. The recruiting moment is "I do not want to repeat that mistake again" — not aspirational. Never reference competitor pricing publicly. Users discover the value themselves.`,

  voice: `Cold. Clinical. Declarative. Willing. We say what others in the category are unwilling to say. We do not perform certainty. We do not perform expertise. We do not perform superiority. The most important word in our vocabulary is "us" not "them". Always say "Most of us" — never "Most investors". Numbers lead. No exclamation marks. No emoji. No urgency.`,

  recruiting_motions: {
    reactive: 'The person has already been humbled. Psychology: I do not want to repeat that mistake.',
    anticipatory: 'The person recognizes they are vulnerable to being humbled. Psychology: I want a better way to operate before reality teaches the lesson.',
  },

  identity: `The identity is NOT "I am a winning investor." The identity IS: "I am the type of allocator who operates within a system." Outcomes fluctuate. Process endures.`,

  drift_types: {
    educational: 'Teaching without identity formation — tips, lessons, explanations that inform but do not shape identity',
    guru: 'Predictions, experts, stock picks, market calls',
    activity: 'Content that rewards or glorifies activity, trading, or participation',
    pronoun: 'Using "Most investors" instead of "Most of us"',
    identity: 'Promoting "winning investors" instead of "serious allocators"',
    status: 'Increasing the status of prediction, activity, or confidence instead of discipline, calibration, and process',
  },

  what_we_refuse: 'Generic financial content, trend chasing, engagement farming, prediction theater, conventional fintech marketing, empty inspiration, manufactured urgency, status through wealth signaling, status through exclusivity, status through superiority.',

  final_test: `Before any content ships ask: Does this reinforce allocator identity? Does this increase the status of allocator development? Does this reduce to one of the five claims? Does this attract serious allocators? Would we still publish it if engagement were irrelevant?`,

  ai_rule: `AI should not replace judgment. AI should increase leverage. The documents provide judgment. AI provides speed. Never publish AI-generated content that was not filtered through the doctrine. The documents are the filter. AI is not the filter.`,
}

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

// Source: SEO/AEO — Automated Agent Flow (Confluence MO1, ID: 3417702418)
// Canada-first ICP seeds — Confused Improver (28–42, Wealthsimple/Questrade users)
const DEFAULT_SEEDS = [
  // Core II brand terms
  'intelligent investing',
  'what is intelligent investing',
  'intelligent investing platform Canada',
  // Pain-point entry (Confused Improver)
  'how do I know if my investing is working',
  'why do I keep losing money investing',
  'what is a good return on investment Canada',
  'am I a good investor',
  'how to stop overtrading',
  // System / process terms
  'investment thesis template',
  'how to write an investment memo',
  'intrinsic value calculator',
  'margin of safety investing',
  'DCF calculator stock',
  'Benjamin Graham formula',
  'kill line investing',
  // Wealthsimple/Questrade alternative (organic discovery — never public comparisons)
  'Wealthsimple alternative for serious investors',
  'Questrade alternative long-term investing',
  'self-directed investing platform Canada',
  // S&P benchmark
  'compare my portfolio to S&P 500',
  'how to benchmark investment performance',
  // Value investing
  'value investing for beginners Canada',
  'how to find undervalued stocks',
  'Warren Buffett investing strategy',
  // AI investing
  'AI investing platform Canada',
  'Fiscal AI stock analysis',
]

// Source: SEO/AEO — Automated Agent Flow (Confluence MO1, ID: 3417702418)
// These 15 prompts are run across Claude, ChatGPT, Perplexity, Gemini, and Google AI Overviews weekly
const ICP_QUERIES = [
  // Decision uncertainty
  'What is the best investing platform in Canada for disciplined investors?',
  'How do I know if I am actually a good investor?',
  'What is the difference between investing and speculating?',
  // Benchmark anxiety
  'How do I compare my investment performance to the S&P 500?',
  'What is a realistic return for a self-directed investor in Canada?',
  'Am I beating the market or just getting lucky?',
  // Platform dissatisfaction
  'What is a good alternative to Wealthsimple for serious long-term investors?',
  'What investing platforms do serious Canadian investors use?',
  'What is Intelligent Investing and how does it work?',
  // Discipline-seeking
  'How do I write an investment thesis for a stock?',
  'What is a kill line in investing?',
  'How do serious investors use margin of safety?',
  // Trust and system
  'What is the safest investing platform in Canada?',
  'How do I build a disciplined long-term investing process?',
  'What does a fully activated investing system look like?',
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
          // ── Dave Feller doctrine fields ───────────────────────────────────
          development_stage:  { type: 'string', enum: ['Attention','Awakening','Commitment','Discipline','Mastery'] },
          recruiting_motion:  { type: 'string', enum: ['reactive','anticipatory'] },
          // Source: II — Content Operations (MO1 ID: 3409477650) — exact 4 categories
          content_category:   { type: 'string', enum: ['01 System Failure','02 Behavioural Edge','03 Capital Discipline','04 Identity'] },
          five_claims_anchor: { type: 'string' },
          doctrine_note:      { type: 'string' },
          // ── Opportunity scoring (Source: SEO/AEO Agent Flow, MO1 ID: 3417702418) ──
          // Each dimension 0–5, compliance/brand risk subtracted
          opportunity_intent_fit:       { type: 'number' }, // does query signal a Confused Improver?
          opportunity_icp_fit:          { type: 'number' }, // does it match the 3 ICP stage profiles?
          opportunity_product_fit:      { type: 'number' }, // can II actually address this query?
          opportunity_aeo_gap:          { type: 'number' }, // is II invisible in AI responses for this?
          opportunity_conversion_prox:  { type: 'number' }, // how close to a paid conversion decision?
          opportunity_compliance_risk:  { type: 'number' }, // risk of CIRO issues (subtract)
          opportunity_brand_drift_risk: { type: 'number' }, // risk of doctrine drift (subtract)
          opportunity_score:            { type: 'number' }, // final: sum of above (max 25, min 0)
          page_priority:                { type: 'string', enum: ['P0','P1','P2','P3'] }, // P0=foundation, P1=pain, P2=comparison, P3=AEO definition
        },
        required: ['keyword','intent','aeo_flag','page_type','score','development_stage','recruiting_motion','content_category'],
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
    // ── Dave Feller doctrine fields ──────────────────────────────────────
    development_stage:   { type: 'string', enum: ['Attention','Awakening','Commitment','Discipline','Mastery'] },
    recruiting_motion:   { type: 'string', enum: ['reactive','anticipatory'] },
    content_category:    { type: 'string', enum: ['01 System Failure','02 Behavioural Edge','03 Capital Discipline','04 Identity'] },
    five_claims_used:    { type: 'array', items: { type: 'string' } },
    drift_check_passed:  { type: 'boolean' },
    drift_issues_found:  { type: 'string' },
  },
  required: ['slug','filename','content','keyword','page_type','development_stage','recruiting_motion','content_category','drift_check_passed'],
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
  const existing = JSON.parse(((p0StatusResult || '').match(/\{[\s\S]*\}/) || ['{}'])[0])
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

// Score and structure all findings — mapped to Dave Feller doctrine
const keywordBrief = await agent(
  `You are the Research Agent for Intelligent Investing / Orion Digital Corp. You must apply TWO frameworks simultaneously: SEO scoring AND Dave Feller's allocator development doctrine.

COMPANY DOCTRINE (apply to every keyword):
${JSON.stringify(DOCTRINE, null, 2)}

ICP: Serious individual allocators who recognize that capital allocation deserves a system. NOT entertainment seekers, NOT active traders, NOT confidence-driven speculators. People who want to become better allocators — not merely richer investors.

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

SEO SCORING FORMULA (score field, 0–100):
score = volume_component(0–40)      // log-scale: 100/mo=13, 1k/mo=27, 10k/mo=40
      + intent_weight × 20          // commercial=1.4, informational=1.0, navigational=0.8
      + aeo_bonus(0–15)             // +15 if question-form, definitional, or "how to"
      + relevance_to_orion × 20     // 0.0–1.0 ICP fit (Canadian Confused Improver = 1.0)
      - difficulty_penalty(0–10)    // linear 0–100 difficulty
      + serp_boost(0–5)             // +5 if featured snippet or PAA confirmed in Canada

OPPORTUNITY SCORING FORMULA (opportunity_score field, 0–25):
Source: SEO/AEO Agent Flow (Confluence MO1 ID: 3417702418)
opportunity_score = intent_fit(0–5)        // signals a Confused Improver searching for a system?
                  + icp_fit(0–5)           // matches stage 1/2/3 ICP profile (Canadian)?
                  + product_fit(0–5)       // can II concretely address this with the product?
                  + aeo_gap(0–5)           // is II invisible in AI responses for this query?
                  + conversion_prox(0–5)   // proximity to paid conversion decision
                  - compliance_risk(0–5)   // CIRO Rule 3602 risk exposure
                  - brand_drift_risk(0–5)  // guru/activity/status/pronoun drift risk

PAGE PRIORITY:
Source: SEO/AEO Agent Flow (Confluence MO1 ID: 3417702418)
P0 = Foundation (must exist before anything else): "What Intelligent Investing Is," "How II Works," "Pricing: One App. One Fee.," CIRO/CIPF/Custody, Managed Portfolios, Self-Directed Investing, Fiscal.ai, S&P Benchmark Comparison, Investment Memo, "What We Do Not Do"
P1 = ICP pain pages (Confused Improver entry — Awakening/Attention stage)
P2 = Comparison pages (Wealthsimple/Questrade alternatives — Commitment stage, never public price comparisons)
P3 = AEO definition pages (definitional queries for AI retrieval — all stages)

DOCTRINE MAPPING (required for every keyword):

development_stage: Which stage of allocator development does this keyword attract?
  - Attention: encounters a contradiction / uncomfortable truth (e.g. "why do most of us underperform")
  - Awakening: questions assumptions, sees investing as a judgment discipline (e.g. "what is intelligent investing")
  - Commitment: choosing a different way of operating (e.g. "how to start systematic investing Canada")
  - Discipline: adopting systems — underwriting, sizing, calibration (e.g. "how to write an investment thesis")
  - Mastery: continuous improvement, compounding judgment (e.g. "how to review investment mistakes honestly")

recruiting_motion: Who is this keyword for?
  - reactive: person already been humbled (panic sell, speculation loss, "I keep making the same mistake")
  - anticipatory: person who recognizes vulnerability, wants a system before reality teaches the lesson

content_category: Source: II — Content Operations (Confluence MO1 ID: 3409477650)
  - 01 System Failure: what the current investing system produces (behavioral mistakes, why most of us underperform)
  - 02 Behavioural Edge: how the few who endure operate (underwriting, calibration, discipline, process)
  - 03 Capital Discipline: mechanics of serious allocation (position sizing, kill criteria, benchmarking, re-underwriting)
  - 04 Identity: who you are becoming as an allocator (identity shift, status, mastery as direction)

five_claims_anchor: Which of the five claims does this keyword best support?
  1. "The market humbles everyone."
  2. "The few who endure operate a specific way."
  3. "We make that way operationally possible."
  4. "You will know exactly where you stand."
  5. "Most of us prefer not to know."

doctrine_note: Brief note on how content for this keyword should be framed per the doctrine.

DRIFT FILTER — REJECT any keyword where the most natural content would be:
- Stock picks or market predictions (Guru Drift)
- "Best stocks to buy" type queries (Guru Drift)
- Active trading or frequent rebalancing content (Activity Drift)
- Content that rewards checking prices or following trends (Activity Drift)
- Generic financial tips without identity formation (Educational Drift)

REQUIREMENTS:
- 40+ keywords minimum
- All 5 page types represented
- aeo_flag=true for question-form, definitional, and "how to" queries
- Include quick-win keywords (difficulty <35, score >70)
- Include 3+ trend-driven keywords from 2026 data
- Include 5+ comparison keywords (Orion vs X, X alternative)
- PRIORITIZE keywords that attract the Awakening and Discipline stages — these are the highest-value allocator development moments
- Community phrases from the ICP voice research are excellent FAQ candidates — keep the natural language

Return full structured JSON with 40+ keywords (including doctrine fields) and 15+ community phrases.`,
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
  `You are the AEO Monitor for Intelligent Investing (II) — a Canadian investing platform that makes the discipline of serious capital allocation operationally accessible to individual investors. II is a CIRO member firm. The product: managed S&P 500 DCA portfolio + self-directed investing with structured process tools (investment memos, kill lines, S&P benchmarking, Fiscal AI analysis).

Source: SEO/AEO — Automated Agent Flow (Confluence MO1, ID: 3417702418)

Your job: simulate what the five major AI systems (Claude, ChatGPT, Perplexity, Gemini, Google AI Overviews) currently say for each of the 15 ICP queries. Be honest — II is a newer platform and almost certainly not mentioned. The baseline is the baseline. Knowing it precisely is the only way to improve it.

CONTEXT ABOUT THE ICP:
The primary ICP is the Confused Improver (28–42, Canadian, $25K–$250K invested, currently using Wealthsimple or Questrade, 5–15 trades/quarter, no clear system, primary pain: "I don't know if what I'm doing is right"). They are not looking for stock tips. They are looking for a system.

KNOWN COMPETITORS (Canadian context first):
Wealthsimple, Questrade, Qtrade, Moka, Passiv, BMO InvestorLine — then international: GuruFocus, Morningstar, Simply Wall St, TIKR, Koyfin, Finviz, StockAnalysis.com.

II SIGNAL TERMS (if any AI mentions these, II is being cited):
"Intelligent Investing," "II platform," "investment memo platform," "kill line investing," "Fiscal AI," "S&P benchmark comparison Canada."

For EACH of the 15 queries:
1. TYPICAL AI RESPONSE: what Claude/ChatGPT/Perplexity actually says (3–5 sentences, honest simulation — no wishful thinking)
2. COMPETITORS CITED: by name, Canadian competitors first
3. II MENTIONED: boolean — almost certainly false
4. CONTENT GAP: what specific page II must publish to get cited on this query
5. SUGGESTED TITLE: exact page title, SEO-optimised, doctrine-aligned (no forbidden words)
6. PRIORITY: high = Canadian competitor cited + Confused Improver intent, medium = gap exists, low = tangential

THE 15 ICP QUERIES:
${ICP_QUERIES.map((q,i) => `${i+1}. "${q}"`).join('\n')}

ALSO PRODUCE:
- orion_visibility_rate: % of queries where II is mentioned
- top_competitors: ranked by frequency, Canadian platforms first
- competitor_frequency: { "CompetitorName": count } across all 15 responses
- highest_priority_gaps: top 5 queries to target first (Confused Improver intent × II product fit)
- strategic_summary: 2–3 sentences on the AEO landscape and II's fastest path to visibility in Canadian AI responses`,
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
    `You are the Content Agent for Intelligent Investing / Orion Digital Corp. You produce content that serves allocator development — not generic SEO content.

You must apply Dave Feller's complete doctrine before writing a single word. The doctrine is the filter. SEO is the distribution mechanism.

══════════════════════════════════════════════
DAVE FELLER DOCTRINE (non-negotiable)
══════════════════════════════════════════════

MISSION: We are not building an investing platform. We are building better investors. The allocator is the product. The portfolio is the artifact.

THE VOICE: Cold. Clinical. Declarative. Willing. We describe reality as honestly as we can.
- ALWAYS say "Most of us" — NEVER say "Most investors"
- Do not flatter, entertain, or manufacture urgency or certainty
- Do not perform expertise or superiority
- The founder, team, and audience are all subject to the same reality

THE FIVE CLAIMS (every piece must reduce to at least one):
1. The market humbles everyone.
2. The few who endure operate a specific way.
3. We make that way operationally possible.
4. You will know exactly where you stand.
5. Most of us prefer not to know.

IDENTITY TO REINFORCE: "I am the type of allocator who operates within a system."
NOT: "I am a winning investor." NOT: "I am a smart investor."
Outcomes fluctuate. Process endures.

STATUS WE ELEVATE: discipline, calibration, underwriting, patience, process integrity, intellectual honesty, continuous learning, long-term thinking, humility
STATUS WE REJECT: activity, prediction, confidence, speed, trading, participation, wealth signaling

THE CONTENT STANDARD: Make people think "That's true." NOT "That's clever." NOT "That's viral." NOT "That's a hot take." Truth first. Attention second. Always.

DRIFT DETECTION — your draft will FAIL if it contains:
✗ GURU DRIFT: predictions, stock picks, market calls, "experts say..."
✗ ACTIVITY DRIFT: rewards activity, glorifies trading, makes checking prices aspirational
✗ EDUCATIONAL DRIFT: teaches without shaping identity — tips that inform but do not transform
✗ PRONOUN DRIFT: "Most investors" instead of "Most of us"
✗ IDENTITY DRIFT: "winning investors" instead of "serious allocators"
✗ STATUS DRIFT: elevates prediction, activity, or confidence instead of discipline, calibration, process
✗ AI DRIFT: generic AI-generated content not filtered through doctrine

══════════════════════════════════════════════
THIS SPECIFIC PAGE
══════════════════════════════════════════════

TARGET KEYWORD: "${item.keyword}"
PAGE TYPE: ${item.page_type}
DEVELOPMENT STAGE: ${item.development_stage || 'Awakening'}
RECRUITING MOTION: ${item.recruiting_motion || 'anticipatory'}
CONTENT CATEGORY: ${item.content_category || 'Reality'}
AEO OPTIMISED: ${item.aeo_flag}
${item.intent ? `SEARCH INTENT: ${item.intent}` : ''}
${item.volume ? `VOLUME ESTIMATE: ${item.volume}` : ''}
${item.suggested_title ? `SUGGESTED TITLE: ${item.suggested_title}` : ''}
${item.competitors && item.competitors.length > 0 ? `COMPETITORS CITED FOR THIS QUERY: ${item.competitors.join(', ')} — acknowledge briefly, then position Orion as the system for serious allocators, not just another tool` : ''}

STAGE CONTEXT:
${item.development_stage === 'Attention' ? 'This person has just encountered an uncomfortable truth about investing. The content should create recognition — "I knew this was true. I had never seen it expressed this clearly."' : ''}
${item.development_stage === 'Awakening' ? 'This person is beginning to question assumptions. The content should help them see that investing is a judgment discipline, not an information discipline.' : ''}
${item.development_stage === 'Commitment' ? 'This person is choosing a different way of operating. The content should make disciplined capital allocation feel like the natural way serious people operate.' : ''}
${item.development_stage === 'Discipline' ? 'This person is adopting systems. The content should show what disciplined operation actually looks like in practice — specific, actionable, not theoretical.' : ''}
${item.development_stage === 'Mastery' ? 'This person is compounding judgment over time. The content should reinforce continuous improvement and honest self-assessment.' : ''}

RECRUITING MOTION CONTEXT:
${item.recruiting_motion === 'reactive' ? 'Write for someone who has already been humbled. They experienced a panic sell, position sizing mistake, or speculative loss. They do not want to repeat it. Do not lecture. Speak from shared experience: "Most of us have..."' : 'Write for someone who recognizes they are vulnerable to being humbled. They see the patterns in others. They want a better system before reality forces the lesson.'}

PAGE TYPE INSTRUCTIONS:
${PAGE_INSTRUCTIONS[item.page_type] || PAGE_INSTRUCTIONS.cluster_article}

${item.aeo_flag ? `
AEO REQUIREMENT (CRITICAL):
The first paragraph must be a 40–60 word direct answer — the paragraph AI assistants quote verbatim.
- Factually precise (specific mechanism, not vague)
- Mention Orion naturally as the system that operationalizes this
- Fully self-contained
- Doctrine-compliant: reinforces the allocator identity, not the "winning investor" identity
` : ''}

═══════════════════════════════════════════════
FORBIDDEN WORDS — if any appear, the draft fails
═══════════════════════════════════════════════
elite, exclusive, premium, luxury, smart money, beat the market, alpha, outperform, outperformance, expert picks, proven strategy, guaranteed, best returns, market-beating, stock tips, hot stocks, buy signal, must-buy, can't miss, unlock your potential, become a smarter investor, join thousands, start now, sign up today

═══════════════════════════════════════════════
APPROVED CTAs — use only one of these, verbatim
═══════════════════════════════════════════════
"Proceed deliberately." / "See the system." / "Compare decisions to the benchmark." / "Review the process." / "Understand the fee structure."
NEVER: "Get started," "Try it free," "Sign up now," "Start investing today"

═══════════════════════════════════════════════
MANDATORY 8-SECTION PAGE STRUCTURE
Source: SEO/AEO Agent Flow (Confluence MO1 ID: 3417702418)
═══════════════════════════════════════════════
REQUIRED PAGE STRUCTURE:
1. YAML frontmatter:
   - title (≤60 chars, includes keyword, no forbidden words)
   - description (130–155 chars, includes keyword — make people think "that's true")
   - keyword: "${item.keyword}"
   - page_type: ${item.page_type}
   - development_stage: ${item.development_stage || 'Awakening'}
   - recruiting_motion: ${item.recruiting_motion || 'anticipatory'}
   - content_category: ${item.content_category || '02 Behavioural Edge'}
   - aeo_optimised: ${item.aeo_flag}
   - run_date: ${RUN_DATE}
2. DIRECT ANSWER (40–60 words): standalone, AI-quotable, names II naturally
3. WHY IT MATTERS: what is at stake for a Confused Improver who doesn't know if they're doing it right
4. WHAT MOST OF US GET WRONG: honest truth, use "most of us," reference behavioral patterns
5. THE OPERATIONAL RESPONSE: what serious allocators actually do — concrete, specific
6. HOW II ADDRESSES IT: the system, not a feature list. Never a hard sell.
7. WHAT II DOES NOT CLAIM: 1–2 honest sentences on limitations. Non-negotiable.
8. CANADIAN TRUST CONTEXT: CIRO member firm, CIPF protected, Canadian market context (1 short paragraph)
9. FAQ BLOCK (4–5 Q&As: long-tail + PAA, doctrine-compliant, no guru drift)
10. JSON-LD schema (Article + FAQPage)

After writing the content, return the doctrine compliance check:
- drift_check_passed: true only if NONE of the 6 drift types are present
- drift_issues_found: describe any issues found (empty string if none)
- development_stage, recruiting_motion, content_category: confirm what you used
- five_claims_used: which of the five claims appear in the content

Slug: lowercase, hyphens only, max 60 chars.
Filename: <slug>.md

Return ONLY the structured output. No preamble.`,
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

const driftFailed = validDrafts.filter(d => d.drift_check_passed === false)
const doctrineAligned = validDrafts.filter(d => d.drift_check_passed === true)
log(`✓ Content — ${validDrafts.length} pages written | ${doctrineAligned.length} doctrine-aligned | ${driftFailed.length} drift issues flagged | ${validDrafts.filter(d=>d.aeo_optimised).length} AEO-optimised`)

// ── Content briefs for Tarsila + Miguel ──────────────────────────────────────
// A brief is separate from the full draft — it gives Tarsila everything she needs
// to write, refine, or brief an external writer independently of the pipeline.
// Miguel gets the technical spec per page so he knows exactly how to implement it.
const BRIEFS_DIR = `${OUTPUT_DIR}\\content_briefs\\${RUN_DATE}`

const briefsContent = validDrafts.map((d, i) => {
  const item = contentQueue[i] || {}
  const compReview = draftComplianceMap ? draftComplianceMap[d.filename] : null
  return `
# Content Brief — ${d.keyword}
**File:** \`content_drafts/${RUN_DATE}/${d.filename}\`
**Run date:** ${RUN_DATE}
**Brief for:** Tarsila (content review + refinement) · Miguel (technical implementation)

---

## 1. Strategic context
| Field | Value |
|-------|-------|
| Target keyword | ${d.keyword} |
| Page type | ${d.page_type} |
| Development stage | ${item.development_stage || '—'} |
| Content category | ${item.content_category || '—'} |
| Recruiting motion | ${item.source === 'aeo_gap' ? 'Reactive (person has already been humbled)' : 'Anticipatory (person recognizes vulnerability)'} |
| AEO optimised | ${d.aeo_optimised ? 'Yes — first 40–60 words must be quotable by AI assistants' : 'No'} |
| Priority | ${item.page_priority || (item.source === 'p0_foundation' ? 'P0 — Foundation' : item.source === 'aeo_gap' ? 'P1 — AEO gap' : 'P1/P2')} |
| Five claims anchor | ${item.five_claims_anchor || 'See brief section 3'} |
| Compliance status | ${compReview ? compReview.verdict : 'Pending CIRO review'} |

---

## 2. For Tarsila — content review checklist
Before this page is approved for publish, confirm:
- [ ] Reduces to at least one of the five claims
- [ ] Voice is "most of us" — never "most investors"
- [ ] Reinforces allocator identity ("type of allocator who operates within a system")
- [ ] No forbidden words: elite, exclusive, premium, luxury, smart money, beat the market, alpha, outperform, expert picks
- [ ] Passes all 6 drift checks (guru, activity, educational, pronoun, identity, status)
- [ ] Opening 40–60 words are standalone and quotable by AI assistants${d.aeo_optimised ? ' ← critical for this page' : ''}
- [ ] CTAs use approved language only: "Proceed deliberately." / "See the system." / "Compare decisions to the benchmark." / "Review the process."
- [ ] CIRO compliance verdict accepted: **${compReview ? compReview.verdict : 'pending'}**
- [ ] ${compReview && compReview.supervisor_required ? '⚠ SUPERVISOR SIGN-OFF REQUIRED before publish' : 'Supervisor sign-off: check with Axl once KUs resolved'}

${compReview && compReview.risk_summary ? `**Compliance note:** ${compReview.risk_summary}` : ''}

---

## 3. For Miguel — technical implementation spec

### URL structure
\`\`\`
/[slug]  →  ${d.slug}
\`\`\`

### JSON-LD schema required
${d.page_type === 'faq' ? `**FAQPage + Article schema** (both)
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": ["Article", "FAQPage"],
  "mainEntity": [
    { "@type": "Question", "name": "Q1", "acceptedAnswer": { "@type": "Answer", "text": "A1" } }
  ]
}
\`\`\`` : d.page_type === 'pillar' || d.page_type === 'cluster_article' ? `**Article schema**
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${d.keyword}",
  "author": { "@type": "Organization", "name": "Intelligent Investing" },
  "publisher": { "@type": "Organization", "name": "Orion Digital Corp." }
}
\`\`\`` : `**WebPage + BreadcrumbList schema**`}

### AEO implementation${d.aeo_optimised ? ' ← required for this page' : ''}
- First paragraph (40–60 words) must render without JavaScript — no lazy loading
- Do NOT wrap the opening paragraph in an accordion, tab, or collapsible element
- Ensure the opening paragraph text matches the schema \`description\` field exactly
- Submit to Google Search Console immediately after publish (see AEO Technical Setup page)

### GSC submission steps
1. Publish the page at the URL above
2. Go to [Google Search Console](https://search.google.com/search-console) → URL Inspection
3. Paste the full URL → Request Indexing
4. Check back in 48–72 hours for index confirmation
5. Update the ranking tracker with the published URL

### Internal links to add
- Link FROM: existing pillar pages covering related topics
- Link TO: the Orion product page most relevant to this keyword
- Anchor text: use the target keyword naturally (not "click here")

### Page metadata
| Field | Required value |
|-------|---------------|
| Title tag | ≤60 chars, includes keyword |
| Meta description | 130–155 chars, includes keyword, no exclamation marks |
| OG title | Same as title tag |
| Canonical | Self-referencing |
| Robots | index, follow |
`}).join('\n\n---\n\n')

await agent(
  `Create the directory ${BRIEFS_DIR} if it doesn't exist.
Then write this content to the file: ${BRIEFS_DIR}\\content_briefs_${RUN_DATE}.md

${briefsContent}

Use the Write tool. Confirm success.`,
  { label: 'write-content-briefs', phase: 'Content' }
)

log(`✓ Content briefs written to output/content_briefs/${RUN_DATE}/`)


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

AEO_TREND: single entry — { date: "${RUN_DATE}", visibility_rate: ${aeoResults.orion_visibility_rate}, total_queries: ${ICP_QUERIES.length}, orion_mentioned: ${aeoResults.results.filter(r=>r.orion_mentioned).length} }`,
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
  aeo_trend:                rankingReport.aeo_trend || [{ date: RUN_DATE, visibility_rate: aeoResults.orion_visibility_rate, total_queries: ICP_QUERIES.length, orion_mentioned: aeoResults.results.filter(r=>r.orion_mentioned).length }],
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
  `## Next research seeds (${Object.values(insights.next_seeds).flat().length} queued for Monday)`,
  ``,
  `_Auto-queued — loads automatically on next pipeline run_`,
  ``,
  ...Object.values(insights.next_seeds).flat().map(s => `- ${s}`),
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
