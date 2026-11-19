import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Tenant } from '../../../types';
import { Building2, Search, ArrowRight, Check, Plus } from 'lucide-react';

export const Screen03_TenantSelector: React.FC = () => {
  const { tenants, currentTenant, setCurrentTenant, navigateToScreen, showToast } = useApp();
  const [search, setSearch] = useState('');

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.legalEntityName.toLowerCase().includes(search.toLowerCase()) ||
      t.industrySector.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    showToast('Tenant Switched', `Active organization set to ${tenant.name}`);
    navigateToScreen('04_org_profile', 'FLOW_A');
  };

  return (
    <div id="screen-03-tenant-selector" className="max-w-2xl mx-auto my-10 p-6 sm:p-8 bg-white border border-[var(--border-default)] rounded-2xl shadow-sm font-sans">
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--action-primary)]/10 text-[var(--action-primary)] flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Tenant Directory</span>
        </div>
        <span className="text-xs text-[var(--text-secondary)] font-medium">
          {tenants.length} available accounts
        </span>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Select Organization</h1>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company name, sector or CIN…"
          className="w-full pl-10 pr-3 py-2.5 text-xs border border-[var(--border-default)] rounded-xl focus:outline-none focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--border-focus)] bg-white text-[var(--text-primary)]"
        />
      </div>

      {/* Tenants List */}
      <div className="space-y-3">
        {filteredTenants.map((tenant) => {
          const isSelected = tenant.id === currentTenant.id;
          return (
            <div
              key={tenant.id}
              onClick={() => handleSelect(tenant)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                isSelected
                  ? 'border-[var(--action-primary)] bg-[var(--action-primary)]/5 shadow-xs ring-1 ring-[#5625B8]'
                  : 'border-[var(--border-default)] bg-white hover:border-[var(--action-primary)] hover:bg-[var(--surface-secondary)]'
              }`}
            >
              <div className="space-y-1.5 min-w-0 pr-4">
                <div className="flex items-center space-x-2.5 flex-wrap">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--action-primary)] transition-colors truncate">
                    {tenant.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-[var(--text-primary)] bg-white px-2 py-0.5 rounded border border-[var(--border-default)]">
                    {tenant.userRole.replace('_', ' ')}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-[var(--status-success)] uppercase tracking-wide">
                      Active
                    </span>
                  )}
                </div>

                <div className="text-xs text-[var(--text-secondary)] font-medium truncate">
                  {tenant.legalEntityName}
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-[var(--text-tertiary)] pt-0.5 font-medium flex-wrap">
                  <span>CIN: {tenant.registrationNo}</span>
                  <span>·</span>
                  <span>{tenant.industrySector}</span>
                  <span>·</span>
                  <span>Approach: {tenant.consolidationApproach}</span>
                </div>
              </div>

              <div className="shrink-0">
                {isSelected ? (
                  <div className="w-8 h-8 rounded-xl bg-[var(--action-primary)] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl border border-[var(--border-default)] group-hover:border-[var(--action-primary)] group-hover:bg-[var(--action-primary)] text-[var(--text-tertiary)] group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredTenants.length === 0 && (
          <div className="text-center py-8 border border-dashed border-[var(--border-default)] rounded-xl text-xs text-[var(--text-tertiary)]">
            No organisations found matching "{search}".
          </div>
        )}
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)]">Need access to another subsidiary?</span>
        <button
          onClick={() => {
            showToast('Permission Request', 'Access request routed to Enterprise Super Admin.');
            navigateToScreen('04_org_profile', 'FLOW_A');
          }}
          className="text-[var(--action-primary)] hover:underline font-semibold flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Request Organization Access</span>
        </button>
      </div>
    </div>
  );
};
