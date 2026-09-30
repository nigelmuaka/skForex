"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import MarketTicker from "@/components/dashboard/MarketTicker";
import TradingChart from "@/components/dashboard/TradingChart";
import OrderBook from "@/components/dashboard/OrderBook";
import WatchList from "@/components/dashboard/WatchList";
import OpenPositions from "@/components/dashboard/OpenPositions";
import TradeHistory from "@/components/dashboard/TradeHistory";
import Portfolio from "@/components/dashboard/Portfolio";
import MarketNews from "@/components/dashboard/MarketNews";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Activity,
  BarChart3,
  CircleDollarSign,
  Loader2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Trade = {
  id?: number | string;
  user_id?: number;
  asset?: string;
  symbol?: string;
  pair?: string;
  type?: string;
  direction?: string;
  side?: string;
  amount?: number | string;
  stake?: number | string;
  profit?: number | string;
  payout?: number | string;
  result?: string;
  status?: string;
  created_at?: string;
  settled_at?: string;
};

type DashboardData = {
  user?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
  };

  wallet?: {
    balance?: number | string;
    demo_balance?: number | string;
    equity?: number | string;
    free_margin?: number | string;
    margin?: number | string;
  };

  balance?: number | string;
  demo_balance?: number | string;
  equity?: number | string;
  free_margin?: number | string;
  margin?: number | string;

  stats?: {
    balance?: number | string;
    equity?: number | string;
    freeMargin?: number | string;
    free_margin?: number | string;
    todayProfit?: number | string;
    today_profit?: number | string;
    openOrders?: number | string;
    open_orders?: number | string;
    winRate?: number | string;
    win_rate?: number | string;
    roi?: number | string;
  };
};

type ApiResponse<T> = {
  ok?: boolean;
  success?: boolean;
  message?: string;
  data?: T;
  dashboard?: T;
  trades?: T;
};

/* =========================================================
   HELPERS
========================================================= */

function numberValue(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function money(value: unknown): string {
  return numberValue(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function percentage(value: number): string {
  return `${Math.max(0, Math.min(100, value)).toFixed(1)}%`;
}

function getStatus(trade: Trade): string {
  return String(trade.status || trade.result || "").toLowerCase();
}

function getProfit(trade: Trade): number {
  return numberValue(trade.profit ?? trade.payout);
}

function getStake(trade: Trade): number {
  return numberValue(trade.stake ?? trade.amount);
}

function isSettled(trade: Trade): boolean {
  const status = getStatus(trade);

  return [
    "won",
    "win",
    "lost",
    "loss",
    "settled",
    "completed",
    "complete",
  ].includes(status);
}

function isWin(trade: Trade): boolean {
  const status = getStatus(trade);

  return (
    status === "won" ||
    status === "win" ||
    numberValue(trade.profit) > 0
  );
}

function isLoss(trade: Trade): boolean {
  const status = getStatus(trade);

  return (
    status === "lost" ||
    status === "loss" ||
    numberValue(trade.profit) < 0
  );
}

/* =========================================================
   SAFE JSON
========================================================= */

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/* =========================================================
   COMPONENT
========================================================= */

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* =======================================================
     LOAD REAL ACCOUNT DATA
  ======================================================= */

  const loadDashboard = useCallback(async (manual = false) => {
    try {
      if (manual) {
        setRefreshing(true);
      }

      setError("");

      const [dashboardResponse, tradesResponse] = await Promise.all([
        fetch("http://localhost:5000/api/dashboard", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }),

        fetch("http://localhost:5000/api/trades/history", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      /* ---------------------------------------------------
         DASHBOARD
      --------------------------------------------------- */

      const dashboardJson =
        await safeJson<ApiResponse<DashboardData>>(dashboardResponse);

      if (
        dashboardResponse.status === 401 ||
        dashboardResponse.status === 403
      ) {
        window.location.href = "/login";
        return;
      }

      if (dashboardResponse.ok && dashboardJson) {
        const dashboardData =
          dashboardJson.data ||
          dashboardJson.dashboard ||
          dashboardJson;

        setDashboard(dashboardData);
      }

      /* ---------------------------------------------------
         TRADE HISTORY
      --------------------------------------------------- */

      const tradesJson =
        await safeJson<ApiResponse<Trade[]>>(tradesResponse);

      if (tradesResponse.ok && tradesJson) {
        let tradeData: unknown =
          tradesJson.data ||
          tradesJson.trades ||
          [];

        /*
          Some backends return:

          {
            success: true,
            trades: [...]
          }

          Others return:

          {
            data: [...]
          }
        */

        if (Array.isArray(tradeData)) {
          setTrades(tradeData);
        }
      }

      if (!dashboardResponse.ok && !tradesResponse.ok) {
        setError("Unable to load your trading account.");
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(
        "Could not connect to the trading server. Make sure your Express backend is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [loadDashboard]);

  /* =======================================================
     REAL ACCOUNT VALUES
  ======================================================= */

  const accountBalance = useMemo(() => {
    return numberValue(
      dashboard?.wallet?.balance ??
        dashboard?.wallet?.demo_balance ??
        dashboard?.balance ??
        dashboard?.demo_balance ??
        dashboard?.stats?.balance
    );
  }, [dashboard]);

  const equity = useMemo(() => {
    return numberValue(
      dashboard?.wallet?.equity ??
        dashboard?.equity ??
        dashboard?.stats?.equity ??
        accountBalance
    );
  }, [dashboard, accountBalance]);

  const freeMargin = useMemo(() => {
    return numberValue(
      dashboard?.wallet?.free_margin ??
        dashboard?.wallet?.margin ??
        dashboard?.free_margin ??
        dashboard?.stats?.freeMargin ??
        dashboard?.stats?.free_margin ??
        equity
    );
  }, [dashboard, equity]);

  /* =======================================================
     REAL TRADE STATISTICS
  ======================================================= */

  const settledTrades = useMemo(
    () => trades.filter(isSettled),
    [trades]
  );

  const wins = useMemo(
    () => settledTrades.filter(isWin),
    [settledTrades]
  );

  const losses = useMemo(
    () => settledTrades.filter(isLoss),
    [settledTrades]
  );

  const openTrades = useMemo(
    () => trades.filter((trade) => !isSettled(trade)),
    [trades]
  );

  const totalProfit = useMemo(() => {
    return settledTrades.reduce((total, trade) => {
      return total + getProfit(trade);
    }, 0);
  }, [settledTrades]);

  const totalTraded = useMemo(() => {
    return trades.reduce((total, trade) => {
      return total + getStake(trade);
    }, 0);
  }, [trades]);

  const winRate = useMemo(() => {
    if (settledTrades.length === 0) {
      return 0;
    }

    return (wins.length / settledTrades.length) * 100;
  }, [settledTrades, wins]);

  const todayProfit = useMemo(() => {
    const today = new Date();

    return trades.reduce((total, trade) => {
      if (!trade.created_at && !trade.settled_at) {
        return total;
      }

      const dateString = trade.settled_at || trade.created_at;

      if (!dateString) {
        return total;
      }

      const tradeDate = new Date(dateString);

      if (
        tradeDate.getFullYear() === today.getFullYear() &&
        tradeDate.getMonth() === today.getMonth() &&
        tradeDate.getDate() === today.getDate()
      ) {
        return total + getProfit(trade);
      }

      return total;
    }, 0);
  }, [trades]);

  const roi = useMemo(() => {
    if (accountBalance <= 0) {
      return 0;
    }

    return (totalProfit / accountBalance) * 100;
  }, [totalProfit, accountBalance]);

  /* =======================================================
     DISPLAY USER
  ======================================================= */

  const userName =
    dashboard?.user?.name ||
    "Trader";

  /* =======================================================
     STAT CARD
  ======================================================= */

  function StatCard({
    title,
    value,
    icon,
    subtitle,
    positive,
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    subtitle?: string;
    positive?: boolean;
  }) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-[#15181C] p-4 transition hover:border-zinc-700">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {title}
            </p>

            <p className="mt-2 text-xl font-bold tracking-tight text-white">
              {value}
            </p>

            {subtitle && (
              <p
                className={`mt-1 flex items-center gap-1 text-xs ${
                  positive === true
                    ? "text-emerald-400"
                    : positive === false
                    ? "text-red-400"
                    : "text-zinc-500"
                }`}
              >
                {positive === true && (
                  <TrendingUp className="h-3.5 w-3.5" />
                )}

                {positive === false && (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}

                {subtitle}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-yellow-400">
            {icon}
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />

          <p className="text-sm text-zinc-500">
            Loading trading account...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="min-h-full w-full space-y-4 pb-8">

      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-[#15181C] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="min-w-0">

          <div className="flex items-center gap-3">

            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />

            <h1 className="truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
              Trading Terminal
            </h1>

          </div>

          <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
            Welcome back, {userName}. Monitor markets and manage your account.
          </p>

        </div>

        {/* ACTIONS */}

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:w-auto">

          <button
            type="button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>

          <Link
            href="/dashboard/deposit"
            className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400 active:scale-[0.98]"
          >
            <ArrowDownToLine className="h-4 w-4" />

            Deposit
          </Link>

          <Link
            href="/dashboard/withdrawal"
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-yellow-500/50 hover:bg-zinc-800 active:scale-[0.98]"
          >
            <ArrowUpFromLine className="h-4 w-4" />

            Withdraw
          </Link>

        </div>

      </section>


      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-semibold text-red-400">
                Connection problem
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadDashboard(true)}
              className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
            >
              Try Again
            </button>

          </div>

        </section>
      )}


      {/* ===================================================
          MARKET TICKER
      =================================================== */}

      <section className="w-full min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C]">

        <MarketTicker />

      </section>


      {/* ===================================================
          REAL ACCOUNT STATS
      =================================================== */}

      <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Account Balance"
          value={`$${money(accountBalance)}`}
          icon={<Wallet className="h-5 w-5" />}
          subtitle="Current wallet balance"
        />

        <StatCard
          title="Equity"
          value={`$${money(equity)}`}
          icon={<CircleDollarSign className="h-5 w-5" />}
          subtitle="Current account equity"
        />

        <StatCard
          title="Today's P/L"
          value={`${todayProfit >= 0 ? "+" : "-"}$${money(
            Math.abs(todayProfit)
          )}`}
          icon={<Activity className="h-5 w-5" />}
          subtitle={
            todayProfit >= 0
              ? "Today's trading performance"
              : "Today's trading loss"
          }
          positive={todayProfit >= 0 ? true : false}
        />

        <StatCard
          title="Free Margin"
          value={`$${money(freeMargin)}`}
          icon={<BarChart3 className="h-5 w-5" />}
          subtitle={`${openTrades.length} open trade${
            openTrades.length === 1 ? "" : "s"
          }`}
        />

      </section>


      {/* ===================================================
          TRADING PERFORMANCE
      =================================================== */}

      <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-zinc-800 bg-[#15181C] p-4">

          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Total Trades
          </p>

          <p className="mt-2 text-xl font-bold text-white">
            {trades.length}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            {settledTrades.length} settled
          </p>

        </div>


        <div className="rounded-xl border border-zinc-800 bg-[#15181C] p-4">

          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Win Rate
          </p>

          <p className="mt-2 text-xl font-bold text-white">
            {percentage(winRate)}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            {wins.length} wins / {losses.length} losses
          </p>

        </div>


        <div className="rounded-xl border border-zinc-800 bg-[#15181C] p-4">

          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Total P/L
          </p>

          <p
            className={`mt-2 text-xl font-bold ${
              totalProfit >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {totalProfit >= 0 ? "+" : "-"}$
            {money(Math.abs(totalProfit))}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Settled trades
          </p>

        </div>


        <div className="rounded-xl border border-zinc-800 bg-[#15181C] p-4">

          <p className="text-xs uppercase tracking-wide text-zinc-500">
            ROI
          </p>

          <p
            className={`mt-2 text-xl font-bold ${
              roi >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {roi >= 0 ? "+" : ""}
            {roi.toFixed(2)}%
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Based on account balance
          </p>

        </div>

      </section>


      {/* ===================================================
          MAIN TRADING TERMINAL
      =================================================== */}

      <section className="min-w-0">

        <div className="h-[450px] overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C] sm:h-[560px] lg:h-[650px]">

          <TradingChart />

        </div>

      </section>


      {/* ===================================================
          ORDER BOOK + WATCHLIST
      =================================================== */}

      <section className="grid min-w-0 gap-4 lg:grid-cols-2">

        {/* ORDER BOOK */}

        <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C]">

          <OrderBook />

        </div>


        {/* WATCHLIST */}

        <div className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C]">

          <WatchList />

        </div>

      </section>


      {/* ===================================================
          PORTFOLIO + OPEN POSITIONS
      =================================================== */}

      <section className="grid min-w-0 gap-4 xl:grid-cols-12">

        {/* PORTFOLIO */}

        <div className="min-w-0 xl:col-span-4">

          <div className="h-full overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C]">

            <Portfolio />

          </div>

        </div>


        {/* OPEN POSITIONS */}

        <div className="min-w-0 xl:col-span-8">

          <div className="h-full overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C]">

            <OpenPositions />

          </div>

        </div>

      </section>


      {/* ===================================================
          TRADE HISTORY
      =================================================== */}

      <section className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C]">

        <TradeHistory />

      </section>


      {/* ===================================================
          ACCOUNT ACTIVITY SUMMARY
      =================================================== */}

      <section className="rounded-xl border border-zinc-800 bg-[#15181C] p-4">

        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-sm font-semibold text-white">
              Account Activity
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Live statistics from your trading account.
            </p>

          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">

            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            Live

          </div>

        </div>


        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">

            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
              Traded Volume
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              ${money(totalTraded)}
            </p>

          </div>


          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">

            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
              Open Trades
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {openTrades.length}
            </p>

          </div>


          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">

            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
              Wins
            </p>

            <p className="mt-1 text-sm font-semibold text-emerald-400">
              {wins.length}
            </p>

          </div>


          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">

            <p className="text-[11px] uppercase tracking-wide text-zinc-500">
              Losses
            </p>

            <p className="mt-1 text-sm font-semibold text-red-400">
              {losses.length}
            </p>

          </div>

        </div>

      </section>


      {/* ===================================================
          MARKET NEWS
      =================================================== */}

      <section className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C]">

        <MarketNews />

      </section>

    </div>
  );
}