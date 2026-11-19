import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { EmissionSource } from '../../../types';
import {
  Zap,
  Plus,
  ArrowRight,
  X,
  Building,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen07_EmissionSources: React.FC = () => {
  const { emissionSources, sites, addEmissionSource, navigateToScreen, showToast, currentRole, currentUser } = useApp();
  const canConfigureSources = currentRole === 'TENANT_ADMIN';

  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || 'site-chennai-1');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add Source Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [category, setCategory] = useState<EmissionSource['category']>('Scope 1');
  const [method, setMethod] = useState('Fuel combustion');
  const [unit, setUnit] = useState('Litres');
  const [emissionFactor, setEmissionFactor] = useState(2.68);
  const [factorUnit, setFactorUnit] = useState('kg CO2e / Litre');
  const [factorSource, setFactorSource] = useState('DEFRA / IPCC Stationary Combustion Guidelines');
  const [status, setStatus] = useState<EmissionSource['status']>('Active');

  const selectedSite = sites.find((s) => s.id === selectedSiteId) || sites[0];

  const siteSources = emissionSources.filter((s) => s.siteId === selectedSiteId);
  const filteredSources = siteSources.filter(
    (s) => categoryFilter === 'all' || s.category === categoryFilter
  );

  // Synchronize unit & factor when method changes
  const handleCategoryMethodChange = (newCategory: EmissionSource['category'], newMethod: string) => {
    setCategory(newCategory);
    setMethod(newMethod);

    if (newCategory === 'Scope 2') {
      setMethod('Location-based');
      setUnit('kWh');
      setEmissionFactor(0.82);
      setFactorUnit('kg CO2e / kWh');
      setFactorSource('CEA CO2 Baseline Database v19 (India)');
    } else if (newMethod === 'GWP-based') {
      setUnit('kg');
      setEmissionFactor(2088.0);
      setFactorUnit('kg CO2e / kg');
      setFactorSource('IPCC Fifth Assessment Report (AR5) GWP-100');
    } else {
      setMethod('Fuel combustion');
      setUnit('Litres');
      setEmissionFactor(2.68);
      setFactorUnit('kg CO2e / Litre');
      setFactorSource('DEFRA / IPCC Stationary Combustion');
    }
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName) return;

    addEmissionSource({
      siteId: selectedSite.id,
      siteName: selectedSite.name,
      name: sourceName,
      category,
      method,
      unit,
      status,
      emissionFactor,
      factorUnit,
      factorSource,
    });

    setIsDrawerOpen(false);
    setSourceName('');
  };

  return (
    <div id="screen-07-emission-sources" className="w-full space-y-6">
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: 'Configuration' },
          { label: 'Emission Sources' },
        ]}
        title="Emission Sources"
        actions={
          canConfigureSources ? (
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[var(--action-primary)] rounded-full hover:bg-[var(--action-primary-hover)] shadow-sm inline-flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Emission Source</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-xs text-[var(--text-secondary)] font-data bg-[var(--surface-secondary)] px-3 py-1.5 rounded-lg border border-[var(--border-default)]">
              <Lock className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              <span>Factor mapping governed by Tenant Admin</span>
            </div>
          )
        }
      />

      {/* Site Selector Bar & Filter */}
      <div className="p-3.5 bg-white border border-[var(--border-default)] rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 font-sans">
        <div className="flex items-center space-x-3">
          <label className="text-xs font-semibold text-[var(--text-primary)] shrink-0 flex items-center space-x-1.5">
            <Building className="w-3.5 h-3.5 text-[var(--text-primary)]" />
            <span>Target Site:</span>
          </label>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="px-3.5 py-1.5 text-xs border border-[var(--border-default)] rounded-full bg-[var(--surface-secondary)] text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--action-primary)]"
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name} ({site.type} — {site.location})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-[var(--border-default)] rounded-full bg-white text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
          >
            <option value="all">All Scopes</option>
            <option value="Scope 1">Scope 1 (Direct)</option>
            <option value="Scope 2">Scope 2 (Indirect Electricity)</option>
            <option value="Scope 3">Scope 3 (Value Chain)</option>
          </select>

          <span className="text-xs text-[var(--text-secondary)] font-data">
            {filteredSources.length} configured sources
          </span>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white border border-[var(--border-default)] rounded-2xl overflow-hidden shadow-2xs font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--surface-secondary)] border-b border-[var(--border-default)] text-[var(--text-secondary)]">
                <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Source Name</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">GHG Scope</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Calculation Method</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Standard Unit</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Default Emission Factor</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)]">Status</th>
                <th scope="col" className="py-2.5 px-4 font-semibold text-[var(--text-primary)] text-right">Lifecycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2DF]">
              {filteredSources.map((source) => (
                <tr key={source.id} className="hover:bg-[var(--surface-secondary)] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[var(--text-primary)]">{source.name}</div>
                    <div className="text-[11px] text-[var(--text-tertiary)] font-data">{source.factorSource}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        source.category === 'Scope 1'
                          ? 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning)]'
                          : source.category === 'Scope 2'
                          ? 'bg-[var(--brand-50)] text-[var(--action-primary)] border-[var(--brand-100)]'
                          : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border-default)]'
                      }`}
                    >
                      {source.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)] font-data">{source.method}</td>
                  <td className="py-3 px-4 font-data text-[var(--text-primary)] font-semibold">{source.unit}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    <span className="emission-factor font-medium text-[var(--text-primary)]">{source.emissionFactor}</span>{' '}
                    <span className="text-[11px] text-[var(--text-tertiary)] font-data">{source.factorUnit}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge
                      status={source.status === 'Active' ? 'Approved' : 'Under Review'}
                      customLabel={source.status}
                      size="sm"
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[11px] text-[var(--text-tertiary)] font-data">Active in Data Entry</span>
                  </td>
                </tr>
              ))}

              {filteredSources.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[var(--text-tertiary)] font-data">
                    No emission sources configured for {selectedSite.name} under current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progression to Step 6 */}
      <div className="p-4 bg-white border border-[var(--border-default)] rounded-2xl flex items-center justify-between text-xs shadow-2xs font-sans">
        <div className="text-[var(--text-secondary)] font-data">
          Sources configured. Proceed to invite users and assign operational roles.
        </div>
        <button
          onClick={() => navigateToScreen('08_users_roles', 'FLOW_A')}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[var(--action-primary)] rounded-full hover:bg-[var(--action-primary-hover)] shadow-sm flex items-center space-x-1.5 transition-all"
        >
          <span>Continue to Users & Roles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Add Source Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[var(--border-default)] font-sans animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-[var(--border-default)] flex items-center justify-between bg-[var(--surface-secondary)]">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-[var(--text-primary)]" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Add Emission Source</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSource} className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Target Facility</label>
                <div className="p-2.5 bg-[var(--surface-secondary)] rounded-lg border border-[var(--border-default)] text-xs font-medium text-[var(--text-primary)] font-data">
                  {selectedSite.name} ({selectedSite.location})
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">
                  Source Name <span className="text-[var(--status-warning)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. Natural gas boiler, Rooftop solar, Forklift fleet"
                  className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg focus:outline-none focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--border-focus)]/20 bg-white text-[var(--text-primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">GHG Scope</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryMethodChange(e.target.value as any, method)}
                    className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg focus:outline-none focus:border-[var(--action-primary)] bg-white text-[var(--text-primary)]"
                  >
                    <option value="Scope 1">Scope 1 (Direct combustion / fugitive)</option>
                    <option value="Scope 2">Scope 2 (Indirect electricity)</option>
                    <option value="Scope 3">Scope 3 (Value chain)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Calculation Method</label>
                  <select
                    value={method}
                    onChange={(e) => handleCategoryMethodChange(category, e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg focus:outline-none focus:border-[var(--action-primary)] bg-white text-[var(--text-primary)]"
                  >
                    {category === 'Scope 2' ? (
                      <>
                        <option value="Location-based">Location-based</option>
                        <option value="Market-based">Market-based</option>
                      </>
                    ) : (
                      <>
                        <option value="Fuel combustion">Fuel combustion</option>
                        <option value="GWP-based">GWP-based (Refrigerants)</option>
                        <option value="Mass balance">Mass balance</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Required Activity Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg focus:outline-none focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--border-focus)]/20 bg-white text-[var(--text-primary)] font-data"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Emission Factor Value</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={emissionFactor}
                    onChange={(e) => setEmissionFactor(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg focus:outline-none focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--border-focus)]/20 bg-white text-[var(--text-primary)] emission-factor font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Factor Database Source</label>
                <input
                  type="text"
                  value={factorSource}
                  onChange={(e) => setFactorSource(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg focus:outline-none focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--border-focus)]/20 bg-white text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[var(--border-default)] rounded-lg focus:outline-none focus:border-[var(--action-primary)] bg-white text-[var(--text-primary)]"
                >
                  <option value="Active">Active (Available for logging entries)</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[var(--text-primary)] bg-white border border-[var(--border-default)] rounded-full hover:bg-[var(--surface-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[var(--action-primary)] rounded-full hover:bg-[var(--action-primary-hover)] shadow-sm"
                >
                  Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
