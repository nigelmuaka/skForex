"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  TrendingUp,
  CandlestickChart,
  LineChart,
  Wallet,
  Newspaper,
  CalendarDays,
  History,
  Settings,
  LogOut,
  Star,
  ClipboardList,
  Briefcase,
  BarChart4,
  HelpCircle,
  ChevronRight,
  Zap,
  User,
  Loader2,
} from "lucide-react";

const menu = [
  {
    title: "MAIN",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Markets",
        href: "/dashboard/markets",
        icon: LineChart,
      },
      {
        title: "Trade",
        href: "/dashboard/trade",
        icon: TrendingUp,
        featured: true,
      },
      {
        title: "Orders",
        href: "/dashboard/orders",
        icon: ClipboardList,
      },
      {
        title: "Positions",
        href: "/dashboard/positions",
        icon: CandlestickChart,
      },
    ],
  },

  {
    title: "PORTFOLIO",
    items: [
      {
        title: "Portfolio",
        href: "/dashboard/portfolio",
        icon: Briefcase,
      },
      {
        title: "Wallet",
        href: "/dashboard/wallet",
        icon: Wallet,
      },
      {
        title: "Watchlist",
        href: "/dashboard/watchlist",
        icon: Star,
      },
      {
        title: "History",
        href: "/dashboard/history",
        icon: History,
      },
    ],
  },

  {
    title: "MARKET",
    items: [
      {
        title: "Market News",
        href: "/dashboard/news",
        icon: Newspaper,
      },
      {
        title: "Economic Calendar",
        href: "/dashboard/calendar",
        icon: CalendarDays,
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart4,
      },
    ],
  },

  {
    title: "SYSTEM",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
      {
        title: "Support",
        href: "/dashboard/support",
        icon: HelpCircle,
      },
    ],
  },
];

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

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userData, setUserData] = useState<UserData | null>(null);

  const [balanceData, setBalanceData] = useState<BalanceData>({
    demoBalance: 0,
    realBalance: 0,
  });

  const [accountMode, setAccountMode] =
    useState<AccountMode>("demo");

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  /* =========================================================
     NORMALIZE ACCOUNT MODE
  ========================================================= */

  const normalizeAccountMode = (
    value: unknown
  ): AccountMode => {
    return String(value).toLowerCase() === "real"
      ? "real"
      : "demo";
  };

  /* =========================================================
     LOAD LOGGED-IN USER
  ========================================================= */

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/dashboard", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        setUserData(null);
        return;
      }

      const data = await response.json();

      setUserData({
        userId: Number(data.userId),
        name: data.name || "Trader",
        role: data.role || "trader",
      });
    } catch (error) {
      console.error(
        "Sidebar user fetch error:",
        error
      );

      setUserData(null);
    } finally {
      setLoadingUser(false);
    }
  };

  /* =========================================================
     LOAD ACCOUNT MODE
  ========================================================= */

  const fetchAccountMode = async () => {
    try {
      const response = await fetch(
        "/api/account/mode",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      const mode = normalizeAccountMode(
        data.accountMode
      );

      setAccountMode(mode);

      /*
       * The account mode endpoint may also return balances.
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
        "Sidebar account mode error:",
        error
      );
    }
  };

  /* =========================================================
     LOAD USER BALANCES
  ========================================================= */

  const fetchBalance = async () => {
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

      if (!response.ok) {
        return;
      }

      const data: BalanceResponse =
        await response.json();

      /*
       * IMPORTANT:
       *
       * Always keep demo and real balances separate.
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
       * Synchronize account mode with backend.
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
        "Sidebar balance fetch error:",
        error
      );
    } finally {
      setLoadingBalance(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchUserData();
    fetchAccountMode();
    fetchBalance();
  }, []);

  /* =========================================================
     REFRESH BALANCE
  ========================================================= */

  useEffect(() => {
    const interval = window.setInterval(() => {
      fetchAccountMode();
      fetchBalance();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /* =========================================================
     GET SELECTED BALANCE
  ========================================================= */

  const selectedBalance =
    accountMode === "real"
      ? balanceData.realBalance
      : balanceData.demoBalance;

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
     ACCOUNT LABELS
  ========================================================= */

  const accountLabel =
    accountMode === "real"
      ? "Real Account"
      : "Demo Account";

  const balanceLabel =
    accountMode === "real"
      ? "Real Balance"
      : "Demo Balance";

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  /* =========================================================
     ACTIVE NAVIGATION
  ========================================================= */

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  /* =========================================================
     USER DISPLAY
  ========================================================= */

  const displayName =
    userData?.name || "Trader";

  const profileInitial =
    displayName
      .trim()
      .charAt(0)
      .toUpperCase() || "T";

  const formattedName = displayName
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <aside className="flex h-full w-full flex-col bg-[#111315] text-white">

      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="border-b border-zinc-800 px-4 py-4">

        <div className="flex items-center gap-2.5">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500 shadow-md shadow-yellow-500/20">

            <TrendingUp className="h-4.5 w-4.5 text-black" />

          </div>

          <div className="min-w-0">

            <h1 className="text-lg font-black tracking-wide text-yellow-500">
              PIPMASTER
            </h1>

            <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-500">
              Trading Terminal
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          COMPACT USER ACCOUNT
      ===================================================== */}

      <div className="px-3 pt-3">

        <div className="rounded-lg border border-zinc-800 bg-[#181B20] px-3 py-2.5">

          <div className="flex items-center gap-2.5">

            {/* AVATAR */}

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-black">

              {loadingUser ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                profileInitial
              )}

            </div>


            {/* USER INFORMATION */}

            <div className="min-w-0 flex-1">

              <div className="flex items-center justify-between gap-2">

                <p className="truncate text-xs font-semibold text-white">

                  {loadingUser
                    ? "Loading..."
                    : formattedName}

                </p>

                <span
                  className={`shrink-0 rounded-full px-1.5 py-0.5 text-[7px] font-bold uppercase ${
                    accountMode === "real"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {accountMode === "real"
                    ? "REAL"
                    : "DEMO"}
                </span>

              </div>


              <div className="mt-0.5 flex items-center gap-1.5">

                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                <p className="text-[9px] text-zinc-500">
                  {accountLabel}
                </p>

              </div>

            </div>

          </div>


          {/* COMPACT BALANCE */}

          <div className="mt-2.5 flex items-center justify-between border-t border-zinc-800 pt-2.5">

            <div>

              <p className="text-[8px] uppercase tracking-wider text-zinc-600">
                {balanceLabel}
              </p>

              <p className="mt-0.5 text-xs font-bold text-white">
                {loadingBalance
                  ? "Loading..."
                  : `$${formattedBalance}`}
              </p>

            </div>

            <Wallet
              className={`h-3.5 w-3.5 ${
                accountMode === "real"
                  ? "text-green-400"
                  : "text-yellow-500"
              }`}
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <div className="flex-1 overflow-y-auto px-3 py-4">

        {menu.map((section) => (

          <div
            key={section.title}
            className="mb-5"
          >

            <h2 className="mb-1.5 px-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-600">

              {section.title}

            </h2>

            <div className="space-y-0.5">

              {section.items.map((item) => {

                const active =
                  isActive(item.href);

                const Icon = item.icon;

                return (

                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center justify-between rounded-lg px-2.5 py-2 transition-all duration-200 ${
                      active
                        ? "bg-yellow-500 text-black shadow-md shadow-yellow-500/10"
                        : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
                    }`}
                  >

                    <div className="flex items-center gap-2.5">

                      <Icon
                        className={`h-4 w-4 transition ${
                          active
                            ? "text-black"
                            : "text-zinc-500 group-hover:text-yellow-400"
                        }`}
                      />

                      <span className="text-xs font-medium">
                        {item.title}
                      </span>

                    </div>


                    {item.featured &&
                      !active && (

                        <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-1.5 py-0.5 text-[7px] font-bold uppercase text-yellow-500">

                          <Zap className="h-2.5 w-2.5" />

                          Trade

                        </span>

                      )}


                    {active && (

                      <ChevronRight className="h-3.5 w-3.5 text-black" />

                    )}

                  </Link>

                );

              })}

            </div>

          </div>

        ))}

      </div>


      {/* =====================================================
          COMPACT ACCOUNT TYPE
      ===================================================== */}

      <div className="border-t border-zinc-800 px-3 py-3">

        <div className="rounded-lg border border-zinc-800 bg-[#181B20] px-3 py-2.5">

          <div className="flex items-center justify-between">

            <div className="min-w-0">

              <p className="text-[8px] uppercase tracking-wider text-zinc-600">
                Account
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">

                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    accountMode === "real"
                      ? "bg-green-400"
                      : "bg-yellow-500"
                  }`}
                />

                <p
                  className={`text-[10px] font-bold ${
                    accountMode === "real"
                      ? "text-green-400"
                      : "text-yellow-500"
                  }`}
                >
                  {accountMode === "real"
                    ? "REAL TRADER"
                    : "DEMO TRADER"}
                </p>

              </div>

            </div>


            {/* SMALL ICON */}

            <div
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                accountMode === "real"
                  ? "bg-green-500/10"
                  : "bg-yellow-500/10"
              }`}
            >

              <User
                className={`h-3.5 w-3.5 ${
                  accountMode === "real"
                    ? "text-green-400"
                    : "text-yellow-500"
                }`}
              />

            </div>

          </div>


          {/* SMALL BALANCE ROW */}

          <div className="mt-2 flex items-center justify-between border-t border-zinc-800 pt-2">

            <div>

              <p className="text-[8px] text-zinc-600">
                Active Balance
              </p>

              <p className="text-[11px] font-bold text-white">
                {loadingBalance
                  ? "Loading..."
                  : `$${formattedBalance}`}
              </p>

            </div>

            <span
              className={`rounded-full px-1.5 py-0.5 text-[7px] font-bold ${
                accountMode === "real"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-yellow-500/10 text-yellow-500"
              }`}
            >
              {accountMode === "real"
                ? "REAL"
                : "DEMO"}
            </span>

          </div>


          {/* REAL MODE NOTICE - VERY COMPACT */}

          {accountMode === "real" && (

            <p className="mt-1.5 text-[7px] leading-relaxed text-zinc-600">
              Real mode is currently simulated/internal.
            </p>

          )}

        </div>


        {/* ===================================================
            LOGOUT
        =================================================== */}

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}

          <span className="text-xs font-medium">
            {loggingOut
              ? "Signing out..."
              : "Logout"}
          </span>

        </button>

      </div>

    </aside>
  );
}