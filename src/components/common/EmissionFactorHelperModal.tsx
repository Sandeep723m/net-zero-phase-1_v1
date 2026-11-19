import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  EmissionFactor,
  AUTHORITATIVE_EMISSION_FACTORS,
} from '../../data/emissionFactorsData';
import {
  Search,
  X,
  BookOpen,
  Calculator,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Filter,
  Info,
  Layers,
  Scale,
  Building2,
  Globe,
  Flame,
  Zap,
} from 'lucide-react';

export const EmissionFactorHelperModal: React.FC = () => {
  const {
    isFactorHelperOpen,
    closeFactorHelper,
    activeFactorHelperSearch,
    setActiveFactorHelperSearch,
    applyFactorToEntry,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState(activeFactorHelperSearch || '');
  const [selectedBody, setSelectedBody] = useState<string>('All');
  const [selectedScope, setSelectedScope] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  // Currently inspected factor for detail drawer & calculation accuracy estimator
  const [selectedFactor, setSelectedFactor] = useState<EmissionFactor>(
    AUTHORITATIVE_EMISSION_FACTORS[0]
  );
  const [sampleQuantity, setSampleQuantity] = useState<string>('10000');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sync incoming search query when opened
  useEffect(() => {
    if (activeFactorHelperSearch) {
      setSearchQuery(activeFactorHelperSearch);
    }
  }, [activeFactorHelperSearch, isFactorHelperOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFactorHelperOpen) {
        closeFactorHelper();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFactorHelperOpen, closeFactorHelper]);

  // Filtered factors
  const filteredFactors = useMemo(() => {
    return AUTHORITATIVE_EMISSION_FACTORS.filter((factor) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        factor.name.toLowerCase().includes(q) ||
        factor.category.toLowerCase().includes(q) ||
        factor.publishingBody.toLowerCase().includes(q) ||
        factor.region.toLowerCase().includes(q) ||
        factor.primaryGas.toLowerCase().includes(q) ||
        factor.citation.toLowerCase().includes(q) ||
        factor.unit.toLowerCase().includes(q);

      const matchesBody =
        selectedBody === 'All' || factor.publishingBody === selectedBody;
      const matchesScope =
        selectedScope === 'All' || factor.scope === selectedScope;
      const matchesCategory =
        selectedCategory === 'All' || factor.category === selectedCategory;
      const matchesRegion =
        selectedRegion === 'All' ||
        (selectedRegion === 'India' && factor.region === 'India') ||
        (selectedRegion === 'Global' && factor.region === 'Global') ||
        (selectedRegion === 'Europe / UK' && (factor.region === 'Europe / UK' || factor.region === 'United Kingdom')) ||
        (selectedRegion === 'United States' && factor.region === 'United States');

      return matchesSearch && matchesBody && matchesScope && matchesCategory && matchesRegion;
    });
  }, [searchQuery, selectedBody, selectedScope, selectedCategory, selectedRegion]);

  // Update selected factor if the list changes and doesn't contain current selection
  useEffect(() => {
    if (filteredFactors.length > 0 && !filteredFactors.some((f) => f.id === selectedFactor.id)) {
      setSelectedFactor(filteredFactors[0]);
    }
  }, [filteredFactors, selectedFactor]);

  // Live calculation estimator logic
  const numQty = parseFloat(sampleQuantity) || 0;
  const calculatedEmissionsTons = useMemo(() => {
    return ((numQty * selectedFactor.value) / 1000).toFixed(3);
  }, [numQty, selectedFactor]);

  const uncertaintyPercent = parseFloat(selectedFactor.uncertainty.replace(/[^0-9.]/g, '')) || 2.0;
  const lowerBoundTons = (
    parseFloat(calculatedEmissionsTons) *
    (1 - uncertaintyPercent / 100)
  ).toFixed(3);
  const upperBoundTons = (
    parseFloat(calculatedEmissionsTons) *
    (1 + uncertaintyPercent / 100)
  ).toFixed(3);

  const handleCopy = (text: string, fieldKey: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    showToast('Copied to Clipboard', `${label}: ${text}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFactorHelperSearch('');
    setSelectedBody('All');
    setSelectedScope('All');
    setSelectedCategory('All');
    setSelectedRegion('All');
  };

  if (!isFactorHelperOpen) return null;

  return (
    <div
      id="emission-factor-helper-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="bg-white w-full max-w-6xl h-[92vh] max-h-[880px] rounded-2xl shadow-2xl border border-[var(--border-default)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="helper-title"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[var(--border-default)] bg-[var(--bg-canvas)] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--action-primary)] text-white flex items-center justify-center shadow-2xs shrink-0">
              <BookOpen className="w-5 h-5 text-[var(--status-warning)]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 id="helper-title" className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                  Emission Factor Helper
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--brand-50)] text-[var(--action-primary)] border border-[var(--brand-100)]">
                  IPCC · IEA · CEA Library
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-data truncate mt-0.5">
                Look up authoritative conversion factors, assess Tier accuracy, and preview calculation formulas.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={closeFactorHelper}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-lg transition-colors focus:outline-none"
              aria-label="Close Emission Factor Helper"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-[var(--border-default)] bg-white space-y-3 shrink-0">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by fuel, gas, or body (e.g. 'IPCC diesel', 'IEA grid electricity', 'R-410A', 'Natural gas', 'India')..."
              className="w-full pl-10 pr-9 py-2 text-xs bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-xl focus:outline-none focus:border-[var(--action-primary)] focus:bg-white text-[var(--text-primary)] placeholder-[#85808D] shadow-2xs"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Buttons & Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mr-1">
                Body:
              </span>
              {['All', 'IPCC', 'IEA', 'CEA', 'DEFRA'].map((body) => (
                <button
                  key={body}
                  type="button"
                  onClick={() => setSelectedBody(body)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors font-medium ${
                    selectedBody === body
                      ? 'bg-[var(--action-primary)] text-white shadow-2xs'
                      : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--brand-50)] hover:text-[var(--action-primary)]'
                  }`}
                >
                  {body === 'All' ? 'All Bodies' : body}
                </button>
              ))}

              <div className="h-4 w-[1px] bg-[var(--border-default)] mx-1 hidden sm:block" />

              <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mr-1 hidden sm:inline">
                Scope:
              </span>
              {['All', 'Scope 1', 'Scope 2', 'Scope 3'].map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => setSelectedScope(scope)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors font-medium ${
                    selectedScope === scope
                      ? 'bg-[var(--action-primary)] text-white shadow-2xs'
                      : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--brand-50)] hover:text-[var(--action-primary)]'
                  }`}
                >
                  {scope === 'All' ? 'All Scopes' : scope}
                </button>
              ))}
            </div>

            {/* Category / Region Dropdown Filters */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1 text-xs bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
              >
                <option value="All">All Categories</option>
                <option value="Electricity & Steam">Electricity & Steam</option>
                <option value="Liquid Fuels">Liquid Fuels</option>
                <option value="Gaseous Fuels">Gaseous Fuels</option>
                <option value="Solid Fuels">Solid Fuels</option>
                <option value="Refrigerants & Fugitive">Refrigerants (GWP)</option>
                <option value="Transport & Mobile">Transport & Mobile</option>
                <option value="Water & Waste">Water & Waste</option>
              </select>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-2.5 py-1 text-xs bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
              >
                <option value="All">All Regions</option>
                <option value="India">India</option>
                <option value="Global">Global Benchmark</option>
                <option value="United States">United States</option>
                <option value="Europe / UK">Europe / UK</option>
              </select>

              {(searchQuery || selectedBody !== 'All' || selectedScope !== 'All' || selectedCategory !== 'All' || selectedRegion !== 'All') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[var(--action-primary)] hover:underline font-semibold px-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Body: 2-Column Responsive Layout (Factors List + Interactive Accuracy Estimator) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 bg-[var(--bg-canvas)]">
          {/* Left Column: Factors List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 border-r border-[var(--border-default)] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] px-1 mb-1">
              <span>Showing <strong>{filteredFactors.length}</strong> emission factors</span>
              <span className="text-[11px] font-data">Click any row to inspect & calculate</span>
            </div>

            {filteredFactors.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[var(--border-default)] space-y-3">
                <BookOpen className="w-10 h-10 text-[var(--text-tertiary)] mx-auto" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">No emission factors found</h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto font-data">
                  No factors match your current search and filter criteria. Try searching for "IPCC", "diesel", or "grid".
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-1.5 text-xs font-semibold text-[var(--action-primary)] bg-[var(--brand-50)] rounded-full hover:bg-[var(--status-info-bg)]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              filteredFactors.map((f) => {
                const isSelected = selectedFactor.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFactor(f)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-white border-[var(--action-primary)] shadow-md ring-1 ring-[#5625B8]/20'
                        : 'bg-white border-[var(--border-default)] hover:border-[var(--border-default)] hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center flex-wrap gap-1.5 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              f.publishingBody === 'IPCC'
                                ? 'bg-[var(--brand-50)] text-[var(--action-primary)] border-[var(--brand-100)]'
                                : f.publishingBody === 'IEA'
                                ? 'bg-[var(--brand-50)] text-[var(--action-primary)] border-[var(--brand-100)]'
                                : f.publishingBody === 'CEA'
                                ? 'bg-[var(--status-success-bg)] text-[var(--status-success)] border-[var(--status-success-bg)]'
                                : 'bg-[var(--status-warning-bg)] text-[var(--status-warning)] border-[var(--status-warning)]'
                            }`}
                          >
                            {f.publishingBody}
                          </span>

                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                            {f.scope}
                          </span>

                          <span className="text-[10px] text-[var(--text-tertiary)] font-data">
                            {f.region} · {f.vintageYear}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
                          {f.name}
                        </h4>

                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1 mt-0.5 font-data">
                          {f.description}
                        </p>
                      </div>

                      {/* Factor Value Badge */}
                      <div className="text-right shrink-0">
                        <div className="text-sm sm:text-base font-bold text-[var(--text-primary)] font-mono">
                          {f.value}
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)] font-data">
                          {f.unit}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Factor Detail & Interactive Calculation Accuracy Estimator */}
          <div className="w-full lg:w-[420px] bg-white overflow-y-auto p-5 sm:p-6 space-y-5 shrink-0 border-t lg:border-t-0">
            {/* Factor Header */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--action-primary)] bg-[var(--brand-50)] px-2.5 py-0.5 rounded-full border border-[var(--brand-100)]">
                  {selectedFactor.publishingBody} · {selectedFactor.scope}
                </span>
                <span className="text-[10px] font-semibold text-[var(--status-success)] bg-[var(--status-success-bg)] px-2 py-0.5 rounded-full border border-[var(--status-success-bg)] flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{selectedFactor.tier} Verified</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug">
                {selectedFactor.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed font-data">
                {selectedFactor.description}
              </p>
            </div>

            {/* Factor Value Spotlight Card */}
            <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-tertiary)]">
                    Emission Factor Value
                  </div>
                  <div className="text-2xl font-black text-[var(--text-primary)] font-mono mt-0.5">
                    {selectedFactor.value}{' '}
                    <span className="text-xs font-semibold text-[var(--text-secondary)] font-sans">
                      {selectedFactor.unit}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(selectedFactor.value.toString(), 'val', 'Factor value')}
                  className="enterprise-btn-secondary h-8 px-2.5 text-xs font-semibold flex items-center space-x-1"
                  title="Copy factor value to clipboard"
                >
                  {copiedField === 'val' ? <Check className="w-3.5 h-3.5 text-[var(--status-success)]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'val' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-default)] text-xs">
                <div>
                  <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Gases:</span>
                  <div className="font-semibold text-[var(--text-primary)] text-[11px] font-mono truncate">
                    {selectedFactor.primaryGas}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold">Uncertainty:</span>
                  <div className="font-semibold text-[var(--text-primary)] text-[11px]">
                    {selectedFactor.uncertainty} (95% CI)
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Calculation Accuracy Estimator */}
            <div className="p-4 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Calculator className="w-4 h-4 text-[var(--text-primary)]" />
                  <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Accuracy Estimator
                  </span>
                </div>
                <span className="text-[10px] text-[var(--action-primary)] font-semibold bg-white/70 px-2 py-0.5 rounded-full border border-[var(--brand-100)]">
                  Deterministic tCO2e
                </span>
              </div>

              {/* Input Quantity */}
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-primary)] mb-1">
                  Test Activity Quantity ({selectedFactor.unit.split('/')[1]?.trim() || 'units'}):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sampleQuantity}
                    onChange={(e) => setSampleQuantity(e.target.value)}
                    placeholder="Enter activity amount..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-[var(--brand-100)] rounded-lg font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[var(--text-tertiary)] font-data">
                    {selectedFactor.unit.split('/')[1]?.trim() || 'units'}
                  </span>
                </div>
              </div>

              {/* Result computation */}
              <div className="p-3 bg-white rounded-xl border border-[var(--brand-100)] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[var(--text-secondary)] text-[11px]">
                  <span>Formula:</span>
                  <span className="font-mono text-[var(--text-primary)] text-[10px]">
                    Qty × {selectedFactor.value} ÷ 1,000
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]">
                  <span className="font-semibold text-[var(--text-primary)]">Estimated Emissions:</span>
                  <span className="text-base font-bold text-[var(--text-primary)] font-mono">
                    {calculatedEmissionsTons} <span className="text-xs font-semibold">tCO2e</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] pt-1">
                  <span>Accuracy Band ({selectedFactor.uncertainty}):</span>
                  <span className="font-mono text-[var(--text-primary)]">
                    {lowerBoundTons} – {upperBoundTons} tCO2e
                  </span>
                </div>
              </div>
            </div>

            {/* Official Regulatory Citation Card */}
            <div className="p-3.5 bg-white border border-[var(--border-default)] rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                  Authoritative Citation
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedFactor.citation, 'cit', 'Citation')}
                  className="text-[11px] text-[var(--action-primary)] hover:underline flex items-center space-x-1 font-semibold"
                >
                  {copiedField === 'cit' ? <Check className="w-3 h-3 text-[var(--status-success)]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'cit' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[var(--text-primary)] font-data leading-relaxed bg-[var(--surface-secondary)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                {selectedFactor.citation}
              </p>
              <div className="text-[10px] text-[var(--text-tertiary)] flex items-center justify-between pt-1">
                <span>Version: {selectedFactor.versionOrReport}</span>
                <span>Effective: {selectedFactor.effectivePeriod}</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => applyFactorToEntry(selectedFactor)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Use This Factor in Activity Entry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-[var(--text-tertiary)] text-center mt-1.5 font-data">
                Pre-fills manual logging with verified factor and scope parameters.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[var(--border-default)] bg-white flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[var(--status-success)]" />
            <span>
              Factor records include source and methodology references for review against your selected reporting profile.
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={closeFactorHelper}
              className="px-4 py-1.5 rounded-lg border border-[var(--border-default)] hover:bg-[var(--surface-secondary)] text-xs font-semibold text-[var(--text-primary)]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
