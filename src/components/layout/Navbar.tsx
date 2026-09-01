'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  Home,
  Search,
  PlusCircle,
  Inbox,
  LayoutDashboard,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
  Settings,
  CheckCircle2,
  Sparkles,
  Building,
  Heart,
  FileText,
  Users,
} from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  role: string;
  roles?: string;
  isActive: boolean;
  profile?: {
    name: string;
    phone?: string;
    school: string;
    department: string;
    year: string;
    studentId?: string;
    emailVerified: boolean;
    studentVerified: boolean;
    verificationStatus: string;
    profilePhotoUrl?: string;
  };
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const fetchAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);

        if (data.user) {
          const nRes = await fetch('/api/notifications');
          if (nRes.ok) {
            const nData = await nRes.json();
            setNotifications(nData.notifications || []);
            setUnreadCount(nData.unreadCount || 0);
          }
        }
      } else {
        setUser(null);
      }
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuth();
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setShowUserMenu(false);
    router.push('/login');
    router.refresh();
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PUT' });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // handle error
    }
  };

  const isSeeker = !user?.role || user.role === 'SEEKER' || user.role === 'student';
  const isPGOwner = user?.role === 'PG_OWNER';
  const isFlatOwner = user?.role === 'FLAT_OWNER';
  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#202124]/95 backdrop-blur-md border-b border-[#DADCE0] dark:border-[#3C4043] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Vibrant Google Colors for Roomie */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-[#1A73E8] dark:bg-[#8AB4F8] text-white dark:text-[#202124] flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
              R
            </div>
            <div className="flex flex-col">
              <div className="font-black text-lg tracking-tight leading-none">
                <span className="text-[#1A73E8] dark:text-[#8AB4F8]">R</span>
                <span className="text-[#EA4335] dark:text-[#F28B82]">o</span>
                <span className="text-[#FBBC04] dark:text-[#FDD663]">o</span>
                <span className="text-[#1A73E8] dark:text-[#8AB4F8]">m</span>
                <span className="text-[#34A853] dark:text-[#81C995]">i</span>
                <span className="text-[#EA4335] dark:text-[#F28B82]">e</span>
              </div>
              <span className="text-[10px] font-bold text-[#5F6368] dark:text-[#BDC1C6] tracking-wider uppercase mt-0.5">
                MIT-ADT Pune
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (HIGH CONTRAST IN DARK MODE) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                pathname === '/'
                  ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#1E3A5F] dark:text-[#8AB4F8]'
                  : 'text-[#5F6368] hover:text-[#202124] dark:text-[#E8EAED] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#3C4043]'
              }`}
            >
              <Home className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
              <span>Home</span>
            </Link>

            <Link
              href="/find"
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                pathname === '/find'
                  ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#1E3A5F] dark:text-[#8AB4F8]'
                  : 'text-[#5F6368] hover:text-[#202124] dark:text-[#E8EAED] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#3C4043]'
              }`}
            >
              <Search className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
              <span>Find Accommodations</span>
            </Link>

            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    pathname === '/dashboard'
                      ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#1E3A5F] dark:text-[#8AB4F8]'
                      : 'text-[#5F6368] hover:text-[#202124] dark:text-[#E8EAED] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#3C4043]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/inbox"
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    pathname === '/inbox'
                      ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#1E3A5F] dark:text-[#8AB4F8]'
                      : 'text-[#5F6368] hover:text-[#202124] dark:text-[#E8EAED] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#3C4043]'
                  }`}
                >
                  <Inbox className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
                  <span>Inbox</span>
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  pathname === '/admin'
                    ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#1E3A5F] dark:text-[#8AB4F8]'
                    : 'text-[#5F6368] hover:text-[#202124] dark:text-[#E8EAED] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#3C4043]'
                }`}
              >
                <Shield className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
                <span>Admin Portal</span>
              </Link>
            )}

            <Link
              href="/demo"
              className={`px-3 py-1.5 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                pathname === '/demo'
                  ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#1E3A5F] dark:text-[#8AB4F8]'
                  : 'text-[#5F6368] hover:text-[#202124] dark:text-[#BDC1C6] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#3C4043]'
              }`}
              title="Explore Sample Demo Listings"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FBBC04]" />
              <span>Demo</span>
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Logged Out View */}
            {!loading && !user && (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs font-bold text-[#202124] dark:text-[#E8EAED] hover:bg-slate-100 dark:hover:bg-[#3C4043] rounded-2xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}

            {/* Logged In: Notifications Dropdown */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-2xl text-[#5F6368] dark:text-[#E8EAED] hover:text-[#202124] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#3C4043] transition-colors cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#1A73E8] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#202124]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#303134] rounded-3xl shadow-2xl border border-[#DADCE0] dark:border-[#3C4043] py-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 pb-2 border-b border-slate-100 dark:border-[#3C4043] flex items-center justify-between">
                      <div className="font-bold text-[#202124] dark:text-[#FFFFFF] text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
                        <span>Notifications</span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8] hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#3C4043]">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-[#5F6368] dark:text-[#BDC1C6] text-xs">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <Link
                            key={n.id}
                            href={n.link || '/inbox'}
                            onClick={() => setShowNotifications(false)}
                            className={`block p-3.5 hover:bg-slate-50 dark:hover:bg-[#3C4043] transition-colors ${
                              !n.isRead ? 'bg-blue-50/60 dark:bg-[#1E3A5F]/40' : ''
                            }`}
                          >
                            <p className="font-bold text-[#202124] dark:text-[#FFFFFF] text-xs">{n.title}</p>
                            <p className="text-[11px] text-[#5F6368] dark:text-[#BDC1C6] line-clamp-2 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-400 dark:text-[#9AA0A6] mt-1 block">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Avatar / User Dropdown */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-[#3C4043] transition-all hover:ring-2 hover:ring-[#DADCE0] dark:hover:ring-[#5F6368] cursor-pointer flex items-center justify-center"
                  aria-label="User profile menu"
                  title={user.profile?.name || 'Account'}
                >
                  <div className="w-9 h-9 rounded-full bg-[#1A73E8] text-white flex items-center justify-center text-xs font-bold shadow-2xs overflow-hidden border-2 border-white dark:border-[#303134]">
                    {user.profile?.profilePhotoUrl ? (
                      <img
                        src={user.profile.profilePhotoUrl}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      user.profile?.name?.charAt(0) || user.email.charAt(0).toUpperCase()
                    )}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#303134] rounded-3xl shadow-2xl border border-[#DADCE0] dark:border-[#3C4043] py-2 z-50 animate-in fade-in zoom-in-95">
                    {/* Header with Avatar on left side of name */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-[#3C4043] flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#1A73E8] text-white flex items-center justify-center text-sm font-bold shadow-xs overflow-hidden flex-shrink-0 border-2 border-white dark:border-[#202124]">
                        {user.profile?.profilePhotoUrl ? (
                          <img
                            src={user.profile.profilePhotoUrl}
                            alt="Profile Avatar"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          user.profile?.name?.charAt(0) || user.email.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#202124] dark:text-[#FFFFFF] truncate">
                          {user.profile?.name || 'Roomie User'}
                        </p>
                        <p className="text-xs text-[#5F6368] dark:text-[#BDC1C6] truncate">{user.email}</p>

                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="px-2 py-0.5 bg-[#E8F0FE] dark:bg-[#1E3A5F] border border-[#DADCE0] dark:border-[#2B4C7E] text-[#1A73E8] dark:text-[#8AB4F8] text-[10px] font-bold rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-[#1A73E8] dark:text-[#8AB4F8]" />
                            {isPGOwner ? '🏢 PG Owner' : isFlatOwner ? '🏡 Flat Owner' : isAdmin ? '🛡️ Admin' : '🏠 Seeker'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ROLE-SPECIFIC MENU: HIGH CONTRAST IN DARK MODE */}
                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
                      >
                        <User className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
                        <span>My Profile</span>
                      </Link>

                      {/* Seeker Specific */}
                      {isSeeker && !isAdmin && (
                        <>
                          <Link
                            href="/saved"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
                          >
                            <Heart className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
                            <span>Saved Listings</span>
                          </Link>

                          <Link
                            href="/inbox"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
                          >
                            <FileText className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
                            <span>My Requests / Applications</span>
                          </Link>
                        </>
                      )}

                      {/* PG Owner Specific */}
                      {isPGOwner && (
                        <>
                          <Link
                            href="/manage/pg"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
                          >
                            <Building className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
                            <span>Manage Your PG</span>
                          </Link>

                          <Link
                            href="/inbox"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
                          >
                            <Users className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
                            <span>Interested Students / Requests</span>
                          </Link>
                        </>
                      )}

                      {/* Flat Owner Specific */}
                      {isFlatOwner && (
                        <>
                          <Link
                            href="/manage/flat"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
                          >
                            <Home className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
                            <span>Manage Your Flat</span>
                          </Link>

                          <Link
                            href="/inbox"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
                          >
                            <Users className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
                            <span>Interested Students / Requests</span>
                          </Link>
                        </>
                      )}

                      {/* Admin Specific */}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8] hover:bg-blue-50 dark:hover:bg-[#3C4043]"
                        >
                          <Shield className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
                          <span>Admin Portal</span>
                        </Link>
                      )}

                      {/* Common: Notifications & Settings */}
                      <Link
                        href="/notifications"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
                      >
                        <Bell className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
                        <span>Notifications</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
                      >
                        <Settings className="w-4 h-4 text-slate-400 dark:text-[#BDC1C6]" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-[#3C4043]">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#EA4335] dark:text-[#F28B82] hover:bg-rose-50 dark:hover:bg-[#3C4043] w-full text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Drawer Button */}
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-2xl text-[#5F6368] dark:text-[#E8EAED] hover:text-[#202124] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#3C4043] md:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-[#DADCE0] dark:border-[#3C4043] bg-white dark:bg-[#202124] px-4 pt-3 pb-6 space-y-2.5 animate-in slide-in-from-top-2">
          {user && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#303134] rounded-2xl border border-[#DADCE0] dark:border-[#3C4043] mb-2">
              <div className="w-10 h-10 rounded-full bg-[#1A73E8] text-white flex items-center justify-center text-xs font-bold shadow-xs overflow-hidden flex-shrink-0 border border-white dark:border-[#202124]">
                {user.profile?.profilePhotoUrl ? (
                  <img
                    src={user.profile.profilePhotoUrl}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  user.profile?.name?.charAt(0) || user.email.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-[#202124] dark:text-[#FFFFFF] truncate">
                  {user.profile?.name || 'Roomie User'}
                </p>
                <p className="text-[10px] text-[#5F6368] dark:text-[#BDC1C6] truncate">{user.email}</p>
              </div>
            </div>
          )}

          <Link
            href="/"
            onClick={() => setShowMobileMenu(false)}
            className="flex items-center gap-2 p-2.5 rounded-2xl font-bold text-xs text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
          >
            <Home className="w-4 h-4" /> <span>Home</span>
          </Link>
          <Link
            href="/find"
            onClick={() => setShowMobileMenu(false)}
            className="flex items-center gap-2 p-2.5 rounded-2xl font-bold text-xs text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
          >
            <Search className="w-4 h-4" /> <span>Find Accommodations</span>
          </Link>
          <Link
            href="/demo"
            onClick={() => setShowMobileMenu(false)}
            className="flex items-center gap-2 p-2.5 rounded-2xl font-bold text-xs text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
          >
            <Sparkles className="w-4 h-4 text-[#FBBC04]" /> <span>Demo Preview (Examples)</span>
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-2 p-2.5 rounded-2xl font-bold text-xs text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
              >
                <LayoutDashboard className="w-4 h-4" /> <span>Dashboard</span>
              </Link>
              {isPGOwner && (
                <Link
                  href="/manage/pg"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2 p-2.5 rounded-2xl font-bold text-xs text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
                >
                  <Building className="w-4 h-4" /> <span>Manage PG</span>
                </Link>
              )}
              {isFlatOwner && (
                <Link
                  href="/manage/flat"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2 p-2.5 rounded-2xl font-bold text-xs text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
                >
                  <Home className="w-4 h-4" /> <span>Manage Flat</span>
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-2 p-2.5 rounded-2xl font-bold text-xs text-[#202124] dark:text-[#FFFFFF] hover:bg-slate-50 dark:hover:bg-[#3C4043]"
              >
                <User className="w-4 h-4" /> <span>My Profile</span>
              </Link>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 p-2.5 rounded-2xl font-bold text-xs text-[#EA4335] dark:text-[#F28B82] hover:bg-rose-50 dark:hover:bg-[#3C4043] w-full text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setShowMobileMenu(false)}
                className="w-full py-2.5 text-center font-bold text-xs text-[#202124] dark:text-[#FFFFFF] bg-slate-100 dark:bg-[#3C4043] rounded-2xl"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setShowMobileMenu(false)}
                className="w-full py-2.5 text-center font-bold text-xs text-white bg-[#1A73E8] rounded-2xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
