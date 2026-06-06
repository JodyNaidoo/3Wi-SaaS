import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { Td } from '../../components/ui/Table';
import { api } from '../../lib/api';
import { useAuthStore } from '../../lib/auth';
import { listGrowers, type Grower } from '../../lib/api/growers';
import {
  listParts,
  listDisbursements,
  getProject,
  type PartSummary,
  type ProjectMetadata,
  type DisbursementRow,
} from '../../lib/api/psc';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'PSC overview',          href: '/cc/psc' },
  { key: 'F2', label: 'Budget & disbursements', href: '/cc/psc?p=budget' },
  { key: 'F3', label: 'Risk register',          href: '/cc/psc?p=risks' },
  { key: 'F4', label: 'Quarterly reports',      href: '/ai/quarterly' },
  { key: 'F5', label: 'Growers (Part 1)',       href: '/cc/growers' },
  { key: 'F6', label: 'Stakeholder map',        href: '/cc/psc?p=stakeholders' },
];

// -----------------------------------------------------------------------
// Constants & fallbacks
// -----------------------------------------------------------------------

const TOTAL_ENVELOPE_FALLBACK = 4_800_000;
const PART2_PLACEHOLDER       = 1_500_000;

// Hardcoded Part 1 deliverables (used as a fallback when the API doesn't
// expose them yet, and reused for the strip when API data is partial).
const FALLBACK_DELIVERABLES = [
  { code: 'D1', title: 'Determine Part 1 budget allocation within R4.8m envelope',
    status: 'At risk',  percentComplete: 0,  funder: 'ECRDA', owner: 'Director' },
  { code: 'D2', title: 'Review applications + field-research data; publish reports',
    status: 'On track', percentComplete: 60, funder: 'ECRDA', owner: 'Field Office' },
  { code: 'D3', title: 'Disbursements + per-farmer sign-off + Part 1 closeout',
    status: 'On track', percentComplete: 20, funder: 'ECRDA', owner: 'Finance' },
];

// Pending PSC decisions (no API yet — stubbed from the seeded tracker).
const PENDING_DECISIONS = [
  { id: 'PSC-2025-001', label: 'Approve Part 1 disbursement total of R536,590 at mapped basis',
    funder: 'ECRDA',  type: 'Budget',     submitted: '2026-04-22' },
  { id: 'PSC-2025-002', label: 'Endorse outlier-farm re-survey plan (5 farms)',
    funder: 'ECRDA',  type: 'Operational', submitted: '2026-04-28' },
  { id: 'PSC-2025-003', label: 'Confirm Part 2 (DSBD Seed Cohort) funding envelope and start date',
    funder: 'DSBD',   type: 'Strategic',   submitted: '2026-05-02' },
];

// PSC stakeholders (no API yet — stubbed from the seeded ToR).
const STAKEHOLDERS = [
  { name: 'ECRDA',  role: 'Lead funder (Part 1)',          part: 'Part 1' },
  { name: 'SEDFA',  role: 'Co-financier / SMME support',   part: 'Both'   },
  { name: 'ECDC',   role: 'Industrial-development partner', part: 'Both'  },
  { name: 'DEDEAT', role: 'Provincial oversight',           part: 'Both'  },
  { name: 'DSBD',   role: 'Lead funder (Part 2 — Seed Cohort)', part: 'Part 2' },
];

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------

function toNum(v: unknown): number {
  if (v == null) return 0;
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatRand(n: number, opts?: { compact?: boolean }): string {
  if (!Number.isFinite(n)) return '—';
  if (opts?.compact && n >= 1_000_000) return `R ${(n / 1_000_000).toFixed(2)}m`;
  if (opts?.compact && n >= 1_000)     return `R ${(n / 1_000).toFixed(0)}k`;
  return `R ${n.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatRandDp(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return `R ${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatNum(n: number, dp = 2): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-ZA', { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

function statusBadgeClass(s: string): string {
  if (/risk|off/i.test(s))   return 'bg-red-100 text-red-800';
  if (/watch|amber/i.test(s)) return 'bg-amber-100 text-amber-800';
  return 'bg-emerald-100 text-emerald-800';
}

function deliverableBarColour(status: string, hempire: boolean): string {
  if (/risk|off/i.test(status))  return 'bg-red-500';
  if (/watch|amber/i.test(status)) return 'bg-amber-500';
  return hempire ? 'bg-[#015807]' : 'bg-emerald-500';
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

export function PSC_CC() {
  const { tenantSlug } = useAuthStore();
  const [project, setProject] = useState<ProjectMetadata | null>(null);
  const [parts, setParts] = useState<PartSummary[]>([]);
  const [growers, setGrowers] = useState<Grower[]>([]);
  const [disbursements, setDisbursements] = useState<DisbursementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [lastLoadedAt, setLastLoadedAt] = useState<Date | null>(null);

  const isHempire =
    tenantSlug === 'ibs' ||
    tenantSlug === 'sunshines' ||
    project?.code === 'SUNSHINES-001';

  // ---- Load ------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        // Resolve active project
        const onboardingId = sessionStorage.getItem('onboarding.projectId');
        let projectId: string | null = onboardingId;
        if (!projectId) {
          const resp = await api<{ projects: { id: string; code?: string }[] }>('/projects');
          projectId = resp.projects[0]?.id ?? null;
        }
        if (!projectId) {
          if (!cancelled) { setError('No project found for this user.'); setLoading(false); }
          return;
        }
        // Fetch in parallel; tolerate individual failures.
        const [projRes, partsRes, growersRes, disbRes] = await Promise.allSettled([
          getProject(projectId),
          listParts(projectId),
          listGrowers(projectId),
          listDisbursements(projectId),
        ]);
        if (cancelled) return;
        if (projRes.status === 'fulfilled')    setProject(projRes.value.project);
        if (partsRes.status === 'fulfilled')   setParts(partsRes.value.parts ?? []);
        if (growersRes.status === 'fulfilled') setGrowers(growersRes.value.growers ?? []);
        if (disbRes.status === 'fulfilled')    setDisbursements(disbRes.value.disbursements ?? []);
        setLastLoadedAt(new Date());
      } catch (e) {
        if (!cancelled) setError((e as Error).message || 'Failed to load PSC data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [reloadKey]);

  // ---- Derived: budget envelope ----------------------------------------
  const totalEnvelope = toNum(project?.totalBudget) || TOTAL_ENVELOPE_FALLBACK;

  // Part 1 paid/approved + pending sums (from disbursement rows).
  const { part1Disbursed, part1Pending, part1MappedTotal } = useMemo(() => {
    let disbursed = 0, pending = 0, mapped = 0;
    for (const d of disbursements) {
      const amount = toNum(d.amountTotal);
      mapped += amount; // mapped basis = total computed across rows
      const s = (d.status ?? '').toLowerCase();
      if (s === 'approved' || s === 'paid') disbursed += amount;
      else if (s === 'pending')             pending   += amount;
      else                                   pending   += amount; // be conservative
    }
    // Fallback: compute from grower mappedHa if disbursements are absent.
    if (disbursements.length === 0 && growers.length > 0) {
      const RATE = 7350 + 3618.72; // mapped basis
      mapped = growers.reduce((s, g) => s + toNum(g.mappedHa) * RATE, 0);
      pending = mapped;
    }
    return { part1Disbursed: disbursed, part1Pending: pending, part1MappedTotal: mapped };
  }, [disbursements, growers]);

  const part1Allocated = part1Disbursed + part1Pending || part1MappedTotal;
  const part2Allocated = PART2_PLACEHOLDER; // labelled "TBC" in UI
  const headroom = Math.max(0, totalEnvelope - part1Allocated - part2Allocated);
  const part1UtilPct = totalEnvelope > 0 ? (part1Allocated / totalEnvelope) * 100 : 0;

  // ---- Derived: deliverables (prefer API, fallback to seed-ish) --------
  const deliverables = useMemo(() => {
    // Try to find Part 1 in `parts` and use seeded counts; the parts list
    // doesn't include the deliverables, so we rely on the fallback for now.
    return FALLBACK_DELIVERABLES;
  }, []);

  const deliveryScore = useMemo(() => {
    const avg = deliverables.reduce((s, d) => s + (d.percentComplete ?? 0), 0) / deliverables.length;
    if (avg < 25 || deliverables.some((d) => /risk/i.test(d.status))) return 'Watch';
    if (avg >= 70) return 'On track';
    return 'Watch';
  }, [deliverables]);

  // ---- Derived: district aggregates ------------------------------------
  const districtAggregates = useMemo(() => {
    const RATE = 7350 + 3618.72;
    const map = new Map<string, { count: number; mappedHa: number; amount: number }>();
    if (growers.length === 0) return [];
    for (const g of growers) {
      const d = g.district ?? 'Unknown';
      const ha = toNum(g.mappedHa);
      const amt = toNum(g.disbursement?.amountTotal) || ha * RATE;
      const cur = map.get(d) ?? { count: 0, mappedHa: 0, amount: 0 };
      cur.count    += 1;
      cur.mappedHa += ha;
      cur.amount   += amt;
      map.set(d, cur);
    }
    return Array.from(map.entries())
      .map(([district, v]) => ({ district, ...v }))
      .sort((a, b) => b.amount - a.amount);
  }, [growers]);

  // ---- Derived: risk heatmap -------------------------------------------
  const risks = project?.risks ?? [];
  type RiskRow = NonNullable<ProjectMetadata['risks']>[number];
  const riskCells = useMemo(() => {
    // 3x3 buckets: low(1-2)/med(3)/high(4-5) for likelihood × impact
    const grid: RiskRow[][][] = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => [] as RiskRow[]),
    );
    for (const r of risks) {
      const li = (r.likelihood ?? 1) <= 2 ? 0 : (r.likelihood ?? 1) === 3 ? 1 : 2;
      const ii = (r.impact ?? 1)     <= 2 ? 0 : (r.impact ?? 1)     === 3 ? 1 : 2;
      grid[ii][li].push(r);
    }
    return grid;
  }, [risks]);

  const riskCounts = useMemo(() => {
    let high = 0, med = 0, low = 0;
    for (const r of risks) {
      const score = (r.likelihood ?? 1) * (r.impact ?? 1);
      if (score >= 12) high++;
      else if (score >= 6) med++;
      else low++;
    }
    return { high, med, low, total: risks.length };
  }, [risks]);

  // ---- Visual helpers --------------------------------------------------
  const accentBg     = isHempire ? 'bg-[#015807] text-white' : 'bg-slate-900 text-white';
  const accentText   = isHempire ? 'text-[#3F1101]' : 'text-slate-900';
  const part1Colour  = isHempire ? 'bg-[#015807]'  : 'bg-emerald-500';
  const pendingColour= 'bg-amber-500';
  const part2Colour  = isHempire ? 'bg-[#FDF31C] text-[#3F1101]' : 'bg-sky-500 text-white';
  const headroomColour = 'bg-slate-200';

  function pct(n: number): number {
    return totalEnvelope > 0 ? (n / totalEnvelope) * 100 : 0;
  }

  function timeAgo(d: Date | null): string {
    if (!d) return '—';
    const s = Math.round((Date.now() - d.getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.round(s / 60);
    if (m < 60) return `${m} min ago`;
    const h = Math.round(m / 60);
    return `${h}h ago`;
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <Shell role="psc" hotkeys={HOTKEYS}>
      {/* ------------------- A. Programme header ----------------------- */}
      <div className="mb-4">
        <nav className="text-xs text-slate-500 mb-1">
          3Wi PMO Suite <span className="mx-1 opacity-40">›</span>
          IBS <span className="mx-1 opacity-40">›</span>
          Hempire-EC <span className="mx-1 opacity-40">›</span>
          {project?.name ?? 'Sunshines Project'} <span className="mx-1 opacity-40">›</span>
          <span className="text-slate-700 font-medium">PSC</span>
        </nav>
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className={`text-2xl font-bold ${accentText}`}>
              {project?.name ?? 'Sunshines Project'} — Programme Steering Committee
            </h1>
            <p className="text-sm text-slate-500">
              Q1 FY2026/27
              <span className="mx-2 opacity-40">·</span>
              MOA: {project?.moaReference ?? 'HEMP/IBS/MOA/2025'}
              <span className="mx-2 opacity-40">·</span>
              Project code: {project?.code ?? '—'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(deliveryScore)}`}>
              {deliveryScore}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
              Envelope: {formatRand(totalEnvelope, { compact: true })}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${accentBg}`}>
              Part 1 (mapped): {formatRand(part1MappedTotal, { compact: true })}
            </span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50 text-red-800 text-sm">
          {error}
        </div>
      ) : null}
      {loading ? (
        <div className="mb-4 p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-sm flex items-center gap-3">
          <div className="animate-spin h-4 w-4 border-2 border-slate-300 border-t-slate-700 rounded-full" />
          Loading PSC data…
        </div>
      ) : null}

      {/* ------------------- B. Programme budget envelope --------------- */}
      <Card title="Programme budget envelope (R4,800,000)" className="mb-4">
        <div className="space-y-3">
          {/* Stacked bar */}
          <div className="w-full h-8 rounded-lg overflow-hidden flex border border-slate-200 bg-white">
            {part1Disbursed > 0 ? (
              <div
                className={`${part1Colour} h-full flex items-center justify-center text-[11px] text-white font-semibold`}
                style={{ width: `${pct(part1Disbursed)}%` }}
                title={`Part 1 paid/approved: ${formatRand(part1Disbursed)}`}
              >
                {pct(part1Disbursed) > 7 ? `Paid ${pct(part1Disbursed).toFixed(1)}%` : ''}
              </div>
            ) : null}
            {part1Pending > 0 ? (
              <div
                className={`${pendingColour} h-full flex items-center justify-center text-[11px] text-white font-semibold`}
                style={{ width: `${pct(part1Pending)}%` }}
                title={`Part 1 committed (pending): ${formatRand(part1Pending)}`}
              >
                {pct(part1Pending) > 7 ? `Pending ${pct(part1Pending).toFixed(1)}%` : ''}
              </div>
            ) : null}
            <div
              className={`${part2Colour} h-full flex items-center justify-center text-[11px] font-semibold`}
              style={{ width: `${pct(part2Allocated)}%` }}
              title={`Part 2 placeholder (TBC): ${formatRand(part2Allocated)}`}
            >
              {pct(part2Allocated) > 7 ? `Part 2 (TBC) ${pct(part2Allocated).toFixed(1)}%` : ''}
            </div>
            <div
              className={`${headroomColour} h-full flex items-center justify-center text-[11px] text-slate-600 font-semibold`}
              style={{ width: `${pct(headroom)}%` }}
              title={`Headroom: ${formatRand(headroom)}`}
            >
              {pct(headroom) > 10 ? `Headroom ${pct(headroom).toFixed(1)}%` : ''}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className={`inline-block w-3 h-3 rounded-sm ${part1Colour}`} />
              Part 1 paid/approved
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className={`inline-block w-3 h-3 rounded-sm ${pendingColour}`} />
              Part 1 committed (pending sign-off)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className={`inline-block w-3 h-3 rounded-sm ${part2Colour.split(' ')[0]}`} />
              Part 2 (TBC, DSBD-funded)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className={`inline-block w-3 h-3 rounded-sm ${headroomColour}`} />
              Headroom
            </span>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Total envelope</div>
              <div className="text-xl font-bold text-slate-900">{formatRand(totalEnvelope)}</div>
              <div className="text-[11px] text-slate-500">{project?.funder ?? 'ECRDA + DSBD'}</div>
            </div>
            <div className={`rounded-lg p-3 ${isHempire ? 'border border-[#015807]/30 bg-[#015807]/5' : 'border border-emerald-300 bg-emerald-50'}`}>
              <div className="text-xs text-slate-500">Part 1 disbursement (mapped)</div>
              <div className={`text-xl font-bold ${accentText}`}>{formatRandDp(part1MappedTotal)}</div>
              <div className="text-[11px] text-slate-500">
                {growers.length > 0 ? `${growers.length} growers · R10,968.72 / ha` : 'Awaiting grower data'}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-xs text-slate-500">Part 1 utilisation</div>
              <div className="text-xl font-bold text-slate-900">{part1UtilPct.toFixed(1)}%</div>
              <div className="text-[11px] text-slate-500">of R4,800,000 envelope</div>
            </div>
            <div className={`rounded-lg p-3 border ${isHempire ? 'border-[#FDF31C] bg-[#FDF31C]/15' : 'border-sky-200 bg-sky-50'}`}>
              <div className="text-xs text-slate-500">Part 2 (DSBD Seed Cohort)</div>
              <div className={`text-xl font-bold ${isHempire ? 'text-[#3F1101]' : 'text-sky-900'}`}>TBC</div>
              <div className="text-[11px] text-slate-500">No growers yet · awaiting data</div>
            </div>
          </div>
        </div>
      </Card>

      {/* ------------------- C. Part 1 deliverables strip --------------- */}
      <Card title="Part 1 deliverables — D1 / D2 / D3" className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {deliverables.map((d) => {
            const bar = deliverableBarColour(d.status, isHempire);
            return (
              <Link
                key={d.code}
                to="/cc/director?p=milestones"
                className="block rounded-lg border border-slate-200 hover:border-slate-400 transition p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-slate-900">{d.code}</div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadgeClass(d.status)}`}>
                    {d.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mb-2 line-clamp-2">{d.title}</div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${bar}`} style={{ width: `${d.percentComplete}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>{d.percentComplete}% complete</span>
                  <span>{d.owner} · {d.funder}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* ------------------- D. Risks + Decisions ---------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card title={`Risk heatmap (${riskCounts.total} risks · ${riskCounts.high} High / ${riskCounts.med} Med / ${riskCounts.low} Low)`}>
          {risks.length === 0 ? (
            <div className="text-sm text-slate-500">
              No risks loaded from the API yet. Defaulting to seeded register summary
              (1 High, 2 Medium, 2 Low).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left text-slate-500 font-medium">Impact ↓ / Likelihood →</th>
                    <th className="px-2 py-1 text-center text-slate-500 font-medium">Low</th>
                    <th className="px-2 py-1 text-center text-slate-500 font-medium">Med</th>
                    <th className="px-2 py-1 text-center text-slate-500 font-medium">High</th>
                  </tr>
                </thead>
                <tbody>
                  {[2, 1, 0].map((iIdx) => (
                    <tr key={iIdx}>
                      <td className="px-2 py-1 text-slate-500 font-medium">
                        {iIdx === 2 ? 'High' : iIdx === 1 ? 'Med' : 'Low'}
                      </td>
                      {[0, 1, 2].map((lIdx) => {
                        const cell = riskCells[iIdx]?.[lIdx] ?? [];
                        const score = (lIdx + 1) * (iIdx + 1);
                        const bg =
                          score >= 6 ? 'bg-red-100 border-red-200' :
                          score >= 3 ? 'bg-amber-100 border-amber-200' :
                                       'bg-emerald-50 border-emerald-200';
                        return (
                          <td key={lIdx} className="px-1 py-1 align-top">
                            <div className={`min-h-[60px] rounded border ${bg} p-1 text-[11px] text-slate-700`}>
                              {cell.length === 0 ? <span className="opacity-50">—</span> :
                                cell.map((r) => (
                                  <div key={r.id} className="font-mono">{r.code}</div>
                                ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-[11px] text-slate-500 mt-2">
                {risks.slice(0, 3).map((r) => (
                  <div key={r.id} className="truncate">
                    <span className="font-mono">{r.code}</span> · {r.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card title={`Decisions awaiting PSC (${PENDING_DECISIONS.length})`}>
          <ul className="divide-y divide-slate-100">
            {PENDING_DECISIONS.map((d) => (
              <li key={d.id} className="py-2 flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[11px] text-slate-500">{d.id}</div>
                  <div className="text-sm text-slate-800">{d.label}</div>
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 capitalize">{d.type}</span>
                  <div className="text-[11px] text-slate-500 mt-1">{d.funder} · {d.submitted}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="text-[11px] text-slate-500 mt-2 italic">
            Decisions are stubbed (no API yet). Once `/decisions` lands, these will pull live.
          </div>
        </Card>
      </div>

      {/* ------------------- E. Disbursement by district ---------------- */}
      <Card title={`Disbursement by district (Part 1 · ${growers.length} growers)`} className="mb-4">
        {districtAggregates.length === 0 ? (
          <div className="text-sm text-slate-500">No grower data loaded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-3 py-2 font-semibold text-slate-700">District</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-right">Growers</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-right">Mapped Ha</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-right">Disbursement</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">Share of Part 1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {districtAggregates.map((d) => {
                  const share = part1MappedTotal > 0 ? (d.amount / part1MappedTotal) * 100 : 0;
                  return (
                    <tr key={d.district} className="hover:bg-slate-50">
                      <Td className="font-medium">{d.district}</Td>
                      <Td className="text-right tabular-nums">{d.count}</Td>
                      <Td className="text-right tabular-nums">{formatNum(d.mappedHa)}</Td>
                      <Td className="text-right tabular-nums">{formatRandDp(d.amount)}</Td>
                      <Td className="w-48">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className={`h-full ${part1Colour}`} style={{ width: `${share}%` }} />
                          </div>
                          <span className="text-xs text-slate-600 tabular-nums w-12 text-right">{share.toFixed(1)}%</span>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-50 font-semibold">
                  <Td>Total</Td>
                  <Td className="text-right tabular-nums">
                    {districtAggregates.reduce((s, d) => s + d.count, 0)}
                  </Td>
                  <Td className="text-right tabular-nums">
                    {formatNum(districtAggregates.reduce((s, d) => s + d.mappedHa, 0))}
                  </Td>
                  <Td className="text-right tabular-nums">{formatRandDp(part1MappedTotal)}</Td>
                  <Td className="text-right text-xs text-slate-500">100%</Td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ------------------- Stakeholder block (compact) --------------- */}
      <Card title="PSC stakeholders" className="mb-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {STAKEHOLDERS.map((s) => (
            <div key={s.name} className="rounded border border-slate-200 p-2">
              <div className="font-semibold text-sm">{s.name}</div>
              <div className="text-[11px] text-slate-500">{s.role}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{s.part}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ------------------- F. Footer ---------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
        <div className="flex flex-wrap gap-2">
          <Link to="/ai/quarterly" className={`btn-primary ${isHempire ? '!bg-[#015807] hover:!bg-[#3F1101]' : ''}`}>
            Generate Q1 PSC Pack
          </Link>
          <Link to="/cc/growers" className="px-4 py-2 rounded text-sm border border-slate-300 bg-white hover:border-slate-500">
            Open Grower register
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>Last updated {timeAgo(lastLoadedAt)}</span>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="px-3 py-1 rounded border border-slate-300 hover:border-slate-500 text-slate-700"
            disabled={loading}
          >
            {loading ? 'Reloading…' : 'Reload'}
          </button>
        </div>
      </div>

      {/* Debug summary — remove once happy. */}
      {parts.length > 0 ? (
        <div className="text-[11px] text-slate-400 mt-3">
          {parts.length} part{parts.length === 1 ? '' : 's'} from API
          {parts.map((p) => ` · ${p.code} (${p._count?.growers ?? 0} growers)`).join('')}
        </div>
      ) : null}
    </Shell>
  );
}
