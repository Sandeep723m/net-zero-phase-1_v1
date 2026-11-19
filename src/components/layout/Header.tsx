import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import tulaLogo from '../../assets/Tula Carbon Dot Grid Logo.png';
import {
  Building2,
  ChevronDown,
  Bell,
  Calendar,
  UserCheck,
  Compass,
  Menu,
  X,
  PanelRight,
  LogOut,
  Check,
  ArrowRight,
  ShieldCheck,
  User,
  ScanLine,
  PlusCircle,
  FileBarChart,
  BookOpen,
  TableProperties,
} from 'lucide-react';

interface HeaderProps {
  onOpenFlowMap?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFlowMap }) => {
  const {
    currentTenant,
    setCurrentTenant,
    tenants,
    currentRole,
    setCurrentRole,
    activePeriod,
    periods,
    setActivePeriodId,
    verifierQueries,
    notifications,
    navigateToScreen,
    currentScreen,
    isMobileMenuOpen,
    toggleMobileMenu,
    isMobileRightNavOpen,
    setIsMobileRightNavOpen,
    toggleMobileRightNav,
    openFactorHelper,
  } = useApp();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);

  const openQueriesCount = verifierQueries.filter((q) => q.status === 'Open').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const roles: { role: UserRole; label: string; shortLabel: string; desc: string }[] = [
    { role: 'TENANT_ADMIN', label: 'Tenant Admin', shortLabel: 'Admin', desc: 'Organisation setup, boundaries, emission sources, user access' },
    { role: 'DATA_ENTRY', label: 'Data Entry', shortLabel: 'Entry', desc: 'Enter activity data, upload bills/evidence, submit for review' },
    { role: 'REVIEWER', label: 'Reviewer / Approver', shortLabel: 'Review', desc: 'Review submissions, verify evidence, approve or send back' },
    { role: 'VERIFIER', label: 'Verifier / VVB', shortLabel: 'Verifier', desc: 'Independent audit, evidence trace to source, raise line queries' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
    setIsMobileRightNavOpen(false);
    if (role === 'VERIFIER') {
      navigateToScreen('31_verifier_dashboard', 'FLOW_F');
    } else if (role === 'DATA_ENTRY') {
      navigateToScreen('10_activity_dashboard', 'FLOW_B');
    } else if (role === 'REVIEWER') {
      navigateToScreen('24_review_approve', 'FLOW_B');
    } else {
      navigateToScreen('04_org_profile', 'FLOW_A');
    }
  };

  const getUserInitials = () => {
    switch (currentRole) {
      case 'TENANT_ADMIN':
        return 'JR';
      case 'DATA_ENTRY':
        return 'AK';
      case 'REVIEWER':
        return 'SI';
      case 'VERIFIER':
        return 'MS';
      default:
        return 'TC';
    }
  };

  const getUserName = () => {
    switch (currentRole) {
      case 'TENANT_ADMIN':
        return 'J. Rao';
      case 'DATA_ENTRY':
        return 'A. Kumar';
      case 'REVIEWER':
        return 'S. Iyer';
      case 'VERIFIER':
        return 'M. Singh';
      default:
        return 'Authorized User';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 glass-shell bg-white/80 backdrop-blur-xl border-b border-[var(--border-default)]/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-[0_2px_12px_rgba(28,31,58,0.03)]">
        {/* ============================================================ */}
        {/* MOBILE HEADER (md:hidden): Left Menu Bar | Center Logo | Right Side Nav Bar */}
        {/* ============================================================ */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Left: Left Menu Bar Button */}
          <div className="flex items-center w-12 justify-start">
            <button
              id="btn-mobile-left-menu"
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 -ml-1 text-[var(--text-primary)] hover:text-[var(--action-primary)] hover:bg-[var(--brand-50)] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]/20"
              aria-label={isMobileMenuOpen ? "Close left navigation menu" : "Open left navigation menu"}
              title="Open navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Center: Centered Brand Logo */}
          <div
            onClick={() => navigateToScreen('10_activity_dashboard')}
            className="flex items-center cursor-pointer select-none group"
          >
            <img
              src={tulaLogo}
              alt="Tula Carbon"
              className="h-9 sm:h-10 w-auto max-w-[168px] object-contain group-hover:opacity-90 transition-opacity"
            />
          </div>

          {/* Right: Right Side Nav Bar Menu Toggle Button */}
          <div className="flex items-center w-12 justify-end">
            <button
              id="btn-mobile-right-menu"
              type="button"
              onClick={toggleMobileRightNav}
              className="p-2 -mr-1 text-[var(--text-primary)] hover:text-[var(--action-primary)] hover:bg-[var(--brand-50)] rounded-lg transition-colors relative focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]/20"
              aria-label={isMobileRightNavOpen ? "Close side nav menu" : "Open side nav menu"}
              title="Open side nav bar menu"
            >
              {isMobileRightNavOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <PanelRight className="w-5 h-5" />
              )}
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-brand-orange-500)] rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP HEADER (hidden md:flex): Left Controls + Right Controls */}
        {/* ============================================================ */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Context Hierarchy: Organization & Reporting Period */}
          <div className="flex items-center min-w-0">
            <div className="flex items-center space-x-2 min-w-0">
              {/* Tenant / Organization Selector */}
              <div className="relative min-w-0">
                <button
                  onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                  className="flex items-center space-x-2 px-3 h-9 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-canvas)] rounded-xl border border-[var(--border-default)] hover:border-[var(--border-strong)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none transition-all max-w-[210px] bg-white/80 hover:bg-white shadow-2xs font-sans group"
                  title="Switch Organisation"
                  aria-expanded={tenantDropdownOpen}
                >
                  <Building2 className="w-3.5 h-3.5 text-[var(--action-primary)] shrink-0" aria-hidden="true" />
                  <span className="font-semibold truncate">{currentTenant.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors shrink-0" aria-hidden="true" />
                </button>

                {tenantDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-64 glass-card-strong bg-white/95 rounded-xl shadow-xl border border-[var(--border-default)] py-1.5 z-50">
                    <div className="px-3 py-1.5 border-b border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                      Select Organisation Context
                    </div>
                    {tenants.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setCurrentTenant(t);
                          setTenantDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[var(--bg-canvas)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none ${
                          t.id === currentTenant.id ? 'bg-[var(--brand-50)] text-[var(--action-primary)] font-semibold' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-semibold truncate">{t.name}</div>
                          <div className="text-[11px] text-[var(--text-secondary)] font-data">{t.legalEntityName}</div>
                        </div>
                        {t.id === currentTenant.id && (
                          <Check className="w-4 h-4 text-[var(--action-primary)] shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-[var(--border-subtle)] p-1.5">
                      <button
                        onClick={() => {
                          setTenantDropdownOpen(false);
                          navigateToScreen('03_tenant_selector');
                        }}
                        className="w-full text-center py-1 text-xs text-[var(--action-primary)] font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none"
                      >
                        View Tenant Directory →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Reporting Period / Year Selector */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                  className="flex items-center space-x-2 px-3 h-9 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-canvas)] rounded-xl border border-[var(--border-default)] hover:border-[var(--border-strong)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none transition-all shadow-2xs bg-white/80 hover:bg-white font-sans group"
                  title="Select Reporting Period"
                  aria-expanded={periodDropdownOpen}
                >
                  <Calendar className="w-3.5 h-3.5 text-[var(--action-primary)] shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-[var(--text-primary)] whitespace-nowrap">{activePeriod.name}</span>
                  {activePeriod.locked ? (
                    <span className="text-[10px] px-1.5 py-0.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded-full border border-[var(--border-default)] font-bold uppercase tracking-wider">
                      Locked
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 bg-[var(--status-success-bg)] text-[var(--status-success)] rounded-full border border-[#147A5A]/20 font-bold uppercase tracking-wider">
                      Active
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors shrink-0" aria-hidden="true" />
                </button>

              {periodDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-60 glass-card-strong bg-white/95 rounded-xl shadow-xl border border-[var(--border-default)] py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                    Reporting Period
                  </div>
                  {periods.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePeriodId(p.id);
                        setPeriodDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[var(--bg-canvas)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none ${
                        p.id === activePeriod.id ? 'bg-[var(--brand-50)] text-[var(--action-primary)] font-semibold' : 'text-[var(--text-primary)]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-[11px] text-[var(--text-secondary)] font-mono">
                          {p.startDate} to {p.endDate}
                        </div>
                      </div>
                      {p.locked && (
                        <span className="text-[11px] px-2 py-0.5 bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded-full border border-[var(--border-default)]">
                          Locked
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="border-t border-[var(--border-subtle)] p-1.5">
                    <button
                      onClick={() => {
                        setPeriodDropdownOpen(false);
                        navigateToScreen('06_periods');
                      }}
                      className="w-full text-center py-1 text-xs text-[var(--action-primary)] font-semibold hover:underline focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none"
                    >
                      Manage Reporting Periods →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Right: Notification Center & User Profile */}
          <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
            {/* Notifications: Direct Nav to Screen 34 */}
            <button
              id="btn-nav-notifications"
              onClick={() => navigateToScreen('34_reviewer_notification', 'FLOW_F')}
              className="h-9 w-9 flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--action-primary)] hover:bg-[var(--brand-50)] rounded-xl border border-[var(--border-default)] hover:border-[var(--border-strong)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none transition-colors relative shadow-2xs bg-white/70"
              title="Notification Center"
              aria-label="Notification Center"
            >
              <Bell className="w-4 h-4" aria-hidden="true" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 px-1 min-w-[14px] h-[14px] text-[9px] font-bold bg-[var(--color-brand-orange-500)] text-white rounded-full flex items-center justify-center leading-none" aria-label={`${unreadNotificationsCount} unread notifications`}>
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Component: Avatar + Name */}
            <div
              onClick={() => navigateToScreen('01_login', 'FLOW_A')}
              className="flex items-center space-x-2 px-2.5 h-9 rounded-xl hover:bg-[var(--bg-canvas)] cursor-pointer transition-colors border border-[var(--border-default)] hover:border-[var(--border-strong)] focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none shadow-2xs bg-white/70"
              title="Account Settings / Log out"
              tabIndex={0}
              role="button"
            >
              <div className="w-6 h-6 rounded-lg bg-[var(--brand-50)] text-[var(--action-primary)] font-semibold text-[11px] flex items-center justify-center shrink-0 border border-[var(--brand-100)]">
                {getUserInitials()}
              </div>
              <div className="hidden lg:flex items-center space-x-1">
                <span className="text-xs font-semibold text-[var(--text-primary)]">{getUserName()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-tertiary)]" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MOBILE RIGHT SIDE NAV BAR MENU (Drawer) */}
      {/* ============================================================ */}
      {isMobileRightNavOpen && (
        <div
          id="mobile-right-nav-backdrop"
          onClick={() => setIsMobileRightNavOpen(false)}
          className="fixed inset-0 bg-black/45 z-40 md:hidden backdrop-blur-xs transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      <aside
        id="mobile-right-nav-drawer"
        className={`fixed inset-y-0 right-0 z-50 w-80 max-w-[86vw] bg-white border-l border-[var(--border-default)] flex flex-col justify-between shadow-2xl md:hidden transition-transform duration-200 ease-in-out ${
          isMobileRightNavOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-3.5 border-b border-[var(--border-default)] bg-[var(--bg-canvas)] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PanelRight className="w-4 h-4 text-[#2D63D2]" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">Side Nav Menu</span>
          </div>
          <button
            id="btn-close-mobile-right-nav"
            type="button"
            onClick={() => setIsMobileRightNavOpen(false)}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-lg transition-colors focus:outline-none"
            aria-label="Close side nav menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* User Profile Summary */}
          <div className="p-3 bg-[var(--bg-canvas)] border border-[var(--border-default)] rounded-lg flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#2D63D2] text-white flex items-center justify-center text-sm font-semibold shadow-xs shrink-0">
              {getUserInitials()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[var(--text-primary)] truncate">{getUserName()}</div>
              <div className="text-[11px] text-[var(--text-secondary)] truncate">satishbittu67@gmail.com</div>
              <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--status-info-bg)] text-[#2D63D2] border border-[var(--status-info)]/20">
                {roles.find((r) => r.role === currentRole)?.label || currentRole}
              </span>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Quick Actions
              </span>
              <span className="text-[10px] text-[var(--action-primary)] font-semibold bg-[var(--brand-50)] px-1.5 py-0.5 rounded">
                Direct Jump
              </span>
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('11_entry_form', 'FLOW_B');
                }}
                className="w-full p-2.5 rounded-lg border border-[var(--border-default)] bg-white hover:bg-[var(--surface-secondary)] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[var(--brand-50)] text-[var(--action-primary)] flex items-center justify-center shrink-0">
                    <TableProperties className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">Activity Ingestion</div>
                    <div className="text-[10px] text-[var(--text-secondary)]">Manual, Bulk & Camera Scan</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('27_report_builder', 'FLOW_E');
                }}
                className="w-full p-2.5 rounded-lg border border-[var(--border-default)] bg-white hover:bg-[var(--surface-secondary)] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[var(--status-warning-bg)] text-[var(--status-warning)] flex items-center justify-center shrink-0">
                    <FileBarChart className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">Start New Report</div>
                    <div className="text-[10px] text-[var(--text-secondary)]">GHG Disclosure Builder</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  openFactorHelper();
                }}
                className="w-full p-2.5 rounded-lg border border-[var(--brand-100)] bg-[var(--brand-50)]/60 hover:bg-[var(--brand-50)] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[var(--action-primary)] text-white flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">Factor Helper</div>
                    <div className="text-[10px] text-[var(--action-primary)] font-semibold">IPCC AR6 & IEA 2024 Lookup</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              </button>
            </div>
          </div>

          {/* Role Switcher Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Active Role Perspective
              </span>
              <span className="text-[10px] text-[#2D63D2] font-mono">1-Tap Switch</span>
            </div>
            <div className="space-y-1.5">
              {roles.map((r) => {
                const isActive = currentRole === r.role;
                return (
                  <button
                    key={r.role}
                    onClick={() => handleRoleSelect(r.role)}
                    className={`w-full p-2.5 rounded-lg text-left text-xs transition-all border flex items-center justify-between ${
                      isActive
                        ? 'bg-[var(--status-info-bg)] border-[var(--status-info)] text-[#2D63D2] font-medium shadow-xs'
                        : 'bg-white border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-canvas)]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{r.label}</div>
                      <div className="text-[10px] text-[var(--text-secondary)] line-clamp-1">{r.desc}</div>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-[#2D63D2] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Organisation / Tenant Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Organisation / Tenant
              </span>
              <Building2 className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            </div>
            <div className="space-y-1">
              {tenants.map((t) => {
                const isSelected = t.id === currentTenant.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTenant(t);
                      setIsMobileRightNavOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between border transition-colors ${
                      isSelected
                        ? 'bg-[var(--bg-subtle)] border-[var(--border-default)] text-[#2D63D2] font-medium'
                        : 'bg-white border-transparent hover:bg-[var(--bg-canvas)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-medium truncate">{t.name}</div>
                      <div className="text-[10px] text-[var(--text-tertiary)]">{t.legalEntityName}</div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#2D63D2] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('03_tenant_selector');
                }}
                className="w-full py-1.5 text-center text-xs text-[#2D63D2] font-medium hover:underline flex items-center justify-center space-x-1"
              >
                <span>View Full Tenant Directory</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Reporting Period Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Reporting Period
              </span>
              <Calendar className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            </div>
            <div className="space-y-1">
              {periods.map((p) => {
                const isSelected = p.id === activePeriod.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePeriodId(p.id);
                      setIsMobileRightNavOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between border transition-colors ${
                      isSelected
                        ? 'bg-[var(--status-info-bg)] border-[var(--status-info)]/30 text-[#2D63D2] font-medium'
                        : 'bg-white border-[var(--border-default)] hover:bg-[var(--bg-canvas)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-[10px] text-[var(--text-secondary)]">{p.startDate} - {p.endDate}</div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      p.locked ? 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]' : 'bg-[var(--status-info-bg)] text-[#2D63D2]'
                    }`}>
                      {p.locked ? 'Locked' : 'Active'}
                    </span>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('06_periods');
                }}
                className="w-full py-1.5 text-center text-xs text-[#2D63D2] font-medium hover:underline flex items-center justify-center space-x-1"
              >
                <span>Manage Reporting Periods</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
              Workspace Tools
            </span>
            <div className="space-y-1.5">
              {/* Notification Center button */}
              <button
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('34_reviewer_notification', 'FLOW_F');
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-full bg-white border border-[var(--border-default)] hover:bg-[var(--bg-canvas)] text-xs transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <Bell className="w-4 h-4 text-[#2D63D2]" />
                  <span className="font-medium text-[var(--text-primary)]">Notification Center</span>
                </div>
                {unreadNotificationsCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-brand-orange-500)] text-white">
                    {unreadNotificationsCount} unread
                  </span>
                ) : (
                  <span className="text-[10px] text-[var(--text-tertiary)]">Up to date</span>
                )}
              </button>

              {/* Sign out */}
              <button
                onClick={() => {
                  setIsMobileRightNavOpen(false);
                  navigateToScreen('01_login', 'FLOW_A');
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-full bg-white border border-[var(--border-default)] hover:bg-[var(--status-warning-bg)] hover:border-[var(--status-warning)] text-xs text-[var(--text-secondary)] hover:text-[var(--status-warning)] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Switch Account / Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-[var(--bg-canvas)] border-t border-[var(--border-default)] text-center text-[10px] text-[var(--text-tertiary)] space-y-0.5">
          <div className="font-medium text-[var(--text-secondary)]">Tula Carbon Accounting & Assurance</div>
          <div>GHG Protocol Scopes 1, 2 & 3 · Phase 1 Assurance</div>
        </div>
      </aside>
    </>
  );
};


