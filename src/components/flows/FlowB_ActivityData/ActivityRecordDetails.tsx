import { useEffect, useRef, useState } from 'react';
import { FileText, X } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import type { ActivityRecord } from '../../../types';
import { StatusBadge } from '../../common/StatusBadge';
import { hasValidationIssue, isPendingReview, isWithinPeriod } from './ledgerRecords';

const number = new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 });

function evidenceLink(url?: string) {
  if (url && /^(https?:\/\/|blob:|\/[^/])/i.test(url)) return url;
  return undefined;
}

export function ActivityRecordDetails({ record, onClose }: { record: ActivityRecord; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { emissionSources, currentRole, currentUser, activePeriod, approveRecord, sendBackRecord } = useApp();
  const [reviewNote, setReviewNote] = useState('');
  const [decision, setDecision] = useState<'approve' | 'return' | null>(null);
  const canReview = (currentRole === 'TENANT_ADMIN' || currentRole === 'REVIEWER') &&
    isPendingReview(record) && isWithinPeriod(record, activePeriod) && !activePeriod?.locked &&
    (currentUser.siteScope.includes('all') || currentUser.siteScope.includes(record.siteId));
  const canApprove = canReview && record.evidenceFiles.length > 0 && !hasValidationIssue(record);
  const source = emissionSources.find(({ id }) => id === record.sourceId);

  useEffect(() => {
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-labelledby="record-details-title"
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(36rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-0 text-[var(--text-primary)] shadow-xl backdrop:bg-black/35"
    >
      <header className="flex items-start justify-between gap-3 border-b border-[var(--border-subtle)] p-5">
        <div>
          <p className="font-mono text-xs text-[var(--text-secondary)]">{record.id}</p>
          <h2 id="record-details-title" className="mt-1 text-xl font-semibold">{record.sourceName}</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{record.siteName} · {record.scope} · {record.date}</p>
        </div>
        <form method="dialog">
          <button type="submit" aria-label="Close record details" className="grid size-9 place-items-center rounded-md border border-[var(--border-default)] hover:bg-[var(--bg-canvas)]"><X className="size-4" aria-hidden="true" /></button>
        </form>
      </header>
      <div className="space-y-6 p-5">
        <section aria-labelledby="record-workflow">
          <h3 id="record-workflow" className="text-sm font-semibold">Workflow and validation</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {record.status === 'Error' ? <span className="text-sm text-[var(--text-secondary)]">Workflow status unavailable</span> : <StatusBadge status={record.status} />}
            {record.validationErrors?.length || record.status === 'Error' ? <StatusBadge status="Error" /> : null}
          </div>
          {record.validationErrors?.length ? <ul className="mt-2 list-inside list-disc text-sm text-[var(--status-error)]">{record.validationErrors.map((issue, index) => <li key={index}>{issue}</li>)}</ul> : null}
          {record.reviewerComment && !record.validationErrors?.includes(record.reviewerComment) && <p className="mt-2 text-sm text-[var(--text-secondary)]">Reviewer note · {record.reviewerComment}</p>}
          {record.approvedBy && <p className="mt-2 text-xs text-[var(--text-secondary)]">Approved by {record.approvedBy}{record.approvedAt && ` · ${record.approvedAt}`}</p>}
        </section>

        <section aria-labelledby="record-calculation">
          <h3 id="record-calculation" className="text-sm font-semibold">Calculation inputs</h3>
          <dl className="mt-2 grid grid-cols-1 gap-3 rounded-md border border-[var(--border-subtle)] p-3 text-sm sm:grid-cols-2">
            <div><dt className="text-xs text-[var(--text-secondary)]">Activity quantity</dt><dd>{number.format(record.quantity)} {record.unit}</dd></div>
            <div><dt className="text-xs text-[var(--text-secondary)]">Recorded estimate</dt><dd>{number.format(record.emissions_tCO2e)} tCO₂e</dd></div>
            <div><dt className="text-xs text-[var(--text-secondary)]">Applied factor</dt><dd>{number.format(record.emissionFactorApplied)} {record.emissionFactorUnit}</dd></div>
            <div><dt className="text-xs text-[var(--text-secondary)]">Calculation run</dt><dd>No run linked to this record</dd></div>
            <div><dt className="text-xs text-[var(--text-secondary)]">Current source method</dt><dd>{source?.method || 'Unavailable'}</dd></div>
            <div><dt className="text-xs text-[var(--text-secondary)]">Current factor reference</dt><dd>{source?.factorSource || 'Unavailable'}</dd></div>
          </dl>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">Current source settings can differ from the factor applied to this record.</p>
        </section>

        <section aria-labelledby="record-evidence">
          <h3 id="record-evidence" className="text-sm font-semibold">Evidence</h3>
          {record.evidenceFiles.length ? <ul className="mt-2 divide-y divide-[var(--border-subtle)]">
            {record.evidenceFiles.map((file) => {
              const url = evidenceLink(file.url);
              return <li key={file.id} className="flex items-start gap-2 py-2 text-sm">
                <FileText className="mt-0.5 size-4 shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="wrap-anywhere">{url ? <a href={url} target="_blank" rel="noreferrer" className="text-[var(--action-primary)] underline">{file.name}</a> : file.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{[file.size, file.uploadedBy, file.uploadedAt, !url && 'File preview unavailable'].filter(Boolean).join(' · ')}</p>
                </div>
              </li>;
            })}
          </ul> : <p className="mt-2 text-sm text-[var(--status-warning)]">No evidence attached.</p>}
        </section>
        {canReview && (
          <section aria-labelledby="record-review" className="space-y-3 border-t border-[var(--border-subtle)] pt-4">
            <h3 id="record-review" className="text-sm font-semibold">Review decision</h3>
            {!canApprove && <p className="text-sm text-[var(--text-secondary)]">Approval requires attached evidence and resolution of flagged validation issues.</p>}
            <div className="flex flex-wrap gap-2">
              {canApprove && <button type="button" className="enterprise-btn-primary" aria-pressed={decision === 'approve'} onClick={() => setDecision('approve')}>Approve record</button>}
              <button type="button" className="enterprise-btn-secondary" aria-pressed={decision === 'return'} onClick={() => setDecision('return')}>Return for correction</button>
            </div>
            {decision && (
              <form className="space-y-3" onSubmit={(event) => {
                event.preventDefault();
                const note = reviewNote.trim();
                if (decision === 'approve' && canApprove) approveRecord(record.id, note || undefined);
                else if (decision === 'return' && canReview && note) sendBackRecord(record.id, note);
                else return;
                setDecision(null);
                setReviewNote('');
              }}>
                <label className="block space-y-1 text-sm font-medium">
                  <span>{decision === 'return' ? 'Reason for returning' : 'Review note (optional)'}</span>
                  <textarea value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} required={decision === 'return'} className="block min-h-20 w-full rounded-md border border-[var(--border-default)] p-2 text-sm" />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button className="enterprise-btn-primary disabled:opacity-50" type="submit" disabled={decision === 'return' && !reviewNote.trim()}>{decision === 'return' ? 'Confirm return' : 'Confirm approval'}</button>
                  <button className="enterprise-btn-secondary" type="button" onClick={() => setDecision(null)}>Cancel</button>
                </div>
              </form>
            )}
          </section>
        )}
      </div>
    </dialog>
  );
}
