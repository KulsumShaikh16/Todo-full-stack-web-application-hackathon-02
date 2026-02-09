'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
    LayoutDashboard,
    MessageSquare,
    Settings,
    User,
    LogOut,
    Zap,
    Trophy,
    Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/todos' },
        { icon: MessageSquare, label: 'Focused AI', href: '/chat' },
    ];

    return (
        <aside className="w-20 lg:w-72 h-screen border-r border-white/5 bg-black/60 backdrop-blur-3xl flex flex-col items-center lg:items-stretch py-8 relative z-50">
            {/* Logo */}
            <div className="px-6 mb-12 flex items-center gap-4">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                    <div className="relative w-10 h-10 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center">
                        <Zap size={20} className="text-blue-500 fill-blue-500/20" />
                    </div>
                </div>
                <div className="hidden lg:block">
                    <h2 className="text-sm font-black text-white tracking-widest uppercase">FocusFlow</h2>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Intelligence Suite</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                <div className="hidden lg:block px-4 mb-4">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Main Protocol</span>
                </div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "bg-blue-600/10 border border-blue-500/20 text-white"
                                    : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200 border border-transparent"
                            )}
                        >
                            <item.icon size={20} className={cn(isActive ? "text-blue-400" : "group-hover:text-blue-400 transition-colors")} />
                            <span className="text-[13px] font-bold tracking-tight hidden lg:block">{item.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full blur-[2px] hidden lg:block"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Profile Section */}
            <div className="mt-auto px-4 space-y-4">
                <div className="hidden lg:block px-4 mb-4">
                    <div className="h-px w-full bg-white/5" />
                </div>

                <div className="p-4 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl hidden lg:block">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black text-xs">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[13px] font-bold text-white truncate">{user?.name || 'Operator'}</p>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Elite Member</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-black/20 rounded-lg p-2">
                        <span className="flex items-center gap-1.5"><Activity size={10} className="text-emerald-500" /> Secure</span>
                        <span>v2.5.0</span>
                    </div>
                </div>

                <button
                    onClick={() => logout()}
                    className="w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-2xl text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all group"
                >
                    <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                    <span className="text-[13px] font-bold tracking-tight hidden lg:block">Log Out</span>
                </button>
            </div>
        </aside>
    );
}
