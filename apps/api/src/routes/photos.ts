import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { withTenant } from '../lib/prisma.js';
import { requireAuth, requireRole, type AuthedRequest } from '../middleware/auth.js';
import { uploadPhoto, presignedPhotoUrl } from '../services/supabase.js';

export const photosRouter = Router({ mergeParams: true });
photosRouter.use(requireAuth);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

const meta = z.object({
  gate: z.string().optional(),
  geoLat: z.string().optional(),
  geoLng: z.string().optional(),
  note: z.string().optional(),
});

photosRouter.post('/', requireRole('farmer'), upload.single('photo'), async (req: AuthedRequest, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'photo file required' });
    const m = meta.parse(req.body);
    const path = await uploadPhoto({
      tenantId: req.user!.tenantId,
      projectId: req.params.projectId,
      userId: req.user!.id,
      buffer: req.file.buffer,
      mime: req.file.mimetype,
    });
    const created = await withTenant(req.user!.tenantId, (tx) =>
      tx.photoUpload.create({
        data: {
          projectId: req.params.projectId,
          userId: req.user!.id,
          gate: m.gate,
          url: path,
          geoLat: m.geoLat ? Number(m.geoLat) : null,
          geoLng: m.geoLng ? Number(m.geoLng) : null,
          note: m.note,
        },
      }),
    );
    res.json({ photo: created });
  } catch (e) { next(e); }
});

photosRouter.get('/queue', requireRole('technical','director'), async (req: AuthedRequest, res, next) => {
  try {
    const items = await withTenant(req.user!.tenantId, (tx) =>
      tx.photoUpload.findMany({
        where: { projectId: req.params.projectId, reviewed: false },
        orderBy: { createdAt: 'asc' },
        include: { user: { select: { fullName: true, district: true } } },
      }),
    );
    const withUrls = await Promise.all(items.map(async (p) => ({ ...p, signedUrl: await presignedPhotoUrl(p.url) })));
    res.json({ photos: withUrls });
  } catch (e) { next(e); }
});

photosRouter.patch('/:pid/review', requireRole('technical'), async (req: AuthedRequest, res, next) => {
  try {
    const updated = await withTenant(req.user!.tenantId, (tx) =>
      tx.photoUpload.update({
        where: { id: req.params.pid },
        data: { reviewed: true, reviewerId: req.user!.id, reviewedAt: new Date() },
      }),
    );
    res.json({ photo: updated });
  } catch (e) { next(e); }
});
