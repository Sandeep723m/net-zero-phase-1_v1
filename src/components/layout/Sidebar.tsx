import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenId, UserRole } from '../../types';
import { isPendingReview, isWithinPeriod } from '../flows/FlowB_ActivityData/ledgerRecords';
import tulaLogo from '../../assets/Tula Carbon Dot Grid Logo.png';
import {
  House,
  Palette,
  ChartNoAxesCombined,
  BarChart3,
  TableProperties,
  Files,
  Calculator,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  Zap,
  Users,
  Settings,
  History,
  Bell,
  BookOpen,
  Inbox,
  HelpCircle,
  LifeBuoy,
  MessageSquare,
  Eye,
  X,
  SlidersHorizontal,
  Target,
  Play,
  ChevronDown,
  ChevronsUpDown,
  Moon,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  screens: ScreenId[];
}

const mainGroups: NavGroup[] = [
  {
    label: 'Activity data',
    icon: TableProperties,
    screens: ['10_activity_dashboard', '11_entry_form', '16_attach_evidence', '12_import_upload', '23_submission_queue'],
  },
  {
    label: 'Calculations',
    icon: Calculator,
    screens: ['19_run_calculation', '20_results_summary', '22_factors_reference', '26_period_lock'],
  },
  {
    label: 'Assurance',
    icon: ShieldCheck,
    screens: ['24_review_approve', '32_evidence_trace', '33_raise_query', '25_approval_history', '31_verifier_dashboard', '35_audit_trail'],
  },
  {
    label: 'Analytics & reports',
    icon: ChartNoAxesCombined,
    screens: ['visual_report', '21_drill_down', '36_scenario_builder', '37_benchmarking', '27_report_builder', '28_report_preview'],
  },
];

const workspaceGroup: NavGroup = {
  label: 'Organisation',
  icon: Building2,
  screens: ['04_org_profile', '05_sites', '06_periods', '07_emission_sources', '08_users_roles'],
};

const navFocusClass = 'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--border-focus)]';

export const Sidebar: React.FC = () => {
  const {
    currentScreen,
    activePeriod,
    activeFilterStatus,
    setActiveFilterStatus,
    setActiveFilterSite,
    setSearchQuery,
    navigateToScreen,
    records,
    verifierQueries,
    notifications,
    currentRole,
    setCurrentRole,
    currentUser,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useApp();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileInfo, setProfileInfo] = useState<'support' | 'feedback' | null>(null);
  const [darkMode, setDarkMode] = useState(() => typeof window !== 'undefined' && localStorage.getItem('tula_appearance') === 'dark');
  const profileMenu = useRef<HTMLDivElement>(null);
  const profileTrigger = useRef<HTMLButtonElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [groupOverrides, setGroupOverrides] = useState<Record<string, { open: boolean; screen: ScreenId }>>({});

  function closeProfileMenu() {
    setProfileMenuOpen(false);
    setProfileInfo(null);
  }

  useEffect(() => {
    if (!profileMenuOpen) return;
    function dismissOutside(event: PointerEvent) {
      if (!profileMenu.current?.contains(event.target as Node)) closeProfileMenu();
    }
    document.addEventListener('pointerdown', dismissOutside);
    return () => document.removeEventListener('pointerdown', dismissOutside);
  }, [profileMenuOpen]);

  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute('data-theme');
    root.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('tula_appearance', darkMode ? 'dark' : 'light');
    return () => {
      if (previousTheme === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previousTheme);
    };
  }, [darkMode]);

  const pendingReviews = records.filter((record) => isPendingReview(record) && isWithinPeriod(record, activePeriod) && (currentUser.siteScope.includes('all') || currentUser.siteScope.includes(record.siteId))).length;
  const openQueries = verifierQueries.filter((query) => query.status === 'Open').length;
  const unreadNotifications = notifications.filter((notification) => !notification.isRead).length;

  const roles: { role: UserRole; label: string }[] = [
    { role: 'TENANT_ADMIN', label: 'Tenant admin' },
    { role: 'DATA_ENTRY', label: 'Data entry' },
    { role: 'REVIEWER', label: 'Reviewer' },
    { role: 'VERIFIER', label: 'Verifier' },
  ];

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    closeProfileMenu();
    setIsMobileMenuOpen(false);
    if (role === 'VERIFIER') navigateToScreen('31_verifier_dashboard', 'FLOW_F');
    else if (role === 'DATA_ENTRY') navigateToScreen('10_activity_dashboard', 'FLOW_B');
    else if (role === 'REVIEWER') navigateToScreen('24_review_approve', 'FLOW_B');
    else navigateToScreen('04_org_profile', 'FLOW_A');
  };

  let availableItems: NavItem[];
  if (currentRole === 'VERIFIER') {
    availableItems = [
      { id: '31_verifier_dashboard', label: 'Overview', icon: House, badge: openQueries || undefined },
      { id: '32_evidence_trace', label: 'Evidence trace', icon: Files },
      { id: '33_raise_query', label: 'Assurance queries', icon: HelpCircle },
      { id: '35_audit_trail', label: 'Audit trail', icon: History },
      { id: '22_factors_reference', label: 'Emission factors', icon: Zap },
      { id: 'visual_report', label: 'Visual report', icon: BarChart3 },
      { id: '37_benchmarking', label: 'Benchmarks', icon: Target },
      { id: '28_report_preview', label: 'Report disclosures', icon: FileText },
      { id: '04_org_profile', label: 'Organisation profile', icon: Building2 },
      { id: '05_sites', label: 'Facilities', icon: MapPin },
      { id: '06_periods', label: 'Reporting periods', icon: Calendar },
      { id: '34_reviewer_notification', label: 'Notifications', icon: Bell, badge: unreadNotifications || undefined },
    ];
  } else if (currentRole === 'DATA_ENTRY') {
    availableItems = [
      { id: 'overview', label: 'Overview', icon: House },
      { id: '10_activity_dashboard', label: 'Activity ledger', icon: TableProperties },
      { id: '11_entry_form', label: 'Add activity', icon: TableProperties },
      { id: '12_import_upload', label: 'Imports', icon: FileText },
      { id: '16_attach_evidence', label: 'Evidence & documents', icon: Files },
      { id: '23_submission_queue', label: 'My submissions', icon: Inbox },
      { id: '22_factors_reference', label: 'Emission factors', icon: Zap },
      { id: '34_reviewer_notification', label: 'Notifications', icon: Bell, badge: unreadNotifications || undefined },
    ];
  } else if (currentRole === 'REVIEWER') {
    availableItems = [
      { id: 'overview', label: 'Overview', icon: House },
      { id: '10_activity_dashboard', label: 'Activity ledger', icon: TableProperties },
      { id: '24_review_approve', label: 'Batch approvals', icon: CheckCircle2 },
      { id: '23_submission_queue', label: 'Submissions', icon: Inbox },
      { id: '19_run_calculation', label: 'Run calculations', icon: Play },
      { id: '20_results_summary', label: 'Calculation ledger', icon: Calculator },
      { id: '21_drill_down', label: 'Results analysis', icon: Eye },
      { id: '22_factors_reference', label: 'Emission factors', icon: Zap },
      { id: '25_approval_history', label: 'Approval history', icon: History },
      { id: '33_raise_query', label: 'Verifier queries', icon: HelpCircle, badge: openQueries || undefined },
      { id: '35_audit_trail', label: 'Audit trail', icon: History },
      { id: '36_scenario_builder', label: 'Scenarios', icon: SlidersHorizontal },
      { id: 'visual_report', label: 'Visual report', icon: BarChart3 },
      { id: '37_benchmarking', label: 'Benchmarks', icon: Target },
      { id: '27_report_builder', label: 'Reports & exports', icon: FileText },
      { id: '34_reviewer_notification', label: 'Notifications', icon: Bell, badge: unreadNotifications || undefined },
      { id: '09_tenant_settings', label: 'Settings', icon: Settings },
    ];
  } else {
    availableItems = [
      { id: 'overview', label: 'Overview', icon: House },
      { id: '10_activity_dashboard', label: 'Activity ledger', icon: TableProperties },
      { id: '11_entry_form', label: 'Add activity', icon: TableProperties },
      { id: '12_import_upload', label: 'Imports', icon: FileText },
      { id: '16_attach_evidence', label: 'Evidence & documents', icon: Files },
      { id: '19_run_calculation', label: 'Run calculations', icon: Play },
      { id: '20_results_summary', label: 'Calculation ledger', icon: Calculator },
      { id: '21_drill_down', label: 'Results analysis', icon: Eye },
      { id: '22_factors_reference', label: 'Emission factors', icon: Zap },
      { id: '24_review_approve', label: 'Batch approvals', icon: CheckCircle2 },
      { id: '23_submission_queue', label: 'Submissions', icon: Inbox },
      { id: '26_period_lock', label: 'Period close', icon: Calendar },
      { id: '31_verifier_dashboard', label: 'Verifier workspace', icon: ShieldCheck, badge: openQueries || undefined },
      { id: '35_audit_trail', label: 'Audit trail', icon: History },
      { id: '36_scenario_builder', label: 'Scenarios', icon: SlidersHorizontal },
      { id: 'visual_report', label: 'Visual report', icon: BarChart3 },
      { id: '37_benchmarking', label: 'Benchmarks', icon: Target },
      { id: '27_report_builder', label: 'Reports & exports', icon: FileText },
      { id: '34_reviewer_notification', label: 'Notifications', icon: Bell, badge: unreadNotifications || undefined },
      { id: '04_org_profile', label: 'Organisation profile', icon: Building2 },
      { id: '05_sites', label: 'Facilities', icon: MapPin },
      { id: '06_periods', label: 'Reporting periods', icon: Calendar },
      { id: '07_emission_sources', label: 'Emission sources', icon: Zap },
      { id: '08_users_roles', label: 'Users & roles', icon: Users },
      { id: '09_tenant_settings', label: 'Settings', icon: Settings },
    ];
  }

  const goTo = (screen: ScreenId) => {
    closeProfileMenu();
    navigateToScreen(screen);
    setIsMobileMenuOpen(false);
  };

  const overviewScreen = currentRole === 'VERIFIER' ? '31_verifier_dashboard' : 'overview';
  const home = availableItems.find((item) => item.id === overviewScreen);
  const groupedScreens = new Set([...mainGroups, workspaceGroup].flatMap((group) => group.screens));
  const settings = availableItems.find((item) => item.id === '09_tenant_settings');
  const workspaceItems = availableItems.filter((item) => item !== home && item !== settings && !groupedScreens.has(item.id));

  function renderItem(item: NavItem, nested = false, ledgerStatus = 'all') {
    const Icon = item.icon;
    const active = currentScreen === item.id && (item.id !== '10_activity_dashboard' || (activeFilterStatus === 'pending') === (ledgerStatus === 'pending'));
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          if (item.id === '10_activity_dashboard') {
            setActiveFilterStatus(ledgerStatus);
            setActiveFilterSite('all');
            setSearchQuery('');
          }
          goTo(item.id);
        }}
        aria-current={active ? 'page' : undefined}
        title={isCollapsed ? item.label : undefined}
        className={`${navFocusClass} flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] ${nested ? 'min-h-7' : 'min-h-8'} ${isCollapsed ? 'md:justify-center' : ''} ${active ? 'bg-[var(--bg-surface)] font-semibold text-[var(--action-primary)] shadow-xs' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'}`}
      >
        {!nested && <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />}
        <span className={`min-w-0 flex-1 ${isCollapsed ? 'md:sr-only' : ''}`}>{item.label}</span>
        {item.badge !== undefined && <span className={`shrink-0 rounded-full bg-[var(--bg-subtle)] px-1.5 text-[10px] font-medium tabular-nums text-[var(--text-secondary)] ${isCollapsed ? 'md:hidden' : ''}`}>{item.badge}</span>}
      </button>
    );
  }

  function renderGroup(group: NavGroup) {
    const items = availableItems.filter((item) => item !== home && group.screens.includes(item.id));
    if (!items.length) return null;
    if (items.length === 1) return renderItem(items[0]);

    const hasActiveItem = items.some((item) => item.id === currentScreen);
    const override = groupOverrides[group.label];
    const open = hasActiveItem && override?.screen !== currentScreen
      ? true
      : override?.open ?? false;
    const Icon = group.icon;

    return (
      <div key={group.label}>
        <button
          type="button"
          onClick={() => {
            if (isCollapsed) setIsCollapsed(false);
            setGroupOverrides((previous) => ({
              ...previous,
              [group.label]: { open: isCollapsed || !open, screen: currentScreen },
            }));
          }}
          aria-expanded={open && !isCollapsed}
          title={isCollapsed ? group.label : undefined}
          className={`${navFocusClass} flex min-h-8 w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] font-medium hover:bg-[var(--bg-surface)] ${isCollapsed ? 'md:justify-center' : ''} ${hasActiveItem || open ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
        >
          <Icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          <span className={`min-w-0 flex-1 ${isCollapsed ? 'md:sr-only' : ''}`}>{group.label}</span>
          <ChevronDown className={`size-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${isCollapsed ? 'md:hidden' : ''}`} aria-hidden="true" />
        </button>
        {open && (
          <div className={`ml-4 space-y-0.5 border-l border-[var(--border-default)] pl-2 ${isCollapsed ? 'md:hidden' : ''}`}>
            {items.map((item) => renderItem(item, true))}
          </div>
        )}
      </div>
    );
  }

  const profileActionClass = `${navFocusClass} flex min-h-9 w-full items-center gap-2.5 rounded-md px-2 text-left text-[13px] text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]`;

  function renderAvatar() {
    return <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--bg-subtle)] text-[11px] font-semibold text-[var(--action-primary)]" aria-hidden="true">{currentUser.avatarInitials}</span>;
  }

  function renderIdentity(className = '') {
    return (
      <span className={`min-w-0 flex-1 ${className}`}>
        <span className="block truncate text-xs font-semibold text-[var(--text-primary)]">{currentUser.name}</span>
        <span className="block truncate text-[11px] text-[var(--text-secondary)]" title={currentUser.email}>{currentUser.email}</span>
      </span>
    );
  }

  return <>
    <button type="button" onClick={() => {
      setIsCollapsed(false);
      setIsMobileMenuOpen(true);
    }} className="fixed top-3 left-3 z-30 flex size-10 items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm md:hidden" aria-label="Open navigation" aria-controls="app-sidebar" aria-expanded={isMobileMenuOpen}>
      <Menu className="size-5" />
    </button>
    {isMobileMenuOpen && <button type="button" aria-label="Close navigation backdrop" onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-black/40 md:hidden" />}
    <aside
      id="app-sidebar"
      className={`fixed inset-y-0 left-0 z-50 flex w-56 max-w-[86vw] shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-subtle)]/80 shadow-xl backdrop-blur-xl md:visible md:relative md:inset-auto md:z-20 md:h-full md:min-h-0 md:max-w-none md:translate-x-0 md:shadow-none motion-safe:transition-[width,transform,visibility] motion-safe:duration-200 ${isMobileMenuOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'} ${isCollapsed ? 'md:w-14' : 'md:w-56 lg:w-60'}`}
    >
      <div className={`flex items-center justify-between gap-2 px-3 pt-3 pb-2 ${isCollapsed ? 'md:justify-center' : ''}`}>
        <button type="button" onClick={() => goTo(overviewScreen)} aria-label="Tula Carbon Overview" className={`${navFocusClass} shrink-0 rounded-md ${isCollapsed ? 'md:hidden' : ''}`}>
          <img src={tulaLogo} alt="" className="h-7 w-auto max-w-32 object-contain object-left" />
        </button>
        <button type="button" onClick={() => setIsCollapsed((collapsed) => !collapsed)} className={`${navFocusClass} hidden size-7 shrink-0 place-items-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] md:grid`} aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
        <button type="button" onClick={() => setIsMobileMenuOpen(false)} className={`${navFocusClass} grid size-8 place-items-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] md:hidden`} aria-label="Close navigation"><X className="size-4" /></button>
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-2.5 py-2">
        {[
          { label: 'Workspace', content: <>{home && renderItem(home)}{renderGroup(workspaceGroup)}{workspaceItems.map((item) => renderItem(item))}{renderItem({ id: 'brand_guidelines', label: 'Brand & design system', icon: Palette })}</> },
          { label: 'Data management', content: renderGroup(mainGroups[0]) },
          {
            label: 'Validation & assurance',
            content: <>
              {(currentRole === 'TENANT_ADMIN' || currentRole === 'REVIEWER') && renderItem({ id: '10_activity_dashboard', label: 'Review queue', icon: Inbox, badge: pendingReviews || undefined }, false, 'pending')}
              {renderGroup(mainGroups[2])}
            </>,
          },
          { label: 'Analysis', content: <>{renderGroup(mainGroups[1])}{renderGroup(mainGroups[3])}</> },
        ].map(({ label, content }) => (
          <section key={label} aria-label={label} className="has-[>div:empty]:hidden">
            <h2 className={`mb-1.5 px-2 text-[10px] font-medium tracking-wide text-[var(--text-secondary)] uppercase ${isCollapsed ? 'md:sr-only' : ''}`}>{label}</h2>
            <div className="space-y-0.5">{content}</div>
          </section>
        ))}
        {settings && renderItem(settings)}
      </nav>

      <div
        ref={profileMenu}
        className="relative border-t border-[var(--border-subtle)] px-2.5 py-2.5"
        onBlur={(event) => {
          if (profileMenuOpen && !event.currentTarget.contains(event.relatedTarget)) closeProfileMenu();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && profileMenuOpen) {
            event.stopPropagation();
            closeProfileMenu();
            profileTrigger.current?.focus();
          }
        }}
      >
        <button
          ref={profileTrigger}
          type="button"
          onClick={() => profileMenuOpen ? closeProfileMenu() : setProfileMenuOpen(true)}
          aria-label={`Account menu for ${currentUser.name}`}
          aria-expanded={profileMenuOpen}
          aria-controls="sidebar-profile-menu"
          className={`${navFocusClass} flex min-h-11 w-full items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1.5 text-left shadow-xs hover:border-[var(--border-default)] ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
          title="Account menu"
        >
          {renderAvatar()}
          {renderIdentity(isCollapsed ? 'md:sr-only' : '')}
          <ChevronsUpDown className={`size-3.5 shrink-0 text-[var(--text-secondary)] ${isCollapsed ? 'md:hidden' : ''}`} aria-hidden="true" />
        </button>

        {profileMenuOpen && (
          <div
            id="sidebar-profile-menu"
            aria-label="Account menu"
            className={`absolute bottom-full left-2.5 z-30 mb-1 max-h-[65dvh] overflow-y-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-lg ${isCollapsed ? 'right-2.5 md:right-auto md:w-56' : 'right-2.5'}`}
          >
            <div className="flex items-center gap-2.5 border-b border-[var(--border-subtle)] px-3 py-3">
              {renderAvatar()}
              {renderIdentity()}
            </div>
            <div className="space-y-0.5 p-1.5">
              <button type="button" className={profileActionClass} onClick={() => goTo('09_tenant_settings')}>
                <Settings className="size-4 shrink-0" aria-hidden="true" />Settings
              </button>
              <button type="button" className={profileActionClass} aria-expanded={profileInfo === 'support'} onClick={() => setProfileInfo(profileInfo === 'support' ? null : 'support')}>
                <LifeBuoy className="size-4 shrink-0" aria-hidden="true" />Help &amp; Support
              </button>
              {profileInfo === 'support' && <p className="px-2 pb-2 text-xs leading-4 text-[var(--text-secondary)]">Contact your workspace administrator for help with access or settings.</p>}
              <button type="button" className={profileActionClass} aria-expanded={profileInfo === 'feedback'} onClick={() => setProfileInfo(profileInfo === 'feedback' ? null : 'feedback')}>
                <MessageSquare className="size-4 shrink-0" aria-hidden="true" />Feedback
              </button>
              {profileInfo === 'feedback' && <p className="px-2 pb-2 text-xs leading-4 text-[var(--text-secondary)]">Feedback submission is unavailable in this workspace.</p>}
              <button type="button" className={profileActionClass} role="switch" aria-checked={darkMode} aria-label="Appearance: dark mode" onClick={() => setDarkMode((enabled) => !enabled)}>
                <Moon className="size-4 shrink-0" aria-hidden="true" />
                <span className="flex-1">Appearance</span>
                <span aria-hidden="true" className={`relative h-4 w-7 shrink-0 rounded-full ${darkMode ? 'bg-[var(--action-primary)]' : 'bg-[var(--border-strong)]'}`}>
                  <span className={`absolute top-0.5 left-0.5 size-3 rounded-full bg-white motion-safe:transition-transform ${darkMode ? 'translate-x-3' : ''}`} />
                </span>
              </button>
              <details>
                <summary className={`${profileActionClass} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
                  <Users className="size-4 shrink-0" aria-hidden="true" /><span className="flex-1">Switch role</span><ChevronDown className="size-3 shrink-0" aria-hidden="true" />
                </summary>
                <div className="space-y-0.5 pl-5">
                  {roles.map((role) => <button key={role.role} type="button" onClick={() => switchRole(role.role)} aria-pressed={role.role === currentRole} className={`${profileActionClass} aria-pressed:bg-[var(--bg-subtle)] aria-pressed:text-[var(--action-primary)]`}>{role.label}</button>)}
                </div>
              </details>
            </div>
            <div className="border-t border-[var(--border-subtle)] p-1.5">
              <button type="button" className={profileActionClass} onClick={() => goTo('01_login')}>
                <LogOut className="size-4 shrink-0" aria-hidden="true" />Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  </>;
};
