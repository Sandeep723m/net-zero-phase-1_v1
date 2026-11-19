import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  FileText,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Check,
  ExternalLink,
  Info,
  Edit3,
  XCircle,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen18_OCRReview: React.FC = () => {
  const {
    navigateToScreen,
    showToast,
    addAuditLog,
    setOcrPrefillData,
  } = useApp();

  const [billingPeriod, setBillingPeriod] = useState('01 Jul – 31 Jul 2025');
  const [unitsConsumed, setUnitsConsumed] = useState('48200');
  const [meterNumber, setMeterNumber] = useState('TN-MET-88291');
  const [isEditing, setIsEditing] = useState(false);

  // Field confidence scores
  const unitsConfidence = 92;
  const meterConfidence = 78; // Low/moderate confidence - highlighted
  const periodConfidence = 95;

  const handleConfirmAndSave = () => {
    addAuditLog({
      userName: 'A. Kumar',
      role: 'Reviewer',
      action: 'Confirmed AI OCR Extraction #8821',
      previousValue: 'Raw PDF Invoice: TANGEDCO_HT_Bill_Jul_2025.pdf',
      newValue: `Confirmed: 48,200 kWh (Confidence: 92%), Meter: TN-MET-88291 (Confidence: 78%), Period: ${billingPeriod}`,
      source: 'Azure AI Document Intelligence (Prebuilt Model)',
      reason: 'Human verification completed before ingestion into GHG boundary',
      status: 'Human Confirmed',
      lineItemId: 'OCR-8821',
    });

    setOcrPrefillData({
      siteId: 'site-chennai-1',
      sourceId: 'src-elec-1',
      date: '2025-08-12',
      quantity: parseFloat(unitsConsumed) || 48200,
      unit: 'kWh',
      entryMethod: 'AI Extracted',
      notes: `Extracted via Azure Document Intelligence OCR #8821. Billing: ${billingPeriod}. Meter: ${meterNumber}. Human-confirmed.`,
      evidenceFile: {
        name: 'TANGEDCO_HT_Bill_Jul_2025.pdf',
        size: '2.1 MB',
        uploadDate: '12-Aug-2025',
      },
    });

    showToast(
      'OCR Confirmed',
      'Data passed to Activity Data Entry Form with attached evidence bill.'
    );

    navigateToScreen('11_entry_form', 'FLOW_B');
  };

  const handleRejectAndDiscard = () => {
    addAuditLog({
      userName: 'A. Kumar',
      role: 'Reviewer',
      action: 'Rejected OCR Extraction #8821',
      previousValue: 'Extracted 48,200 kWh from TANGEDCO_HT_Bill_Jul_2025.pdf',
      newValue: 'Status: Discarded by Human Reviewer',
      source: 'Azure AI Document Intelligence',
      reason: 'Unsatisfactory confidence or incorrect bill upload',
      status: 'Discarded',
      lineItemId: 'OCR-8821',
    });

    showToast('OCR Extraction Discarded', 'No data was committed to the calculation engine.');
    navigateToScreen('11_entry_form', 'FLOW_B');
  };

  return (
    <div id="screen-18-container" className="w-full space-y-6 font-sans">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Activity Data' },
          { label: 'AI OCR Review' },
        ]}
        title="Confirm Extracted Data"
        actions={
          <div className="flex items-center space-x-2">
            <StatusBadge status="In Review" customLabel="AI-suggested" size="md" />
            <button
              onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')}
              className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Ingestion Hub</span>
            </button>
          </div>
        }
      />

      {/* Critical Policy Banner */}
      <div className="p-3 bg-[var(--action-primary)]/5 border border-[var(--action-primary)]/20 rounded-xl text-xs text-[var(--action-primary)] flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2 font-data">
          <Info className="w-4 h-4 shrink-0" />
          <span>
            <strong>Critical Policy:</strong> Nothing from AI reaches the calculation engine without explicit human confirmation.
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
          className="text-xs text-[var(--action-primary)] hover:underline flex items-center space-x-1 shrink-0 font-semibold"
        >
          <span>Immutable Audit Trail</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* 2-Column Split: Left Bill Preview | Right Extracted Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Uploaded Bill Preview (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[var(--border-default)] rounded-xl p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[var(--text-primary)]" />
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Uploaded bill preview</h2>
            </div>
            <span className="text-[11px] font-data font-medium text-[var(--text-secondary)]">
              TANGEDCO_HT_Bill_Jul_2025.pdf
            </span>
          </div>

          {/* Document Display Simulation */}
          <div className="border border-[var(--border-default)] bg-[var(--surface-secondary)] rounded-xl p-4 font-data text-xs space-y-3 relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-[var(--border-default)] pb-2">
              <div>
                <div className="font-bold text-[var(--text-primary)]">TAMIL NADU GENERATION AND DISTRIBUTION CORP (TANGEDCO)</div>
                <div className="text-[10px] text-[var(--text-secondary)]">High Tension (HT) Electricity Bill & Receipt</div>
              </div>
              <span className="text-[10px] bg-[var(--status-success)]/10 text-[var(--status-success)] border border-[#147A5A]/20 px-1.5 py-0.5 rounded font-bold">PAID</span>
            </div>

            {/* Consumer & Meter Box with Highlight */}
            <div className="p-2.5 rounded-lg bg-white border border-[#9A4F00] ring-2 ring-[#9A4F00]/20 relative">
              <span className="absolute top-1 right-2 text-[9px] font-sans font-semibold text-[var(--status-warning)] bg-[var(--status-warning-bg)] px-1.5 py-0.5 rounded">
                78% Conf
              </span>
              <div className="text-[10px] text-[var(--text-secondary)]">Consumer No: <span className="font-bold text-[var(--text-primary)]">04-921-084-220</span></div>
              <div className="text-[10px] text-[var(--text-secondary)]">Meter / Account No: <span className="font-bold text-[var(--text-primary)]">{meterNumber}</span></div>
              <div className="text-[10px] text-[var(--text-secondary)]">Site: Chennai Plant 1 (Substation A)</div>
            </div>

            {/* Billing Period Box */}
            <div className="p-2.5 rounded-lg bg-white border border-[var(--action-primary)] ring-2 ring-[#5625B8]/20 relative">
              <span className="absolute top-1 right-2 text-[9px] font-sans font-semibold text-[var(--text-primary)] bg-[var(--action-primary)]/10 px-1.5 py-0.5 rounded">
                95% Conf
              </span>
              <div className="text-[10px] text-[var(--text-secondary)]">Billing Cycle: <span className="font-bold text-[var(--text-primary)]">{billingPeriod}</span></div>
              <div className="text-[10px] text-[var(--text-secondary)]">Bill Date: 02-Aug-2025</div>
            </div>

            {/* Units Consumed Box with High Visibility Highlight */}
            <div className="p-3 rounded-lg bg-[var(--action-primary)]/5 border-2 border-[var(--action-primary)] relative">
              <span className="absolute top-1.5 right-2 text-[9px] font-sans font-semibold text-[var(--text-primary)] bg-white px-1.5 py-0.5 rounded border border-[var(--action-primary)]/20">
                92% Conf
              </span>
              <div className="text-[10px] uppercase font-bold text-[var(--text-primary)]">Active Energy Consumed (Units)</div>
              <div className="text-xl font-bold text-[var(--text-primary)] mt-1 font-data">
                {parseFloat(unitsConsumed).toLocaleString()} <span className="text-xs font-normal">kWh</span>
              </div>
              <div className="text-[10px] text-[var(--text-secondary)] mt-1">Previous: 412,800 | Current: 461,000 | Net: 48,200 kWh</div>
            </div>

            <div className="text-[10px] text-[var(--text-tertiary)] text-center pt-2 font-sans">
              Azure AI Document Intelligence bounding box overlay active
            </div>
          </div>
        </div>

        {/* Right: Extracted Values Table & Review Form (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-[var(--border-default)] rounded-xl p-5 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Extracted Values</h2>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-[var(--action-primary)] hover:underline flex items-center space-x-1 font-semibold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Done Editing' : 'Edit Manually'}</span>
            </button>
          </div>

          {/* Extracted Values Table */}
          <div className="border border-[var(--border-default)] rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-default)] text-[var(--text-secondary)]">
                  <th scope="col" className="py-2.5 px-3 font-semibold text-[var(--text-primary)]">Field</th>
                  <th scope="col" className="py-2.5 px-3 font-semibold text-[var(--text-primary)]">Extracted value</th>
                  <th scope="col" className="py-2.5 px-3 font-semibold text-[var(--text-primary)]">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEAF5]">
                {/* Row 1: Billing Period */}
                <tr className="hover:bg-[var(--surface-secondary)]">
                  <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">Billing period</td>
                  <td className="py-3 px-3 font-data">
                    {isEditing ? (
                      <input
                        type="text"
                        value={billingPeriod}
                        onChange={(e) => setBillingPeriod(e.target.value)}
                        className="px-2 py-1 text-xs border border-[var(--border-default)] rounded-md w-full font-data focus:border-[var(--action-primary)]"
                      />
                    ) : (
                      <span className="text-[var(--text-primary)] font-semibold">{billingPeriod}</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status="Approved" customLabel={`${periodConfidence}% High`} size="sm" />
                  </td>
                </tr>

                {/* Row 2: Units consumed (kWh) */}
                <tr className="bg-[var(--action-primary)]/5 hover:bg-[var(--action-primary)]/10">
                  <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">Units consumed (kWh)</td>
                  <td className="py-3 px-3 font-data">
                    {isEditing ? (
                      <input
                        type="number"
                        value={unitsConsumed}
                        onChange={(e) => setUnitsConsumed(e.target.value)}
                        className="px-2 py-1 text-xs border border-[var(--action-primary)] rounded-md w-full font-data font-bold focus:outline-none"
                      />
                    ) : (
                      <span className="text-base font-bold text-[var(--text-primary)]">
                        {parseFloat(unitsConsumed).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status="Approved" customLabel={`${unitsConfidence}% High`} size="sm" />
                  </td>
                </tr>

                {/* Row 3: Account / meter number (Low confidence - highlighted) */}
                <tr className="bg-[var(--status-warning)]/5 hover:bg-[var(--status-warning)]/10">
                  <td className="py-3 px-3 font-semibold text-[var(--status-warning)]">Account / meter number</td>
                  <td className="py-3 px-3 font-data">
                    {isEditing ? (
                      <input
                        type="text"
                        value={meterNumber}
                        onChange={(e) => setMeterNumber(e.target.value)}
                        className="px-2 py-1 text-xs border border-[#9A4F00] rounded-md w-full font-data font-bold focus:outline-none"
                      />
                    ) : (
                      <span className="text-[var(--text-primary)] font-bold">{meterNumber}</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[#9A4F00]/30 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center space-x-1 w-max">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{meterConfidence}% Moderate</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Explicit Confidence Explanation Notice */}
          <div className="p-3 bg-[var(--status-warning-bg)]/40 border border-[#9A4F00]/30 rounded-xl text-xs text-[var(--status-warning)] flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-[var(--status-warning)] shrink-0 mt-0.5" />
            <div className="font-data">
              <strong>Confidence: 92% on units consumed, 78% on meter number</strong> — low-confidence fields are highlighted for extra attention.
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
            <button
              id="btn-reject-discard-ocr"
              type="button"
              onClick={handleRejectAndDiscard}
              className="h-9 px-3.5 bg-white border border-[#C63C46]/30 text-[var(--status-error)] hover:bg-[var(--status-error)]/5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject & Discard</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="enterprise-btn-secondary h-9 px-3.5 text-xs font-semibold"
              >
                {isEditing ? 'Done Editing' : 'Edit Manually'}
              </button>

              <button
                id="btn-confirm-save-ocr"
                type="button"
                onClick={handleConfirmAndSave}
                className="enterprise-btn-primary h-9 px-5 text-xs font-semibold shadow-xs flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm & Save</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
