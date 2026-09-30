"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpFromLine,
   ArrowDownToLine,
  Search,
  Filter,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Check,
  X,
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
  TrendingDown,
  ShieldCheck,
  X as CloseIcon,
} from "lucide-react";

type WithdrawalStatus = "Pending" | "Completed" | "Rejected";

interface Withdrawal {
  id: string;
  userId: string;
  name: string;
  email: string;
  amount: string;
  method: string;
  account: string;
  requested: string;
  status: WithdrawalStatus;
}

const withdrawals: Withdrawal[] = [
  {
    id: "WD-100842",
    userId: "PM-100245",
    name: "James Mwangi",
    email: "james.m@example.com",
    amount: "$1,200.00",
    method: "Bank Transfer",
    account: "**** 4821",
    requested: "Aug 10, 2026 • 10:42 AM",
    status: "Pending",
  },
  {
    id: "WD-100831",
    userId: "PM-100198",
    name: "Brian Otieno",
    email: "brian.o@example.com",
    amount: "$750.00",
    method: "M-Pesa",
    account: "**** 7812",
    requested: "Aug 10, 2026 • 08:16 AM",
    status: "Pending",
  },
  {
    id: "WD-100802",
    userId: "PM-100176",
    name: "Sarah Wanjiku",
    email: "sarah.w@example.com",
    amount: "$2,500.00",
    method: "Bank Transfer",
    account: "**** 9043",
    requested: "Aug 09, 2026 • 04:28 PM",
    status: "Pending",
  },
  {
    id: "WD-100744",
    userId: "PM-100142",
    name: "David Kamau",
    email: "david.k@example.com",
    amount: "$450.00",
    method: "Card",
    account: "**** 2219",
    requested: "Aug 08, 2026 • 01:35 PM",
    status: "Completed",
  },
  {
    id: "WD-100710",
    userId: "PM-100118",
    name: "Kevin Maina",
    email: "kevin.m@example.com",
    amount: "$1,850.00",
    method: "Bank Transfer",
    account: "**** 6190",
    requested: "Aug 07, 2026 • 11:12 AM",
    status: "Completed",
  },
  {
    id: "WD-100682",
    userId: "PM-100095",
    name: "Mercy Achieng",
    email: "mercy.a@example.com",
    amount: "$320.00",
    method: "M-Pesa",
    account: "**** 3351",
    requested: "Aug 06, 2026 • 09:48 AM",
    status: "Rejected",
  },
  {
    id: "WD-100651",
    userId: "PM-100081",
    name: "Alex Kiptoo",
    email: "alex.k@example.com",
    amount: "$980.00",
    method: "Bank Transfer",
    account: "**** 5702",
    requested: "Aug 05, 2026 • 03:21 PM",
    status: "Completed",
  },
  {
    id: "WD-100620",
    userId: "PM-100067",
    name: "Peter Njoroge",
    email: "peter.n@example.com",
    amount: "$600.00",
    method: "M-Pesa",
    account: "**** 4487",
    requested: "Aug 04, 2026 • 02:06 PM",
    status: "Completed",
  },
];

export default function AdminWithdrawalsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | WithdrawalStatus
  >("All");

  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((withdrawal) => {
      const matchesSearch =
        withdrawal.name.toLowerCase().includes(search.toLowerCase()) ||
        withdrawal.email.toLowerCase().includes(search.toLowerCase()) ||
        withdrawal.id.toLowerCase().includes(search.toLowerCase()) ||
        withdrawal.userId.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        withdrawal.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const pendingCount = withdrawals.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedCount = withdrawals.filter(
    (item) => item.status === "Completed"
  ).length;

  const rejectedCount = withdrawals.filter(
    (item) => item.status === "Rejected"
  ).length;

  const pendingAmount = withdrawals
    .filter((item) => item.status === "Pending")
    .reduce((total, item) => {
      return total + Number(item.amount.replace(/[$,]/g, ""));
    }, 0);

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
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
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
              <ArrowDownToLine className="h-5 w-5 text-red-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Withdrawals
              </h1>

              <p className="mt-1 text-[10px] text-gray-600">
                Review and manage customer withdrawal requests
              </p>
            </div>
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
          title="Pending Requests"
          value={pendingCount.toString()}
          subtitle="Awaiting review"
          icon={Clock3}
          iconClass="text-amber-400"
        />

        <SummaryCard
          title="Pending Amount"
          value={`$${pendingAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}`}
          subtitle="Awaiting processing"
          icon={Wallet}
          iconClass="text-blue-400"
        />

        <SummaryCard
          title="Completed"
          value={completedCount.toString()}
          subtitle="Successfully processed"
          icon={CheckCircle2}
          iconClass="text-emerald-400"
        />

        <SummaryCard
          title="Rejected"
          value={rejectedCount.toString()}
          subtitle="Requests rejected"
          icon={XCircle}
          iconClass="text-red-400"
        />
      </div>

      {/* =========================================================
          PENDING ALERT
      ========================================================= */}

      {pendingCount > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/[0.025] p-4 sm:flex-row sm:items-center">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>

          <div className="flex-1">
            <p className="text-[11px] font-semibold text-gray-300">
              {pendingCount} withdrawal requests require attention
            </p>

            <p className="mt-1 text-[9px] text-gray-600">
              Review customer details and payment information before
              approving withdrawals.
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
          MAIN TABLE CARD
      ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b]">
        {/* Toolbar */}

        <div className="flex flex-col gap-3 border-b border-white/[0.05] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xs font-semibold text-gray-300">
              Withdrawal Requests
            </h2>

            <p className="mt-1 text-[9px] text-gray-700">
              {filteredWithdrawals.length} request
              {filteredWithdrawals.length !== 1 ? "s" : ""} displayed
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
                placeholder="Search user or ID..."
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] pl-9 pr-3 text-[10px] text-gray-300 outline-none placeholder:text-gray-700 transition focus:border-red-500/30 sm:w-56"
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
              {(["All", "Pending", "Completed", "Rejected"] as const).map(
                (status) => (
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
                )
              )}
            </div>
          </div>
        )}

        {/* =======================================================
            TABLE
        ======================================================= */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-white/[0.04] bg-white/[0.015]">
                <TableHead label="Request" />
                <TableHead label="Customer" />
                <TableHead label="Amount" />
                <TableHead label="Payment Method" />
                <TableHead label="Requested" />
                <TableHead label="Status" />
                <TableHead label="Action" />
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((withdrawal) => (
                  <tr
                    key={withdrawal.id}
                    className="transition hover:bg-white/[0.015]"
                  >
                    {/* Request */}

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                          <ArrowUpFromLine className="h-3.5 w-3.5 text-red-400" />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-mono text-[10px] font-semibold text-gray-400">
                              {withdrawal.id}
                            </p>

                            <button
                              type="button"
                              onClick={() => copyId(withdrawal.id)}
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
                            {withdrawal.userId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}

                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/users/${withdrawal.userId}`}
                        className="group flex items-center gap-2.5"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-600 to-gray-900 text-[9px] font-bold text-gray-300">
                          {getInitials(withdrawal.name)}
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold text-gray-400 transition group-hover:text-white">
                            {withdrawal.name}
                          </p>

                          <p className="mt-0.5 text-[8px] text-gray-700">
                            {withdrawal.email}
                          </p>
                        </div>
                      </Link>
                    </td>

                    {/* Amount */}

                    <td className="px-4 py-4">
                      <p className="text-xs font-bold text-white">
                        {withdrawal.amount}
                      </p>
                    </td>

                    {/* Method */}

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.035]">
                          <CreditCard className="h-3 w-3 text-gray-600" />
                        </div>

                        <div>
                          <p className="text-[9px] font-semibold text-gray-400">
                            {withdrawal.method}
                          </p>

                          <p className="mt-0.5 text-[8px] text-gray-700">
                            {withdrawal.account}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Requested */}

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-3 w-3 text-gray-700" />

                        <span className="text-[9px] text-gray-600">
                          {withdrawal.requested}
                        </span>
                      </div>
                    </td>

                    {/* Status */}

                    <td className="px-4 py-4">
                      <StatusBadge status={withdrawal.status} />
                    </td>

                    {/* Action */}

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedWithdrawal(withdrawal)
                          }
                          title="View withdrawal"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] text-gray-600 transition hover:bg-white/[0.06] hover:text-gray-300"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {withdrawal.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              title="Approve"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500/20"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              title="Reject"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}

                        <button
                          type="button"
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
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03]">
                      <Search className="h-4 w-4 text-gray-700" />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-gray-500">
                      No withdrawals found
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
              {filteredWithdrawals.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-500">
              {withdrawals.length}
            </span>{" "}
            withdrawals
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
          PAYMENT PROCESSING NOTICE
      ========================================================= */}

      <div className="flex flex-col gap-3 rounded-2xl border border-blue-500/10 bg-blue-500/[0.02] p-4 sm:flex-row sm:items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
          <Wallet className="h-4 w-4 text-blue-400" />
        </div>

        <div>
          <p className="text-[10px] font-semibold text-gray-400">
            Withdrawal processing
          </p>

          <p className="mt-1 text-[9px] leading-4 text-gray-700">
            Always verify the customer&apos;s account balance, identity,
            payment method and withdrawal amount before approving a request.
          </p>
        </div>
      </div>

      {/* =========================================================
          VIEW MODAL
      ========================================================= */}

      {selectedWithdrawal && (
        <WithdrawalModal
          withdrawal={selectedWithdrawal}
          onClose={() => setSelectedWithdrawal(null)}
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
      <div className="flex items-start justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
          <Icon className={`h-4 w-4 ${iconClass}`} />
        </div>
      </div>

      <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-600">
        {title}
      </p>

      <p className="mt-1 text-lg font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-[8px] text-gray-700">{subtitle}</p>
    </div>
  );
}

/* ========================================================================
   STATUS BADGE
========================================================================= */

function StatusBadge({
  status,
}: {
  status: WithdrawalStatus;
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

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-red-400">
      <XCircle className="h-3 w-3" />
      Rejected
    </span>
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
   WITHDRAWAL MODAL
========================================================================= */

function WithdrawalModal({
  withdrawal,
  onClose,
}: {
  withdrawal: Withdrawal;
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
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d121b] shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-white/[0.05] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10">
              <ArrowDownToLine className="h-4 w-4 text-red-400" />
            </div>

            <div>
              <h2 className="text-xs font-bold text-white">
                Withdrawal Details
              </h2>

              <p className="mt-1 font-mono text-[8px] text-gray-700">
                {withdrawal.id}
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
          {/* Amount */}

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-5 text-center">
            <p className="text-[8px] uppercase tracking-[0.15em] text-gray-700">
              Withdrawal Amount
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              {withdrawal.amount}
            </p>

            <div className="mt-2 flex justify-center">
              <StatusBadge status={withdrawal.status} />
            </div>
          </div>

          {/* Customer */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailItem
              icon={User}
              label="Customer"
              value={withdrawal.name}
            />

            <DetailItem
              icon={CreditCard}
              label="Payment Method"
              value={withdrawal.method}
            />

            <DetailItem
              icon={Wallet}
              label="Account"
              value={withdrawal.account}
            />

            <DetailItem
              icon={CalendarDays}
              label="Requested"
              value={withdrawal.requested}
            />
          </div>

          {/* Actions */}

          {withdrawal.status === "Pending" && (
            <div className="grid grid-cols-2 gap-3 border-t border-white/[0.05] pt-5">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-[10px] font-bold text-emerald-400 transition hover:bg-emerald-500/20"
              >
                <Check className="h-3.5 w-3.5" />
                Approve Withdrawal
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-[10px] font-bold text-red-400 transition hover:bg-red-500/20"
              >
                <X className="h-3.5 w-3.5" />
                Reject Withdrawal
              </button>
            </div>
          )}

          <Link
            href={`/admin/users/${withdrawal.userId}`}
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