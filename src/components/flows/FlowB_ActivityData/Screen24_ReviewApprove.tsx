import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CheckCircle2,
  FileText,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

interface BatchItem {
  id: string;
  date: string;
  source: string;
  quantity: number;
  unit: string;
  evidenceCount: number;
  evidenceName: string;
}

export const Screen24_ReviewApprove: React.FC = () => {
  const {
    navigateToScreen,
    showToast,
    addAuditLog,
    currentRole,
    currentUser,
  } = useApp();

  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<string | null>(null);

  const canApprove = currentRole === 'REVIEWER' || currentRole === 'TENANT_ADMIN';

  // Exact data from Screen 24 PRD specification
  const batchDetails = {
    id: '204',
    siteName: 'Chennai Plant 1',
    submittedBy: 'A. Kumar',
    submittedDate: '20-Aug-2025',
    items: [
      {
        id: 'ROW-204-01',
        date: '12-Aug-2025',
        source: 'Grid electricity',
        quantity: 48200,
        unit: 'kWh',
        evidenceCount: 1,
        evidenceName: 'TANGEDCO_HT_Bill_Jul_2025.pdf',
      },
      {
        id: 'ROW-204-02',
        date: '15-Aug-2025',
        source: 'Diesel generator',
        quantity: 320,
        unit: 'Litres',
        evidenceCount: 1,
        evidenceName: 'Fuel_Delivery_Challan_DG3.pdf',
      },
    ] as BatchItem[],
  };

  const handleApprove = () => {
    if (!canApprove) {
      setErrorMessage('Segregation of duties: only Reviewers and Tenant Admins can approve batches.');
      return;
    }
    setErrorMessage(null);

    // Audit event requirement: Who, When, What, Why
    addAuditLog({
      userName: currentUser.name,
      role: currentRole === 'TENANT_ADMIN' ? 'Tenant Admin' : 'Reviewer',
      action: 'Approved Batch #204',
      previousValue: 'Batch #204: Awaiting Review (2 activity records)',
      newValue: 'Batch #204: Approved and Committed to GHG Inventory',
      source: 'Workflow & Approvals',
      reason: comment || 'Verified against attached meter invoice and fuel delivery challan',
      status: 'Approved',
      lineItemId: 'Batch #204',
    });

    showToast('Batch #204 Approved', 'Activity data approved and committed to inventory.');
    // Navigates to Screen 25 — Approval History
    navigateToScreen('25_approval_history', 'FLOW_B');
  };

  const handleReturnForCorrection = () => {
    if (!canApprove) {
      setErrorMessage('Segregation of duties: only Reviewers and Tenant Admins can return batches.');
      return;
    }
    if (!comment.trim()) {
      setErrorMessage('Comment required before returning this submission.');
      return;
    }
    setErrorMessage(null);

    addAuditLog({
      userName: currentUser.name,
      role: currentRole === 'TENANT_ADMIN' ? 'Tenant Admin' : 'Reviewer',
      action: 'Returned Batch #204 for correction',
      previousValue: 'Batch #204: Awaiting Review',
      newValue: 'Batch #204: Returned for correction to A. Kumar',
      source: 'Workflow & Approvals',
      reason: comment,
      status: 'Returned',
      lineItemId: 'Batch #204',
    });

    showToast('Batch Returned', 'Returned to submitter for correction with feedback.');
    navigateToScreen('25_approval_history', 'FLOW_B');
  };

  const handleReject = () => {
    if (!canApprove) {
      setErrorMessage('Segregation of duties: only Reviewers and Tenant Admins can reject batches.');
      return;
    }
    if (!comment.trim()) {
      setErrorMessage('Comment required before rejecting this submission.');
      return;
    }
    setErrorMessage(null);

    addAuditLog({
      userName: currentUser.name,
      role: currentRole === 'TENANT_ADMIN' ? 'Tenant Admin' : 'Reviewer',
      action: 'Rejected Batch #204',
      previousValue: 'Batch #204: Awaiting Review',
      newValue: 'Batch #204: Rejected',
      source: 'Workflow & Approvals',
      reason: comment,
      status: 'Rejected',
      lineItemId: 'Batch #204',
    });

    showToast('Batch Rejected', 'Batch #204 rejected. Logged to append-only audit trail.');
    navigateToScreen('25_approval_history', 'FLOW_B');
  };

  return (
    <div id="screen-24-container" className="w-full space-y-6">
      {/* Header & Hierarchy */}
      <PageHeader
        breadcrumbs={[
          { label: 'Workflow & Approvals' },
          { label: 'Submission Queue', onClick: () => navigateToScreen('23_submission_queue', 'FLOW_B') },
          { label: 'Batch #204' },
        ]}
        title="Review Batch #204 — Chennai Plant 1"
        badge={
          <StatusBadge status="Pending" customLabel="Awaiting Review" size="sm" />
        }
        contextInfo={
          <span className="route-path text-xs text-[var(--text-tertiary)] font-medium">
            /workflow/queue/204
          </span>
        }
        actions={
          <button
            onClick={() => navigateToScreen('23_submission_queue', 'FLOW_B')}
            className="enterprise-btn-secondary h-9 px-3.5 flex items-center space-x-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Queue</span>
          </button>
        }
      />

      {/* Segregation of Duties Notice when role is DATA_ENTRY or VERIFIER */}
      {!canApprove && (
        <div className="p-3 bg-[var(--status-warning-bg)] border border-[var(--status-warning)] rounded-xl flex items-center space-x-2.5 text-xs text-[var(--status-warning)] font-medium">
          <AlertTriangle className="w-4 h-4 text-[var(--status-warning)] shrink-0" />
          <span>Read-Only: Batch sign-off requires Reviewer or Tenant Admin permissions.</span>
        </div>
      )}

      {/* Review Table (FR Section 9.1) */}
      <div className="bg-white border border-[var(--border-default)] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(20,20,20,0.04)]">
        <div className="p-4 border-b border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-[var(--text-primary)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)] font-sans">Submitted Activity Rows</h2>
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-sans">
            Submitted by <span className="font-medium text-[var(--text-primary)]">{batchDetails.submittedBy}</span> on <span className="period-code font-medium">{batchDetails.submittedDate}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--bg-canvas)] border-b border-[var(--border-default)] text-[var(--text-secondary)]">
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Source</th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-left">Quantity</th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Unit</th>
                <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEAF5]">
              {batchDetails.items.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--surface-secondary)] transition-colors">
                  <td className="py-3.5 px-4 period-code text-[var(--text-secondary)]">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[var(--text-primary)]">
                    {item.source}
                  </td>
                  <td className="py-3.5 px-4 text-left period-code font-medium text-[var(--text-primary)]">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 emission-factor text-[var(--text-secondary)]">
                    {item.unit}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => setActiveEvidenceModal(item.evidenceName)}
                      className="inline-flex items-center space-x-1.5 text-xs text-[var(--action-primary)] hover:underline font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                      <span>{item.evidenceCount} file attached</span>
                      <span className="text-[11px] text-[var(--text-tertiary)] file-hash">({item.evidenceName})</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviewer Comment Area (Section 10) */}
      <div className="p-5 bg-white border border-[var(--border-default)] rounded-xl space-y-3 shadow-2xs">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-1 font-sans">
            Reviewer comment
          </label>
          <p className="text-[11px] text-[var(--text-secondary)] mb-2 font-data">
            Field label: Comment · Mandatory on non-approval actions (Return for Correction or Reject).
          </p>
          <textarea
            id="reviewer-comment-input"
            rows={3}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Add a note (required if returning for correction)"
            className={`w-full px-3 py-2 text-xs border rounded-lg text-[var(--text-primary)] focus:outline-none font-sans ${
              errorMessage
                ? 'border-[var(--color-brand-orange-500)] bg-[var(--status-error-bg)]/30 focus:border-[var(--color-brand-orange-500)]'
                : 'border-[var(--border-default)] focus:border-[var(--action-primary)]'
            }`}
          />
        </div>

        {/* Validation error message */}
        {errorMessage && (
          <div className="p-2.5 bg-[var(--status-error-bg)] border border-[#F46A1F]/30 rounded-lg text-xs text-[var(--status-warning)] flex items-center space-x-2 font-data">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Actions (Section 10.1 & 10.2) */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Reject (Destructive) */}
            <button
              id="btn-reject-batch"
              type="button"
              onClick={handleReject}
              disabled={!canApprove}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors text-center ${
                canApprove
                  ? 'bg-white border border-[var(--color-brand-orange-500)] text-[var(--status-warning)] hover:bg-[var(--status-error-bg)]'
                  : 'bg-[var(--bg-canvas)] border border-[var(--border-default)] text-[var(--text-tertiary)] cursor-not-allowed opacity-60'
              }`}
            >
              Reject
            </button>

            {/* Return for Correction (Secondary) */}
            <button
              id="btn-return-correction"
              type="button"
              onClick={handleReturnForCorrection}
              disabled={!canApprove}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors text-center ${
                canApprove
                  ? 'bg-white border border-[#9A4F00] text-[var(--status-warning)] hover:bg-[var(--status-warning-bg)]'
                  : 'bg-[var(--bg-canvas)] border border-[var(--border-default)] text-[var(--text-tertiary)] cursor-not-allowed opacity-60'
              }`}
            >
              Return for Correction
            </button>
          </div>

          {/* Approve (Primary) */}
          <button
            id="btn-approve-batch"
            type="button"
            onClick={handleApprove}
            disabled={!canApprove}
            className={`h-9 px-6 text-xs inline-flex items-center justify-center space-x-1.5 shadow-xs font-semibold rounded-lg transition-colors ${
              canApprove
                ? 'enterprise-btn-primary'
                : 'bg-[var(--border-default)] text-[var(--text-tertiary)] cursor-not-allowed opacity-60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Audit Requirement Note (Section 10.3) */}
      <div className="p-3.5 bg-white border border-[var(--border-default)] rounded-xl text-xs text-[var(--text-secondary)] flex items-start space-x-2.5 shadow-2xs font-data">
        <ShieldCheck className="w-4 h-4 text-[var(--text-primary)] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[var(--text-primary)] font-semibold">Audit Requirement:</strong> Every workflow action writes to an append-only audit trail recording: <em>Who ({currentUser.name} as {currentRole === 'TENANT_ADMIN' ? 'Tenant Admin' : 'Reviewer'}), When, What, and Why</em>. Recorded events are permanently preserved for verifier inspection.
        </div>
      </div>

      {/* Evidence Viewer Dialog Simulation */}
      {activeEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[var(--border-default)] max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[var(--text-primary)]" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)] font-sans">{activeEvidenceModal}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveEvidenceModal(null)}
                className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-6 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-lg font-data text-xs text-[var(--text-secondary)] text-center space-y-2">
              <div className="font-semibold text-[var(--text-primary)]">Primary Utility Evidence Document</div>
              <div className="file-hash">Source File: {activeEvidenceModal}</div>
              <div className="text-[11px] text-[var(--status-success)] font-semibold">Verified & attached from document repository</div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActiveEvidenceModal(null)}
                className="enterprise-btn-primary h-8 px-4 text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
