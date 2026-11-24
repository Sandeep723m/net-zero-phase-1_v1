import { useState } from 'react';
import { ArrowRight, BarChart3, Bell, Mail, Plus } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Screen10_ActivityDashboard } from './Screen10_ActivityDashboard';
import { hasValidationIssue, isPendingReview, isWithinPeriod, needsAttention } from './ledgerRecords';

const number = new Intl.NumberFormat(undefined, { maximumFractionDigits: 3 });
const panelClass = 'rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)]';
const linkClass = 'inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-[var(--action-primary)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]';
const selectClass = 'h-9 min-w-0 max-w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]';

export function InventoryOverview() {
  const {
    currentTenant, currentRole, currentUser, records, sites, periods, activePeriod, setActivePeriodId,
    notifications, navigateToScreen, setSearchQuery, setActiveFilterSite, setActiveFilterStatus,
  } = useApp();

  const [selectedFacility, setSelectedFacility] = useState('all');
  const allowedSites = sites.filter((site) => currentUser.siteScope.includes('all') || currentUser.siteScope.includes(site.id));
  const facility = allowedSites.find((site) => site.id === selectedFacility);
  const facilityId = facility?.id ?? 'all';
  const periodRecords = records.filter((record) =>
    isWithinPeriod(record, activePeriod) &&
    allowedSites.some((site) => site.id === record.siteId) &&
    (facilityId === 'all' || record.siteId === facilityId),
  );
  const pending = periodRecords.filter(isPendingReview).length;
  const attention = periodRecords.filter(needsAttention).length;
  const readyInputs = periodRecords.filter((record) => record.evidenceFiles.length > 0 && !hasValidationIssue(record)).length;
  const recorded = periodRecords.filter((record) => !hasValidationIssue(record) && Number.isFinite(record.emissions_tCO2e));
  const total = recorded.reduce((sum, record) => sum + record.emissions_tCO2e, 0);
  const unread = notifications.filter((notification) => !notification.isRead).length;

  function openLedger(status: string) {
    setSearchQuery('');
    setActiveFilterSite(facilityId);
    setActiveFilterStatus(status);
    navigateToScreen('10_activity_dashboard', 'FLOW_B');
  }

  const metrics = [
    { label: 'Recorded emissions', value: recorded.length ? number.format(total) : '—', unit: recorded.length ? 'tCO₂e' : '', detail: recorded.length ? 'Provisional activity estimates' : 'No usable emissions estimates' },
    { label: 'Data completeness', value: periodRecords.length ? `${Math.round(100 * readyInputs / periodRecords.length)}%` : '—', detail: periodRecords.length ? `${readyInputs} of ${periodRecords.length} records have evidence and no validation issues` : 'No records for this selection' },
    { label: 'Needs attention', value: String(attention), detail: 'Evidence gaps, validation issues or returns', filter: 'attention' },
    { label: 'Pending review', value: String(pending), detail: 'Submitted or under review', filter: 'pending' },
  ];

  return (
    <div className="w-full pb-3 text-[var(--text-primary)]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-[var(--text-secondary)]">{currentTenant.name}</p>
          <h1 className="sr-only">Overview</h1>
          <div role="group" aria-label="Reporting context" className="flex flex-wrap items-end gap-3">
            <label className="grid max-w-full gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
              Reporting period
              <select className={selectClass} value={activePeriod?.id ?? ''} onChange={(event) => setActivePeriodId(event.target.value)}>
                {!periods.length && <option value="">No periods</option>}
                {periods.map((period) => <option key={period.id} value={period.id}>{period.name}{period.locked ? ' (locked)' : ''}</option>)}
              </select>
            </label>
            <label className="grid max-w-full gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
              Facility
              <select className={selectClass} value={facilityId} onChange={(event) => setSelectedFacility(event.target.value)}>
                <option value="all">All facilities in view</option>
                {allowedSites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}
              </select>
            </label>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" title="Notifications" aria-label={unread ? `Notifications (${unread} unread)` : 'Notifications'} onClick={() => navigateToScreen('34_reviewer_notification', 'FLOW_F')} className={`${selectClass} relative grid size-9 place-items-center px-0 hover:bg-[var(--bg-canvas)]`}>
            <Bell className="size-4" aria-hidden="true" />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[var(--action-primary)]" aria-hidden="true" />}
          </button>
          <button type="button" title="Mail – verifier queries" aria-label="Mail – verifier queries" onClick={() => navigateToScreen('33_raise_query', 'FLOW_F')} className={`${selectClass} grid size-9 place-items-center px-0 hover:bg-[var(--bg-canvas)]`}>
            <Mail className="size-4" aria-hidden="true" />
          </button>
          <a href="https://tula-karbon-ze-d1.vercel.app/" className="enterprise-btn-coral">
            <BarChart3 className="size-4" aria-hidden="true" />Analytic report
          </a>
          {(currentRole === 'TENANT_ADMIN' || currentRole === 'DATA_ENTRY') && activePeriod && !activePeriod.locked && (
            <button type="button" className="enterprise-btn-primary" onClick={() => {
              setActiveFilterSite(facilityId);
              navigateToScreen('11_entry_form', 'FLOW_B');
            }}>
              <Plus className="size-4" aria-hidden="true" />Add activity
            </button>
          )}
        </div>
      </header>

      <section aria-label="Inventory metrics" className={`${panelClass} mt-6 grid grid-cols-1 divide-y divide-[var(--border-subtle)] min-[480px]:grid-cols-2 min-[480px]:divide-y-0 xl:grid-cols-4`}>
        {metrics.map(({ label, value, unit, detail, filter }, index) => (
          <article key={label} className={`p-4 sm:p-5 ${index % 2 ? 'min-[480px]:border-l' : ''} ${index >= 2 ? 'min-[480px]:border-t xl:border-t-0' : ''} ${index === 2 ? 'xl:border-l' : ''} border-[var(--border-subtle)]`}>
            <h2 className="text-sm font-medium">{filter ? <button type="button" className={linkClass} onClick={() => openLedger(filter)}>{label}<ArrowRight className="size-3.5" aria-hidden="true" /></button> : label}</h2>
            <p className="mt-2 text-[28px] leading-9 font-semibold tabular-nums">{value}{unit && <span className="ml-1.5 text-sm font-medium text-[var(--text-secondary)]">{unit}</span>}</p>
            <p className="mt-1 text-xs leading-4 text-[var(--text-secondary)]">{detail}</p>
          </article>
        ))}
      </section>

      <section aria-labelledby="overview-ledger-heading" className="mt-2 min-w-0">
        <Screen10_ActivityDashboard overview={{
          facilityId,
          onFacilityChange: setSelectedFacility,
        }} />
      </section>
    </div>
  );
}
