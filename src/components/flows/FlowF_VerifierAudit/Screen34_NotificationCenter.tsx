import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { SystemNotification, NotificationType } from '../../../types';
import {
  Bell,
  CheckCheck,
  HelpCircle,
  CheckCircle2,
  AlertOctagon,
  FileSpreadsheet,
  Lock,
  ArrowRight,
  Clock,
  Inbox,
} from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { StatusBadge } from '../../common/StatusBadge';

export const Screen34_NotificationCenter: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateToScreen,
    showToast,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'queries' | 'approvals' | 'imports'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === 'unread') return !n.isRead;
      if (activeFilter === 'queries') return n.type === 'verifier_query';
      if (activeFilter === 'approvals') return n.type === 'approval';
      if (activeFilter === 'imports') return n.type === 'import_failure' || n.type === 'import_success';
      return true;
    });
  }, [notifications, activeFilter]);

  const handleNotificationClick = (item: SystemNotification) => {
    markNotificationAsRead(item.id);
    if (item.targetScreen) {
      navigateToScreen(item.targetScreen, item.targetFlow);
      showToast('Navigated from Notification', `Opening context for: ${item.title}`);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'verifier_query':
        return (
          <div className="w-8 h-8 rounded-lg bg-[var(--action-primary)]/10 text-[var(--action-primary)] flex items-center justify-center shrink-0 border border-[var(--action-primary)]/20">
            <HelpCircle className="w-4 h-4" />
          </div>
        );
      case 'approval':
        return (
          <div className="w-8 h-8 rounded-lg bg-[var(--status-success-bg)] text-[var(--status-success)] flex items-center justify-center shrink-0 border border-[#147A5A]/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'import_failure':
        return (
          <div className="w-8 h-8 rounded-lg bg-[var(--status-warning-bg)] text-[var(--status-warning)] flex items-center justify-center shrink-0 border border-[var(--status-warning)]/40">
            <AlertOctagon className="w-4 h-4" />
          </div>
        );
      case 'import_success':
        return (
          <div className="w-8 h-8 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-primary)] flex items-center justify-center shrink-0 border border-[var(--border-default)]">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
        );
      case 'period_lock':
        return (
          <div className="w-8 h-8 rounded-lg bg-[var(--surface-secondary)] text-[var(--text-secondary)] flex items-center justify-center shrink-0 border border-[var(--border-default)]">
            <Lock className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-canvas)] text-[var(--text-secondary)] flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div id="screen-34-notification-center" className="w-full space-y-6">
      {/* Header & Meta */}
      <PageHeader
        breadcrumbs={[
          { label: 'Overview', onClick: () => navigateToScreen('10_activity_dashboard') },
          { label: 'Notification Center' },
        ]}
        title="Notification Center"
        badge={
          unreadCount > 0 ? (
            <StatusBadge status="Under Review" customLabel={`${unreadCount} unread`} size="sm" />
          ) : undefined
        }
        actions={
          <button
            onClick={markAllNotificationsAsRead}
            disabled={unreadCount === 0}
            className="enterprise-btn-secondary h-9 px-3 text-xs inline-flex items-center space-x-1.5 font-semibold disabled:opacity-50"
          >
            <CheckCheck className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span>Mark all as read</span>
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[var(--border-default)] pb-3 text-xs overflow-x-auto">
        {[
          { key: 'all', label: `All (${notifications.length})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'queries', label: 'Verifier Queries' },
          { key: 'approvals', label: 'Approvals' },
          { key: 'imports', label: 'Imports' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
              activeFilter === tab.key
                ? 'bg-[var(--action-primary)] text-white shadow-xs'
                : 'bg-white border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <div id="notifications-empty-state" className="bg-white border border-[var(--border-default)] rounded-2xl p-12 text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-canvas)] text-[var(--text-tertiary)] flex items-center justify-center mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">No notifications</h3>
        </div>
      ) : (
        <div className="bg-white border border-[var(--border-default)] rounded-2xl divide-y divide-[#EEEAF5] shadow-xs overflow-hidden">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 flex items-start justify-between gap-3 text-xs transition-colors cursor-pointer group ${
                !item.isRead ? 'bg-[var(--action-primary)]/5 hover:bg-[var(--action-primary)]/10' : 'bg-white hover:bg-[var(--surface-secondary)]'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                {getNotificationIcon(item.type)}

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs ${
                        !item.isRead ? 'font-bold text-[var(--text-primary)]' : 'font-medium text-[var(--text-secondary)]'
                      } group-hover:text-[var(--action-primary)] transition-colors`}
                    >
                      {item.title}
                    </span>
                    {!item.isRead && (
                      <span
                        className="w-2 h-2 rounded-full bg-[var(--action-primary)] shrink-0"
                        title="Unread notification"
                      />
                    )}
                  </div>

                  {item.description && (
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {item.entityRef && (
                    <div className="text-[11px] font-mono text-[var(--text-tertiary)] pt-0.5">
                      {item.entityRef}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0 text-right">
                <span className="text-[11px] text-[var(--text-tertiary)] whitespace-nowrap flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.relativeTime || item.timestamp}</span>
                </span>
                <span className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Navigation */}
      <div className="p-3 bg-[var(--surface-secondary)] border border-[var(--border-default)] rounded-2xl text-xs text-[var(--text-secondary)] flex items-center justify-between">
        <span>Retention: 90 Days</span>
        <button
          onClick={() => navigateToScreen('35_audit_trail', 'FLOW_F')}
          className="text-[var(--action-primary)] hover:underline font-semibold flex items-center space-x-1"
        >
          <span>View Complete Audit Trail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
