'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, UserCheck, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function NotificationsPage() {
  usePageMeta({
    title: 'Notifications | Roomie',
    description: 'View your notifications and accommodation updates.',
    noindex: true,
  });

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PUT' });
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markSingleRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PUT' });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#DADCE0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#202124] tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6368] mt-0.5">
            Real-time updates on contact requests, connection approvals, and listing verifications.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="px-3 py-1.5 bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#1A73E8] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-[#DADCE0] p-12 text-center text-[#5F6368] text-sm">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DADCE0] p-12 text-center space-y-3">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-bold text-[#202124]">No notifications yet</h2>
          <p className="text-xs text-[#5F6368] max-w-sm mx-auto">
            When students send contact requests or admin reviews your listings, updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                !n.isRead
                  ? 'bg-white border-[#1A73E8] shadow-xs ring-1 ring-[#1A73E8]/20'
                  : 'bg-white border-[#DADCE0] opacity-80'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#202124]">{n.title}</span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#1A73E8]" />
                  )}
                </div>
                <p className="text-xs text-[#5F6368] leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {n.link && (
                  <Link
                    href={n.link}
                    onClick={() => markSingleRead(n.id)}
                    className="px-3 py-1.5 bg-[#E8F0FE] hover:bg-[#D2E3FC] text-[#1A73E8] font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
