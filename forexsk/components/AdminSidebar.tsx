"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  WalletCards,
  TrendingUp,
  CircleDollarSign,
  CreditCard,
  ReceiptText,
  CandlestickChart,
  BarChart3,
  Bell,
  Settings,
  FileClock,
  X,
  ShieldCheck,
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      {
        label: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        label: "Accounts",
        href: "/admin/accounts",
        icon: WalletCards,
      },
      {
        label: "Trading",
        href: "/admin/trades",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "FINANCE",
    items: [
      {
        label: "Deposits",
        href: "/admin/deposits",
        icon: CircleDollarSign,
        badge: "8",
      },
      {
        label: "Withdrawals",
        href: "/admin/withdrawals",
        icon: CreditCard,
        badge: "5",
      },
      {
        label: "Transactions",
        href: "/admin/transactions",
        icon: ReceiptText,
      },
    ],
  },
  {
    title: "MARKET",
    items: [
      {
        label: "Markets",
        href: "/admin/markets",
        icon: CandlestickChart,
      },
      {
        label: "Reports",
        href: "/admin/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        label: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        badge: "3",
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        label: "Audit Logs",
        href: "/admin/audit-logs",
        icon: FileClock,
      },
    ],
  },
];

interface AdminSidebarProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export default function AdminSidebar({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Persistent Fixed Sidebar */}
      <aside
        className={`
          fixed bottom-0 top-0 z-50 flex h-screen flex-col
          border-r border-white/[0.06] bg-[#0b0f17]
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "w-[82px]" : "w-[270px]"}
          ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Brand Header */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.06] px-5">
          <Link
            href="/admin"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-900/20">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>

            {!sidebarCollapsed && (
              <div className="min-w-0">
                <div className="truncate text-[15px] font-bold tracking-[0.18em] text-white">
                  PIPMASTER
                </div>
                <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.25em] text-gray-500">
                  Admin Control
                </div>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* System Online Status Badge */}
        {!sidebarCollapsed && (
          <div className="mx-4 mt-4 shrink-0 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.04] px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>

              <div className="flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  System Online
                </p>
              </div>

              <Activity className="h-3.5 w-3.5 text-emerald-500/70" />
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              {!sidebarCollapsed && (
                <div className="mb-2 px-3 text-[9px] font-bold tracking-[0.18em] text-gray-600">
                  {section.title}
                </div>
              )}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`
                        group relative flex items-center gap-3 rounded-xl
                        px-3 py-2.5 transition-all duration-200
                        ${
                          active
                            ? "bg-red-600/[0.12] text-white font-medium"
                            : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"
                        }
                        ${sidebarCollapsed ? "justify-center" : ""}
                      `}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-red-500" />
                      )}

                      <Icon
                        className={`
                          h-[18px] w-[18px] shrink-0 transition-colors
                          ${
                            active
                              ? "text-red-400"
                              : "text-gray-500 group-hover:text-gray-300"
                          }
                        `}
                      />

                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 truncate text-[12px]">
                            {item.label}
                          </span>

                          {item.badge && (
                            <span
                              className={`
                                min-w-[20px] rounded-full px-1.5 py-0.5
                                text-center text-[9px] font-bold
                                ${
                                  active
                                    ? "bg-red-500/20 text-red-300"
                                    : "bg-white/[0.06] text-gray-500"
                                }
                              `}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Toggle Controls */}
        <div className="shrink-0 border-t border-white/[0.06] p-3">
          {!sidebarCollapsed && (
            <div className="mb-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                  <ShieldCheck className="h-4 w-4 text-red-400" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold text-gray-300">
                    Administrator
                  </p>
                  <p className="truncate text-[9px] text-gray-600">
                    Full system access
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden w-full items-center justify-center rounded-xl p-2.5 text-gray-600 transition hover:bg-white/[0.04] hover:text-gray-300 lg:flex"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}