"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CircleDollarSign,
  Clock3,
  CreditCard,
  ExternalLink,
  MoreHorizontal,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  WalletCards,
  Activity,
  ArrowLeftRight,
  CheckCircle2,
  Eye,
  Loader2,
} from "lucide-react";

// Types for your DB data
interface Trade {
  id: string;
  user: string;
  email: string;
  pair: string;
  type: "BUY" | "SELL";
  amount: string;
  status: string;
  time: string;
}

interface User {
  name: string;
  email: string;
  initials: string;
  time: string;
  status: string;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "user" | "success" | "warning" | "trade";
}

interface MarketItem {
  pair: string;
  price: string;
  change: string;
  positive: boolean;
}

interface DashboardData {
  stats: {
    totalUsers: string;
    usersChange: string;
    activeTraders: string;
    activeChange: string;
    tradingVolume: string;
    volumeChange: string;
    totalBalance: string;
    balanceChange: string;
  };
  financials: {
    deposits: string;
    depositsCount: string;
    withdrawals: string;
    withdrawalsCount: string;
    pendingRequests: string;
  };
  recentTrades: Trade[];
  recentUsers: User[];
  activities: ActivityItem[];
  marketData: MarketItem[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center gap-3 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin text-red-500" />
        <span className="text-sm font-medium">Loading platform data...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-3 text-red-400">
        <p className="text-sm font-semibold">{error || "Failed to load data"}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-white/[0.05] px-4 py-2 text-xs text-white hover:bg-white/[0.1]"
        >
          Retry
        </button>
      </div>
    );
  }

  const mainStats = [
    {
      title: "Total Users",
      value: data.stats.totalUsers,
      change: data.stats.usersChange || "+0.0%",
      description: "vs last month",
      icon: Users,
    },
    {
      title: "Active Traders",
      value: data.stats.activeTraders,
      change: data.stats.activeChange || "+0.0%",
      description: "vs last month",
      icon: Activity,
    },
    {
      title: "Trading Volume",
      value: data.stats.tradingVolume,
      change: data.stats.volumeChange || "+0.0%",
      description: "this month",
      icon: BarChart3,
    },
    {
      title: "Total Balance",
      value: data.stats.totalBalance,
      change: data.stats.balanceChange || "+0.0%",
      description: "platform balance",
      icon: WalletCards,
    },
  ];

  const financialStats = [
    {
      title: "Deposits",
      value: data.financials.deposits,
      count: data.financials.depositsCount,
      icon: ArrowDownRight,
    },
    {
      title: "Withdrawals",
      value: data.financials.withdrawals,
      count: data.financials.withdrawalsCount,
      icon: ArrowUpRight,
    },
    {
      title: "Pending Requests",
      value: data.financials.pendingRequests,
      count: "Needs attention",
      icon: Clock3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
              Administration
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
            Monitor and manage your PIPMASTER trading platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5 text-xs font-medium text-gray-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            <BarChart3 className="h-4 w-4" />
            <span>View Reports</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-500"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mainStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b] p-5 transition-all duration-200 hover:border-white/[0.1] hover:bg-[#10151f]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400">
                      <ArrowUpRight className="h-3 w-3" />
                      {stat.change}
                    </span>

                    <span className="text-[10px] text-gray-600">
                      {stat.description}
                    </span>
                  </div>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.03]">
                  <Icon className="h-[18px] w-[18px] text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FINANCIAL SUMMARY */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {financialStats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#0d121b] p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.035]">
                <Icon className="h-5 w-5 text-gray-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-600">
                  {item.title}
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {item.value}
                </p>

                <p className="mt-0.5 text-[10px] text-gray-600">
                  {item.count}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECENT USERS & ACTIVITY */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
        {/* Recent Users */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b]">
          <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Recent Users
              </h2>
              <p className="mt-0.5 text-[10px] text-gray-600">
                Latest registered platform users
              </p>
            </div>
            <Link
              href="/admin/users"
              className="flex items-center gap-1.5 text-[10px] font-semibold text-red-400 transition hover:text-red-300"
            >
              View all
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {data.recentUsers.map((user) => (
              <div
                key={user.email}
                className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-white/[0.02]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-[10px] font-bold text-gray-300 ring-1 ring-white/[0.06]">
                  {user.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-200">
                    {user.name}
                  </p>
                  <p className="mt-0.5 truncate text-[9px] text-gray-600">
                    {user.email}
                  </p>
                </div>

                <div className="hidden text-right sm:block">
                  <StatusBadge status={user.status} />
                  <p className="mt-1 text-[9px] text-gray-700">{user.time}</p>
                </div>

                <button
                  type="button"
                  className="rounded-lg p-2 text-gray-700 transition hover:bg-white/[0.04] hover:text-gray-300"
                  aria-label={`View ${user.name}`}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b]">
          <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Recent Activity
              </h2>
              <p className="mt-0.5 text-[10px] text-gray-600">
                Latest platform events
              </p>
            </div>
            <Activity className="h-4 w-4 text-gray-600" />
          </div>

          <div className="divide-y divide-white/[0.04]">
            {data.activities.map((activity) => (
              <div key={activity.id || activity.title} className="flex gap-3 px-5 py-3.5">
                <ActivityIcon type={activity.type} />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-gray-300">
                    {activity.title}
                  </p>
                  <p className="mt-0.5 text-[9px] leading-4 text-gray-600">
                    {activity.description}
                  </p>
                  <p className="mt-1 text-[9px] text-gray-700">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT TRADES */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b]">
        <div className="flex flex-col gap-3 border-b border-white/[0.05] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Trades</h2>
            <p className="mt-0.5 text-[10px] text-gray-600">
              Latest trading activity across the platform
            </p>
          </div>

          <Link
            href="/admin/trades"
            className="flex w-fit items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[10px] font-semibold text-gray-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            View all trades
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-gray-700">
                  Trade
                </th>
                <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-gray-700">
                  User
                </th>
                <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-gray-700">
                  Pair
                </th>
                <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-gray-700">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-gray-700">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-gray-700">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-wider text-gray-700">
                  Time
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {data.recentTrades.map((trade) => (
                <tr
                  key={trade.id}
                  className="transition hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-3.5 font-mono text-[10px] font-semibold text-gray-500">
                    {trade.id}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-semibold text-gray-300">
                      {trade.user}
                    </p>
                    <p className="mt-0.5 text-[9px] text-gray-700">
                      {trade.email}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-gray-300">
                    {trade.pair}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${
                        trade.type === "BUY"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {trade.type === "BUY" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-gray-300">
                    {trade.amount}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={trade.status} />
                  </td>
                  <td className="px-5 py-3.5 text-[10px] text-gray-600">
                    {trade.time}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-gray-700 transition hover:bg-white/[0.04] hover:text-gray-300"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SYSTEM HEALTH */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SystemStatus
          title="Trading Engine"
          description="All trading services operational"
        />
        <SystemStatus
          title="Payment Gateway"
          description="Deposit & withdrawal services active"
        />
        <SystemStatus
          title="Database"
          description="Database connection healthy"
        />
      </div>

      {/* FOOTER */}
      <div className="flex flex-col items-center justify-between gap-2 border-t border-white/[0.05] pt-5 text-[9px] text-gray-700 sm:flex-row">
        <p>
          © {new Date().getFullYear()} PIPMASTER TRADING. Admin Control Center.
        </p>

        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/60" />
          <span>Secure Administration Environment</span>
        </div>
      </div>
    </div>
  );
}

/* HELPER COMPONENTS */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Open: "bg-blue-500/10 text-blue-400 bg-blue-400",
    Closed: "bg-emerald-500/10 text-emerald-400 bg-emerald-400",
    Pending: "bg-amber-500/10 text-amber-400 bg-amber-400",
    Active: "bg-emerald-500/10 text-emerald-400 bg-emerald-400",
  };

  const style = styles[status] || "bg-gray-500/10 text-gray-400 bg-gray-400";
  const [bgText, dotColor] = style.split(" ");

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${bgText}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const classes: Record<string, { bg: string; icon: React.ElementType }> = {
    user: { bg: "bg-blue-500/10 text-blue-400", icon: UserPlus },
    success: { bg: "bg-emerald-500/10 text-emerald-400", icon: CircleDollarSign },
    warning: { bg: "bg-amber-500/10 text-amber-400", icon: CreditCard },
    trade: { bg: "bg-purple-500/10 text-purple-400", icon: ArrowLeftRight },
  };

  const config = classes[type] || classes.trade;
  const Icon = config.icon;

  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bg}`}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}

function SystemStatus({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-gray-300">{title}</p>
        <p className="mt-0.5 text-[9px] text-gray-600">{description}</p>
      </div>
    </div>
  );
}