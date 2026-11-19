import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export interface KpiCardProps {
  label?: string;
  title?: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  subtitle?: string;
  trend?: string | {
    value: string;
    isPositive?: boolean;
    comparison?: string;
  };
  change?: string;
  statusDot?: 'success' | 'warning' | 'error' | 'brand' | 'neutral';
  icon?: React.ReactNode;
  iconVariant?: 'purple' | 'coral' | 'blue' | 'emerald';
  badge?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  title,
  value,
  unit,
  subtext,
  subtitle,
  trend,
  change,
  icon,
  iconVariant = 'purple',
  badge,
  className = '',
  onClick,
}) => {
  const displayLabel = label || title || '';
  const displaySubtext = subtext || subtitle || '';

  const getSquircleStyle = () => {
    switch (iconVariant) {
      case 'coral':
        return 'icon-squircle-coral text-[var(--status-warning)]';
      case 'blue':
        return 'icon-squircle-blue text-[#2D63D2]';
      case 'emerald':
        return 'icon-squircle-emerald text-[var(--status-success)]';
      case 'purple':
      default:
        return 'icon-squircle-purple text-[var(--action-primary)]';
    }
  };

  const renderTrendIndicator = () => {
    if (change) {
      const isPositive = change.startsWith('+') || change.includes('up');
      const isNegative = change.startsWith('-') || change.includes('down');
      const isLink = change.includes('→');

      if (isLink) {
        return (
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[var(--action-primary)] group-hover:underline">
            <span>{change}</span>
          </span>
        );
      }

      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            isPositive
              ? 'text-[var(--status-success)] bg-[var(--status-success-bg)] border border-[#147A5A]/20'
              : isNegative
              ? 'text-[var(--status-error)] bg-[var(--status-error-bg)] border border-[#C63C46]/20'
              : 'text-[var(--text-secondary)] bg-[var(--bg-subtle)]'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3 shrink-0" aria-hidden="true" />
          ) : isNegative ? (
            <TrendingDown className="w-3 h-3 shrink-0" aria-hidden="true" />
          ) : null}
          <span>{change}</span>
        </span>
      );
    }

    if (typeof trend === 'object' && trend !== null) {
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              trend.isPositive
                ? 'text-[var(--status-success)] bg-[var(--status-success-bg)] border border-[#147A5A]/20'
                : 'text-[var(--status-error)] bg-[var(--status-error-bg)] border border-[#C63C46]/20'
            }`}
          >
            {trend.isPositive ? (
              <TrendingDown className="w-3 h-3 shrink-0" aria-hidden="true" />
            ) : (
              <TrendingUp className="w-3 h-3 shrink-0" aria-hidden="true" />
            )}
            <span>{trend.value}</span>
          </span>
          {trend.comparison && (
            <span className="text-[11px] text-[var(--text-tertiary)] truncate">{trend.comparison}</span>
          )}
        </div>
      );
    }

    if (typeof trend === 'string') {
      if (trend === 'up') {
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--status-success)] bg-[var(--status-success-bg)] px-2 py-0.5 rounded-full border border-[#147A5A]/20">
            <TrendingUp className="w-3 h-3" aria-hidden="true" />
            <span>Positive</span>
          </span>
        );
      }
      if (trend === 'down') {
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--status-error)] bg-[var(--status-error-bg)] px-2 py-0.5 rounded-full border border-[#C63C46]/20">
            <TrendingDown className="w-3 h-3" aria-hidden="true" />
            <span>Variance</span>
          </span>
        );
      }
    }

    return null;
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`group glass-card p-4 sm:p-5 flex flex-col justify-between h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--action-primary)]/30 focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:outline-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Top Header: Label & Squircle Icon */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider font-sans truncate">
          {displayLabel}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {badge}
          {icon && (
            <div className={`w-9 h-9 ${getSquircleStyle()} flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs`}>
              {icon}
            </div>
          )}
          {onClick && !icon && !badge && (
            <div className="w-8 h-8 rounded-xl bg-white/80 border border-[var(--border-default)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:text-[var(--action-primary)] group-hover:border-[var(--action-primary)]/30 transition-all">
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* Middle: Prominent Value with Unit */}
      <div className="my-auto py-1">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-sans tracking-tight leading-none">
            {value}
          </span>
          {unit && (
            <span className="text-xs sm:text-sm font-semibold text-[var(--text-tertiary)] font-mono">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Bottom: Subtext & Trend Alignment */}
      {(displaySubtext || trend || change) && (
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mt-2.5 pt-2.5 border-t border-[var(--border-default)]/60 gap-2">
          {displaySubtext && (
            <span className="truncate text-xs text-[var(--text-tertiary)]" title={displaySubtext}>
              {displaySubtext}
            </span>
          )}
          <div className="shrink-0 ml-auto">{renderTrendIndicator()}</div>
        </div>
      )}
    </div>
  );
};
