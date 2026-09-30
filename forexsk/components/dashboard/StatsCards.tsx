"use client";

import {
  Wallet,
  TrendingUp,
  BarChart3,
  DollarSign,
  Activity,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

export interface DashboardStatsData {
  accountBalance?: number | string;
  equity?: number | string;
  freeMargin?: number | string;
  todayPL?: number | string;
  openOrders?: number | string;
  winRate?: number | string;
  roi?: number | string;
  availableFunds?: number | string;

  // IMPORTANT:
  // This is explicitly a number/string.
  // It fixes:
  // Type '{}' is not assignable to type 'string | number | undefined'
  pendingWithdrawals?: number | string;
}

interface StatsCardsProps {
  data?: DashboardStatsData | null;
  loading?: boolean;
}

/* =========================================================
   HELPERS
========================================================= */

function toNumber(value: number | string | undefined | null): number {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value: number | string | undefined | null): string {
  const amount = toNumber(value);

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function number(value: number | string | undefined | null): string {
  return toNumber(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}

function percentage(value: number | string | undefined | null): string {
  return `${toNumber(value).toFixed(1)}%`;
}

function getChange(
  current: number,
  previous: number
): {
  value: string;
  positive: boolean;
} {
  if (!previous || previous === 0) {
    return {
      value: "0.0%",
      positive: current >= 0,
    };
  }

  const change = ((current - previous) / Math.abs(previous)) * 100;

  return {
    value: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
    positive: change >= 0,
  };
}

/* =========================================================
   DEFAULT DATA
   Used only while API data is unavailable.
========================================================= */

const emptyData: DashboardStatsData = {
  accountBalance: 0,
  equity: 0,
  freeMargin: 0,
  todayPL: 0,
  openOrders: 0,
  winRate: 0,
  roi: 0,
  availableFunds: 0,
  pendingWithdrawals: 0,
};

/* =========================================================
   COMPONENT
========================================================= */

export default function StatsCards({
  data,
  loading = false,
}: StatsCardsProps) {
  const statsData = {
    ...emptyData,
    ...(data || {}),
  };

  const accountBalance = toNumber(statsData.accountBalance);
  const equity = toNumber(statsData.equity);
  const freeMargin = toNumber(statsData.freeMargin);
  const todayPL = toNumber(statsData.todayPL);
  const openOrders = toNumber(statsData.openOrders);
  const winRate = toNumber(statsData.winRate);
  const roi = toNumber(statsData.roi);
  const availableFunds = toNumber(statsData.availableFunds);
  const pendingWithdrawals = toNumber(
    statsData.pendingWithdrawals
  );

  /*
   * Calculate sensible performance indicators from
   * the real values supplied by the backend.
   */

  const equityChange = getChange(equity, accountBalance);

  const marginChange = getChange(
    freeMargin,
    accountBalance
  );

  const todayPLPositive = todayPL >= 0;

  const winRatePositive = winRate >= 50;

  const roiPositive = roi >= 0;

  const availableFundsChange = getChange(
    availableFunds,
    accountBalance
  );

  const stats = [
    {
      title: "Account Balance",
      value: `$${money(accountBalance)}`,
      change:
        accountBalance > 0
          ? "Live"
          : "No data",
      description: "Current wallet balance",
      positive: accountBalance >= 0,
      icon: Wallet,
    },

    {
      title: "Equity",
      value: `$${money(equity)}`,
      change: equityChange.value,
      description: "Current account equity",
      positive: equityChange.positive,
      icon: TrendingUp,
    },

    {
      title: "Free Margin",
      value: `$${money(freeMargin)}`,
      change: marginChange.value,
      description: "Available for trading",
      positive: marginChange.positive,
      icon: DollarSign,
    },

    {
      title: "Today's P/L",
      value: `${todayPL >= 0 ? "+" : "-"}$${money(
        Math.abs(todayPL)
      )}`,
      change: todayPLPositive ? "Profit" : "Loss",
      description: "Today's trading result",
      positive: todayPLPositive,
      icon: Activity,
    },

    {
      title: "Open Orders",
      value: number(openOrders),
      change:
        openOrders > 0
          ? "Active"
          : "None",
      description: "Active trading positions",
      positive: openOrders > 0,
      icon: BarChart3,
    },

    {
      title: "Win Rate",
      value: percentage(winRate),
      change:
        winRatePositive
          ? "Strong"
          : "Low",
      description: "Successful completed trades",
      positive: winRatePositive,
      icon: Percent,
    },

    {
      title: "ROI",
      value: percentage(roi),
      change:
        roiPositive
          ? "Positive"
          : "Negative",
      description: "Return on trading activity",
      positive: roiPositive,
      icon: TrendingUp,
    },

    {
      title: "Available Funds",
      value: `$${money(availableFunds)}`,
      change: availableFundsChange.value,
      description:
        pendingWithdrawals > 0
          ? `$${money(
              pendingWithdrawals
            )} withdrawal pending`
          : "Available funds",
      positive: availableFundsChange.positive,
      icon: Wallet,
    },
  ];

  /* =======================================================
     LOADING STATE
  ======================================================= */

  if (loading) {
    return (
      <section className="w-full">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C] p-3 sm:p-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 animate-pulse rounded-lg bg-zinc-800" />

                <div className="h-5 w-14 animate-pulse rounded-full bg-zinc-800" />
              </div>

              <div className="mt-4">
                <div className="h-3 w-24 animate-pulse rounded bg-zinc-800" />

                <div className="mt-2 h-7 w-32 animate-pulse rounded bg-zinc-800" />

                <div className="mt-2 h-3 w-28 animate-pulse rounded bg-zinc-800" />
              </div>

              <div className="mt-4 h-1.5 w-full animate-pulse rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          const isPL = item.title === "Today's P/L";

          const isEmpty =
            item.title === "Account Balance" &&
            accountBalance === 0;

          let barWidth = "w-1/3";

          if (item.title === "Win Rate") {
            const width = Math.max(
              0,
              Math.min(100, winRate)
            );

            if (width >= 75) {
              barWidth = "w-3/4";
            } else if (width >= 50) {
              barWidth = "w-1/2";
            } else {
              barWidth = "w-1/3";
            }
          } else if (item.title === "ROI") {
            if (roi >= 20) {
              barWidth = "w-full";
            } else if (roi >= 10) {
              barWidth = "w-3/4";
            } else if (roi > 0) {
              barWidth = "w-1/2";
            }
          } else if (item.positive) {
            barWidth = "w-3/4";
          }

          return (
            <div
              key={item.title}
              className="group relative min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-500/50 hover:bg-[#1A1D24] hover:shadow-lg hover:shadow-yellow-500/5 sm:p-4"
            >
              {/* Background Glow */}

              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-500/5 blur-2xl transition-all duration-300 group-hover:bg-yellow-500/10" />

              {/* Top Row */}

              <div className="relative flex items-start justify-between gap-2">
                {/* Icon */}

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 text-yellow-500 sm:h-5 sm:w-5" />
                </div>

                {/* Change */}

                <div
                  className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold sm:text-xs ${
                    item.positive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {item.positive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}

                  {item.change}
                </div>
              </div>

              {/* Main Information */}

              <div className="relative mt-4 min-w-0">
                <p className="truncate text-xs font-medium text-zinc-500">
                  {item.title}
                </p>

                <h2
                  className={`mt-1 truncate text-xl font-bold tracking-tight sm:text-2xl ${
                    isPL
                      ? todayPLPositive
                        ? "text-emerald-400"
                        : "text-red-400"
                      : "text-white"
                  }`}
                >
                  {item.value}
                </h2>

                <p className="mt-1 truncate text-[10px] text-zinc-600 sm:text-xs">
                  {item.description}
                </p>
              </div>

              {/* Performance Bar */}

              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.positive
                        ? `bg-emerald-500 ${barWidth}`
                        : `bg-red-500 ${barWidth}`
                    }`}
                  />
                </div>

                <span
                  className={`text-[9px] font-semibold uppercase ${
                    item.positive
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {isEmpty
                    ? "Waiting"
                    : item.positive
                    ? "Up"
                    : "Down"}
                </span>
              </div>

              {/* Pending Withdrawal Indicator */}

              {item.title === "Available Funds" &&
                pendingWithdrawals > 0 && (
                  <div className="relative mt-3 flex items-center gap-1.5 text-[10px] text-yellow-500">
                    <Activity className="h-3 w-3" />

                    <span className="truncate">
                      Pending withdrawal: $
                      {money(pendingWithdrawals)}
                    </span>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </section>
  );
}