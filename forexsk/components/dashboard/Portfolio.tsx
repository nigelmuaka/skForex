"use client";

import {
  Wallet,
  Bitcoin,
  Coins,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Loader2,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

export interface PortfolioAsset {
  asset: string;
  symbol: string;

  /*
   * Can be either a number or a formatted string.
   * Keeping this flexible makes it compatible with
   * DECIMAL values returned by MySQL.
   */
  balance: number | string;

  value: number | string;

  change?: number | string;

  positive?: boolean;

  icon?: string;
}

export interface PortfolioData {
  assets?: PortfolioAsset[];

  totalValue?: number | string;

  todayProfit?: number | string;

  roi?: number | string;
}

interface PortfolioProps {
  data?: PortfolioData | null;

  loading?: boolean;
}

/* =========================================================
   HELPERS
========================================================= */

function toNumber(
  value: number | string | undefined | null
): number {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function money(
  value: number | string | undefined | null
): string {
  return toNumber(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatBalance(
  value: number | string | undefined | null
): string {
  const numeric = toNumber(value);

  return numeric.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  });
}

function formatPercent(
  value: number | string | undefined | null
): string {
  const numeric = toNumber(value);

  return `${numeric >= 0 ? "+" : ""}${numeric.toFixed(2)}%`;
}

/* =========================================================
   ICON SELECTOR

   The database only needs to store the asset/symbol.
   We choose the visual icon in the frontend.
========================================================= */

function getAssetIcon(symbol: string) {
  switch (symbol.toUpperCase()) {
    case "BTC":
      return Bitcoin;

    case "ETH":
      return Coins;

    case "USDT":
    case "USD":
    case "EUR":
    case "GBP":
    case "JPY":
      return DollarSign;

    case "XAU":
      return CircleDollarSign;

    default:
      return Wallet;
  }
}

/* =========================================================
   DEFAULT DATA

   Empty by default.
   No fake balances are displayed.
========================================================= */

const emptyPortfolio: PortfolioData = {
  assets: [],
  totalValue: 0,
  todayProfit: 0,
  roi: 0,
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Portfolio({
  data,
  loading = false,
}: PortfolioProps) {
  const portfolioData: PortfolioData = {
    ...emptyPortfolio,
    ...(data || {}),
  };

  const assets = portfolioData.assets || [];

  const totalValue = toNumber(
    portfolioData.totalValue
  );

  const todayProfit = toNumber(
    portfolioData.todayProfit
  );

  const roi = toNumber(portfolioData.roi);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#1A1D24]">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <div>
            <div className="h-5 w-24 animate-pulse rounded bg-zinc-800" />

            <div className="mt-2 h-3 w-20 animate-pulse rounded bg-zinc-800" />
          </div>

          <div className="text-right">
            <div className="ml-auto h-3 w-16 animate-pulse rounded bg-zinc-800" />

            <div className="mt-2 h-7 w-28 animate-pulse rounded bg-zinc-800" />
          </div>
        </div>

        {/* Loading Assets */}

        <div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-zinc-800 px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-zinc-800" />

                <div>
                  <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />

                  <div className="mt-2 h-3 w-12 animate-pulse rounded bg-zinc-800" />
                </div>
              </div>

              <div className="hidden sm:block">
                <div className="h-4 w-16 animate-pulse rounded bg-zinc-800" />
              </div>

              <div>
                <div className="h-4 w-20 animate-pulse rounded bg-zinc-800" />
              </div>

              <div className="h-4 w-14 animate-pulse rounded bg-zinc-800" />
            </div>
          ))}
        </div>

        {/* Footer */}

        <div className="grid grid-cols-3 bg-zinc-900">
          <div className="p-4">
            <div className="h-3 w-10 animate-pulse rounded bg-zinc-800" />
            <div className="mt-2 h-5 w-8 animate-pulse rounded bg-zinc-800" />
          </div>

          <div className="p-4">
            <div className="h-3 w-20 animate-pulse rounded bg-zinc-800" />
            <div className="mt-2 h-5 w-16 animate-pulse rounded bg-zinc-800" />
          </div>

          <div className="p-4">
            <div className="h-3 w-10 animate-pulse rounded bg-zinc-800" />
            <div className="mt-2 h-5 w-14 animate-pulse rounded bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#1A1D24]">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            Portfolio
          </h2>

          <p className="text-xs text-zinc-500">
            Asset Holdings
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-zinc-500">
            Total Value
          </p>

          <h3 className="text-xl font-bold text-yellow-500 sm:text-2xl">
            ${money(totalValue)}
          </h3>
        </div>
      </div>

      {/* ===================================================
          ASSETS
      =================================================== */}

      {assets.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10">
            <Wallet className="h-7 w-7 text-yellow-500" />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-white">
            No portfolio assets
          </h3>

          <p className="mt-1 max-w-xs text-xs leading-5 text-zinc-500">
            Your portfolio will appear here when asset
            holdings are recorded in your account.
          </p>
        </div>
      ) : (
        <div>
          {assets.map((asset, index) => {
            const Icon = asset.icon
              ? getAssetIcon(asset.symbol)
              : getAssetIcon(asset.symbol);

            const change = toNumber(asset.change);

            const positive =
              asset.positive !== undefined
                ? asset.positive
                : change >= 0;

            return (
              <div
                key={`${asset.symbol}-${index}`}
                className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-4 transition hover:bg-zinc-900 sm:px-5"
              >
                {/* =========================================
                    ASSET
                ========================================= */}

                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10 sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 text-yellow-500 sm:h-6 sm:w-6" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-white">
                      {asset.asset}
                    </h3>

                    <p className="text-xs text-zinc-500">
                      {asset.symbol}
                    </p>
                  </div>
                </div>

                {/* =========================================
                    BALANCE
                ========================================= */}

                <div className="hidden text-center sm:block">
                  <div className="font-semibold text-zinc-200">
                    {formatBalance(asset.balance)}
                  </div>

                  <div className="text-xs text-zinc-500">
                    Balance
                  </div>
                </div>

                {/* =========================================
                    VALUE
                ========================================= */}

                <div className="text-right sm:text-center">
                  <div className="font-semibold text-zinc-200">
                    ${money(asset.value)}
                  </div>

                  <div className="text-xs text-zinc-500">
                    Value
                  </div>
                </div>

                {/* =========================================
                    CHANGE
                ========================================= */}

                <div
                  className={`hidden items-center gap-1 text-sm font-semibold sm:flex ${
                    positive
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {positive ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}

                  {formatPercent(change)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================================================
          FOOTER
      =================================================== */}

      <div className="grid grid-cols-3 bg-zinc-900">
        {/* Assets */}

        <div className="border-r border-zinc-800 p-3 sm:p-4">
          <p className="text-[10px] text-zinc-500 sm:text-xs">
            Assets
          </p>

          <h3 className="mt-2 text-lg font-bold text-white sm:text-xl">
            {assets.length}
          </h3>
        </div>

        {/* Today's Profit */}

        <div className="border-r border-zinc-800 p-3 sm:p-4">
          <p className="text-[10px] text-zinc-500 sm:text-xs">
            Today's Profit
          </p>

          <h3
            className={`mt-2 truncate text-sm font-bold sm:text-xl ${
              todayProfit >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {todayProfit >= 0 ? "+" : "-"}$
            {money(Math.abs(todayProfit))}
          </h3>
        </div>

        {/* ROI */}

        <div className="p-3 sm:p-4">
          <p className="text-[10px] text-zinc-500 sm:text-xs">
            ROI
          </p>

          <h3
            className={`mt-2 truncate text-sm font-bold sm:text-xl ${
              roi >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {formatPercent(roi)}
          </h3>
        </div>
      </div>
    </div>
  );
}