import { Fragment, useEffect, useMemo, useState } from 'react';
import { Shell, type Hotkey } from '../../components/ui/Shell';
import { Card } from '../../components/ui/Card';
import { Td } from '../../components/ui/Table';
import { api } from '../../lib/api';
import { listGrowers, type Grower } from '../../lib/api/growers';
import { statusPillClasses } from '../../lib/api/payment-process';
import { useAuthStore } from '../../lib/auth';

const HOTKEYS: Hotkey[] = [
  { key: 'F1', label: 'All entities',     href: '/cc/director' },
  { key: 'F2', label: 'Farmer pipeline',  href: '/cc/director?p=farmers' },
  { key: 'F3', label: 'AI skills',        href: '/ai/monthly-ops' },
  { key: 'F4', label: 'Milestones',       href: '/cc/director?p=milestones' },
  { key: 'F5', label: 'Risk register',    href: '/cc/director?p=risks' },
  { key: 'F6', label: 'Growers',          href: '/cc/growers' },
  { key: 'F7', label: 'Cash flow',        href: '/cc/director?p=cash' },
  { key: 'F8', label: 'Report builder',   href: '/ai/quarterly' },
  { key: 'F9', label: 'User management',  href: '/cc/director?p=users' },
  { key: 'F10', label: 'Billing',         href: '/billing/subscription' },
];

type SortKey =
  | 'externalRef' | 'fullName' | 'farmName' | 'district' | 'region'
  | 'coordinator' | 'seedlingsReceived' | 'mappedHa' | 'theoreticalHa'
  | 'outlierFlag' | 'fundedHa' | 'amountTotal' | 'status';

type SortDir = 'asc' | 'desc';
type OutlierFilter = 'all' | 'outliers' | 'normal';

interface ProjectMeta { id: string; code?: string }

function formatRand(n?: number | null): string {
  if (n == null || Number.isNaN(n)) return '—';
  return `R ${Number(n).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatNum(n?: number | null, digits = 2): string {
  if (n == null || Number.isNaN(n)) return '—';
  return Number(n).toLocaleString('en-ZA', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function getSortValue(g: Grower, key: SortKey): string | number {
  switch (key) {
    case 'fundedHa': return g.disbursement?.fundedHa ?? 0;
    case 'amountTotal': return g.disbursement?.amountTotal ?? 0;
    case 'outlierFlag': return g.outlierFlag ? 1 : 0;
    case 'externalRef': return g.externalRef ?? 0;
    case 'seedlingsReceived': return g.seedlingsReceived ?? 0;
    case 'mappedHa': return g.mappedHa ?? 0;
    case 'theoreticalHa': return g.theoreticalHa ?? 0;
    default: return (g[key] as string) ?? '';
  }
}

export function GrowersCC() {
  const { tenantSlug } = useAuthStore();
  const [project, setProject] = useState<ProjectMeta | null>(null);
  const [growers, setGrowers] = useState<Grower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters
  const [districtSel, setDistrictSel] = useState<string[]>([]);
  const [coordSel, setCoordSel] = useState<string>('');
  const [outlierSel, setOutlierSel] = useState<OutlierFilter>('all');
  const [statusSel, setStatusSel] = useState<string>('');

  // Sort
  const [sortKey, setSortKey] = useState<SortKey>('externalRef');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const isHempire = tenantSlug === 'ibs' || tenantSlug === 'sunshines' || project?.code === 'SUNSHINES-001';

  // Load active project, then growers
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const onboardingId = sessionStorage.getItem('onboarding.projectId');
        let proj: ProjectMeta | null = null;
        if (onboardingId) {
          proj = { id: onboardingId };
        } else {
          const resp = await api<{ projects: { id: string; code?: string }[] }>('/projects');
          proj = resp.projects[0] ?? null;
        }
        if (cancelled) return;
        if (!proj) { setError('No project found for this user'); setLoading(false); return; }
        setProject(proj);
        const data = await listGrowers(proj.id);
        if (cancelled) return;
        setGrowers(data.growers ?? []);
      } catch (e) {
        if (!cancelled) setError((e as Error).message || 'Failed to load growers');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const districts = useMemo(() => {
    const s = new Set<string>();
    growers.forEach((g) => { if (g.district) s.add(g.district); });
    return Array.from(s).sort();
  }, [growers]);

  const coordinators = useMemo(() => {
    const s = new Set<string>();
    growers.forEach((g) => { if (g.coordinator) s.add(g.coordinator); });
    const arr = Array.from(s);
    if (arr.length === 0) return ['Phakama', 'Ndaba', 'Nonjabulo'];
    return arr.sort();
  }, [growers]);

  const statuses = useMemo(() => {
    const s = new Set<string>();
    growers.forEach((g) => { if (g.status) s.add(g.status); });
    return Array.from(s).sort();
  }, [growers]);

  const filtered = useMemo(() => {
    const rows = growers.filter((g) => {
      if (districtSel.length > 0 && !districtSel.includes(g.district ?? '')) return false;
      if (coordSel && (g.coordinator ?? '') !== coordSel) return false;
      if (outlierSel === 'outliers' && !g.outlierFlag) return false;
      if (outlierSel === 'normal' && g.outlierFlag) return false;
      if (statusSel && (g.status ?? '') !== statusSel) return false;
      return true;
    });
    rows.sort((a, b) => {
      const av = getSortValue(a, sortKey);
      const bv = getSortValue(b, sortKey);
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return rows;
  }, [growers, districtSel, coordSel, outlierSel, statusSel, sortKey, sortDir]);

  // NB: Prisma Decimal serializes as a string over JSON — coerce to Number before summing,
  // otherwise `0 + "0.80"` becomes `"00.80"` and accumulates to NaN.
  const totalMappedHa = useMemo(
    () => filtered.reduce((s, g) => s + Number(g.mappedHa ?? 0), 0),
    [filtered]
  );
  const totalFundedHa = useMemo(
    () => filtered.reduce((s, g) => s + Number(g.disbursement?.fundedHa ?? 0), 0),
    [filtered]
  );
  const totalMechanisation = useMemo(
    () => filtered.reduce((s, g) => s + Number(g.disbursement?.amountMechanisation ?? 0), 0),
    [filtered]
  );
  const totalLabour = useMemo(
    () => filtered.reduce((s, g) => s + Number(g.disbursement?.amountLabour ?? 0), 0),
    [filtered]
  );
  const totalDisbursement = useMemo(
    () => filtered.reduce((s, g) => s + Number(g.disbursement?.amountTotal ?? 0), 0),
    [filtered]
  );
  const outlierCount = useMemo(() => filtered.filter((g) => g.outlierFlag).length, [filtered]);

  // Part 1 (Seedlings Cohort) budget envelope from MOA — see README.md
  const PART1_BUDGET = 3_200_000;
  const pctOfPart1 = (totalDisbursement / PART1_BUDGET) * 100;
  const avgPerGrower = filtered.length > 0 ? totalDisbursement / filtered.length : 0;

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('asc'); }
  }

  function toggleDistrict(d: string) {
    setDistrictSel((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  const sortHeader = (label: string, k: SortKey, align: 'left' | 'right' = 'left') => (
    <th
      className={`px-3 py-2 font-semibold text-slate-700 cursor-pointer select-none ${align === 'right' ? 'text-right' : 'text-left'}`}
      onClick={() => toggleSort(k)}
    >
      {label}{sortKey === k ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
    </th>
  );

  const accent = isHempire ? 'bg-[var(--brand-secondary)] text-white' : 'bg-slate-900 text-white';

  return (
    <Shell role="director" hotkeys={HOTKEYS}>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Growers — Part 1 (Seedlings Cohort)</h1>
          <p className="text-sm text-slate-500">
            {project ? `Project ${project.code ?? project.id.slice(0, 8)}` : 'Loading project…'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${accent}`}>Total: {filtered.length}</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
            Mapped Ha: {formatNum(totalMappedHa)}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
            Disbursement: {formatRand(totalDisbursement)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${outlierCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
            Outliers: {outlierCount}
          </span>
        </div>
      </div>

      {error ? (
        <div className="mb-4 p-3 rounded-lg border border-red-300 bg-red-50 text-red-800 text-sm">
          {error}
        </div>
      ) : null}

      {/* ─────────────────────────────────────────────────────────────────────
          WIDGET: Total Allocated for Disbursement
          Headline KPI card. Recomputes live from the filtered set so the
          number reflects whatever district / coordinator / outlier filters
          the user has applied — defaults to all 46 growers, R536,589.80.
          ───────────────────────────────────────────────────────────────────── */}
      <Card className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Headline number */}
          <div className="md:col-span-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total allocated for disbursement
            </div>
            <div className={`text-4xl font-bold mt-1 ${isHempire ? 'text-[var(--brand-primary)]' : 'text-slate-900'}`}>
              {formatRand(totalDisbursement)}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {filtered.length === growers.length
                ? `Across all ${filtered.length} Part 1 growers`
                : `${filtered.length} of ${growers.length} growers (filtered)`}
            </div>
            <div className="mt-3 inline-flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
              <span className="font-mono">R 7 350,00</span>
              <span>mech</span>
              <span>+</span>
              <span className="font-mono">R 3 618,72</span>
              <span>labour</span>
              <span>=</span>
              <span className="font-semibold text-slate-700 font-mono">R 10 968,72 / Ha</span>
            </div>
          </div>

          {/* Sub-metrics */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Funded Ha</div>
              <div className="text-lg font-semibold tabular-nums">{formatNum(totalFundedHa)}</div>
            </div>
            <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Mechanisation</div>
              <div className="text-lg font-semibold tabular-nums">{formatRand(totalMechanisation)}</div>
            </div>
            <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Labour</div>
              <div className="text-lg font-semibold tabular-nums">{formatRand(totalLabour)}</div>
            </div>
            <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">Avg / grower</div>
              <div className="text-lg font-semibold tabular-nums">{formatRand(avgPerGrower)}</div>
            </div>
          </div>
        </div>

        {/* Progress vs Part 1 envelope */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-700 font-medium">
              Allocated vs Part 1 (Seedlings Cohort) budget envelope
            </span>
            <span className="font-semibold text-slate-900 tabular-nums">
              {pctOfPart1.toFixed(1)}% &nbsp;
              <span className="text-slate-500 font-normal">of R 3 200 000</span>
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isHempire ? 'bg-[var(--brand-secondary)]' : 'bg-slate-900'}`}
              style={{ width: `${Math.min(100, pctOfPart1)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 tabular-nums">
            <span>Allocated: {formatRand(totalDisbursement)}</span>
            <span>Remaining envelope: {formatRand(PART1_BUDGET - totalDisbursement)}</span>
          </div>
        </div>
      </Card>

      <Card title="Filters" className="mb-4">
        <div className="flex flex-wrap gap-4 items-start">
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">District</div>
            <div className="flex flex-wrap gap-1 max-w-md">
              {districts.length === 0 ? <span className="text-xs text-slate-400">—</span> : districts.map((d) => {
                const on = districtSel.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => toggleDistrict(d)}
                    className={`px-2 py-1 rounded-full text-xs border ${on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'}`}
                  >{d}</button>
                );
              })}
              {districtSel.length > 0 && (
                <button onClick={() => setDistrictSel([])} className="px-2 py-1 rounded-full text-xs text-slate-500 underline">Clear</button>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Coordinator</div>
            <select
              value={coordSel}
              onChange={(e) => setCoordSel(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 text-sm"
            >
              <option value="">All</option>
              {coordinators.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Outlier</div>
            <select
              value={outlierSel}
              onChange={(e) => setOutlierSel(e.target.value as OutlierFilter)}
              className="border border-slate-300 rounded px-2 py-1 text-sm"
            >
              <option value="all">Show all</option>
              <option value="outliers">Outliers only</option>
              <option value="normal">Normal only</option>
            </select>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-600 mb-1">Status</div>
            <select
              value={statusSel}
              onChange={(e) => setStatusSel(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 text-sm"
            >
              <option value="">All</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin h-6 w-6 border-2 border-slate-300 border-t-slate-700 rounded-full" />
            <span className="ml-3 text-sm text-slate-600">Loading growers…</span>
          </div>
        ) : growers.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-slate-700 mb-1">No growers in this project yet.</p>
            <p className="text-xs text-slate-500">
              Run the seed script to load the 46 growers from the Excel report.{' '}
              <a className="underline text-slate-700" href="/docs/seeding-growers" target="_blank" rel="noreferrer">View docs</a>
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">No growers match the current filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  {sortHeader('#', 'externalRef')}
                  {sortHeader('Grower', 'fullName')}
                  {sortHeader('Farm / business', 'farmName')}
                  {sortHeader('District', 'district')}
                  {sortHeader('Region', 'region')}
                  {sortHeader('Coordinator', 'coordinator')}
                  {sortHeader('Seedlings recv.', 'seedlingsReceived', 'right')}
                  {sortHeader('Mapped Ha', 'mappedHa', 'right')}
                  {sortHeader('Theoretical Ha', 'theoreticalHa', 'right')}
                  {sortHeader('Outlier', 'outlierFlag')}
                  {sortHeader('Funded Ha', 'fundedHa', 'right')}
                  {sortHeader('Disbursement', 'amountTotal', 'right')}
                  <th className="px-3 py-2 font-semibold text-slate-700 text-left">Process</th>
                  {sortHeader('Status', 'status')}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((g) => {
                  const open = expandedId === g.id;
                  return (
                    <Fragment key={g.id}>
                      <tr
                        onClick={() => setExpandedId(open ? null : g.id)}
                        className={`cursor-pointer ${open ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                      >
                        <Td className="font-mono text-xs text-slate-600">{g.externalRef ?? '—'}</Td>
                        <Td className="font-medium">{g.fullName}</Td>
                        <Td className="text-slate-600">{g.farmName ?? '—'}</Td>
                        <Td>{g.district ?? '—'}</Td>
                        <Td className="text-slate-600">{g.region ?? '—'}</Td>
                        <Td>{g.coordinator ?? '—'}</Td>
                        <Td className="text-right tabular-nums">{g.seedlingsReceived ?? '—'}</Td>
                        <Td className="text-right tabular-nums">{formatNum(g.mappedHa)}</Td>
                        <Td className="text-right tabular-nums text-slate-600">{formatNum(g.theoreticalHa)}</Td>
                        <Td>
                          <span className="inline-flex items-center gap-1.5">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${g.outlierFlag ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                            <span className="text-xs text-slate-600">{g.outlierFlag ? 'Outlier' : 'Normal'}</span>
                          </span>
                        </Td>
                        <Td className="text-right tabular-nums">{formatNum(g.disbursement?.fundedHa)}</Td>
                        <Td className="text-right tabular-nums">{formatRand(g.disbursement?.amountTotal)}</Td>
                        <Td>
                          {g.disbursement?.processStatus ? (
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${statusPillClasses(g.disbursement.processStatus)}`}>
                              {g.disbursement.processStatus}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </Td>
                        <Td>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 capitalize">{g.status ?? '—'}</span>
                        </Td>
                      </tr>
                      {open ? (
                        <tr className="bg-slate-50">
                          <td colSpan={14} className="px-5 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              <div>
                                <div className="font-semibold text-slate-700 mb-1">Seedlings</div>
                                <div>Planned: {g.seedlingsPlanned ?? '—'}</div>
                                <div>Received: {g.seedlingsReceived ?? '—'}</div>
                                <div>Delivery gap: {g.deliveryGap ?? '—'}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700 mb-1">Hectares</div>
                                <div>Planned Ha: {formatNum(g.plannedHa)}</div>
                                <div>Mapped Ha: {formatNum(g.mappedHa)}</div>
                                <div>Theoretical Ha: {formatNum(g.theoreticalHa)}</div>
                              </div>
                              <div>
                                <div className="font-semibold text-slate-700 mb-1">Disbursement</div>
                                <div>Funded Ha: {formatNum(g.disbursement?.fundedHa)}</div>
                                <div>Mechanisation: {formatRand(g.disbursement?.amountMechanisation)}</div>
                                <div>Labour: {formatRand(g.disbursement?.amountLabour)}</div>
                                <div>Total: <strong>{formatRand(g.disbursement?.amountTotal)}</strong></div>
                                <div>Status: {g.disbursement?.status ?? '—'}</div>
                              </div>
                              {g.notes ? (
                                <div className="md:col-span-3">
                                  <div className="font-semibold text-slate-700 mb-1">Notes</div>
                                  <div className="text-slate-600">{g.notes}</div>
                                </div>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </Shell>
  );
}
