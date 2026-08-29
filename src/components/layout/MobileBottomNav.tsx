'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Compass, UserCheck, MessageSquare, User } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on public landing or auth pages if desired, or show relevant student links
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) return null;

  const navItems = [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/connections', label: 'Matches', icon: UserCheck },
    { href: '/messages', label: 'Chat', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-semibold transition-all ${
                isActive
                  ? 'text-brand-700 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-brand-700 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
