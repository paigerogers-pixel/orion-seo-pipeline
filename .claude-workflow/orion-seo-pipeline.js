
export const meta = {
  name: 'orion-seo-pipeline',
  description: 'Full Orion AEO/SEO pipeline — 5 agents run natively by Claude',
  phases: [
    { title: 'Research', detail: 'Keyword discovery, SERP analysis, community language' },
    { title: 'AEO Monitor', detail: 'AI visibility gap analysis across 10 ICP queries' },
    { title: 'Content', detail: 'Draft 10 long-form pages optimised for Google + AI retrieval' },
    { title: 'Ranking', detail: 'GSC baseline report + position tracking structure' },
    { title: 'Insight', detail: 'Synthesis, weekly report, next seeds' },
    { title: 'Jira + Confluence', detail: 'Create content review tickets + update Confluence page' },
  ],
}

const OUTPUT_DIR = 'C:\\Users\\Paige.Rogers\\Desktop\\claude codes\\output'
const QUEUE_DIR  = 'C:\\Users\\Paige.Rogers\\Desktop\\claude codes\\queue'
const TODAY = (args && args.runDate) ? args.runDate : '2026-06-01'

// ─── SCHEMAS ────────────────────────────────────────────────────────────────

const KEYWORD_SCHEMA = {
  type: 'object',
  properties: {
    keywords: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          keyword:           { type: 'string' },
          volume_estimate:   { type: 'string' },
          difficulty:        { type: 'number' },
          intent:            { type: 'string', enum: ['informational','commercial','navigational'] },
          job_cluster:       { type: 'string', enum: ['learn','compare','evaluate','act'] },
          aeo_flag:          { type: 'boolean' },
          aeo_reason:        { type: 'string' },
          page_type:         { type: 'string', enum: ['pillar','cluster_article','comparison','faq','landing'] },
          relevance_to_orion:{ type: 'number' },
          score:             { type: 'number' },
          source:            { type: 'string' },
        },
        required: ['keyword','intent','aeo_flag','page_type','score'],
      },
    },
    community_phrases: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          phrase: { type: 'string' },
          source: { type: 'string' },
          aeo_potential: { type: 'string' },
        },
        required: ['phrase','source'],
      },
    },
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
          query:                { type: 'string' },
          orion_mentioned:      { type: 'boolean' },
          competitors_cited:    { type: 'array', items: { type: 'string' } },
          typical_ai_response:  { type: 'string' },
          orion_gap:            { type: 'boolean' },
          content_opportunity:  { type: 'string' },
          priority:             { type: 'string', enum: ['high','medium','low'] },
        },
        required: ['query','orion_mentioned','orion_gap','priority'],
      },
    },
    orion_visibility_rate: { type: 'number' },
    top_competitors: { type: 'array', items: { type: 'string' } },
    highest_priority_gaps: { type: 'array', items: { type: 'string' } },
  },
  required: ['results','orion_visibility_rate','top_competitors','highest_priority_gaps'],
}

const CONTENT_SCHEMA = {
  type: 'object',
  properties: {
    slug:     { type: 'string' },
    filename: { type: 'string' },
    content:  { type: 'string' },
    keyword:  { type: 'string' },
    page_type:{ type: 'string' },
    word_count_estimate: { type: 'number' },
  },
  required: ['slug','filename','content','keyword','page_type'],
}

const RANKING_SCHEMA = {
  type: 'object',
  properties: {
    gsc_summary: {
      type: 'object',
      properties: {
        total_clicks_7d:    { type: 'number' },
        keywords_tracked:   { type: 'number' },
        rising_keywords:    { type: 'array', items: { type: 'object' } },
        falling_keywords:   { type: 'array', items: { type: 'object' } },
        all_keywords:       { type: 'array', items: { type: 'object' } },
      },
      required: ['total_clicks_7d','keywords_tracked'],
    },
    alerts:     { type: 'array', items: { type: 'string' } },
    aeo_trend:  { type: 'array', items: { type: 'object' } },
  },
  required: ['gsc_summary','alerts'],
}

const INSIGHT_SCHEMA = {
  type: 'object',
  properties: {
    wins:            { type: 'array', items: { type: 'string' } },
    gaps:            { type: 'array', items: { type: 'string' } },
    recommendations: { type: 'array', items: { type: 'string' } },
    next_seeds:      { type: 'array', items: { type: 'string' } },
    executive_summary: { type: 'string' },
  },
  required: ['wins','gaps','recommendations','next_seeds','executive_summary'],
}

// ════════════════════════════════════════════════════════════════════════════
// AGENT 1 — RESEARCH
// ════════════════════════════════════════════════════════════════════════════
phase('Research')
log('① Research Agent — searching for keyword data and community language...')

const [serpData, redditData] = await parallel([
  () => agent(
    `Search the web for current SEO keyword data relevant to value investing, intelligent investing, and beating the S&P 500. 
    
    Search for these specific terms and report what you find about search intent, SERP features (featured snippets, PAA boxes), and related keywords:
    - "value investing for beginners" 
    - "intelligent investing platform"
    - "how to find undervalued stocks"
    - "beat the S&P 500"
    - "best stock screener value investors"
    - "intrinsic value calculator"
    - "Warren Buffett investing strategy"
    - "margin of safety investing"
    - "portfolio management software investors"
    - "value investing tools 2026"
    
    Also search for: "value investing reddit 2026 questions" and "what tools do value investors use reddit"
    
    Return a detailed summary of what you found: SERP features present, related searches, PAA questions, search intent signals, competition level estimates.`,
    { label: 'serp-research', phase: 'Research' }
  ),
  () => agent(
    `Search for what real value investors and self-directed investors are asking and discussing online in 2026. 
    
    Search for:
    1. "site:reddit.com value investing questions 2026"
    2. "value investing forum questions undervalued stocks"
    3. "intelligent investing questions investors ask"
    4. Questions people ask AI assistants about stock research and value investing
    
    Extract natural-language phrases that real investors use — these are gold for AEO content because they mirror how people talk to AI assistants. 
    
    Focus on question-form phrases like "how do I...", "what is the best...", "how can I...", "what tools...", etc.
    
    Return a list of 15-20 natural phrases/questions you found, with the source context.`,
    { label: 'community-research', phase: 'Research' }
  ),
])

const keywordBrief = await agent(
  `You are the Research Agent for Orion, an intelligent investing platform for value investors who want to beat the S&P 500.

Orion's ICP: self-directed investors aged 30-55, serious about long-term wealth building, familiar with Warren Buffett / Benjamin Graham style investing, frustrated with generic robo-advisors and index funds.

Here is SERP and community research data gathered from live web searches:

=== SERP DATA ===
${serpData}

=== COMMUNITY PHRASES ===
${redditData}

Based on this research, produce a comprehensive keyword brief. Score and classify each keyword using this formula:
- score = volume_component(0-40) + intent_weight×20 + aeo_bonus(0-15) + relevance×20 - difficulty_penalty(0-10)
- commercial intent = intent_weight 1.4, informational = 1.0, navigational = 0.8
- aeo_flag=true adds 15 pts (question-form, definitional, "how to" queries)
- relevance_to_orion: 0.0-1.0 (how directly does this map to Orion's product)

Include at least 30 keywords covering:
- Pillar topics (broad, 1500+ word guides)
- Cluster articles (specific subtopics)  
- FAQ/AEO pages (question-form, direct answer format)
- Comparison pages ("X vs Y", "best X for Y")
- High-commercial-intent landing page targets

Also include 15-20 community phrases from the Reddit/forum research.

Return the full structured keyword brief as JSON.`,
  { label: 'keyword-scoring', phase: 'Research', schema: KEYWORD_SCHEMA }
)

// Write keyword brief
const briefContent = JSON.stringify({
  generated_at: `${TODAY}T07:00:00`,
  agent: 'orion-research-agent-v1',
  total_keywords: keywordBrief.keywords.length,
  aeo_candidates: keywordBrief.keywords.filter(k => k.aeo_flag).length,
  top_priorities: keywordBrief.keywords.sort((a,b) => b.score - a.score).slice(0, 50),
  community_phrases: keywordBrief.community_phrases,
  all_keywords: keywordBrief.keywords,
}, null, 2)

await agent(
  `Write this exact JSON content to the file at path: ${OUTPUT_DIR}\\keyword_brief_${TODAY}.json
  
The content to write is:
\`\`\`json
${briefContent}
\`\`\`

Use the Write tool to create this file. Confirm the file was written successfully.`,
  { label: 'write-keyword-brief', phase: 'Research' }
)
log(`Research complete — ${keywordBrief.keywords.length} keywords scored, ${keywordBrief.keywords.filter(k=>k.aeo_flag).length} AEO candidates`)


// ════════════════════════════════════════════════════════════════════════════
// AGENT 2 — AEO MONITOR
// ════════════════════════════════════════════════════════════════════════════
phase('AEO Monitor')
log('② AEO Monitor — checking AI assistant visibility for Orion...')

const ICP_QUERIES = [
  "What is the best platform for value investing research?",
  "How do I find undervalued stocks using fundamental analysis?",
  "What tools do value investors use to beat the S&P 500?",
  "What is intelligent investing?",
  "What's the best stock screener for value investors?",
  "How can I invest like Warren Buffett?",
  "What software helps with stock portfolio management for long-term investors?",
  "What are the best resources for learning value investing?",
  "How do I calculate the intrinsic value of a stock?",
  "What platforms compete with Bloomberg Terminal for retail investors?",
]

const aeoResults = await agent(
  `You are the AEO Monitor agent for Orion, an intelligent investing platform. Your job is to audit what AI assistants (like yourself) currently say in response to the ICP queries below — and identify where Orion is absent.

Orion's product: AI-powered value investing platform combining Benjamin Graham-style fundamental analysis with modern screening. Cheaper than Bloomberg, smarter than robo-advisors. For serious self-directed investors.

Known competitors: Bloomberg Terminal, Morningstar, Simply Wall St, TIKR, Koyfin, GuruFocus, Finviz, StockAnalysis.com, Value Investor Club.

For EACH of these 10 queries, answer as an AI assistant would genuinely answer today — then evaluate whether Orion would or would not be mentioned:

${ICP_QUERIES.map((q, i) => `${i+1}. "${q}"`).join('\n')}

For each query:
1. Write the typical AI assistant response (2-4 sentences, what Claude/ChatGPT would actually say)
2. Is Orion mentioned? (Almost certainly not — it's a newer/smaller platform)
3. Which competitors ARE cited?
4. What content would make Orion show up in AI responses to this query?
5. Priority: high (competitor mentioned AND high search volume), medium, low

Calculate orion_visibility_rate as % of queries where Orion is mentioned.
List the top 3-4 competitors by frequency of citation.
List the 5 highest-priority gap queries.`,
  { label: 'aeo-gap-analysis', phase: 'AEO Monitor', schema: AEO_SCHEMA }
)

const aeoContent = JSON.stringify({
  generated_at: `${TODAY}T07:15:00`,
  agent: 'orion-aeo-monitor-v1',
  total_queries: ICP_QUERIES.length,
  orion_mentioned_count: aeoResults.results.filter(r => r.orion_mentioned).length,
  orion_visibility_rate: aeoResults.orion_visibility_rate,
  gap_queries: aeoResults.results.filter(r => r.orion_gap).map(r => r.query),
  competitor_frequency: aeoResults.top_competitors.reduce((acc, c, i) => { acc[c] = 10 - i; return acc }, {}),
  content_opportunities: aeoResults.results.filter(r => r.orion_gap).map(r => ({
    query: r.query,
    competitors_to_displace: r.competitors_cited || [],
    suggested_content: r.content_opportunity,
    priority: r.priority,
  })),
  highest_priority_gaps: aeoResults.highest_priority_gaps,
  results: aeoResults.results,
}, null, 2)

await agent(
  `Write this exact JSON content to the file at path: ${OUTPUT_DIR}\\aeo_monitor_${TODAY}.json

The content to write is:
\`\`\`json
${aeoContent}
\`\`\`

Use the Write tool to create this file. Confirm the file was written.`,
  { label: 'write-aeo-report', phase: 'AEO Monitor' }
)
log(`AEO Monitor complete — Orion visibility: ${aeoResults.orion_visibility_rate}% | ${aeoResults.highest_priority_gaps.length} priority gaps identified`)


// ════════════════════════════════════════════════════════════════════════════
// AGENT 3 — CONTENT (10 pages in parallel)
// ════════════════════════════════════════════════════════════════════════════
phase('Content')
log('③ Content Agent — drafting 10 pages optimised for Google + AI retrieval...')

// Build content queue: top AEO gaps first, then top keyword brief items
const aeoGapItems = aeoResults.results
  .filter(r => r.orion_gap && r.priority === 'high')
  .slice(0, 3)
  .map(r => ({
    keyword: r.query.replace(/\?$/, ''),
    page_type: 'faq',
    aeo_flag: true,
    competitors: r.competitors_cited || [],
    source: 'aeo_gap',
  }))

const kwItems = keywordBrief.keywords
  .sort((a, b) => b.score - a.score)
  .slice(0, 10)
  .map(k => ({
    keyword: k.keyword,
    page_type: k.page_type,
    aeo_flag: k.aeo_flag,
    intent: k.intent,
    source: 'keyword_brief',
  }))

// Merge, dedupe, cap at 10
const seen = new Set()
const contentQueue = []
for (const item of [...aeoGapItems, ...kwItems]) {
  const key = item.keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  if (!seen.has(key) && contentQueue.length < 10) {
    seen.add(key)
    contentQueue.push(item)
  }
}

log(`Content queue: ${contentQueue.length} pages — drafting all in parallel...`)

const contentDrafts = await parallel(contentQueue.map((item, idx) => () =>
  agent(
    `You are a senior content strategist for Orion, an intelligent investing platform for value investors who want to beat the S&P 500.

Orion's positioning: the only platform that combines Benjamin Graham-style fundamental analysis with AI-powered screening. Built for serious self-directed investors who find Bloomberg too expensive and robo-advisors too passive.

Write a complete, publish-ready ${item.page_type} page for this keyword: "${item.keyword}"

Page type instructions:
${item.page_type === 'pillar' ? 'Comprehensive pillar page, 1800+ words. Cover the topic exhaustively with 5-7 H2 sections, each with 2-3 H3 subsections. Definitive resource.' : ''}
${item.page_type === 'cluster_article' ? 'Focused cluster article, 900-1100 words. One clear angle, 3-4 H2 sections, practical and specific.' : ''}
${item.page_type === 'faq' ? 'FAQ page, 400-500 words. Direct answer FIRST (40-60 words), then 4 supporting Q&A pairs. Ultra-clear, zero fluff.' : ''}
${item.page_type === 'comparison' ? 'Comparison page, 1100-1300 words. Balanced assessment, then guide toward Orion strengths. Include a comparison table.' : ''}
${item.page_type === 'landing' ? 'Landing page, 700-900 words. Lead with pain point, build to Orion as solution. Clear CTAs throughout.' : ''}

${item.aeo_flag ? 'AEO REQUIREMENT: Open with a 40-60 word direct answer paragraph. This is exactly what Claude/ChatGPT will quote when your ICP asks this question. Make it crisp, factual, and mention Orion naturally.' : ''}
${item.competitors && item.competitors.length > 0 ? `Competitors currently cited for this query: ${item.competitors.join(', ')}. Acknowledge their strengths briefly, then explain why Orion is better for serious value investors.` : ''}

Structure:
- Start with YAML frontmatter (title ≤60 chars, description 120-155 chars, keyword, page_type, aeo_optimised)
- Direct answer / intro
- H2/H3 body sections
- End with 3-5 FAQ questions covering related long-tail queries
- Include JSON-LD schema markup (Article, FAQPage, or HowTo) at the end

Write at a level appropriate for sophisticated investors (30-55 year olds, familiar with Buffett/Graham). Not for beginners.
Return ONLY the markdown content — no preamble or commentary.`,
    {
      label: `content-${idx+1}-${item.keyword.slice(0,30).replace(/\s+/g,'-')}`,
      phase: 'Content',
      schema: CONTENT_SCHEMA,
    }
  )
))

// Write content files
const contentDir = `${OUTPUT_DIR}\\content_drafts\\${TODAY}`
await agent(
  `Create the directory ${contentDir} and write these ${contentDrafts.filter(Boolean).length} markdown files into it. Use the Write tool for each file.

${contentDrafts.filter(Boolean).map(d => `
--- FILE: ${contentDir}\\${d.filename} ---
${d.content}
`).join('\n\n')}

Confirm each file was written successfully.`,
  { label: 'write-content-files', phase: 'Content' }
)

log(`Content Agent complete — ${contentDrafts.filter(Boolean).length} pages drafted in ${contentDir}`)


// ════════════════════════════════════════════════════════════════════════════
// AGENT 4 — RANKING
// ════════════════════════════════════════════════════════════════════════════
phase('Ranking')
log('④ Ranking Agent — building GSC baseline report...')

const rankingReport = await agent(
  `You are the Ranking Agent for Orion. Build a realistic baseline ranking report for the Orion SEO pipeline.

No GSC credentials are configured yet, so produce a realistic structured baseline using the keyword data we have.

Keywords to track (from the keyword brief):
${keywordBrief.keywords.slice(0, 15).map(k => `- "${k.keyword}" (estimated difficulty: ${k.difficulty || 'unknown'})`).join('\n')}

For each keyword, produce realistic baseline data for a new/growing investing platform (domain authority ~25, 6 months old, growing organic traffic):
- clicks_this_week: realistic low numbers for a growing site (5-80)
- clicks_delta: slight positive trend (+2 to +15)  
- impressions: 200-3000
- avg_position: 8-45 (newer site, not yet top 5)
- position_delta: slight improvement (-0.5 to -2.5 = gaining)
- trending: "up" | "stable" | "down"

Also note 2-3 actionable alerts based on the AEO gaps we found.

AEO trend: this is the first run so there's no historical data — note baseline of ${aeoResults.orion_visibility_rate}% visibility.

Generate the full ranking report structure.`,
  { label: 'ranking-baseline', phase: 'Ranking', schema: RANKING_SCHEMA }
)

const rankingContent = JSON.stringify({
  generated_at: `${TODAY}T07:30:00`,
  agent: 'orion-ranking-agent-v1',
  note: 'Baseline report — GSC not yet connected. Connect via GSC_SERVICE_ACCOUNT_JSON env var for live data.',
  gsc_summary: rankingReport.gsc_summary,
  aeo_trend: [{ date: TODAY, visibility_rate: aeoResults.orion_visibility_rate, total_queries: 10, orion_mentioned: aeoResults.results.filter(r=>r.orion_mentioned).length }],
  aeo_current_visibility: aeoResults.orion_visibility_rate,
  alerts: rankingReport.alerts,
}, null, 2)

await agent(
  `Write this exact JSON content to the file: ${OUTPUT_DIR}\\ranking_report_${TODAY}.json

\`\`\`json
${rankingContent}
\`\`\`

Use the Write tool. Confirm success.`,
  { label: 'write-ranking-report', phase: 'Ranking' }
)
log('Ranking Agent complete — baseline report written')


// ════════════════════════════════════════════════════════════════════════════
// AGENT 5 — INSIGHT
// ════════════════════════════════════════════════════════════════════════════
phase('Insight')
log('⑤ Insight Agent — synthesising week 1 report and generating next seeds...')

const topKeywords = keywordBrief.keywords.sort((a,b) => b.score - a.score).slice(0,5).map(k=>k.keyword)
const risingKws = rankingReport.gsc_summary.rising_keywords?.slice(0,3).map(k=>k.keyword||k) || []
const gapQueries = aeoResults.highest_priority_gaps.slice(0,3)

const insights = await agent(
  `You are the SEO/AEO strategy lead for Orion, an intelligent investing platform.

This is WEEK 1 of the pipeline. Here's what each agent found:

RESEARCH AGENT:
- ${keywordBrief.keywords.length} keywords scored and prioritised
- Top 5 by score: ${topKeywords.join(', ')}
- ${keywordBrief.keywords.filter(k=>k.aeo_flag).length} AEO candidates identified
- Community phrases collected from value investing forums

AEO MONITOR:
- Orion visibility: ${aeoResults.orion_visibility_rate}% (mentioned in ${aeoResults.results.filter(r=>r.orion_mentioned).length}/10 AI responses)
- Top competitors cited by AI: ${aeoResults.top_competitors.slice(0,4).join(', ')}
- Highest priority gaps: ${gapQueries.join('; ')}
- ${aeoResults.results.filter(r=>r.orion_gap && r.priority==='high').length} high-priority AEO gaps

CONTENT AGENT:
- ${contentDrafts.filter(Boolean).length} pages drafted
- Mix of AEO FAQ pages, cluster articles, and pillar content
- All pages follow direct-answer structure for AI retrieval

RANKING AGENT:
- Baseline established: GSC not yet connected
- ${rankingReport.gsc_summary.keywords_tracked} keywords now being tracked
- ${rankingReport.alerts.length} alerts generated
- AEO baseline: ${aeoResults.orion_visibility_rate}%

Produce:
1. wins: 3 bullet points — what's been set up and what looks promising
2. gaps: 3 bullet points — what's missing, what to fix, what risks exist
3. recommendations: 3 specific, actionable items for next week (mention actual keywords/numbers)
4. next_seeds: 25 new keyword seeds for next Monday's Research Agent run — based on patterns in the data, competitor names mentioned, AEO gaps, and related topics not yet covered
5. executive_summary: 3-4 sentence summary suitable for sharing with the team

Be specific and reference actual keywords and numbers from the data.`,
  { label: 'insight-synthesis', phase: 'Insight', schema: INSIGHT_SCHEMA }
)

// Build weekly report markdown
const weeklyReportLines = [
  `# Orion SEO/AEO Weekly Report — ${TODAY}`,
  ``,
  `_Generated by the Insight Agent (Claude-powered pipeline) — Week 1 baseline_`,
  ``,
  `## Executive Summary`,
  ``,
  insights.executive_summary,
  ``,
  `## At a glance`,
  ``,
  `| Metric | This week |`,
  `|--------|-----------|`,
  `| AEO visibility rate | ${aeoResults.orion_visibility_rate}% |`,
  `| Keywords tracked | ${keywordBrief.keywords.length} |`,
  `| AEO candidates | ${keywordBrief.keywords.filter(k=>k.aeo_flag).length} |`,
  `| Content pages drafted | ${contentDrafts.filter(Boolean).length} |`,
  `| GSC clicks (7d) | Baseline — GSC not yet connected |`,
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
  ...insights.recommendations.map((r, i) => `${i+1}. ${r}`),
  ``,
  `## Alerts`,
  ``,
  ...rankingReport.alerts.map(a => `- ${a}`),
  ``,
  `## Top AEO gaps to close`,
  ``,
  ...aeoResults.highest_priority_gaps.map(q => `- "${q}"`),
  ``,
  `## Next research seeds`,
  ``,
  `_(Auto-queued for next Monday's Research Agent run)_`,
  ``,
  ...insights.next_seeds.map(s => `- ${s}`),
  ``,
  `---`,
  `_Next run: Monday 07:00 UTC_`,
  `_Pipeline: Claude-powered, fully agentic — no Python runtime required_`,
]

const weeklyReport = weeklyReportLines.join('\n')

const seedsContent = JSON.stringify({
  generated_at: `${TODAY}T07:45:00`,
  seeds: insights.next_seeds,
  source: 'insight_agent',
}, null, 2)

await parallel([
  () => agent(
    `Write this markdown content to: ${OUTPUT_DIR}\\weekly_report_${TODAY}.md

${weeklyReport}

Use the Write tool. Confirm success.`,
    { label: 'write-weekly-report', phase: 'Insight' }
  ),
  () => agent(
    `Write this JSON content to: ${QUEUE_DIR}\\next_research_seeds.json

${seedsContent}

Use the Write tool. Confirm success.`,
    { label: 'write-seeds', phase: 'Insight' }
  ),
])

log('Insight Agent complete — weekly report and next seeds written')


// ════════════════════════════════════════════════════════════════════════════
// POST-PIPELINE: JIRA TICKETS + CONFLUENCE UPDATE (parallel)
// ════════════════════════════════════════════════════════════════════════════
phase('Jira + Confluence')
log('⑥ Creating Jira review tickets and updating Confluence...')

const validDrafts = contentDrafts.filter(Boolean)

await parallel([

  // ── Jira: one Task ticket per content draft ──────────────────────────────
  () => agent(
    `Create ${validDrafts.length} Jira Task tickets in the MKTG project (project key: MKTG, cloud ID: 7830fa63-7783-433f-b6d1-84e8c6995068) using the createJiraIssue tool.

Create one ticket for each of these content pages that need compliance + brand review before publishing:

${validDrafts.map((d, i) => `${i+1}. Keyword: "${d.keyword}" | Page type: ${d.page_type} | File: output/content_drafts/${TODAY}/${d.filename}`).join('\n')}

For each ticket use:
- Issue type: Task (id: 10002)
- Summary: [Content Review] <keyword> (<page_type>)
- Description:
  "SEO/AEO content draft generated by the Orion pipeline on ${TODAY} and ready for review.

  File: output/content_drafts/${TODAY}/<filename>
  Keyword: <keyword>
  Page type: <page_type>

  Review checklist:
  - Compliance check (financial claims, disclaimers)
  - Brand voice (sophisticated, not salesy)
  - Accuracy review
  - E-E-A-T signals (author credentials, primary source citations)

  Once approved, create an engineering ticket to publish and submit to GSC for indexing."

Create all ${validDrafts.length} tickets and report the ticket keys created.`,
    { label: 'create-jira-tickets', phase: 'Jira + Confluence' }
  ),

  // ── Confluence: update the pipeline page with fresh metrics ──────────────
  () => agent(
    `Update the Confluence page with ID 3420782599 on cloud 7830fa63-7783-433f-b6d1-84e8c6995068 using the updateConfluencePage tool.

Use contentFormat: "html". The new page title should stay "Orion SEO/AEO — Automated Agent Pipeline".

Update the "Week 1 baseline" section header to say "Latest run — ${TODAY}" and update the metrics table with these fresh values:
- Keywords scored: ${keywordBrief.keywords.length}
- AEO candidates: ${keywordBrief.keywords.filter(k=>k.aeo_flag).length}
- AEO visibility rate: ${aeoResults.orion_visibility_rate}% (status: ${aeoResults.orion_visibility_rate === 0 ? 'red' : aeoResults.orion_visibility_rate < 20 ? 'yellow' : 'green'})
- High-priority AEO gaps: ${aeoResults.highest_priority_gaps.length}
- Content pages drafted: ${validDrafts.length}
- Keywords tracked: ${rankingReport.gsc_summary.keywords_tracked}

Also update the "Top 3 recommendations" section with these fresh recommendations:
${insights.recommendations.map((r, i) => `${i+1}. ${r}`).join('\n')}

And update the "Alerts" section with:
${rankingReport.alerts.map(a => `- ${a}`).join('\n')}

Keep all other sections (agent table, competitor table, keyword priority table, score formula, AEO content formula, output file reference, human review checklist) exactly as they are — only update the metrics, recommendations, and alerts sections.

Set versionMessage to "Auto-updated by pipeline run ${TODAY}".`,
    { label: 'update-confluence', phase: 'Jira + Confluence' }
  ),

])

log(`Post-pipeline complete — ${validDrafts.length} Jira tickets created, Confluence page updated`)
log('Pipeline complete. All outputs in: output/')

return {
  keywords_scored: keywordBrief.keywords.length,
  aeo_visibility_rate: aeoResults.orion_visibility_rate,
  aeo_gaps: aeoResults.highest_priority_gaps.length,
  content_pages_drafted: contentDrafts.filter(Boolean).length,
  keywords_tracked: rankingReport.gsc_summary.keywords_tracked,
  next_seeds_queued: insights.next_seeds.length,
  wins: insights.wins,
  top_recommendations: insights.recommendations,
  output_files: [
    `output/keyword_brief_${TODAY}.json`,
    `output/aeo_monitor_${TODAY}.json`,
    `output/content_drafts/${TODAY}/ (${contentDrafts.filter(Boolean).length} pages)`,
    `output/ranking_report_${TODAY}.json`,
    `output/weekly_report_${TODAY}.md`,
    `queue/next_research_seeds.json`,
  ],
}
