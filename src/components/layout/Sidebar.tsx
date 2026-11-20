import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenId, UserRole } from '../../types';
import tulaLogo from '../../assets/Tula Carbon Dot Grid Logo.png';
import {
  House,
  ChartNoAxesCombined,
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
  initiallyOpen?: boolean;
}

const mainGroups: NavGroup[] = [
  {
    label: 'Activity data',
    icon: TableProperties,
    screens: ['11_entry_form', '16_attach_evidence', '23_submission_queue'],
    initiallyOpen: true,
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
    screens: ['21_drill_down', '36_scenario_builder', '37_benchmarking', '27_report_builder', '28_report_preview'],
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
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [groupOverrides, setGroupOverrides] = useState<Record<string, { open: boolean; screen: ScreenId }>>({});

  const pendingReviews = records.filter((record) => record.status === 'Submitted').length;
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
    setRoleMenuOpen(false);
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
      { id: '37_benchmarking', label: 'Benchmarks', icon: Target },
      { id: '28_report_preview', label: 'Report disclosures', icon: FileText },
      { id: '04_org_profile', label: 'Organisation profile', icon: Building2 },
      { id: '05_sites', label: 'Facilities', icon: MapPin },
      { id: '06_periods', label: 'Reporting periods', icon: Calendar },
      { id: '34_reviewer_notification', label: 'Notifications', icon: Bell, badge: unreadNotifications || undefined },
    ];
  } else if (currentRole === 'DATA_ENTRY') {
    availableItems = [
      { id: '10_activity_dashboard', label: 'Overview', icon: House },
      { id: '11_entry_form', label: 'Activity data', icon: TableProperties },
      { id: '16_attach_evidence', label: 'Evidence & documents', icon: Files },
      { id: '23_submission_queue', label: 'My submissions', icon: Inbox },
      { id: '22_factors_reference', label: 'Emission factors', icon: Zap },
      { id: '34_reviewer_notification', label: 'Notifications', icon: Bell, badge: unreadNotifications || undefined },
    ];
  } else if (currentRole === 'REVIEWER') {
    availableItems = [
      { id: '10_activity_dashboard', label: 'Overview', icon: House },
      { id: '24_review_approve', label: 'Review & approvals', icon: CheckCircle2, badge: pendingReviews || undefined },
      { id: '23_submission_queue', label: 'Submission queue', icon: Inbox },
      { id: '19_run_calculation', label: 'Run calculations', icon: Play },
      { id: '20_results_summary', label: 'Calculation ledger', icon: Calculator },
      { id: '21_drill_down', label: 'Results analysis', icon: Eye },
      { id: '22_factors_reference', label: 'Emission factors', icon: Zap },
      { id: '25_approval_history', label: 'Approval history', icon: History },
      { id: '33_raise_query', label: 'Verifier queries', icon: HelpCircle, badge: openQueries || undefined },
      { id: '35_audit_trail', label: 'Audit trail', icon: History },
      { id: '36_scenario_builder', label: 'Scenarios', icon: SlidersHorizontal },
      { id: '37_benchmarking', label: 'Benchmarks', icon: Target },
      { id: '27_report_builder', label: 'Reports & exports', icon: FileText },
      { id: '34_reviewer_notification', label: 'Notifications', icon: Bell, badge: unreadNotifications || undefined },
      { id: '09_tenant_settings', label: 'Settings', icon: Settings },
    ];
  } else {
    availableItems = [
      { id: '10_activity_dashboard', label: 'Overview', icon: House },
      { id: '11_entry_form', label: 'Activity data', icon: TableProperties },
      { id: '16_attach_evidence', label: 'Evidence & documents', icon: Files },
      { id: '19_run_calculation', label: 'Run calculations', icon: Play },
      { id: '20_results_summary', label: 'Calculation ledger', icon: Calculator },
      { id: '21_drill_down', label: 'Results analysis', icon: Eye },
      { id: '22_factors_reference', label: 'Emission factors', icon: Zap },
      { id: '24_review_approve', label: 'Review & approvals', icon: CheckCircle2, badge: pendingReviews || undefined },
      { id: '23_submission_queue', label: 'Submission queue', icon: Inbox },
      { id: '26_period_lock', label: 'Period close', icon: Calendar },
      { id: '31_verifier_dashboard', label: 'Verifier workspace', icon: ShieldCheck, badge: openQueries || undefined },
      { id: '35_audit_trail', label: 'Audit trail', icon: History },
      { id: '36_scenario_builder', label: 'Scenarios', icon: SlidersHorizontal },
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
    navigateToScreen(screen);
    setIsMobileMenuOpen(false);
  };

  const overviewScreen = currentRole === 'VERIFIER' ? '31_verifier_dashboard' : '10_activity_dashboard';
  const home = availableItems.find((item) => item.id === overviewScreen);
  const groupedScreens = new Set([...mainGroups, workspaceGroup].flatMap((group) => group.screens));
  const settings = availableItems.find((item) => item.id === '09_tenant_settings');
  const workspaceItems = availableItems.filter((item) => item !== home && item !== settings && !groupedScreens.has(item.id));

  function renderItem(item: NavItem, nested = false) {
    const Icon = item.icon;
    const active = currentScreen === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => goTo(item.id)}
        aria-current={active ? 'page' : undefined}
        title={isCollapsed ? item.label : undefined}
        className={`${navFocusClass} flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[13px] ${nested ? 'min-h-7' : 'min-h-8'} ${isCollapsed ? 'md:justify-center' : ''} ${active ? 'bg-[var(--bg-surface)] font-semibold text-[var(--text-primary)] shadow-xs' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'}`}
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
      : override?.open ?? group.initiallyOpen ?? false;
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
      className={`fixed inset-y-0 left-0 z-50 flex w-56 max-w-[86vw] shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-subtle)]/80 shadow-xl backdrop-blur-xl md:visible md:relative md:inset-auto md:z-20 md:h-full md:min-h-0 md:max-w-none md:translate-x-0 md:shadow-none motion-safe:transition-[width,transform,visibility] motion-safe:duration-200 ${isMobileMenuOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'} ${isCollapsed ? 'md:w-14' : 'md:w-48 lg:w-52'}`}
    >
      <div className={`flex items-center justify-between gap-2 px-3 pt-3 pb-2 ${isCollapsed ? 'md:justify-center' : ''}`}>
        <img src={tulaLogo} alt="Tula Carbon" className={`h-6 w-auto max-w-28 object-contain object-left ${isCollapsed ? 'md:hidden' : ''}`} />
        <button type="button" onClick={() => setIsCollapsed((collapsed) => !collapsed)} className={`${navFocusClass} hidden size-7 shrink-0 place-items-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] md:grid`} aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
        <button type="button" onClick={() => setIsMobileMenuOpen(false)} className={`${navFocusClass} grid size-8 place-items-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] md:hidden`} aria-label="Close navigation"><X className="size-4" /></button>
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-2.5 py-2">
        <section aria-labelledby="sidebar-main-heading">
          <h2 id="sidebar-main-heading" className={`mb-1.5 px-2 text-[10px] font-medium tracking-wide text-[var(--text-secondary)] uppercase ${isCollapsed ? 'md:sr-only' : ''}`}>Main menu</h2>
          <div className="space-y-0.5">
            {home && renderItem(home)}
            {mainGroups.map(renderGroup)}
            {settings && renderItem(settings)}
          </div>
        </section>
        <section aria-labelledby="sidebar-workspace-heading">
          <h2 id="sidebar-workspace-heading" className={`mb-1.5 px-2 text-[10px] font-medium tracking-wide text-[var(--text-secondary)] uppercase ${isCollapsed ? 'md:sr-only' : ''}`}>Workspace</h2>
          <div className="space-y-0.5">
            {renderGroup(workspaceGroup)}
            {workspaceItems.map((item) => renderItem(item))}
          </div>
        </section>
      </nav>

      <div className="relative border-t border-[var(--border-subtle)] px-2.5 py-2">
        {roleMenuOpen && <div className={`absolute bottom-full z-10 mb-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] p-1.5 shadow-md ${isCollapsed ? 'right-2.5 left-2.5 md:right-auto md:w-40' : 'right-2.5 left-2.5'}`}>
          {roles.map((role) => <button key={role.role} type="button" onClick={() => switchRole(role.role)} className={`${navFocusClass} w-full rounded-md px-2 py-1.5 text-left text-xs ${role.role === currentRole ? 'bg-[var(--bg-subtle)] font-semibold text-[var(--action-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-canvas)]'}`}>{role.label}</button>)}
        </div>}
        <button type="button" onClick={() => setRoleMenuOpen((open) => !open)} aria-expanded={roleMenuOpen} className={`${navFocusClass} flex w-full items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1.5 text-left hover:border-[var(--border-default)] ${isCollapsed ? 'md:justify-center md:px-0' : ''}`} title={currentUser.name}>
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--bg-subtle)] text-[10px] font-semibold text-[var(--action-primary)]" aria-hidden="true">{currentUser.avatarInitials}</span>
          <span className={`min-w-0 flex-1 ${isCollapsed ? 'md:sr-only' : ''}`}><span className="block truncate text-xs font-semibold text-[var(--text-primary)]">{currentUser.name}</span><span className="block truncate text-[10px] text-[var(--text-secondary)]">{roles.find((role) => role.role === currentRole)?.label}</span></span>
          <ChevronDown className={`size-3 shrink-0 text-[var(--text-secondary)] transition-transform ${roleMenuOpen ? 'rotate-180' : ''} ${isCollapsed ? 'md:hidden' : ''}`} aria-hidden="true" />
        </button>
        <div className="mt-2 grid gap-0.5">
          {[
            { label: 'Support', icon: LifeBuoy },
            { label: 'Feedback', icon: MessageSquare },
          ].map(({ label, icon: Icon }) => (
            <button key={label} type="button" disabled title={`${label} is not configured`} className={`flex min-h-7 w-full items-center gap-2 rounded-md px-2 text-xs text-[var(--text-secondary)] ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}>
              <Icon className="size-3.5 shrink-0" aria-hidden="true" /><span className={isCollapsed ? 'md:sr-only' : ''}>{label}</span>
            </button>
          ))}
          {[
            { screen: '09_tenant_settings' as const, label: 'Settings', icon: Settings },
            { screen: '01_login' as const, label: 'Sign out', icon: LogOut },
          ].filter((action) => action.screen !== settings?.id).map(({ screen, label, icon: Icon }) => (
            <button key={screen} type="button" onClick={() => goTo(screen)} title={label} className={`${navFocusClass} flex min-h-7 items-center gap-1.5 rounded-md px-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] ${isCollapsed ? 'md:w-full md:justify-center md:px-0' : ''}`}>
              <Icon className="size-3.5 shrink-0" aria-hidden="true" /><span className={isCollapsed ? 'md:sr-only' : ''}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  </>;
};
