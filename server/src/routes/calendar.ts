/**
 * calendar.ts — master calendar (all events across all 3Wi units)
 * Mount at: app.use('/api/calendar', requireAuth, calendarRouter)
 */
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { withTenant } from '../tenant.js';

const r = Router();

// ---------------- LIST ----------------
r.get('/', async (req: any, res) => {
  const tid = req.user.tenantId;
  const { from, to, unit, type, status, owner } = req.query as Record<string, string | undefined>;
  const where: any = { tenantId: tid };
  if (unit)   where.providerUnitSlug = unit;
  if (type)   where.type = type;
  if (status) where.status = status;
  if (owner)  where.ownerUserId = owner;
  if (from || to) {
    where.startAt = {};
    if (from) where.startAt.gte = new Date(from);
    if (to)   where.startAt.lte = new Date(to);
  }
  const rows = await withTenant(tid, () =>
    prisma.calendarEvent.findMany({
      where,
      orderBy: { startAt: 'asc' },
      include: { customer: { select: { id: true, displayName: true } } },
      take: 1000,
    })
  );
  res.json(rows);
});

// ---------------- GET ONE ----------------
r.get('/:id', async (req: any, res) => {
  const tid = req.user.tenantId;
  const ev = await withTenant(tid, () =>
    prisma.calendarEvent.findFirst({
      where: { id: req.params.id, tenantId: tid },
      include: { customer: true, invoice: true },
    })
  );
  if (!ev) return res.status(404).json({ error: 'not_found' });
  res.json(ev);
});

// ---------------- UPCOMING (view) ----------------
r.get('/_summary/upcoming', async (req: any, res) => {
  const tid = req.user.tenantId;
  const rows = await withTenant(tid, () =>
    prisma.$queryRawUnsafe<any[]>(`SELECT * FROM upcoming_events WHERE tenant_id = $1::uuid LIMIT 100`, tid)
  );
  res.json(rows);
});

// ---------------- CREATE ----------------
const EventSchema = z.object({
  title:            z.string().min(1),
  type:             z.enum(['deliverable','deadline','meeting','milestone','training','campaign_launch','content_publish','recurring','other']).default('other'),
  status:           z.enum(['planned','in_progress','completed','cancelled','overdue']).default('planned'),
  providerUnitSlug: z.string().optional(),
  customerId:       z.string().uuid().optional(),
  engagementId:     z.string().uuid().optional(),
  invoiceId:        z.string().uuid().optional(),
  startAt:          z.string(),
  endAt:            z.string().optional(),
  allDay:           z.boolean().optional(),
  timezone:         z.string().optional(),
  isRecurring:      z.boolean().optional(),
  recurringRule:    z.string().optional(),
  recurringUntil:   z.string().optional(),
  ownerUserId:      z.string().uuid().optional(),
  assigneeEmails:   z.array(z.string().email()).optional(),
  description:      z.string().optional(),
  location:         z.string().optional(),
  url:              z.string().url().optional(),
});

r.post('/', async (req: any, res) => {
  const tid = req.user.tenantId;
  const parsed = EventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input', detail: parsed.error.errors });
  const d = parsed.data;
  const created = await withTenant(tid, () =>
    prisma.calendarEvent.create({
      data: {
        tenantId: tid,
        title: d.title,
        type: d.type,
        status: d.status,
        providerUnitSlug: d.providerUnitSlug,
        customerId: d.customerId,
        engagementId: d.engagementId,
        invoiceId: d.invoiceId,
        startAt: new Date(d.startAt),
        endAt: d.endAt ? new Date(d.endAt) : null,
        allDay: d.allDay ?? false,
        timezone: d.timezone ?? 'Africa/Johannesburg',
        isRecurring: d.isRecurring ?? false,
        recurringRule: d.recurringRule,
        recurringUntil: d.recurringUntil ? new Date(d.recurringUntil) : null,
        ownerUserId: d.ownerUserId,
        assigneeEmails: d.assigneeEmails ?? [],
        description: d.description,
        location: d.location,
        url: d.url,
        createdByUserId: req.user.id,
      },
    })
  );
  res.status(201).json(created);
});

// ---------------- UPDATE ----------------
r.patch('/:id', async (req: any, res) => {
  const tid = req.user.tenantId;
  const parsed = EventSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input', detail: parsed.error.errors });
  const d: any = { ...parsed.data, updatedAt: new Date() };
  if (d.startAt)        d.startAt = new Date(d.startAt);
  if (d.endAt)          d.endAt = new Date(d.endAt);
  if (d.recurringUntil) d.recurringUntil = new Date(d.recurringUntil);
  const updated = await withTenant(tid, async () => {
    const exists = await prisma.calendarEvent.findFirst({ where: { id: req.params.id, tenantId: tid } });
    if (!exists) return null;
    return prisma.calendarEvent.update({ where: { id: req.params.id }, data: d });
  });
  if (!updated) return res.status(404).json({ error: 'not_found' });
  res.json(updated);
});

// ---------------- DELETE ----------------
r.delete('/:id', async (req: any, res) => {
  const tid = req.user.tenantId;
  await withTenant(tid, () =>
    prisma.calendarEvent.deleteMany({ where: { id: req.params.id, tenantId: tid } })
  );
  res.status(204).send();
});

// ---------------- iCAL EXPORT ----------------
r.get('/_export/ics', async (req: any, res) => {
  const tid = req.user.tenantId;
  const events = await withTenant(tid, () =>
    prisma.calendarEvent.findMany({
      where: { tenantId: tid, status: { notIn: ['cancelled'] as any } },
      orderBy: { startAt: 'asc' },
      take: 2000,
    })
  );
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  const esc = (s: string) => (s ?? '').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  let out = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//3Wi//PMO SaaS//EN\r\nCALSCALE:GREGORIAN\r\n';
  for (const e of events) {
    out += 'BEGIN:VEVENT\r\n';
    out += `UID:${e.id}@3wi-pmo\r\n`;
    out += `DTSTAMP:${fmt(new Date())}\r\n`;
    out += `DTSTART:${fmt(e.startAt)}\r\n`;
    if (e.endAt) out += `DTEND:${fmt(e.endAt)}\r\n`;
    out += `SUMMARY:${esc(e.title)}\r\n`;
    if (e.description) out += `DESCRIPTION:${esc(e.description)}\r\n`;
    if (e.location)    out += `LOCATION:${esc(e.location)}\r\n`;
    if (e.url)         out += `URL:${esc(e.url)}\r\n`;
    if (e.isRecurring && e.recurringRule) out += `RRULE:${e.recurringRule}\r\n`;
    out += 'END:VEVENT\r\n';
  }
  out += 'END:VCALENDAR\r\n';
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="3wi-calendar.ics"');
  res.send(out);
});

export default r;
