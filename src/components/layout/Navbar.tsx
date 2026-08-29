'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Search,
  PlusCircle,
  Inbox,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Bell,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { SUPPORT_EMAIL } from '@/lib/constants';

interface UserData {
  id: string;
  email: string;
  role: string;
  profile?: {
    name: string;
    profilePhotoUrl?: string | null;
    school: string;
    department: string;
    emailVerified: boolean;
  };
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDemoSwitcher, setShowDemoSwitcher] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  const fetchAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.user) {
          fetchNotifications();
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // silently handle
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
      if (demoRef.current && !demoRef.current.contains(event.target as Node)) {
        setShowDemoSwitcher(false);
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

  const handleQuickLogin = async (email: string, pass: string) => {
    setShowDemoSwitcher(false);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      if (res.ok) {
        await fetchAuth();
        if (email.includes('admin')) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markAllNotificationsAsRead = async () => {
    await fetch('/api/notifications', { method: 'PUT' });
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                  MIT-ADT <span className="text-brand-700 font-bold">Roommate</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold -mt-1">
                  Accommodation Finder
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                pathname === '/'
                  ? 'bg-brand-50 text-brand-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/find"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                pathname === '/find'
                  ? 'bg-brand-50 text-brand-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              Find
            </Link>
            <Link
              href="/listings/new"
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                pathname === '/listings/new'
                  ? 'bg-brand-50 text-brand-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-brand-700" />
              Post Listing
            </Link>

            {user?.role === 'student' && (
              <>
                <Link
                  href="/inbox"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    pathname === '/inbox'
                      ? 'bg-brand-50 text-brand-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  Inbox
                </Link>
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    pathname === '/dashboard'
                      ? 'bg-brand-50 text-brand-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-700 flex items-center gap-1.5 border border-red-200"
              >
                <Shield className="w-4 h-4 text-red-600" />
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Switcher */}
            <div className="relative" ref={demoRef}>
              <button
                type="button"
                onClick={() => setShowDemoSwitcher(!showDemoSwitcher)}
                className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 transition-colors"
                title="Quick demo switch"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-amber-700" />
              </button>

              {showDemoSwitcher && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => handleQuickLogin('rahul.sharma@gmail.com', 'Password@123')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-800"
                  >
                    <div>
                      <div className="font-bold text-slate-900">Rahul Sharma</div>
                      <div className="text-[11px] text-slate-500">CSE • 3rd Year • Has Vacancy</div>
                    </div>
                    {user?.email === 'rahul.sharma@gmail.com' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleQuickLogin('ananya.ux@gmail.com', 'Password@123')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-800"
                  >
                    <div>
                      <div className="font-bold text-slate-900">Ananya Patel</div>
                      <div className="text-[11px] text-slate-500">Design • Needs Roommate</div>
                    </div>
                    {user?.email === 'ananya.ux@gmail.com' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleQuickLogin('rohan.engg@gmail.com', 'Password@123')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-800"
                  >
                    <div>
                      <div className="font-bold text-slate-900">Rohan Deshmukh</div>
                      <div className="text-[11px] text-slate-500">Mechanical • Connected with Rahul</div>
                    </div>
                    {user?.email === 'rohan.engg@gmail.com' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleQuickLogin('admin@mitadt.ac.in', 'Admin@123')}
                    className="w-full text-left px-3 py-2 hover:bg-red-50 flex items-center justify-between text-red-900 border-t border-slate-100"
                  >
                    <div>
                      <div className="font-bold text-red-700">MIT-ADT Housing Admin</div>
                      <div className="text-[11px] text-slate-500">Moderation Portal</div>
                    </div>
                    {user?.role === 'admin' && (
                      <CheckCircle2 className="w-4 h-4 text-red-600" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-brand-700" />
                        Notifications
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs font-semibold text-brand-700 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <Link
                            key={n.id}
                            href={n.link || '/inbox'}
                            onClick={() => setShowNotifications(false)}
                            className={`block p-3.5 hover:bg-slate-50 transition-colors ${
                              !n.isRead ? 'bg-blue-50/60' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {!n.isRead && (
                                <span className="w-2 h-2 mt-1 rounded-full bg-brand-700 flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900">{n.title}</p>
                                <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{n.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-900 font-bold text-sm overflow-hidden">
                    {user.profile?.profilePhotoUrl ? (
                      <img
                        src={user.profile.profilePhotoUrl}
                        alt={user.profile.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.profile?.name?.charAt(0) || user.email.charAt(0).toUpperCase()
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user.profile?.name || 'MIT-ADT Student'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>

                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Email Verified
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard & Listings
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
                        >
                          <Shield className="w-4 h-4 text-red-500" />
                          Admin Portal
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              !loading && (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-brand-900 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 py-2 text-xs font-bold text-white bg-brand-900 rounded-xl shadow-xs hover:bg-brand-800 transition-all"
                  >
                    Register
                  </Link>
                </div>
              )
            )}

            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              href="/find"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Find Listings
            </Link>
            <Link
              href="/listings/new"
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-brand-700 hover:bg-slate-50"
            >
              + Post a Listing
            </Link>

            {user ? (
              <>
                <Link
                  href="/inbox"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Inbox & Requests
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-slate-800"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-brand-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
