import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Shield, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import tulaLogo from '../../../assets/Tula Carbon Dot Grid Logo.png';
import { UserRole } from '../../../types';

export const Screen01_Login: React.FC = () => {
  const { navigateToScreen, showToast, setCurrentRole, setCurrentUser } = useApp();
  const [email, setEmail] = useState('j.rao@zenith.in');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Authentication Verified', 'Proceed to verification challenge.');
      navigateToScreen('02_mfa', 'FLOW_A');
    }, 450);
  };

  const handleSSO = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Enterprise SSO Authenticated', 'Proceed to verification challenge.');
      navigateToScreen('02_mfa', 'FLOW_A');
    }, 400);
  };

  const handleQuickLoginAs = (role: UserRole, userEmail: string, userName: string) => {
    setCurrentRole(role);
    setCurrentUser({
      id: `usr-${role.toLowerCase()}`,
      name: userName,
      email: userEmail,
      role: role,
      siteScope: ['site-chennai-1', 'site-pune-2'],
      status: 'Active',
      avatarInitials: userName.split(' ').map(n => n[0]).join('').slice(0, 2),
    });
    setEmail(userEmail);
    if (role === 'VERIFIER') {
      navigateToScreen('30_verifier_login', 'FLOW_F');
    } else {
      navigateToScreen('03_tenant_selector', 'FLOW_A');
    }
  };

  return (
    <div id="screen-01-login" className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white border border-[var(--border-default)] rounded-2xl shadow-sm font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-[var(--border-subtle)]">
        <img
          src={tulaLogo}
          alt="Tula Carbon"
          className="h-12 sm:h-14 w-auto max-w-[220px] object-contain"
        />
        <span className="text-[11px] font-semibold text-[var(--status-success)] flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)]"></span>
          <span>Online</span>
        </span>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Sign In</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-xs border border-[var(--border-default)] rounded-xl focus:outline-none focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--border-focus)] bg-white text-[var(--text-primary)]"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="text-xs font-semibold text-[var(--text-primary)]">
              Password
            </label>
            <button
              type="button"
              onClick={() => showToast('Password Reset', 'Reset link dispatched to registered email.')}
              className="text-[11px] text-[var(--action-primary)] hover:underline font-semibold"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[var(--text-tertiary)] absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-xs border border-[var(--border-default)] rounded-xl focus:outline-none focus:border-[var(--action-primary)] focus:ring-1 focus:ring-[var(--border-focus)] bg-white text-[var(--text-primary)]"
              placeholder="••••••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="enterprise-btn-primary w-full h-10 text-xs font-semibold flex items-center justify-center space-x-2 rounded-xl"
        >
          <span>{loading ? 'Authenticating…' : 'Sign In'}</span>
          {!loading && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border-default)]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[var(--text-tertiary)] text-[11px] font-medium">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSSO}
        disabled={loading}
        className="enterprise-btn-secondary w-full h-10 text-xs font-semibold flex items-center justify-center space-x-2 rounded-xl"
      >
        <Shield className="w-4 h-4 text-[var(--text-primary)]" />
        <span>Continue with Enterprise SSO (Okta / SAML)</span>
      </button>

      {/* Quick Role Select for UX / DX / AX Testing */}
      <div className="mt-6 pt-5 border-t border-[var(--border-subtle)]">
        <div className="text-[11px] font-semibold text-[var(--text-secondary)] mb-2 flex items-center space-x-1.5">
          <UserCheck className="w-3.5 h-3.5 text-[var(--text-primary)]" />
          <span>Quick Sign In by Role</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickLoginAs('TENANT_ADMIN', 'j.rao@zenith.in', 'Jayant Rao')}
            className="p-2 border border-[var(--border-default)] hover:border-[var(--action-primary)] rounded-lg text-left hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <div className="font-semibold text-[var(--text-primary)]">Jayant Rao</div>
            <div className="text-[10px] text-[var(--text-secondary)]">Admin / Director</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoginAs('VERIFIER', 'audit@sgs-vvb.com', 'Dr. V. Raman')}
            className="p-2 border border-[var(--border-default)] hover:border-[var(--action-primary)] rounded-lg text-left hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <div className="font-semibold text-[var(--text-primary)]">Dr. V. Raman</div>
            <div className="text-[10px] text-[var(--text-secondary)]">External Verifier (VVB)</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoginAs('DATA_ENTRY', 'p.nair@zenith.in', 'P. Nair')}
            className="p-2 border border-[var(--border-default)] hover:border-[var(--action-primary)] rounded-lg text-left hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <div className="font-semibold text-[var(--text-primary)]">P. Nair</div>
            <div className="text-[10px] text-[var(--text-secondary)]">Site Operator / Data Entry</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLoginAs('REVIEWER', 's.iyer@zenith.in', 'S. Iyer')}
            className="p-2 border border-[var(--border-default)] hover:border-[var(--action-primary)] rounded-lg text-left hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <div className="font-semibold text-[var(--text-primary)]">S. Iyer</div>
            <div className="text-[10px] text-[var(--text-secondary)]">Internal Reviewer</div>
          </button>
        </div>
      </div>
    </div>
  );
};
