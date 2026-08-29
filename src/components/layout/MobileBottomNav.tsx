'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, Inbox, LayoutDashboard } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAuthPage) return null;

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/find', label: 'Find', icon: Search },
    { href: '/listings/new', label: 'Post', icon: PlusCircle },
    { href: '/inbox', label: 'Inbox', icon: Inbox },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1 shadow-lg pb-safe">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-bold transition-all min-w-[56px] min-h-[44px] ${
                isActive
                  ? 'text-brand-900 font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-brand-900 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
