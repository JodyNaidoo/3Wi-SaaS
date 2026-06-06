import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { authRouter } from './routes/auth.js';
import { projectsRouter } from './routes/projects.js';
import { milestonesRouter } from './routes/milestones.js';
import { risksRouter } from './routes/risks.js';
import { helpRequestsRouter } from './routes/help-requests.js';
import { photosRouter } from './routes/photos.js';
import { aiRouter } from './routes/ai.js';
import { billingRouter } from './routes/billing.js';
import { webhooksRouter } from './routes/webhooks.js';
import { partsRouter } from './routes/parts.js';
import { growersRouter } from './routes/growers.js';
import { disbursementsRouter } from './routes/disbursements.js';
// 0005 — payment verification process (Hempire 4-gate governance)
import { farmerPortalRouter } from './routes/farmer-portal.js';
import { verificationsRouter } from './routes/verifications.js';
import { authorisationsRouter } from './routes/authorisations.js';
import { paymentsRouter } from './routes/payments.js';
import { ecrdaRouter } from './routes/ecrda.js';
// 0006-0009 — engagements + offtaker submissions + PoE submissions + offtaker attachments
import { engagementsRouter }       from './routes/engagements.js';
import { offtakerRouter }          from './routes/offtaker-submissions.js';
import { poeRouter }               from './routes/poe-submissions.js';
// 0010-0011 — Unified Billing + Master Calendar
import { customersRouter }         from './routes/customers.js';
import { invoicesRouter }          from './routes/invoices.js';
import { calendarRouter }          from './routes/calendar.js';
import { printStartupBanner } from './services/mocks/mode.js';

const app = express();
const PORT = Number(process.env.API_PORT ?? 4000);

// stripe webhook needs the raw body - mount BEFORE json parser
app.use('/webhooks', webhooksRouter);

app.use(helmet());

// CORS — in dev/mock mode, allow ANY localhost port (Vite often shifts to 5174/5175 etc).
// In production, fall back to a strict allowlist from CORS_ORIGINS.
const isDev = process.env.NODE_ENV !== 'production' || process.env.MOCK_MODE === 'true';
const allowlist = (process.env.CORS_ORIGINS ?? 'http://localhost:5173').split(',').map((s) => s.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // same-origin / curl
      if (isDev && /^https?:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
      if (allowlist.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use(morgan('combined'));

app.use(
  rateLimit({
    windowMs: 60_000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/health', (_req, res) => res.json({ ok: true, version: '0.1.0' }));

app.use('/auth', authRouter);
app.use('/projects', projectsRouter);
app.use('/projects/:projectId/milestones', milestonesRouter);
app.use('/projects/:projectId/risks', risksRouter);
app.use('/projects/:projectId/help-requests', helpRequestsRouter);
app.use('/projects/:projectId/photos', photosRouter);
app.use('/projects/:projectId/parts', partsRouter);
app.use('/projects/:projectId/growers', growersRouter);
app.use('/projects/:projectId/disbursements', disbursementsRouter);
app.use('/ai', aiRouter);
app.use('/billing', billingRouter);

// 0005 — payment verification process
app.use('/farmer',         farmerPortalRouter);
app.use('/verifications',  verificationsRouter);
app.use('/authorisations', authorisationsRouter);
app.use('/payments',       paymentsRouter);
app.use('/ecrda',          ecrdaRouter);

// 0006-0009 — productised engagements + ECRDA cohort intake flows
app.use('/engagements',          engagementsRouter);
app.use('/offtaker-submissions', offtakerRouter);
app.use('/poe-submissions',      poeRouter);

// 0010-0011 — Unified Billing + Master Calendar (cross-cutting modules)
app.use('/customers', customersRouter);
app.use('/invoices',  invoicesRouter);
app.use('/calendar',  calendarRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err);
  res.status(500).json({ error: err.message ?? 'Internal server error' });
});

app.listen(PORT, () => {
  printStartupBanner(PORT);
});
