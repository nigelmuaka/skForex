"use client";

import { useEffect, useState } from "react";

import { AppSidebar } from "@/components/dashboard/app-sidebar";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Menu,
  Bell,
  ChevronDown,
  Search,
  Wallet,
  Globe,
  CircleDollarSign,
  Loader2,
} from "lucide-react";

type AccountMode = "demo" | "real";

type UserData = {
  userId: number;
  name: string;
  role: string;
};

type BalanceData = {
  demoBalance: number;
  realBalance: number;
};

type BalanceResponse = {
  demoBalance?: number | string | null;
  realBalance?: number | string | null;
  balance?: number | string | null;
  accountMode?: string | null;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] =
    useState<UserData | null>(null);

  const [balanceData, setBalanceData] =
    useState<BalanceData>({
      demoBalance: 0,
      realBalance: 0,
    });

  const [accountMode, setAccountMode] =
    useState<AccountMode>("demo");

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [loadingBalance, setLoadingBalance] =
    useState(true);

  /* =========================================================
     NORMALIZE ACCOUNT MODE
  ========================================================= */

  function normalizeAccountMode(
    value: unknown
  ): AccountMode {
    return String(value).toLowerCase() === "real"
      ? "real"
      : "demo";
  }

  /* =========================================================
     CHECK CURRENT LOGIN SESSION
  ========================================================= */

  async function checkSession() {
    try {
      const response = await fetch(
        "/api/dashboard",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.replace("/login");
        return;
      }

      if (response.status === 403) {
        window.location.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to verify account"
        );
      }

      const data = await response.json();

      /*
       * Make absolutely sure this is a trader.
       */

      if (data.role !== "trader") {
        window.location.replace("/login");
        return;
      }

      setUserData({
        userId: Number(data.userId),
        name: data.name || "Trader",
        role: data.role,
      });

      /*
       * Dashboard endpoint may already provide
       * the current account mode.
       */

      if (data.accountMode) {
        setAccountMode(
          normalizeAccountMode(
            data.accountMode
          )
        );
      }

      /*
       * Dashboard endpoint may also provide
       * both balances.
       */

      if (
        data.demoBalance !== undefined ||
        data.realBalance !== undefined
      ) {
        setBalanceData({
          demoBalance: Number(
            data.demoBalance ?? 0
          ),
          realBalance: Number(
            data.realBalance ?? 0
          ),
        });
      }
    } catch (error) {
      console.error(
        "Session verification error:",
        error
      );

      window.location.replace("/login");
    } finally {
      setCheckingSession(false);
    }
  }

  /* =========================================================
     LOAD ACCOUNT MODE
  ========================================================= */

  async function fetchAccountMode() {
    try {
      const response = await fetch(
        "/api/account/mode",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.replace("/login");
        return;
      }

      if (response.status === 403) {
        window.location.replace("/login");
        return;
      }

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      const mode =
        normalizeAccountMode(
          data.accountMode
        );

      setAccountMode(mode);

      /*
       * If this endpoint returns balances,
       * synchronize them too.
       */

      setBalanceData((previous) => ({
        demoBalance:
          data.demoBalance !== undefined &&
          data.demoBalance !== null
            ? Number(data.demoBalance)
            : previous.demoBalance,

        realBalance:
          data.realBalance !== undefined &&
          data.realBalance !== null
            ? Number(data.realBalance)
            : previous.realBalance,
      }));
    } catch (error) {
      console.error(
        "Account mode fetch error:",
        error
      );
    }
  }

  /* =========================================================
     LOAD USER WALLET
  ========================================================= */

  async function fetchBalance() {
    try {
      setLoadingBalance(true);

      const response = await fetch(
        "/api/user/balance",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      /*
       * Session expired.
       */

      if (response.status === 401) {
        window.location.replace("/login");
        return;
      }

      if (response.status === 403) {
        window.location.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to load wallet"
        );
      }

      const data: BalanceResponse =
        await response.json();

      /*
       * IMPORTANT:
       *
       * We store BOTH balances.
       *
       * Never do:
       *
       * demoBalance || realBalance
       *
       * because that will incorrectly prefer
       * the demo balance.
       */

      setBalanceData({
        demoBalance: Number(
          data.demoBalance ?? 0
        ),

        realBalance: Number(
          data.realBalance ?? 0
        ),
      });

      /*
       * Synchronize account mode if the
       * backend provides it.
       */

      if (data.accountMode) {
        setAccountMode(
          normalizeAccountMode(
            data.accountMode
          )
        );
      }
    } catch (error) {
      console.error(
        "Balance fetch error:",
        error
      );
    } finally {
      setLoadingBalance(false);
    }
  }

  /* =========================================================
     INITIAL SESSION CHECK
  ========================================================= */

  useEffect(() => {
    checkSession();
  }, []);

  /* =========================================================
     LOAD WALLET AFTER SESSION
  ========================================================= */

  useEffect(() => {
    if (!userData) return;

    fetchAccountMode();
    fetchBalance();

    /*
     * Refresh wallet and account mode
     * every 5 seconds.
     */

    const interval =
      window.setInterval(() => {
        fetchAccountMode();
        fetchBalance();
      }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [userData]);

  /* =========================================================
     SELECT CORRECT BALANCE
  ========================================================= */

  const selectedBalance =
    accountMode === "real"
      ? balanceData.realBalance
      : balanceData.demoBalance;

  /* =========================================================
     ACCOUNT LABEL
  ========================================================= */

  const accountLabel =
    accountMode === "real"
      ? "REAL"
      : "DEMO";

  /* =========================================================
     FORMAT BALANCE
  ========================================================= */

  const formattedBalance =
    Number(selectedBalance || 0).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  /* =========================================================
     MOBILE BALANCE
  ========================================================= */

  const mobileBalance =
    selectedBalance >= 1000000
      ? `$${(
          selectedBalance / 1000000
        ).toFixed(1)}M`
      : selectedBalance >= 1000
      ? `$${(
          selectedBalance / 1000
        ).toFixed(1)}K`
      : `$${Number(
          selectedBalance || 0
        ).toFixed(0)}`;

  /* =========================================================
     DON'T DISPLAY DASHBOARD WHILE CHECKING SESSION
  ========================================================= */

  if (checkingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0E11] text-white">

        <div className="flex flex-col items-center gap-3">

          <Loader2 className="h-7 w-7 animate-spin text-yellow-500" />

          <p className="text-sm text-zinc-500">
            Verifying your account...
          </p>

        </div>

      </div>
    );
  }

  /* =========================================================
     IF VERIFICATION FAILED
  ========================================================= */

  if (!userData) {
    return null;
  }

  /* =========================================================
     USER DISPLAY INFORMATION
  ========================================================= */

  const displayName =
    userData.name || "Trader";

  const profileInitial =
    displayName
      .trim()
      .charAt(0)
      .toUpperCase() || "T";

  const formattedName =
    displayName
      .split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      .join(" ");

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0E11] text-white">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="hidden w-60 shrink-0 border-r border-zinc-800 bg-[#111315] lg:flex xl:w-64">

        <AppSidebar />

      </aside>


      <div className="flex min-w-0 flex-1 flex-col">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="z-40 flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-[#111315]/95 px-3 backdrop-blur-md sm:h-16 sm:px-5 lg:px-6">

          <div className="flex min-w-0 items-center gap-3 sm:gap-5">

            {/* =================================================
                MOBILE MENU
            ================================================= */}

            <div className="lg:hidden">

              <Sheet>

                <SheetTrigger
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 transition hover:bg-zinc-800"
                >
                  <Menu className="h-5 w-5" />
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="w-64 border-zinc-800 bg-[#111315] p-0"
                >
                  <AppSidebar />
                </SheetContent>

              </Sheet>

            </div>


            {/* =================================================
                BRAND
            ================================================= */}

            <div className="shrink-0">

              <div className="text-base font-black tracking-wide text-yellow-500 sm:text-xl">
                PIPMASTER
              </div>

              <div className="hidden text-[9px] tracking-[0.2em] text-zinc-600 sm:block">
                TRADING TERMINAL
              </div>

            </div>


            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="relative hidden md:block">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

              <input
                type="text"
                placeholder="Search markets..."
                className="h-9 w-48 rounded-lg border border-zinc-800 bg-[#0B0E11] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-500 sm:w-64 lg:w-80"
              />

            </div>

          </div>


          {/* =================================================
              RIGHT HEADER
          ================================================= */}

          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">

            {/* =================================================
                MARKET STATUS
            ================================================= */}

            <div className="hidden items-center gap-2 text-xs sm:flex">

              <span className="text-zinc-500">
                Market
              </span>

              <span className="flex items-center gap-1 font-semibold text-green-500">

                <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />

                OPEN

              </span>

            </div>


            {/* =================================================
                ACCOUNT MODE + DESKTOP BALANCE
            ================================================= */}

            <div className="hidden items-center gap-3 border-l border-zinc-800 pl-4 sm:flex">

              <div className="flex items-center gap-2">

                <Wallet
                  className={`h-4 w-4 ${
                    accountMode === "real"
                      ? "text-green-400"
                      : "text-yellow-500"
                  }`}
                />

                <div className="flex flex-col">

                  <div className="flex items-center gap-1.5">

                    <span className="text-[9px] uppercase tracking-wider text-zinc-600">
                      {accountLabel}
                    </span>

                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                        accountMode === "real"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {accountLabel}
                    </span>

                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      accountMode === "real"
                        ? "text-green-400"
                        : "text-white"
                    }`}
                  >
                    {loadingBalance
                      ? "Loading..."
                      : `$${formattedBalance}`}
                  </span>

                </div>

              </div>

            </div>


            {/* =================================================
                MOBILE BALANCE
            ================================================= */}

            <div className="flex items-center gap-1.5 sm:hidden">

              <CircleDollarSign
                className={`h-4 w-4 ${
                  accountMode === "real"
                    ? "text-green-400"
                    : "text-yellow-500"
                }`}
              />

              <div className="flex flex-col">

                <span
                  className={`text-[8px] font-bold ${
                    accountMode === "real"
                      ? "text-green-400"
                      : "text-yellow-500"
                  }`}
                >
                  {accountLabel}
                </span>

                <span className="text-xs font-semibold text-green-400">

                  {loadingBalance
                    ? "..."
                    : mobileBalance}

                </span>

              </div>

            </div>


            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >

              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />

              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500" />

            </button>


            {/* =================================================
                LANGUAGE
            ================================================= */}

            <button
              type="button"
              aria-label="Language"
              className="hidden rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white md:block"
            >

              <Globe className="h-5 w-5" />

            </button>


            {/* =================================================
                LOGGED-IN USER
            ================================================= */}

            <button
              type="button"
              className="hidden items-center gap-2 border-l border-zinc-800 pl-4 md:flex"
            >

              {/* INITIAL */}

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 font-bold uppercase text-black">

                {profileInitial}

              </div>


              <div className="hidden text-left lg:block">

                {/* REAL NAME FROM DATABASE */}

                <p className="text-xs font-semibold text-white">
                  {formattedName}
                </p>

                {/* ACCOUNT MODE */}

                <p
                  className={`text-[10px] ${
                    accountMode === "real"
                      ? "text-green-400"
                      : "text-zinc-500"
                  }`}
                >
                  {accountMode === "real"
                    ? "Real Account"
                    : "Demo Account"}
                </p>

              </div>


              <ChevronDown className="h-4 w-4 text-zinc-500" />

            </button>

          </div>

        </header>


        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <main className="min-h-0 flex-1 overflow-y-auto bg-[#0B0E11] p-3 sm:p-4 lg:p-5">

          <div className="mx-auto w-full max-w-[1800px]">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}