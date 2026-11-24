import { useId, useState } from 'react';
import { BarChart3, CalendarDays, Check, CircleCheck, Clock3, Download, Pause, Search, TrendingUp } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import {
  Area, AreaChart, Bar, BarChart, BarStack, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, useActiveTooltipLabel,
  useIsTooltipActive,
} from 'recharts';
import { useApp } from '../../../context/AppContext';
import { StatusBadge } from '../../common/StatusBadge';
import { hasValidationIssue } from '../FlowB_ActivityData/ledgerRecords';
import {
  getMonthlyEmissions, getReportRecords, hasUsableEmissions, rankEmitters, reportScopes, sumEmissions,
} from './visualReportData';
import type { ReportScope } from './visualReportData';
import './VisualReport.css';

const number = new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 });
const compact = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });
const percent = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 1 });
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]';
const card = 'visual-report-card flex min-w-0 flex-col rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 hover:border-[var(--border-strong)] hover:shadow-sm sm:p-6';
const inset = 'rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]/85';
const selectable = `${focus} ${inset} transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-canvas)] aria-pressed:border-[var(--action-primary)] aria-pressed:bg-[var(--bg-subtle)] active:border-[var(--action-primary)] motion-reduce:transition-none`;
const control = `${focus} inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 text-xs font-medium hover:bg-[var(--bg-subtle)] active:bg-[var(--bg-canvas)] disabled:opacity-50 motion-safe:transition-colors`;
const segment = `${focus} inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] aria-pressed:bg-[var(--action-primary)] aria-pressed:text-[var(--action-primary-text)] active:opacity-80 motion-safe:transition-colors`;
const chartToggleButton = `${focus} grid size-7 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] aria-pressed:bg-[var(--action-primary)] aria-pressed:text-[var(--action-primary-text)] active:opacity-80 motion-safe:transition-colors`;
const segmentGroup = 'flex flex-wrap gap-0.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5';
const pill = `${focus} inline-flex items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-canvas)] px-2.5 py-1 text-[11px] font-medium hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] aria-pressed:border-[var(--action-primary)] aria-pressed:bg-[var(--bg-subtle)] motion-safe:transition-colors`;
const heading = 'text-lg leading-6 font-semibold tracking-tight';
const muted = 'text-[13px] leading-5 text-[var(--text-secondary)]';
const caption = 'text-[11px] leading-4 text-[var(--text-secondary)]';
const allScopes: ReportScope[] = ['Total', ...reportScopes.map(({ id }) => id)];
const sampleProjects = [
  { label: 'In progress', count: 23, color: 'var(--visual-report-scope-2)', iconColor: 'var(--scope-2)', Icon: Clock3 },
  { label: 'Completed', count: 13, color: 'var(--scope-1)', iconColor: 'var(--scope-1)', Icon: CircleCheck },
  { label: 'In review', count: 3, color: 'var(--visual-report-scope-3)', iconColor: 'var(--visual-report-scope-3)', Icon: Search },
  { label: 'On hold', count: 3, color: 'var(--status-neutral)', iconColor: 'var(--status-neutral)', Icon: Pause },
];
const projectTotal = sampleProjects.reduce((total, { count }) => total + count, 0);

const scopeShapes = {
  Total: 'h-0.5 w-3 rounded-full',
  'Scope 1': 'size-2.5 rounded-full',
  'Scope 2': 'size-2.5 rounded-xs',
  'Scope 3': 'size-2 rotate-45 rounded-xs',
};

function ScopeSymbol({ scope }: { scope: ReportScope }) {
  const color = reportScopes.find(({ id }) => id === scope)?.color ?? 'var(--text-primary)';
  return <span className={`inline-block shrink-0 ${scopeShapes[scope]}`} style={{ backgroundColor: color }} aria-hidden="true" />;
}

const ringPath = 'M 110 12 A 98 98 0 1 1 110 208 A 98 98 0 1 1 110 12';
const gaugePath = 'M 12 110 A 98 98 0 0 1 208 110';

function RoundedSegments({ parts, gauge = false }: {
  parts: { amount: number; color: string; highlighted: boolean; active?: boolean; onPreview?: (active: boolean) => void; onSelect?: () => void }[];
  gauge?: boolean;
}) {
  const visible = parts.filter(({ amount }) => amount > 0);
  const total = visible.reduce((sum, { amount }) => sum + amount, 0);
  const path = gauge ? gaugePath : ringPath;
  let offset = 0;

  return (
    <svg viewBox={gauge ? '0 0 220 122' : '0 0 220 220'} fill="none" strokeWidth={18} strokeLinecap="round" aria-hidden="true" className="visual-report-ring pointer-events-none absolute inset-0 h-full w-full">
      <path d={path} stroke="var(--bg-subtle)" />
      {visible.map(({ amount, color, highlighted, active, onPreview, onSelect }, index) => {
        const share = amount / total * 100;
        const cap = Math.min(gauge ? 2.9 : 1.6, share * 0.3);
        const start = offset + (visible.length > 1 && (!gauge || index > 0) ? cap : 0);
        offset += share;
        const end = offset - (visible.length > 1 && (!gauge || index < visible.length - 1) ? cap : 0);
        return (
          <path
            key={color} d={path} pathLength={100} stroke={color} strokeDasharray={`${end - start} 100`} strokeDashoffset={-start}
            strokeWidth={active ? 20 : 18} opacity={highlighted ? 1 : 0.28}
            className={onSelect ? 'visual-report-scope-arc cursor-pointer' : 'motion-safe:transition-opacity'}
            onPointerEnter={onPreview ? (event) => { if (event.pointerType !== 'touch') onPreview(true); } : undefined}
            onPointerLeave={onPreview ? () => onPreview(false) : undefined}
            onClick={onSelect}
          />
        );
      })}
    </svg>
  );
}

const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'short', timeZone: 'UTC' });
const formatMonth = (id: string) => monthLabel.format(new Date(id + '-01T00:00:00Z'));

function MonthTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const activeMonth = useActiveTooltipLabel();
  const tooltipActive = useIsTooltipActive();
  if (!payload) return null;
  const active = tooltipActive && payload.value === activeMonth;
  return (
    <text x={x} y={y} dy="0.32em" textAnchor="middle" fill={active ? 'var(--action-primary)' : 'var(--text-secondary)'} fontWeight={active ? 600 : 500} fontSize={12} fontFamily="var(--font-sans)">
      {formatMonth(payload.value)}
    </text>
  );
}

function Meter({ width, parts }: { width: number; parts: { color: string; share: number }[] }) {
  return (
    <span className="block h-1.5 overflow-hidden rounded-full bg-[var(--bg-subtle)]" aria-hidden="true">
      <span className="visual-report-meter flex h-full overflow-hidden rounded-full" style={{ width: `${width}%` }}>
        {parts.map(({ color, share }) => (
          <span key={color} className="h-full border-r border-[var(--bg-surface)] last:border-r-0" style={{ width: `${share}%`, backgroundColor: color }} />
        ))}
      </span>
    </span>
  );
}

export function VisualReport() {
  const { activePeriod, periods, currentTenant, currentUser, records, sites, navigateToScreen } = useApp();
  const [periodId, setPeriodId] = useState(activePeriod?.id ?? '');
  const [scope, setScope] = useState<ReportScope>('Total');
  const [hoveredScope, setHoveredScope] = useState<ReportScope | null>(null);
  const [trendScope, setTrendScope] = useState<ReportScope>('Total');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [emitterMode, setEmitterMode] = useState<'source' | 'facility'>('facility');
  const [selectedEmitterId, setSelectedEmitterId] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const chartFill = useId().replaceAll(':', '');
  const period = periods.find(({ id }) => id === periodId) ?? activePeriod;
  const allowedSites = new Set<string>(sites.filter(({ id }) => currentUser.siteScope.includes('all') || currentUser.siteScope.includes(id)).map(({ id }) => id));
  const periodRecords = getReportRecords(records, period, allowedSites);
  const reportRecords = periodRecords.filter(hasUsableEmissions);
  const gross = sumEmissions(reportRecords);
  const previousPeriod = periods.filter(({ endDate }) => period && endDate < period.startDate)
    .sort((left, right) => right.endDate.localeCompare(left.endDate))[0];
  const previousRecords = getReportRecords(records, previousPeriod, allowedSites).filter(hasUsableEmissions);
  const scopeTotals = reportScopes.map((item) => {
    const entries = reportRecords.filter((record) => record.scope === item.id);
    return { ...item, hasRecords: entries.length > 0, total: sumEmissions(entries) };
  });
  const shareTotal = scopeTotals.reduce((sum, item) => sum + Math.max(0, item.total), 0);
  const byScope = scopeTotals.map((item) => ({
    ...item,
    share: shareTotal > 0 && item.hasRecords && item.total >= 0 ? item.total / shareTotal : null,
  }));
  const shownScope = hoveredScope ?? scope;
  const selectedScope = byScope.find(({ id }) => id === shownScope);
  const donutValue = selectedScope?.total ?? gross;
  const donutHasRecords = selectedScope?.hasRecords ?? reportRecords.length > 0;
  const ringParts = byScope.map(({ id, total, color }) => ({
    amount: total, color, highlighted: shownScope === 'Total' || shownScope === id, active: shownScope === id,
    onPreview: (active: boolean) => setHoveredScope(active ? id : null),
    onSelect: () => setScope((selected) => selected === id ? 'Total' : id),
  }));
  const monthly = period ? getMonthlyEmissions(reportRecords, period) : [];
  const monthlyValue = (point: typeof monthly[number]) => trendScope === 'Total' ? point.emissions : point[trendScope] ?? null;
  const hasTrend = monthly.some((point) => monthlyValue(point) !== null);
  const trendSeries = reportScopes.filter(({ id }) => trendScope === 'Total' || trendScope === id);
  const rankedEmitters = rankEmitters(reportRecords, emitterMode);
  const emitters = rankedEmitters.slice(0, 5);
  const selectedEmitter = emitters.find(({ id }) => id === selectedEmitterId);
  const siteCount = new Set(reportRecords.map(({ siteId }) => siteId)).size;
  const shownProject = hoveredProject ?? projectStatus;
  const activeProjectStatus = sampleProjects.find(({ label }) => label === shownProject);
  const rankedTotal = rankedEmitters.reduce((sum, { total }) => sum + total, 0);
  const topContribution = emitters.reduce((sum, { total }) => sum + total, 0);
  const summaries = [
    { label: previousPeriod ? `Previous period · ${previousPeriod.name}` : 'Previous period', value: previousRecords.length ? `${number.format(sumEmissions(previousRecords))} tCO₂e` : 'No data' },
    { label: 'Facilities reporting', value: number.format(siteCount) },
    { label: 'Records included', value: number.format(reportRecords.length) },
  ];
  const recordStatuses = [
    { status: 'Approved', label: 'Approved', count: periodRecords.filter((record) => record.status === 'Approved').length },
    { status: 'Warning', label: 'Needs evidence', count: periodRecords.filter((record) => !record.evidenceFiles.length).length },
    { status: 'Error', label: 'Validation issues', count: periodRecords.filter(hasValidationIssue).length },
    { status: 'Submitted', label: 'Submitted', count: periodRecords.filter((record) => record.status === 'Submitted').length },
  ];

  function downloadReport() {
    const rows = [
      ['Reporting period', 'Date', 'Record ID', 'Facility', 'Source', 'Scope', 'Recorded tCO2e'],
      ...reportRecords.map((record) => [period?.name ?? '', record.date, record.id, record.siteName, record.sourceName, record.scope, record.emissions_tCO2e]),
    ];
    const csv = rows.map((row) => row.map((value) => {
      if (typeof value === 'number') return String(value);
      const safe = /^[\s]*[=+@-]|^[\t\r\n]/.test(value) ? "'" + value : value;
      return '"' + safe.replaceAll('"', '""') + '"';
    }).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `tula-visual-report-${period?.startDate ?? 'export'}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const trendTooltip = <Tooltip
    position={{ y: 0 }}
    cursor={chartType === 'area' ? { stroke: 'var(--action-primary)', strokeDasharray: '3 3' } : { fill: 'var(--bg-subtle)', opacity: 0.5, radius: 6 }}
    content={({ active, label }) => {
      const point = monthly.find(({ id }) => id === label);
      if (!active || !point || monthlyValue(point) == null) return null;
      const total = monthlyValue(point);
      const contributions = trendSeries.filter(({ id }) => point[id] !== undefined);
      return (
        <div className="w-max max-w-[min(23rem,calc(100vw-5rem))] rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3 text-[var(--text-primary)] shadow-lg">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs">
            <strong>{point.month} {point.id.slice(0, 4)}</strong>
            <span className="text-[var(--text-secondary)]">{trendScope} <strong className="ml-1 font-mono text-sm text-[var(--text-primary)]">{number.format(total)}</strong> tCO₂e</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {contributions.map(({ id, color }) => {
              const value = point[id];
              return (
                <span key={id} className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px]" style={{ backgroundColor: `color-mix(in srgb, ${color} 9%, var(--bg-elevated))`, borderColor: `color-mix(in srgb, ${color} 30%, var(--border-default))` }}>
                  <ScopeSymbol scope={id} />{id} <strong className="font-mono">{number.format(value)} t</strong>
                  {trendScope === 'Total' && total > 0 && value >= 0 && value <= total && <span className="font-mono">({percent.format(value / total)})</span>}
                </span>
              );
            })}
          </div>
        </div>
      );
    }}
  />;

  return (
    <div className="visual-report mx-auto w-full max-w-[1440px] space-y-5 pb-4 font-sans text-[var(--text-primary)] sm:space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={muted}>{currentTenant.name}</p>
          <h1 className="mt-1 text-xl leading-[26px] font-semibold tracking-tight md:text-2xl md:leading-[30px]">Visual report</h1>
          <p className={`mt-1 ${muted}`}>Emissions and portfolio activity for {period?.name ?? 'the selected reporting period'}.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={downloadReport} disabled={!reportRecords.length} className={control}><Download className="size-4" aria-hidden="true" />Download CSV</button>
          <label className="relative">
            <span className="sr-only">Reporting period</span>
            <CalendarDays className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-[var(--text-secondary)]" aria-hidden="true" />
            <select value={period?.id ?? ''} onChange={(event) => { setPeriodId(event.target.value); setSelectedEmitterId(null); }} className={`${control} pl-8`}>
              {!periods.length && <option value="">No periods available</option>}
              {periods.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
            </select>
          </label>
        </div>
      </header>

      <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:gap-5">
        <section aria-labelledby="visual-report-emissions" className={card}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="visual-report-emissions" className={heading}>Total CO₂e emissions</h2>
              <p className={muted}>{currentTenant.consolidationApproach} boundary · provisional activity estimates</p>
            </div>
            <div role="group" aria-label="Emissions scope" className={segmentGroup}>
              {allScopes.map((option) => <button type="button" key={option} aria-pressed={scope === option} onClick={() => setScope(option)} className={segment}>{option}</button>)}
            </div>
          </div>

          <div className="my-6 grid items-center gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative grid size-40 place-items-center sm:size-44">
                <RoundedSegments parts={ringParts} />
                <div className="pointer-events-none relative grid justify-items-center gap-1 text-center" aria-live="polite">
                  <p className="text-3xl leading-none font-semibold tabular-nums" title={donutHasRecords ? number.format(donutValue) : undefined}>{donutHasRecords ? compact.format(donutValue) : '—'}</p>
                  <p className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"><ScopeSymbol scope={shownScope} />{shownScope} · tCO₂e</p>
                  {selectedScope && (selectedScope.share !== null || !donutHasRecords) && (
                    <span className="visual-report-scope-state mt-1 rounded-full border px-2 py-0.5 text-[11px] font-medium tabular-nums" data-highlighted="true" style={{ '--report-item-color': selectedScope.color }}>
                      {donutHasRecords ? percent.format(selectedScope.share) : 'No data'}
                    </span>
                  )}
                </div>
              </div>
              <div role="group" aria-label="Scope legend" className="flex max-w-72 flex-wrap justify-center gap-2">
                {byScope.map(({ id, color, share, hasRecords }) => (
                  <button type="button" key={id} className={`${pill} visual-report-scope-state`} style={{ '--report-item-color': color }} data-highlighted={shownScope === id} aria-pressed={scope === id} onPointerEnter={(event) => { if (event.pointerType !== 'touch') setHoveredScope(id); }} onPointerLeave={() => setHoveredScope(null)} onClick={() => setScope(scope === id ? 'Total' : id)}>
                    <ScopeSymbol scope={id} />{id}
                    {share !== null && <span className="tabular-nums text-[var(--text-secondary)]">{percent.format(share)}</span>}
                    {!hasRecords && <span className="text-[var(--text-secondary)]">No data</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className={`${inset} p-3`}>
                <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold"><span>{selectedScope ? `${selectedScope.id} · ${selectedScope.label}` : 'Recorded emissions'}</span><span className="tabular-nums">{donutHasRecords ? `${number.format(donutValue)} tCO₂e` : 'No data'}</span></div>
                <p className={`mt-1 ${muted}`}>{selectedScope ? `Recorded ${selectedScope.label.toLowerCase()} during this period.` : 'Includes usable estimates from the selected period.'}</p>
              </div>
              {byScope.map(({ id, label, total, color, hasRecords, share }) => (
                <button type="button" key={id} className={`${selectable} visual-report-scope-state block w-full space-y-2 rounded-xl p-3 text-left`} style={{ '--report-item-color': color }} data-highlighted={shownScope === id} aria-pressed={scope === id} onPointerEnter={(event) => { if (event.pointerType !== 'touch') setHoveredScope(id); }} onPointerLeave={() => setHoveredScope(null)} onClick={() => setScope(scope === id ? 'Total' : id)}>
                  <span className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-0.5">
                    <span className="inline-flex items-center gap-2 text-[13px] font-semibold"><ScopeSymbol scope={id} />{id}</span>
                    <strong className="text-right text-xs tabular-nums">{hasRecords ? `${number.format(total)} t` : '—'}</strong>
                    <span className={caption}>{label}</span>
                    <span className="inline-flex items-center justify-end gap-1.5 text-right text-[11px] text-[var(--text-secondary)] tabular-nums">
                      {share !== null ? percent.format(share) : hasRecords ? '—' : 'No data'}
                      {scope === id && <Check className="size-3.5 shrink-0 text-[var(--action-primary)]" aria-hidden="true" />}
                    </span>
                  </span>
                  <Meter width={shareTotal ? Math.max(0, total) / shareTotal * 100 : 0} parts={[{ color, share: 100 }]} />
                </button>
              ))}
            </div>
          </div>

          <dl className="mt-auto grid gap-2 sm:grid-cols-3">
            {summaries.map(({ label, value }) => <div key={label} className={`${inset} p-3 hover:border-[var(--border-strong)] motion-safe:transition-colors`}><dt className={caption}>{label}</dt><dd className="mt-1 text-sm font-semibold tabular-nums">{value}</dd></div>)}
          </dl>
          {periodRecords.length > 0 && <div role="group" aria-label="Activity record statuses" className="mt-3 flex flex-wrap gap-2">
            {recordStatuses.map(({ status, label, count }) => (
              <span key={status}><StatusBadge status={status} size="sm" customLabel={`${label} · ${count}`} /></span>
            ))}
          </div>}
        </section>

        <section aria-labelledby="visual-report-projects" className={card} style={{ animationDelay: '45ms' }}>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 id="visual-report-projects" className={heading}>Project status</h2>
            <span className="rounded-md bg-[var(--status-neutral-bg)] px-2 py-0.5 text-[11px] text-[var(--text-primary)]">Sample data</span>
          </div>
          <p className={`${muted} border-b border-[var(--border-subtle)] pb-4`}>Carbon offset and removal portfolio</p>

          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8">
            <div className="relative aspect-[220/122] w-56 max-w-full">
              <RoundedSegments gauge parts={sampleProjects.map(({ label, count, color }) => ({
                amount: count, color, highlighted: !shownProject || shownProject === label,
              }))} />
              <div className="absolute inset-x-4 bottom-0 text-center" aria-live="polite">
                <p className="text-4xl leading-none font-semibold tabular-nums">{activeProjectStatus?.count ?? projectTotal}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{activeProjectStatus?.label ?? 'Sample projects'}</p>
              </div>
            </div>
            <p className="rounded-full border border-[var(--border-default)] bg-[var(--bg-subtle)] px-3 py-1.5 text-center text-xs text-[var(--action-primary)]">Showing {projectTotal} sample projects</p>
          </div>

          <div role="group" aria-label="Sample project statuses" className="grid grid-cols-2 gap-2 border-t border-[var(--border-subtle)] pt-4">
            {sampleProjects.map(({ label, count, color, iconColor, Icon }) => (
              <button type="button" key={label} aria-pressed={projectStatus === label} onPointerEnter={(event) => { if (event.pointerType !== 'touch') setHoveredProject(label); }} onPointerLeave={() => setHoveredProject(null)} onClick={() => setProjectStatus(projectStatus === label ? null : label)} className={`${selectable} flex min-h-10 items-center gap-2 rounded-xl px-2.5 text-left text-xs ${shownProject === label ? 'border-[var(--action-primary)] bg-[var(--bg-subtle)]' : ''}`}>
                <span className="grid size-6 shrink-0 place-items-center rounded-md" style={{ color: iconColor, backgroundColor: `color-mix(in srgb, ${color} 12%, var(--bg-surface))` }}>
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <span>{label}</span><strong className="ml-auto tabular-nums">{count}</strong>
              </button>
            ))}
          </div>
        </section>

        <section aria-labelledby="visual-report-trend" className={card} style={{ animationDelay: '90ms' }}>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
            <div><h2 id="visual-report-trend" className={heading}>Total emissions over months</h2><p className={muted}>Monthly recorded emissions · tCO₂e</p></div>
            <div className="flex flex-wrap gap-2">
              <div role="group" aria-label="Chart type" className="flex gap-0.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-subtle)] p-1">
                <button type="button" title="Area chart" aria-label="Area chart" aria-pressed={chartType === 'area'} onClick={() => setChartType('area')} className={chartToggleButton}><TrendingUp className="size-4" aria-hidden="true" /></button>
                <button type="button" title="Bar chart" aria-label="Bar chart" aria-pressed={chartType === 'bar'} onClick={() => setChartType('bar')} className={chartToggleButton}><BarChart3 className="size-4" aria-hidden="true" /></button>
              </div>
              <select aria-label="Monthly chart scope" className={`${control} rounded-full`} value={trendScope} onChange={(event) => setTrendScope(event.target.value as ReportScope)}>
                {allScopes.map((option) => <option value={option} key={option}>{option === 'Total' ? 'All scopes' : option}</option>)}
              </select>
            </div>
          </div>

          {hasTrend ? (
            <div className="relative mt-4 mb-3 min-h-56 w-full min-w-0 flex-1 sm:min-h-64">
              <ResponsiveContainer className="absolute inset-0" width="100%" height="100%" minWidth={0}>
                {chartType === 'area' ? (
                  <AreaChart data={monthly} margin={{ top: 8, right: 18, left: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id={chartFill} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={trendScope === 'Total' ? 'var(--action-primary)' : trendSeries[0].color} stopOpacity={0.18} />
                        <stop offset="100%" stopColor={trendScope === 'Total' ? 'var(--action-primary)' : trendSeries[0].color} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="4 4" />
                    <XAxis dataKey="id" tickFormatter={formatMonth} tick={<MonthTick />} tickLine={false} axisLine={false} height={24} tickMargin={8} minTickGap={8} fontSize={12} />
                    <YAxis width={43} tickFormatter={(value) => compact.format(value)} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickLine={false} axisLine={false} />
                    {trendTooltip}
                    <Area type="monotone" dataKey={trendScope === 'Total' ? 'emissions' : trendScope} stroke={trendScope === 'Total' ? 'var(--action-primary)' : trendSeries[0].color}
                      strokeWidth={2.5} strokeLinecap="round" fill={`url(#${chartFill})`} dot={{ r: 3, stroke: 'var(--bg-surface)' }} activeDot={{ r: 5, stroke: 'var(--bg-surface)', strokeWidth: 2 }}
                      connectNulls={false} isAnimationActive={!reduceMotion} animationDuration={550} />
                  </AreaChart>
                ) : (
                  <BarChart data={monthly} stackOffset="sign" margin={{ top: 8, right: 18, left: 8, bottom: 0 }}>
                    <XAxis dataKey="id" tickFormatter={formatMonth} tick={<MonthTick />} tickLine={false} axisLine={false} height={24} tickMargin={8} minTickGap={8} fontSize={12} />
                    <YAxis hide />
                    {trendTooltip}
                    <BarStack stackId="emissions" radius={[4, 4, 0, 0]}>
                      {[...trendSeries].reverse().map(({ id, color }) => (
                        <Bar key={id} dataKey={id} name={id} fill={color} maxBarSize={24} isAnimationActive={!reduceMotion} animationDuration={550} />
                      ))}
                    </BarStack>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          ) : <p className={`grid min-h-48 flex-1 place-items-center text-center ${muted}`}>No monthly emissions are available for this selection.</p>}

          <div className="mt-auto flex flex-wrap items-start justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
            <div aria-label="Filter monthly data by scope" role="group" className="flex flex-wrap gap-1.5">
              {allScopes.map((option) => (
                <button type="button" key={option} className={pill} onClick={() => setTrendScope(option)} aria-pressed={trendScope === option}>
                  <ScopeSymbol scope={option} />{option === 'Total' ? 'All scopes' : option}
                </button>
              ))}
            </div>
            {hasTrend && <details className="text-xs text-[var(--text-secondary)]">
              <summary className={`${focus} w-fit cursor-pointer rounded-sm font-medium text-[var(--action-primary)]`}>Monthly values</summary>
              <dl className="mt-2 space-y-1">
                {monthly.map((point) => {
                  const value = monthlyValue(point);
                  return <div key={point.id} className="flex justify-between gap-3"><dt>{point.month} {point.id.slice(0, 4)}</dt><dd className="tabular-nums">{value === null ? 'No data' : `${number.format(value)} tCO₂e`}</dd></div>;
                })}
              </dl>
            </details>}
          </div>
        </section>

        <section aria-labelledby="visual-report-emitters" className={card} style={{ animationDelay: '135ms' }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 id="visual-report-emitters" className={heading}>Top 5 emitters</h2><p className={muted}>Ranked by recorded emissions · tCO₂e</p></div>
            <div role="group" aria-label="Rank emitters by" className={segmentGroup}>
              <button type="button" className={segment} aria-pressed={emitterMode === 'source'} onClick={() => { setEmitterMode('source'); setSelectedEmitterId(null); }}>Sources</button>
              <button type="button" className={segment} aria-pressed={emitterMode === 'facility'} onClick={() => { setEmitterMode('facility'); setSelectedEmitterId(null); }}>Facilities</button>
            </div>
          </div>
          {emitters.length ? (
            <ol className="my-5 space-y-2.5">
              {emitters.map(({ id, name, total, count, scopes }, index) => {
                const site = emitterMode === 'facility' ? sites.find((item) => item.id === id) : undefined;
                const contributions = reportScopes.flatMap((item) => {
                  const amount = scopes[item.id];
                  return amount === undefined ? [] : [{ ...item, amount }];
                });
                const meterParts = contributions.some(({ amount }) => amount < 0)
                  ? [{ color: 'var(--text-secondary)', share: 100 }]
                  : contributions.filter(({ amount }) => amount > 0).map(({ color, amount }) => ({ color, share: amount / total * 100 }));
                return (
                  <li key={id}>
                    <button type="button" aria-pressed={selectedEmitterId === id} onClick={() => setSelectedEmitterId(selectedEmitterId === id ? null : id)} className={`${selectable} block w-full space-y-2 p-3 text-left`}>
                      <span className="flex items-baseline gap-2 text-[13px]">
                        <span aria-hidden="true" className="rounded-md bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[11px]">{String(index + 1).padStart(2, '0')}</span>
                        <span className="min-w-0 flex-1 wrap-anywhere font-medium">{name}</span><strong className="shrink-0 tabular-nums">{number.format(total)} t</strong>
                      </span>
                      <Meter width={total / emitters[0].total * 100} parts={meterParts} />
                      <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <span className={caption}>{site ? [site.location, site.country].filter(Boolean).join(', ') : `${count} ${count === 1 ? 'record' : 'records'}`}</span>
                        <span className="flex flex-wrap gap-1">
                          {contributions.map(({ id: scopeId, amount, color }) => (
                            <span key={scopeId} title={`${scopeId}: ${number.format(amount)} tCO₂e`} className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] px-2 py-0.5 text-[11px]" style={{ backgroundColor: `color-mix(in srgb, ${color} 10%, var(--bg-surface))` }}>
                              <ScopeSymbol scope={scopeId} />{scopeId}
                            </span>
                          ))}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : <p className={`grid min-h-48 flex-1 place-items-center text-center ${muted}`}>No positive emissions to rank for this period.</p>}
          <p className="mt-auto border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-secondary)]" aria-live="polite">
            {selectedEmitter ? `${selectedEmitter.name} · ${selectedEmitter.count} ${selectedEmitter.count === 1 ? 'record' : 'records'} · ${number.format(selectedEmitter.total)} tCO₂e` : emitters.length ? `Listed emitters account for ${percent.format(topContribution / rankedTotal)} of emissions from ${emitterMode === 'facility' ? 'facilities' : 'sources'} with positive totals.` : 'Ranks appear as eligible records are added.'}
          </p>
        </section>
      </div>

      <footer className={`flex flex-wrap items-start justify-between gap-2 ${caption}`}>
        <details className="max-w-prose">
          <summary className={`${focus} w-fit cursor-pointer rounded-sm font-medium text-[var(--action-primary)]`}>Reporting methodology</summary>
          <p className="mt-2 font-serif text-sm leading-6">This report uses saved activity estimates for the selected period and facilities in view. Estimates may include unapproved records. Records with validation issues are excluded from emissions totals.</p>
        </details>
        <button type="button" className={`${focus} rounded-sm font-medium text-[var(--action-primary)] hover:underline`} onClick={() => navigateToScreen('brand_guidelines')}>Brand &amp; design system</button>
      </footer>
    </div>
  );
}
