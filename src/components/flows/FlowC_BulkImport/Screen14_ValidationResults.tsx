import React from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Wrench,
  Download,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { KpiCard } from '../../common/KpiCard';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen14_ValidationResults: React.FC = () => {
  const { navigateToScreen, showToast } = useApp();

  const handleImportValidRows = () => {
    showToast(
      'Import Successful',
      '1,798 valid rows imported to Activity Data. 44 flagged rows held in error queue.'
    );
    navigateToScreen('10_activity_dashboard', 'FLOW_B');
  };

  const handleDownloadErrorReport = () => {
    showToast('Report Downloaded', 'import_errors_job88.csv downloaded with 44 flagged rows.');
  };

  const errorRows = [
    {
      rowNumber: 'Row 22',
      error: 'Unrecognised unit',
      field: 'Unit',
      value: 'kwh/h',
      actionable: false,
    },
    {
      rowNumber: 'Row 105',
      error: 'Missing required field',
      field: 'Activity date',
      value: '(blank)',
      actionable: false,
    },
    {
      rowNumber: 'Row 340 / #1042',
      error: 'Site not found',
      field: 'Site',
      value: 'Chennai Plant One',
      actionable: true,
      hint: 'Did you mean Chennai Plant 1?',
    },
  ];

  return (
    <div id="screen-14-container" className="w-full space-y-6 font-sans">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'Import' },
          { label: 'Validation Results' },
        ]}
        title="Validation Results"
        actions={
          <button
            onClick={() => navigateToScreen('13_column_mapping', 'FLOW_C')}
            className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        }
      />

      {/* 4-Step Progress */}
      <div className="flex items-center space-x-2 text-xs font-data bg-white p-3 rounded-xl border border-[var(--border-default)] shadow-2xs">
        <span className="px-2.5 py-1 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)]">
          1. Upload File
        </span>
        <span className="text-[var(--text-tertiary)]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)]">
          2. Map Columns
        </span>
        <span className="text-[var(--text-tertiary)]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[var(--action-primary)]/10 text-[var(--text-primary)] font-bold border border-[var(--action-primary)]/20">
          3. Validate
        </span>
        <span className="text-[var(--text-tertiary)]">→</span>
        <span className="px-2.5 py-1 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)]">
          4. Confirm
        </span>
      </div>

      {/* Validation Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          title="Total rows"
          value="1,842"
          subtitle="Parsed from upload"
          trend="neutral"
        />

        <KpiCard
          title="Valid"
          value="1,798"
          subtitle="97.6% ready to import"
          trend="up"
          change="+97.6%"
        />

        <KpiCard
          title="Errors"
          value="44"
          subtitle="Flagged for review"
          trend="down"
          change="-2.4%"
        />

        <KpiCard
          title="Duplicates"
          value="0"
          subtitle="No overlap found"
          trend="neutral"
        />
      </div>

      {/* Prominent Warning Message Banner */}
      <div className="p-4 bg-[var(--color-brand-orange-500)]/5 border border-[var(--color-brand-orange-500)]/20 rounded-xl flex items-start space-x-3 text-xs">
        <AlertCircle className="w-5 h-5 text-[var(--status-warning)] shrink-0 mt-0.5" />
        <div className="text-[var(--text-primary)]">
          <p className="font-semibold text-[var(--status-warning)]">
            44 rows will be skipped unless corrected. You can still import the 1,798 valid rows now and fix the rest later.
          </p>
          <p className="text-[var(--text-secondary)] mt-1 font-data">
            Flagged items are quarantined in the error staging ledger and will not reach the calculation engine until resolved.
          </p>
        </div>
      </div>

      {/* Error Breakdown Table */}
      <div className="bg-white border border-[var(--border-default)] rounded-xl overflow-hidden shadow-2xs space-y-0">
        <div className="p-4 border-b border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Flagged Error Sample (Showing 3 of 44 rows)</h2>
          <button
            type="button"
            onClick={handleDownloadErrorReport}
            className="enterprise-btn-secondary h-8 px-3 text-xs font-semibold inline-flex items-center space-x-1.5 text-[var(--text-primary)] shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download error report (import_errors_job88.csv)</span>
          </button>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-default)] text-[var(--text-secondary)]">
              <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Row</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Error</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Field</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Value</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEEAF5]">
            {errorRows.map((err, idx) => (
              <tr key={idx} className="hover:bg-[var(--surface-secondary)]">
                <td className="py-3 px-4 font-data font-medium text-[var(--text-primary)]">
                  {err.rowNumber}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status="Rejected" customLabel={err.error} size="sm" />
                </td>
                <td className="py-3 px-4 text-[var(--text-secondary)] font-medium">
                  {err.field}
                </td>
                <td className="py-3 px-4 font-data text-[11px] text-[var(--text-primary)]">
                  <code className="bg-[var(--surface-secondary)] border border-[var(--border-default)] px-2 py-0.5 rounded text-[var(--status-warning)] font-data">
                    {err.value}
                  </code>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => navigateToScreen('15_fix_detail_view', 'FLOW_C')}
                    className="inline-flex items-center space-x-1 text-[var(--action-primary)] hover:underline font-semibold text-xs"
                  >
                    <span>Fix Row</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="p-4 bg-white border border-[var(--border-default)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <button
          type="button"
          onClick={() => navigateToScreen('13_column_mapping', 'FLOW_C')}
          className="enterprise-btn-secondary h-9 px-4 text-xs font-semibold"
        >
          Back
        </button>

        <div className="flex items-center space-x-3">
          <button
            id="btn-fix-flagged-rows"
            type="button"
            onClick={() => navigateToScreen('15_fix_detail_view', 'FLOW_C')}
            className="enterprise-btn-secondary h-9 px-4 text-xs font-semibold inline-flex items-center space-x-1.5 text-[var(--text-primary)]"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Fix Flagged Rows</span>
          </button>

          <button
            id="btn-import-valid-rows"
            type="button"
            onClick={handleImportValidRows}
            className="enterprise-btn-primary h-9 px-5 text-xs font-semibold shadow-xs flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Import 1,798 Valid Rows</span>
          </button>
        </div>
      </div>
    </div>
  );
};
