"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  TrendingUp,
  TrendingDown,
  Bitcoin,
  Coins,
  DollarSign,
  Landmark,
  CircleDollarSign,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type MarketItem = {
  symbol: string;
  displaySymbol: string;
  price: number | null;
  change: number | null;
  icon: typeof Bitcoin;
  source: "binance" | "unavailable";
};

/* =========================================================
   BINANCE RESPONSE
========================================================= */

type BinanceTicker = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
};

/* =========================================================
   INITIAL MARKET LIST
========================================================= */

const INITIAL_MARKETS: MarketItem[] = [
  {
    symbol: "BTCUSDT",
    displaySymbol: "BTC/USDT",
    price: null,
    change: null,
    icon: Bitcoin,
    source: "binance",
  },
  {
    symbol: "ETHUSDT",
    displaySymbol: "ETH/USDT",
    price: null,
    change: null,
    icon: Coins,
    source: "binance",
  },
  {
    symbol: "XAUUSD",
    displaySymbol: "XAU/USD",
    price: null,
    change: null,
    icon: CircleDollarSign,
    source: "unavailable",
  },
  {
    symbol: "EURUSD",
    displaySymbol: "EUR/USD",
    price: null,
    change: null,
    icon: DollarSign,
    source: "unavailable",
  },
  {
    symbol: "GBPUSD",
    displaySymbol: "GBP/USD",
    price: null,
    change: null,
    icon: Landmark,
    source: "unavailable",
  },
  {
    symbol: "USDJPY",
    displaySymbol: "USD/JPY",
    price: null,
    change: null,
    icon: DollarSign,
    source: "unavailable",
  },
  {
    symbol: "NASDAQ",
    displaySymbol: "NASDAQ",
    price: null,
    change: null,
    icon: TrendingUp,
    source: "unavailable",
  },
  {
    symbol: "SPX",
    displaySymbol: "S&P 500",
    price: null,
    change: null,
    icon: TrendingUp,
    source: "unavailable",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatPrice(
  symbol: string,
  price: number | null
): string {
  if (price === null || !Number.isFinite(price)) {
    return "—";
  }

  if (symbol === "BTCUSDT") {
    return `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (symbol === "ETHUSDT") {
    return `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function formatChange(change: number | null): string {
  if (change === null || !Number.isFinite(change)) {
    return "—";
  }

  return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function MarketTicker() {
  const [markets, setMarkets] =
    useState<MarketItem[]>(INITIAL_MARKETS);

  const [loading, setLoading] = useState(true);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  /* =======================================================
     FETCH LIVE CRYPTO DATA

     Binance provides live 24-hour ticker data for BTC/USDT
     and ETH/USDT.
  ======================================================= */

  const fetchMarketData = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch(
        "https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22BTCUSDT%22%2C%22ETHUSDT%22%5D",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Market API returned ${response.status}`
        );
      }

      const data =
        (await response.json()) as BinanceTicker[];

      if (!Array.isArray(data)) {
        throw new Error("Invalid market data received");
      }

      if (!isMounted.current) return;

      setMarkets((currentMarkets) =>
        currentMarkets.map((market) => {
          const live = data.find(
            (item) => item.symbol === market.symbol
          );

          if (!live) {
            return market;
          }

          const price = Number(live.lastPrice);

          const change = Number(
            live.priceChangePercent
          );

          return {
            ...market,
            price: Number.isFinite(price)
              ? price
              : null,
            change: Number.isFinite(change)
              ? change
              : null,
            source: "binance",
          };
        })
      );

      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error(
        "Failed to load live market data:",
        err
      );

      if (!isMounted.current) return;

      setError("Live market connection unavailable");
      setLoading(false);
    }
  }, []);

  /* =======================================================
     INITIAL LOAD + AUTOMATIC REFRESH

     Refreshing the data does NOT recreate the ticker DOM.
     This helps prevent the scrolling animation from blinking.
  ======================================================= */

  useEffect(() => {
    isMounted.current = true;

    fetchMarketData();

    const interval = window.setInterval(() => {
      fetchMarketData();
    }, 10000);

    return () => {
      isMounted.current = false;
      window.clearInterval(interval);
    };
  }, [fetchMarketData]);

  /* =======================================================
     MANUAL REFRESH
  ======================================================= */

  const handleRefresh = () => {
    if (loading) return;

    setLoading(true);

    fetchMarketData();
  };

  /* =======================================================
     DUPLICATE MARKETS FOR INFINITE TICKER
  ======================================================= */

  const tickerMarkets = useMemo(
    () => [...markets, ...markets],
    [markets]
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="relative overflow-hidden border-b border-zinc-800 bg-[#111827]">
      {/* ===================================================
          STATUS BAR
      =================================================== */}

      <div className="flex items-center justify-between border-b border-zinc-800/70 px-3 py-1.5">
        {/* Connection */}

        <div className="flex min-w-0 items-center gap-2">
          {error ? (
            <>
              <WifiOff className="h-3 w-3 shrink-0 text-red-400" />

              <span className="truncate text-[10px] text-red-400">
                Market data unavailable
              </span>
            </>
          ) : (
            <>
              <Wifi className="h-3 w-3 shrink-0 text-emerald-400" />

              <span className="text-[10px] text-emerald-400">
                Live market data
              </span>
            </>
          )}

          {lastUpdated && !error && (
            <span className="hidden text-[10px] text-zinc-600 sm:inline">
              Updated{" "}
              {lastUpdated.toLocaleTimeString(
                "en-KE",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }
              )}
            </span>
          )}
        </div>

        {/* Refresh */}

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          aria-label="Refresh market data"
          title="Refresh market data"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-zinc-500 transition hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3 w-3 ${
              loading ? "animate-spin" : ""
            }`}
          />

          <span className="hidden sm:inline">
            Refresh
          </span>
        </button>
      </div>

      {/* ===================================================
          TICKER
      =================================================== */}

      <div className="overflow-hidden">
        <div className="ticker flex w-max whitespace-nowrap py-3">
          {tickerMarkets.map((market, index) => {
            const Icon = market.icon;

            const isLive =
              market.source === "binance" &&
              market.price !== null;

            const hasChange =
              market.change !== null;

            const isUp =
              market.change !== null
                ? market.change >= 0
                : true;

            return (
              <div
                key={`${market.symbol}-${index}`}
                className="mx-3 flex min-w-fit items-center gap-3 rounded-xl border border-zinc-800 bg-[#1A1D24] px-4 py-2 shadow-sm sm:mx-4"
              >
                {/* Icon */}

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Icon className="h-4 w-4 text-yellow-500" />
                </div>

                {/* Symbol + Price */}

                <div className="min-w-[90px]">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-white">
                      {market.displaySymbol}
                    </p>

                    {isLive && (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                        title="Live"
                      />
                    )}
                  </div>

                  <p className="text-xs text-zinc-400">
                    {loading && !isLive ? (
                      <span className="inline-block h-3 w-16 animate-pulse rounded bg-zinc-800" />
                    ) : (
                      formatPrice(
                        market.symbol,
                        market.price
                      )
                    )}
                  </p>
                </div>

                {/* Change */}

                {hasChange ? (
                  <div
                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                      isUp
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {isUp ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}

                    {formatChange(market.change)}
                  </div>
                ) : (
                  <div className="rounded-full bg-zinc-800/70 px-2 py-1 text-[10px] text-zinc-600">
                    Market feed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================================================
          ANIMATION

          The animation is attached to the ticker itself.
          Updating prices doesn't restart the animation.
      =================================================== */}

      <style jsx>{`
        .ticker {
          animation: tickerMove 45s linear infinite;
          will-change: transform;
        }

        .ticker:hover {
          animation-play-state: paused;
        }

        @keyframes tickerMove {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}