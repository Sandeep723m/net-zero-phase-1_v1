import React from 'react';
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle,
  Lock,
  FileCheck,
  HelpCircle,
} from 'lucide-react';

export type StatusType =
  | 'Approved'
  | 'Pending'
  | 'Submitted'
  | 'Under Review'
  | 'Draft'
  | 'Sent Back'
  | 'Returned'
  | 'Locked'
  | 'Error'
  | 'Failed'
  | 'Flagged'
  | 'Rejected'
  | 'Default'
  | 'Initiated'
  | 'Active'
  | 'Ready'
  | 'Ready for review'
  | 'In Progress'
  | 'Resolved'
  | 'Open'
  | 'Answered'
  | 'Closed'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
  customLabel?: string;
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  customLabel,
  className = '',
}) => {
  const normStatus = (status || '').toLowerCase().trim();

  let colorClasses = 'bg-[var(--status-neutral-bg)] text-[var(--status-neutral)] border-[var(--border-default)]';
  let IconComponent: React.ElementType = FileCheck;

  if (
    normStatus === 'approved' ||
    normStatus === 'published' ||
    normStatus === 'verified' ||
    normStatus === 'active' ||
    normStatus === 'ready' ||
    normStatus === 'ready for review' ||
    normStatus === 'resolved' ||
    normStatus === 'closed'
  ) {
    colorClasses = 'bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success)]/25';
    IconComponent = CheckCircle2;
  } else if (
    normStatus === 'pending' ||
    normStatus === 'submitted' ||
    normStatus === 'under review' ||
    normStatus === 'in review' ||
    normStatus === 'in progress' ||
    normStatus === 'initiated'
  ) {
    colorClasses = 'bg-[var(--status-info-bg)] text-[var(--status-info)] border-[var(--status-info)]/25';
    IconComponent = Clock;
  } else if (
    normStatus === 'returned' ||
    normStatus === 'sent back' ||
    normStatus === 'warning' ||
    normStatus === 'failed' ||
    normStatus === 'needs review' ||
    normStatus === 'correction'
  ) {
    colorClasses = 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning)]/25';
    IconComponent = RotateCcw;
  } else if (
    normStatus === 'flagged' ||
    normStatus === 'rejected' ||
    normStatus === 'error' ||
    normStatus === 'critical' ||
    normStatus === 'urgent' ||
    normStatus === 'action required'
  ) {
    colorClasses = 'bg-[var(--status-error-bg)] text-[var(--status-error)] border-[var(--status-error)]/25';
    IconComponent = AlertCircle;
  } else if (normStatus === 'locked') {
    colorClasses = 'bg-[var(--status-neutral-bg)] text-[var(--status-neutral)] border-[var(--border-default)]';
    IconComponent = Lock;
  } else if (normStatus === 'default' || normStatus === 'info') {
    colorClasses = 'bg-[var(--status-info-bg)] text-[var(--status-info)] border-[var(--status-info)]/25';
    IconComponent = HelpCircle;
  }

  const heightClass = size === 'sm' ? 'h-5 px-2 text-[11px]' : 'h-6 px-2.5 text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const labelText = customLabel || status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border select-none whitespace-nowrap ${heightClass} ${colorClasses} ${className}`}
      role="status"
    >
      <IconComponent className={`${iconSize} shrink-0`} aria-hidden="true" />
      <span>{labelText}</span>
    </span>
  );
};
