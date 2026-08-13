import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { NotificationItem } from '../components/NotificationItem';
import { BellRing, ShieldAlert, CheckSquare, Settings } from 'lucide-react';
import { Button } from '../components/Button';

export const NotificationsCenterView: React.FC = () => {
  const { notificationsList, markNotificationsRead } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const unreadCount = notificationsList.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    markNotificationsRead();
  };

  const filteredNotifs = activeTab === 'all'
    ? notificationsList
    : notificationsList.filter(n => n.unread);

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary dark:text-white flex items-center gap-2">
            <BellRing className="w-7 h-7 text-primary-light" /> Notification Center
          </h2>
          <p className="text-text-secondary text-sm mt-0.5">
            Monitor emergency absence logs and automated timetable version updates.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleMarkAllRead} leftIcon={<CheckSquare className="w-4 h-4" />}>
          Mark All as Read
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications list feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Sub tabs */}
          <div className="flex border-b border-border gap-6 text-sm font-semibold select-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 px-1 transition-colors relative focus:outline-none
                ${activeTab === 'all' ? 'text-accent-ai font-bold' : 'text-text-secondary hover:text-text-primary'}
              `}
            >
              All Notifications
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`pb-3 px-1 transition-colors relative focus:outline-none flex items-center gap-1.5
                ${activeTab === 'unread' ? 'text-accent-ai font-bold' : 'text-text-secondary hover:text-text-primary'}
              `}
            >
              Unread
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* List display */}
          <div className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            {filteredNotifs.map((notif) => (
              <NotificationItem
                key={notif.id}
                title={notif.title}
                message={notif.message}
                timestamp={notif.timestamp}
                unread={notif.unread}
                type={notif.type}
              />
            ))}

            {filteredNotifs.length === 0 && (
              <div className="py-16 text-center text-text-muted text-xs">
                🎉 All caught up! No notifications in this tab.
              </div>
            )}
          </div>
        </div>

        {/* Notifications Settings Panel */}
        <div className="space-y-6">
          <Card header={{ title: 'Alert Delivery Preferences', subtitle: 'Tune notification channels' }} className="border-l-4 border-l-info">
            <div className="space-y-4 text-xs text-text-secondary">
              <div className="flex items-center justify-between p-2.5 bg-bg-elevated/20 rounded-lg border border-border-light">
                <div>
                  <p className="font-bold text-text-primary">Email Notifications</p>
                  <p className="text-[10px] text-text-muted mt-0.5">Send daily summary timetables digests</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-accent-ai w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-bg-elevated/20 rounded-lg border border-border-light">
                <div>
                  <p className="font-bold text-text-primary">SMS & WhatsApp Alerts</p>
                  <p className="text-[10px] text-text-muted mt-0.5">Critical emergency substitution logs</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-accent-ai w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-2.5 bg-bg-elevated/20 rounded-lg border border-border-light">
                <div>
                  <p className="font-bold text-text-primary">Push Alerts</p>
                  <p className="text-[10px] text-text-muted mt-0.5">Browser popup indicators</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-accent-ai w-4 h-4" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
