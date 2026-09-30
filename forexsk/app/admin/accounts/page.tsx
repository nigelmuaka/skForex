"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  RefreshCw,
  MoreHorizontal,
  Eye,
  User,
  Wallet,
  Activity,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Clock3,
  Ban,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  BarChart3,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type AccountStatus = "Active" | "Suspended" | "Pending" | "Closed";

interface TradingAccount {
  id: string;
  accountNumber: string;
  userId: string;
  name: string;
  email: string;
  accountType: string;
  leverage: string;
  balance: string;
  equity: string;
  margin: string;
  freeMargin: string;
  pnl: string;
  trades: number;
  created: string;
  status: AccountStatus;
}

const accounts: TradingAccount[] = [
  {
    id: "ACC-100842",
    accountNumber: "PM-784521",
    userId: "PM-100245",
    name: "James Mwangi",
    email: "james.m@example.com",
    accountType: "Standard",
    leverage: "1:500",
    balance: "$12,450.00",
    equity: "$13,120.00",
    margin: "$2,140.00",
    freeMargin: "$10,980.00",
    pnl: "+$670.00",
    trades: 48,
    created: "Aug 01, 2026",
    status: "Active",
  },
  {
    id: "ACC-100831",
    accountNumber: "PM-652318",
    userId: "PM-100198",
    name: "Brian Otieno",
    email: "brian.o@example.com",
    accountType: "Pro",
    leverage: "1:500",
    balance: "$8,750.00",
    equity: "$8,210.00",
    margin: "$1,860.00",
    freeMargin: "$6,350.00",
    pnl: "-$540.00",
    trades: 31,
    created: "Jul 28, 2026",
    status: "Active",
  },
  {
    id: "ACC-100802",
    accountNumber: "PM-419827",
    userId: "PM-100176",
    name: "Sarah Wanjiku",
    email: "sarah.w@example.com",
    accountType: "Premium",
    leverage: "1:400",
    balance: "$24,500.00",
    equity: "$26,840.00",
    margin: "$4,200.00",
    freeMargin: "$22,640.00",
    pnl: "+$2,340.00",
    trades: 96,
    created: "Jul 20, 2026",
    status: "Active",
  },
  {
    id: "ACC-100744",
    accountNumber: "PM-318640",
    userId: "PM-100142",
    name: "David Kamau",
    email: "david.k@example.com",
    accountType: "Standard",
    leverage: "1:500",
    balance: "$5,450.00",
    equity: "$5,450.00",
    margin: "$0.00",
    freeMargin: "$5,450.00",
    pnl: "$0.00",
    trades: 0,
    created: "Jul 15, 2026",
    status: "Pending",
  },
  {
    id: "ACC-100710",
    accountNumber: "PM-905217",
    userId: "PM-100118",
    name: "Kevin Maina",
    email: "kevin.m@example.com",
    accountType: "Pro",
    leverage: "1:500",
    balance: "$15,850.00",
    equity: "$17,120.00",
    margin: "$3,420.00",
    freeMargin: "$13,700.00",
    pnl: "+$1,270.00",
    trades: 72,
    created: "Jul 11, 2026",
    status: "Active",
  },
  {
    id: "ACC-100682",
    accountNumber: "PM-248731",
    userId: "PM-100095",
    name: "Mercy Achieng",
    email: "mercy.a@example.com",
    accountType: "Standard",
    leverage: "1:300",
    balance: "$3,200.00",
    equity: "$2,860.00",
    margin: "$1,100.00",
    freeMargin: "$1,760.00",
    pnl: "-$340.00",
    trades: 18,
    created: "Jul 05, 2026",
    status: "Suspended",
  },
  {
    id: "ACC-100651",
    accountNumber: "PM-571923",
    userId: "PM-100081",
    name: "Alex Kiptoo",
    email: "alex.k@example.com",
    accountType: "Premium",
    leverage: "1:400",
    balance: "$31,200.00",
    equity: "$34,480.00",
    margin: "$5,800.00",
    freeMargin: "$28,680.00",
    pnl: "+$3,280.00",
    trades: 124,
    created: "Jun 29, 2026",
    status: "Active",
  },
];

export default function AdminAccountsPage() {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All" | AccountStatus
  >("All");

  const [showFilters, setShowFilters] = useState(false);

  const [selectedAccount, setSelectedAccount] =
    useState<TradingAccount | null>(null);

  const [copied, setCopied] = useState(false);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        account.name.toLowerCase().includes(searchValue) ||
        account.email.toLowerCase().includes(searchValue) ||
        account.accountNumber.toLowerCase().includes(searchValue) ||
        account.userId.toLowerCase().includes(searchValue) ||
        account.accountType.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        account.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const activeCount = accounts.filter(
    (account) => account.status === "Active"
  ).length;

  const pendingCount = accounts.filter(
    (account) => account.status === "Pending"
  ).length;

  const suspendedCount = accounts.filter(
    (account) => account.status === "Suspended"
  ).length;

  const totalBalance = accounts.reduce((total, account) => {
    return total + parseMoney(account.balance);
  }, 0);

  const totalEquity = accounts.reduce((total, account) => {
    return total + parseMoney(account.equity);
  }, 0);

  const copyAccountNumber = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="space-y-6">

      {/* =========================================================
          PAGE HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
            <BarChart3 className="h-5 w-5 text-red-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Trading Accounts
            </h1>

            <p className="mt-1 text-[10px] text-gray-600">
              Manage customer trading accounts and account activity
            </p>
          </div>

        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-[10px] font-semibold text-gray-500 transition hover:bg-white/[0.05] hover:text-gray-300"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>

      </div>

      {/* =========================================================
          SUMMARY CARDS
      ========================================================= */}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

        <SummaryCard
          title="Total Accounts"
          value={accounts.length.toString()}
          subtitle={`${activeCount} currently active`}
          icon={BarChart3}
          iconClass="text-blue-400"
        />

        <SummaryCard
          title="Total Balance"
          value={`$${totalBalance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}`}
          subtitle="Across all accounts"
          icon={Wallet}
          iconClass="text-emerald-400"
        />

        <SummaryCard
          title="Total Equity"
          value={`$${totalEquity.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}`}
          subtitle="Current account equity"
          icon={CircleDollarSign}
          iconClass="text-purple-400"
        />

        <SummaryCard
          title="Pending / Suspended"
          value={`${pendingCount + suspendedCount}`}
          subtitle={`${pendingCount} pending • ${suspendedCount} suspended`}
          icon={ShieldCheck}
          iconClass="text-amber-400"
        />

      </div>

      {/* =========================================================
          ACCOUNT TABLE
      ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b]">

        {/* Toolbar */}

        <div className="flex flex-col gap-3 border-b border-white/[0.05] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-xs font-semibold text-gray-300">
              Customer Trading Accounts
            </h2>

            <p className="mt-1 text-[9px] text-gray-700">
              {filteredAccounts.length} account
              {filteredAccounts.length !== 1 ? "s" : ""} displayed
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            {/* Search */}

            <div className="relative">

              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-700" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search account or user..."
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] pl-9 pr-3 text-[10px] text-gray-300 outline-none placeholder:text-gray-700 transition focus:border-red-500/30 sm:w-60"
              />

            </div>

            {/* Filter */}

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-[10px] font-semibold transition ${
                showFilters || statusFilter !== "All"
                  ? "border-red-500/20 bg-red-500/10 text-red-400"
                  : "border-white/[0.06] bg-white/[0.02] text-gray-600 hover:text-gray-300"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>

          </div>

        </div>

        {/* Filter Panel */}

        {showFilters && (
          <div className="border-b border-white/[0.05] bg-white/[0.01] px-4 py-3 sm:px-5">

            <div className="flex flex-wrap items-center gap-2">

              {(
                ["All", "Active", "Suspended", "Pending", "Closed"] as const
              ).map((status) => (

                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${
                    statusFilter === status
                      ? "bg-red-500/10 text-red-400"
                      : "bg-white/[0.025] text-gray-600 hover:text-gray-300"
                  }`}
                >
                  {status}
                </button>

              ))}

            </div>

          </div>
        )}

        {/* =======================================================
            TABLE
        ======================================================= */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1250px]">

            <thead>

              <tr className="border-b border-white/[0.04] bg-white/[0.015]">

                <TableHead label="Trading Account" />
                <TableHead label="Customer" />
                <TableHead label="Type" />
                <TableHead label="Balance" />
                <TableHead label="Equity" />
                <TableHead label="P/L" />
                <TableHead label="Trades" />
                <TableHead label="Status" />
                <TableHead label="Action" />

              </tr>

            </thead>

            <tbody className="divide-y divide-white/[0.04]">

              {filteredAccounts.length > 0 ? (

                filteredAccounts.map((account) => (

                  <tr
                    key={account.id}
                    className="transition hover:bg-white/[0.015]"
                  >

                    {/* Account */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2.5">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                          <Activity className="h-3.5 w-3.5 text-red-400" />
                        </div>

                        <div>

                          <div className="flex items-center gap-1.5">

                            <p className="font-mono text-[10px] font-semibold text-gray-400">
                              {account.accountNumber}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                copyAccountNumber(
                                  account.accountNumber
                                )
                              }
                              className="text-gray-700 transition hover:text-gray-300"
                            >
                              {copied ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>

                          </div>

                          <p className="mt-0.5 text-[8px] text-gray-700">
                            {account.id}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Customer */}

                    <td className="px-4 py-4">

                      <Link
                        href={`/admin/users/${account.userId}`}
                        className="group flex items-center gap-2.5"
                      >

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-600 to-gray-900 text-[9px] font-bold text-gray-300">
                          {getInitials(account.name)}
                        </div>

                        <div>

                          <p className="text-[10px] font-semibold text-gray-400 transition group-hover:text-white">
                            {account.name}
                          </p>

                          <p className="mt-0.5 text-[8px] text-gray-700">
                            {account.email}
                          </p>

                        </div>

                      </Link>

                    </td>

                    {/* Type */}

                    <td className="px-4 py-4">

                      <div>

                        <p className="text-[9px] font-semibold text-gray-400">
                          {account.accountType}
                        </p>

                        <p className="mt-1 text-[8px] text-gray-700">
                          Leverage {account.leverage}
                        </p>

                      </div>

                    </td>

                    {/* Balance */}

                    <td className="px-4 py-4">

                      <p className="text-[10px] font-bold text-white">
                        {account.balance}
                      </p>

                    </td>

                    {/* Equity */}

                    <td className="px-4 py-4">

                      <div>

                        <p className="text-[10px] font-semibold text-gray-300">
                          {account.equity}
                        </p>

                        <p className="mt-1 text-[8px] text-gray-700">
                          Free {account.freeMargin}
                        </p>

                      </div>

                    </td>

                    {/* P/L */}

                    <td className="px-4 py-4">

                      <PnLValue pnl={account.pnl} />

                    </td>

                    {/* Trades */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-1.5">

                        <Activity className="h-3 w-3 text-gray-700" />

                        <span className="text-[9px] font-semibold text-gray-500">
                          {account.trades}
                        </span>

                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-4 py-4">

                      <StatusBadge status={account.status} />

                    </td>

                    {/* Action */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-1.5">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedAccount(account)
                          }
                          title="View account"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] text-gray-600 transition hover:bg-white/[0.06] hover:text-gray-300"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          title="Account options"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 transition hover:bg-white/[0.04] hover:text-gray-400"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={9}
                    className="px-6 py-16 text-center"
                  >

                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03]">
                      <Search className="h-4 w-4 text-gray-700" />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-gray-500">
                      No trading accounts found
                    </p>

                    <p className="mt-1 text-[9px] text-gray-700">
                      Try changing your search or filter.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =======================================================
            PAGINATION
        ======================================================= */}

        <div className="flex flex-col gap-3 border-t border-white/[0.05] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

          <p className="text-[9px] text-gray-700">

            Showing{" "}

            <span className="font-semibold text-gray-500">
              {filteredAccounts.length}
            </span>{" "}

            of{" "}

            <span className="font-semibold text-gray-500">
              {accounts.length}
            </span>{" "}

            accounts

          </p>

          <div className="flex items-center gap-1.5">

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.02] text-gray-700 transition hover:text-gray-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-red-500/10 px-2 text-[9px] font-semibold text-red-400">
              1
            </span>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.02] text-gray-700 transition hover:text-gray-300"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

          </div>

        </div>

      </div>

      {/* =========================================================
          INFORMATION PANEL
      ========================================================= */}

      <div className="grid gap-3 md:grid-cols-3">

        <InfoCard
          icon={ShieldCheck}
          title="Account Controls"
          text="Administrators will be able to suspend, activate and manage account permissions."
        />

        <InfoCard
          icon={CircleDollarSign}
          title="Financial Overview"
          text="Monitor balances, equity, margin and available funds across customer accounts."
        />

        <InfoCard
          icon={Activity}
          title="Trading Activity"
          text="Review account trading activity, open positions and transaction history."
        />

      </div>

      {/* =========================================================
          ACCOUNT MODAL
      ========================================================= */}

      {selectedAccount && (
        <AccountModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}

    </div>
  );
}

/* ========================================================================
   SUMMARY CARD
========================================================================= */

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4 sm:p-5">

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
        <Icon className={`h-4 w-4 ${iconClass}`} />
      </div>

      <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-600">
        {title}
      </p>

      <p className="mt-1 text-lg font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-[8px] text-gray-700">
        {subtitle}
      </p>

    </div>
  );
}

/* ========================================================================
   STATUS BADGE
========================================================================= */

function StatusBadge({
  status,
}: {
  status: AccountStatus;
}) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-emerald-400">
        <CheckCircle2 className="h-3 w-3" />
        Active
      </span>
    );
  }

  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-amber-400">
        <Clock3 className="h-3 w-3" />
        Pending
      </span>
    );
  }

  if (status === "Suspended") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-red-400">
        <Ban className="h-3 w-3" />
        Suspended
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-gray-500">
      <XCircle className="h-3 w-3" />
      Closed
    </span>
  );
}

/* ========================================================================
   P/L VALUE
========================================================================= */

function PnLValue({ pnl }: { pnl: string }) {
  const positive = pnl.startsWith("+");
  const negative = pnl.startsWith("-");

  return (
    <div className="flex items-center gap-1.5">

      {positive && (
        <ArrowUpRight className="h-3 w-3 text-emerald-400" />
      )}

      {negative && (
        <ArrowDownRight className="h-3 w-3 text-red-400" />
      )}

      {!positive && !negative && (
        <span className="h-3 w-3 text-center text-[8px] text-gray-700">
          —
        </span>
      )}

      <span
        className={`text-[9px] font-semibold ${
          positive
            ? "text-emerald-400"
            : negative
              ? "text-red-400"
              : "text-gray-600"
        }`}
      >
        {pnl}
      </span>

    </div>
  );
}

/* ========================================================================
   TABLE HEAD
========================================================================= */

function TableHead({ label }: { label: string }) {
  return (
    <th className="px-4 py-3 text-left text-[8px] font-bold uppercase tracking-wider text-gray-700">
      {label}
    </th>
  );
}

/* ========================================================================
   INFO CARD
========================================================================= */

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4">

      <div className="flex items-center gap-2.5">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
          <Icon className="h-3.5 w-3.5 text-gray-500" />
        </div>

        <p className="text-[10px] font-semibold text-gray-400">
          {title}
        </p>

      </div>

      <p className="mt-3 text-[9px] leading-4 text-gray-700">
        {text}
      </p>

    </div>
  );
}

/* ========================================================================
   ACCOUNT MODAL
========================================================================= */

function AccountModal({
  account,
  onClose,
}: {
  account: TradingAccount;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0d121b] shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/[0.05] p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10">
              <Activity className="h-4 w-4 text-red-400" />
            </div>

            <div>

              <h2 className="text-xs font-bold text-white">
                Trading Account
              </h2>

              <p className="mt-1 font-mono text-[8px] text-gray-700">
                {account.accountNumber}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white/[0.04] hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>

        </div>

        {/* Content */}

        <div className="space-y-5 p-5">

          {/* Account Overview */}

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gray-600 to-gray-900 text-xs font-bold text-gray-300">
                  {getInitials(account.name)}
                </div>

                <div>

                  <p className="text-sm font-bold text-white">
                    {account.name}
                  </p>

                  <p className="mt-1 text-[9px] text-gray-600">
                    {account.email}
                  </p>

                </div>

              </div>

              <StatusBadge status={account.status} />

            </div>

          </div>

          {/* Financial Metrics */}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

            <Metric
              label="Balance"
              value={account.balance}
            />

            <Metric
              label="Equity"
              value={account.equity}
            />

            <Metric
              label="Margin"
              value={account.margin}
            />

            <Metric
              label="Free Margin"
              value={account.freeMargin}
            />

          </div>

          {/* Account Details */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <DetailItem
              icon={User}
              label="Customer ID"
              value={account.userId}
            />

            <DetailItem
              icon={BarChart3}
              label="Account Type"
              value={account.accountType}
            />

            <DetailItem
              icon={Activity}
              label="Leverage"
              value={account.leverage}
            />

            <DetailItem
              icon={CalendarDays}
              label="Created"
              value={account.created}
            />

          </div>

          {/* Performance */}

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] uppercase tracking-wider text-gray-700">
                  Current P/L
                </p>

                <div className="mt-2">
                  <PnLValue pnl={account.pnl} />
                </div>

              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.035]">
                {account.pnl.startsWith("-") ? (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                )}
              </div>

            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3">

              <span className="text-[9px] text-gray-700">
                Total Trades
              </span>

              <span className="text-[10px] font-semibold text-gray-400">
                {account.trades}
              </span>

            </div>

          </div>

          {/* Actions */}

          <div className="grid grid-cols-1 gap-2 border-t border-white/[0.05] pt-5 sm:grid-cols-3">

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-[9px] font-semibold text-gray-500 transition hover:bg-white/[0.04] hover:text-gray-300"
            >
              <Eye className="h-3.5 w-3.5" />
              View Trades
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-[9px] font-semibold text-gray-500 transition hover:bg-white/[0.04] hover:text-gray-300"
            >
              <Wallet className="h-3.5 w-3.5" />
              Transactions
            </button>

            <Link
              href={`/admin/users/${account.userId}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-[9px] font-semibold text-gray-500 transition hover:bg-white/[0.04] hover:text-gray-300"
            >
              <User className="h-3.5 w-3.5" />
              Customer
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

/* ========================================================================
   METRIC
========================================================================= */

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-3">

      <p className="text-[8px] uppercase tracking-wider text-gray-700">
        {label}
      </p>

      <p className="mt-2 text-[10px] font-bold text-gray-300">
        {value}
      </p>

    </div>
  );
}

/* ========================================================================
   DETAIL ITEM
========================================================================= */

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-3">

      <div className="flex items-center gap-2">

        <Icon className="h-3 w-3 text-gray-700" />

        <p className="text-[8px] uppercase tracking-wider text-gray-700">
          {label}
        </p>

      </div>

      <p className="mt-2 text-[10px] font-semibold text-gray-400">
        {value}
      </p>

    </div>
  );
}

/* ========================================================================
   HELPERS
========================================================================= */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function parseMoney(value: string) {
  return Number(value.replace(/[$,]/g, ""));
}