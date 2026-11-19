import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Settings,
  Bell,
  Database,
  History,
  Check,
  ArrowRight,
  Building2,
  Calendar,
  Globe,
  DollarSign,
  ShieldCheck,
  FileCheck2,
  Layers,
  Save,
  Cpu,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen09_TenantSettings: React.FC = () => {
  const { currentTenant, updateTenantProfile, sites, activePeriod, navigateToScreen, showToast, addAuditLog } = useApp();
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'integrations' | 'audit'>('general');

  // General tab states
  const [displayName, setDisplayName] = useState(currentTenant.name);
  const [dateFormat, setDateFormat] = useState('DD-MMM-YYYY');
  const [unitsSystem, setUnitsSystem] = useState('Metric (SI)');
  const [reportingCurrency, setReportingCurrency] = useState(currentTenant.reportingCurrency || 'INR');
  const [consolidationApproach, setConsolidationApproach] = useState(
    currentTenant.consolidationApproach || 'Operational control'
  );
  const [isSaving, setIsSaving] = useState(false);

  // Notifications states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [verifierQueryNotification, setVerifierQueryNotification] = useState(true);
  const [periodLockNotice, setPeriodLockNotice] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateTenantProfile({
        name: displayName,
        reportingCurrency,
        consolidationApproach: consolidationApproach as any,
      });

      addAuditLog({
        userName: 'A. Kumar',
        role: 'Tenant Admin',
        action: 'Updated Tenant Operational Settings',
        previousValue: `Name: ${currentTenant.name}, Currency: ${currentTenant.reportingCurrency}`,
        newValue: `Name: ${displayName}, Currency: ${reportingCurrency}, Approach: ${consolidationApproach}`,
        source: 'Tenant Settings Console',
        reason: 'Administrative preference configuration',
        status: 'Complete',
        lineItemId: currentTenant.id,
      });

      setIsSaving(false);
      showToast('Tenant Settings Saved', 'Operational preferences and consolidation settings updated successfully.');
    }, 400);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Notification Rules Saved', 'Reviewer alert routing and verifier query subscriptions updated.');
  };

  return (
    <div id="screen-09-tenant-settings" className="w-full space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Administration' },
          { label: 'Tenant Settings' },
        ]}
        title="Tenant Settings"
        badge={<StatusBadge status="Approved" customLabel="Active Tenant" size="sm" />}
        actions={
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => navigateToScreen('05_sites', 'FLOW_A')}
              className="px-4 py-2 text-xs font-semibold text-[var(--text-primary)] bg-white border border-[var(--border-default)] hover:border-[var(--border-default)] hover:bg-[var(--surface-secondary)] rounded-full transition-all shadow-2xs inline-flex items-center space-x-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <span>Manage Sites ({sites.length})</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToScreen('06_periods', 'FLOW_A')}
              className="px-4 py-2 text-xs font-semibold text-[var(--text-primary)] bg-white border border-[var(--border-default)] hover:border-[var(--border-default)] hover:bg-[var(--surface-secondary)] rounded-full transition-all shadow-2xs inline-flex items-center space-x-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              <span>Periods Ledger</span>
            </button>
          </div>
        }
      />

      {/* Tenant Identity & Accounting Banner */}
      <div className="bg-white border border-[var(--border-default)] rounded-2xl p-5 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <div className="text-[10px] uppercase text-[var(--text-tertiary)] tracking-wider font-semibold font-sans">
            Tenant Entity
          </div>
          <div className="font-semibold text-xs text-[var(--text-primary)] font-sans truncate" title={currentTenant.legalEntityName}>
            {currentTenant.legalEntityName}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-data">
            CIN: <span className="font-mono text-[var(--text-primary)]">{currentTenant.registrationNo}</span>
          </div>
        </div>

        <div className="space-y-1 sm:border-l sm:border-[var(--border-subtle)] sm:pl-4">
          <div className="text-[10px] uppercase text-[var(--text-tertiary)] tracking-wider font-semibold font-sans">
            Consolidation Approach
          </div>
          <div className="font-semibold text-xs text-[var(--text-primary)] font-sans">
            {currentTenant.consolidationApproach || 'Operational Control'}
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-data">
            GHG Protocol Corporate Standard
          </div>
        </div>

        <div className="space-y-1 lg:border-l lg:border-[var(--border-subtle)] lg:pl-4">
          <div className="text-[10px] uppercase text-[var(--text-tertiary)] tracking-wider font-semibold font-sans">
            Reporting Period
          </div>
          <div className="font-semibold text-xs text-[var(--text-primary)] font-sans flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#12B76A]" />
            <span>{activePeriod?.name || 'FY 2025–26'}</span>
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-data">
            {activePeriod?.startDate} to {activePeriod?.endDate}
          </div>
        </div>

        <div className="space-y-1 lg:border-l lg:border-[var(--border-subtle)] lg:pl-4">
          <div className="text-[10px] uppercase text-[var(--text-tertiary)] tracking-wider font-semibold font-sans">
            Assurance Baseline
          </div>
          <div className="font-semibold text-xs text-[var(--status-success)] font-sans flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--status-success)]" />
            <span>ISO 14064-1:2018</span>
          </div>
          <div className="text-[11px] text-[var(--text-secondary)] font-data">
            Limited Assurance Standard
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border-default)] flex items-center space-x-6 text-xs font-sans overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { id: 'general', label: 'General Preferences', icon: Settings },
          { id: 'notifications', label: 'Notification Rules', icon: Bell },
          { id: 'integrations', label: 'Enterprise Integrations', icon: Database },
          { id: 'audit', label: 'Audit & Compliance Trail', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-all -mb-[1px] ${
                isActive
                  ? 'border-[var(--action-primary)] text-[var(--text-primary)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: General */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white border border-[var(--border-default)] rounded-2xl p-6 shadow-2xs space-y-6 font-sans">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Operational & Accounting Preferences</h2>
            <StatusBadge status="Approved" customLabel="Settings Verified" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Display Name */}
            <div>
              <label className="block font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-[11px] mb-1.5">
                Tenant Display Name <span className="text-[var(--status-warning)]">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-xs border border-[var(--border-default)] rounded-full focus:outline-none focus:border-[var(--action-primary)] focus:ring-2 focus:ring-[var(--border-focus)]/20 bg-white text-[var(--text-primary)] transition-all"
              />
            </div>

            {/* Legal Entity Name (Read Only) */}
            <div>
              <label className="block font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-[11px] mb-1.5">
                Legal Entity Name (Corporate Ledger)
              </label>
              <input
                type="text"
                readOnly
                value={currentTenant.legalEntityName}
                className="w-full px-4 py-2.5 text-xs border border-[var(--border-default)] rounded-full bg-[var(--surface-secondary)] text-[var(--text-primary)] font-medium cursor-not-allowed"
              />
            </div>

            {/* Date Format */}
            <div>
              <label className="block font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-[11px] mb-1.5">
                Default Date Format <span className="text-[var(--status-warning)]">*</span>
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-4 py-2.5 text-xs border border-[var(--border-default)] rounded-full bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] focus:ring-2 focus:ring-[var(--border-focus)]/20"
              >
                <option value="DD-MMM-YYYY">DD-MMM-YYYY (e.g. 15-Aug-2025)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
              </select>
            </div>

            {/* Units System */}
            <div>
              <label className="block font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-[11px] mb-1.5">
                Physical Units Standard <span className="text-[var(--status-warning)]">*</span>
              </label>
              <select
                value={unitsSystem}
                onChange={(e) => setUnitsSystem(e.target.value)}
                className="w-full px-4 py-2.5 text-xs border border-[var(--border-default)] rounded-full bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] focus:ring-2 focus:ring-[var(--border-focus)]/20"
              >
                <option value="Metric (SI)">Metric (SI: kWh, Litres, kg, tCO2e)</option>
                <option value="Imperial">Imperial (US Customary: Gallons, lbs, tons)</option>
              </select>
            </div>

            {/* Reporting Currency */}
            <div>
              <label className="block font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-[11px] mb-1.5">
                Reporting Currency <span className="text-[var(--status-warning)]">*</span>
              </label>
              <select
                value={reportingCurrency}
                onChange={(e) => setReportingCurrency(e.target.value)}
                className="w-full px-4 py-2.5 text-xs border border-[var(--border-default)] rounded-full bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] focus:ring-2 focus:ring-[var(--border-focus)]/20"
              >
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
              </select>
            </div>

            {/* Consolidation Approach */}
            <div>
              <label className="block font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-[11px] mb-1.5">
                GHG Consolidation Approach <span className="text-[var(--status-warning)]">*</span>
              </label>
              <select
                value={consolidationApproach}
                onChange={(e) => setConsolidationApproach(e.target.value)}
                className="w-full px-4 py-2.5 text-xs border border-[var(--border-default)] rounded-full bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)] focus:ring-2 focus:ring-[var(--border-focus)]/20"
              >
                <option value="Operational control">Operational Control (100% emissions from operations)</option>
                <option value="Financial control">Financial Control (Direct financial governance)</option>
                <option value="Equity share">Equity Share (Proportional ownership)</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-xl flex items-start space-x-3">
            <FileCheck2 className="w-4 h-4 text-[var(--text-primary)] shrink-0 mt-0.5" />
            <div className="text-xs text-[var(--text-secondary)] font-data">
              <strong className="text-[var(--text-primary)] font-sans">Corporate Standard Baseline:</strong> Calculations strictly adhere to the GHG Protocol Corporate Accounting Standard (revised edition). Changing consolidation approaches requires external verifier review before re-sealing past periods.
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end">
            <button
              id="btn-save-tenant-general"
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[var(--action-primary)] rounded-full hover:bg-[var(--action-primary-hover)] shadow-sm flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Changes...' : 'Save General Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="bg-white border border-[var(--border-default)] rounded-2xl p-6 shadow-2xs space-y-6 font-sans">
          <div className="pb-4 border-b border-[var(--border-subtle)]">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Notification Dispatch Rules</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)] font-sans">Reviewer Submission Alerts</div>
                <div className="text-xs text-[var(--text-secondary)] font-data mt-0.5">
                  Send immediate alert when activity data batches are submitted for reviewer sign-off.
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-[var(--text-primary)] rounded border-[var(--border-default)] focus:ring-[var(--border-focus)]"
              />
            </div>

            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)] font-sans">External Verifier Query Notifications</div>
                <div className="text-xs text-[var(--text-secondary)] font-data mt-0.5">
                  Immediate high-priority alert on line-item queries raised by external Assurance Verifier (VVB).
                </div>
              </div>
              <input
                type="checkbox"
                checked={verifierQueryNotification}
                onChange={(e) => setVerifierQueryNotification(e.target.checked)}
                className="w-4 h-4 text-[var(--text-primary)] rounded border-[var(--border-default)] focus:ring-[var(--border-focus)]"
              />
            </div>

            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)] font-sans">Period Sealing & Lock Notices</div>
                <div className="text-xs text-[var(--text-secondary)] font-data mt-0.5">
                  Broadcast compliance lock certificate to all tenant members upon period sealing.
                </div>
              </div>
              <input
                type="checkbox"
                checked={periodLockNotice}
                onChange={(e) => setPeriodLockNotice(e.target.checked)}
                className="w-4 h-4 text-[var(--text-primary)] rounded border-[var(--border-default)] focus:ring-[var(--border-focus)]"
              />
            </div>

            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)] font-sans">Weekly Carbon Progress Summary</div>
                <div className="text-xs text-[var(--text-secondary)] font-data mt-0.5">
                  Consolidated Monday digest summarizing approved batches, unreviewed bills, and emissions totals.
                </div>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 text-[var(--text-primary)] rounded border-[var(--border-default)] focus:ring-[var(--border-focus)]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex justify-end">
            <button
              id="btn-save-tenant-notifications"
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[var(--action-primary)] rounded-full hover:bg-[var(--action-primary-hover)] shadow-sm flex items-center space-x-2 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Notification Rules</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Integrations */}
      {activeTab === 'integrations' && (
        <div className="bg-white border border-[var(--border-default)] rounded-2xl p-6 shadow-2xs space-y-6 font-sans">
          <div className="pb-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Enterprise Connectors & Smart Meters</h2>
            <span className="text-[11px] font-semibold text-[var(--text-tertiary)] bg-[var(--bg-subtle)] px-2.5 py-1 rounded-full">
              Phase 3 Roadmap
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-3">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-50)] text-[var(--action-primary)] flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">SAP S/4HANA & ECC</div>
                <div className="text-[11px] text-[var(--text-secondary)] font-data mt-0.5">
                  Direct ledger synchronization for fuel procurement and material entries.
                </div>
              </div>
              <span className="inline-block text-[10px] font-semibold text-[var(--text-secondary)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full">
                Scheduled for Phase 3
              </span>
            </div>

            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-3">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-50)] text-[var(--action-primary)] flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">Oracle ERP Cloud</div>
                <div className="text-[11px] text-[var(--text-secondary)] font-data mt-0.5">
                  Automated utility invoice extraction and operational expense mapping.
                </div>
              </div>
              <span className="inline-block text-[10px] font-semibold text-[var(--text-secondary)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full">
                Scheduled for Phase 3
              </span>
            </div>

            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-3">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-50)] text-[var(--action-primary)] flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">IoT Energy Meters & SCADA</div>
                <div className="text-[11px] text-[var(--text-secondary)] font-data mt-0.5">
                  Real-time sub-meter telemetry for high-voltage industrial feeders.
                </div>
              </div>
              <span className="inline-block text-[10px] font-semibold text-[var(--text-secondary)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full">
                Scheduled for Phase 3
              </span>
            </div>
          </div>

          <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl flex items-center justify-between text-xs">
            <div className="text-[var(--text-secondary)] font-data">
              <strong className="text-[var(--text-primary)] font-sans">Active Phase 1 Scope:</strong> Unified Activity Data Ingestion (Manual, Bulk Spreadsheets, and Camera Smart Scan) is fully operational.
            </div>
            <button
              type="button"
              onClick={() => navigateToScreen('11_entry_form', 'FLOW_B')}
              className="px-4 py-1.5 text-xs font-semibold text-[var(--action-primary)] bg-[var(--brand-50)] hover:bg-[var(--status-info-bg)] rounded-full transition-all shrink-0 ml-4"
            >
              Go to Activity Ingestion →
            </button>
          </div>
        </div>
      )}

      {/* Tab: Audit & Compliance */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-[var(--border-default)] rounded-2xl p-6 shadow-2xs space-y-6 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-4">
            <h2 className="text-sm font-bold text-[var(--text-primary)]">Audit & Compliance Assurance Trail</h2>
            <button
              type="button"
              onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
              className="px-5 py-2 text-xs font-semibold text-white bg-[var(--action-primary)] rounded-full hover:bg-[var(--action-primary-hover)] shadow-sm inline-flex items-center space-x-1.5 shrink-0 transition-all"
            >
              <span>Open Audit Trail Viewer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-data">
            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-2">
              <div className="font-bold text-[var(--text-primary)] flex items-center space-x-2 font-sans">
                <ShieldCheck className="w-4 h-4 text-[var(--status-success)]" />
                <span>ISO 14064-3 Third-Party Assurance</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed text-[11px]">
                Records cannot be deleted or overwritten retroactively. When corrections occur, a new journal line item is produced containing author, timestamp, reason, and cryptographic hash verification.
              </p>
            </div>

            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-2">
              <div className="font-bold text-[var(--text-primary)] flex items-center space-x-2 font-sans">
                <FileCheck2 className="w-4 h-4 text-[var(--text-primary)]" />
                <span>Cryptographic Proof Integrity</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed text-[11px]">
                Line-item records are hashed using SHA-256 and chained into period calculation snapshots, ensuring complete tamper detection during external verifier inspection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
