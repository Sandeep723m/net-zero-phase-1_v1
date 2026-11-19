import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Building2,
  Calendar,
  Zap,
} from 'lucide-react';

export const Screen30_VerifierLogin: React.FC = () => {
  const { setCurrentUser, navigateToScreen, showToast, addAuditLog } = useApp();

  const [email, setEmail] = useState('audit@sgs-vvb.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  // Scoped authorization profile
  const verifierScope = {
    vvbFirm: 'SGS India Pvt Ltd',
    tenant: 'Zenith Energy Services',
    sites: ['Chennai Plant 1', 'Pune Warehouse'],
    period: 'FY 2025–26',
    permissions: 'Read-only assurance & queries',
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Switch user session to VERIFIER role with scoped access
      setCurrentUser({
        id: 'usr-vvb-01',
        name: 'Dr. V. Raman',
        email: email,
        role: 'VERIFIER',
        siteScope: ['site-chennai-1', 'site-pune-2'],
        status: 'Active',
        avatarInitials: 'VR',
      });

      addAuditLog({
        userName: 'Dr. V. Raman',
        role: 'VERIFIER',
        action: 'Verifier Portal Authenticated',
        previousValue: 'Session: None',
        newValue: `Scoped Access Granted: ${verifierScope.tenant} (${verifierScope.period})`,
        source: 'https://verify.tulacarbon.io/login',
        reason: 'ISO 14064-3 GHG Inventory Independent Assurance',
        status: 'Active Session',
        lineItemId: 'AUTH-VVB-901',
      });

      setIsLoading(false);
      showToast('Verifier Access Granted', 'Logged in to Scoped Verifier Portal.');
      navigateToScreen('31_verifier_dashboard', 'FLOW_F');
    }, 450);
  };

  return (
    <div id="screen-30-container" className="w-full max-w-md flex flex-col justify-center py-8 px-4 space-y-6 font-sans">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--action-primary)]/10 border border-[var(--action-primary)]/20 text-[var(--text-primary)] mb-1">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
          Verifier Portal
        </h1>
      </div>

      {/* Scoped Authorization Summary */}
      <div className="p-4 bg-white border border-[var(--border-default)] rounded-2xl shadow-xs space-y-3">
        <div className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center justify-between">
          <span>Assigned Scope</span>
          <span className="text-[11px] font-semibold text-[var(--status-success)]">Read-Only</span>
        </div>
        <div className="space-y-1.5 text-xs text-[var(--text-primary)] border-t border-[var(--border-subtle)] pt-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)] flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              <span>Client</span>
            </span>
            <span className="font-semibold">{verifierScope.tenant}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)] flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              <span>Reporting Period</span>
            </span>
            <span className="font-semibold">{verifierScope.period}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[var(--text-secondary)]">Assigned Sites</span>
            <span className="text-[var(--text-primary)] font-medium">Chennai Plant 1, Pune Warehouse</span>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSignIn} className="p-6 bg-white border border-[var(--border-default)] rounded-2xl shadow-xs space-y-4">
        <div>
          <label htmlFor="verifier-email-input" className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
            Verifier Email
          </label>
          <input
            id="verifier-email-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@vvb-firm.com"
            className="w-full px-3 py-2.5 text-xs border border-[var(--border-default)] rounded-xl focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--border-focus)] focus:outline-none bg-white text-[var(--text-primary)]"
          />
        </div>

        <div>
          <label htmlFor="verifier-password-input" className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
            Password / Token Key
          </label>
          <input
            id="verifier-password-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 text-xs border border-[var(--border-default)] rounded-xl focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--border-focus)] focus:outline-none bg-white text-[var(--text-primary)]"
          />
        </div>

        <button
          id="btn-verifier-signin"
          type="submit"
          disabled={isLoading}
          className="w-full h-10 enterprise-btn-primary text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{isLoading ? 'Authenticating Scope…' : 'Sign In as Verifier'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Quick Test / Return Links */}
      <div className="flex items-center justify-between text-xs pt-1">
        <button
          type="button"
          onClick={() => {
            setEmail('audit@sgs-vvb.com');
            setPassword('••••••••••••');
            showToast('Credentials Populated', 'SGS India Lead Auditor credentials ready.');
          }}
          className="text-[var(--action-primary)] hover:underline font-semibold flex items-center space-x-1"
        >
          <Zap className="w-3.5 h-3.5 text-[var(--text-primary)]" />
          <span>Autofill VVB Credentials</span>
        </button>

        <button
          type="button"
          onClick={() => navigateToScreen('10_activity_dashboard', 'FLOW_B')}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
