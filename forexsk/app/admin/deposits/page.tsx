"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
 import {
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
  TrendingUp,
  ShieldCheck,
  X as CloseIcon,
} from "lucide-react";


type DepositStatus = "Pending" | "Completed" | "Rejected";

interface Deposit {
  id: string;
  userId: string;
  name: string;
  email: string;
  amount: string;
  method: string;
  reference: string;
  requested: string;
  status: DepositStatus;
}

const deposits: Deposit[] = [
  {
    id: "DP-100842",
    userId: "PM-100245",
    name: "James Mwangi",
    email: "james.m@example.com",
    amount: "$2,500.00",
    method: "Bank Transfer",
    reference: "DEP-7F42A91",
    requested: "Aug 10, 2026 • 11:24 AM",
    status: "Pending",
  },
  {
    id: "DP-100831",
    userId: "PM-100198",
    name: "Brian Otieno",
    email: "brian.o@example.com",
    amount: "$1,000.00",
    method: "M-Pesa",
    reference: "DEP-5K81B20",
    requested: "Aug 10, 2026 • 09:18 AM",
    status: "Pending",
  },
  {
    id: "DP-100802",
    userId: "PM-100176",
    name: "Sarah Wanjiku",
    email: "sarah.w@example.com",
    amount: "$5,000.00",
    method: "Card",
    reference: "DEP-8P39D17",
    requested: "Aug 09, 2026 • 04:46 PM",
    status: "Completed",
  },
  {
    id: "DP-100744",
    userId: "PM-100142",
    name: "David Kamau",
    email: "david.k@example.com",
    amount: "$750.00",
    method: "M-Pesa",
    reference: "DEP-4M27L65",
    requested: "Aug 08, 2026 • 01:15 PM",
    status: "Completed",
  },
  {
    id: "DP-100710",
    userId: "PM-100118",
    name: "Kevin Maina",
    email: "kevin.m@example.com",
    amount: "$3,200.00",
    method: "Bank Transfer",
    reference: "DEP-2Q64N81",
    requested: "Aug 07, 2026 • 10:32 AM",
    status: "Completed",
  },
  {
    id: "DP-100682",
    userId: "PM-100095",
    name: "Mercy Achieng",
    email: "mercy.a@example.com",
    amount: "$500.00",
    method: "M-Pesa",
    reference: "DEP-9X12R43",
    requested: "Aug 06, 2026 • 03:08 PM",
    status: "Rejected",
  },
  {
    id: "DP-100651",
    userId: "PM-100081",
    name: "Alex Kiptoo",
    email: "alex.k@example.com",
    amount: "$7,500.00",
    method: "Bank Transfer",
    reference: "DEP-3V71T88",
    requested: "Aug 05, 2026 • 12:41 PM",
    status: "Completed",
  },
  {
    id: "DP-100620",
    userId: "PM-100067",
    name: "Peter Njoroge",
    email: "peter.n@example.com",
    amount: "$1,250.00",
    method: "Card",
    reference: "DEP-6B45W29",
    requested: "Aug 04, 2026 • 02:18 PM",
    status: "Completed",
  },
];

export default function AdminDepositsPage() {
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All" | DepositStatus
  >("All");

  const [showFilters, setShowFilters] = useState(false);

  const [selectedDeposit, setSelectedDeposit] =
    useState<Deposit | null>(null);

  const [copied, setCopied] = useState(false);

  const filteredDeposits = useMemo(() => {
    return deposits.filter((deposit) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        deposit.name.toLowerCase().includes(searchValue) ||
        deposit.email.toLowerCase().includes(searchValue) ||
        deposit.id.toLowerCase().includes(searchValue) ||
        deposit.userId.toLowerCase().includes(searchValue) ||
        deposit.reference.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        deposit.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const pendingDeposits = deposits.filter(
    (deposit) => deposit.status === "Pending"
  );

  const completedDeposits = deposits.filter(
    (deposit) => deposit.status === "Completed"
  );

  const rejectedDeposits = deposits.filter(
    (deposit) => deposit.status === "Rejected"
  );

  const pendingAmount = pendingDeposits.reduce(
    (total, deposit) => total + parseMoney(deposit.amount),
    0
  );

  const totalDeposited = completedDeposits.reduce(
    (total, deposit) => total + parseMoney(deposit.amount),
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
          PAGE HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <ArrowDownToLine className="h-5 w-5 text-emerald-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Deposits
            </h1>

            <p className="mt-1 text-[10px] text-gray-600">
              Review and manage customer deposit transactions
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
          title="Pending Deposits"
          value={pendingDeposits.length.toString()}
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
          value={`$${totalDeposited.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}`}
          subtitle={`${completedDeposits.length} successful deposits`}
          icon={CircleDollarSign}
          iconClass="text-emerald-400"
        />

        <SummaryCard
          title="Rejected"
          value={rejectedDeposits.length.toString()}
          subtitle="Rejected requests"
          icon={XCircle}
          iconClass="text-red-400"
        />

      </div>

      {/* =========================================================
          PENDING ALERT
      ========================================================= */}

      {pendingDeposits.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/10 bg-amber-500/[0.025] p-4 sm:flex-row sm:items-center">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>

          <div className="flex-1">

            <p className="text-[11px] font-semibold text-gray-300">
              {pendingDeposits.length} deposit requests require attention
            </p>

            <p className="mt-1 text-[9px] text-gray-600">
              Verify the payment reference and customer information before
              approving a deposit.
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
          MAIN TABLE
      ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b]">

        {/* Toolbar */}

        <div className="flex flex-col gap-3 border-b border-white/[0.05] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-xs font-semibold text-gray-300">
              Deposit Requests
            </h2>

            <p className="mt-1 text-[9px] text-gray-700">
              {filteredDeposits.length} deposit
              {filteredDeposits.length !== 1 ? "s" : ""} displayed
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
                placeholder="Search user or reference..."
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] pl-9 pr-3 text-[10px] text-gray-300 outline-none placeholder:text-gray-700 transition focus:border-emerald-500/30 sm:w-60"
              />

            </div>

            {/* Filter */}

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-[10px] font-semibold transition ${
                showFilters || statusFilter !== "All"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
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
                ["All", "Pending", "Completed", "Rejected"] as const
              ).map((status) => (

                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${
                    statusFilter === status
                      ? "bg-emerald-500/10 text-emerald-400"
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

          <table className="w-full min-w-[1100px]">

            <thead>

              <tr className="border-b border-white/[0.04] bg-white/[0.015]">

                <TableHead label="Deposit" />
                <TableHead label="Customer" />
                <TableHead label="Amount" />
                <TableHead label="Payment Method" />
                <TableHead label="Reference" />
                <TableHead label="Requested" />
                <TableHead label="Status" />
                <TableHead label="Action" />

              </tr>

            </thead>

            <tbody className="divide-y divide-white/[0.04]">

              {filteredDeposits.length > 0 ? (

                filteredDeposits.map((deposit) => (

                  <tr
                    key={deposit.id}
                    className="transition hover:bg-white/[0.015]"
                  >

                    {/* Deposit */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2.5">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                          <ArrowDownToLine className="h-3.5 w-3.5 text-emerald-400" />
                        </div>

                        <div>

                          <p className="font-mono text-[10px] font-semibold text-gray-400">
                            {deposit.id}
                          </p>

                          <p className="mt-0.5 text-[8px] text-gray-700">
                            {deposit.userId}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Customer */}

                    <td className="px-4 py-4">

                      <Link
                        href={`/admin/users/${deposit.userId}`}
                        className="group flex items-center gap-2.5"
                      >

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-600 to-gray-900 text-[9px] font-bold text-gray-300">
                          {getInitials(deposit.name)}
                        </div>

                        <div>

                          <p className="text-[10px] font-semibold text-gray-400 transition group-hover:text-white">
                            {deposit.name}
                          </p>

                          <p className="mt-0.5 text-[8px] text-gray-700">
                            {deposit.email}
                          </p>

                        </div>

                      </Link>

                    </td>

                    {/* Amount */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2">

                        <TrendingUp className="h-3 w-3 text-emerald-400" />

                        <p className="text-xs font-bold text-white">
                          {deposit.amount}
                        </p>

                      </div>

                    </td>

                    {/* Payment Method */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2">

                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.035]">
                          <CreditCard className="h-3 w-3 text-gray-600" />
                        </div>

                        <span className="text-[9px] font-semibold text-gray-400">
                          {deposit.method}
                        </span>

                      </div>

                    </td>

                    {/* Reference */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-1.5">

                        <span className="font-mono text-[9px] text-gray-600">
                          {deposit.reference}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            copyReference(deposit.reference)
                          }
                          className="text-gray-700 transition hover:text-gray-300"
                          title="Copy reference"
                        >
                          {copied ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>

                      </div>

                    </td>

                    {/* Requested */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2">

                        <CalendarDays className="h-3 w-3 text-gray-700" />

                        <span className="text-[9px] text-gray-600">
                          {deposit.requested}
                        </span>

                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-4 py-4">

                      <StatusBadge status={deposit.status} />

                    </td>

                    {/* Actions */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-1.5">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedDeposit(deposit)
                          }
                          title="View deposit"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] text-gray-600 transition hover:bg-white/[0.06] hover:text-gray-300"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {deposit.status === "Pending" && (
                          <>

                            <button
                              type="button"
                              title="Approve deposit"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 transition hover:bg-emerald-500/20"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              title="Reject deposit"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>

                          </>
                        )}

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
                    colSpan={8}
                    className="px-6 py-16 text-center"
                  >

                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03]">
                      <Search className="h-4 w-4 text-gray-700" />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-gray-500">
                      No deposits found
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
              {filteredDeposits.length}
            </span>{" "}

            of{" "}

            <span className="font-semibold text-gray-500">
              {deposits.length}
            </span>{" "}

            deposits

          </p>

          <div className="flex items-center gap-1.5">

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.02] text-gray-700 transition hover:text-gray-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-emerald-500/10 px-2 text-[9px] font-semibold text-emerald-400">
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
          INFORMATION CARDS
      ========================================================= */}

      <div className="grid gap-3 md:grid-cols-3">

        <InfoCard
          icon={ShieldCheck}
          title="Payment Verification"
          text="Verify payment references and transaction details before approving customer deposits."
        />

        <InfoCard
          icon={Wallet}
          title="Account Funding"
          text="Approved deposits should be reflected in the customer's trading account balance."
        />

        <InfoCard
          icon={CircleDollarSign}
          title="Transaction Control"
          text="Every deposit approval and rejection should be recorded for auditing and reconciliation."
        />

      </div>

      {/* =========================================================
          DEPOSIT MODAL
      ========================================================= */}

      {selectedDeposit && (
        <DepositModal
          deposit={selectedDeposit}
          onClose={() => setSelectedDeposit(null)}
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
  status: DepositStatus;
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
   DEPOSIT MODAL
========================================================================= */

function DepositModal({
  deposit,
  onClose,
}: {
  deposit: Deposit;
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

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
              <ArrowDownToLine className="h-4 w-4 text-emerald-400" />
            </div>

            <div>

              <h2 className="text-xs font-bold text-white">
                Deposit Details
              </h2>

              <p className="mt-1 font-mono text-[8px] text-gray-700">
                {deposit.id}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white/[0.04] hover:text-gray-300"
          >
            <CloseIcon className="h-4 w-4" />
          </button>

        </div>

        {/* Content */}

        <div className="space-y-5 p-5">

          {/* Amount */}

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-5 text-center">

            <p className="text-[8px] uppercase tracking-[0.15em] text-gray-700">
              Deposit Amount
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              {deposit.amount}
            </p>

            <div className="mt-2 flex justify-center">
              <StatusBadge status={deposit.status} />
            </div>

          </div>

          {/* Details */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <DetailItem
              icon={User}
              label="Customer"
              value={deposit.name}
            />

            <DetailItem
              icon={CreditCard}
              label="Payment Method"
              value={deposit.method}
            />

            <DetailItem
              icon={Wallet}
              label="Reference"
              value={deposit.reference}
            />

            <DetailItem
              icon={CalendarDays}
              label="Requested"
              value={deposit.requested}
            />

          </div>

          {/* Customer */}

          <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-3">

            <p className="text-[8px] uppercase tracking-wider text-gray-700">
              Customer Account
            </p>

            <p className="mt-2 text-[10px] font-semibold text-gray-400">
              {deposit.userId}
            </p>

            <p className="mt-1 text-[9px] text-gray-700">
              {deposit.email}
            </p>

          </div>

          {/* Actions */}

          {deposit.status === "Pending" && (

            <div className="grid grid-cols-2 gap-3 border-t border-white/[0.05] pt-5">

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-[10px] font-bold text-emerald-400 transition hover:bg-emerald-500/20"
              >
                <Check className="h-3.5 w-3.5" />
                Approve Deposit
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-[10px] font-bold text-red-400 transition hover:bg-red-500/20"
              >
                <X className="h-3.5 w-3.5" />
                Reject Deposit
              </button>

            </div>

          )}

          <Link
            href={`/admin/users/${deposit.userId}`}
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