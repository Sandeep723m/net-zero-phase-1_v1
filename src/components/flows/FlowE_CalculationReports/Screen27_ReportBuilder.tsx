import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText,
  Info,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen27_ReportBuilder: React.FC = () => {
  const { navigateToScreen, showToast } = useApp();

  const [reportingPeriod, setReportingPeriod] = useState('FY 2025–26');
  const [reportType, setReportType] = useState('GHG Inventory (Scope 1+2)');
  const [sitesIncluded, setSitesIncluded] = useState('All Sites');
  const [format, setFormat] = useState('PDF');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    showToast('Validating Scope', 'Compiling versioned calculation data for GHG Inventory report...');

    setTimeout(() => {
      setIsGenerating(false);
      showToast('Preview Ready', 'Opening Report Preview.');
      // Navigates to Screen 28
      navigateToScreen('28_report_preview', 'FLOW_E');
    }, 700);
  };

  return (
    <div id="screen-27-container" className="w-full space-y-6">
      {/* Header & Hierarchy */}
      <PageHeader
        breadcrumbs={[
          { label: 'Reporting' },
          { label: 'Report Builder' },
        ]}
        title="Report Builder"
        badge={
          <StatusBadge status="Active" customLabel="Phase 1 Ready" size="sm" />
        }
        contextInfo={
          <span className="route-path text-xs text-[var(--text-tertiary)] font-medium">
            /reports/new
          </span>
        }
        actions={
          <button
            onClick={() => navigateToScreen('20_results_summary', 'FLOW_E')}
            className="enterprise-btn-secondary h-9 px-3.5 flex items-center space-x-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Calculations</span>
          </button>
        }
      />

      {/* Scope Guidance Panel (Section 16.2) */}
      <div className="p-3.5 bg-[var(--status-warning-bg)]/40 border border-[#9A4F00]/30 rounded-xl text-xs text-[#7A271A] flex items-start space-x-2.5 shadow-2xs font-data">
        <Info className="w-4 h-4 text-[var(--status-warning)] shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-[var(--text-primary)]">Product Scope Guidance:</strong> PCAF, ISO 14067, CBAM and CCTS report types are Phase 2/3 — <strong>GHG Inventory</strong> is the Phase 1 output.
        </div>
      </div>

      {/* Form Structure (Section 16.1 & FR-27.01 - FR-27.04) */}
      <form onSubmit={handleGeneratePreview} className="space-y-6">
        <div className="p-6 bg-white border border-[var(--border-default)] rounded-xl space-y-5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] font-sans">Report Parameters</h2>
            <StatusBadge status="Approved" customLabel="Locked Period Data Active" size="sm" />
          </div>

          {/* Reporting Period */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 font-sans">
              Reporting period <span className="text-[var(--status-error)]">*</span>
            </label>
            <div className="relative">
              <select
                value={reportingPeriod}
                onChange={(e) => setReportingPeriod(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] font-sans"
              >
                <option value="FY 2025–26">FY 2025–26 (Apr 2025 – Mar 2026) — Default</option>
                <option value="FY 2024–25">FY 2024–25 (Historical Snapshot)</option>
              </select>
            </div>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 font-sans">
              Report type <span className="text-[var(--status-error)]">*</span>
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] font-sans"
            >
              <option value="GHG Inventory (Scope 1+2)">
                GHG Inventory (Scope 1+2) — Phase 1 Standard
              </option>
              <option value="SEBI BRSR Core Principal" disabled>
                SEBI BRSR Core Principles (Phase 2)
              </option>
              <option value="CBAM" disabled>
                EU CBAM Declaration (Phase 2)
              </option>
              <option value="ISO 14067" disabled>
                ISO 14067 Carbon Footprint (Phase 3)
              </option>
            </select>
          </div>

          {/* Sites Included */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 font-sans">
              Sites included <span className="text-[var(--status-error)]">*</span>
            </label>
            <select
              value={sitesIncluded}
              onChange={(e) => setSitesIncluded(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] font-sans"
            >
              <option value="All Sites">All Sites (Chennai Plant 1, Pune Warehouse, Hyderabad HQ)</option>
              <option value="Chennai Plant 1">Chennai Plant 1 Only</option>
              <option value="Pune Warehouse">Pune Warehouse Only</option>
              <option value="Hyderabad HQ">Hyderabad HQ Only</option>
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1 font-sans">
              Format <span className="text-[var(--status-error)]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 border rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
                  format === 'PDF' ? 'border-[var(--action-primary)] bg-[var(--action-primary)]/5 shadow-2xs' : 'border-[var(--border-default)] hover:bg-[var(--surface-secondary)]'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="PDF"
                  checked={format === 'PDF'}
                  onChange={() => setFormat('PDF')}
                  className="text-[var(--text-primary)] accent-[#5625B8]"
                />
                <div>
                  <div className="text-xs font-semibold text-[var(--text-primary)] font-sans">PDF Document</div>
                  <div className="text-[11px] text-[var(--text-secondary)] font-data">
                    Formal audit-ready disclosure format with cryptographic timestamp
                  </div>
                </div>
              </label>

              <label
                className={`p-3 border rounded-xl flex items-center space-x-3 cursor-pointer transition-all ${
                  format === 'Excel' ? 'border-[var(--action-primary)] bg-[var(--action-primary)]/5 shadow-2xs' : 'border-[var(--border-default)] hover:bg-[var(--surface-secondary)]'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value="Excel"
                  checked={format === 'Excel'}
                  onChange={() => setFormat('Excel')}
                  className="text-[var(--text-primary)] accent-[#5625B8]"
                />
                <div>
                  <div className="text-xs font-semibold text-[var(--text-primary)] font-sans">Excel / CSV Workbook</div>
                  <div className="text-[11px] text-[var(--text-secondary)] font-data">
                    Tabular activity records with emission factors applied
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Primary Action (Section 16.3 & FR-27.05) */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigateToScreen('21_drill_down', 'FLOW_E')}
            className="enterprise-btn-secondary h-9 px-4 text-xs font-semibold"
          >
            Cancel
          </button>

          <button
            id="btn-generate-preview"
            type="submit"
            disabled={isGenerating}
            className="enterprise-btn-primary h-9 px-6 text-xs inline-flex items-center space-x-2 shadow-xs font-semibold disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Validating & Compiling…' : 'Generate Preview'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
