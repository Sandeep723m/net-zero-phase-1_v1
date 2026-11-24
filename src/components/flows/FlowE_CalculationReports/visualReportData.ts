import type { ActivityRecord, ReportingPeriod } from '../../../types';
import { hasValidationIssue, isWithinPeriod } from '../FlowB_ActivityData/ledgerRecords';

export const reportScopes = [
  { id: 'Scope 1', label: 'Direct emissions', color: 'var(--scope-1)' },
  { id: 'Scope 2', label: 'Purchased energy', color: 'var(--visual-report-scope-2)' },
  { id: 'Scope 3', label: 'Value chain', color: 'var(--visual-report-scope-3)' },
] as const;
type Scope = typeof reportScopes[number]['id'];
export type ReportScope = 'Total' | Scope;
type ScopeValues = Partial<Record<Scope, number>>;

export function getReportRecords(records: ActivityRecord[], period: ReportingPeriod | undefined, allowedSites: Set<string>) {
  return records.filter((record) =>
    allowedSites.has(record.siteId) && isWithinPeriod(record, period),
  );
}

export function hasUsableEmissions(record: ActivityRecord) {
  return !hasValidationIssue(record) && Number.isFinite(record.emissions_tCO2e);
}

export function sumEmissions(records: ActivityRecord[]) {
  return records.reduce((sum, record) => sum + record.emissions_tCO2e, 0);
}

const monthFormat = new Intl.DateTimeFormat(undefined, { month: 'short', timeZone: 'UTC' });

export function getMonthlyEmissions(records: ActivityRecord[], period: ReportingPeriod) {
  const totals = new Map<string, ScopeValues>();
  for (const record of records) {
    const key = record.date.slice(0, 7);
    const scopes = totals.get(key) ?? {};
    scopes[record.scope] = (scopes[record.scope] ?? 0) + record.emissions_tCO2e;
    totals.set(key, scopes);
  }

  const first = new Date(period.startDate.slice(0, 7) + '-01T00:00:00Z');
  const last = new Date(period.endDate.slice(0, 7) + '-01T00:00:00Z');
  const months: ({ id: string; month: string; emissions: number | null } & ScopeValues)[] = [];
  for (const date = first; date <= last; date.setUTCMonth(date.getUTCMonth() + 1)) {
    const id = date.toISOString().slice(0, 7);
    const scopes = totals.get(id);
    const emissions = scopes ? Object.values(scopes).reduce((sum, value) => sum + value, 0) : null;
    months.push({ id, month: monthFormat.format(date), emissions, ...scopes });
  }
  return months;
}

export function rankEmitters(records: ActivityRecord[], groupBy: 'source' | 'facility') {
  const groups = new Map<string, { id: string; name: string; total: number; count: number; scopes: ScopeValues }>();
  for (const record of records) {
    const id = groupBy === 'source' ? record.sourceId || record.sourceName : record.siteId;
    const name = groupBy === 'source' ? record.sourceName : record.siteName;
    const group = groups.get(id) ?? { id, name, total: 0, count: 0, scopes: {} };
    group.total += record.emissions_tCO2e;
    group.count += 1;
    group.scopes[record.scope] = (group.scopes[record.scope] ?? 0) + record.emissions_tCO2e;
    groups.set(id, group);
  }
  return [...groups.values()].filter(({ total }) => total > 0)
    .sort((left, right) => right.total - left.total || left.name.localeCompare(right.name));
}
