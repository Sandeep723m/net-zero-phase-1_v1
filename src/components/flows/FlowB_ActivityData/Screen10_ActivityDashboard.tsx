import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ActivityRecord } from '../../../types';
import { Plus, Search, FileText, AlertCircle, Files, ChevronDown, ArrowUpDown, Building2, ClipboardList, BadgeCheck, TriangleAlert, Filter, BarChart3 } from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen10_ActivityDashboard: React.FC = () => {
  const {
    records,
    sites,
    activePeriod,
    navigateToScreen,
    setSelectedRecordId,
    activeFilterSite,
    setActiveFilterSite,
    activeFilterStatus,
    setActiveFilterStatus,
    searchQuery,
    setSearchQuery,
    currentRole,
  } = useApp();

  const [scopeFilter, setScopeFilter] = useState<'all' | 'Scope 1' | 'Scope 2' | 'Scope 3'>('all');
  const [showStatistics, setShowStatistics] = useState(true);
  const [sortField, setSortField] = useState<'id' | 'date' | 'site' | 'source' | 'quantity' | 'emissions'>('date');
  const [sortAscending, setSortAscending] = useState(false);
  const filteredRecords = records.filter((rec) => {
    const matchesSite = activeFilterSite === 'all' || rec.siteId === activeFilterSite;
    const matchesStatus = activeFilterStatus === 'all' ||
      (activeFilterStatus === 'attention' ? rec.status === 'Error' || rec.status === 'Sent Back' : rec.status === activeFilterStatus);
    const matchesScope = scopeFilter === 'all' || rec.scope === scopeFilter;
    const matchesSearch = rec.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.siteName.toLowerCase().includes(searchQuery.toLowerCase()) || rec.id.toLowerCase().includes(searchQuery.toLowerCase()) || rec.date.includes(searchQuery);
    return matchesSite && matchesStatus && matchesScope && matchesSearch;
  });
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'quantity') comparison = a.quantity - b.quantity;
    else if (sortField === 'emissions') comparison = a.emissions_tCO2e - b.emissions_tCO2e;
    else if (sortField === 'site') comparison = a.siteName.localeCompare(b.siteName);
    else if (sortField === 'source') comparison = a.sourceName.localeCompare(b.sourceName);
    else if (sortField === 'id') comparison = a.id.localeCompare(b.id);
    else comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    return sortAscending ? comparison : -comparison;
  });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAscending((ascending) => !ascending);
    else {
      setSortField(field);
      setSortAscending(field !== 'date');
    }
  };

  const totalEmissions = records.reduce((sum, record) => sum + record.emissions_tCO2e, 0);
  const calculationBlockers = records.filter((record) => record.status === 'Error' || record.status === 'Sent Back').length;

  const handleRowClick = (rec: ActivityRecord) => {
    setSelectedRecordId(rec.id);
    if (currentRole === 'VERIFIER') navigateToScreen('32_evidence_trace', 'FLOW_F');
    else if (rec.status === 'Submitted') navigateToScreen('24_review_approve', 'FLOW_B');
    else if (rec.status === 'Error' || rec.status === 'Sent Back') navigateToScreen('15_fix_detail_view', 'FLOW_C');
    else navigateToScreen('16_attach_evidence', 'FLOW_B');
  };

  const approvedRecords = records.filter((record) => record.status === 'Approved').length;
  const workflowCards = [
    { label: 'Activity records', value: records.length, note: `In ${activePeriod.name}`, icon: ClipboardList, color: 'var(--text-secondary)' },
    { label: 'Total emissions', value: totalEmissions.toLocaleString(undefined, { maximumFractionDigits: 2 }), note: 'tCO₂e recorded', icon: Building2, color: 'var(--scope-1)' },
    { label: 'Approved', value: approvedRecords, note: 'Ready for calculation', status: 'Approved', icon: BadgeCheck, color: 'var(--status-success)' },
    { label: 'Needs attention', value: calculationBlockers, note: 'Errors or returned records', status: 'attention', icon: TriangleAlert, color: 'var(--status-error)' },
  ];

  return (
    <div id="screen-10-activity-dashboard" className="w-full space-y-4 pb-12">
      <header className="flex flex-col gap-4 border-b border-[#eeeef0] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-[var(--text-primary)]">Carbon inventory</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{activePeriod.name} <span className="mx-1.5 text-[var(--text-tertiary)]">·</span> {sites.length} facilities <span className="mx-1.5 text-[var(--text-tertiary)]">·</span> GHG inventory</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')} className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border-default)] bg-white px-3.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-canvas)]"><BarChart3 className="h-4 w-4" aria-hidden="true" />View analytics</button>
          {currentRole === 'VERIFIER' ? (
            <button type="button" onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')} className="enterprise-btn-primary h-10 min-h-10 whitespace-nowrap"><Files className="w-3.5 h-3.5" />Trace docket</button>
          ) : (
            <button type="button" onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')} className="enterprise-btn-primary h-10 min-h-10 whitespace-nowrap"><Plus className="w-3.5 h-3.5" />Add activity</button>
          )}
        </div>
      </header>

      <section aria-label="Activity data controls" className="flex flex-wrap items-center gap-2 py-1">
        <label className="relative block w-full sm:w-auto">
          <span className="sr-only">Filter by facility</span><Building2 className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <select aria-label="Filter by facility" value={activeFilterSite} onChange={(event) => setActiveFilterSite(event.target.value)} className="block w-full sm:w-[190px] h-10 appearance-none pl-9 pr-8 text-sm border border-[var(--border-default)] rounded-md bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]">
            <option value="all">All facilities ({sites.length})</option>{sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}
          </select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" aria-hidden="true" />
        </label>
        <label className="relative block w-full sm:w-auto">
          <span className="sr-only">Filter by scope</span><Filter className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <select aria-label="Filter by scope" value={scopeFilter} onChange={(event) => setScopeFilter(event.target.value as typeof scopeFilter)} className="block w-full sm:w-[150px] h-10 appearance-none pl-9 pr-8 text-sm border border-[var(--border-default)] rounded-md bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]">
            <option value="all">All scopes</option><option value="Scope 1">Scope 1</option><option value="Scope 2">Scope 2</option><option value="Scope 3">Scope 3</option>
          </select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" aria-hidden="true" />
        </label>
        <label className="relative block w-full sm:w-auto">
          <span className="sr-only">Filter by status</span>
          <select aria-label="Filter by status" value={activeFilterStatus} onChange={(event) => setActiveFilterStatus(event.target.value)} className="block w-full sm:w-[160px] h-10 appearance-none pl-3 pr-8 text-sm border border-[var(--border-default)] rounded-md bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]">
            <option value="all">All statuses</option><option value="attention">Needs attention</option><option value="Approved">Approved</option><option value="Submitted">Submitted</option><option value="Under Review">Under review</option><option value="Draft">Draft</option><option value="Error">Error</option><option value="Sent Back">Sent back</option>
          </select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" aria-hidden="true" />
        </label>
        <button type="button" onClick={() => toggleSort(sortField)} className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border-default)] bg-white px-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-canvas)]"><ArrowUpDown className="h-4 w-4" aria-hidden="true" />Sort</button>
        <label className="ml-1 inline-flex h-10 cursor-pointer items-center gap-2 text-sm text-[var(--text-primary)] sm:ml-auto">
          <span>Show statistics</span><input type="checkbox" checked={showStatistics} onChange={(event) => setShowStatistics(event.target.checked)} className="peer sr-only" />
          <span className="relative h-5 w-10 rounded-full bg-[#c9c9cc] transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-[var(--brand-coral)] peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--border-focus)]" aria-hidden="true" />
        </label>
      </section>

      {showStatistics && <section aria-label="Inventory statistics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 overflow-hidden rounded-xl border border-[var(--border-default)] bg-white">
        {workflowCards.map((card, index) => <article key={card.label} className={`min-h-[126px] px-4 py-4 border-[#e9e8ec] ${index > 0 ? 'border-t' : ''} ${index % 2 === 1 ? 'sm:border-l' : ''} ${index > 1 ? 'sm:border-t' : ''} ${index > 0 ? 'xl:border-l' : ''} xl:border-t-0`}>
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-[var(--text-secondary)]"><span>{card.label}</span><card.icon className="w-[17px] h-[17px] shrink-0" style={{ color: card.color }} strokeWidth={1.7} aria-hidden="true" /></div>
          <div className="mt-3 text-[28px] font-semibold leading-none tracking-tight text-[var(--text-primary)] tabular-nums">{card.value}</div>
          <p className="mt-2 text-[11px] leading-4 text-[var(--text-secondary)]">{card.note}</p>
        </article>)}
      </section>}

      <section aria-label="Recent activity ledger" className="bg-white border border-[var(--border-default)] rounded-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div><h2 className="text-base font-semibold text-[var(--text-primary)]">Activity data ledger</h2><p className="mt-1 text-xs text-[var(--text-secondary)]">{filteredRecords.length} records in {activePeriod.name}</p></div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:ml-auto">
            <div className="relative w-full sm:w-[210px]">
              <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search records" aria-label="Search activity records" className="w-full h-10 pl-9 pr-3 text-sm border border-[var(--border-default)] rounded-md bg-white text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-focus)]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-secondary)]">Sorted by</span>
              <span className="px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] bg-[var(--bg-canvas)] border border-[var(--border-default)] rounded-md whitespace-nowrap">{sortField === 'date' ? 'Date' : sortField === 'emissions' ? 'Emissions' : sortField === 'quantity' ? 'Quantity' : sortField === 'site' ? 'Facility' : sortField === 'source' ? 'Activity' : 'Record ID'} {sortAscending ? '↑' : '↓'}</span>
            </div>
          </div>
        </div>


        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-xs border-collapse">
            <thead className="bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)]">
              <tr>
                {[
                  { field: 'id' as const, label: 'Record ID', align: 'left' },
                  { field: 'source' as const, label: 'Activity', align: 'left' },
                  { field: 'site' as const, label: 'Facility', align: 'left' },
                  { field: 'quantity' as const, label: 'Quantity', align: 'right' },
                  { field: 'emissions' as const, label: 'Emissions', align: 'right' },
                  { field: null, label: 'Evidence', align: 'left' },
                  { field: null, label: 'Status', align: 'left' },
                ].map((column) => <th key={column.label} scope="col" className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary)] ${column.align === 'right' ? 'text-right' : ''}`}>
                  {column.field ? <button type="button" onClick={() => toggleSort(column.field!)} className={`inline-flex items-center gap-1.5 ${column.align === 'right' ? 'ml-auto' : ''} hover:text-[var(--text-primary)]`} aria-label={`Sort by ${column.label}`}>
                    {column.label}<ArrowUpDown className={`w-3 h-3 ${sortField === column.field ? 'text-[var(--action-primary)]' : 'text-[var(--text-tertiary)]'}`} aria-hidden="true" />
                  </button> : column.label}
                </th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {sortedRecords.map((record) => {
                const hasEvidence = record.evidenceFiles.length > 0;
                return <tr key={record.id} onClick={() => handleRowClick(record)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleRowClick(record); } }} tabIndex={0} role="button" aria-label={`Open activity record ${record.id}`} className="group cursor-pointer hover:bg-[var(--bg-canvas)] focus-visible:outline-none focus-visible:bg-[var(--brand-50)]">
                  <td className="px-4 py-3.5"><span className="block font-mono font-semibold text-[var(--text-primary)]">{record.id}</span><span className="mt-1 block text-[10px] text-[var(--text-secondary)]">{record.date}</span></td>
                  <td className="px-4 py-3.5"><span className="block font-medium text-[var(--text-primary)]">{record.sourceName}</span><span className="mt-1 inline-flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: record.scope === 'Scope 1' ? 'var(--scope-1)' : record.scope === 'Scope 2' ? 'var(--scope-2)' : 'var(--scope-3)' }} />{record.scope}</span></td>
                  <td className="px-4 py-3.5 text-[var(--text-primary)]">{record.siteName}</td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums text-[var(--text-primary)]">{record.quantity.toLocaleString()} <span className="text-[10px] text-[var(--text-secondary)]">{record.unit}</span></td>
                  <td className="px-4 py-3.5 text-right"><span className="font-mono font-semibold tabular-nums text-[var(--text-primary)]">{record.emissions_tCO2e.toFixed(3)}</span><span className="block mt-1 text-[10px] text-[var(--text-secondary)]">tCO₂e</span></td>
                  <td className="px-4 py-3.5">{hasEvidence ? <span className="inline-flex items-center gap-1.5 text-[var(--status-success)]"><FileText className="w-3.5 h-3.5" /><span>{record.evidenceFiles.length} attached</span></span> : <span className="inline-flex items-center gap-1.5 text-[var(--status-warning)]"><AlertCircle className="w-3.5 h-3.5" /><span>Missing</span></span>}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={record.status} size="sm" /></td>
                </tr>;
              })}
              {!sortedRecords.length && <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--text-secondary)]">No activity records match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
          <span>Showing {sortedRecords.length} of {records.length} records</span>
          <span className="hidden sm:inline">Select a row to review its evidence and calculation trail</span>
        </div>
      </section>

    </div>
  );
};
