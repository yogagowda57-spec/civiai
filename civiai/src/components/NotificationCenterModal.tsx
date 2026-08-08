import React, { useState, useEffect } from 'react';
import { X, Bell, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/notifications')
        .then(res => res.json())
        .then(data => setNotifications(data.notifications || []))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl relative text-slate-900 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">Notifications & Deadline Alerts</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div key={n.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-700">{n.title}</span>
                <span className="text-[10px] text-slate-400">{n.timestamp}</span>
              </div>
              <p className="text-slate-700">{n.message}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
