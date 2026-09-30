"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Search,
  Filter,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Copy,
  CalendarDays,
  CreditCard,
  Wallet,
  User,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  X,
} from "lucide-react";

type TransactionType =
  | "Deposit"
  | "Withdrawal"
  | "Transfer"
  | "Fee";

type TransactionStatus =
  | "Pending"
  | "Completed"
  | "Rejected"
  | "Failed";

interface Transaction {
  id: string;
  userId: string;
  name: string;
  email: string;
  type: TransactionType;
  amount: string;
  method: string;
  reference: string;
  date: string;
  status: TransactionStatus;
}

const transactions: Transaction[] = [
  {
    id: "TX-108421",
    userId: "PM-100245",
    name: "James Mwangi",
    email: "james.m@example.com",
    type: "Deposit",
    amount: "$2,500.00",
    method: "Bank Transfer",
    reference: "DEP-7F42A91",
    date: "Aug 10, 2026 • 11:24 AM",
    status: "Pending",
  },
  {
    id: "TX-108407",
    userId: "PM-100198",
    name: "Brian Otieno",
    email: "brian.o@example.com",
    type: "Deposit",
    amount: "$1,000.00",
    method: "M-Pesa",
    reference: "DEP-5K81B20",
    date: "Aug 10, 2026 • 09:18 AM",
    status: "Pending",
  },
  {
    id: "TX-108362",
    userId: "PM-100176",
    name: "Sarah Wanjiku",
    email: "sarah.w@example.com",
    type: "Deposit",
    amount: "$5,000.00",
    method: "Card",
    reference: "DEP-8P39D17",
    date: "Aug 09, 2026 • 04:46 PM",
    status: "Completed",
  },
  {
    id: "TX-108311",
    userId: "PM-100142",
    name: "David Kamau",
    email: "david.k@example.com",
    type: "Withdrawal",
    amount: "$750.00",
    method: "M-Pesa",
    reference: "WDL-4M27L65",
    date: "Aug 08, 2026 • 01:15 PM",
    status: "Completed",
  },
  {
    id: "TX-108274",
    userId: "PM-100118",
    name: "Kevin Maina",
    email: "kevin.m@example.com",
    type: "Withdrawal",
    amount: "$3,200.00",
    method: "Bank Transfer",
    reference: "WDL-2Q64N81",
    date: "Aug 07, 2026 • 10:32 AM",
    status: "Completed",
  },
  {
    id: "TX-108231",
    userId: "PM-100095",
    name: "Mercy Achieng",
    email: "mercy.a@example.com",
    type: "Withdrawal",
    amount: "$500.00",
    method: "M-Pesa",
    reference: "WDL-9X12R43",
    date: "Aug 06, 2026 • 03:08 PM",
    status: "Rejected",
  },
  {
    id: "TX-108194",
    userId: "PM-100081",
    name: "Alex Kiptoo",
    email: "alex.k@example.com",
    type: "Deposit",
    amount: "$7,500.00",
    method: "Bank Transfer",
    reference: "DEP-3V71T88",
    date: "Aug 05, 2026 • 12:41 PM",
    status: "Completed",
  },
  {
    id: "TX-108162",
    userId: "PM-100067",
    name: "Peter Njoroge",
    email: "peter.n@example.com",
    type: "Fee",
    amount: "$25.00",
    method: "Trading Fee",
    reference: "FEE-6B45W29",
    date: "Aug 04, 2026 • 02:18 PM",
    status: "Completed",
  },
  {
    id: "TX-108109",
    userId: "PM-100054",
    name: "Samuel Kiplagat",
    email: "samuel.k@example.com",
    type: "Transfer",
    amount: "$1,800.00",
    method: "Internal Transfer",
    reference: "TRF-8N21K44",
    date: "Aug 03, 2026 • 05:42 PM",
    status: "Completed",
  },
  {
    id: "TX-108074",
    userId: "PM-100041",
    name: "Mary Njeri",
    email: "mary.n@example.com",
    type: "Withdrawal",
    amount: "$1,250.00",
    method: "Bank Transfer",
    reference: "WDL-1P73C52",
    date: "Aug 02, 2026 • 10:14 AM",
    status: "Failed",
  },
];

export default function AdminTransactionsPage() {
  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState<
    "All" | TransactionType
  >("All");

  const [statusFilter, setStatusFilter] = useState<
    "All" | TransactionStatus
  >("All");

  const [showFilters, setShowFilters] = useState(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [copied, setCopied] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        transaction.id.toLowerCase().includes(searchValue) ||
        transaction.userId.toLowerCase().includes(searchValue) ||
        transaction.name.toLowerCase().includes(searchValue) ||
        transaction.email.toLowerCase().includes(searchValue) ||
        transaction.reference.toLowerCase().includes(searchValue) ||
        transaction.method.toLowerCase().includes(searchValue);

      const matchesType =
        typeFilter === "All" ||
        transaction.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        transaction.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [search, typeFilter, statusFilter]);

  const pending = transactions.filter(
    (transaction) => transaction.status === "Pending"
  );

  const completed = transactions.filter(
    (transaction) => transaction.status === "Completed"
  );

  const rejected = transactions.filter(
    (transaction) =>
      transaction.status === "Rejected" ||
      transaction.status === "Failed"
  );

  const depositAmount = transactions
    .filter(
      (transaction) =>
        transaction.type === "Deposit" &&
        transaction.status === "Completed"
    )
    .reduce(
      (total, transaction) =>
        total + parseMoney(transaction.amount),
      0
    );

  const withdrawalAmount = transactions
    .filter(
      (transaction) =>
        transaction.type === "Withdrawal" &&
        transaction.status === "Completed"
    )
    .reduce(
      (total, transaction) =>
        total + parseMoney(transaction.amount),
      0
    );

  const copyReference = async (reference: string) => {
    try {
      await navigator.clipboard.writeText(reference);
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
          HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <ArrowLeftRight className="h-5 w-5 text-blue-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Transactions
            </h1>

            <p className="mt-1 text-[10px] text-gray-600">
              Monitor and manage all PIPMASTER financial transactions
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
          SUMMARY
      ========================================================= */}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

        <SummaryCard
          title="Total Transactions"
          value={transactions.length.toString()}
          subtitle="All recorded transactions"
          icon={ArrowLeftRight}
          iconClass="text-blue-400"
        />

        <SummaryCard
          title="Pending"
          value={pending.length.toString()}
          subtitle="Require attention"
          icon={Clock3}
          iconClass="text-amber-400"
        />

        <SummaryCard
          title="Deposits"
          value={`$${depositAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}`}
          subtitle="Completed deposits"
          icon={TrendingUp}
          iconClass="text-emerald-400"
        />

        <SummaryCard
          title="Withdrawals"
          value={`$${withdrawalAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}`}
          subtitle="Completed withdrawals"
          icon={TrendingDown}
          iconClass="text-red-400"
        />

      </div>

      {/* =========================================================
          ALERT
      ========================================================= */}

      {pending.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/[0.025] p-4 sm:flex-row sm:items-center">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>

          <div className="flex-1">

            <p className="text-[11px] font-semibold text-gray-300">
              {pending.length} transactions require attention
            </p>

            <p className="mt-1 text-[9px] text-gray-600">
              Review pending transactions before processing them.
            </p>

          </div>

          <button
            type="button"
            onClick={() => setStatusFilter("Pending")}
            className="text-left text-[10px] font-semibold text-amber-400 transition hover:text-amber-300 sm:text-right"
          >
            View pending
          </button>

        </div>
      )}

      {/* =========================================================
          TRANSACTION TABLE
      ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b]">

        {/* Toolbar */}

        <div className="flex flex-col gap-3 border-b border-white/[0.05] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-xs font-semibold text-gray-300">
              Transaction History
            </h2>

            <p className="mt-1 text-[9px] text-gray-700">
              {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1 ? "s" : ""} displayed
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
                placeholder="Search transactions..."
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] pl-9 pr-3 text-[10px] text-gray-300 outline-none placeholder:text-gray-700 transition focus:border-blue-500/30 sm:w-60"
              />

            </div>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-[10px] font-semibold transition ${
                showFilters ||
                typeFilter !== "All" ||
                statusFilter !== "All"
                  ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                  : "border-white/[0.06] bg-white/[0.02] text-gray-600 hover:text-gray-300"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>

          </div>

        </div>

        {/* Filters */}

        {showFilters && (
          <div className="space-y-3 border-b border-white/[0.05] bg-white/[0.01] px-4 py-4 sm:px-5">

            <div>

              <p className="mb-2 text-[8px] font-bold uppercase tracking-wider text-gray-700">
                Transaction Type
              </p>

              <div className="flex flex-wrap gap-2">

                {(
                  [
                    "All",
                    "Deposit",
                    "Withdrawal",
                    "Transfer",
                    "Fee",
                  ] as const
                ).map((type) => (

                  <button
                    key={type}
                    type="button"
                    onClick={() => setTypeFilter(type)}
                    className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${
                      typeFilter === type
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-white/[0.025] text-gray-600 hover:text-gray-300"
                    }`}
                  >
                    {type}
                  </button>

                ))}

              </div>

            </div>

            <div>

              <p className="mb-2 text-[8px] font-bold uppercase tracking-wider text-gray-700">
                Status
              </p>

              <div className="flex flex-wrap gap-2">

                {(
                  [
                    "All",
                    "Pending",
                    "Completed",
                    "Rejected",
                    "Failed",
                  ] as const
                ).map((status) => (

                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${
                      statusFilter === status
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-white/[0.025] text-gray-600 hover:text-gray-300"
                    }`}
                  >
                    {status}
                  </button>

                ))}

              </div>

            </div>

          </div>
        )}

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px]">

            <thead>

              <tr className="border-b border-white/[0.04] bg-white/[0.015]">

                <TableHead label="Transaction" />
                <TableHead label="Customer" />
                <TableHead label="Type" />
                <TableHead label="Amount" />
                <TableHead label="Method" />
                <TableHead label="Reference" />
                <TableHead label="Date" />
                <TableHead label="Status" />
                <TableHead label="Action" />

              </tr>

            </thead>

            <tbody className="divide-y divide-white/[0.04]">

              {filteredTransactions.length > 0 ? (

                filteredTransactions.map((transaction) => (

                  <tr
                    key={transaction.id}
                    className="transition hover:bg-white/[0.015]"
                  >

                    {/* Transaction */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2.5">

                        <TransactionIcon
                          type={transaction.type}
                        />

                        <div>

                          <p className="font-mono text-[10px] font-semibold text-gray-400">
                            {transaction.id}
                          </p>

                          <p className="mt-0.5 text-[8px] text-gray-700">
                            {transaction.type}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Customer */}

                    <td className="px-4 py-4">

                      <Link
                        href={`/admin/users/${transaction.userId}`}
                        className="group flex items-center gap-2.5"
                      >

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-600 to-gray-900 text-[9px] font-bold text-gray-300">
                          {getInitials(transaction.name)}
                        </div>

                        <div>

                          <p className="text-[10px] font-semibold text-gray-400 transition group-hover:text-white">
                            {transaction.name}
                          </p>

                          <p className="mt-0.5 text-[8px] text-gray-700">
                            {transaction.email}
                          </p>

                        </div>

                      </Link>

                    </td>

                    {/* Type */}

                    <td className="px-4 py-4">

                      <TransactionTypeBadge
                        type={transaction.type}
                      />

                    </td>

                    {/* Amount */}

                    <td className="px-4 py-4">

                      <p
                        className={`text-xs font-bold ${
                          transaction.type === "Withdrawal"
                            ? "text-red-400"
                            : transaction.type === "Fee"
                              ? "text-gray-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {transaction.type === "Withdrawal"
                          ? "-"
                          : transaction.type === "Fee"
                            ? "-"
                            : "+"}
                        {transaction.amount}
                      </p>

                    </td>

                    {/* Method */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2">

                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.035]">
                          <CreditCard className="h-3 w-3 text-gray-600" />
                        </div>

                        <span className="text-[9px] font-semibold text-gray-400">
                          {transaction.method}
                        </span>

                      </div>

                    </td>

                    {/* Reference */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-1.5">

                        <span className="font-mono text-[9px] text-gray-600">
                          {transaction.reference}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            copyReference(transaction.reference)
                          }
                          className="text-gray-700 transition hover:text-gray-300"
                        >
                          {copied ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>

                      </div>

                    </td>

                    {/* Date */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2">

                        <CalendarDays className="h-3 w-3 text-gray-700" />

                        <span className="text-[9px] text-gray-600">
                          {transaction.date}
                        </span>

                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-4 py-4">

                      <StatusBadge
                        status={transaction.status}
                      />

                    </td>

                    {/* Action */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-1.5">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedTransaction(transaction)
                          }
                          title="View transaction"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] text-gray-600 transition hover:bg-white/[0.06] hover:text-gray-300"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          title="More options"
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
                      No transactions found
                    </p>

                    <p className="mt-1 text-[9px] text-gray-700">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}

        <div className="flex flex-col gap-3 border-t border-white/[0.05] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

          <p className="text-[9px] text-gray-700">

            Showing{" "}

            <span className="font-semibold text-gray-500">
              {filteredTransactions.length}
            </span>{" "}

            of{" "}

            <span className="font-semibold text-gray-500">
              {transactions.length}
            </span>{" "}

            transactions

          </p>

          <div className="flex items-center gap-1.5">

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.02] text-gray-700 transition hover:text-gray-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-blue-500/10 px-2 text-[9px] font-semibold text-blue-400">
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
          INFORMATION
      ========================================================= */}

      <div className="grid gap-3 md:grid-cols-3">

        <InfoCard
          icon={ShieldCheck}
          title="Transaction Security"
          text="Every financial transaction should be verified and recorded for audit and compliance."
        />

        <InfoCard
          icon={Wallet}
          title="Balance Control"
          text="Deposits and withdrawals should update customer account balances through secure database transactions."
        />

        <InfoCard
          icon={CircleDollarSign}
          title="Financial Records"
          text="Maintain a complete transaction history so administrators can track every account movement."
        />

      </div>

      {/* =========================================================
          MODAL
      ========================================================= */}

      {selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
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
   TRANSACTION ICON
========================================================================= */

function TransactionIcon({
  type,
}: {
  type: TransactionType;
}) {
  if (type === "Deposit") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
        <ArrowDownToLine className="h-3.5 w-3.5 text-emerald-400" />
      </div>
    );
  }

  if (type === "Withdrawal") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
        <ArrowUpFromLine className="h-3.5 w-3.5 text-red-400" />
      </div>
    );
  }

  if (type === "Transfer") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
        <ArrowLeftRight className="h-3.5 w-3.5 text-blue-400" />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500/10">
      <CircleDollarSign className="h-3.5 w-3.5 text-gray-400" />
    </div>
  );
}

/* ========================================================================
   TRANSACTION TYPE BADGE
========================================================================= */

function TransactionTypeBadge({
  type,
}: {
  type: TransactionType;
}) {
  const styles = {
    Deposit: "bg-emerald-500/10 text-emerald-400",
    Withdrawal: "bg-red-500/10 text-red-400",
    Transfer: "bg-blue-500/10 text-blue-400",
    Fee: "bg-gray-500/10 text-gray-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1.5 text-[8px] font-semibold ${styles[type]}`}
    >
      {type}
    </span>
  );
}

/* ========================================================================
   STATUS BADGE
========================================================================= */

function StatusBadge({
  status,
}: {
  status: TransactionStatus;
}) {
  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-amber-400">
        <Clock3 className="h-3 w-3" />
        Pending
      </span>
    );
  }

  if (status === "Completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-emerald-400">
        <CheckCircle2 className="h-3 w-3" />
        Completed
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-red-400">
        <XCircle className="h-3 w-3" />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-orange-400">
      <XCircle className="h-3 w-3" />
      Failed
    </span>
  );
}

/* ========================================================================
   TABLE HEAD
========================================================================= */

function TableHead({
  label,
}: {
  label: string;
}) {
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
   TRANSACTION MODAL
========================================================================= */

function TransactionModal({
  transaction,
  onClose,
}: {
  transaction: Transaction;
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

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d121b] shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/[0.05] p-5">

          <div className="flex items-center gap-3">

            <TransactionIcon type={transaction.type} />

            <div>
              <h2 className="text-xs font-bold text-white">
                Transaction Details
              </h2>

              <p className="mt-1 font-mono text-[8px] text-gray-700">
                {transaction.id}
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

        <div className="space-y-5 p-5">

          {/* Amount */}

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-5 text-center">

            <p className="text-[8px] uppercase tracking-[0.15em] text-gray-700">
              Transaction Amount
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              {transaction.amount}
            </p>

            <div className="mt-2 flex justify-center">
              <StatusBadge status={transaction.status} />
            </div>

          </div>

          {/* Details */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <DetailItem
              icon={User}
              label="Customer"
              value={transaction.name}
            />

            <DetailItem
              icon={ArrowLeftRight}
              label="Transaction Type"
              value={transaction.type}
            />

            <DetailItem
              icon={CreditCard}
              label="Payment Method"
              value={transaction.method}
            />

            <DetailItem
              icon={CalendarDays}
              label="Date"
              value={transaction.date}
            />

            <DetailItem
              icon={Wallet}
              label="Reference"
              value={transaction.reference}
            />

            <DetailItem
              icon={ShieldCheck}
              label="Transaction ID"
              value={transaction.id}
            />

          </div>

          {/* Customer */}

          <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.035] text-[9px] font-bold text-gray-400">
                {getInitials(transaction.name)}
              </div>

              <div>

                <p className="text-[10px] font-semibold text-gray-400">
                  {transaction.name}
                </p>

                <p className="mt-1 text-[9px] text-gray-700">
                  {transaction.email}
                </p>

                <p className="mt-1 font-mono text-[8px] text-gray-700">
                  {transaction.userId}
                </p>

              </div>

            </div>

          </div>

          {/* Action */}

          <Link
            href={`/admin/users/${transaction.userId}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-[10px] font-semibold text-gray-500 transition hover:bg-white/[0.04] hover:text-gray-300"
          >
            <User className="h-3.5 w-3.5" />
            View Customer Account
          </Link>

        </div>

      </div>

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

      <p className="mt-2 break-all text-[10px] font-semibold text-gray-400">
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