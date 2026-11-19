import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScreenId, UserRole } from '../../types';
import tulaLogo from '../../assets/Tula Carbon Dot Grid Logo.png';
import {
  LayoutDashboard,
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

interface NavSection {
  title: string;
  items: NavItem[];
}

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

  let sections: NavSection[];
  if (currentRole === 'VERIFIER') {
    sections = [
      { title: 'Main', items: [
        { id: '31_verifier_dashboard', label: 'Overview', icon: LayoutDashboard, badge: openQueries || undefined },
        { id: '32_evidence_trace', label: 'Evidence trace', icon: Files },
        { id: '33_raise_query', label: 'Assurance queries', icon: HelpCircle },
        { id: '35_audit_trail', label: 'Audit trail', icon: History },
      ] },
      { title: 'Workspace', items: [
        { id: '22_factors_reference', label: 'Emission factors', icon: Zap },
        { id: '37_benchmarking', label: 'Benchmarks', icon: Target },
        { id: '28_report_preview', label: 'Report disclosures', icon: FileText },
      ] },
      { title: 'Support', items: [
        { id: '04_org_profile', label: 'Organisation profile', icon: Building2 },
        { id: '05_sites', label: 'Facilities', icon: MapPin },
        { id: '06_periods', label: 'Reporting periods', icon: Calendar },
        { id: '34_reviewer_notification', label: 'Notifications', icon: Bell, badge: unreadNotifications || undefined },
      ] },
    ];
  } else if (currentRole === 'DATA_ENTRY') {
    sections = [
      { title: 'Main', items: [
        { id: '10_activity_dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: '11_entry_form', label: 'Activity data', icon: TableProperties },
        { id: '16_attach_evidence', label: 'Evidence & documents', icon: Files },
      ] },
      { title: 'Workspace', items: [
        { id: '23_submission_queue', label: 'My submissions', icon: Inbox },
        { id: '22_factors_reference', label: 'Emission factors', icon: Zap },
      ] },
      { title: 'Support', items: [
        { id: '34_reviewer_notification', label: 'Notifications', icon: Bell, badge: unreadNotifications || undefined },
      ] },
    ];
  } else if (currentRole === 'REVIEWER') {
    sections = [
      { title: 'Main', items: [
        { id: '10_activity_dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: '24_review_approve', label: 'Review & approvals', icon: CheckCircle2, badge: pendingReviews || undefined },
        { id: '23_submission_queue', label: 'Submission queue', icon: Inbox },
      ] },
      { title: 'Workspace', items: [
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
      ] },
      { title: 'Support', items: [
        { id: '34_reviewer_notification', label: 'Notifications', icon: Bell, badge: unreadNotifications || undefined },
        { id: '09_tenant_settings', label: 'Settings', icon: Settings },
      ] },
    ];
  } else {
    sections = [
      { title: 'Main', items: [
        { id: '10_activity_dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: '11_entry_form', label: 'Activity data', icon: TableProperties },
        { id: '16_attach_evidence', label: 'Evidence & documents', icon: Files },
      ] },
      { title: 'Workspace', items: [
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
      ] },
      { title: 'Support', items: [
        { id: '34_reviewer_notification', label: 'Notifications', icon: Bell, badge: unreadNotifications || undefined },
        { id: '04_org_profile', label: 'Organisation profile', icon: Building2 },
        { id: '05_sites', label: 'Facilities', icon: MapPin },
        { id: '06_periods', label: 'Reporting periods', icon: Calendar },
        { id: '07_emission_sources', label: 'Emission sources', icon: Zap },
        { id: '08_users_roles', label: 'Users & roles', icon: Users },
        { id: '09_tenant_settings', label: 'Settings', icon: Settings },
      ] },
    ];
  }

  const goTo = (screen: ScreenId) => {
    navigateToScreen(screen);
    setIsMobileMenuOpen(false);
  };

  const sidebarContent = (
    <>
      <div className={`px-3.5 pt-3.5 pb-3 bg-transparent ${isCollapsed ? 'md:px-2' : ''}`}>
        <div className={`flex items-center gap-2 ${isCollapsed ? 'md:justify-center' : 'justify-between'}`}>
          <img src={tulaLogo} alt="Tula Carbon" className={`h-8 w-auto max-w-[168px] object-contain object-left ${isCollapsed ? 'md:hidden' : ''}`} />
          <button type="button" onClick={() => setIsCollapsed((collapsed) => !collapsed)} className="hidden md:inline-flex p-1.5 text-[#555] hover:bg-white/70 rounded-md" aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
          <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] rounded-md" aria-label="Close navigation"><X className="w-4 h-4" /></button>
        </div>
      </div>

      <nav aria-label="Main navigation" className={`flex-1 overflow-y-auto py-3 space-y-5 overscroll-contain px-3 ${isCollapsed ? 'md:px-2' : ''}`}>
        {sections.map((section, sectionIndex) => <section key={`${section.title}-${sectionIndex}`} className={sectionIndex ? 'pt-1' : ''}>
          <h2 className={`px-2 mb-1.5 text-xs font-semibold text-[#393939] ${isCollapsed ? 'md:sr-only' : ''}`}>{section.title}</h2>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = currentScreen === item.id;
              return <button key={item.id} type="button" onClick={() => goTo(item.id)} aria-current={active ? 'page' : undefined} title={isCollapsed ? item.label : undefined} className={`w-full min-h-9 flex items-center gap-2.5 ${isCollapsed ? 'md:justify-center md:px-2' : 'px-2.5'} py-1.5 text-left rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ${active ? 'bg-white text-[#252525] font-medium shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'text-[#4e4e4e] hover:text-[#222] hover:bg-white/70'}`}>
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#333]' : 'text-[#555]'}`} aria-hidden="true" />
                <span className={`flex-1 min-w-0 text-sm truncate ${isCollapsed ? 'md:hidden' : ''}`}>{item.label}</span>
                {item.badge !== undefined && <span className={`min-w-5 px-1.5 py-0.5 rounded-full text-[10px] text-center font-semibold ${isCollapsed ? 'md:hidden' : ''} ${active ? 'bg-white/20 text-white' : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'}`}>{item.badge}</span>}
              </button>;
            })}
          </div>
        </section>)}
      </nav>

      <div className={`relative p-4 border-t border-[#e5e5e5] bg-transparent ${isCollapsed ? 'md:px-2' : ''}`}>
        {roleMenuOpen && <div className={`absolute bottom-full mb-2 bg-white border border-[var(--border-default)] rounded-lg shadow-lg p-1.5 ${isCollapsed ? 'md:left-2 md:right-auto md:w-48 left-3 right-3' : 'left-3 right-3'}`}>
          {roles.map((role) => <button key={role.role} type="button" onClick={() => switchRole(role.role)} className={`w-full text-left px-2.5 py-2 rounded-md text-xs ${role.role === currentRole ? 'bg-[var(--brand-50)] text-[var(--action-primary)] font-semibold' : 'text-[var(--text-primary)] hover:bg-[var(--bg-canvas)]'}`}>{role.label}</button>)}
        </div>}
        <button type="button" onClick={() => setRoleMenuOpen((open) => !open)} aria-expanded={roleMenuOpen} className={`w-full flex items-center gap-2.5 py-2 mb-2 text-left ${isCollapsed ? 'md:justify-center md:px-1 px-1' : 'px-1'}`} title={isCollapsed ? `${currentUser.name} · ${roles.find((role) => role.role === currentRole)?.label}` : undefined}>
          <span className="w-9 h-9 rounded-full bg-[var(--brand-50)] text-[var(--action-primary)] flex items-center justify-center text-xs font-semibold shrink-0">{currentUser.avatarInitials}</span>
          <span className={`min-w-0 flex-1 ${isCollapsed ? 'md:hidden' : ''}`}><span className="block text-xs font-semibold text-[var(--text-primary)] truncate">{currentUser.name}</span><span className="block mt-0.5 text-[10px] text-[var(--text-secondary)] truncate">{roles.find((role) => role.role === currentRole)?.label}</span></span>
          <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${roleMenuOpen ? 'rotate-180' : ''} ${isCollapsed ? 'md:hidden' : ''}`} />
        </button>
        <div className={`grid gap-2 ${isCollapsed ? 'grid-cols-2 md:grid-cols-1' : 'grid-cols-2'}`}>
          <button type="button" onClick={() => goTo('09_tenant_settings')} aria-label="Settings" title={isCollapsed ? 'Settings' : undefined} className={`flex items-center justify-center gap-2 px-2 py-2 text-xs text-[var(--text-secondary)] border border-[var(--border-default)] rounded-md hover:bg-[var(--bg-canvas)] hover:text-[var(--text-primary)]`}><Settings className="w-3.5 h-3.5" /><span className={isCollapsed ? 'md:hidden' : ''}>Settings</span></button>
          <button type="button" onClick={() => goTo('01_login')} aria-label="Sign out" title={isCollapsed ? 'Sign out' : undefined} className="flex items-center justify-center gap-2 px-2 py-2 text-xs text-[var(--text-secondary)] border border-[var(--border-default)] rounded-md hover:bg-[var(--bg-canvas)] hover:text-[var(--text-primary)]"><LogOut className="w-3.5 h-3.5" /><span className={isCollapsed ? 'md:hidden' : ''}>Sign out</span></button>
        </div>
      </div>
    </>
  );

  return <>
    <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="md:hidden fixed top-3 left-3 z-30 w-10 h-10 flex items-center justify-center bg-white border border-[var(--border-default)] rounded-md shadow-sm text-[var(--text-primary)]" aria-label="Open navigation">
      <Menu className="w-5 h-5" />
    </button>
    {isMobileMenuOpen && <button type="button" aria-label="Close navigation backdrop" onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />}
    <aside id="mobile-app-sidebar" className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[86vw] flex-col border-r border-[#e2e2e2] bg-[#f3f3f3] shadow-xl transition-transform duration-200 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>{sidebarContent}</aside>
    <aside id="app-sidebar" className={`hidden md:flex ${isCollapsed ? 'md:w-[72px] lg:w-[72px]' : 'md:w-60 lg:w-64'} shrink-0 sticky top-0 h-full min-h-0 z-20 flex-col border-r border-[#e2e2e2] bg-[#f3f3f3] transition-[width] duration-200`}>{sidebarContent}</aside>
  </>;
};
