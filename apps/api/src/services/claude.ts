import Anthropic from '@anthropic-ai/sdk';
import { isMock } from './mocks/mode.js';
import { pickFixture } from './mocks/claude-fixtures.js';

// Lazily construct the client so the API key absence doesn't blow up startup.
let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' });
  }
  return _client;
}

const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514';

let mockBannerLogged = false;
function logMockBannerOnce() {
  if (mockBannerLogged) return;
  mockBannerLogged = true;
  // eslint-disable-next-line no-console
  console.log('[3Wi MOCK] Claude streaming returns deterministic fixtures (no Anthropic API call).');
}

export interface StreamChunk {
  type: 'token' | 'done' | 'error';
  text?: string;
  error?: string;
}

/**
 * Stream a Claude completion. Yields incremental text tokens followed by a `done` chunk.
 *
 * In mock mode, picks a fixture by sniffing the system prompt and emits it
 * word-by-word with a small setTimeout so the UI streaming UX is identical.
 */
export async function* streamCompletion(opts: {
  systemPrompt: string;
  userInput: string;
  maxTokens?: number;
}): AsyncGenerator<StreamChunk> {
  if (isMock('claude')) {
    logMockBannerOnce();
    yield* mockStream(opts.systemPrompt);
    return;
  }

  try {
    const stream = await client().messages.stream({
      model: MODEL,
      max_tokens: opts.maxTokens ?? 4096,
      system: opts.systemPrompt,
      messages: [{ role: 'user', content: opts.userInput }],
    });

    let collected = '';
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        collected += event.delta.text;
        yield { type: 'token', text: event.delta.text };
      }
    }
    yield { type: 'done', text: collected };
  } catch (err) {
    yield { type: 'error', error: (err as Error).message };
  }
}

/**
 * Pace a fixture out as token-shaped chunks so the SSE/streaming consumer
 * behaves identically to the live path.
 */
async function* mockStream(systemPrompt: string): AsyncGenerator<StreamChunk> {
  const fixture = pickFixture(systemPrompt);
  // Split on whitespace boundaries but keep them so we reconstruct the text exactly.
  const tokens = fixture.match(/\S+\s*|\s+/g) ?? [fixture];
  const delayMs = Number(process.env.MOCK_STREAM_DELAY_MS ?? 12);
  let collected = '';
  for (const t of tokens) {
    collected += t;
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
    yield { type: 'token', text: t };
  }
  yield { type: 'done', text: collected };
}

/**
 * Default system prompts for each AI skill. Tenants can override by writing into
 * the ai_prompts table. The tenant-edited row takes precedence over these defaults.
 */
export const DEFAULT_PROMPTS: Record<string, string> = {
  monthly_ops: `You are a senior PMO reporting assistant for government-funded programmes.
Produce a Monthly Operations Report ready for funder submission. Sections (in order):
1. Header (project, period, MOA, prepared by, date)
2. Overall RAG with 1-sentence rationale
3. Workstream RAG table (code, name, budget, YTD spend, RAG, key activity)
4. Disbursement status (1 paragraph)
5. Stage-gate progress (1 paragraph)
6. Farmer & compliance update (1 paragraph)
7. Top 3 risks (table)
8. PFMA compliance checklist (4 ticks)
9. Next month priorities (3 bullets, each with owner + deadline)
Tone: factual, board-level, confident. No hedging. Use rands. Output Markdown.`,

  risk_update: `You are a PMO risk officer. Produce a full risk register update.
Include: executive summary, full register table (code/risk/likelihood/impact/RAG/control/owner/PFMA),
risks changed this period, and escalations required. Mark all PFMA zero-tolerance risks (fraud,
corruption, irregular expenditure, compliance breach) with a permanent red flag. Output Markdown.`,

  mov_pack: `You are producing a Means of Verification (MoV) Evidence Pack for a funder
disbursement decision. Sections: 3-sentence MoV summary, gate evidence status table,
KPI verification table, financial verification table, NCR log, PFMA compliance evidence,
numbered evidence artefacts list, recommendation paragraph, next gate requirements.
Tone: forensic, defensible, audit-ready. Output Markdown.`,

  quarterly_report: `You are preparing a Quarterly PSC Report for the Project Steering Committee
and primary funder. Sections: 5-sentence executive summary, MOA KPI scorecard table,
workstream progress (one paragraph per workstream), financial report with budget vs actual,
stage-gate status per cycle, top 5 risks, PFMA compliance statement signed by PM and Finance Manager,
stakeholder engagement paragraph, next quarter plan, declaration block. Output Markdown.`,

  stakeholder_comms: `You are the project's communication lead. Produce a stakeholder
communication appropriate to the recipient's role (funder, farmer, offtaker, regulator).
Use the project's brand voice. Include subject line, salutation, body paragraphs, clear call to
action, attachments list, sign-off block. Tone matches recipient - formal for regulator, plain
language for farmer, commercial for offtaker. Output Markdown.`,
};
