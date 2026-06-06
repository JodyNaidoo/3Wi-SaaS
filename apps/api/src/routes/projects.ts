import { Router } from 'express';
import { z } from 'zod';
import { prisma, withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';

export const projectsRouter = Router();
projectsRouter.use(requireAuth);

projectsRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const projects = await withTenant(req.user!.tenantId, (tx) =>
      tx.project.findMany({ where: { tenantId: req.user!.tenantId }, orderBy: { createdAt: 'desc' } }),
    );
    res.json({ projects });
  } catch (e) {
    next(e);
  }
});

const createProjectSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(64),
  description: z.string().optional(),
  tagline: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  totalBudget: z.number().positive(),
  funder: z.string().min(2),
  moaReference: z.string().optional(),
});

projectsRouter.post('/', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const body = createProjectSchema.parse(req.body);
    const created = await withTenant(req.user!.tenantId, (tx) =>
      tx.project.create({
        data: {
          tenantId: req.user!.tenantId,
          name: body.name,
          code: body.code,
          description: body.description,
          tagline: body.tagline,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          totalBudget: body.totalBudget,
          funder: body.funder,
          moaReference: body.moaReference,
        },
      }),
    );
    res.json({ project: created });
  } catch (e) {
    next(e);
  }
});

projectsRouter.get('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const project = await withTenant(req.user!.tenantId, (tx) =>
      tx.project.findFirst({
        where: { id: req.params.id, tenantId: req.user!.tenantId },
        include: {
          workstreams: { orderBy: { sortOrder: 'asc' } },
          milestones: { orderBy: { code: 'asc' } },
          risks: { orderBy: { code: 'asc' } },
        },
      }),
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (e) {
    next(e);
  }
});

projectsRouter.get('/:id/dashboard', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const data = await withTenant(tid, async (tx) => {
      const project = await tx.project.findFirst({ where: { id: req.params.id, tenantId: tid } });
      if (!project) return null;
      const [workstreams, milestones, risks, helpOpen, photoQueue, reportsThisMonth] = await Promise.all([
        tx.workstream.findMany({ where: { projectId: project.id } }),
        tx.milestone.findMany({ where: { projectId: project.id } }),
        tx.risk.findMany({ where: { projectId: project.id } }),
        tx.helpRequest.count({ where: { projectId: project.id, status: 'open' } }),
        tx.photoUpload.count({ where: { projectId: project.id, reviewed: false } }),
        tx.report.count({
          where: {
            projectId: project.id,
            createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          },
        }),
      ]);
      return { project, workstreams, milestones, risks, helpOpen, photoQueue, reportsThisMonth };
    });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

const workstreamsSchema = z.object({
  workstreams: z
    .array(
      z.object({
        code: z.string(),
        name: z.string(),
        budget: z.number().nonnegative(),
        leadRole: z.string(),
        colour: z.string().optional(),
        icon: z.string().optional(),
      }),
    )
    .max(10),
});

projectsRouter.post('/:id/workstreams', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const body = workstreamsSchema.parse(req.body);
    const out = await withTenant(req.user!.tenantId, async (tx) => {
      const project = await tx.project.findFirstOrThrow({
        where: { id: req.params.id, tenantId: req.user!.tenantId },
      });
      const sum = body.workstreams.reduce((s, w) => s + w.budget, 0);
      if (sum > Number(project.totalBudget)) throw new Error('Workstream budget sum exceeds project total');
      await tx.workstream.deleteMany({ where: { projectId: project.id } });
      const created = await tx.workstream.createManyAndReturn({
        data: body.workstreams.map((w, i) => ({ ...w, projectId: project.id, sortOrder: i })),
      });
      return created;
    });
    res.json({ workstreams: out });
  } catch (e) {
    next(e);
  }
});

projectsRouter.post('/:id/onboarding/finish', requireRole('director'), async (_req, res) => {
  res.json({ ok: true });
});

void prisma;
