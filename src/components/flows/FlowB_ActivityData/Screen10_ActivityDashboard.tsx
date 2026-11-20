import React, { useState } from 'react';
import {
  AlertCircle, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpDown, BadgeCheck, Bell,
  Building2, ChevronDown, Clock3, FilePenLine, Files, FileText, Filter, ListFilter, Mail,
  MoreVertical, Plus, Search, Send, Star,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ActivityRecord } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';

const pageSizes = [5, 3, 1];
const scopes = ['Scope 1', 'Scope 2', 'Scope 3'] as const;
const statusTabs = [
  { value: 'all', label: 'All activity', icon: Star },
  { value: 'Draft', label: 'Draft', icon: FilePenLine },
  { value: 'Submitted', label: 'Submitted', icon: Send },
  { value: 'Under Review', label: 'Under review', icon: Clock3 },
  { value: 'Approved', label: 'Approved', icon: BadgeCheck },
  { value: 'attention', label: 'Needs attention', icon: AlertCircle },
];
const sortOptions = [
  { value: 'id', label: 'Record ID' },
  { value: 'date', label: 'Date' },
  { value: 'source', label: 'Activity' },
  { value: 'site', label: 'Facility' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'emissions', label: 'Emissions' },
] as const;
type SortField = typeof sortOptions[number]['value'];

const controlClass = 'inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-canvas)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)] disabled:opacity-40';
const selectClass = 'h-9 w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-2 text-sm';
const disclosureClass = `${controlClass} cursor-pointer list-none [&::-webkit-details-marker]:hidden`;
const panelClass = 'absolute right-0 top-full z-20 mt-2 space-y-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-3 shadow-md';
const cellClass = 'px-3 py-3.5';
const checkboxClass = 'size-3.5 cursor-pointer rounded accent-[var(--action-primary)]';

function matchesStatus(record: ActivityRecord, status: string) {
  if (status === 'all') return true;
  if (status === 'attention') return record.status === 'Error' || record.status === 'Sent Back';
  return record.status === status;
}

export const Screen10_ActivityDashboard: React.FC = () => {
  const {
    records, sites, activePeriod, currentRole, notifications,
    navigateToScreen, setSelectedRecordId,
    activeFilterSite, setActiveFilterSite, activeFilterStatus, setActiveFilterStatus,
    searchQuery, setSearchQuery,
  } = useApp();

  const [scopeFilter, setScopeFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortAscending, setSortAscending] = useState(false);
  const [requestedPage, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [checkedIds, setCheckedIds] = useState(new Set<string>());

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const searchTerm = searchQuery.trim().toLowerCase();
  const matchingRecords = records.filter((record) => (
    (activeFilterSite === 'all' || record.siteId === activeFilterSite) &&
    (scopeFilter === 'all' || record.scope === scopeFilter) &&
    [record.sourceName, record.siteName, record.id, record.date].some((value) => value.toLowerCase().includes(searchTerm))
  ));
  const sortedRecords = matchingRecords.filter((record) => matchesStatus(record, activeFilterStatus)).sort((a, b) => {
    let comparison;
    switch (sortField) {
      case 'quantity': comparison = a.quantity - b.quantity; break;
      case 'emissions': comparison = a.emissions_tCO2e - b.emissions_tCO2e; break;
      case 'site': comparison = a.siteName.localeCompare(b.siteName); break;
      case 'source': comparison = a.sourceName.localeCompare(b.sourceName); break;
      case 'id': comparison = a.id.localeCompare(b.id); break;
      case 'date': comparison = new Date(a.date).getTime() - new Date(b.date).getTime(); break;
    }
    return sortAscending ? comparison : -comparison;
  });

  const pageCount = Math.ceil(sortedRecords.length / pageSize);
  const page = Math.min(requestedPage, Math.max(1, pageCount));
  const pageStart = (page - 1) * pageSize;
  const pageRecords = sortedRecords.slice(pageStart, pageStart + pageSize);
  const firstVisiblePage = Math.max(1, Math.min(page - 1, pageCount - 2));
  const pageNumbers = pageCount <= 5
    ? Array.from({ length: pageCount }, (_, index) => index + 1)
    : [...new Set([1, firstVisiblePage, firstVisiblePage + 1, firstVisiblePage + 2, pageCount])];
  const checkedCount = records.filter((record) => checkedIds.has(record.id)).length;
  const checkedOnPage = pageRecords.filter((record) => checkedIds.has(record.id)).length;
  const pageIsChecked = checkedOnPage > 0 && checkedOnPage === pageRecords.length;
  const extraFiltersActive = activeFilterSite !== 'all' || scopeFilter !== 'all' ||
    !statusTabs.some((tab) => tab.value === activeFilterStatus);

  function updateStatus(value: string) {
    setActiveFilterStatus(value);
    setPage(1);
  }

  function toggleSort(field: SortField) {
    setPage(1);
    if (sortField === field) {
      setSortAscending((ascending) => !ascending);
    } else {
      setSortField(field);
      setSortAscending(field !== 'date');
    }
  }

  function updateChecked(rows: ActivityRecord[], checked: boolean) {
    setCheckedIds((previous) => {
      const updated = new Set(previous);
      for (const { id } of rows) {
        if (checked) updated.add(id);
        else updated.delete(id);
      }
      return updated;
    });
  }

  function openRecord(record: ActivityRecord) {
    setSelectedRecordId(record.id);
    if (currentRole === 'VERIFIER') navigateToScreen('32_evidence_trace', 'FLOW_F');
    else if (record.status === 'Submitted') navigateToScreen('24_review_approve', 'FLOW_B');
    else if (record.status === 'Error' || record.status === 'Sent Back') navigateToScreen('15_fix_detail_view', 'FLOW_C');
    else navigateToScreen('16_attach_evidence', 'FLOW_B');
  }

  function renderSearch(label: string, className: string) {
    return (
      <label className={`relative block min-w-0 ${className}`}>
        <span className="sr-only">{label}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-secondary)]" aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Search activity records"
          className="h-9 w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] pl-9 pr-3 text-sm placeholder:text-[var(--text-secondary)] focus:border-[var(--border-focus)] focus:outline-none"
        />
      </label>
    );
  }

  const columns = [
    { field: 'id', label: 'Record ID' },
    { field: 'source', label: 'Activity' },
    { field: 'site', label: 'Facility' },
    { field: 'quantity', label: 'Quantity', numeric: true },
    { field: 'emissions', label: 'Emissions', numeric: true },
    { label: 'Evidence' },
    { label: 'Status' },
  ] as const satisfies ReadonlyArray<{ field?: SortField; label: string; numeric?: boolean }>;

  return (
    <div id="screen-10-activity-dashboard" className="text-[var(--text-primary)]">
      <header className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-3 sm:px-6 lg:px-8">
        {renderSearch('Search activity from the overview header', 'w-full max-w-sm')}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={unreadCount ? `Notifications (${unreadCount} unread)` : 'Notifications'}
            title="Notifications"
            onClick={() => navigateToScreen('34_reviewer_notification', 'FLOW_F')}
            className={`${controlClass} relative size-9 px-0`}
          >
            <Bell className="size-4" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[var(--action-primary)]" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            aria-label="Mail – verifier queries"
            title="Mail – verifier queries"
            onClick={() => navigateToScreen('33_raise_query', 'FLOW_F')}
            className={`${controlClass} size-9 px-0`}
          >
            <Mail className="size-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 py-5 sm:py-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Activity data ledger</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-[var(--text-secondary)]">
              <span>{activePeriod.name}</span>
              <span aria-hidden="true">·</span>
              <button type="button" onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')} className="hover:text-[var(--action-primary)] hover:underline">View analytics</button>
            </div>
          </div>
          {currentRole === 'VERIFIER' ? (
            <button type="button" onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')} className="enterprise-btn-primary whitespace-nowrap">
              <Files className="size-4" aria-hidden="true" />Trace docket
            </button>
          ) : (
            <button type="button" onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')} className="enterprise-btn-primary whitespace-nowrap">
              <Plus className="size-4" aria-hidden="true" />Add activity
            </button>
          )}
        </div>

        <section aria-label="Activity data controls" className="mb-4 flex flex-wrap justify-between gap-x-4 border-y border-[var(--border-subtle)]">
          <div role="group" aria-label="Filter by activity status" className="flex max-w-full items-stretch gap-4 overflow-x-auto">
            {statusTabs.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                aria-pressed={activeFilterStatus === value}
                onClick={() => updateStatus(value)}
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-0.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--border-focus)] aria-pressed:border-[var(--action-primary)] aria-pressed:text-[var(--action-primary)]"
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
                <span className="rounded-full border border-current px-1 text-[10px] leading-tight tabular-nums">{matchingRecords.filter((record) => matchesStatus(record, value)).length}</span>
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2 py-1.5">
            <details name="activity-overview-panel" className="relative">
              <summary className={disclosureClass}><ListFilter className="size-3.5" aria-hidden="true" />Sort</summary>
              <div className={`${panelClass} w-40 space-y-0.5`}>
                {sortOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={sortField === value}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-[var(--bg-canvas)] aria-pressed:text-[var(--action-primary)]"
                    onClick={(event) => {
                      toggleSort(value);
                      const disclosure = event.currentTarget.closest('details');
                      disclosure?.querySelector('summary')?.focus();
                      disclosure?.removeAttribute('open');
                    }}
                  >
                    {label}
                    {sortField === value && (sortAscending ? <ArrowUp className="size-3.5" aria-label="Ascending" /> : <ArrowDown className="size-3.5" aria-label="Descending" />)}
                  </button>
                ))}
              </div>
            </details>
            <details name="activity-overview-panel" className="relative">
              <summary className={`${disclosureClass} ${extraFiltersActive ? 'text-[var(--action-primary)]' : ''}`}><Filter className="size-3.5" aria-hidden="true" />Filter{extraFiltersActive && <span className="size-1.5 rounded-full bg-[var(--action-primary)]" />}</summary>
              <div className={`${panelClass} w-56`}>
                <label className="block space-y-1 text-xs font-medium">
                  <span>Facility</span>
                  <select className={selectClass} value={activeFilterSite} onChange={(event) => {
                    setActiveFilterSite(event.target.value);
                    setPage(1);
                  }}>
                    <option value="all">All facilities</option>
                    {sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}
                  </select>
                </label>
                <label className="block space-y-1 text-xs font-medium">
                  <span>Scope</span>
                  <select className={selectClass} value={scopeFilter} onChange={(event) => {
                    setScopeFilter(event.target.value);
                    setPage(1);
                  }}>
                    <option value="all">All scopes</option>
                    {scopes.map((scope) => <option key={scope}>{scope}</option>)}
                  </select>
                </label>
                <label className="block space-y-1 text-xs font-medium">
                  <span>Status</span>
                  <select className={selectClass} value={activeFilterStatus} onChange={(event) => updateStatus(event.target.value)}>
                    {statusTabs.map(({ value, label }) => <option key={value} value={value}>{value === 'all' ? 'All statuses' : label}</option>)}
                    <option value="Locked">Locked</option>
                    <option value="Error">Error</option>
                    <option value="Sent Back">Sent back</option>
                  </select>
                </label>
                <button type="button" className={controlClass} onClick={() => {
                  setActiveFilterSite('all');
                  setScopeFilter('all');
                  updateStatus('all');
                }}>Clear filters</button>
              </div>
            </details>
          </div>
        </section>

        <section aria-label="Activity records" className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3">
            {renderSearch('Search the activity table', 'w-full sm:max-w-xs')}
            <div className="ml-auto flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
              {checkedCount > 0 && (
                <button type="button" className={controlClass} onClick={() => setCheckedIds(new Set())} aria-label={`Clear selection of ${checkedCount} records`}>
                  {checkedCount} selected <span aria-hidden="true">×</span>
                </button>
              )}
              <label className="relative flex items-center gap-1.5">
                Showing
                <span className="relative">
                  <select
                    aria-label="Records per page"
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setPage(1);
                    }}
                    className={`${controlClass} h-7 appearance-none pl-2 pr-6`}
                  >
                    {pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 size-3 -translate-y-1/2" aria-hidden="true" />
                </span>
              </label>
              <span aria-live="polite" className="tabular-nums">
                {pageCount ? `${pageStart + 1}–${pageStart + pageRecords.length} of ${sortedRecords.length} results` : '0 results'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[790px] border-collapse text-left text-xs">
              <thead className="border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                <tr>
                  <th scope="col" className="w-9 pl-3">
                    <input
                      type="checkbox"
                      aria-label="Select all activity records on this page"
                      checked={pageIsChecked}
                      ref={(input) => { if (input) input.indeterminate = checkedOnPage > 0 && !pageIsChecked; }}
                      disabled={pageRecords.length === 0}
                      onChange={(event) => updateChecked(pageRecords, event.target.checked)}
                      className={checkboxClass}
                    />
                  </th>
                  {columns.map((column) => {
                    const field = 'field' in column ? column.field : undefined;
                    const active = field === sortField;
                    return (
                      <th
                        key={column.label}
                        scope="col"
                        aria-sort={field === sortField ? (sortAscending ? 'ascending' : 'descending') : undefined}
                        className={`whitespace-nowrap px-3 py-2.5 font-medium ${'numeric' in column ? 'text-right' : ''}`}
                      >
                        {field ? (
                          <button type="button" onClick={() => toggleSort(field)} className="inline-flex items-center gap-1 hover:text-[var(--text-primary)]">
                            {column.label}<ArrowUpDown className={`size-3 ${active ? 'text-[var(--action-primary)]' : ''}`} aria-hidden="true" />
                          </button>
                        ) : column.label}
                      </th>
                    );
                  })}
                  <th scope="col" className="px-3 py-2.5 text-center font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {pageRecords.map((record) => (
                  <tr
                    key={record.id}
                    onClick={(event) => {
                      if (!(event.target as HTMLElement).closest('button, input')) openRecord(record);
                    }}
                    className={`cursor-pointer ${checkedIds.has(record.id) ? 'bg-[var(--bg-subtle)]' : 'hover:bg-[var(--bg-canvas)]'}`}
                  >
                    <td className="pl-3">
                      <input type="checkbox" aria-label={`Select record ${record.id}`} checked={checkedIds.has(record.id)} onChange={(event) => updateChecked([record], event.target.checked)} className={checkboxClass} />
                    </td>
                    <td className={`${cellClass} whitespace-nowrap`}>
                      <button type="button" onClick={() => openRecord(record)} className="font-mono font-semibold hover:text-[var(--action-primary)] hover:underline">{record.id}</button>
                      <span className="mt-1 block text-[11px] text-[var(--text-secondary)]">{record.date}</span>
                    </td>
                    <td className={cellClass}>
                      <span className="block font-semibold">{record.sourceName}</span>
                      <span className="mt-1 block text-[11px] text-[var(--text-secondary)]">{record.scope}</span>
                    </td>
                    <td className={cellClass}>
                      <span className="inline-flex items-center gap-1.5"><Building2 className="size-3.5 shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />{record.siteName}</span>
                    </td>
                    <td className={`${cellClass} whitespace-nowrap text-right font-mono tabular-nums`}>
                      {record.quantity.toLocaleString()} <span className="text-[11px] text-[var(--text-secondary)]">{record.unit}</span>
                    </td>
                    <td className={`${cellClass} whitespace-nowrap text-right`}>
                      <span className="font-mono font-semibold tabular-nums">{record.emissions_tCO2e.toFixed(3)}</span>
                      <span className="mt-1 block text-[11px] text-[var(--text-secondary)]">tCO₂e</span>
                    </td>
                    <td className={`${cellClass} whitespace-nowrap`}>
                      {record.evidenceFiles.length ? (
                        <span className="inline-flex items-center gap-1 text-[var(--status-success)]"><FileText className="size-3.5" aria-hidden="true" />{record.evidenceFiles.length} attached</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[var(--status-warning)]"><AlertCircle className="size-3.5" aria-hidden="true" />Missing</span>
                      )}
                    </td>
                    <td className={`${cellClass} whitespace-nowrap`}><StatusBadge status={record.status} size="sm" /></td>
                    <td className="px-3 text-center">
                      <button type="button" aria-label={`Open activity record ${record.id}`} title="Open record" onClick={() => openRecord(record)} className="inline-grid size-8 place-items-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--action-primary)]">
                        <MoreVertical className="size-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!pageRecords.length && <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-[var(--text-secondary)]">No activity records match these filters.</td></tr>}
              </tbody>
            </table>
          </div>

          <nav aria-label="Activity ledger pagination" className="flex flex-wrap items-center justify-center gap-1.5 border-t border-[var(--border-subtle)] px-3 py-4">
            <button type="button" aria-label="Previous page" className={`${controlClass} border-transparent`} disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ArrowLeft className="size-3.5" aria-hidden="true" />
            </button>
            {pageNumbers.map((number, index) => (
              <React.Fragment key={number}>
                {index > 0 && number - pageNumbers[index - 1] > 1 && <span className="px-1 text-xs text-[var(--text-secondary)]" aria-hidden="true">…</span>}
                <button
                  type="button"
                  className={`${controlClass} min-w-8 tabular-nums aria-[current=page]:border-[var(--bg-subtle)] aria-[current=page]:bg-[var(--bg-subtle)] aria-[current=page]:text-[var(--action-primary)]`}
                  aria-label={`Page ${number}`}
                  aria-current={page === number ? 'page' : undefined}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              </React.Fragment>
            ))}
            <button type="button" aria-label="Next page" className={`${controlClass} border-transparent`} disabled={page >= pageCount} onClick={() => setPage(page + 1)}>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </nav>
        </section>
      </div>
    </div>
  );
};
