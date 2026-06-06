/**
 * Offtaker submissions API.
 *
 * Routes:
 *   POST   /offtaker-submissions/start          - new submission (from HTML form)
 *   GET    /offtaker-submissions                - list with filters
 *   GET    /offtaker-submissions/:id            - single submission detail
 *   GET    /offtaker-submissions/dashboard      - aggregated stats for dashboard
 *   PATCH  /offtaker-submissions/:id/screening  - 6-point screening scorecard
 *   PATCH  /offtaker-submissions/:id/decision   - final decision + approval chain
 */

import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import {
  uploadOfftakerAttachment,
  offtakerAttachmentSignedUrl,
  deleteOfftakerAttachment,
} from '../services/supabase.js';

export const offtakerRouter = Router();
offtakerRouter.use(requireAuth);

// Multer config for Annexure A attachments
const attachmentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB per file (matches Supabase bucket config)
});

const StartBody = z.object({
  legalName: z.string().min(2),
  tradingName: z.string().optional(),
  registrationNumber: z.string().optional(),
  legalEntityType: z.string().optional(),
  primaryContactName: z.string().optional(),
  primaryContactEmail: z.string().email(),
  primaryContactPhone: z.string().optional(),
  bbbeeLevel: z.string().optional(),
  offtakerCategory: z.string().optional(),
  targetDistricts: z.array(z.string()).optional(),
  productCategories: z.array(z.string()).optional(),
  preferredFarmerTypes: z.array(z.string()).optional(),
  totalHectaresCapacity: z.number().optional(),
  estimatedFarmers: z.number().int().optional(),
  formPayload: z.record(z.string(), z.any()),
  submissionRef: z.string().optional(),
});

function genRef(): string {
  const year = new Date().getFullYear();
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `ECRDA/HEMP/${n}/${year}`;
}

// ───────────────────────────────── POST /start
offtakerRouter.post('/start', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const body = StartBody.parse(req.body);

    const created = await withTenant(tid, (tx) =>
      tx.offtakerSubmission.create({
        data: {
          tenantId: tid,
          legalName: body.legalName,
          tradingName: body.tradingName ?? null,
          registrationNumber: body.registrationNumber ?? null,
          legalEntityType: body.legalEntityType ?? null,
          primaryContactName: body.primaryContactName ?? null,
          primaryContactEmail: body.primaryContactEmail,
          primaryContactPhone: body.primaryContactPhone ?? null,
          bbbeeLevel: body.bbbeeLevel ?? null,
          offtakerCategory: body.offtakerCategory ?? null,
          targetDistricts: body.targetDistricts ?? [],
          productCategories: body.productCategories ?? [],
          preferredFarmerTypes: body.preferredFarmerTypes ?? [],
          totalHectaresCapacity: body.totalHectaresCapacity != null ? (body.totalHectaresCapacity as any) : null,
          estimatedFarmers: body.estimatedFarmers ?? null,
          formPayload: body.formPayload as any,
          submissionRef: body.submissionRef ?? genRef(),
          createdByUserId: req.user!.id,
        },
      }),
    );

    res.status(201).json({
      submission: created,
      nextStep: 'Your submission has been received. ECRDA will complete the 6-point initial screening within 10 business days and follow up with next steps.',
    });
  } catch (e) { next(e); }
});

// ───────────────────────────────── GET / (list)
offtakerRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;

    const items = await withTenant(tid, (tx) =>
      tx.offtakerSubmission.findMany({
        where: {
          ...(status   ? { status: status as any } : {}),
          ...(category ? { offtakerCategory: category } : {}),
        },
        orderBy: { submittedAt: 'desc' },
      }),
    );

    res.json({ submissions: items, count: items.length });
  } catch (e) { next(e); }
});

// ───────────────────────────────── GET /dashboard (aggregated)
offtakerRouter.get('/dashboard', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;

    const all = await withTenant(tid, (tx) =>
      tx.offtakerSubmission.findMany({
        select: {
          id: true, legalName: true, tradingName: true, primaryContactEmail: true,
          bbbeeLevel: true, offtakerCategory: true,
          targetDistricts: true, productCategories: true,
          totalHectaresCapacity: true, estimatedFarmers: true,
          status: true, submittedAt: true, decidedAt: true, recommendation: true,
        },
        orderBy: { submittedAt: 'desc' },
      }),
    );

    const total = all.length;
    const byStatus: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const byBbbee: Record<string, number> = {};
    const byDistrict: Record<string, number> = {};
    const byProduct: Record<string, number> = {};
    let approvedCount = 0;
    let approvedHaCapacity = 0;
    let approvedFarmers = 0;

    for (const s of all) {
      byStatus[s.status] = (byStatus[s.status] || 0) + 1;
      if (s.offtakerCategory) byCategory[s.offtakerCategory] = (byCategory[s.offtakerCategory] || 0) + 1;
      if (s.bbbeeLevel)       byBbbee[s.bbbeeLevel] = (byBbbee[s.bbbeeLevel] || 0) + 1;
      (s.targetDistricts || []).forEach(d => { byDistrict[d] = (byDistrict[d] || 0) + 1; });
      (s.productCategories || []).forEach(p => { byProduct[p] = (byProduct[p] || 0) + 1; });
      if (s.status === 'approved' || s.status === 'approved_conditional') {
        approvedCount++;
        if (s.totalHectaresCapacity) approvedHaCapacity += Number(s.totalHectaresCapacity);
        if (s.estimatedFarmers) approvedFarmers += s.estimatedFarmers;
      }
    }

    res.json({
      total,
      approvedCount,
      approvedHaCapacity,
      approvedFarmers,
      byStatus,
      byCategory,
      byBbbee,
      byDistrict,
      byProduct,
      recent: all.slice(0, 10),
    });
  } catch (e) { next(e); }
});

// ───────────────────────────────── GET /:id
offtakerRouter.get('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const item = await withTenant(tid, (tx) =>
      tx.offtakerSubmission.findFirst({ where: { id: req.params.id, tenantId: tid } }),
    );
    if (!item) return res.status(404).json({ error: 'Submission not found' });
    res.json({ submission: item });
  } catch (e) { next(e); }
});

// ───────────────────────────────── PATCH /:id/screening
const ScreeningBody = z.object({
  scorecard: z.object({
    legalEntity: z.enum(['Yes','No','Pending']).optional(),
    taxStatus: z.enum(['Yes','No','Pending']).optional(),
    financialStrength: z.enum(['Strong','Adequate','Weak','Unverified']).optional(),
    productMarketFit: z.enum(['Aligned','Partial','Unclear','Misaligned']).optional(),
    farmerSupport: z.enum(['Substantial','Moderate','Minimal','None']).optional(),
    geographicFit: z.enum(['High','Moderate','Low']).optional(),
  }),
  status: z.enum(['screening','tna','verification','recommendation','declined','deferred']).optional(),
});

offtakerRouter.patch('/:id/screening', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const id = req.params.id;
    const patch = ScreeningBody.parse(req.body);

    const updated = await withTenant(tid, (tx) =>
      tx.offtakerSubmission.update({
        where: { id },
        data: {
          screeningScorecard: patch.scorecard as any,
          ...(patch.status ? { status: patch.status as any } : {}),
        },
      }),
    );
    res.json({ submission: updated });
  } catch (e) { next(e); }
});

// ───────────────────────────────── PATCH /:id/decision
const DecisionBody = z.object({
  status: z.enum(['approved','approved_conditional','declined','deferred']),
  recommendation: z.string().optional(),
  recommendationNotes: z.string().optional(),
  conditions: z.string().optional(),
  reviewerName: z.string().optional(),
  programmeManagerName: z.string().optional(),
  sectorHeadName: z.string().optional(),
  ipmExecutiveName: z.string().optional(),
  ceoName: z.string().optional(),
});

offtakerRouter.patch('/:id/decision', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const id = req.params.id;
    const patch = DecisionBody.parse(req.body);

    const today = new Date();
    const updated = await withTenant(tid, (tx) =>
      tx.offtakerSubmission.update({
        where: { id },
        data: {
          status: patch.status as any,
          recommendation: patch.recommendation ?? undefined,
          recommendationNotes: patch.recommendationNotes ?? undefined,
          conditions: patch.conditions ?? undefined,
          reviewerName: patch.reviewerName ?? undefined,
          programmeManagerName: patch.programmeManagerName ?? undefined,
          sectorHeadName: patch.sectorHeadName ?? undefined,
          ipmExecutiveName: patch.ipmExecutiveName ?? undefined,
          ceoName: patch.ceoName ?? undefined,
          ...(patch.reviewerName ? { reviewerDate: today } : {}),
          ...(patch.programmeManagerName ? { programmeManagerDate: today } : {}),
          ...(patch.sectorHeadName ? { sectorHeadDate: today } : {}),
          ...(patch.ipmExecutiveName ? { ipmExecutiveDate: today } : {}),
          ...(patch.ceoName ? { ceoDate: today } : {}),
          decidedAt: today,
        },
      }),
    );
    res.json({ submission: updated });
  } catch (e) { next(e); }
});

// =====================================================================
// ANNEXURE A ATTACHMENTS (Supabase Storage)
// =====================================================================

// ───── POST /:id/attachments  (multipart file upload)
//
// Body (multipart/form-data):
//   file                  - the file
//   annexureSection       - 'A.1' | 'A.2' | ... 'A.7'
//   annexureItem          - the document label (e.g. 'Company registration certificate')
//   annexureItemIndex     - optional ordinal within section
offtakerRouter.post('/:id/attachments', attachmentUpload.single('file'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const submissionId = req.params.id;
    if (!req.file) return res.status(400).json({ error: 'file required' });

    const meta = z.object({
      annexureSection: z.string().min(1),
      annexureItem:    z.string().min(1),
      annexureItemIndex: z.union([z.string(), z.number()]).optional(),
    }).parse(req.body);

    // Verify submission exists in this tenant (RLS will also enforce, but explicit 404 is friendlier)
    const sub = await withTenant(tid, (tx) =>
      tx.offtakerSubmission.findFirst({ where: { id: submissionId, tenantId: tid }, select: { id: true } }),
    );
    if (!sub) return res.status(404).json({ error: 'Submission not found' });

    // Upload to Supabase Storage
    const storagePath = await uploadOfftakerAttachment({
      tenantId: tid,
      submissionId,
      filename: req.file.originalname,
      buffer: req.file.buffer,
      mime: req.file.mimetype,
    });

    // Persist metadata
    const created = await withTenant(tid, (tx) =>
      tx.offtakerAttachment.create({
        data: {
          tenantId: tid,
          submissionId,
          annexureSection: meta.annexureSection,
          annexureItem: meta.annexureItem,
          annexureItemIndex: meta.annexureItemIndex != null ? Number(meta.annexureItemIndex) : null,
          originalFilename: req.file.originalname,
          storagePath,
          mimeType: req.file.mimetype,
          sizeBytes: req.file.size,
          uploadedByUserId: req.user!.id,
        },
      }),
    );

    res.status(201).json({ attachment: created });
  } catch (e) { next(e); }
});

// ───── GET /:id/attachments  (list files for a submission)
offtakerRouter.get('/:id/attachments', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const items = await withTenant(tid, (tx) =>
      tx.offtakerAttachment.findMany({
        where: { submissionId: req.params.id, tenantId: tid },
        orderBy: [{ annexureSection: 'asc' }, { uploadedAt: 'asc' }],
      }),
    );
    res.json({ attachments: items, count: items.length });
  } catch (e) { next(e); }
});

// ───── GET /attachments/:attId/url  (short-lived signed download URL)
offtakerRouter.get('/attachments/:attId/url', async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const att = await withTenant(tid, (tx) =>
      tx.offtakerAttachment.findFirst({ where: { id: req.params.attId, tenantId: tid } }),
    );
    if (!att) return res.status(404).json({ error: 'Attachment not found' });
    const url = await offtakerAttachmentSignedUrl(att.storagePath, 600); // 10-min link
    res.json({ url, filename: att.originalFilename, mimeType: att.mimeType, expiresInSec: 600 });
  } catch (e) { next(e); }
});

// ───── DELETE /attachments/:attId  (admin only)
offtakerRouter.delete('/attachments/:attId', requireRole('director'), async (req: AuthedRequest, res, next) => {
  try {
    const tid = req.user!.tenantId;
    const att = await withTenant(tid, (tx) =>
      tx.offtakerAttachment.findFirst({ where: { id: req.params.attId, tenantId: tid } }),
    );
    if (!att) return res.status(404).json({ error: 'Attachment not found' });
    try { await deleteOfftakerAttachment(att.storagePath); } catch { /* file may already be gone */ }
    await withTenant(tid, (tx) =>
      tx.offtakerAttachment.delete({ where: { id: att.id } }),
    );
    res.json({ ok: true });
  } catch (e) { next(e); }
});
