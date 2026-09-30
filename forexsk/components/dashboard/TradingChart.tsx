"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

import {
  BarChart3,
  Maximize2,
  Settings,
  RefreshCw,
  Wallet,
  Check,
  Loader2,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type AccountMode = "demo" | "real";

interface BalanceResponse {
  success?: boolean;
  accountMode?: AccountMode;
  selectedAccountMode?: AccountMode;

  balance?: number | string;

  demoBalance?: number | string;
  realBalance?: number | string;

  balances?: {
    demo?: number | string;
    real?: number | string;
  };

  message?: string;
}

/* =========================================================
   API
========================================================= */

const API_URL = "http://localhost:5000";

/* =========================================================
   HELPERS
========================================================= */

function toNumber(value: unknown): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/* =========================================================
   TRADING CHART
========================================================= */

function TradingChart() {
  const [chartKey, setChartKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  /* =======================================================
     ACCOUNT STATE
  ======================================================= */

  const [accountMode, setAccountMode] =
    useState<AccountMode>("demo");

  const [demoBalance, setDemoBalance] = useState(0);
  const [realBalance, setRealBalance] = useState(0);

  const [switchingAccount, setSwitchingAccount] =
    useState(false);

  const [accountMessage, setAccountMessage] =
    useState("");

  const [loadingAccount, setLoadingAccount] =
    useState(true);

  /* =======================================================
     CURRENT BALANCE
  ======================================================= */

  const currentBalance =
    accountMode === "real" ? realBalance : demoBalance;

  /* =======================================================
     CHART CONFIGURATION

     Keep this stable so TradingView does not recreate the
     iframe whenever database information changes.
  ======================================================= */

  const chartConfig = useMemo(
    () => ({
      theme: "dark" as const,
      autosize: true,

      symbol: "BINANCE:BTCUSDT",

      interval: "15",

      timezone: "Africa/Nairobi",

      hide_side_toolbar: true,

      allow_symbol_change: true,

      withdateranges: true,

      save_image: false,

      hide_top_toolbar: false,

      hide_legend: false,

      studies: [
        "MASimple@tv-basicstudies",
        "RSI@tv-basicstudies",
        "MACD@tv-basicstudies",
        "Volume@tv-basicstudies",
      ],
    }),
    []
  );

  /* =======================================================
     LOAD ACCOUNT MODE

     Reads the selected account from the Express session.
  ======================================================= */

  const loadAccountMode = useCallback(async () => {
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
        throw new Error("Unable to load account mode");
      }

      const data = await response.json();

      const mode =
        String(
          data?.accountMode ||
            data?.selectedAccountMode ||
            "demo"
        ).toLowerCase() === "real"
          ? "real"
          : "demo";

      setAccountMode(mode);
    } catch (error) {
      console.error(
        "Failed to load account mode:",
        error
      );
    }
  }, []);

  /* =======================================================
     LOAD BALANCE

     Reads both balances from MySQL through Express.

     Expected endpoint:
       GET /api/user/balance
  ======================================================= */

  const loadBalance = useCallback(async () => {
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
        throw new Error("Unable to load balance");
      }

      const data: BalanceResponse =
        await response.json();

      /* ---------------------------------------------------
         Support several response formats so this component
         works with the backend structure already created.
      --------------------------------------------------- */

      const demo =
        data.demoBalance ??
        data.balances?.demo ??
        0;

      const real =
        data.realBalance ??
        data.balances?.real ??
        0;

      setDemoBalance(toNumber(demo));
      setRealBalance(toNumber(real));

      /* ---------------------------------------------------
         If the backend also returns the selected mode,
         keep the chart synchronized with the session.
      --------------------------------------------------- */

      const serverMode =
        data.accountMode ||
        data.selectedAccountMode;

      if (serverMode) {
        setAccountMode(
          String(serverMode).toLowerCase() === "real"
            ? "real"
            : "demo"
        );
      }
    } catch (error) {
      console.error(
        "Failed to load account balance:",
        error
      );
    } finally {
      setLoadingAccount(false);
    }
  }, []);

  /* =======================================================
     LOAD ACCOUNT DATA

     Initial load.
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!mounted) return;

      await loadAccountMode();
      await loadBalance();
    };

    load();

    return () => {
      mounted = false;
    };
  }, [loadAccountMode, loadBalance]);

  /* =======================================================
     AUTO REFRESH ACCOUNT DATA

     Keeps the displayed balance synchronized with MySQL.

     The TradingView iframe is NOT recreated.
  ======================================================= */

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadAccountMode();
      loadBalance();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadAccountMode, loadBalance]);

  /* =======================================================
     SWITCH ACCOUNT

     This changes the Express session account mode.

     DEMO:
       Uses demo_balance

     REAL:
       Uses real_balance

     The REAL account is currently simulated/internal.
  ======================================================= */

  const switchAccount = async (
    mode: AccountMode
  ) => {
    if (switchingAccount) return;

    if (mode === accountMode) {
      return;
    }

    setSwitchingAccount(true);
    setAccountMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/account/switch`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountMode: mode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to switch account"
        );
      }

      /* -----------------------------------------------
         Update local state immediately.
      ------------------------------------------------ */

      setAccountMode(mode);

      setAccountMessage(
        mode === "demo"
          ? "Demo account selected"
          : "Real account selected"
      );

      /* -----------------------------------------------
         Read the latest balance from the database.
      ------------------------------------------------ */

      await loadBalance();

      /* -----------------------------------------------
         Remove the small notification after a moment.
      ------------------------------------------------ */

      window.setTimeout(() => {
        setAccountMessage("");
      }, 2000);
    } catch (error) {
      console.error(
        "Account switch error:",
        error
      );

      setAccountMessage(
        error instanceof Error
          ? error.message
          : "Unable to switch account"
      );
    } finally {
      setSwitchingAccount(false);
    }
  };

  /* =======================================================
     MANUAL REFRESH

     Refreshes database data and recreates TradingView only
     when the user explicitly presses Refresh.
  ======================================================= */

  const handleRefresh = async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      await loadAccountMode();
      await loadBalance();

      setChartKey((current) => current + 1);
    } catch (error) {
      console.error(
        "Chart refresh error:",
        error
      );
    } finally {
      window.setTimeout(() => {
        setRefreshing(false);
      }, 1200);
    }
  };

  /* =======================================================
     FULLSCREEN
  ======================================================= */

  const handleFullscreen = () => {
    const chartContainer =
      document.getElementById(
        "pipmaster-trading-chart"
      );

    if (!chartContainer) return;

    if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .catch(() => {});

      return;
    }

    chartContainer
      .requestFullscreen()
      .catch(() => {});
  };

  /* =======================================================
     SETTINGS
  ======================================================= */

  const handleSettings = () => {
    const settingsButton =
      document.querySelector(
        "#pipmaster-trading-chart .tv-header__setting"
      ) as HTMLElement | null;

    settingsButton?.click();
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      id="pipmaster-trading-chart"
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#1A1D24]"
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex min-h-[64px] shrink-0 flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2 sm:h-[68px] sm:flex-nowrap sm:px-4 sm:py-0">
        {/* =================================================
            TITLE
        ================================================= */}

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 sm:h-9 sm:w-9">
            <BarChart3 className="h-4 w-4 text-yellow-500 sm:h-5 sm:w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-white sm:text-base">
              Live Trading Chart
            </h2>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <p className="truncate text-[10px] text-zinc-500 sm:text-xs">
                BTC / USDT • 15m
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            ACCOUNT SWITCHER

            These buttons change the account mode in the
            Express session and therefore determine which
            MySQL balance is being used.
        ================================================= */}

        <div className="order-3 flex w-full items-center justify-center sm:order-2 sm:w-auto">
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950/80 p-1">
            {/* DEMO */}

            <button
              type="button"
              onClick={() =>
                switchAccount("demo")
              }
              disabled={switchingAccount}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition sm:px-3.5 ${
                accountMode === "demo"
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/10"
                  : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {switchingAccount &&
              accountMode !== "demo" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : accountMode === "demo" ? (
                <Check className="h-3 w-3" />
              ) : null}

              DEMO
            </button>

            {/* REAL */}

            <button
              type="button"
              onClick={() =>
                switchAccount("real")
              }
              disabled={switchingAccount}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition sm:px-3.5 ${
                accountMode === "real"
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/10"
                  : "text-zinc-500 hover:bg-zinc-800 hover:text-white"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {switchingAccount &&
              accountMode !== "real" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : accountMode === "real" ? (
                <Check className="h-3 w-3" />
              ) : null}

              REAL
            </button>
          </div>
        </div>

        {/* =================================================
            CONTROLS
        ================================================= */}

        <div className="order-2 flex shrink-0 items-center gap-1 sm:order-3 sm:gap-2">
          {/* Refresh */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh chart"
            title="Refresh chart"
            className="rounded-md border border-zinc-700 p-1.5 text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />
          </button>

          {/* Settings */}

          <button
            type="button"
            onClick={handleSettings}
            aria-label="Chart settings"
            title="Chart settings"
            className="rounded-md border border-zinc-700 p-1.5 text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white sm:p-2"
          >
            <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>

          {/* Fullscreen */}

          <button
            type="button"
            onClick={handleFullscreen}
            aria-label="Fullscreen chart"
            title="Fullscreen chart"
            className="rounded-md border border-zinc-700 p-1.5 text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-800 hover:text-white sm:p-2"
          >
            <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* ===================================================
          ACCOUNT INFORMATION BAR

          Small overlay-style section.

          It does NOT change the TradingView chart's
          available height significantly.
      =================================================== */}

      <div className="flex h-[42px] shrink-0 items-center justify-between border-b border-zinc-800 bg-[#17191F] px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Wallet
            className={`h-3.5 w-3.5 shrink-0 ${
              accountMode === "real"
                ? "text-yellow-500"
                : "text-emerald-500"
            }`}
          />

          <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            {accountMode === "real"
              ? "Real Account"
              : "Demo Account"}
          </span>

          <span className="hidden text-zinc-700 sm:inline">
            |
          </span>

          <span className="hidden text-[10px] text-zinc-500 sm:inline">
            MySQL Balance
          </span>
        </div>

        <div className="flex items-center gap-2">
          {loadingAccount ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
          ) : (
            <>
              <span className="text-[10px] text-zinc-500">
                KES
              </span>

              <span
                className={`text-xs font-bold sm:text-sm ${
                  accountMode === "real"
                    ? "text-yellow-400"
                    : "text-emerald-400"
                }`}
              >
                {formatMoney(currentBalance)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ===================================================
          ACCOUNT SWITCH MESSAGE

          Small absolute notification.

          It does NOT affect chart layout.
      =================================================== */}

      {accountMessage && (
        <div className="pointer-events-none absolute left-1/2 top-[112px] z-30 -translate-x-1/2">
          <div className="rounded-lg border border-zinc-700 bg-zinc-950/95 px-3 py-2 text-[10px] font-medium text-white shadow-xl backdrop-blur">
            {accountMessage}
          </div>
        </div>
      )}

      {/* ===================================================
          CHART AREA

          Important:
          - flex-1
          - min-h-0
          - overflow-hidden
          - absolute inset-0

          TradingView therefore occupies all available
          chart space without expanding the page.
      =================================================== */}

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          key={chartKey}
          className="absolute inset-0 h-full w-full"
        >
          <AdvancedRealTimeChart
            theme={chartConfig.theme}
            autosize={chartConfig.autosize}
            symbol={chartConfig.symbol}
            interval={chartConfig.interval}
            timezone={chartConfig.timezone}
            hide_side_toolbar={
              chartConfig.hide_side_toolbar
            }
            allow_symbol_change={
              chartConfig.allow_symbol_change
            }
            withdateranges={
              chartConfig.withdateranges
            }
            save_image={
              chartConfig.save_image
            }
            hide_top_toolbar={
              chartConfig.hide_top_toolbar
            }
            hide_legend={
              chartConfig.hide_legend
            }
            studies={chartConfig.studies}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MEMO

   Prevents unnecessary TradingView iframe recreation when
   the rest of the dashboard receives database updates.
========================================================= */

export default memo(TradingChart);