"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  XCircle,
  MoreHorizontal,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  BarChart3,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Ban,
  Edit3,
  Copy,
  Check,
  ChevronRight,
  DollarSign,
  CircleDollarSign,
  CreditCard,
  RefreshCw,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  status: "Active" | "Pending" | "Suspended";
  tradingStatus: "Trading" | "Not Trading";
  accountType: "Standard" | "Professional";
  balance: string;
  equity: string;
  freeMargin: string;
  marginUsed: string;
  marginLevel: string;
  totalProfit: string;
  totalDeposits: string;
  totalWithdrawals: string;
  trades: number;
  winRate: string;
  joined: string;
  lastActive: string;
  location: string;
  verified: boolean;
}

/*
|--------------------------------------------------------------------------
| DEMO USER
|--------------------------------------------------------------------------
| This is temporary frontend data.
| Later we will replace this with your Node.js/MySQL API.
|--------------------------------------------------------------------------
*/

const user: UserData = {
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
  freeMargin: "$18,920.00",
  marginUsed: "$7,500.00",
  marginLevel: "352.27%",
  totalProfit: "+$1,570.00",
  totalDeposits: "$28,000.00",
  totalWithdrawals: "$3,150.00",
  trades: 148,
  winRate: "68.9%",
  joined: "August 10, 2026",
  lastActive: "2 minutes ago",
  location: "Nairobi, Kenya",
  verified: true,
};

/*
|--------------------------------------------------------------------------
| TRANSACTIONS
|--------------------------------------------------------------------------
*/

const transactions = [
  {
    id: "TXN-849201",
    type: "Deposit",
    amount: "+$5,000.00",
    method: "Bank Transfer",
    date: "Aug 10, 2026",
    status: "Completed",
  },
  {
    id: "TXN-849102",
    type: "Withdrawal",
    amount: "-$1,200.00",
    method: "Bank Transfer",
    date: "Aug 08, 2026",
    status: "Completed",
  },
  {
    id: "TXN-848930",
    type: "Deposit",
    amount: "+$3,500.00",
    method: "Card",
    date: "Aug 05, 2026",
    status: "Completed",
  },
  {
    id: "TXN-848701",
    type: "Deposit",
    amount: "+$2,000.00",
    method: "M-Pesa",
    date: "Aug 02, 2026",
    status: "Completed",
  },
];

/*
|--------------------------------------------------------------------------
| OPEN POSITIONS
|--------------------------------------------------------------------------
*/

const positions = [
  {
    symbol: "EUR/USD",
    type: "BUY",
    volume: "0.50",
    openPrice: "1.16420",
    currentPrice: "1.16682",
    profit: "+$131.00",
  },
  {
    symbol: "GBP/USD",
    type: "SELL",
    volume: "0.30",
    openPrice: "1.34480",
    currentPrice: "1.34210",
    profit: "+$81.00",
  },
  {
    symbol: "XAU/USD",
    type: "BUY",
    volume: "0.20",
    openPrice: "3,341.20",
    currentPrice: "3,348.60",
    profit: "+$148.00",
  },
];

/*
|--------------------------------------------------------------------------
| TRADE HISTORY
|--------------------------------------------------------------------------
*/

const trades = [
  {
    symbol: "EUR/USD",
    type: "BUY",
    volume: "0.50",
    open: "1.16120",
    close: "1.16480",
    profit: "+$180.00",
    date: "Aug 10, 2026",
  },
  {
    symbol: "XAU/USD",
    type: "SELL",
    volume: "0.10",
    open: "3,360.40",
    close: "3,352.10",
    profit: "+$83.00",
    date: "Aug 09, 2026",
  },
  {
    symbol: "GBP/USD",
    type: "BUY",
    volume: "0.20",
    open: "1.33820",
    close: "1.34140",
    profit: "+$64.00",
    date: "Aug 08, 2026",
  },
  {
    symbol: "USD/JPY",
    type: "SELL",
    volume: "0.30",
    open: "148.920",
    close: "149.080",
    profit: "-$32.00",
    date: "Aug 08, 2026",
  },
];

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function AdminUserDetailsPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "trades"
  >("overview");

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // Clipboard may not be available in some browsers.
    }
  };

  return (
    <div className="space-y-6">
      {/* ============================================================
          TOP NAVIGATION
      ============================================================ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/users"
          className="inline-flex w-fit items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-[10px] font-semibold text-gray-500 transition hover:bg-white/[0.05] hover:text-gray-200"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit User
          </button>

          <button
            type="button"
            className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-2.5 text-gray-500 transition hover:bg-white/[0.05] hover:text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ============================================================
          USER PROFILE HEADER
      ============================================================ */}

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b]">
        <div className="h-20 bg-gradient-to-r from-red-950/40 via-[#0d121b] to-[#0d121b]" />

        <div className="px-5 pb-5 sm:px-6">
          <div className="-mt-9 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="flex h-18 w-18 items-center justify-center rounded-2xl border-4 border-[#0d121b] bg-gradient-to-br from-gray-600 to-gray-900 text-lg font-bold text-gray-200 shadow-xl">
                  {user.initials}
                </div>

                {user.tradingStatus === "Trading" && (
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#0d121b] bg-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                )}
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-white">
                    {user.name}
                  </h1>

                  {user.verified && (
                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-gray-600">
                    {user.id}
                  </span>

                  <button
                    type="button"
                    onClick={copyUserId}
                    className="text-gray-700 transition hover:text-gray-300"
                    title="Copy user ID"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>

                  <span className="h-1 w-1 rounded-full bg-gray-700" />

                  <span className="text-[10px] text-gray-600">
                    {user.accountType} Account
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <UserStatus status={user.status} />

              <TradingStatus status={user.tradingStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          ACCOUNT METRICS
      ============================================================ */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          title="Account Balance"
          value={user.balance}
          icon={Wallet}
          action={
            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-700 transition hover:text-gray-300"
            >
              {showBalance ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          }
          hidden={!showBalance}
        />

        <MetricCard
          title="Equity"
          value={user.equity}
          icon={CircleDollarSign}
          iconClass="text-blue-400"
        />

        <MetricCard
          title="Free Margin"
          value={user.freeMargin}
          icon={Activity}
          iconClass="text-emerald-400"
        />

        <MetricCard
          title="Total Profit"
          value={user.totalProfit}
          icon={TrendingUp}
          iconClass="text-emerald-400"
          positive
        />
      </div>

      {/* ============================================================
          ACCOUNT INFORMATION + RISK
      ============================================================ */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Account information */}

        <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-5 xl:col-span-2">
          <SectionHeader
            title="Account Information"
            subtitle="Personal and account details"
            icon={UserCheck}
          />

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow
              icon={Mail}
              label="Email Address"
              value={user.email}
            />

            <InfoRow
              icon={Phone}
              label="Phone Number"
              value={user.phone}
            />

            <InfoRow
              icon={MapPin}
              label="Location"
              value={user.location}
            />

            <InfoRow
              icon={CalendarDays}
              label="Registered"
              value={user.joined}
            />

            <InfoRow
              icon={Wallet}
              label="Account Type"
              value={user.accountType}
            />

            <InfoRow
              icon={Activity}
              label="Last Active"
              value={user.lastActive}
            />
          </div>
        </div>

        {/* Margin / Risk */}

        <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-5">
          <SectionHeader
            title="Margin & Risk"
            subtitle="Current account exposure"
            icon={BarChart3}
          />

          <div className="mt-5 space-y-4">
            <RiskRow
              label="Margin Used"
              value={user.marginUsed}
              percentage={28}
            />

            <RiskRow
              label="Free Margin"
              value={user.freeMargin}
              percentage={72}
            />

            <div className="border-t border-white/[0.05] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-600">
                  Margin Level
                </span>

                <span className="text-sm font-bold text-emerald-400">
                  {user.marginLevel}
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: "76%" }}
                />
              </div>

              <p className="mt-2 text-[8px] text-gray-700">
                Account currently within healthy risk limits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          TABS
      ============================================================ */}

      <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b]">
        <div className="flex overflow-x-auto border-b border-white/[0.05]">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon={BarChart3}
            label="Overview"
          />

          <TabButton
            active={activeTab === "transactions"}
            onClick={() => setActiveTab("transactions")}
            icon={CreditCard}
            label="Transactions"
          />

          <TabButton
            active={activeTab === "trades"}
            onClick={() => setActiveTab("trades")}
            icon={History}
            label="Trade History"
          />
        </div>

        <div className="p-5 sm:p-6">
          {activeTab === "overview" && (
            <OverviewTab />
          )}

          {activeTab === "transactions" && (
            <TransactionsTab />
          )}

          {activeTab === "trades" && <TradesTab />}
        </div>
      </div>

      {/* ============================================================
          ADMIN CONTROLS
      ============================================================ */}

      <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-5 sm:p-6">
        <SectionHeader
          title="Account Controls"
          subtitle="Administrative actions for this account"
          icon={ShieldCheck}
        />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ControlButton
            icon={Unlock}
            title="Trading Access"
            description="Allow trading"
            type="success"
          />

          <ControlButton
            icon={Lock}
            title="Freeze Account"
            description="Temporarily lock"
            type="warning"
          />

          <ControlButton
            icon={RefreshCw}
            title="Reset Password"
            description="Send reset link"
            type="neutral"
          />

          <ControlButton
            icon={Ban}
            title="Suspend User"
            description="Disable account"
            type="danger"
          />
        </div>
      </div>

      {/* ============================================================
          SECURITY NOTICE
      ============================================================ */}

      <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/[0.025] p-4 sm:flex-row sm:items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
        </div>

        <div className="flex-1">
          <p className="text-[11px] font-semibold text-gray-300">
            Administrative actions
          </p>

          <p className="mt-0.5 text-[9px] leading-4 text-gray-600">
            Account changes, trading restrictions, balance adjustments
            and security actions should be recorded in the audit log.
          </p>
        </div>

        <Link
          href="/admin/audit-logs"
          className="text-[10px] font-semibold text-amber-400 transition hover:text-amber-300"
        >
          Audit Logs
        </Link>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| OVERVIEW TAB
|--------------------------------------------------------------------------
*/

function OverviewTab() {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-gray-300">
              Open Positions
            </h3>

            <p className="mt-1 text-[9px] text-gray-700">
              Currently active trades
            </p>
          </div>

          <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[9px] font-semibold text-blue-400">
            {positions.length} Open
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/[0.05]">
          <table className="w-full min-w-[650px]">
            <thead>
              <tr className="border-b border-white/[0.04] bg-white/[0.015]">
                <TableHead label="Symbol" />
                <TableHead label="Type" />
                <TableHead label="Volume" />
                <TableHead label="Open Price" />
                <TableHead label="Current Price" />
                <TableHead label="Profit" />
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {positions.map((position) => (
                <tr
                  key={position.symbol}
                  className="transition hover:bg-white/[0.015]"
                >
                  <td className="px-4 py-3 text-xs font-semibold text-gray-300">
                    {position.symbol}
                  </td>

                  <td className="px-4 py-3">
                    <TradeType type={position.type} />
                  </td>

                  <td className="px-4 py-3 text-[10px] text-gray-500">
                    {position.volume}
                  </td>

                  <td className="px-4 py-3 font-mono text-[10px] text-gray-500">
                    {position.openPrice}
                  </td>

                  <td className="px-4 py-3 font-mono text-[10px] text-gray-400">
                    {position.currentPrice}
                  </td>

                  <td className="px-4 py-3 text-xs font-semibold text-emerald-400">
                    {position.profit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-300">
            Trading Statistics
          </h3>

          <p className="mt-1 text-[9px] text-gray-700">
            Performance summary for this account
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBox
            label="Total Trades"
            value={String(user.trades)}
            icon={Activity}
          />

          <StatBox
            label="Win Rate"
            value={user.winRate}
            icon={TrendingUp}
            positive
          />

          <StatBox
            label="Deposits"
            value={user.totalDeposits}
            icon={ArrowDownToLine}
          />

          <StatBox
            label="Withdrawals"
            value={user.totalWithdrawals}
            icon={ArrowUpFromLine}
          />
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| TRANSACTIONS TAB
|--------------------------------------------------------------------------
*/

function TransactionsTab() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-gray-300">
            Account Transactions
          </h3>

          <p className="mt-1 text-[9px] text-gray-700">
            Deposits and withdrawals
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-white/[0.035] px-3 py-2 text-[9px] font-semibold text-gray-500 transition hover:bg-white/[0.06] hover:text-gray-300"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/[0.05]">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/[0.04] bg-white/[0.015]">
              <TableHead label="Transaction" />
              <TableHead label="Type" />
              <TableHead label="Method" />
              <TableHead label="Date" />
              <TableHead label="Amount" />
              <TableHead label="Status" />
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.04]">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="transition hover:bg-white/[0.015]"
              >
                <td className="px-4 py-3">
                  <p className="text-[10px] font-semibold text-gray-400">
                    {transaction.id}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <TransactionType type={transaction.type} />
                </td>

                <td className="px-4 py-3 text-[10px] text-gray-500">
                  {transaction.method}
                </td>

                <td className="px-4 py-3 text-[10px] text-gray-600">
                  {transaction.date}
                </td>

                <td
                  className={`px-4 py-3 text-xs font-semibold ${
                    transaction.type === "Deposit"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {transaction.amount}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-semibold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| TRADE HISTORY TAB
|--------------------------------------------------------------------------
*/

function TradesTab() {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-300">
          Trade History
        </h3>

        <p className="mt-1 text-[9px] text-gray-700">
          Recently completed positions
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/[0.05]">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/[0.04] bg-white/[0.015]">
              <TableHead label="Symbol" />
              <TableHead label="Type" />
              <TableHead label="Volume" />
              <TableHead label="Open" />
              <TableHead label="Close" />
              <TableHead label="Profit / Loss" />
              <TableHead label="Date" />
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.04]">
            {trades.map((trade, index) => (
              <tr
                key={`${trade.symbol}-${index}`}
                className="transition hover:bg-white/[0.015]"
              >
                <td className="px-4 py-3 text-xs font-semibold text-gray-300">
                  {trade.symbol}
                </td>

                <td className="px-4 py-3">
                  <TradeType type={trade.type} />
                </td>

                <td className="px-4 py-3 text-[10px] text-gray-500">
                  {trade.volume}
                </td>

                <td className="px-4 py-3 font-mono text-[10px] text-gray-500">
                  {trade.open}
                </td>

                <td className="px-4 py-3 font-mono text-[10px] text-gray-400">
                  {trade.close}
                </td>

                <td
                  className={`px-4 py-3 text-xs font-semibold ${
                    trade.profit.startsWith("+")
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {trade.profit}
                </td>

                <td className="px-4 py-3 text-[10px] text-gray-600">
                  {trade.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| USER STATUS
|--------------------------------------------------------------------------
*/

function UserStatus({
  status,
}: {
  status: "Active" | "Pending" | "Suspended";
}) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1.5 text-[9px] font-semibold text-emerald-400">
        <CheckCircle2 className="h-3 w-3" />
        Active
      </span>
    );
  }

  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1.5 text-[9px] font-semibold text-amber-400">
        <Clock3 className="h-3 w-3" />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1.5 text-[9px] font-semibold text-red-400">
      <XCircle className="h-3 w-3" />
      Suspended
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| TRADING STATUS
|--------------------------------------------------------------------------
*/

function TradingStatus({
  status,
}: {
  status: "Trading" | "Not Trading";
}) {
  if (status === "Trading") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1.5 text-[9px] font-semibold text-blue-400">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400" />
        </span>
        Trading
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.035] px-2.5 py-1.5 text-[9px] font-semibold text-gray-500">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-600" />
      Not Trading
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| METRIC CARD
|--------------------------------------------------------------------------
*/

function MetricCard({
  title,
  value,
  icon: Icon,
  iconClass = "text-gray-400",
  action,
  hidden = false,
  positive = false,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  iconClass?: string;
  action?: React.ReactNode;
  hidden?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
          <Icon className={`h-4 w-4 ${iconClass}`} />
        </div>

        {action}
      </div>

      <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-600">
        {title}
      </p>

      <p
        className={`mt-1 text-lg font-bold tracking-tight ${
          positive ? "text-emerald-400" : "text-white"
        }`}
      >
        {hidden ? "••••••" : value}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| SECTION HEADER
|--------------------------------------------------------------------------
*/

function SectionHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
        <Icon className="h-4 w-4 text-gray-500" />
      </div>

      <div>
        <h2 className="text-xs font-semibold text-gray-300">
          {title}
        </h2>

        <p className="mt-0.5 text-[9px] text-gray-700">{subtitle}</p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| INFO ROW
|--------------------------------------------------------------------------
*/

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.015] p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.035]">
        <Icon className="h-3.5 w-3.5 text-gray-600" />
      </div>

      <div className="min-w-0">
        <p className="text-[8px] uppercase tracking-wider text-gray-700">
          {label}
        </p>

        <p className="mt-1 truncate text-[10px] font-medium text-gray-400">
          {value}
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| RISK ROW
|--------------------------------------------------------------------------
*/

function RiskRow({
  label,
  value,
  percentage,
}: {
  label: string;
  value: string;
  percentage: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-gray-600">{label}</span>

        <span className="text-[10px] font-semibold text-gray-400">
          {value}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
        <div
          className="h-full rounded-full bg-gray-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| TAB BUTTON
|--------------------------------------------------------------------------
*/

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex shrink-0 items-center gap-2 px-5 py-4 text-[10px] font-semibold transition ${
        active
          ? "text-white"
          : "text-gray-600 hover:text-gray-300"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />

      {label}

      {active && (
        <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-red-500" />
      )}
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| TABLE HEAD
|--------------------------------------------------------------------------
*/

function TableHead({ label }: { label: string }) {
  return (
    <th className="px-4 py-3 text-left text-[8px] font-bold uppercase tracking-wider text-gray-700">
      {label}
    </th>
  );
}

/*
|--------------------------------------------------------------------------
| TRADE TYPE
|--------------------------------------------------------------------------
*/

function TradeType({ type }: { type: "BUY" | "SELL" }) {
  const buy = type === "BUY";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[8px] font-bold ${
        buy
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {buy ? (
        <TrendingUp className="h-2.5 w-2.5" />
      ) : (
        <TrendingDown className="h-2.5 w-2.5" />
      )}

      {type}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| TRANSACTION TYPE
|--------------------------------------------------------------------------
*/

function TransactionType({ type }: { type: "Deposit" | "Withdrawal" }) {
  const deposit = type === "Deposit";

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[9px] font-semibold ${
        deposit ? "text-emerald-400" : "text-red-400"
      }`}
    >
      {deposit ? (
        <ArrowDownToLine className="h-3 w-3" />
      ) : (
        <ArrowUpFromLine className="h-3 w-3" />
      )}

      {type}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| STAT BOX
|--------------------------------------------------------------------------
*/

function StatBox({
  label,
  value,
  icon: Icon,
  positive = false,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
      <Icon
        className={`h-4 w-4 ${
          positive ? "text-emerald-400" : "text-gray-600"
        }`}
      />

      <p className="mt-3 text-[8px] uppercase tracking-wider text-gray-700">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-bold ${
          positive ? "text-emerald-400" : "text-gray-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| CONTROL BUTTON
|--------------------------------------------------------------------------
*/

function ControlButton({
  icon: Icon,
  title,
  description,
  type,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  type: "success" | "warning" | "danger" | "neutral";
}) {
  const styles = {
    success: {
      icon: "text-emerald-400",
      hover: "hover:border-emerald-500/20",
    },
    warning: {
      icon: "text-amber-400",
      hover: "hover:border-amber-500/20",
    },
    danger: {
      icon: "text-red-400",
      hover: "hover:border-red-500/20",
    },
    neutral: {
      icon: "text-gray-400",
      hover: "hover:border-white/[0.12]",
    },
  };

  return (
    <button
      type="button"
      className={`flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3 text-left transition ${styles[type].hover}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.035]">
        <Icon className={`h-4 w-4 ${styles[type].icon}`} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-400">
          {title}
        </p>

        <p className="mt-0.5 text-[8px] text-gray-700">
          {description}
        </p>
      </div>

      <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-gray-700" />
    </button>
  );
}