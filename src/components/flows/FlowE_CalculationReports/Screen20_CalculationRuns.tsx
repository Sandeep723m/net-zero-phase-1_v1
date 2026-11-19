import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Calculator,
  Play,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Eye,
  Download,
  Search,
  Filter,
  Layers,
  Sparkles,
  RefreshCw,
  FileText,
  X,
  FileSpreadsheet,
  BookOpen,
  Database,
  Building2,
  TrendingUp,
  Lock,
  SlidersHorizontal,
  Target,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { KpiCard } from '../../common/KpiCard';
import { StatusBadge } from '../../common/StatusBadge';
import { CalculationEngineHub } from './CalculationEngineHub';

export const Screen20_CalculationRuns: React.FC = () => {
  const {
    calculationRuns,
    records,
    sites,
    periods,
    activePeriod,
    triggerCalculationRun,
    navigateToScreen,
    showToast,
    addAuditLog,
    currentRole,
    currentUser,
    openFactorHelper,
  } = useApp();

  const canRunCalculation = currentRole === 'TENANT_ADMIN' || currentRole === 'REVIEWER';

  // Active view tab
  const [activeTab, setActiveTab] = useState<'runs' | 'ledger' | 'methodology'>('runs');

  // Filters for Line-Item Ledger
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [selectedScopeFilter, setSelectedScopeFilter] = useState<string>('all');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('all');

  // Selected run for detail inspection
  const [selectedRunId, setSelectedRunId] = useState<string | null>(
    calculationRuns[0]?.id || '#RUN-2214'
  );

  // Run execution modal
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [runPeriod, setRunPeriod] = useState(activePeriod?.name || 'FY 2025–26');
  const [runScope, setRunScope] = useState('Scope 1 + Scope 2');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);

  // Latest run or fallback
  const latestRun = calculationRuns[0] || {
    id: '#RUN-2214',
    started: '20-Aug-2025 09:14',
    duration: '2m 40s',
    status: 'Completed',
    period: 'FY 2025–26',
    scope: 'Scope 1 + Scope 2',
    total_tCO2e: 28270,
    scope1: 18420,
    scope2: 9850,
  };

  const activeRun = calculationRuns.find((r) => r.id === selectedRunId) || latestRun;

  // Granular line-item ledger derived from records
  const ledgerItems = useMemo(() => {
    return records.map((rec, index) => {
      const gwp = 'IPCC AR5 GWP100';
      const factorCitation =
        rec.scope.includes('Scope 2') || rec.sourceName.toLowerCase().includes('electricity')
          ? 'CEA Baseline v19 (0.708 kg/kWh)'
          : rec.sourceName.toLowerCase().includes('diesel')
          ? 'IPCC 2006 (2.68 kg/L)'
          : 'MoEFCC Baseline (0.820 kg/unit)';

      return {
        ledgerId: `LEDG-2025-${String(index + 101).padStart(4, '0')}`,
        recordId: rec.id,
        date: rec.date,
        siteName: rec.siteName,
        sourceName: rec.sourceName,
        scope: rec.scope,
        quantity: rec.quantity,
        unit: rec.unit,
        factorValue: rec.emissionFactorApplied || (rec.scope.includes('Scope 2') ? 0.708 : 0.82),
        factorCitation,
        gwp,
        emissions_tCO2e: rec.emissions_tCO2e || Number(((rec.quantity * 0.708) / 1000).toFixed(3)),
        status: rec.status,
        evidenceFile: rec.evidenceFiles?.[0]?.name || 'TANGEDCO_HT_Bill_Jul_2025.pdf',
        reconciled: true,
      };
    });
  }, [records]);

  // Filtered line-item ledger
  const filteredLedger = useMemo(() => {
    return ledgerItems.filter((item) => {
      const matchSearch =
        item.sourceName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        item.siteName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        item.ledgerId.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        item.recordId.toLowerCase().includes(ledgerSearch.toLowerCase());

      const matchScope =
        selectedScopeFilter === 'all' || item.scope.toLowerCase().includes(selectedScopeFilter.toLowerCase());

      const matchSite = selectedSiteFilter === 'all' || item.siteName === selectedSiteFilter;

      return matchSearch && matchScope && matchSite;
    });
  }, [ledgerItems, ledgerSearch, selectedScopeFilter, selectedSiteFilter]);

  const filteredTotalEmissions = useMemo(() => {
    return filteredLedger.reduce((sum, item) => sum + item.emissions_tCO2e, 0);
  }, [filteredLedger]);

  // Handle new calculation execution
  const handleStartCalculation = () => {
    if (!canRunCalculation) {
      showToast('Action Restricted', 'Triggering calculation runs requires Reviewer or Tenant Admin permissions.', 'error');
      return;
    }

    setIsExecuting(true);
    setExecutionStep(1);

    setTimeout(() => {
      setExecutionStep(2);
    }, 600);

    setTimeout(() => {
      setExecutionStep(3);
    }, 1200);

    setTimeout(() => {
      triggerCalculationRun(runPeriod, runScope);
      addAuditLog({
        userName: currentUser.name,
        role: currentRole === 'TENANT_ADMIN' ? 'Tenant Admin' : currentRole === 'REVIEWER' ? 'Reviewer' : currentRole,
        action: 'Executed GHG Calculations Ledger Run',
        previousValue: `Previous run: ${latestRun.id} (${latestRun.total_tCO2e.toLocaleString()} tCO2e)`,
        newValue: `New Run: ${runPeriod} (${runScope}) — 28,270.0 tCO2e computed`,
        source: 'Calculation Engine v1.4.2',
        reason: 'Periodic carbon reconciliation and ledger balancing',
        status: 'Complete',
      });
      setIsExecuting(false);
      setIsRunModalOpen(false);
      setExecutionStep(0);
      showToast(
        'Calculation Run Completed',
        `Ledger updated with new immutable batch run for ${runPeriod}.`
      );
    }, 1800);
  };

  // CSV Export of Calculations Ledger
  const handleExportLedgerCSV = () => {
    const headers = [
      'Ledger Entry ID',
      'Record Reference',
      'Date',
      'Facility / Site',
      'Emission Source',
      'Scope',
      'Activity Quantity',
      'Unit',
      'Applied Emission Factor',
      'GWP Metric',
      'Calculated Emissions (tCO2e)',
      'Status',
      'Supporting Evidence',
    ];

    const rows = filteredLedger.map((item) => [
      item.ledgerId,
      item.recordId,
      item.date,
      `"${item.siteName}"`,
      `"${item.sourceName}"`,
      item.scope,
      item.quantity,
      item.unit,
      `"${item.factorCitation}"`,
      `"${item.gwp}"`,
      item.emissions_tCO2e.toFixed(3),
      item.status,
      `"${item.evidenceFile}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GHG_Calculations_Ledger_${activePeriod?.name || 'FY25-26'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(
      'Ledger Export Downloaded',
      `Exported ${filteredLedger.length} ledger journal lines with cryptographic hash record.`
    );
  };

  const handleViewDetails = (runId: string) => {
    showToast('Loading Traceability', `Opening Results Drill-Down for ${runId}.`);
    navigateToScreen('21_drill_down', 'FLOW_E');
  };

  return (
    <div id="calculations-ledger-container" className="w-full space-y-6">
      {/* Top Header & Context Actions using standard PageHeader */}
      <PageHeader
        breadcrumbs={[
          { label: 'Calculations & Reports', onClick: () => navigateToScreen('20_results_summary', 'FLOW_E') },
          { label: 'Calculations Ledger' },
        ]}
        title="Calculations Ledger"
        badge={<StatusBadge status="Approved" customLabel="Engine v1.4.2" size="sm" />}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-export-ledger"
              type="button"
              onClick={handleExportLedgerCSV}
              className="h-9 px-3.5 text-xs font-semibold text-[#101828] bg-white border border-[var(--border-default)] rounded-lg hover:bg-[var(--surface-secondary)] hover:border-[#98A2B3] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none shadow-2xs inline-flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
              <span>Export Ledger</span>
            </button>

            <button
              id="btn-drilldown-shortcut"
              type="button"
              onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')}
              className="h-9 px-3.5 text-xs font-semibold text-[var(--action-primary)] bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg hover:bg-[var(--status-info-bg)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none shadow-2xs inline-flex items-center gap-1.5 transition-all"
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Results Drill-Down</span>
            </button>

            <button
              id="btn-calc-factor-helper"
              type="button"
              onClick={() => openFactorHelper()}
              className="h-9 px-3.5 text-xs font-semibold text-[var(--text-primary)] bg-white border border-[var(--border-default)] rounded-lg hover:bg-[var(--surface-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none shadow-2xs inline-flex items-center gap-1.5 transition-all"
              title="Look up official IPCC and IEA factors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[var(--text-primary)]" aria-hidden="true" />
              <span>Factor Helper</span>
            </button>

            {canRunCalculation ? (
              <button
                id="btn-trigger-run-modal"
                type="button"
                onClick={() => setIsRunModalOpen(true)}
                className="h-9 px-4 text-xs font-semibold text-white bg-[var(--action-primary)] rounded-lg hover:bg-[var(--action-primary-hover)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none shadow-2xs inline-flex items-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Run Calculation</span>
              </button>
            ) : (
              <div className="h-9 flex items-center space-x-2 text-xs text-[var(--text-secondary)] font-data bg-[var(--surface-secondary)] px-3.5 rounded-lg border border-[var(--border-default)]">
                <Lock className="w-3.5 h-3.5 text-[var(--text-secondary)]" aria-hidden="true" />
                <span>Reviewer & Admin only</span>
              </div>
            )}
          </div>
        }
      />

      {/* Accounting Balance Strip & Assurance KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Consolidated Balance"
          value={`${activeRun.total_tCO2e.toLocaleString('en-US', { minimumFractionDigits: 1 })} tCO2e`}
          subtext={`Reconciled across ${sites.length} facilities`}
          icon={<CheckCircle2 className="w-4 h-4 text-[var(--status-success)]" />}
          change={activeRun.period}
        />

        <KpiCard
          label="Scope 1: Direct Combustion"
          value={`${activeRun.scope1.toLocaleString('en-US', { minimumFractionDigits: 1 })} tCO2e`}
          subtext="Stationary diesel generators & LPG"
          icon={<Calculator className="w-4 h-4 text-[var(--text-tertiary)]" />}
          change={`${((activeRun.scope1 / activeRun.total_tCO2e) * 100).toFixed(1)}%`}
        />

        <KpiCard
          label="Scope 2: Grid Electricity"
          value={`${activeRun.scope2.toLocaleString('en-US', { minimumFractionDigits: 1 })} tCO2e`}
          subtext="CEA v19 grid factor (0.708 kg/kWh)"
          icon={<Layers className="w-4 h-4 text-[var(--text-primary)]" />}
          change={`${((activeRun.scope2 / activeRun.total_tCO2e) * 100).toFixed(1)}%`}
        />

        <KpiCard
          label="Assurance & Hash"
          value="sha256:7f83b1..."
          subtext="Deterministic engine v1.4.2"
          statusDot="success"
          icon={<ShieldCheck className="w-4 h-4 text-[var(--status-success)]" />}
          change="Verified"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-[var(--border-default)] flex items-center space-x-6 text-xs overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
        <button
          id="tab-calculation-runs"
          type="button"
          onClick={() => setActiveTab('runs')}
          className={`pb-3 font-semibold transition-all flex items-center space-x-2 border-b-2 font-sans ${
            activeTab === 'runs'
              ? 'border-[var(--action-primary)] text-[var(--text-primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)]'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Calculation Runs (Batch Ledger)</span>
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-data font-semibold ${
              activeTab === 'runs' ? 'bg-[var(--brand-50)] text-[var(--action-primary)]' : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            {calculationRuns.length}
          </span>
        </button>

        <button
          id="tab-line-item-ledger"
          type="button"
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 font-semibold transition-all flex items-center space-x-2 border-b-2 font-sans ${
            activeTab === 'ledger'
              ? 'border-[var(--action-primary)] text-[var(--text-primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)]'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Line-Item Emissions Ledger</span>
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-data font-semibold ${
              activeTab === 'ledger' ? 'bg-[var(--brand-50)] text-[var(--action-primary)]' : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            {records.length} entries
          </span>
        </button>

        <button
          id="tab-methodology"
          type="button"
          onClick={() => setActiveTab('methodology')}
          className={`pb-3 font-semibold transition-all flex items-center space-x-2 border-b-2 font-sans ${
            activeTab === 'methodology'
              ? 'border-[var(--action-primary)] text-[var(--text-primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-default)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Engine & Formulas (TC-DOM-002a)</span>
          <span
            className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-data font-semibold ${
              activeTab === 'methodology' ? 'bg-[var(--brand-50)] text-[var(--action-primary)]' : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            C-01 to C-12
          </span>
        </button>

        <button
          id="tab-whatif-scenarios"
          type="button"
          onClick={() => navigateToScreen('36_scenario_builder', 'FLOW_E')}
          className="pb-3 font-semibold transition-all flex items-center space-x-2 border-b-2 font-sans border-transparent text-[var(--text-secondary)] hover:text-[var(--action-primary)] hover:border-[var(--border-default)]"
        >
          <SlidersHorizontal className="w-4 h-4 text-[var(--status-success)]" />
          <span>What-If Scenarios</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-data font-semibold bg-[var(--status-success-bg)] text-[var(--status-success)]">
            Simulator
          </span>
        </button>

        <button
          id="tab-benchmarking"
          type="button"
          onClick={() => navigateToScreen('37_benchmarking', 'FLOW_E')}
          className="pb-3 font-semibold transition-all flex items-center space-x-2 border-b-2 font-sans border-transparent text-[var(--text-secondary)] hover:text-[var(--action-primary)] hover:border-[var(--border-default)]"
        >
          <Target className="w-4 h-4 text-[var(--text-primary)]" />
          <span>Industry Benchmarking</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-data font-semibold bg-[var(--brand-50)] text-[var(--action-primary)]">
            Radar
          </span>
        </button>
      </div>

      {/* TAB 1: BATCH CALCULATION RUNS */}
      {activeTab === 'runs' && (
        <div className="space-y-6">
          {/* Active Run Inspector Card */}
          <div className="bg-white border border-[var(--border-default)] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-50)] text-[var(--action-primary)] flex items-center justify-center font-bold font-data text-sm">
                  {activeRun.id.replace('#RUN-', '')}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-sans">
                    Inspecting Calculation Batch
                  </div>
                  <div className="text-base font-bold text-[var(--text-primary)] flex items-center space-x-2 mt-0.5 font-sans">
                    <span className="font-data text-[var(--text-primary)]">{activeRun.id}</span>
                    <span className="text-[var(--text-tertiary)]">·</span>
                    <span>{activeRun.period}</span>
                    <span className="text-[var(--text-tertiary)]">·</span>
                    <span className="text-xs font-normal text-[var(--text-secondary)]">{activeRun.scope}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <StatusBadge status={activeRun.status} size="md" />
                <span className="text-[var(--text-secondary)] font-data text-xs flex items-center space-x-1.5 bg-[var(--surface-secondary)] px-3 py-1.5 rounded-full border border-[var(--border-default)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                  <span>Runtime: {activeRun.duration}</span>
                </span>
              </div>
            </div>

            {/* Scope Visualizer Bar */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-data">
                <div className="flex items-center space-x-5">
                  <span className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--action-primary)]" />
                    <span>Scope 1: {activeRun.scope1.toLocaleString()} tCO2e</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#204382]" />
                    <span>Scope 2: {activeRun.scope2.toLocaleString()} tCO2e</span>
                  </span>
                </div>
                <span className="font-semibold text-[var(--text-primary)]">
                  Total: {activeRun.total_tCO2e.toLocaleString()} tCO2e
                </span>
              </div>

              <div className="w-full h-2.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${(activeRun.scope1 / activeRun.total_tCO2e) * 100}%` }}
                  className="bg-[var(--action-primary)] h-full transition-all"
                  title={`Scope 1: ${activeRun.scope1} tCO2e`}
                />
                <div
                  style={{ width: `${(activeRun.scope2 / activeRun.total_tCO2e) * 100}%` }}
                  className="bg-[#204382] h-full transition-all"
                  title={`Scope 2: ${activeRun.scope2} tCO2e`}
                />
              </div>
            </div>

            {/* Quick Traceability Action Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[var(--border-subtle)] text-xs gap-3">
              <div className="text-[var(--text-secondary)] flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[var(--status-success)]" />
                <span className="font-data">
                  Deterministic snapshot verified against GHG Protocol Corporate Standard.
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleViewDetails(activeRun.id)}
                  className="px-4 py-2 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white rounded-full font-semibold text-xs flex items-center space-x-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Results Drill-Down</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Runs Table */}
          <div className="bg-white border border-[var(--border-default)] rounded-2xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-[var(--border-default)] flex items-center justify-between bg-[var(--surface-secondary)]">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] font-sans">Historical Batch Ledger</h2>
              <span className="text-xs text-[var(--text-secondary)] font-data font-semibold">
                {calculationRuns.length} recorded engine runs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-default)] text-[var(--text-secondary)]">
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Run ID</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Period & Scope</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Timestamp</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Duration</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Status</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Scope 1 (tCO2e)</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Scope 2 (tCO2e)</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Total (tCO2e)</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEAF5]">
                  {calculationRuns.map((run) => {
                    const isSelected = run.id === selectedRunId;
                    return (
                      <tr
                        key={run.id}
                        onClick={() => setSelectedRunId(run.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-[var(--brand-50)]/60' : 'hover:bg-[var(--surface-secondary)]'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-data font-semibold text-[var(--text-primary)] whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[var(--action-primary)]" />}
                            <span>{run.id}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[var(--text-primary)]">
                          <div className="font-semibold font-sans">{run.period}</div>
                          <div className="text-[11px] text-[var(--text-secondary)]">{run.scope}</div>
                        </td>
                        <td className="py-3.5 px-4 text-[var(--text-secondary)] font-data whitespace-nowrap">
                          {run.started}
                        </td>
                        <td className="py-3.5 px-4 text-[var(--text-secondary)] font-data whitespace-nowrap">
                          {run.duration}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={run.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-4 font-data text-right text-[var(--text-primary)]">
                          {run.scope1.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-3.5 px-4 font-data text-right text-[var(--action-primary)] font-semibold">
                          {run.scope2.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-3.5 px-4 font-data text-right font-bold text-[var(--text-primary)]">
                          {run.total_tCO2e.toLocaleString('en-US', { minimumFractionDigits: 1 })}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(run.id);
                              }}
                              className="inline-flex items-center space-x-1 text-[var(--action-primary)] hover:underline font-semibold text-xs"
                            >
                              <span>Drill-Down</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LINE-ITEM ACCOUNTING LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Filtering and Search Controls */}
          <div className="bg-white border border-[var(--border-default)] rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  placeholder="Search ledger entries by source, facility, record ID..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-[var(--border-default)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]/20 focus:border-[var(--action-primary)] bg-white text-[var(--text-primary)] font-sans placeholder-[#85808D]"
                />
                <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3 top-2.5" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Scope Filter */}
                <select
                  value={selectedScopeFilter}
                  onChange={(e) => setSelectedScopeFilter(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-[var(--border-default)] rounded-full bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] font-sans"
                >
                  <option value="all">All Scopes</option>
                  <option value="scope 1">Scope 1 Only</option>
                  <option value="scope 2">Scope 2 Only</option>
                </select>

                {/* Site Filter */}
                <select
                  value={selectedSiteFilter}
                  onChange={(e) => setSelectedSiteFilter(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-[var(--border-default)] rounded-full bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] font-sans"
                >
                  <option value="all">All Facilities</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {(ledgerSearch || selectedScopeFilter !== 'all' || selectedSiteFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setLedgerSearch('');
                      setSelectedScopeFilter('all');
                      setSelectedSiteFilter('all');
                    }}
                    className="px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline font-sans"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>

            {/* Live Filter Summary Tally */}
            <div className="flex items-center justify-between text-xs pt-2.5 border-t border-[var(--border-subtle)] text-[var(--text-secondary)] font-data">
              <div>
                Showing <strong className="text-[var(--text-primary)] font-semibold">{filteredLedger.length}</strong> of{' '}
                {ledgerItems.length} reconciled journal entries
              </div>
              <div>
                Filtered Total:{' '}
                <strong className="text-[var(--text-primary)] font-bold">
                  {filteredTotalEmissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                  tCO2e
                </strong>
              </div>
            </div>
          </div>

          {/* Granular Journal Table */}
          <div className="bg-white border border-[var(--border-default)] rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-default)] text-[var(--text-secondary)]">
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Ledger ID</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Date</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Facility / Site</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Emission Source</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Raw Activity</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Applied Factor & Citation</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Emissions (tCO2e)</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans">Evidence Document</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider font-sans text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEAF5]">
                  {filteredLedger.map((item) => (
                    <tr key={item.ledgerId} className="hover:bg-[var(--surface-secondary)] transition-colors">
                      <td className="py-3.5 px-4 font-data font-semibold text-[var(--text-primary)] whitespace-nowrap">
                        {item.ledgerId}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-secondary)] font-data whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-primary)] font-medium whitespace-nowrap font-sans">
                        {item.siteName}
                      </td>
                      <td className="py-3.5 px-4 font-sans">
                        <div className="text-[var(--text-primary)] font-semibold">{item.sourceName}</div>
                        <span className="text-[11px] text-[var(--text-tertiary)] font-data">{item.scope}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-data text-[var(--text-primary)] whitespace-nowrap font-semibold">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                        <div className="font-data text-xs text-[var(--text-primary)] font-semibold">
                          {item.factorValue} kg CO2e / {item.unit}
                        </div>
                        <div className="text-[11px] text-[var(--text-tertiary)] font-sans">{item.factorCitation}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-data font-bold text-[var(--text-primary)] whitespace-nowrap">
                        {item.emissions_tCO2e.toFixed(3)}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => {
                            showToast('Evidence Repository', `Opening ${item.evidenceFile}`);
                            navigateToScreen('16_attach_evidence', 'FLOW_B');
                          }}
                          className="inline-flex items-center space-x-1.5 text-[var(--action-primary)] hover:underline text-xs font-medium font-sans"
                        >
                          <FileText className="w-3.5 h-3.5 text-[var(--text-primary)]" />
                          <span className="truncate max-w-[140px]">{item.evidenceFile}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <StatusBadge status="Approved" customLabel="Reconciled" size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: METHODOLOGY & FACTOR REGISTRY */}
      {/* TAB 3: CALCULATION ENGINE & METHODOLOGY (TC-DOM-002a) */}
      {activeTab === 'methodology' && (
        <CalculationEngineHub />
      )}

      {/* EXECUTE CALCULATION RUN MODAL */}
      {isRunModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-[var(--border-default)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-default)] flex items-center justify-between bg-[var(--surface-secondary)]">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-[var(--text-primary)]" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)] font-sans">Execute GHG Calculation Run</h3>
              </div>
              <button
                type="button"
                onClick={() => !isExecuting && setIsRunModalOpen(false)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-sans mb-1.5">
                  Reporting Period
                </label>
                <select
                  value={runPeriod}
                  disabled={isExecuting}
                  onChange={(e) => setRunPeriod(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-[var(--border-default)] rounded-full bg-white text-[var(--text-primary)] font-sans focus:outline-none focus:border-[var(--action-primary)]"
                >
                  {periods.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.startDate} to {p.endDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-sans mb-1.5">
                  Calculation Scope Boundary
                </label>
                <select
                  value={runScope}
                  disabled={isExecuting}
                  onChange={(e) => setRunScope(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs border border-[var(--border-default)] rounded-full bg-white text-[var(--text-primary)] font-sans focus:outline-none focus:border-[var(--action-primary)]"
                >
                  <option value="Scope 1 + Scope 2">Scope 1 & Scope 2 (Location-based)</option>
                  <option value="Scope 1 Only">Scope 1 Only (Direct Combustion)</option>
                  <option value="Scope 2 Only">Scope 2 Only (Grid Electricity)</option>
                </select>
              </div>

              {/* Progress Feedback during execution */}
              {isExecuting && (
                <div className="p-4 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-xl space-y-2.5">
                  <div className="flex items-center space-x-2 text-xs text-[var(--action-primary)] font-semibold font-sans">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--text-primary)]" />
                    <span>Processing Calculation Batch...</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] space-y-1 font-data">
                    <div className={executionStep >= 1 ? 'text-[var(--status-success)] font-semibold' : 'text-[var(--text-tertiary)]'}>
                      ✓ Reconciling approved activity records ({records.length} items)
                    </div>
                    <div className={executionStep >= 2 ? 'text-[var(--status-success)] font-semibold' : 'text-[var(--text-tertiary)]'}>
                      ✓ Applying CEA v19 and IPCC 2006 emission factors
                    </div>
                    <div className={executionStep >= 3 ? 'text-[var(--status-success)] font-semibold' : 'text-[var(--text-tertiary)]'}>
                      ✓ Signing immutable cryptographic ledger seal
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[var(--border-default)] bg-[var(--surface-secondary)] flex items-center justify-end space-x-2">
              <button
                type="button"
                disabled={isExecuting}
                onClick={() => setIsRunModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] bg-white border border-[var(--border-default)] rounded-full hover:bg-[var(--surface-secondary)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isExecuting}
                onClick={handleStartCalculation}
                className="px-5 py-2 text-xs bg-[var(--action-primary)] text-white rounded-full hover:bg-[var(--action-primary-hover)] font-semibold shadow-sm flex items-center space-x-1.5 transition-colors"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Calculation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
