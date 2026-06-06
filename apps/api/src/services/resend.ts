import { Resend } from 'resend';
import fs from 'node:fs';
import path from 'node:path';
import { isMock } from './mocks/mode.js';

// Lazy-construct so a missing key doesn't blow up startup.
let _resend: Resend | null = null;
function client(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? 're_mock');
  }
  return _resend;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? '3Wi PMO <noreply@3wipmo.co.za>';
const OUTBOX_PATH = path.resolve(process.cwd(), '.mock-outbox.jsonl');

let mockBannerLogged = false;
function logMockBannerOnce() {
  if (mockBannerLogged) return;
  mockBannerLogged = true;
  // eslint-disable-next-line no-console
  console.warn('[3Wi MOCK] Resend is mocked - emails are logged + appended to .mock-outbox.jsonl, not sent.');
}

interface EmailSendResponse {
  data: { id: string } | null;
  error: { name: string; message: string } | null;
}

interface EmailPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
}

function previewBody(html: string, n = 120): string {
  return html.replace(/\s+/g, ' ').replace(/<[^>]+>/g, '').trim().slice(0, n);
}

function fakeMessageId(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function appendOutbox(payload: EmailPayload, id: string) {
  try {
    const line = JSON.stringify({ id, ts: new Date().toISOString(), ...payload }) + '\n';
    fs.appendFileSync(OUTBOX_PATH, line, 'utf8');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[3Wi MOCK] could not append to .mock-outbox.jsonl:', (err as Error).message);
  }
}

async function sendOrMock(payload: EmailPayload): Promise<EmailSendResponse> {
  if (isMock('resend')) {
    logMockBannerOnce();
    const id = fakeMessageId();
    // eslint-disable-next-line no-console
    console.log(
      `[MOCK EMAIL] To: ${payload.to} | Subject: ${payload.subject} | Body preview: ${previewBody(payload.html)}`,
    );
    appendOutbox(payload, id);
    return { data: { id }, error: null };
  }
  return client().emails.send(payload) as Promise<EmailSendResponse>;
}

export async function sendWelcomeEmail(to: string, opts: { fullName: string; loginUrl: string; tempPassword?: string }) {
  return sendOrMock({
    from: FROM,
    to,
    subject: 'Welcome to 3Wi PMO Suite',
    html: welcomeTemplate(opts),
  });
}

export async function sendReportEmail(to: string, opts: { reportType: string; projectName: string; reportUrl: string }) {
  return sendOrMock({
    from: FROM,
    to,
    subject: `New ${opts.reportType.replace(/_/g, ' ')} - ${opts.projectName}`,
    html: reportTemplate(opts),
  });
}

export async function sendInvoiceEmail(to: string, opts: { invoiceNumber: string; total: string; dueDate: string; pdfUrl: string }) {
  return sendOrMock({
    from: FROM,
    to,
    subject: `Invoice ${opts.invoiceNumber} - 3Wi PMO Suite`,
    html: invoiceTemplate(opts),
  });
}

export async function sendHelpRequestAlert(to: string, opts: { farmerName: string; message: string; queueUrl: string }) {
  return sendOrMock({
    from: FROM,
    to,
    subject: `New help request from ${opts.farmerName}`,
    html: helpRequestTemplate(opts),
  });
}

// ---------- HTML templates (kept inline; move to /templates if they grow) ----------

function welcomeTemplate(o: { fullName: string; loginUrl: string; tempPassword?: string }) {
  return `
    <h1>Welcome, ${o.fullName}.</h1>
    <p>Your 3Wi PMO Suite account is ready.</p>
    <p>Sign in: <a href="${o.loginUrl}">${o.loginUrl}</a></p>
    ${o.tempPassword ? `<p>Temporary password: <strong>${o.tempPassword}</strong> (change on first login)</p>` : ''}
    <p>- 3Wi PTY Ltd</p>`;
}

function reportTemplate(o: { reportType: string; projectName: string; reportUrl: string }) {
  return `
    <h1>New report available</h1>
    <p>A new <strong>${o.reportType.replace(/_/g, ' ')}</strong> has been generated for ${o.projectName}.</p>
    <p><a href="${o.reportUrl}">Open in 3Wi PMO Suite</a></p>`;
}

function invoiceTemplate(o: { invoiceNumber: string; total: string; dueDate: string; pdfUrl: string }) {
  return `
    <h1>Invoice ${o.invoiceNumber}</h1>
    <p>Total due: <strong>${o.total}</strong></p>
    <p>Due date: ${o.dueDate}</p>
    <p><a href="${o.pdfUrl}">Download PDF</a></p>`;
}

function helpRequestTemplate(o: { farmerName: string; message: string; queueUrl: string }) {
  return `
    <h1>New help request</h1>
    <p><strong>${o.farmerName}</strong> needs help:</p>
    <blockquote>${o.message}</blockquote>
    <p><a href="${o.queueUrl}">Open queue</a> - 24-hour SLA in effect.</p>`;
}
