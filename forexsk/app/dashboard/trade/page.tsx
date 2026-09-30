"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  Activity,
  BarChart3,
  Bitcoin,
  ChevronDown,
  Clock,
  Crosshair,
  DollarSign,
  Expand,
  Minimize2,
  LineChart,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
  CheckCircle2,
  XCircle,
  BrainCircuit,
} from "lucide-react";

import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

/* =========================================================
   API
========================================================= */

const API_URL = "http://localhost:5000";

/* =========================================================
   TYPES
========================================================= */

type AccountMode = "demo" | "real";

type TradingMode =
  | "LAMIA"
  | "INSTA"
  | "SKPOT"
  | "VULJA";

type TradeType = "Auto" | "Manual";

type Direction = "BUY" | "SELL";

type Market = {
  symbol: string;
  tradingViewSymbol: string;
  price: string;
  change: string;
  positive: boolean;
};

type ActiveTrade = {
  id: string;
  market: string;
  direction: Direction;
  stake: number;
  duration: number;
  entryPrice: number;
  expiresAt: string;
  accountMode: AccountMode;
};

type TradeResult = {
  status: "WON" | "LOST";
  amount: number;
  stake: number;
  market: string;
  direction: Direction;
  accountMode: AccountMode;
};

/* =========================================================
   MARKETS

   TradingView controls the visual market feed.

   The prices below are display fallbacks for the selector.
   They are NOT used as the authoritative account balance.
========================================================= */

const markets: Market[] = [
  {
    symbol: "BTC/USDT",
    tradingViewSymbol: "BINANCE:BTCUSDT",
    price: "118,450.20",
    change: "+2.45%",
    positive: true,
  },
  {
    symbol: "ETH/USDT",
    tradingViewSymbol: "BINANCE:ETHUSDT",
    price: "3,842.12",
    change: "+1.86%",
    positive: true,
  },
  {
    symbol: "EUR/USD",
    tradingViewSymbol: "FX:EURUSD",
    price: "1.1740",
    change: "+0.43%",
    positive: true,
  },
  {
    symbol: "GBP/USD",
    tradingViewSymbol: "FX:GBPUSD",
    price: "1.3612",
    change: "-0.18%",
    positive: false,
  },
  {
    symbol: "XAU/USD",
    tradingViewSymbol: "OANDA:XAUUSD",
    price: "3,356.30",
    change: "-0.25%",
    positive: false,
  },
];

/* =========================================================
   TRADING MODES
========================================================= */

const tradingModes = [
  {
    id: "LAMIA" as TradingMode,
    title: "LAMIA",
    subtitle: "Quick Trade",
    description: "Fast market execution",
    icon: Zap,
  },
  {
    id: "INSTA" as TradingMode,
    title: "INSTA",
    subtitle: "Instant Trade",
    description: "Rapid entry and exit",
    icon: Activity,
  },
  {
    id: "SKPOT" as TradingMode,
    title: "SKPOT",
    subtitle: "Scalping",
    description: "Short-term simulation",
    icon: Crosshair,
  },
  {
    id: "VULJA" as TradingMode,
    title: "VULJA",
    subtitle: "Strategy Trade",
    description: "Planned trading setup",
    icon: Target,
  },
];

/* =========================================================
   METRIC
========================================================= */

function Metric({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-zinc-800 bg-[#15181C] p-3 shadow-md">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium uppercase text-zinc-400">
          {title}
        </p>

        <p className="truncate text-sm font-bold text-white sm:text-base">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   MOVING MARKET WAVE
========================================================= */

const MovingMarketWave = memo(function MovingMarketWave({
  activeTrade,
}: {
  activeTrade: {
    direction: Direction;
  } | null;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 2000 420"
        preserveAspectRatio="none"
        className="h-full w-[200%] opacity-70"
      >
        <defs>
          <linearGradient
            id="pipmasterWaveGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="#22c55e"
              stopOpacity="0.08"
            />

            <stop
              offset="25%"
              stopColor="#facc15"
              stopOpacity="0.35"
            />

            <stop
              offset="50%"
              stopColor="#38bdf8"
              stopOpacity="0.5"
            />

            <stop
              offset="75%"
              stopColor="#a855f7"
              stopOpacity="0.35"
            />

            <stop
              offset="100%"
              stopColor="#22c55e"
              stopOpacity="0.08"
            />
          </linearGradient>

          <filter
            id="pipmasterWaveGlow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur
              stdDeviation="2"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          className={
            activeTrade
              ? "pipmaster-wave-fast"
              : "pipmaster-wave"
          }
        >
          <path
            d="
              M0 230
              C35 205 70 175 105 195
              C140 215 165 275 205 250
              C245 225 270 145 310 165
              C350 185 370 285 415 275
              C460 265 475 190 520 205
              C565 220 580 320 625 300
              C670 280 700 170 745 190
              C790 210 810 265 855 240
              C900 215 920 130 965 150
              C1010 170 1035 300 1080 275
              C1125 250 1140 180 1185 195
              C1230 210 1250 330 1295 300
              C1340 270 1360 155 1405 180
              C1450 205 1475 260 1520 235
              C1565 210 1590 125 1635 150
              C1680 175 1700 305 1745 280
              C1790 255 1820 185 1865 205
              C1910 225 1940 300 2000 265
            "
            fill="none"
            stroke="url(#pipmasterWaveGradient)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            filter="url(#pipmasterWaveGlow)"
          />

          <path
            d="
              M2000 230
              C2035 205 2070 175 2105 195
              C2140 215 2165 275 2205 250
              C2245 225 2270 145 2310 165
              C2350 185 2370 285 2415 275
              C2460 265 2475 190 2520 205
              C2565 220 2580 320 2625 300
              C2670 280 2700 170 2745 190
              C2790 210 2810 265 2855 240
              C2900 215 2920 130 2965 150
              C3010 170 3035 300 3080 275
              C3125 250 3140 180 3185 195
              C3230 210 3250 330 3295 300
              C3340 270 3360 155 3405 180
              C3450 205 3475 260 3520 235
              C3565 210 3590 125 3635 150
              C3680 175 3700 305 3745 280
              C3790 255 3820 185 3865 205
              C3910 225 3940 300 4000 265
            "
            fill="none"
            stroke="url(#pipmasterWaveGradient)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            filter="url(#pipmasterWaveGlow)"
          />
        </g>

        {activeTrade && (
          <line
            x1="1000"
            y1="25"
            x2="1000"
            y2="395"
            stroke={
              activeTrade.direction === "BUY"
                ? "#22c55e"
                : "#ef4444"
            }
            strokeWidth="1"
            strokeDasharray="6 7"
            opacity="0.7"
          />
        )}
      </svg>

      <div
        className={`absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full shadow-[0_0_14px_rgba(250,204,21,0.9)] ${
          activeTrade?.direction === "SELL"
            ? "bg-red-400"
            : "bg-yellow-400"
        } pipmaster-price-dot`}
      />

      <div className="absolute right-3 top-3 rounded-md border border-yellow-500/20 bg-[#0B0E11]/70 px-2 py-1 backdrop-blur-sm">
        <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-yellow-400">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
          TradingView
        </span>
      </div>

      <style jsx>{`
        .pipmaster-wave {
          animation: pipmasterWaveMove 15s linear infinite;
          transform-origin: center;
        }

        .pipmaster-wave-fast {
          animation: pipmasterWaveMove 11s linear infinite;
          transform-origin: center;
        }

        .pipmaster-price-dot {
          animation:
            pipmasterDotMove 7s ease-in-out infinite alternate,
            pipmasterDotVertical 3.7s ease-in-out infinite alternate;
        }

        @keyframes pipmasterWaveMove {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @keyframes pipmasterDotMove {
          from {
            left: 8%;
          }

          to {
            left: 91%;
          }
        }

        @keyframes pipmasterDotVertical {
          from {
            margin-top: -35px;
          }

          to {
            margin-top: 45px;
          }
        }
      `}</style>
    </div>
  );
});

/* =========================================================
   TIMER
========================================================= */

const TradeTimer = memo(function TradeTimer({
  expiresAt,
  trade,
}: {
  expiresAt: string;
  trade: {
    direction: Direction;
    stake: number;
    market: string;
  };
}) {
  const calculateRemaining = useCallback(() => {
    const expiry = new Date(expiresAt).getTime();

    if (!Number.isFinite(expiry)) {
      return 0;
    }

    return Math.max(
      0,
      Math.ceil((expiry - Date.now()) / 1000)
    );
  }, [expiresAt]);

  const [remaining, setRemaining] = useState(
    calculateRemaining
  );

  useEffect(() => {
    setRemaining(calculateRemaining());

    const timer = window.setInterval(() => {
      setRemaining(calculateRemaining());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [calculateRemaining]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const formattedTime = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="pointer-events-none absolute bottom-3 left-3 z-30">
      <div className="flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-[#101317]/95 px-3 py-2 shadow-xl backdrop-blur-xl">
        <div className="flex h-9 min-w-[65px] items-center justify-center rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-2">
          <span className="font-mono text-sm font-black tracking-wider text-yellow-400">
            {formattedTime}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-yellow-500" />

            <span className="text-[9px] font-black uppercase tracking-wider text-white">
              Trade Running
            </span>
          </div>

          <p className="mt-0.5 text-[10px] text-zinc-400">
            {trade.direction === "BUY"
              ? "UP"
              : "DOWN"}{" "}
            • ${trade.stake.toFixed(2)} •{" "}
            {trade.market}
          </p>
        </div>
      </div>
    </div>
  );
});

/* =========================================================
   CHART PANEL
========================================================= */

const TradingChartPanel = memo(function TradingChartPanel({
  market,
  mode,
  activeTrade,
  fullscreen,
  accountMode,
}: {
  market: Market;
  mode: TradingMode;
  activeTrade: ActiveTrade | null;
  fullscreen: boolean;
  accountMode: AccountMode;
}) {
  return (
    <div
      className={`relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C] shadow-xl ${
        fullscreen ? "h-full" : "h-full"
      }`}
    >
      {/* =====================================================
          CHART HEADER
      ===================================================== */}

      <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-[#121418] px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />

            <span className="text-[9px] font-black uppercase tracking-wider text-green-500">
              Live
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {market.symbol}
            </p>

            <p className="truncate text-[9px] text-zinc-500">
              {accountMode.toUpperCase()} • {mode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`rounded-md border px-2 py-1 ${
              accountMode === "real"
                ? "border-yellow-500/30 bg-yellow-500/10"
                : "border-green-500/30 bg-green-500/10"
            }`}
          >
            <span
              className={`text-[8px] font-black uppercase tracking-wider ${
                accountMode === "real"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {accountMode === "real"
                ? "REAL • SIM"
                : "DEMO"}
            </span>
          </div>

          <Activity className="hidden h-3.5 w-3.5 text-green-500 sm:block" />
        </div>
      </div>

      {/* =====================================================
          CHART AREA

          REDESIGNED:
          - Much smaller than the previous 760-900px.
          - Desktop gets around 600-660px.
          - Mobile gets around 430-500px.
          - Does not grow because of the order panel.
      ===================================================== */}

      <div
        className={`relative min-h-0 w-full flex-1 overflow-hidden bg-[#0B0E11] ${
          fullscreen
            ? "min-h-0"
            : "h-[460px] min-h-[460px] sm:h-[520px] sm:min-h-[520px] lg:h-[600px] lg:min-h-[600px] xl:h-[650px] xl:min-h-[650px]"
        }`}
      >
        <div className="absolute inset-0 z-10">
          <AdvancedRealTimeChart
            theme="dark"
            autosize
            symbol={market.tradingViewSymbol}
            interval="15"
            timezone="Africa/Nairobi"
            hide_side_toolbar={true}
            allow_symbol_change={false}
            withdateranges={true}
            save_image={true}
            details={false}
            hotlist={false}
            calendar={false}
            studies={[
              "MASimple@tv-basicstudies",
              "RSI@tv-basicstudies",
              "MACD@tv-basicstudies",
              "Volume@tv-basicstudies",
            ]}
          />
        </div>

        {/* Decorative overlay stays inside chart */}
        <MovingMarketWave
          activeTrade={activeTrade}
        />

        {/* Timer stays small and inside chart */}
        {activeTrade && (
          <TradeTimer
            expiresAt={activeTrade.expiresAt}
            trade={{
              direction: activeTrade.direction,
              stake: activeTrade.stake,
              market: activeTrade.market,
            }}
          />
        )}
      </div>

      {/* =====================================================
          CHART FOOTER
      ===================================================== */}

      <div className="flex shrink-0 items-center justify-between border-t border-zinc-800 bg-[#121418] px-3 py-2">
        <div className="flex items-center gap-3 text-[9px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Feed connected
          </span>

          <span className="hidden sm:inline">
            •
          </span>

          <span className="hidden sm:inline">
            15m
          </span>
        </div>

        <span
          className={`text-[9px] font-medium ${
            accountMode === "real"
              ? "text-yellow-600"
              : "text-zinc-600"
          }`}
        >
          {accountMode === "real"
            ? "Simulated real-account mode"
            : "Demo environment"}
        </span>
      </div>
    </div>
  );
});

/* =========================================================
   MAIN PAGE
========================================================= */

export default function TradePage() {
  const [accountMode, setAccountMode] =
    useState<AccountMode>("demo");

  const [selectedMode, setSelectedMode] =
    useState<TradingMode>("LAMIA");

  const [selectedMarket, setSelectedMarket] =
    useState<Market>(markets[0]);

  const [tradeType, setTradeType] =
    useState<TradeType>("Auto");

  /*
   * These values are populated from MySQL through:
   *
   * GET /api/user/balance
   */
  const [demoBalance, setDemoBalance] =
    useState(100000);

  const [realBalance, setRealBalance] =
    useState(0);

  const [stake, setStake] =
    useState("10");

  const [tradeDuration, setTradeDuration] =
    useState(10);

  const [direction, setDirection] =
    useState<Direction>("BUY");

  const [showMarkets, setShowMarkets] =
    useState(false);

  const [fullscreen, setFullscreen] =
    useState(false);

  const [isExecuting, setIsExecuting] =
    useState(false);

  const [switchingAccount, setSwitchingAccount] =
    useState(false);

  const [loadingAccount, setLoadingAccount] =
    useState(true);

  const [tradeNotification, setTradeNotification] =
    useState<string | null>(null);

  const [isScanning, setIsScanning] =
    useState(false);

  const [scanResult, setScanResult] =
    useState<{
      market: Market;
      direction: Direction;
      confidence: number;
      selectedStake: number;
      suggestedDuration: number;
      payoutPercent: number;
      potentialProfit: number;
      potentialReturn: number;
    } | null>(null);

  const [showScanner, setShowScanner] =
    useState(false);

  const [activeTrade, setActiveTrade] =
    useState<ActiveTrade | null>(null);

  const [tradeResult, setTradeResult] =
    useState<TradeResult | null>(null);

  /* =========================================================
     DERIVED BALANCE

     REAL = realBalance from MySQL
     DEMO = demoBalance from MySQL
========================================================= */

  const currentBalance =
    accountMode === "demo"
      ? demoBalance
      : realBalance;

  const selectedTradingMode =
    tradingModes.find(
      (mode) => mode.id === selectedMode
    );

  const ModeIcon =
    selectedTradingMode?.icon || Zap;

  const numericStake = Number(stake);

  const payoutPercent = 95;

  const potentialProfit =
    Number.isFinite(numericStake) &&
    numericStake > 0
      ? numericStake *
        (payoutPercent / 100)
      : 0;

  const potentialReturn =
    Number.isFinite(numericStake) &&
    numericStake > 0
      ? numericStake + potentialProfit
      : 0;

  /* =========================================================
     NOTIFICATION
========================================================= */

  const notify = useCallback(
    (message: string) => {
      setTradeNotification(message);

      window.setTimeout(() => {
        setTradeNotification(null);
      }, 4000);
    },
    []
  );

  /* =========================================================
     FETCH ACCOUNT MODE FROM SERVER
========================================================= */

  const fetchAccountMode =
    useCallback(async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/account/mode`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          /*
           * Do not replace the account mode with fake data.
           * The server remains the authority.
           */
          console.warn(
            "Account mode request returned:",
            response.status
          );

          return;
        }

        const data =
          await response.json();

        const mode =
          String(
            data.accountMode ||
              data.selectedAccountMode ||
              "demo"
          ).toLowerCase() === "real"
            ? "real"
            : "demo";

        setAccountMode(mode);
      } catch (error) {
        console.error(
          "Account mode fetch error:",
          error
        );
      }
    }, []);

  /* =========================================================
     FETCH BOTH BALANCES FROM MYSQL
========================================================= */

  const fetchUserBalance =
    useCallback(async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/user/balance`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          console.warn(
            "Balance request returned:",
            response.status
          );

          return;
        }

        const data =
          await response.json();

        /*
         * IMPORTANT:
         *
         * These values are coming from the backend.
         *
         * data.demoBalance
         * data.realBalance
         *
         * should therefore originate from:
         *
         * wallets.demo_balance
         * wallets.real_balance
         */

        const newDemoBalance =
          Number(
            data.demoBalance ?? 0
          );

        const newRealBalance =
          Number(
            data.realBalance ?? 0
          );

        setDemoBalance(
          Number.isFinite(
            newDemoBalance
          )
            ? newDemoBalance
            : 0
        );

        setRealBalance(
          Number.isFinite(
            newRealBalance
          )
            ? newRealBalance
            : 0
        );

        /*
         * Server account mode is authoritative.
         */
        if (
          data.accountMode ||
          data.selectedAccountMode
        ) {
          const serverMode =
            String(
              data.accountMode ||
                data.selectedAccountMode
            ).toLowerCase() === "real"
              ? "real"
              : "demo";

          setAccountMode(
            serverMode
          );
        }
      } catch (error) {
        console.error(
          "Balance fetch error:",
          error
        );
      } finally {
        setLoadingAccount(false);
      }
    }, []);

  /* =========================================================
     INITIAL ACCOUNT LOAD
========================================================= */

  useEffect(() => {
    const loadAccount =
      async () => {
        setLoadingAccount(true);

        await fetchAccountMode();
        await fetchUserBalance();

        setLoadingAccount(false);
      };

    loadAccount();
  }, [
    fetchAccountMode,
    fetchUserBalance,
  ]);

  /* =========================================================
     DATABASE REFRESH

     Refreshes balances and account mode.

     TradingView itself is NOT recreated.
========================================================= */

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        fetchAccountMode();
        fetchUserBalance();
      }, 5000);

    return () =>
      window.clearInterval(
        interval
      );
  }, [
    fetchAccountMode,
    fetchUserBalance,
  ]);

  /* =========================================================
     ACCOUNT SWITCH
========================================================= */

  const handleAccountModeChange =
    async (mode: AccountMode) => {
      if (switchingAccount) {
        return;
      }

      if (mode === accountMode) {
        return;
      }

      if (activeTrade) {
        notify(
          "Finish the current trade before switching accounts."
        );

        return;
      }

      setSwitchingAccount(true);

      try {
        const response =
          await fetch(
            `${API_URL}/api/account/switch`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                accountMode: mode,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Unable to switch account."
          );
        }

        const serverMode =
          String(
            data.accountMode ||
              mode
          ).toLowerCase() ===
          "real"
            ? "real"
            : "demo";

        /*
         * Set the mode returned by the server.
         */
        setAccountMode(
          serverMode
        );

        /*
         * Immediately reload both database balances.
         */
        await fetchUserBalance();

        await fetchAccountMode();

        setScanResult(null);

        notify(
          serverMode === "real"
            ? "REAL simulated account selected. Balance loaded from database."
            : "DEMO account selected. Balance loaded from database."
        );
      } catch (error) {
        console.error(
          "Account switch error:",
          error
        );

        notify(
          error instanceof Error
            ? error.message
            : "Unable to switch account."
        );

        await fetchAccountMode();
        await fetchUserBalance();
      } finally {
        setSwitchingAccount(false);
      }
    };

  /* =========================================================
     FULLSCREEN
========================================================= */

  const enterFullscreen =
    useCallback(async () => {
      setFullscreen(true);

      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch {
        // CSS focus mode remains active.
      }
    }, []);

  const exitFullscreen =
    useCallback(async () => {
      setFullscreen(false);

      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch {
        // Ignore browser fullscreen errors.
      }
    }, []);

  const toggleFullscreen =
    useCallback(() => {
      if (fullscreen) {
        exitFullscreen();
      } else {
        enterFullscreen();
      }
    }, [
      fullscreen,
      enterFullscreen,
      exitFullscreen,
    ]);

  /* =========================================================
     FULLSCREEN EVENT
========================================================= */

  useEffect(() => {
    const handleFullscreenChange =
      () => {
        if (!document.fullscreenElement) {
          setFullscreen(false);
        }
      };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  /* =========================================================
     ESCAPE
========================================================= */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape" &&
        fullscreen
      ) {
        exitFullscreen();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    fullscreen,
    exitFullscreen,
  ]);

  /* =========================================================
     F11
========================================================= */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "F11") {
        event.preventDefault();

        toggleFullscreen();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [toggleFullscreen]);

  /* =========================================================
     STAKE
========================================================= */

  const updateStake =
    (value: string) => {
      if (value === "") {
        setStake("");
        setScanResult(null);
        return;
      }

      if (!/^\d*\.?\d*$/.test(value)) {
        return;
      }

      setStake(value);
      setScanResult(null);
    };

  const decreaseStake = () => {
    const current = Number(stake);

    const next = Math.max(
      1,
      (Number.isFinite(current)
        ? current
        : 1) - 1
    );

    setStake(
      next.toString()
    );

    setScanResult(null);
  };

  const increaseStake = () => {
    const current = Number(stake);

    const next =
      (Number.isFinite(current)
        ? current
        : 0) + 1;

    setStake(
      next.toString()
    );

    setScanResult(null);
  };

  /* =========================================================
     AI SCANNER
========================================================= */

  const handleAiScan = () => {
    if (activeTrade) {
      notify(
        "Finish the current trade before scanning again."
      );

      return;
    }

    const selectedStake =
      Number(stake);

    if (
      !Number.isFinite(
        selectedStake
      ) ||
      selectedStake <= 0
    ) {
      notify(
        "Select a valid stake before using AI Scanner."
      );

      return;
    }

    if (
      selectedStake >
      currentBalance
    ) {
      notify(
        "The selected stake is higher than your available account balance."
      );

      return;
    }

    setIsScanning(true);
    setScanResult(null);
    setShowScanner(true);

    window.setTimeout(() => {
      const rankedMarkets =
        markets
          .map(
            (market, index) => {
              const changeValue =
                Math.abs(
                  Number(
                    market.change.replace(
                      "%",
                      ""
                    )
                  )
                );

              const trendScore =
                market.positive
                  ? 12
                  : 8;

              const modeBonus =
                selectedMode ===
                "SKPOT"
                  ? index % 2 === 0
                    ? 5
                    : 2
                  : selectedMode ===
                    "VULJA"
                  ? index === 2
                    ? 6
                    : 3
                  : 4;

              const score =
                changeValue * 10 +
                trendScore +
                modeBonus;

              return {
                market,
                score,
              };
            }
          )
          .sort(
            (a, b) =>
              b.score - a.score
          );

      const best =
        rankedMarkets[0];

      const market =
        best?.market ||
        selectedMarket;

      const scanDirection =
        market.positive
          ? "BUY"
          : "SELL";

      const movement =
        Math.abs(
          Number(
            market.change.replace(
              "%",
              ""
            )
          )
        );

      const confidence =
        Math.min(
          92,
          Math.max(
            68,
            Math.round(
              68 +
                movement * 7
            )
          )
        );

      setScanResult({
        market,
        direction: scanDirection,
        confidence,
        selectedStake,
        suggestedDuration:
          tradeDuration,
        payoutPercent,
        potentialProfit:
          selectedStake *
          (payoutPercent / 100),
        potentialReturn:
          selectedStake +
          selectedStake *
            (payoutPercent / 100),
      });

      setIsScanning(false);
    }, 1100);
  };

  /* =========================================================
     APPLY SCAN
========================================================= */

  const applyScanResult = () => {
    if (!scanResult) {
      return;
    }

    setSelectedMarket(
      scanResult.market
    );

    setDirection(
      scanResult.direction
    );

    setStake(
      scanResult.selectedStake.toString()
    );

    setTradeDuration(
      scanResult.suggestedDuration
    );

    setShowScanner(false);

    notify(
      `Scanner setup loaded: ${scanResult.market.symbol} • ${
        scanResult.direction ===
        "BUY"
          ? "UP"
          : "DOWN"
      } • $${scanResult.selectedStake.toFixed(
        2
      )}`
    );
  };

  /* =========================================================
     EXECUTE TRADE

     IMPORTANT:
     accountMode is NOT sent from the client.

     Backend session decides:
       demo -> demo_balance
       real -> real_balance
========================================================= */

  const handleTrade = async () => {
    if (isExecuting) {
      return;
    }

    if (activeTrade) {
      notify(
        "A trade is already running."
      );

      return;
    }

    const stakeAmount =
      Number(stake);

    if (
      !Number.isFinite(
        stakeAmount
      ) ||
      stakeAmount <= 0
    ) {
      notify(
        "Enter a valid stake amount."
      );

      return;
    }

    /*
     * This is the balance currently loaded from MySQL.
     */
    if (
      stakeAmount >
      currentBalance
    ) {
      notify(
        `Insufficient ${
          accountMode === "demo"
            ? "demo"
            : "real simulated"
        } balance.`
      );

      return;
    }

    const entryPrice =
      Number(
        selectedMarket.price.replace(
          /,/g,
          ""
        )
      );

    if (
      !Number.isFinite(
        entryPrice
      ) ||
      entryPrice <= 0
    ) {
      notify(
        "Invalid market price."
      );

      return;
    }

    setIsExecuting(true);

    try {
      const response =
        await fetch(
          `${API_URL}/api/trades/execute`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              market:
                selectedMarket.symbol,
              direction,
              stake:
                stakeAmount,
              duration:
                tradeDuration,
              entryPrice,
              currentPrice:
                entryPrice,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        notify(
          data.error ||
            data.message ||
            "Unable to open trade."
        );

        await fetchUserBalance();

        return;
      }

      const expiresAt =
        new Date(
          data.expiresAt
        );

      if (
        !Number.isFinite(
          expiresAt.getTime()
        )
      ) {
        notify(
          "Invalid expiry returned by server."
        );

        await fetchUserBalance();

        return;
      }

      /*
       * The backend balance is the authoritative balance.
       */
      const newBalance =
        Number(
          data.newBalance
        );

      const serverAccountMode =
        String(
          data.accountMode ||
            accountMode
        ).toLowerCase() ===
        "real"
          ? "real"
          : "demo";

      if (
        Number.isFinite(
          newBalance
        )
      ) {
        if (
          serverAccountMode ===
          "demo"
        ) {
          setDemoBalance(
            newBalance
          );
        } else {
          setRealBalance(
            newBalance
          );
        }
      }

      setAccountMode(
        serverAccountMode
      );

      setActiveTrade({
        id: String(
          data.tradeId
        ),

        market:
          selectedMarket.symbol,

        direction,

        stake:
          stakeAmount,

        duration:
          tradeDuration,

        entryPrice,

        expiresAt:
          expiresAt.toISOString(),

        accountMode:
          serverAccountMode,
      });

      setTradeResult(null);

      notify(
        `${
          direction === "BUY"
            ? "UP"
            : "DOWN"
        } ${
          serverAccountMode ===
          "real"
            ? "REAL simulated"
            : "DEMO"
        } trade opened successfully.`
      );

      /*
       * Re-read MySQL immediately.
       */
      await fetchUserBalance();
    } catch (error) {
      console.error(
        "Trade execution error:",
        error
      );

      notify(
        "Unable to connect to the trading server."
      );

      await fetchUserBalance();
    } finally {
      setIsExecuting(false);
    }
  };

  /* =========================================================
     SIMULATED EXIT PRICE
========================================================= */

  const createSimulatedExitPrice = (
    tradeId: string,
    entryPrice: number,
    tradeDirection: Direction
  ) => {
    let hash = 0;

    for (
      let i = 0;
      i < tradeId.length;
      i++
    ) {
      hash =
        (hash << 5) -
        hash +
        tradeId.charCodeAt(i);

      hash |= 0;
    }

    const normalized =
      Math.abs(hash) % 100;

    const movement =
      0.0005 +
      (normalized % 6) *
        0.00015;

    const positive =
      normalized % 2 === 0;

    const signedMovement =
      positive
        ? movement
        : -movement;

    if (
      tradeDirection ===
      "BUY"
    ) {
      return (
        entryPrice *
        (1 + signedMovement)
      );
    }

    return (
      entryPrice *
      (1 - signedMovement)
    );
  };

  /* =========================================================
     SETTLE TRADE
========================================================= */

  const settleTrade =
    useCallback(
      async (
        trade: ActiveTrade
      ) => {
        const expiry =
          new Date(
            trade.expiresAt
          ).getTime();

        if (
          Date.now() <
          expiry
        ) {
          return;
        }

        const exitPrice =
          createSimulatedExitPrice(
            trade.id,
            trade.entryPrice,
            trade.direction
          );

        try {
          const response =
            await fetch(
              `${API_URL}/api/trades/settle`,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                credentials:
                  "include",
                body: JSON.stringify({
                  tradeId:
                    trade.id,

                  exitPrice:
                    Number(
                      exitPrice.toFixed(
                        8
                      )
                    ),
                }),
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            notify(
              data.error ||
                data.message ||
                "Trade settlement failed."
            );

            await fetchUserBalance();

            setActiveTrade(
              null
            );

            return;
          }

          const status =
            data.result === "WON"
              ? "WON"
              : "LOST";

          const amount =
            Math.abs(
              Number(
                data.profit ?? 0
              )
            );

          setTradeResult({
            status,
            amount,
            stake:
              trade.stake,
            market:
              trade.market,
            direction:
              trade.direction,
            accountMode:
              trade.accountMode,
          });

          /*
           * Update the correct account immediately.
           */
          const serverBalance =
            Number(
              data.newBalance
            );

          if (
            Number.isFinite(
              serverBalance
            )
          ) {
            if (
              trade.accountMode ===
              "demo"
            ) {
              setDemoBalance(
                serverBalance
              );
            } else {
              setRealBalance(
                serverBalance
              );
            }
          }

          /*
           * Then confirm against MySQL.
           */
          await fetchUserBalance();

          setActiveTrade(null);
        } catch (error) {
          console.error(
            "Settlement error:",
            error
          );

          notify(
            "Unable to settle the trade."
          );

          await fetchUserBalance();

          setActiveTrade(null);
        }
      },
      [
        fetchUserBalance,
        notify,
      ]
    );

  /* =========================================================
     EXPIRY WATCHER
========================================================= */

  useEffect(() => {
    if (!activeTrade) {
      return;
    }

    let settlementStarted =
      false;

    const checkExpiry = () => {
      if (settlementStarted) {
        return;
      }

      const expiry =
        new Date(
          activeTrade.expiresAt
        ).getTime();

      if (
        Date.now() >=
        expiry
      ) {
        settlementStarted =
          true;

        settleTrade(
          activeTrade
        );
      }
    };

    checkExpiry();

    const interval =
      window.setInterval(
        checkExpiry,
        500
      );

    return () =>
      window.clearInterval(
        interval
      );
  }, [
    activeTrade,
    settleTrade,
  ]);

  /* =========================================================
     RESULT AUTO CLOSE
========================================================= */

  useEffect(() => {
    if (!tradeResult) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        setTradeResult(null);
      }, 7000);

    return () =>
      window.clearTimeout(
        timeout
      );
  }, [tradeResult]);

  /* =========================================================
     FORMATTED BALANCE
========================================================= */

  const formattedBalance =
    useMemo(
      () =>
        currentBalance.toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        ),
      [currentBalance]
    );

  /* =========================================================
     PAGE
========================================================= */

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-[100] flex h-[100dvh] w-screen flex-col overflow-hidden bg-[#080A0D] p-1.5 text-zinc-100 sm:p-2"
          : "min-h-full w-full space-y-3 overflow-x-hidden pb-8 text-zinc-100"
      }
    >
      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <section className="flex shrink-0 flex-col gap-3 rounded-xl border border-zinc-800 bg-[#15181C] p-3 shadow-lg sm:p-3.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-yellow-500/20 bg-yellow-500/10">
            <LineChart className="h-4.5 w-4.5 text-yellow-500" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-black text-white sm:text-lg">
                Trading Terminal
              </h1>

              {fullscreen && (
                <span className="hidden rounded-full border border-green-500/20 bg-green-500/10 px-2 py-1 text-[8px] font-bold uppercase text-green-400 sm:inline">
                  Focus Mode
                </span>
              )}
            </div>

            <p className="truncate text-[10px] text-zinc-500">
              {selectedMarket.symbol} •{" "}
              {accountMode === "demo"
                ? "Demo trading environment"
                : "Real account simulation"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ACCOUNT MODE */}

          <div className="flex flex-1 rounded-xl border border-zinc-800 bg-[#0F1114] p-1 sm:flex-none">
            <button
              type="button"
              onClick={() =>
                handleAccountModeChange(
                  "demo"
                )
              }
              disabled={
                switchingAccount ||
                !!activeTrade
              }
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition sm:flex-none sm:px-5 ${
                accountMode ===
                "demo"
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/10"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {switchingAccount &&
              accountMode !==
                "demo" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Activity className="h-4 w-4" />
              )}

              DEMO
            </button>

            <button
              type="button"
              onClick={() =>
                handleAccountModeChange(
                  "real"
                )
              }
              disabled={
                switchingAccount ||
                !!activeTrade
              }
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition sm:flex-none sm:px-5 ${
                accountMode ===
                "real"
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/10"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {switchingAccount &&
              accountMode !==
                "real" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}

              REAL
            </button>
          </div>

          {/* DATABASE BALANCE */}

          <div className="hidden min-w-[140px] rounded-xl border border-zinc-800 bg-[#0F1114] px-3 py-2 sm:block">
            <p className="text-[8px] font-bold uppercase tracking-wider text-zinc-600">
              {accountMode === "demo"
                ? "Demo Balance"
                : "Real Balance"}
            </p>

            <div className="mt-0.5 flex items-center gap-1">
              {loadingAccount ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-yellow-500" />
              ) : (
                <>
                  <span className="text-[10px] text-zinc-500">
                    $
                  </span>

                  <span className="text-xs font-black text-white">
                    {formattedBalance}
                  </span>
                </>
              )}
            </div>

            <p className="mt-0.5 text-[7px] uppercase text-zinc-700">
              MySQL account balance
            </p>
          </div>

          {/* FULLSCREEN */}

          <button
            type="button"
            onClick={
              toggleFullscreen
            }
            className="flex h-9 items-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 text-xs font-bold text-yellow-400 transition hover:bg-yellow-500/20"
          >
            {fullscreen ? (
              <>
                <Minimize2 className="h-4 w-4" />

                <span className="hidden sm:inline">
                  Exit Focus
                </span>
              </>
            ) : (
              <>
                <Expand className="h-4 w-4" />

                <span className="hidden sm:inline">
                  Trade Mode
                </span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* =====================================================
          FOCUS INFO
      ===================================================== */}

      {fullscreen && (
        <div className="flex shrink-0 items-center justify-between rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-3 py-2">
          <div className="flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-yellow-500" />

            <p className="text-[10px] text-zinc-400">
              Focus Mode • Expanded chart workspace •{" "}
              {accountMode === "demo"
                ? "DEMO"
                : "REAL SIMULATED"}
            </p>
          </div>

          <button
            type="button"
            onClick={exitFullscreen}
            className="text-[9px] font-bold text-yellow-500 hover:text-yellow-400"
          >
            EXIT
          </button>
        </div>
      )}

      {/* =====================================================
          MARKET / MODE BAR
      ===================================================== */}

      {!fullscreen && (
        <section className="grid shrink-0 gap-3 lg:grid-cols-2">
          {/* MARKET */}

          <div className="relative rounded-xl border border-zinc-800 bg-[#15181C] p-2.5">
            <button
              type="button"
              onClick={() =>
                setShowMarkets(
                  !showMarkets
                )
              }
              disabled={!!activeTrade}
              className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-[#0F1114] p-2.5 text-left disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Bitcoin className="h-4 w-4 text-yellow-500" />
                </div>

                <div>
                  <p className="text-xs font-bold text-white">
                    {selectedMarket.symbol}
                  </p>

                  <p className="text-[9px] text-zinc-500">
                    Select market
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-xs font-bold text-white">
                    $
                    {
                      selectedMarket.price
                    }
                  </p>

                  <p
                    className={
                      selectedMarket.positive
                        ? "text-[9px] text-green-500"
                        : "text-[9px] text-red-500"
                    }
                  >
                    {
                      selectedMarket.change
                    }
                  </p>
                </div>

                <ChevronDown className="h-4 w-4 text-zinc-500" />
              </div>
            </button>

            {showMarkets && (
              <div className="absolute left-2.5 right-2.5 top-[calc(100%+6px)] z-[60] rounded-xl border border-zinc-700 bg-[#181B20] p-2 shadow-2xl">
                {markets.map(
                  (market) => (
                    <button
                      type="button"
                      key={
                        market.symbol
                      }
                      onClick={() => {
                        setSelectedMarket(
                          market
                        );

                        setShowMarkets(
                          false
                        );

                        setScanResult(
                          null
                        );
                      }}
                      className="flex w-full items-center justify-between rounded-lg p-2.5 text-left hover:bg-zinc-800"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">
                          {
                            market.symbol
                          }
                        </p>

                        <p className="text-[9px] text-zinc-500">
                          TradingView
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-white">
                          $
                          {
                            market.price
                          }
                        </p>

                        <p
                          className={
                            market.positive
                              ? "text-[9px] text-green-500"
                              : "text-[9px] text-red-500"
                          }
                        >
                          {
                            market.change
                          }
                        </p>
                      </div>
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* MODES */}

          <div className="rounded-xl border border-zinc-800 bg-[#15181C] p-2.5">
            <div className="flex gap-2 overflow-x-auto">
              {tradingModes.map(
                (mode) => {
                  const Icon =
                    mode.icon;

                  const active =
                    selectedMode ===
                    mode.id;

                  return (
                    <button
                      type="button"
                      key={mode.id}
                      onClick={() =>
                        setSelectedMode(
                          mode.id
                        )
                      }
                      disabled={
                        !!activeTrade
                      }
                      className={`flex min-w-[105px] flex-1 items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        active
                          ? "border-yellow-500/40 bg-yellow-500/10"
                          : "border-zinc-800 bg-[#0F1114] hover:border-zinc-700"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          active
                            ? "text-yellow-500"
                            : "text-zinc-500"
                        }`}
                      />

                      <div className="min-w-0">
                        <p
                          className={`text-[10px] font-bold ${
                            active
                              ? "text-yellow-500"
                              : "text-white"
                          }`}
                        >
                          {
                            mode.title
                          }
                        </p>

                        <p className="truncate text-[8px] text-zinc-500">
                          {
                            mode.subtitle
                          }
                        </p>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FOCUS MARKET STRIP
      ===================================================== */}

      {fullscreen && (
        <section className="flex shrink-0 items-center justify-between rounded-xl border border-zinc-800 bg-[#111418] px-3 py-2">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />

            <span className="text-sm font-bold text-white">
              {selectedMarket.symbol}
            </span>

            <span className="text-xs text-zinc-500">
              $
              {
                selectedMarket.price
              }
            </span>

            <span
              className={
                selectedMarket.positive
                  ? "text-xs text-green-500"
                  : "text-xs text-red-500"
              }
            >
              {
                selectedMarket.change
              }
            </span>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {tradingModes.map(
              (mode) => {
                const active =
                  selectedMode ===
                  mode.id;

                return (
                  <button
                    type="button"
                    key={mode.id}
                    onClick={() =>
                      setSelectedMode(
                        mode.id
                      )
                    }
                    disabled={
                      !!activeTrade
                    }
                    className={`rounded-lg px-3 py-1.5 text-[9px] font-bold ${
                      active
                        ? "bg-yellow-500 text-black"
                        : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {
                      mode.title
                    }
                  </button>
                );
              }
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          MAIN TERMINAL

          CHART REDESIGN:
          The old version used:
             h-[760px]
             h-[820px]
             h-[900px]

          New version:
             460px mobile
             520px tablet
             600px desktop
             650px large desktop

          The order panel no longer determines chart height.
      ===================================================== */}

      <section
        className={
          fullscreen
            ? "flex min-h-0 flex-1 flex-col gap-2 overflow-hidden lg:flex-row"
            : "grid min-w-0 items-start gap-3 xl:grid-cols-12"
        }
      >
        {/* ===================================================
            CHART
        =================================================== */}

        <div
          className={
            fullscreen
              ? "flex min-h-0 min-w-0 flex-1"
              : "min-w-0 xl:col-span-8"
          }
        >
          <TradingChartPanel
            market={
              selectedMarket
            }
            mode={
              selectedMode
            }
            activeTrade={
              activeTrade
            }
            fullscreen={
              fullscreen
            }
            accountMode={
              accountMode
            }
          />
        </div>

        {/* ===================================================
            ORDER PANEL
        =================================================== */}

        <div
          className={
            fullscreen
              ? "w-full shrink-0 lg:w-[300px] xl:w-[320px]"
              : "min-w-0 xl:col-span-4"
          }
        >
          <div className="flex max-h-[650px] min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C] shadow-xl">
            {/* PANEL HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-[#121418] p-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-white">
                    Trade Terminal
                  </h2>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${
                      accountMode ===
                      "demo"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {accountMode ===
                    "demo"
                      ? "Demo"
                      : "Real Sim"}
                  </span>
                </div>

                <p className="mt-0.5 text-[9px] text-zinc-500">
                  {selectedMode} •{" "}
                  {
                    selectedMarket.symbol
                  }
                </p>
              </div>

              <ModeIcon className="h-5 w-5 text-yellow-500" />
            </div>

            {/* PANEL CONTENT */}

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <div className="space-y-3">
                {/* EXECUTION */}

                <div>
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                    Execution
                  </p>

                  <div className="grid grid-cols-2 rounded-xl border border-zinc-800 bg-[#0F1114] p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setTradeType(
                          "Auto"
                        )
                      }
                      disabled={
                        !!activeTrade
                      }
                      className={`rounded-lg py-2 text-xs font-bold ${
                        tradeType ===
                        "Auto"
                          ? "bg-yellow-500 text-black"
                          : "text-zinc-500"
                      }`}
                    >
                      Auto
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setTradeType(
                          "Manual"
                        )
                      }
                      disabled={
                        !!activeTrade
                      }
                      className={`rounded-lg py-2 text-xs font-bold ${
                        tradeType ===
                        "Manual"
                          ? "bg-yellow-500 text-black"
                          : "text-zinc-500"
                      }`}
                    >
                      Manual
                    </button>
                  </div>
                </div>

                {/* STAKE */}

                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.03] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                      1. Select Stake
                    </label>

                    <span className="text-[9px] font-semibold text-yellow-500">
                      95% Payout
                    </span>
                  </div>

                  <div className="flex items-center overflow-hidden rounded-xl border border-zinc-800 bg-[#0F1114]">
                    <button
                      type="button"
                      onClick={
                        decreaseStake
                      }
                      disabled={
                        !!activeTrade
                      }
                      className="px-3.5 py-2.5 text-sm font-bold text-zinc-500 transition hover:bg-zinc-800 hover:text-white disabled:opacity-40"
                    >
                      −
                    </button>

                    <div className="flex flex-1 items-center justify-center">
                      <span className="mr-1 text-xs text-zinc-500">
                        $
                      </span>

                      <input
                        value={stake}
                        onChange={(
                          event
                        ) =>
                          updateStake(
                            event
                              .target
                              .value
                          )
                        }
                        disabled={
                          !!activeTrade
                        }
                        inputMode="decimal"
                        className="w-24 bg-transparent text-center text-base font-black text-white outline-none"
                        placeholder="10"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={
                        increaseStake
                      }
                      disabled={
                        !!activeTrade
                      }
                      className="px-3.5 py-2.5 text-sm font-bold text-zinc-500 transition hover:bg-zinc-800 hover:text-white disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    {[1, 5, 10, 25].map(
                      (amount) => (
                        <button
                          type="button"
                          key={
                            amount
                          }
                          onClick={() => {
                            setStake(
                              amount.toString()
                            );

                            setScanResult(
                              null
                            );
                          }}
                          disabled={
                            !!activeTrade
                          }
                          className={`rounded-lg border py-1.5 text-[9px] font-bold transition ${
                            Number(
                              stake
                            ) ===
                            amount
                              ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                              : "border-zinc-800 bg-[#0F1114] text-zinc-500 hover:text-white"
                          }`}
                        >
                          $
                          {
                            amount
                          }
                        </button>
                      )
                    )}
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-zinc-800 bg-[#0F1114] p-2">
                      <p className="text-[8px] uppercase tracking-wider text-zinc-600">
                        Profit
                      </p>

                      <p className="mt-1 text-sm font-black text-green-400">
                        +$
                        {potentialProfit.toFixed(
                          2
                        )}
                      </p>
                    </div>

                    <div className="rounded-lg border border-zinc-800 bg-[#0F1114] p-2">
                      <p className="text-[8px] uppercase tracking-wider text-zinc-600">
                        Return
                      </p>

                      <p className="mt-1 text-sm font-black text-yellow-400">
                        $
                        {potentialReturn.toFixed(
                          2
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI SCANNER */}

                <button
                  type="button"
                  onClick={
                    handleAiScan
                  }
                  disabled={
                    !!activeTrade ||
                    isScanning ||
                    !Number.isFinite(
                      numericStake
                    ) ||
                    numericStake <= 0
                  }
                  className="flex w-full items-center justify-between rounded-xl border border-purple-500/30 bg-purple-500/10 p-2.5 transition hover:bg-purple-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15">
                      {isScanning ? (
                        <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                      ) : (
                        <BrainCircuit className="h-4 w-4 text-purple-400" />
                      )}
                    </div>

                    <div className="text-left">
                      <p className="text-[10px] font-bold text-purple-300">
                        {isScanning
                          ? "Scanning..."
                          : "2. AI Market Scanner"}
                      </p>

                      <p className="text-[8px] text-zinc-500">
                        Stake $
                        {Number.isFinite(
                          numericStake
                        )
                          ? numericStake.toFixed(
                              2
                            )
                          : "0.00"}
                      </p>
                    </div>
                  </div>

                  <Sparkles className="h-4 w-4 text-purple-400" />
                </button>

                {/* DIRECTION */}

                <div>
                  <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                    Trade Direction
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDirection(
                          "BUY"
                        )
                      }
                      disabled={
                        !!activeTrade
                      }
                      className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                        direction ===
                        "BUY"
                          ? "border-green-500/50 bg-green-500/10 text-green-400"
                          : "border-zinc-800 bg-[#0F1114] text-zinc-500 hover:text-white"
                      }`}
                    >
                      <TrendingUp className="mx-auto mb-1 h-4 w-4" />
                      UP
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDirection(
                          "SELL"
                        )
                      }
                      disabled={
                        !!activeTrade
                      }
                      className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                        direction ===
                        "SELL"
                          ? "border-red-500/50 bg-red-500/10 text-red-400"
                          : "border-zinc-800 bg-[#0F1114] text-zinc-500 hover:text-white"
                      }`}
                    >
                      <TrendingDown className="mx-auto mb-1 h-4 w-4" />
                      DOWN
                    </button>
                  </div>
                </div>

                {/* DURATION */}

                <div>
                  <label className="mb-1.5 block text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                    Trade Duration
                  </label>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[5, 10, 30, 60].map(
                      (seconds) => (
                        <button
                          type="button"
                          key={
                            seconds
                          }
                          onClick={() =>
                            setTradeDuration(
                              seconds
                            )
                          }
                          disabled={
                            !!activeTrade
                          }
                          className={`rounded-lg border py-2 text-[9px] font-bold ${
                            tradeDuration ===
                            seconds
                              ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                              : "border-zinc-800 bg-[#0F1114] text-zinc-500 hover:text-white"
                          }`}
                        >
                          {
                            seconds
                          }
                          s
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* ACCOUNT BALANCE */}

                <div
                  className={`rounded-xl border p-2.5 ${
                    accountMode ===
                    "real"
                      ? "border-yellow-500/20 bg-yellow-500/[0.03]"
                      : "border-zinc-800 bg-[#0F1114]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">
                        Available{" "}
                        {accountMode ===
                        "demo"
                          ? "Demo"
                          : "Real Simulated"}{" "}
                        Balance
                      </p>

                      <p className="mt-1 text-lg font-black text-white">
                        $
                        {
                          formattedBalance
                        }
                      </p>

                      <p className="mt-0.5 text-[7px] uppercase text-zinc-700">
                        Loaded from MySQL
                      </p>
                    </div>

                    <Wallet
                      className={`h-5 w-5 ${
                        accountMode ===
                        "real"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    />
                  </div>
                </div>

                {/* SCANNER RESULT */}

                {scanResult && (
                  <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-400" />

                        <span className="text-[9px] font-black uppercase text-purple-300">
                          Scanner Setup
                        </span>
                      </div>

                      <span className="text-[9px] font-black text-yellow-400">
                        $
                        {scanResult.selectedStake.toFixed(
                          2
                        )}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-[7px] text-zinc-600">
                          Market
                        </p>

                        <p className="text-[9px] font-bold text-white">
                          {
                            scanResult.market
                              .symbol
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-[7px] text-zinc-600">
                          Signal
                        </p>

                        <p
                          className={`text-[9px] font-bold ${
                            scanResult.direction ===
                            "BUY"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {scanResult.direction ===
                          "BUY"
                            ? "UP"
                            : "DOWN"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[7px] text-zinc-600">
                          Confidence
                        </p>

                        <p className="text-[9px] font-bold text-purple-400">
                          {
                            scanResult.confidence
                          }
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* TRADE BUTTON */}

            <div className="shrink-0 border-t border-zinc-800 bg-[#121418] p-3">
              {activeTrade ? (
                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-2.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />

                    <span className="text-[10px] font-black uppercase text-yellow-400">
                      Trade Active
                    </span>
                  </div>

                  <p className="mt-1 text-[8px] text-zinc-500">
                    Server timer is controlling settlement.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={
                    handleTrade
                  }
                  disabled={
                    isExecuting ||
                    !Number.isFinite(
                      numericStake
                    ) ||
                    numericStake <= 0 ||
                    numericStake >
                      currentBalance
                  }
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black uppercase tracking-wider shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    direction ===
                    "BUY"
                      ? "bg-green-500 text-black shadow-green-500/10 hover:bg-green-400"
                      : "bg-red-500 text-white shadow-red-500/10 hover:bg-red-400"
                  }`}
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Opening Trade...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />

                      {accountMode ===
                      "demo"
                        ? "DEMO TRADE"
                        : "REAL SIM TRADE"}
                    </>
                  )}
                </button>
              )}

              <p className="mt-1.5 text-center text-[8px] text-zinc-600">
                {accountMode ===
                "demo"
                  ? "Demo virtual funds • Server controlled execution"
                  : "Simulated real-account funds • No external money movement"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          METRICS
      ===================================================== */}

      {!fullscreen && (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric
            icon={
              <Wallet className="h-4 w-4 text-yellow-500" />
            }
            title={
              accountMode ===
              "demo"
                ? "Demo Balance"
                : "Real Balance"
            }
            value={`$${formattedBalance}`}
          />

          <Metric
            icon={
              <DollarSign className="h-4 w-4 text-green-500" />
            }
            title="Active Stake"
            value={
              activeTrade
                ? `$${activeTrade.stake.toFixed(
                    2
                  )}`
                : "$0.00"
            }
          />

          <Metric
            icon={
              <LineChart className="h-4 w-4 text-blue-400" />
            }
            title="Last Result"
            value={
              tradeResult
                ? tradeResult.status
                : "No Result"
            }
          />

          <Metric
            icon={
              <BarChart3 className="h-4 w-4 text-purple-400" />
            }
            title="Open Trades"
            value={
              activeTrade
                ? "1"
                : "0"
            }
          />
        </section>
      )}

      {/* =====================================================
          AI SCANNER MODAL

          SMALL MODAL - DOES NOT CHANGE CHART SIZE
      ===================================================== */}

      {showScanner && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-purple-500/30 bg-[#15181C] shadow-2xl">
            <div className="border-b border-zinc-800 bg-[#121418] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
                  {isScanning ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
                  ) : (
                    <BrainCircuit className="h-4 w-4 text-purple-400" />
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-black text-white">
                    AI Market Scanner
                  </h3>

                  <p className="text-[9px] text-zinc-500">
                    Simulated technical-signal analysis
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">
              {isScanning ? (
                <div className="py-7 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                  </div>

                  <p className="text-sm font-semibold text-white">
                    Scanning markets...
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-500">
                    Analyzing simulated market signals
                  </p>
                </div>
              ) : scanResult ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-zinc-600">
                          Recommended Setup
                        </p>

                        <p className="mt-1 text-base font-black text-white">
                          {
                            scanResult.market
                              .symbol
                          }
                        </p>
                      </div>

                      <div
                        className={`rounded-xl px-3 py-2 text-center ${
                          scanResult.direction ===
                          "BUY"
                            ? "bg-green-500/10"
                            : "bg-red-500/10"
                        }`}
                      >
                        {scanResult.direction ===
                        "BUY" ? (
                          <TrendingUp className="mx-auto h-5 w-5 text-green-400" />
                        ) : (
                          <TrendingDown className="mx-auto h-5 w-5 text-red-400" />
                        )}

                        <p
                          className={`mt-1 text-[8px] font-black ${
                            scanResult.direction ===
                            "BUY"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {scanResult.direction ===
                          "BUY"
                            ? "UP"
                            : "DOWN"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-[#0F1114] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500">
                        Selected Stake
                      </span>

                      <span className="text-xs font-black text-yellow-400">
                        $
                        {scanResult.selectedStake.toFixed(
                          2
                        )}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500">
                        Confidence
                      </span>

                      <span className="text-xs font-black text-purple-400">
                        {
                          scanResult.confidence
                        }
                        %
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500">
                        Duration
                      </span>

                      <span className="text-xs font-black text-white">
                        {
                          scanResult.suggestedDuration
                        }
                        s
                      </span>
                    </div>

                    <div className="mt-2 border-t border-zinc-800 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500">
                          Payout
                        </span>

                        <span className="text-xs font-black text-yellow-400">
                          95%
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500">
                          Potential Profit
                        </span>

                        <span className="text-xs font-black text-green-400">
                          +$
                          {scanResult.potentialProfit.toFixed(
                            2
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[8px] leading-4 text-zinc-600">
                    This is a simulated market signal and
                    does not guarantee future market movement
                    or profit.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setShowScanner(
                          false
                        )
                      }
                      className="rounded-xl border border-zinc-800 bg-[#0F1114] py-2.5 text-[10px] font-bold text-zinc-400 hover:text-white"
                    >
                      Close
                    </button>

                    <button
                      type="button"
                      onClick={
                        applyScanResult
                      }
                      className="rounded-xl bg-purple-600 py-2.5 text-[10px] font-black text-white hover:bg-purple-500"
                    >
                      Apply Setup
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          NOTIFICATION
      ===================================================== */}

      {tradeNotification && (
        <div className="fixed bottom-5 left-1/2 z-[300] w-[calc(100vw-30px)] max-w-sm -translate-x-1/2">
          <div className="rounded-xl border border-zinc-700 bg-[#15181C]/95 px-4 py-3 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-xs font-semibold text-white">
              {tradeNotification}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          SMALL RESULT POPUP

          This is deliberately small and fixed.
          It cannot resize the chart.
      ===================================================== */}

      {tradeResult && (
        <div className="pointer-events-none fixed bottom-5 right-5 z-[180] w-[270px] max-w-[calc(100vw-30px)]">
          <div
            className={`pointer-events-auto rounded-xl border p-3 shadow-2xl backdrop-blur-xl ${
              tradeResult.status ===
              "WON"
                ? "border-green-500/40 bg-[#101814]/95"
                : "border-red-500/40 bg-[#191113]/95"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  tradeResult.status ===
                  "WON"
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                }`}
              >
                {tradeResult.status ===
                "WON" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-xs font-black ${
                        tradeResult.status ===
                        "WON"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {tradeResult.status ===
                      "WON"
                        ? "TRADE WON"
                        : "TRADE LOST"}
                    </p>

                    <p className="text-[8px] text-zinc-500">
                      {
                        tradeResult.market
                      }{" "}
                      •{" "}
                      {tradeResult.direction ===
                      "BUY"
                        ? "UP"
                        : "DOWN"}{" "}
                      •{" "}
                      {tradeResult.accountMode ===
                      "demo"
                        ? "DEMO"
                        : "REAL SIM"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setTradeResult(
                        null
                      )
                    }
                    className="text-zinc-600 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-zinc-600">
                      {tradeResult.status ===
                      "WON"
                        ? "Profit"
                        : "Loss"}
                    </p>

                    <p
                      className={`text-lg font-black ${
                        tradeResult.status ===
                        "WON"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {tradeResult.status ===
                      "WON"
                        ? "+"
                        : "-"}
                      $
                      {tradeResult.amount.toFixed(
                        2
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[8px] uppercase tracking-wider text-zinc-600">
                      Stake
                    </p>

                    <p className="text-[10px] font-bold text-white">
                      $
                      {tradeResult.stake.toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}