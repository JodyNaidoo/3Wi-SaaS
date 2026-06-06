/**
 * Portfolio of Evidence — submissions API.
 *
 * Routes:
 *   POST   /poe-submissions/start          - new submission (from HTML form or SaaS UI)
 *   GET    /poe-submissions                - list with filters (status, module, cohort, candidate)
 *   GET    /poe-submissions/:id            - single submission detail
 *   GET    /poe-submissions/dashboard      - aggregated matrix for the Training Dashboard
 *   PATCH  /poe-submissions/:id/verify     - per-evidence verification (assessor)
 *   PATCH  /poe-submissions/:id/decision   - final competence decision + sign-off
 *
 * Auth: requireAuth. Submissions can be created by any authed role.
 * Decisions restricted to director or future 'assessor' role.
 *
 * Tenant isolation: all queries wrap in withTenant() so RLS bites.
 */

import { Router } from 'express';
import { z } from 'zod';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';

export const poeRouter = Router();
poeRouter.use(requireAuth);

const StartBody = z.object({
  // Candidate
  candidateName: z.string().min(2),
  candidateIdNumber: z.string().optional(),
  cohort: z.string().min(1),
  district: z.string().optional(),
  farmName: z.string().optional(),
  candidatePhone: z.string().optional(),
  candidateEmail: z.string().email().optional().or(z.literal('')),
  learnerReference: z.string().optional(),
  growerId: z.string().uuid().optional(),

  // Module
  moduleId: z.string().min(1),
  moduleTitle: z.string().min(1),
  moduleUsId: z.string().optional(),
  moduleNqfLevel: z.number().int().optional(),
  moduleCredits: z.number().int().optional(),

  // Whole form payload (the snapshot from the HTML form)
  evidencePayload: z.record(z.string(), z.any()),

  // Optional initial outcome (form may include partial assessor data)
  totalScore: z.number().optional(),
  decision: z.string().optional(),
  assessorFeedback: z.string().optional(),
  requiredActions: z.string().optional(),
  coordinatorName: z.string().optional(),
  coordinatorRole: z.string().optional(),
  coordinatorDate: z.string().optional(),

  poeRef: z.string().optional(),
});

function genPoeRef(): string {
  const year = new Date().getFullYear();
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `ECRDA/POE/${n}/${year}`;
}

// ───────────────────────────────────────────── POST /start
poeRouter.post('/start', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const body = StartBody.parse(req.body);

    const created = await withTenant(tid, (tx) =>
      tx.poeSubmission.create({
        data: {
          tenantId: tid,
          candidateName: body.candidateName,
          candidateIdNumber: body.candidateIdNumber ?? null,
          cohort: body.cohort,
          district: body.district ?? null,
          farmName: body.farmName ?? null,
          candidatePhone: body.candidatePhone ?? null,
          candidateEmail: body.candidateEmail || null,
          learnerReference: body.learnerReference ?? null,
          growerId: body.growerId ?? null,

          moduleId: body.moduleId,
          moduleTitle: body.moduleTitle,
          moduleUsId: body.moduleUsId ?? null,
          moduleNqfLevel: body.moduleNqfLevel ?? null,
          moduleCredits: body.moduleCredits ?? null,

          evidencePayload: body.evidencePayload as any,

          totalScore: body.totalScore != null ? (body.totalScore as any) : null,
          decision: body.decision ?? null,
          assessorFeedback: body.assessorFeedback ?? null,
          requiredActions: body.requiredActions ?? null,

          coordinatorName: body.coordinatorName ?? null,
          coordinatorRole: body.coordinatorRole ?? null,
          coordinatorDate: body.coordinatorDate ? new Date(body.coordinatorDate) : null,

          poeRef: body.poeRef ?? genPoeRef(),
          createdByUserId: req.user!.id,
        },
      }),
    );

    res.status(201).json({
      submission: created,
      nextStep: 'Your PoE has been received. An assessor will review the evidence and a competence decision will be issued within 10 working days.',
    });
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── GET / (list)
poeRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const status     = typeof req.query.status     === 'string' ? req.query.status     : undefined;
    const moduleId   = typeof req.query.moduleId   === 'string' ? req.query.moduleId   : undefined;
    const cohort     = typeof req.query.cohort     === 'string' ? req.query.cohort     : undefined;
    const candidate  = typeof req.query.candidate  === 'string' ? req.query.candidate  : undefined;

    const items = await withTenant(tid, (tx) =>
      tx.poeSubmission.findMany({
        where: {
          ...(status     ? { status: status as any } : {}),
          ...(moduleId   ? { moduleId } : {}),
          ...(cohort     ? { cohort } : {}),
          ...(candidate  ? { candidateName: { contains: candidate, mode: 'insensitive' } } : {}),
        },
        orderBy: { submittedAt: 'desc' },
      }),
    );

    res.json({ submissions: items, count: items.length });
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── GET /dashboard
// Returns aggregated matrix data for the Training Dashboard.
poeRouter.get('/dashboard', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const cohort = typeof req.query.cohort === 'string' ? req.query.cohort : undefined;

    const all = await withTenant(tid, (tx) =>
      tx.poeSubmission.findMany({
        where: { ...(cohort ? { cohort } : {}) },
        orderBy: { submittedAt: 'desc' },
        select: {
          id: true, candidateName: true, cohort: true, district: true,
          moduleId: true, status: true, decision: true,
          moduleCredits: true, submittedAt: true,
        },
      }),
    );

    // Group: per candidate × module → latest submission status
    const byCandidate = new Map<string, {
      candidateName: string; cohort: string; district: string | null;
      status: Record<string, string>;
    }>();

    for (const s of all) {
      const key = `${s.cohort}::${s.candidateName}`;
      if (!byCandidate.has(key)) {
        byCandidate.set(key, {
          candidateName: s.candidateName,
          cohort: s.cohort,
          district: s.district,
          status: {},
        });
      }
      const entry = byCandidate.get(key)!;
      if (!entry.status[s.moduleId]) {
        entry.status[s.moduleId] = s.status; // first encountered (newest, due to desc order)
      }
    }

    const cohorts = Array.from(new Set(all.map(s => s.cohort)));
    res.json({
      learners: Array.from(byCandidate.values()),
      cohorts,
      submissionCount: all.length,
    });
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── GET /:id
poeRouter.get('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const item = await withTenant(tid, (tx) =>
      tx.poeSubmission.findFirst({ where: { id: req.params.id, tenantId: tid } }),
    );
    if (!item) return res.status(404).json({ error: 'PoE submission not found' });
    res.json({ submission: item });
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── PATCH /:id/verify (assessor sets per-evidence)
const VerifyBody = z.object({
  totalScore: z.number().min(0).max(100),
  status: z.enum(['under_verification', 'competent', 'not_yet_competent', 're_assess', 'deferred']),
  evidenceUpdates: z.record(z.string(), z.any()).optional(), // patch into evidencePayload
});

poeRouter.patch('/:id/verify', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const id = req.params.id;
    const patch = VerifyBody.parse(req.body);

    const existing = await withTenant(tid, (tx) =>
      tx.poeSubmission.findFirst({ where: { id, tenantId: tid } }),
    );
    if (!existing) return res.status(404).json({ error: 'Not found' });

    const mergedPayload = patch.evidenceUpdates
      ? { ...(existing.evidencePayload as any), ...patch.evidenceUpdates }
      : existing.evidencePayload;

    const updated = await withTenant(tid, (tx) =>
      tx.poeSubmission.update({
        where: { id },
        data: {
          totalScore: patch.totalScore as any,
          status: patch.status as any,
          evidencePayload: mergedPayload,
          verifiedAt: new Date(),
        },
      }),
    );
    res.json({ submission: updated });
  } catch (e) { next(e); }
});

// ───────────────────────────────────────────── PATCH /:id/decision
const DecisionBody = z.object({
  decision: z.string(),
  assessorFeedback: z.string().optional(),
  requiredActions: z.string().optional(),
  assessorName: z.string().optional(),
  assessorReg: z.string().optional(),
  internalModeratorName: z.string().optional(),
  externalModeratorName: z.string().optional(),
  status: z.enum(['competent', 'not_yet_competent', 're_assess', 'deferred']),
});

poeRouter.patch('/:id/decision', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const id = req.params.id;
    const patch = DecisionBody.parse(req.body);

    const updated = await withTenant(tid, (tx) =>
      tx.poeSubmission.update({
        where: { id },
        data: {
          decision: patch.decision,
          assessorFeedback: patch.assessorFeedback ?? undefined,
          requiredActions: patch.requiredActions ?? undefined,
          assessorName: patch.assessorName ?? undefined,
          assessorReg: patch.assessorReg ?? undefined,
          internalModeratorName: patch.internalModeratorName ?? undefined,
          externalModeratorName: patch.externalModeratorName ?? undefined,
          status: patch.status as any,
          decidedAt: new Date(),
          assessorDate: new Date(),
        },
      }),
    );
    res.json({ submission: updated });
  } catch (e) { next(e); }
});
