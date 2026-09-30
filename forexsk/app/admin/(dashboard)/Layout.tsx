"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminSidebar from "../../../components/AdminSidebar";
import {
  Menu,
  Search,
  Bell,
  CircleUserRound,
  ChevronDown,
  UserRound,
  LogOut,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#080b12] text-white">
      {/* IMPORTED SIDEBAR COMPONENT */}
      <AdminSidebar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div
        className={`
          flex flex-1 flex-col transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "lg:pl-[82px]" : "lg:pl-[270px]"}
        `}
      >
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex h-[76px] items-center border-b border-white/[0.06] bg-[#080b12]/90 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="mr-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-gray-400 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Search users, trades, transactions..."
                className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.025] pl-10 pr-4 text-xs text-gray-200 outline-none placeholder:text-gray-700 transition focus:border-red-500/30 focus:bg-white/[0.04]"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/notifications"
              className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5 text-gray-500 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-[#080b12]" />
            </Link>

            <div className="hidden h-8 w-px bg-white/[0.06] sm:block" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 rounded-xl p-1.5 pr-2 transition hover:bg-white/[0.04]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 ring-1 ring-white/10">
                  <CircleUserRound className="h-5 w-5 text-gray-300" />
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-[11px] font-semibold text-gray-200">Admin</p>
                  <p className="text-[9px] text-gray-600">Super Administrator</p>
                </div>
                <ChevronDown
                  className={`hidden h-3.5 w-3.5 text-gray-600 transition sm:block ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[52px] w-56 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10151f] p-1.5 shadow-2xl">
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-gray-400 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <UserRound className="h-4 w-4" />
                    Profile & Settings
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-red-400 transition hover:bg-red-500/[0.06]"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}