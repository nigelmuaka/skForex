"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Plus,
  Copy,
  Eye,
  EyeOff,
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ShieldCheck,
  X,
  Smartphone,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  TrendingUp,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Tab = "Overview" | "Deposits" | "Withdrawals";

type AccountMode = "demo" | "real";

type Trade = {
  id: string | number;
  market?: string;
  direction?: "BUY" | "SELL";
  stake?: number | string;
  payout?: number | string;
  profit?: number | string;
  result?: "PENDING" | "WON" | "LOST" | string;
  status?: "ACTIVE" | "SETTLED" | string;
  account_mode?: AccountMode;
  created_at?: string;
  settled_at?: string;
  expires_at?: string;
};

type Profile = {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
};

type BalanceResponse = {
  balance?: number | string;
  demoBalance?: number | string;
  realBalance?: number | string;
  accountMode?: AccountMode | string;
};

type AccountModeResponse = {
  authenticated?: boolean;
  accountMode?: AccountMode | string;
  accountLabel?: string;
  selectedBalance?: number | string;
  demoBalance?: number | string;
  realBalance?: number | string;
};

type Deposit = {
  id: number | string;
  user_id?: number;
  amount?: number | string;
  currency?: string;
  method?: string;
  reference?: string | null;
  status?: "pending" | "approved" | "rejected" | string;
  account_mode?: AccountMode;
  created_at?: string;
  approved_at?: string | null;
  rejected_at?: string | null;
  rejection_reason?: string | null;
};

type Withdrawal = {
  id: number | string;
  user_id?: number;
  amount?: number | string;
  currency?: string;
  method?: string;

  destination?: string | Record<string, unknown> | null;

  details?: string | null;

  status?: "pending" | "approved" | "rejected" | string;

  account_mode?: AccountMode;

  created_at?: string;
  approved_at?: string | null;
  rejected_at?: string | null;

  rejection_reason?: string | null;
};

/* =========================================================
   HELPERS
========================================================= */

function money(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function numberValue(value: unknown) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeAccountMode(value: unknown): AccountMode {
  return String(value).toLowerCase() === "real"
    ? "real"
    : "demo";
}

function formatDate(value?: string) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatMethod(method?: string) {
  if (!method) {
    return "Payment";
  }

  const value = method.toLowerCase();

  if (value === "mpesa") {
    return "M-Pesa";
  }

  if (value === "airtel") {
    return "Airtel Money";
  }

  if (value === "bank") {
    return "Bank Transfer";
  }

  if (value === "card") {
    return "Card";
  }

  if (value === "crypto") {
    return "Crypto";
  }

  return method.charAt(0).toUpperCase() + method.slice(1);
}

function formatDestination(
  destination?: string | Record<string, unknown> | null
) {
  if (!destination) {
    return "";
  }

  if (typeof destination === "string") {
    return destination;
  }

  if (destination.phone) {
    return `Phone: ${String(destination.phone)}`;
  }

  if (destination.accountNumber) {
    return `Account: ${String(destination.accountNumber)}`;
  }

  if (destination.address) {
    return `Wallet: ${String(destination.address)}`;
  }

  if (destination.cardLast4) {
    return `Card ending ${String(destination.cardLast4)}`;
  }

  return "Withdrawal destination";
}

/* =========================================================
   WALLET PAGE
========================================================= */

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);

  const [activeTab, setActiveTab] =
    useState<Tab>("Overview");

  const [showSend, setShowSend] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [switchingAccount, setSwitchingAccount] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     ACCOUNT MODE
  ======================================================= */

  const [accountMode, setAccountMode] =
    useState<AccountMode>("demo");

  const [demoBalance, setDemoBalance] =
    useState(0);

  const [realBalance, setRealBalance] =
    useState(0);

  /* =======================================================
     OTHER DATA
  ======================================================= */

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [trades, setTrades] =
    useState<Trade[]>([]);

  const [deposits, setDeposits] =
    useState<Deposit[]>([]);

  const [withdrawals, setWithdrawals] =
    useState<Withdrawal[]>([]);

  /* =======================================================
     SELECTED BALANCE
  ======================================================= */

  const selectedBalance =
    accountMode === "real"
      ? realBalance
      : demoBalance;

  const accountLabel =
    accountMode === "real"
      ? "Real Account"
      : "Demo Account";

  /* =======================================================
     LOAD WALLET
  ======================================================= */

  const loadWallet = useCallback(
    async (manualRefresh = false) => {
      try {
        if (manualRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const [
          modeResponse,
          balanceResponse,
          profileResponse,
          tradesResponse,
          depositsResponse,
          withdrawalsResponse,
        ] = await Promise.all([
          fetch("/api/account/mode", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),

          fetch("/api/user/balance", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),

          fetch("/api/user/profile", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),

          fetch("/api/trades/history", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),

          fetch("/api/deposits", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),

          fetch("/api/withdrawals", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        /* ================================================
           ACCOUNT MODE
        ================================================ */

        if (modeResponse.ok) {
          const data: AccountModeResponse =
            await modeResponse.json();

          const mode =
            normalizeAccountMode(
              data.accountMode
            );

          setAccountMode(mode);

          if (
            data.demoBalance !== undefined
          ) {
            setDemoBalance(
              numberValue(
                data.demoBalance
              )
            );
          }

          if (
            data.realBalance !== undefined
          ) {
            setRealBalance(
              numberValue(
                data.realBalance
              )
            );
          }
        }

        /* ================================================
           BALANCES
        ================================================ */

        if (balanceResponse.ok) {
          const data: BalanceResponse =
            await balanceResponse.json();

          /*
           * IMPORTANT:
           * Store both balances separately.
           *
           * Do NOT use:
           *
           * demoBalance || realBalance
           *
           * because that always chooses demo
           * when demo has a value.
           */

          if (
            data.demoBalance !== undefined
          ) {
            setDemoBalance(
              numberValue(
                data.demoBalance
              )
            );
          }

          if (
            data.realBalance !== undefined
          ) {
            setRealBalance(
              numberValue(
                data.realBalance
              )
            );
          }

          /*
           * If backend returns accountMode
           * from /api/user/balance, synchronize it.
           */

          if (data.accountMode) {
            setAccountMode(
              normalizeAccountMode(
                data.accountMode
              )
            );
          }

          /*
           * If only selected balance is returned,
           * apply it to the currently selected account.
           */

          if (
            data.balance !== undefined &&
            data.demoBalance === undefined &&
            data.realBalance === undefined
          ) {
            const selected =
              numberValue(data.balance);

            if (accountMode === "real") {
              setRealBalance(selected);
            } else {
              setDemoBalance(selected);
            }
          }
        }

        /* ================================================
           PROFILE
        ================================================ */

        if (profileResponse.ok) {
          const data =
            await profileResponse.json();

          setProfile(
            data.user ??
              data.profile ??
              data
          );
        }

        /* ================================================
           TRADES
        ================================================ */

        if (tradesResponse.ok) {
          const data =
            await tradesResponse.json();

          const loadedTrades =
            Array.isArray(data)
              ? data
              : Array.isArray(data.trades)
              ? data.trades
              : [];

          setTrades(
            loadedTrades
          );
        }

        /* ================================================
           DEPOSITS
        ================================================ */

        if (depositsResponse.ok) {
          const data =
            await depositsResponse.json();

          const loadedDeposits =
            Array.isArray(data)
              ? data
              : Array.isArray(data.deposits)
              ? data.deposits
              : [];

          setDeposits(
            loadedDeposits
          );
        }

        /* ================================================
           WITHDRAWALS
        ================================================ */

        if (withdrawalsResponse.ok) {
          const data =
            await withdrawalsResponse.json();

          const loadedWithdrawals =
            Array.isArray(data)
              ? data
              : Array.isArray(data.withdrawals)
              ? data.withdrawals
              : [];

          setWithdrawals(
            loadedWithdrawals
          );
        }

        /* ================================================
           AUTH ERROR
        ================================================ */

        if (
          modeResponse.status === 401 ||
          balanceResponse.status === 401 ||
          profileResponse.status === 401
        ) {
          setError(
            "Your session has expired. Please log in again."
          );
        }

        /* ================================================
           GENERAL SERVER ERROR
        ================================================ */

        if (
          !modeResponse.ok &&
          !balanceResponse.ok &&
          !profileResponse.ok
        ) {
          setError(
            "Unable to load your wallet. Please check that the backend server is running."
          );
        }
      } catch (err) {
        console.error(
          "Wallet loading error:",
          err
        );

        setError(
          "Unable to connect to the wallet server. Make sure your Express server is running on port 5000."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [accountMode]
  );

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  /* =======================================================
     AUTO REFRESH
  ======================================================= */

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        loadWallet(true);
      }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadWallet]);

  /* =======================================================
     SWITCH ACCOUNT
  ======================================================= */

  const switchAccount = async (
    newMode: AccountMode
  ) => {
    if (
      newMode === accountMode ||
      switchingAccount
    ) {
      return;
    }

    try {
      setSwitchingAccount(true);
      setError(null);

      const response = await fetch(
        "/api/account/switch",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            accountMode: newMode,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to switch account."
        );
      }

      const confirmedMode =
        normalizeAccountMode(
          data.accountMode ||
            newMode
        );

      setAccountMode(
        confirmedMode
      );

      if (
        data.demoBalance !== undefined
      ) {
        setDemoBalance(
          numberValue(
            data.demoBalance
          )
        );
      }

      if (
        data.realBalance !== undefined
      ) {
        setRealBalance(
          numberValue(
            data.realBalance
          )
        );
      }

      /*
       * Reload all account-specific data.
       *
       * This makes sure trades, deposits and
       * withdrawals belong to the selected account.
       */

      await loadWallet(true);
    } catch (err) {
      console.error(
        "Account switch error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to switch account."
      );
    } finally {
      setSwitchingAccount(false);
    }
  };

  /* =======================================================
     USER NAME
  ======================================================= */

  const userName =
    profile?.name ||
    "Trader";

  const userInitial =
    userName
      .trim()
      .charAt(0)
      .toUpperCase() ||
    "T";

  /* =======================================================
     TRADE STATISTICS
  ======================================================= */

  const activeTrades =
    useMemo(() => {
      return trades.filter(
        (trade) =>
          String(
            trade.status
          ).toUpperCase() ===
          "ACTIVE"
      );
    }, [trades]);

  const settledTrades =
    useMemo(() => {
      return trades.filter(
        (trade) =>
          String(
            trade.status
          ).toUpperCase() ===
          "SETTLED"
      );
    }, [trades]);

  const totalActiveStake =
    useMemo(() => {
      return activeTrades.reduce(
        (total, trade) =>
          total +
          numberValue(
            trade.stake
          ),
        0
      );
    }, [activeTrades]);

  const totalProfit =
    useMemo(() => {
      return settledTrades.reduce(
        (total, trade) =>
          total +
          numberValue(
            trade.profit
          ),
        0
      );
    }, [settledTrades]);

  const wins =
    useMemo(() => {
      return settledTrades.filter(
        (trade) =>
          String(
            trade.result
          ).toUpperCase() ===
          "WON"
      ).length;
    }, [settledTrades]);

  const losses =
    useMemo(() => {
      return settledTrades.filter(
        (trade) =>
          String(
            trade.result
          ).toUpperCase() ===
          "LOST"
      ).length;
    }, [settledTrades]);

  const winRate =
    useMemo(() => {
      const completed =
        wins + losses;

      if (!completed) {
        return 0;
      }

      return (
        (wins / completed) *
        100
      );
    }, [wins, losses]);

  const totalTraded =
    useMemo(() => {
      return trades.reduce(
        (total, trade) =>
          total +
          numberValue(
            trade.stake
          ),
        0
      );
    }, [trades]);

  /* =======================================================
     DEPOSIT STATISTICS
  ======================================================= */

  const pendingDeposits =
    useMemo(() => {
      return deposits.filter(
        (deposit) =>
          String(
            deposit.status
          ).toLowerCase() ===
          "pending"
      );
    }, [deposits]);

  const approvedDeposits =
    useMemo(() => {
      return deposits.filter(
        (deposit) =>
          String(
            deposit.status
          ).toLowerCase() ===
          "approved"
      );
    }, [deposits]);

  const totalDeposited =
    useMemo(() => {
      return approvedDeposits.reduce(
        (total, deposit) =>
          total +
          numberValue(
            deposit.amount
          ),
        0
      );
    }, [approvedDeposits]);

  const pendingDepositAmount =
    useMemo(() => {
      return pendingDeposits.reduce(
        (total, deposit) =>
          total +
          numberValue(
            deposit.amount
          ),
        0
      );
    }, [pendingDeposits]);

  /* =======================================================
     WITHDRAWAL STATISTICS
  ======================================================= */

  const pendingWithdrawals =
    useMemo(() => {
      return withdrawals.filter(
        (withdrawal) =>
          String(
            withdrawal.status
          ).toLowerCase() ===
          "pending"
      );
    }, [withdrawals]);

  const approvedWithdrawals =
    useMemo(() => {
      return withdrawals.filter(
        (withdrawal) =>
          String(
            withdrawal.status
          ).toLowerCase() ===
          "approved"
      );
    }, [withdrawals]);

  const rejectedWithdrawals =
    useMemo(() => {
      return withdrawals.filter(
        (withdrawal) =>
          String(
            withdrawal.status
          ).toLowerCase() ===
          "rejected"
      );
    }, [withdrawals]);

  const totalWithdrawn =
    useMemo(() => {
      return approvedWithdrawals.reduce(
        (total, withdrawal) =>
          total +
          numberValue(
            withdrawal.amount
          ),
        0
      );
    }, [approvedWithdrawals]);

  const pendingWithdrawalAmount =
    useMemo(() => {
      return pendingWithdrawals.reduce(
        (total, withdrawal) =>
          total +
          numberValue(
            withdrawal.amount
          ),
        0
      );
    }, [pendingWithdrawals]);

  /* =======================================================
     COPY ACCOUNT ID
  ======================================================= */

  const walletId =
    profile?.id
      ? `PM-${accountMode.toUpperCase()}-${String(
          profile.id
        ).padStart(6, "0")}`
      : `PM-${accountMode.toUpperCase()}-ACCOUNT`;

  const copyWalletId =
    async () => {
      try {
        await navigator.clipboard.writeText(
          walletId
        );

        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        console.error(
          "Copy failed:",
          err
        );
      }
    };

  /* =======================================================
     TRANSACTION ICON
  ======================================================= */

  const TransactionIcon = ({
    trade,
  }: {
    trade: Trade;
  }) => {
    const result =
      String(
        trade.result
      ).toUpperCase();

    if (result === "WON") {
      return (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      );
    }

    if (result === "LOST") {
      return (
        <XCircle className="h-4 w-4 text-red-500" />
      );
    }

    if (
      String(
        trade.status
      ).toUpperCase() ===
      "ACTIVE"
    ) {
      return (
        <Clock className="h-4 w-4 text-yellow-500" />
      );
    }

    return (
      <Activity className="h-4 w-4 text-zinc-400" />
    );
  };

  /* =======================================================
     STATUS BADGE
  ======================================================= */

  const StatusBadge = ({
    status,
  }: {
    status?: string;
  }) => {
    const value =
      String(
        status || "pending"
      ).toLowerCase();

    if (value === "approved") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-bold uppercase text-green-500">
          <CheckCircle2 className="h-3 w-3" />
          Approved
        </span>
      );
    }

    if (value === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase text-red-500">
          <XCircle className="h-3 w-3" />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-1 text-[10px] font-bold uppercase text-yellow-500">
        <Clock className="h-3 w-3" />
        Pending
      </span>
    );
  };

  /* =======================================================
     TRANSACTION TITLE
  ======================================================= */

  const transactionTitle = (
    trade: Trade
  ) => {
    const result =
      String(
        trade.result
      ).toUpperCase();

    if (result === "WON") {
      return "Trade Profit";
    }

    if (result === "LOST") {
      return "Trade Loss";
    }

    if (
      String(
        trade.status
      ).toUpperCase() ===
      "ACTIVE"
    ) {
      return "Active Trade";
    }

    return "Trade";
  };

  /* =======================================================
     TRANSACTION AMOUNT
  ======================================================= */

  const transactionAmount = (
    trade: Trade
  ) => {
    const result =
      String(
        trade.result
      ).toUpperCase();

    const profit =
      numberValue(
        trade.profit
      );

    if (result === "WON") {
      return `+${money(
        Math.abs(profit)
      )}`;
    }

    if (result === "LOST") {
      return `-${money(
        Math.abs(
          profit ||
            numberValue(
              trade.stake
            )
        )
      )}`;
    }

    return money(
      numberValue(
        trade.stake
      )
    );
  };

  /* =======================================================
     GO TO WITHDRAWAL
  ======================================================= */

  const openWithdrawal =
    () => {
      window.location.href =
        "/dashboard/withdrawal";
    };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="min-h-full w-full space-y-5 pb-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-[#15181C] p-4 shadow-xl sm:p-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10">
            <Wallet className="h-5 w-5 text-yellow-500" />
          </div>

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <h1 className="text-xl font-bold text-white sm:text-2xl">
                My Wallet
              </h1>

              <span
                className={`rounded-full border px-2 py-1 text-[8px] font-bold uppercase ${
                  accountMode === "real"
                    ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                    : "border-green-500/20 bg-green-500/10 text-green-500"
                }`}
              >
                {accountMode === "real"
                  ? "Real • Simulated"
                  : "Demo"}
              </span>

            </div>

            <p className="text-xs text-zinc-500 sm:text-sm">

              Welcome back,{" "}

              <span className="text-zinc-300">
                {userName}
              </span>

              . Manage your{" "}

              <span className="font-semibold text-yellow-500">
                {accountLabel}
              </span>{" "}

              funds.

            </p>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex">

          <Link
            href="/dashboard/deposit"
            className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-400 active:scale-[0.98]"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Deposit
          </Link>

          <button
            type="button"
            onClick={openWithdrawal}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-white transition hover:border-yellow-500 hover:bg-zinc-800 active:scale-[0.98]"
          >
            <ArrowUpFromLine className="h-4 w-4" />
            Withdraw
          </button>

        </div>

      </section>

      {/* =====================================================
          ACCOUNT SWITCHER
      ===================================================== */}

      <section className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 shadow-xl sm:p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm font-bold text-white">
              Trading Account
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Select which wallet your trading activity should use.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#0F1114] p-1">

            <button
              type="button"
              disabled={switchingAccount}
              onClick={() =>
                switchAccount("demo")
              }
              className={`flex min-w-[145px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition ${
                accountMode === "demo"
                  ? "bg-yellow-500 text-black"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >

              {accountMode === "demo" ? (
                <ToggleRight className="h-4 w-4" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}

              Demo Account

            </button>

            <button
              type="button"
              disabled={switchingAccount}
              onClick={() =>
                switchAccount("real")
              }
              className={`flex min-w-[145px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition ${
                accountMode === "real"
                  ? "bg-blue-500 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >

              {accountMode === "real" ? (
                <ToggleRight className="h-4 w-4" />
              ) : (
                <ToggleLeft className="h-4 w-4" />
              )}

              Real Account

            </button>

          </div>

        </div>

        {accountMode === "real" && (
          <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">

            <div className="flex gap-3">

              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />

              <div>

                <p className="text-xs font-bold text-blue-400">
                  Real Account Mode
                </p>

                <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                  This currently uses the separate real-account
                  balance stored in your database. It is simulated
                  until an actual regulated broker or payment
                  provider is connected.
                </p>

              </div>

            </div>

          </div>
        )}

      </section>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <section className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">

          <div className="flex items-center justify-between gap-3">

            <div>

              <p className="text-sm font-bold text-red-400">
                Wallet Connection Problem
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                loadWallet(true)
              }
              className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10"
            >
              Retry
            </button>

          </div>

        </section>
      )}

      {/* =====================================================
          BALANCE + QUICK ACTIONS
      ===================================================== */}

      <section className="grid gap-4 xl:grid-cols-12">

        {/* BALANCE */}

        <div
          className={`relative overflow-hidden rounded-2xl border p-5 shadow-xl sm:p-6 xl:col-span-8 ${
            accountMode === "real"
              ? "border-blue-500/20 bg-gradient-to-br from-[#171B24] to-[#111315]"
              : "border-yellow-500/20 bg-gradient-to-br from-[#1A1D24] to-[#111315]"
          }`}
        >

          <div
            className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${
              accountMode === "real"
                ? "bg-blue-500/10"
                : "bg-yellow-500/10"
            }`}
          />

          <div className="relative">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2 text-sm text-zinc-400">

                <Wallet
                  className={`h-4 w-4 ${
                    accountMode === "real"
                      ? "text-blue-400"
                      : "text-yellow-500"
                  }`}
                />

                {accountMode === "real"
                  ? "Real Trading Balance"
                  : "Demo Trading Balance"}

              </div>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    loadWallet(true)
                  }
                  className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  title="Refresh wallet"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      refreshing
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowBalance(
                      (value) =>
                        !value
                    )
                  }
                  className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  title={
                    showBalance
                      ? "Hide balance"
                      : "Show balance"
                  }
                >
                  {showBalance ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>

              </div>

            </div>

            <div className="mt-5 flex flex-wrap items-end gap-3">

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">

                {loading ? (
                  <span className="inline-flex items-center gap-2 text-2xl sm:text-4xl">

                    <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />

                    Loading...

                  </span>
                ) : showBalance ? (
                  money(selectedBalance)
                ) : (
                  "••••••••"
                )}

              </h2>

              <span
                className={`mb-1 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
                  totalProfit >= 0
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >

                {totalProfit >= 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}

                {totalProfit >= 0
                  ? "+"
                  : "-"}

                {money(
                  Math.abs(
                    totalProfit
                  )
                )}

              </span>

            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">

              <span>
                USD virtual funds
              </span>

              <span>•</span>

              <span>
                Server-backed wallet
              </span>

              <span>•</span>

              <span>
                {accountLabel}
              </span>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-zinc-800 pt-5 sm:grid-cols-4">

              <div>
                <p className="text-[10px] text-zinc-500 sm:text-xs">
                  Available
                </p>

                <p className="mt-1 truncate text-sm font-bold text-white sm:text-base">
                  {money(
                    selectedBalance
                  )}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-zinc-500 sm:text-xs">
                  In Trades
                </p>

                <p className="mt-1 truncate text-sm font-bold text-yellow-400 sm:text-base">
                  {money(
                    totalActiveStake
                  )}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-zinc-500 sm:text-xs">
                  Total P/L
                </p>

                <p
                  className={`mt-1 truncate text-sm font-bold sm:text-base ${
                    totalProfit >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {totalProfit >= 0
                    ? "+"
                    : "-"}

                  {money(
                    Math.abs(
                      totalProfit
                    )
                  )}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-zinc-500 sm:text-xs">
                  Win Rate
                </p>

                <p className="mt-1 truncate text-sm font-bold text-purple-400 sm:text-base">
                  {winRate.toFixed(
                    1
                  )}
                  %
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}

        <div className="grid grid-cols-3 gap-3 xl:col-span-4">

          <Link
            href="/dashboard/deposit"
            className="group flex min-h-[130px] flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-[#15181C] p-3 transition hover:border-green-500/50 hover:bg-[#1A1D24] active:scale-[0.98]"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/10 transition group-hover:scale-110">

              <ArrowDownToLine className="h-5 w-5 text-green-500" />

            </div>

            <span className="text-xs font-semibold text-white">
              Deposit
            </span>

          </Link>

          <button
            type="button"
            onClick={openWithdrawal}
            className="group flex min-h-[130px] flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-[#15181C] p-3 transition hover:border-red-500/50 hover:bg-[#1A1D24] active:scale-[0.98]"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 transition group-hover:scale-110">

              <ArrowUpFromLine className="h-5 w-5 text-red-500" />

            </div>

            <span className="text-xs font-semibold text-white">
              Withdraw
            </span>

            {pendingWithdrawals.length > 0 && (
              <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[9px] font-bold text-yellow-500">
                {pendingWithdrawals.length} pending
              </span>
            )}

          </button>

          <button
            type="button"
            onClick={() =>
              setShowSend(true)
            }
            className="group flex min-h-[130px] flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-[#15181C] p-3 transition hover:border-blue-500/50 hover:bg-[#1A1D24] active:scale-[0.98]"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 transition group-hover:scale-110">

              <Send className="h-5 w-5 text-blue-500" />

            </div>

            <span className="text-xs font-semibold text-white">
              Send
            </span>

          </button>

        </div>

      </section>

      {/* =====================================================
          ACCOUNT INFORMATION
      ===================================================== */}

      <section className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 shadow-xl sm:p-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">

              <ShieldCheck className="h-5 w-5 text-green-500" />

            </div>

            <div>

              <p className="text-sm font-semibold text-white">
                Your Trading Account
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {userName}

                {profile?.email
                  ? ` • ${profile.email}`
                  : ""}
              </p>

              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-green-500">

                {profile?.role ||
                  "Trader"}{" "}

                • Active

              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#0F1114] px-3 py-2">

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-xs font-black text-black">
              {userInitial}
            </span>

            <div>

              <p className="text-[9px] uppercase tracking-wider text-zinc-600">
                Account
              </p>

              <p className="text-xs font-bold text-white">
                {accountLabel}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          WALLET ID
      ===================================================== */}

      <section className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 shadow-xl sm:p-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10">

              <CreditCard className="h-5 w-5 text-yellow-500" />

            </div>

            <div>

              <p className="text-sm font-semibold text-white">
                Your Account ID
              </p>

              <p className="mt-1 break-all text-xs text-zinc-500">
                {walletId}
              </p>

              <p className="mt-1 text-[9px] text-zinc-600">
                Generated from your authenticated database account.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={copyWalletId}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-yellow-500 hover:bg-zinc-800 hover:text-white"
          >

            <Copy className="h-3.5 w-3.5" />

            {copied
              ? "Copied!"
              : "Copy ID"}

          </button>

        </div>

      </section>

      {/* =====================================================
          ACCOUNT ASSETS
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#15181C] shadow-xl">

        <div className="flex items-center justify-between border-b border-zinc-800 p-4 sm:p-5">

          <div>

            <h2 className="font-bold text-white">
              Account Overview
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Live information calculated from your database wallet.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              loadWallet(true)
            }
            className="rounded-xl border border-zinc-800 p-2.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            title="Refresh account"
          >

            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

          </button>

        </div>

        <div className="grid gap-3 p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-4">

          {/* SELECTED ACCOUNT */}

          <div
            className={`rounded-2xl border p-4 ${
              accountMode === "real"
                ? "border-blue-500/20 bg-blue-500/5"
                : "border-yellow-500/20 bg-yellow-500/5"
            }`}
          >

            <div className="flex items-start justify-between">

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  accountMode === "real"
                    ? "bg-blue-500/10"
                    : "bg-yellow-500/10"
                }`}
              >

                <Wallet
                  className={`h-5 w-5 ${
                    accountMode === "real"
                      ? "text-blue-400"
                      : "text-yellow-500"
                  }`}
                />

              </div>

              <span
                className={`text-xs font-bold ${
                  accountMode === "real"
                    ? "text-blue-400"
                    : "text-green-500"
                }`}
              >
                ACTIVE
              </span>

            </div>

            <p className="mt-4 text-sm font-bold text-white">
              {accountMode === "real"
                ? "Real USD"
                : "Demo USD"}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {accountMode === "real"
                ? "Database real-account balance"
                : "Virtual trading balance"}
            </p>

            <p className="mt-4 text-lg font-bold text-white">
              {showBalance
                ? money(selectedBalance)
                : "••••••••"}
            </p>

          </div>

          {/* DEMO BALANCE */}

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">

            <div className="flex items-start justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">

                <Banknote className="h-5 w-5 text-yellow-500" />

              </div>

              <span className="text-xs font-bold text-yellow-500">
                DEMO
              </span>

            </div>

            <p className="mt-4 text-sm font-bold text-white">
              Demo Balance
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              wallets.demo_balance
            </p>

            <p className="mt-4 text-lg font-bold text-white">
              {showBalance
                ? money(demoBalance)
                : "••••••••"}
            </p>

          </div>

          {/* REAL BALANCE */}

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">

            <div className="flex items-start justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">

                <Banknote className="h-5 w-5 text-blue-400" />

              </div>

              <span className="text-xs font-bold text-blue-400">
                REAL
              </span>

            </div>

            <p className="mt-4 text-sm font-bold text-white">
              Real Balance
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              wallets.real_balance
            </p>

            <p className="mt-4 text-lg font-bold text-white">
              {showBalance
                ? money(realBalance)
                : "••••••••"}
            </p>

          </div>

          {/* RESULTS */}

          <div className="rounded-2xl border border-zinc-800 bg-[#111315] p-4 transition hover:border-yellow-500/40">

            <div className="flex items-start justify-between">

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  totalProfit >= 0
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                }`}
              >

                {totalProfit >= 0 ? (
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-500" />
                )}

              </div>

              <span
                className={`text-xs font-bold ${
                  totalProfit >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {wins}W / {losses}L
              </span>

            </div>

            <p className="mt-4 text-sm font-bold text-white">
              Trading P/L
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Settled trade results
            </p>

            <p
              className={`mt-4 text-lg font-bold ${
                totalProfit >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >

              {totalProfit >= 0
                ? "+"
                : "-"}

              {money(
                Math.abs(
                  totalProfit
                )
              )}

            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          TRANSACTIONS
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#15181C] shadow-xl">

        <div className="flex flex-col gap-3 border-b border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

          <div>

            <h2 className="font-bold text-white">
              Recent Account Activity
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Activity for your selected account.
            </p>

          </div>

          <div className="grid grid-cols-3 rounded-xl bg-zinc-900 p-1">

            {(
              [
                "Overview",
                "Deposits",
                "Withdrawals",
              ] as Tab[]
            ).map((tab) => (

              <button
                type="button"
                key={tab}
                onClick={() =>
                  setActiveTab(tab)
                }
                className={`rounded-lg px-2 py-2 text-[10px] font-semibold transition sm:px-3 sm:text-xs ${
                  activeTab === tab
                    ? "bg-yellow-500 text-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >

                {tab}

                {tab ===
                  "Withdrawals" &&
                  pendingWithdrawals.length >
                    0 && (
                    <span
                      className={`ml-1 rounded-full px-1.5 py-0.5 text-[8px] ${
                        activeTab === tab
                          ? "bg-black/10 text-black"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {
                        pendingWithdrawals.length
                      }
                    </span>
                  )}

              </button>

            ))}

          </div>

        </div>

        {/* ===================================================
            DEPOSITS
        ==================================================== */}

        {activeTab ===
          "Deposits" && (

          <div>

            <div className="grid grid-cols-2 gap-3 border-b border-zinc-800 p-4 sm:grid-cols-4">

              <div className="rounded-xl border border-zinc-800 bg-[#111315] p-3">

                <p className="text-[10px] text-zinc-500">
                  Approved
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  {money(
                    totalDeposited
                  )}
                </p>

              </div>

              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">

                <p className="text-[10px] text-zinc-500">
                  Pending
                </p>

                <p className="mt-1 text-lg font-bold text-yellow-500">
                  {
                    pendingDeposits.length
                  }
                </p>

              </div>

              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">

                <p className="text-[10px] text-zinc-500">
                  Pending Amount
                </p>

                <p className="mt-1 text-lg font-bold text-yellow-500">
                  {money(
                    pendingDepositAmount
                  )}
                </p>

              </div>

              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-3">

                <p className="text-[10px] text-zinc-500">
                  Approved Requests
                </p>

                <p className="mt-1 text-lg font-bold text-green-500">
                  {
                    approvedDeposits.length
                  }
                </p>

              </div>

            </div>

            {deposits.length ===
            0 ? (

              <div className="p-10 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900">

                  <ArrowDownToLine className="h-5 w-5 text-zinc-600" />

                </div>

                <p className="mt-3 text-sm font-bold text-white">
                  No deposits yet
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Deposit requests for this account will appear here.
                </p>

                <Link
                  href="/dashboard/deposit"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-yellow-400"
                >

                  <Plus className="h-4 w-4" />

                  Make Deposit

                </Link>

              </div>

            ) : (

              <div className="divide-y divide-zinc-800">

                {deposits
                  .slice(0, 20)
                  .map(
                    (deposit) => {

                      const amount =
                        numberValue(
                          deposit.amount
                        );

                      return (
                        <div
                          key={String(
                            deposit.id
                          )}
                          className="flex items-center justify-between gap-3 p-4 transition hover:bg-zinc-900/40"
                        >

                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10">

                              <ArrowDownToLine className="h-4 w-4 text-green-500" />

                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-white">
                                Deposit
                              </p>

                              <p className="mt-0.5 text-xs text-zinc-500">
                                {formatMethod(
                                  deposit.method
                                )}
                              </p>

                              <p className="mt-1 text-[10px] text-zinc-600">
                                {formatDate(
                                  deposit.created_at
                                )}
                              </p>

                              {deposit.reference && (
                                <p className="mt-1 truncate text-[10px] text-zinc-600">
                                  Ref:{" "}
                                  {
                                    deposit.reference
                                  }
                                </p>
                              )}

                            </div>

                          </div>

                          <div className="shrink-0 text-right">

                            <p className="text-sm font-bold text-green-500">
                              +{money(
                                amount
                              )}
                            </p>

                            <div className="mt-1">

                              <StatusBadge
                                status={
                                  deposit.status
                                }
                              />

                            </div>

                            {deposit.rejection_reason && (
                              <p className="mt-1 max-w-[180px] text-[10px] text-red-400">
                                {
                                  deposit.rejection_reason
                                }
                              </p>
                            )}

                          </div>

                        </div>
                      );
                    }
                  )}

              </div>

            )}

          </div>
        )}

        {/* ===================================================
            WITHDRAWALS
        ==================================================== */}

        {activeTab ===
          "Withdrawals" && (

          <div>

            <div className="grid grid-cols-2 gap-3 border-b border-zinc-800 p-4 sm:grid-cols-4">

              <div className="rounded-xl border border-zinc-800 bg-[#111315] p-3">

                <p className="text-[10px] text-zinc-500">
                  Approved
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  {money(
                    totalWithdrawn
                  )}
                </p>

              </div>

              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">

                <p className="text-[10px] text-zinc-500">
                  Pending
                </p>

                <p className="mt-1 text-lg font-bold text-yellow-500">
                  {
                    pendingWithdrawals.length
                  }
                </p>

              </div>

              <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">

                <p className="text-[10px] text-zinc-500">
                  Pending Amount
                </p>

                <p className="mt-1 text-lg font-bold text-yellow-500">
                  {money(
                    pendingWithdrawalAmount
                  )}
                </p>

              </div>

              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">

                <p className="text-[10px] text-zinc-500">
                  Rejected
                </p>

                <p className="mt-1 text-lg font-bold text-red-500">
                  {
                    rejectedWithdrawals.length
                  }
                </p>

              </div>

            </div>

            <div className="border-b border-zinc-800 bg-[#111315] p-4">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-semibold text-white">
                    Need to withdraw funds?
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Create a withdrawal request using your available wallet balance.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={openWithdrawal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3 text-xs font-bold text-black transition hover:bg-yellow-400 active:scale-[0.98]"
                >

                  <ArrowUpFromLine className="h-4 w-4" />

                  Withdraw Funds

                </button>

              </div>

            </div>

            {withdrawals.length ===
            0 ? (

              <div className="p-10 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900">

                  <ArrowUpFromLine className="h-5 w-5 text-zinc-600" />

                </div>

                <p className="mt-3 text-sm font-bold text-white">
                  No withdrawals yet
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Withdrawal requests for this account will appear here.
                </p>

                <button
                  type="button"
                  onClick={openWithdrawal}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-yellow-400"
                >

                  <ArrowUpFromLine className="h-4 w-4" />

                  Request Withdrawal

                </button>

              </div>

            ) : (

              <div className="divide-y divide-zinc-800">

                {withdrawals
                  .slice(0, 20)
                  .map(
                    (
                      withdrawal
                    ) => {

                      const amount =
                        numberValue(
                          withdrawal.amount
                        );

                      const destination =
                        formatDestination(
                          withdrawal.destination
                        );

                      const status =
                        String(
                          withdrawal.status
                        ).toLowerCase();

                      return (
                        <div
                          key={String(
                            withdrawal.id
                          )}
                          className="flex items-center justify-between gap-3 p-4 transition hover:bg-zinc-900/40"
                        >

                          <div className="flex min-w-0 items-center gap-3">

                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                status ===
                                "approved"
                                  ? "bg-green-500/10"
                                  : status ===
                                    "rejected"
                                  ? "bg-red-500/10"
                                  : "bg-yellow-500/10"
                              }`}
                            >

                              {status ===
                              "approved" ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : status ===
                                "rejected" ? (
                                <XCircle className="h-4 w-4 text-red-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}

                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-white">
                                Withdrawal
                              </p>

                              <p className="mt-0.5 text-xs text-zinc-500">
                                {formatMethod(
                                  withdrawal.method
                                )}
                              </p>

                              <p className="mt-1 text-[10px] text-zinc-600">
                                {formatDate(
                                  withdrawal.created_at
                                )}
                              </p>

                              {destination && (
                                <p className="mt-1 max-w-[260px] truncate text-[10px] text-zinc-600">
                                  To:{" "}
                                  {
                                    destination
                                  }
                                </p>
                              )}

                            </div>

                          </div>

                          <div className="shrink-0 text-right">

                            <p
                              className={`text-sm font-bold ${
                                status ===
                                "rejected"
                                  ? "text-red-500"
                                  : "text-yellow-500"
                              }`}
                            >
                              -{money(
                                amount
                              )}
                            </p>

                            <div className="mt-1">

                              <StatusBadge
                                status={
                                  withdrawal.status
                                }
                              />

                            </div>

                            <p className="mt-1 text-[9px] text-zinc-600">
                              #
                              {
                                withdrawal.id
                              }
                            </p>

                            {withdrawal.rejection_reason && (
                              <p className="mt-1 max-w-[180px] text-[10px] text-red-400">
                                {
                                  withdrawal.rejection_reason
                                }
                              </p>
                            )}

                          </div>

                        </div>
                      );
                    }
                  )}

              </div>

            )}

          </div>
        )}

        {/* ===================================================
            OVERVIEW
        ==================================================== */}

        {activeTab ===
          "Overview" && (

          <>

            {trades.length ===
            0 ? (

              <div className="p-10 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900">

                  <Activity className="h-5 w-5 text-zinc-600" />

                </div>

                <p className="mt-3 text-sm font-bold text-white">
                  No trading activity yet
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Your trades for this account will appear here.
                </p>

                <Link
                  href="/dashboard/trade"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-yellow-400"
                >

                  <TrendingUp className="h-4 w-4" />

                  Open Trading Terminal

                </Link>

              </div>

            ) : (

              <div className="divide-y divide-zinc-800">

                {trades
                  .slice(0, 10)
                  .map(
                    (trade) => {

                      const result =
                        String(
                          trade.result
                        ).toUpperCase();

                      const isWin =
                        result ===
                        "WON";

                      const isLoss =
                        result ===
                        "LOST";

                      return (
                        <div
                          key={String(
                            trade.id
                          )}
                          className="flex items-center justify-between gap-3 p-4 transition hover:bg-zinc-900/40"
                        >

                          <div className="flex min-w-0 items-center gap-3">

                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                isWin
                                  ? "bg-green-500/10"
                                  : isLoss
                                  ? "bg-red-500/10"
                                  : "bg-yellow-500/10"
                              }`}
                            >

                              <TransactionIcon
                                trade={
                                  trade
                                }
                              />

                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-white">

                                {transactionTitle(
                                  trade
                                )}

                              </p>

                              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">

                                <span className="text-xs text-zinc-500">
                                  {trade.market ||
                                    "Market"}
                                </span>

                                <span className="text-zinc-700">
                                  •
                                </span>

                                <span
                                  className={`text-[10px] font-bold ${
                                    trade.direction ===
                                    "BUY"
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >

                                  {trade.direction ===
                                  "BUY"
                                    ? "UP"
                                    : "DOWN"}

                                </span>

                              </div>

                              <p className="mt-1 text-[10px] text-zinc-600">

                                {formatDate(
                                  trade.created_at
                                )}

                              </p>

                            </div>

                          </div>

                          <div className="shrink-0 text-right">

                            <p
                              className={`text-sm font-bold ${
                                isWin
                                  ? "text-green-500"
                                  : isLoss
                                  ? "text-red-500"
                                  : "text-yellow-500"
                              }`}
                            >

                              {transactionAmount(
                                trade
                              )}

                            </p>

                            <p className="text-[10px] text-zinc-500">

                              Stake{" "}

                              {money(
                                numberValue(
                                  trade.stake
                                )
                              )}

                            </p>

                            <p
                              className={`text-[10px] font-bold ${
                                isWin
                                  ? "text-green-500"
                                  : isLoss
                                  ? "text-red-500"
                                  : "text-yellow-500"
                              }`}
                            >

                              {result ||
                                "PENDING"}

                            </p>

                          </div>

                        </div>
                      );
                    }
                  )}

              </div>

            )}

          </>
        )}

      </section>

      {/* =====================================================
          WALLET SERVICES
      ===================================================== */}

      <section className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 shadow-xl sm:p-5">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="font-bold text-white">
              Wallet Services
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Available account management options.
            </p>

          </div>

          <div className="flex gap-2">

            <Link
              href="/dashboard/deposit"
              className="flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-2.5 text-xs font-bold text-black transition hover:bg-yellow-400"
            >

              <Plus className="h-4 w-4" />

              Add Funds

            </Link>

            <button
              type="button"
              onClick={openWithdrawal}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-xs font-bold text-white transition hover:border-yellow-500 hover:bg-zinc-800"
            >

              <ArrowUpFromLine className="h-4 w-4" />

              Withdraw

            </button>

          </div>

        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* CURRENT WALLET */}

          <div
            className={`rounded-2xl border p-4 ${
              accountMode === "real"
                ? "border-blue-500/20 bg-blue-500/5"
                : "border-yellow-500/20 bg-yellow-500/5"
            }`}
          >

            <div className="flex items-center gap-3">

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  accountMode === "real"
                    ? "bg-blue-500/10"
                    : "bg-yellow-500/10"
                }`}
              >

                <Wallet
                  className={`h-5 w-5 ${
                    accountMode === "real"
                      ? "text-blue-400"
                      : "text-yellow-500"
                  }`}
                />

              </div>

              <div>

                <p className="text-sm font-bold text-white">
                  {accountMode === "real"
                    ? "Real Wallet"
                    : "Demo Wallet"}
                </p>

                <p
                  className={`text-xs ${
                    accountMode === "real"
                      ? "text-blue-400"
                      : "text-green-500"
                  }`}
                >
                  {accountMode === "real"
                    ? "Simulated"
                    : "Active"}
                </p>

              </div>

            </div>

          </div>

          {/* M-PESA */}

          <Link
            href="/dashboard/deposit"
            className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 transition hover:border-green-500/50"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">

                <Smartphone className="h-5 w-5 text-green-500" />

              </div>

              <div>

                <p className="text-sm font-bold text-white">
                  M-Pesa
                </p>

                <p className="text-xs text-green-500">
                  Deposit service
                </p>

              </div>

            </div>

          </Link>

          {/* BANK */}

          <Link
            href="/dashboard/deposit"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-yellow-500/50"
          >

            <div className="flex items-center gap-3">

              <Banknote className="h-6 w-6 text-yellow-500" />

              <div>

                <p className="text-sm font-bold text-white">
                  Bank Transfer
                </p>

                <p className="text-xs text-zinc-500">
                  Deposit service
                </p>

              </div>

            </div>

          </Link>

          {/* CARD */}

          <Link
            href="/dashboard/deposit"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 transition hover:border-blue-500/50"
          >

            <div className="flex items-center gap-3">

              <CreditCard className="h-6 w-6 text-blue-500" />

              <div>

                <p className="text-sm font-bold text-white">
                  Card
                </p>

                <p className="text-xs text-zinc-500">
                  Payment service
                </p>

              </div>

            </div>

          </Link>

        </div>

      </section>

      {/* =====================================================
          SEND MODAL
      ===================================================== */}

      {showSend && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#15181C] p-5 shadow-2xl">

            <div className="mb-5 flex items-start justify-between">

              <div>

                <h2 className="text-lg font-bold text-white">
                  Send Funds
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Account-to-account transfers are not connected yet.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowSend(false)
                }
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >

                <X className="h-5 w-5" />

              </button>

            </div>

            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">

              <div className="flex gap-3">

                <ShieldCheck className="h-5 w-5 shrink-0 text-yellow-500" />

                <div>

                  <p className="text-sm font-bold text-yellow-400">
                    Transfer service not connected
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Deposits, withdrawals and account
                    balances are database-backed. Account-to-account
                    transfers can be added later using a secure
                    server-side transaction.
                  </p>

                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                setShowSend(false)
              }
              className="mt-4 w-full rounded-xl border border-zinc-700 py-3 text-xs font-bold text-white hover:border-yellow-500 hover:bg-zinc-800"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}