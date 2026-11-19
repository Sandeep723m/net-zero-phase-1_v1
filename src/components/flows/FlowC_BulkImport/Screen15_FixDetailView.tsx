import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  AlertCircle,
  ArrowLeft,
  Trash2,
  Check,
  History,
  Info,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen15_FixDetailView: React.FC = () => {
  const {
    addActivityRecord,
    activePeriod,
    navigateToScreen,
    showToast,
    addAuditLog,
  } = useApp();

  // State for Row #1042
  const [site, setSite] = useState('Chennai Plant One');
  const [source, setSource] = useState('Grid electricity');
  const [date, setDate] = useState('2025-08-12');
  const [quantity, setQuantity] = useState('48200');
  const [unit, setUnit] = useState('kWh');

  const historyItems = [
    {
      when: '12-Aug 14:02',
      who: 'Import job #88',
      change: 'Row created by bulk import',
    },
    {
      when: '12-Aug 14:05',
      who: 'System',
      change: 'Flagged: site not found',
    },
  ];

  const hasSiteError = site === 'Chennai Plant One';

  const applySuggestedSite = () => {
    setSite('Chennai Plant 1');
    showToast('Correction applied', "Site corrected to 'Chennai Plant 1'. Click Save Correction to commit.");
  };

  const handleSaveCorrection = () => {
    if (hasSiteError) {
      showToast('Validation Error', "Please correct the site before saving.", 'error');
      return;
    }

    addAuditLog({
      userName: 'A. Kumar',
      role: 'Data Entry',
      action: 'Corrected Activity Data Row #1042',
      previousValue: 'Site: Chennai Plant One',
      newValue: 'Site: Chennai Plant 1 (Grid electricity: 48,200 kWh)',
      source: 'Activity Data Detail / Edit (/activity-data/1042)',
      reason: 'Resolved bulk import site matching error',
      status: 'Corrected',
      lineItemId: 'Row #1042',
    });

    addActivityRecord({
      periodId: activePeriod.id,
      siteId: 'site-chennai-1',
      siteName: 'Chennai Plant 1',
      sourceId: 'src-elec-1',
      sourceName: 'Grid electricity (TANGEDCO)',
      scope: 'Scope 2',
      date,
      quantity: parseFloat(quantity),
      unit,
      emissionFactor: 0.82,
      factorUnit: 'kg CO2e / kWh',
      factorSource: 'CEA CO2 Baseline Database v19 (India)',
      emissions_tCO2e: (parseFloat(quantity) * 0.82) / 1000,
      status: 'Approved',
      notes: 'Import job #88 Row #1042 corrected from Chennai Plant One to Chennai Plant 1',
    });

    showToast('Correction Saved', 'Row #1042 successfully corrected and committed to Activity Data.');
    navigateToScreen('10_activity_dashboard', 'FLOW_B');
  };

  const handleDiscardRow = () => {
    addAuditLog({
      userName: 'A. Kumar',
      role: 'Data Entry',
      action: 'Discarded Flagged Row #1042',
      previousValue: 'Site: Chennai Plant One, 48,200 kWh',
      newValue: 'Status: Discarded',
      source: 'Activity Data Detail / Edit',
      reason: 'Rejected by operator during validation correction',
      status: 'Discarded',
      lineItemId: 'Row #1042',
    });

    showToast('Row Discarded', 'Row #1042 was permanently discarded from import batch.');
    navigateToScreen('14_validation_results', 'FLOW_C');
  };

  return (
    <div id="screen-15-container" className="w-full space-y-6 font-sans">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'Row #1042' },
        ]}
        title="Activity Data — Row #1042"
        actions={
          <div className="flex items-center space-x-2">
            <StatusBadge
              status={hasSiteError ? 'Rejected' : 'Approved'}
              customLabel={hasSiteError ? 'Error' : 'Resolved'}
              size="md"
            />
            <button
              onClick={() => navigateToScreen('14_validation_results', 'FLOW_C')}
              className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Validation</span>
            </button>
          </div>
        }
      />

      {/* Main Form & Validation Error Box */}
      <div className="p-5 bg-white border border-[var(--border-default)] rounded-xl shadow-2xs space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] pb-2 border-b border-[var(--border-subtle)]">
          Entry Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Site Field with Inline Validation Error */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Site <span className="text-[var(--status-error)]">*</span>
            </label>
            <div className="flex gap-2">
              <select
                id="edit-site-select"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className={`flex-1 px-3 py-2 text-xs border rounded-lg bg-white text-[var(--text-primary)] focus:outline-none ${
                  hasSiteError ? 'border-[#C63C46] bg-[var(--status-error)]/5' : 'border-[var(--border-default)] focus:border-[var(--action-primary)]'
                }`}
              >
                <option value="Chennai Plant One">Chennai Plant One (Flagged Unrecognized)</option>
                <option value="Chennai Plant 1">Chennai Plant 1 (Tamil Nadu)</option>
                <option value="Pune Warehouse">Pune Warehouse (Maharashtra)</option>
                <option value="Hyderabad HQ">Hyderabad HQ (Telangana)</option>
              </select>

              {hasSiteError && (
                <button
                  type="button"
                  onClick={applySuggestedSite}
                  className="enterprise-btn-secondary h-9 px-3 text-xs font-semibold inline-flex items-center text-[var(--text-primary)] shrink-0"
                >
                  Apply "Chennai Plant 1"
                </button>
              )}
            </div>

            {/* Inline validation error beneath site field */}
            {hasSiteError && (
              <div className="mt-2 p-3 bg-[var(--status-error)]/5 border border-[#C63C46]/20 rounded-lg text-xs text-[var(--status-error)] flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="font-data">
                  <strong>Validation error:</strong> 'Chennai Plant One' does not match any configured site. Did you mean 'Chennai Plant 1'?
                </span>
              </div>
            )}
          </div>

          {/* Emission source */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Emission source <span className="text-[var(--status-error)]">*</span>
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] bg-white font-medium"
            />
          </div>

          {/* Activity date */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Activity date <span className="text-[var(--status-error)]">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] bg-white font-data"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Quantity <span className="text-[var(--status-error)]">*</span>
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg font-data text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] bg-white font-medium"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
              Unit <span className="text-[var(--status-error)]">*</span>
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg font-data bg-[var(--surface-secondary)] text-[var(--text-primary)] focus:outline-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* Change History Table */}
      <div className="bg-white border border-[var(--border-default)] rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[var(--border-default)] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-[var(--text-primary)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Change History</h2>
          </div>
          <button
            type="button"
            onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
            className="text-xs text-[var(--action-primary)] hover:underline flex items-center space-x-1 font-semibold"
          >
            <span>View Immutable Audit Trail</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-default)] text-[var(--text-secondary)]">
              <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">When</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Who</th>
              <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEEAF5]">
            {historyItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-[var(--surface-secondary)]">
                <td className="py-2.5 px-4 font-data text-[var(--text-secondary)] text-[11px] whitespace-nowrap">
                  {item.when}
                </td>
                <td className="py-2.5 px-4 text-[var(--text-primary)] font-semibold">
                  {item.who}
                </td>
                <td className="py-2.5 px-4 text-[var(--text-secondary)] font-data">
                  {item.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Build Note */}
      <div className="p-3 bg-white border border-[var(--border-default)] rounded-xl text-xs text-[var(--text-secondary)] flex items-start space-x-2 shadow-2xs">
        <Info className="w-4 h-4 text-[var(--text-tertiary)] shrink-0 mt-0.5" />
        <span className="font-data">
          <strong>Build note:</strong> Every edit creates a new audit-trail entry. Never overwrites in place. This establishes an append-only change-history model for activity data.
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          id="btn-discard-row-1042"
          type="button"
          onClick={handleDiscardRow}
          className="h-9 px-4 bg-white border border-[#C63C46]/30 text-[var(--status-error)] hover:bg-[var(--status-error)]/5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Discard Row</span>
        </button>

        <button
          id="btn-save-correction-1042"
          type="button"
          onClick={handleSaveCorrection}
          className="enterprise-btn-primary h-9 px-5 text-xs font-semibold shadow-xs flex items-center space-x-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Save Correction</span>
        </button>
      </div>
    </div>
  );
};
