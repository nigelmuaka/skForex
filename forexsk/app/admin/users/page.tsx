"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
  Activity,
  WalletCards,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckCircle2,
  Clock3,
  XCircle,
  Mail,
  Phone,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

/* ================================================================
   TYPES
================================================================ */

type UserStatus = "Active" | "Pending" | "Suspended";

type TradingStatus = "Trading" | "Not Trading";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  status: UserStatus;
  tradingStatus: TradingStatus;
  accountType: string;
  balance: string;
  equity: string;
  trades: number;
  joined: string;
  lastActive: string;
  verified: boolean;
}

/* ================================================================
   SAMPLE USERS
================================================================ */

const users: User[] = [
  {
    id: "PM-100245",
    name: "James Mwangi",
    email: "james.m@example.com",
    phone: "+254 712 345 678",
    initials: "JM",
    status: "Active",
    tradingStatus: "Trading",
    accountType: "Standard",
    balance: "$24,850.00",
    equity: "$26,420.00",
    trades: 148,
    joined: "Aug 10, 2026",
    lastActive: "2 min ago",
    verified: true,
  },
  {
    id: "PM-100244",
    name: "Daniel Otieno",
    email: "daniel.o@example.com",
    phone: "+254 723 456 789",
    initials: "DO",
    status: "Active",
    tradingStatus: "Trading",
    accountType: "Professional",
    balance: "$58,420.00",
    equity: "$61,210.00",
    trades: 327,
    joined: "Aug 9, 2026",
    lastActive: "8 min ago",
    verified: true,
  },
  {
    id: "PM-100243",
    name: "Brian Kamau",
    email: "brian.k@example.com",
    phone: "+254 734 567 890",
    initials: "BK",
    status: "Active",
    tradingStatus: "Trading",
    accountType: "Standard",
    balance: "$12,740.00",
    equity: "$11,980.00",
    trades: 92,
    joined: "Aug 8, 2026",
    lastActive: "14 min ago",
    verified: true,
  },
  {
    id: "PM-100242",
    name: "Samuel Kiptoo",
    email: "samuel.k@example.com",
    phone: "+254 745 678 901",
    initials: "SK",
    status: "Active",
    tradingStatus: "Not Trading",
    accountType: "Standard",
    balance: "$8,640.00",
    equity: "$8,640.00",
    trades: 46,
    joined: "Aug 7, 2026",
    lastActive: "21 min ago",
    verified: true,
  },
  {
    id: "PM-100241",
    name: "Peter Maina",
    email: "peter.m@example.com",
    phone: "+254 756 789 012",
    initials: "PM",
    status: "Pending",
    tradingStatus: "Not Trading",
    accountType: "Standard",
    balance: "$0.00",
    equity: "$0.00",
    trades: 0,
    joined: "Aug 7, 2026",
    lastActive: "28 min ago",
    verified: false,
  },
  {
    id: "PM-100240",
    name: "Kevin Otieno",
    email: "kevin.o@example.com",
    phone: "+254 767 890 123",
    initials: "KO",
    status: "Active",
    tradingStatus: "Trading",
    accountType: "Professional",
    balance: "$34,820.00",
    equity: "$37,150.00",
    trades: 214,
    joined: "Aug 6, 2026",
    lastActive: "35 min ago",
    verified: true,
  },
  {
    id: "PM-100239",
    name: "Mercy Wanjiku",
    email: "mercy.w@example.com",
    phone: "+254 778 901 234",
    initials: "MW",
    status: "Active",
    tradingStatus: "Trading",
    accountType: "Standard",
    balance: "$16,540.00",
    equity: "$17,230.00",
    trades: 78,
    joined: "Aug 5, 2026",
    lastActive: "42 min ago",
    verified: true,
  },
  {
    id: "PM-100238",
    name: "Alex Kimani",
    email: "alex.k@example.com",
    phone: "+254 789 012 345",
    initials: "AK",
    status: "Pending",
    tradingStatus: "Not Trading",
    accountType: "Standard",
    balance: "$0.00",
    equity: "$0.00",
    trades: 0,
    joined: "Aug 5, 2026",
    lastActive: "1 hour ago",
    verified: false,
  },
  {
    id: "PM-100237",
    name: "Grace Njeri",
    email: "grace.n@example.com",
    phone: "+254 790 123 456",
    initials: "GN",
    status: "Active",
    tradingStatus: "Not Trading",
    accountType: "Standard",
    balance: "$6,850.00",
    equity: "$6,850.00",
    trades: 31,
    joined: "Aug 4, 2026",
    lastActive: "1 hour ago",
    verified: true,
  },
  {
    id: "PM-100236",
    name: "Collins Ochieng",
    email: "collins.o@example.com",
    phone: "+254 701 234 567",
    initials: "CO",
    status: "Suspended",
    tradingStatus: "Not Trading",
    accountType: "Standard",
    balance: "$2,450.00",
    equity: "$2,450.00",
    trades: 19,
    joined: "Aug 3, 2026",
    lastActive: "3 hours ago",
    verified: true,
  },
  {
    id: "PM-100235",
    name: "Faith Akinyi",
    email: "faith.a@example.com",
    phone: "+254 702 345 678",
    initials: "FA",
    status: "Active",
    tradingStatus: "Trading",
    accountType: "Professional",
    balance: "$42,750.00",
    equity: "$45,320.00",
    trades: 289,
    joined: "Aug 2, 2026",
    lastActive: "4 hours ago",
    verified: true,
  },
  {
    id: "PM-100234",
    name: "Victor Karanja",
    email: "victor.k@example.com",
    phone: "+254 703 456 789",
    initials: "VK",
    status: "Active",
    tradingStatus: "Not Trading",
    accountType: "Standard",
    balance: "$9,420.00",
    equity: "$9,420.00",
    trades: 54,
    joined: "Aug 1, 2026",
    lastActive: "5 hours ago",
    verified: true,
  },
];

/* ================================================================
   STATUS BADGE
================================================================ */

function StatusBadge({ status }: { status: UserStatus }) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
        <CheckCircle2 className="h-3 w-3" />
        Active
      </span>
    );
  }

  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-400">
        <Clock3 className="h-3 w-3" />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-400">
      <XCircle className="h-3 w-3" />
      Suspended
    </span>
  );
}

/* ================================================================
   TRADING STATUS
================================================================ */

function TradingBadge({ status }: { status: TradingStatus }) {
  if (status === "Trading") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-blue-400">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400" />
        </span>
        Trading
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-gray-600">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-700" />
      Not Trading
    </span>
  );
}

/* ================================================================
   PAGE
================================================================ */

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>(
    "All",
  );
  const [accountFilter, setAccountFilter] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      const matchesAccount =
        accountFilter === "All" || user.accountType === accountFilter;

      return matchesSearch && matchesStatus && matchesAccount;
    });
  }, [search, statusFilter, accountFilter]);

  const toggleUser = (id: string) => {
    setSelectedUsers((current) =>
      current.includes(id)
        ? current.filter((userId) => userId !== id)
        : [...current, id],
    );
  };

  const toggleAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const activeUsers = users.filter((u) => u.status === "Active").length;
  const pendingUsers = users.filter((u) => u.status === "Pending").length;
  const suspendedUsers = users.filter(
    (u) => u.status === "Suspended",
  ).length;
  const tradingUsers = users.filter(
    (u) => u.tradingStatus === "Trading",
  ).length;

  return (
    <div className="space-y-6">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
              Management
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Users
          </h1>

          <p className="mt-1.5 text-xs text-gray-500 sm:text-sm">
            Manage platform users, accounts and trading access.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5 text-xs font-medium text-gray-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5 text-xs font-medium text-gray-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            <Download className="h-4 w-4" />
            Export
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-500"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* ============================================================
          SUMMARY CARDS
      ============================================================ */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard
          title="Total Users"
          value={users.length.toLocaleString()}
          subtitle="Registered accounts"
          icon={Users}
        />

        <SummaryCard
          title="Active Users"
          value={activeUsers.toLocaleString()}
          subtitle="Accounts active"
          icon={UserCheck}
          iconClass="text-emerald-400"
        />

        <SummaryCard
          title="Trading Now"
          value={tradingUsers.toLocaleString()}
          subtitle="Currently trading"
          icon={TrendingUp}
          iconClass="text-blue-400"
        />

        <SummaryCard
          title="Pending Review"
          value={pendingUsers.toLocaleString()}
          subtitle="Requires attention"
          icon={Clock3}
          iconClass="text-amber-400"
        />
      </div>

      {/* ============================================================
          QUICK STATUS
      ============================================================ */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <QuickStatus
          title="Active Accounts"
          value={activeUsers}
          percentage={Math.round((activeUsers / users.length) * 100)}
          icon={UserCheck}
          type="success"
        />

        <QuickStatus
          title="Pending Accounts"
          value={pendingUsers}
          percentage={Math.round((pendingUsers / users.length) * 100)}
          icon={Clock3}
          type="warning"
        />

        <QuickStatus
          title="Suspended Accounts"
          value={suspendedUsers}
          percentage={Math.round(
            (suspendedUsers / users.length) * 100,
          )}
          icon={UserX}
          type="danger"
        />
      </div>

      {/* ============================================================
          USERS TABLE
      ============================================================ */}

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b]">
        {/* Table Header */}

        <div className="border-b border-white/[0.05] p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Platform Users
              </h2>

              <p className="mt-0.5 text-[10px] text-gray-600">
                {filteredUsers.length} users matching your current
                filters
              </p>
            </div>

            {/* Search */}

            <div className="relative w-full xl:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, email or ID..."
                className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.025] pl-10 pr-4 text-xs text-gray-200 outline-none placeholder:text-gray-700 transition focus:border-red-500/30 focus:bg-white/[0.04]"
              />
            </div>
          </div>

          {/* Filters */}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <Filter className="h-3.5 w-3.5 text-gray-600" />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(
                    e.target.value as "All" | UserStatus,
                  );
                  setPage(1);
                }}
                className="bg-transparent text-[10px] font-medium text-gray-400 outline-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <WalletCards className="h-3.5 w-3.5 text-gray-600" />

              <select
                value={accountFilter}
                onChange={(e) => {
                  setAccountFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-[10px] font-medium text-gray-400 outline-none"
              >
                <option value="All">All Account Types</option>
                <option value="Standard">Standard</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            {(search ||
              statusFilter !== "All" ||
              accountFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setAccountFilter("All");
                  setPage(1);
                }}
                className="rounded-xl px-3 py-2 text-[10px] font-semibold text-red-400 transition hover:bg-red-500/[0.06]"
              >
                Clear filters
              </button>
            )}

            {selectedUsers.length > 0 && (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-[10px] text-gray-500">
                  {selectedUsers.length} selected
                </span>

                <button
                  type="button"
                  className="rounded-lg bg-white/[0.04] px-3 py-2 text-[10px] font-semibold text-gray-400 hover:bg-white/[0.07] hover:text-white"
                >
                  Bulk Actions
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ==========================================================
            DESKTOP TABLE
        ========================================================== */}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="w-12 px-5 py-3">
                  <input
                    type="checkbox"
                    checked={
                      filteredUsers.length > 0 &&
                      selectedUsers.length === filteredUsers.length
                    }
                    onChange={toggleAll}
                    className="h-3.5 w-3.5 rounded border-white/10 bg-white/[0.04] accent-red-500"
                  />
                </th>

                <TableHeader label="User" />

                <TableHeader label="Account" />

                <TableHeader label="Balance" />

                <TableHeader label="Trades" />

                <TableHeader label="Status" />

                <TableHeader label="Last Active" />

                <th className="px-5 py-3 text-right text-[9px] font-bold uppercase tracking-wider text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="group transition hover:bg-white/[0.018]"
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                      className="h-3.5 w-3.5 rounded border-white/10 bg-white/[0.04] accent-red-500"
                    />
                  </td>

                  {/* User */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-[10px] font-bold text-gray-300 ring-1 ring-white/[0.06]">
                          {user.initials}
                        </div>

                        {user.tradingStatus === "Trading" && (
                          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0d121b] bg-blue-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-xs font-semibold text-gray-200">
                            {user.name}
                          </p>

                          {user.verified && (
                            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                          )}
                        </div>

                        <p className="mt-0.5 truncate text-[9px] text-gray-600">
                          {user.email}
                        </p>

                        <p className="mt-0.5 font-mono text-[8px] text-gray-700">
                          {user.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Account */}

                  <td className="px-5 py-4">
                    <div>
                      <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[9px] font-semibold text-gray-400">
                        {user.accountType}
                      </span>

                      <div className="mt-2">
                        <TradingBadge status={user.tradingStatus} />
                      </div>
                    </div>
                  </td>

                  {/* Balance */}

                  <td className="px-5 py-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-300">
                        {user.balance}
                      </p>

                      <p className="mt-0.5 text-[9px] text-gray-700">
                        Equity {user.equity}
                      </p>
                    </div>
                  </td>

                  {/* Trades */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3 text-gray-600" />

                      <span className="text-xs font-semibold text-gray-400">
                        {user.trades}
                      </span>
                    </div>
                  </td>

                  {/* Status */}

                  <td className="px-5 py-4">
                    <StatusBadge status={user.status} />
                  </td>

                  {/* Last Active */}

                  <td className="px-5 py-4">
                    <div>
                      <p className="text-[10px] font-medium text-gray-500">
                        {user.lastActive}
                      </p>

                      <p className="mt-0.5 text-[8px] text-gray-700">
                        Joined {user.joined}
                      </p>
                    </div>
                  </td>

                  {/* Actions */}

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="rounded-lg p-2 text-gray-700 transition hover:bg-white/[0.05] hover:text-gray-300"
                        title="View user"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-700 transition hover:bg-white/[0.05] hover:text-gray-300"
                        title="More actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ==========================================================
            MOBILE USER CARDS
        ========================================================== */}

        <div className="divide-y divide-white/[0.04] lg:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                  className="mt-2 h-3.5 w-3.5 shrink-0 rounded border-white/10 bg-white/[0.04] accent-red-500"
                />

                <div className="relative shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-[10px] font-bold text-gray-300">
                    {user.initials}
                  </div>

                  {user.tradingStatus === "Trading" && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0d121b] bg-blue-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs font-semibold text-gray-200">
                          {user.name}
                        </p>

                        {user.verified && (
                          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                        )}
                      </div>

                      <p className="mt-0.5 truncate text-[9px] text-gray-600">
                        {user.email}
                      </p>

                      <p className="mt-0.5 font-mono text-[8px] text-gray-700">
                        {user.id}
                      </p>
                    </div>

                    <StatusBadge status={user.status} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <MobileInfo
                      label="Account"
                      value={user.accountType}
                    />

                    <MobileInfo
                      label="Balance"
                      value={user.balance}
                    />

                    <MobileInfo
                      label="Trades"
                      value={String(user.trades)}
                    />

                    <MobileInfo
                      label="Activity"
                      value={user.lastActive}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-3">
                    <TradingBadge status={user.tradingStatus} />

                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="flex items-center gap-1.5 rounded-lg bg-white/[0.035] px-2.5 py-2 text-[9px] font-semibold text-gray-500 transition hover:bg-white/[0.06] hover:text-gray-200"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Link>

                      <button
                        type="button"
                        className="rounded-lg bg-white/[0.035] p-2 text-gray-600 transition hover:bg-white/[0.06] hover:text-gray-300"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}

        {filteredUsers.length === 0 && (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.035]">
              <Users className="h-5 w-5 text-gray-600" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-300">
              No users found
            </h3>

            <p className="mt-1 text-xs text-gray-600">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* ==========================================================
            PAGINATION
        ========================================================== */}

        <div className="flex flex-col gap-3 border-t border-white/[0.05] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-[10px] text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-400">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-400">
              {users.length}
            </span>{" "}
            users
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-gray-600 transition hover:bg-white/[0.05] hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-red-600 px-2 text-[10px] font-semibold text-white"
            >
              {page}
            </button>

            <button
              type="button"
              onClick={() => setPage(page + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-gray-600 transition hover:bg-white/[0.05] hover:text-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECURITY NOTICE
      ============================================================ */}

      <div className="flex flex-col gap-3 rounded-2xl border border-blue-500/10 bg-blue-500/[0.025] p-4 sm:flex-row sm:items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
          <ShieldCheck className="h-4 w-4 text-blue-400" />
        </div>

        <div className="flex-1">
          <p className="text-[11px] font-semibold text-gray-300">
            User management security
          </p>

          <p className="mt-0.5 text-[9px] leading-4 text-gray-600">
            User actions, account changes and administrative operations
            will be recorded in the platform audit logs.
          </p>
        </div>

        <Link
          href="/admin/audit-logs"
          className="text-[10px] font-semibold text-blue-400 transition hover:text-blue-300"
        >
          View Audit Logs
        </Link>
      </div>
    </div>
  );
}

/* ================================================================
   SUMMARY CARD
================================================================ */

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass = "text-gray-400",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-600">
            {title}
          </p>

          <p className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
            {value}
          </p>

          <p className="mt-1 text-[9px] text-gray-700">{subtitle}</p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.035]">
          <Icon className={`h-4 w-4 ${iconClass}`} />
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   QUICK STATUS
================================================================ */

function QuickStatus({
  title,
  value,
  percentage,
  icon: Icon,
  type,
}: {
  title: string;
  value: number;
  percentage: number;
  icon: React.ElementType;
  type: "success" | "warning" | "danger";
}) {
  const colors = {
    success: {
      icon: "text-emerald-400",
      bar: "bg-emerald-500",
    },
    warning: {
      icon: "text-amber-400",
      bar: "bg-amber-500",
    },
    danger: {
      icon: "text-red-400",
      bar: "bg-red-500",
    },
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.035]">
          <Icon className={`h-4 w-4 ${colors[type].icon}`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold text-gray-400">
              {title}
            </p>

            <span className="text-[10px] font-bold text-gray-300">
              {value}
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
            <div
              className={`h-full rounded-full ${colors[type].bar}`}
              style={{ width: `${Math.max(percentage, 4)}%` }}
            />
          </div>

          <p className="mt-1 text-[8px] text-gray-700">
            {percentage}% of total users
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TABLE HEADER
================================================================ */

function TableHeader({ label }: { label: string }) {
  return (
    <th className="px-5 py-3 text-left">
      <button
        type="button"
        className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-gray-700 transition hover:text-gray-400"
      >
        {label}
        <ArrowUpDown className="h-2.5 w-2.5" />
      </button>
    </th>
  );
}

/* ================================================================
   MOBILE INFO
================================================================ */

function MobileInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[8px] uppercase tracking-wider text-gray-700">
        {label}
      </p>

      <p className="mt-1 truncate text-[10px] font-semibold text-gray-400">
        {value}
      </p>
    </div>
  );
}