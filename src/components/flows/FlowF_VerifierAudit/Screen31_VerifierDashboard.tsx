import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  FileText,
  ArrowRight,
  Lock,
  CheckCircle2,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen31_VerifierDashboard: React.FC = () => {
  const { navigateToScreen, setActiveTraceContext, verifierQueries, currentUser, currentRole, showToast } = useApp();

  // Scoped assigned review per PRD specifications
  const assignedReviews = [
    {
      id: 'rev-01',
      client: 'Zenith Energy Services',
      clientLegal: 'Zenith Energy Services Private Limited',
      report: 'GHG Inventory',
      standard: 'ISO 14064-1:2018 / GHG Protocol Corporate Standard',
      period: 'FY 2025-26',
      periodDates: '01-Apr-2025 – 31-Mar-2026',
      status: 'Ready for review',
      sitesScoped: ['Chennai Plant 1', 'Pune Warehouse'],
      scopesAssigned: ['Scope 1 (Stationary & Mobile)', 'Scope 2 (Grid Electricity)'],
      totalEmissionsRef: '28,270 tCO2e',
      targetPath: '/trace/scope2/grid-electricity',
    },
  ];

  const handleOpenTrace = (review: typeof assignedReviews[0]) => {
    setActiveTraceContext({
      client: review.client,
      report: review.report,
      period: review.period,
      scope: 'Scope 2',
      category: 'Grid electricity',
      site: 'Chennai Plant 1',
      activityRow: 'Activity Data Row #1042',
      date: '12-Aug-2025',
      quantity: '48,200 kWh',
      evidenceRef: 'electricity-bill-aug25.pdf',
      verifier: currentRole === 'VERIFIER' ? currentUser.name : 'M. Singh',
    });
    navigateToScreen('32_evidence_trace', 'FLOW_F');
  };

  const openQueriesCount = verifierQueries.filter((q) => q.status === 'Open').length;

  return (
    <div id="screen-31-verifier-dashboard" className="w-full space-y-6">
      {/* Verifier Surface Banner / Top Header */}
      <div className="bg-[var(--surface-secondary)] text-[var(--text-primary)] rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-[var(--border-default)]">
        <div className="flex items-center space-x-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[var(--border-default)] flex items-center justify-center text-[var(--text-primary)] shrink-0 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[var(--text-primary)]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Verifier Portal
              </span>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span className="text-xs text-[var(--status-success)] font-semibold">
                Read-Only Session
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1 font-sans tracking-tight truncate">
              Assurance & Verification Docket
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs pt-4 lg:pt-0 border-t lg:border-t-0 border-[var(--border-default)] shrink-0">
          <div className="bg-white h-9 px-3.5 rounded-lg border border-[var(--border-default)] flex items-center space-x-2 shadow-2xs">
            <span className="text-[var(--text-tertiary)]">Client:</span>
            <span className="font-semibold text-[var(--text-primary)] flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-[var(--text-primary)]" />
              <span>Zenith Energy</span>
            </span>
          </div>

          <div className="bg-white h-9 px-3.5 rounded-lg border border-[var(--border-default)] flex items-center space-x-2 shadow-2xs">
            <span className="text-[var(--text-tertiary)]">Verifier:</span>
            <span className="font-semibold text-[var(--text-primary)] flex items-center space-x-1.5">
              <span>{currentRole === 'VERIFIER' ? currentUser.name : 'Dr. V. Raman (SGS)'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Internal Verifier Subnav */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-2 text-xs overflow-x-auto whitespace-nowrap scrollbar-none font-sans">
        <div className="flex items-center space-x-6">
          <button
            className="font-bold text-[var(--text-primary)] border-b-2 border-[var(--action-primary)] pb-2 flex items-center space-x-1.5 -mb-[9px]"
          >
            <span>Assigned Reviews</span>
          </button>
          <button
            onClick={() => navigateToScreen('32_evidence_trace', 'FLOW_F')}
            className="text-[var(--text-secondary)] hover:text-[var(--action-primary)] pb-2 transition-colors flex items-center space-x-1.5 font-medium"
          >
            <span>Evidence Trace</span>
          </button>
          <button
            onClick={() => navigateToScreen('33_raise_query', 'FLOW_F')}
            className="text-[var(--text-secondary)] hover:text-[var(--action-primary)] pb-2 transition-colors flex items-center space-x-1.5 font-medium"
          >
            <span>Queries</span>
            {openQueriesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[var(--status-warning-bg)] text-[var(--status-warning)] text-[10px] font-bold rounded-md border border-[var(--status-warning)]">
                {openQueriesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
            className="text-[var(--text-secondary)] hover:text-[var(--action-primary)] pb-2 transition-colors font-medium"
          >
            <span>Audit Trail</span>
          </button>
        </div>

        <div className="text-[11px] text-[var(--text-tertiary)] hidden sm:block font-medium">
          ISO 14064-3 Docket
        </div>
      </div>

      {/* Page Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Verifier Portal' },
          { label: 'Assigned Reviews' },
        ]}
        title="Assigned GHG Inventories"
      />

      {/* Main Review Section */}
      {assignedReviews.length === 0 ? (
        <div id="verifier-empty-state" className="bg-white border border-[var(--border-default)] rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-canvas)] text-[var(--text-tertiary)] flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">No reviews assigned</h3>
          </div>
          <div className="pt-2">
            <button
              onClick={() => showToast('Scopes Synchronized', 'Assigned review scopes refreshed.')}
              className="text-xs text-[var(--action-primary)] hover:underline font-semibold"
            >
              Reload assigned scopes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet Table */}
          <div className="hidden sm:block bg-white border border-[var(--border-default)] rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-default)] text-[var(--text-secondary)]">
                  <th scope="col" className="py-3.5 px-4 font-semibold text-[11px] uppercase tracking-wider">Client</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold text-[11px] uppercase tracking-wider">Report</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold text-[11px] uppercase tracking-wider">Period</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold text-[11px] uppercase tracking-wider">Status</th>
                  <th scope="col" className="py-3.5 px-4 text-right font-semibold text-[11px] uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEAF5]">
                {assignedReviews.map((rev) => (
                  <tr
                    key={rev.id}
                    onClick={() => handleOpenTrace(rev)}
                    className="hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4">
                      <div className="font-bold text-[var(--text-primary)] group-hover:text-[var(--action-primary)] transition-colors">
                        {rev.client}
                      </div>
                      <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
                        {rev.sitesScoped.join(', ')}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[var(--text-primary)] flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        <span>{rev.report}</span>
                      </div>
                      <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
                        {rev.standard}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[var(--text-primary)]">
                      <div className="font-semibold">{rev.period}</div>
                      <div className="text-[11px] text-[var(--text-tertiary)]">{rev.periodDates}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[11px] font-semibold text-[var(--text-primary)] bg-[var(--action-primary)]/10 px-2.5 py-1 rounded-md">
                        {rev.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTrace(rev);
                        }}
                        className="h-9 px-4 text-xs font-semibold text-white bg-[var(--action-primary)] rounded-lg hover:bg-[var(--action-primary-hover)] shadow-2xs inline-flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                      >
                        <span>Open Evidence Trace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Review Cards */}
          <div className="sm:hidden space-y-3">
            {assignedReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[var(--border-default)] rounded-2xl p-4 space-y-3 shadow-xs"
              >
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)]">{rev.client}</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">{rev.report}</div>
                  <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{rev.period}</div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[var(--text-primary)] bg-[var(--action-primary)]/10 px-2.5 py-1 rounded-md">
                    {rev.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => handleOpenTrace(rev)}
                    className="w-full h-9 px-4 text-xs font-semibold text-white bg-[var(--action-primary)] rounded-lg hover:bg-[var(--action-primary-hover)] shadow-2xs flex items-center justify-between transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                  >
                    <span>View Evidence Trace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assurance Scope & Protocol Summary */}
      <div className="bg-white border border-[var(--border-default)] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[var(--text-primary)]" />
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Assurance Protocol & Boundary
            </h3>
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-medium">Applied assurance profile</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-1.5">
            <div className="font-semibold text-[var(--text-primary)]">Assigned Boundary</div>
            <div className="text-[var(--text-secondary)]">
              Scope 1 & 2 emissions for Chennai Plant 1 and Pune Warehouse (FY 2025–26).
            </div>
          </div>

          <div className="p-3.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-1.5">
            <div className="font-semibold text-[var(--text-primary)]">Inspection Actions</div>
            <div className="text-[var(--text-secondary)]">
              Audit calculation formula lineage, inspect utility bills, and raise line-item clarification queries.
            </div>
          </div>

          <div className="p-3.5 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl space-y-1.5">
            <div className="font-semibold text-[var(--text-primary)]">Immutability Protection</div>
            <div className="text-[var(--text-secondary)]">
              Read-only role enforcement. Data cannot be edited, deleted, or re-aggregated by external verifiers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
