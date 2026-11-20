import type { ActivityRecord, ReportingPeriod } from '../../../types';

export function isWithinPeriod(record: ActivityRecord, period: ReportingPeriod | undefined) {
  return Boolean(period && record.date >= period.startDate && record.date <= period.endDate);
}

export function isPendingReview(record: ActivityRecord) {
  return record.status === 'Submitted' || record.status === 'Under Review';
}

export function hasValidationIssue(record: ActivityRecord) {
  return record.status === 'Error' || Boolean(record.validationErrors?.length);
}

export function needsAttention(record: ActivityRecord) {
  return hasValidationIssue(record) || record.status === 'Sent Back' || record.evidenceFiles.length === 0;
}
