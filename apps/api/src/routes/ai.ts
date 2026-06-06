import { Router } from 'express';
import { z } from 'zod';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { aiRateLimit } from '../middleware/rateLimit.js';
import { streamCompletion, DEFAULT_PROMPTS } from '../services/claude.js';

export const aiRouter = Router();
aiRouter.use(requireAuth);

const SKILLS = ['monthly_ops','risk_update','mov_pack','quarterly_report','stakeholder_comms'] as const;
type Skill = typeof SKILLS[number];

aiRouter.get('/prompts/:skill', async (req: AuthedRequest, res, next) => {
  try {
    const skill = req.params.skill as Skill;
    if (!SKILLS.includes(skill)) return res.status(400).json({ error: 'Unknown skill' });
    const projectId = (req.query.projectId as string | undefined) ?? null;
    const tenantId = req.user!.tenantId;

    const stored = await withTenant(tenantId, (tx) =>
      tx.aiPrompt.findFirst({ where: { tenantId, projectId, skillType: skill } }),
    );

    res.json({
      skill,
      systemPrompt: stored?.systemPrompt ?? DEFAULT_PROMPTS[skill],
      isCustom: Boolean(stored),
    });
  } catch (e) { next(e); }
});

const updatePromptSchema = z.object({
  systemPrompt: z.string().min(20),
  projectId: z.string().uuid().optional(),
});

aiRouter.put('/prompts/:skill', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const skill = req.params.skill as Skill;
    if (!SKILLS.includes(skill)) return res.status(400).json({ error: 'Unknown skill' });
    const body = updatePromptSchema.parse(req.body);
    const tenantId = req.user!.tenantId;
    const out = await withTenant(tenantId, (tx) =>
      tx.aiPrompt.upsert({
        where: {
          tenantId_projectId_skillType: {
            tenantId,
            projectId: body.projectId ?? null,
            skillType: skill,
          } as any,
        },
        create: {
          tenantId,
          projectId: body.projectId,
          skillType: skill,
          systemPrompt: body.systemPrompt,
          updatedById: req.user!.id,
        },
        update: { systemPrompt: body.systemPrompt, updatedById: req.user!.id },
      }),
    );
    res.json({ prompt: out });
  } catch (e) { next(e); }
});

const generateSchema = z.object({
  skill: z.enum(SKILLS),
  projectId: z.string().uuid(),
  input: z.string().min(2),
});

aiRouter.post('/generate', aiRateLimit, async (req: AuthedRequest, res, next) => {
  try {
    const body = generateSchema.parse(req.body);
    const tenantId = req.user!.tenantId;
    const stored = await withTenant(tenantId, (tx) =>
      tx.aiPrompt.findFirst({
        where: { tenantId, OR: [{ projectId: body.projectId }, { projectId: null }], skillType: body.skill },
        orderBy: { projectId: 'desc' },
      }),
    );
    const systemPrompt = stored?.systemPrompt ?? DEFAULT_PROMPTS[body.skill];

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    let final = '';
    for await (const chunk of streamCompletion({ systemPrompt, userInput: body.input })) {
      if (chunk.type === 'token') {
        res.write(`data: ${JSON.stringify({ token: chunk.text })}\n\n`);
      } else if (chunk.type === 'done') {
        final = chunk.text ?? '';
      } else if (chunk.type === 'error') {
        res.write(`data: ${JSON.stringify({ error: chunk.error })}\n\n`);
      }
    }

    const saved = await withTenant(tenantId, (tx) =>
      tx.report.create({
        data: {
          tenantId,
          projectId: body.projectId,
          reportType: body.skill,
          generatedBy: req.user!.id,
          promptUsed: systemPrompt,
          inputText: body.input,
          content: final,
          status: 'draft',
        },
      }),
    );

    res.write(`data: ${JSON.stringify({ done: true, reportId: saved.id })}\n\n`);
    res.end();
  } catch (e) { next(e); }
});

aiRouter.get('/reports', async (req: AuthedRequest, res, next) => {
  try {
    const projectId = (req.query.projectId as string | undefined) ?? undefined;
    const reports = await withTenant(req.user!.tenantId, (tx) =>
      tx.report.findMany({
        where: { tenantId: req.user!.tenantId, ...(projectId ? { projectId } : {}) },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    );
    res.json({ reports });
  } catch (e) { next(e); }
});
