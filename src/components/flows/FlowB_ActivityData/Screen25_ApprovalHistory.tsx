import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Calendar,
  Building2,
  ArrowRight,
  ArrowLeft,
  Lock,
  ExternalLink,
  HelpCircle,
  Activity,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

interface ApprovalHistoryRow {
  batchId: string;
  siteName: string;
  reviewedBy: string;
  date: string;
  outcome: 'Approved' | 'Returned' | 'Rejected';
  comment: string;
}

export const Screen25_ApprovalHistory: React.FC = () => {
  const { navigateToScreen, currentRole, currentUser, auditTrail } = useApp();

  const [siteFilter, setSiteFilter] = useState('All Sites');
  const [periodFilter, setPeriodFilter] = useState('FY 2025–26');

  // Exact base data from Screen 25 PRD specification
  const baseHistoryData: ApprovalHistoryRow[] = [
    {
      batchId: '#204',
      siteName: 'Chennai Plant 1',
      reviewedBy: 'S. Iyer',
      date: '20-Aug-2025',
      outcome: 'Approved',
      comment: 'Verified against primary meter bill and fuel delivery receipts',
    },
    {
      batchId: '#203',
      siteName: 'Chennai Plant 1',
      reviewedBy: 'S. Iyer',
      date: '18-Aug-2025',
      outcome: 'Approved',
      comment: '—',
    },
    {
      batchId: '#198',
      siteName: 'Pune Warehouse',
      reviewedBy: 'S. Iyer',
      date: '15-Aug-2025',
      outcome: 'Returned',
      comment: 'Missing evidence for 2 rows',
    },
  ];

  // Merge live audit trail events for batches
  const historyData = useMemo<ApprovalHistoryRow[]>(() => {
    const liveBatchEvents: ApprovalHistoryRow[] = auditTrail
      .filter((log) => log.source?.includes('Workflow') || log.source?.includes('Screen 24') || log.lineItemId?.includes('Batch'))
      .map((log) => ({
        batchId: log.lineItemId || '#204',
        siteName: 'Chennai Plant 1',
        reviewedBy: log.userName,
        date: log.timestamp.split(' ')[0] || 'Today',
        outcome: log.status === 'Approved' ? 'Approved' : log.status === 'Returned' ? 'Returned' : 'Rejected',
        comment: log.reason || '—',
      }));

    // Put live events first, avoid duplicates for batch-204
    const existingBatchIds = new Set(liveBatchEvents.map((e) => e.batchId));
    const dedupedBase = baseHistoryData.filter((b) => !existingBatchIds.has(b.batchId));
    return [...liveBatchEvents, ...dedupedBase];
  }, [auditTrail]);

  const filteredHistory = historyData.filter((item) => {
    if (siteFilter !== 'All Sites' && item.siteName !== siteFilter) return false;
    return true;
  });

  return (
    <div id="screen-25-container" className="w-full space-y-6">
      {/* Header & Hierarchy */}
      <PageHeader
        breadcrumbs={[
          { label: 'Workflow & Approvals' },
          { label: 'Approval History' },
        ]}
        title="Approval History"
        badge={
          <StatusBadge status="Locked" customLabel="Read-only historical ledger" size="sm" />
        }
        contextInfo={
          <span className="route-path text-xs text-[var(--text-tertiary)] font-medium">
            /workflow/history
          </span>
        }
        actions={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateToScreen('23_submission_queue', 'FLOW_B')}
              className="enterprise-btn-secondary h-9 px-3.5 flex items-center space-x-1.5 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Queue</span>
            </button>

            {currentRole === 'TENANT_ADMIN' ? (
              <button
                onClick={() => navigateToScreen('26_period_lock', 'FLOW_B')}
                className="enterprise-btn-primary h-9 px-3.5 flex items-center space-x-1.5 text-xs shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Period Lock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : currentRole === 'REVIEWER' ? (
              <button
                onClick={() => navigateToScreen('33_raise_query', 'FLOW_F')}
                className="enterprise-btn-primary h-9 px-3.5 flex items-center space-x-1.5 text-xs shadow-xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Verifier Queries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => navigateToScreen('10_activity_dashboard', 'FLOW_B')}
                className="enterprise-btn-secondary h-9 px-3.5 flex items-center space-x-1.5 text-xs"
              >
                <Activity className="w-3.5 h-3.5 text-[var(--text-primary)]" />
                <span>Activity Dashboard</span>
              </button>
            )}
          </div>
        }
      />

      {/* Filter Toolbar (FR-25.07, FR-25.08) */}
      <div className="p-4 bg-white border border-[var(--border-default)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <label className="text-xs font-semibold text-[var(--text-secondary)] font-sans">Site:</label>
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-[var(--border-default)] rounded-lg bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] font-sans"
            >
              <option value="All Sites">All Sites</option>
              <option value="Chennai Plant 1">Chennai Plant 1</option>
              <option value="Pune Warehouse">Pune Warehouse</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <label className="text-xs font-semibold text-[var(--text-secondary)] font-sans">Period:</label>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-[var(--border-default)] rounded-lg bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] font-sans"
            >
              <option value="FY 2025–26">FY 2025–26</option>
              <option value="FY 2024–25">FY 2024–25</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
          className="text-xs text-[var(--action-primary)] hover:underline flex items-center space-x-1 font-semibold"
        >
          <span>View Comprehensive Audit Trail</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* History Table (FR-25.01 - FR-25.06) */}
      <div className="bg-white border border-[var(--border-default)] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--bg-canvas)] border-b border-[var(--border-default)] text-[var(--text-secondary)]">
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Batch</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Site</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Reviewed By</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Outcome</th>
              <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Comment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEEAF5]">
            {filteredHistory.map((item, idx) => (
              <tr key={idx} className="hover:bg-[var(--surface-secondary)] transition-colors">
                <td className="py-3.5 px-4 activity-id font-medium text-[var(--text-primary)]">
                  {item.batchId}
                </td>
                <td className="py-3.5 px-4 text-[var(--text-primary)] font-semibold">
                  {item.siteName}
                </td>
                <td className="py-3.5 px-4 text-[var(--text-secondary)] font-data">
                  {item.reviewedBy}
                </td>
                <td className="py-3.5 px-4 period-code text-[var(--text-secondary)]">
                  {item.date}
                </td>
                <td className="py-3.5 px-4">
                  {item.outcome === 'Approved' ? (
                    <StatusBadge status="Approved" size="sm" />
                  ) : (
                    <StatusBadge status="Returned" size="sm" />
                  )}
                </td>
                <td className="py-3.5 px-4 text-[var(--text-secondary)] max-w-xs truncate font-data">
                  {item.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-[var(--text-tertiary)] text-center pt-2 font-data">
        Approval history records are immutable and permanently available to verification auditors.
      </div>
    </div>
  );
};
