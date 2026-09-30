"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowDownToLine,
  ArrowRight,
  Banknote,
  Bitcoin,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Lock,
  Smartphone,
  Wallet,
  Zap,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Currency = {
  code: string;
  name: string;
  symbol: string;
  rate: number;
};

type PaymentMethod =
  | "mpesa"
  | "airtel"
  | "card"
  | "bank"
  | "crypto";

type Deposit = {
  id: number | string;
  amount: number | string;
  currency?: string;
  method?: string;
  reference?: string;
  status?: "pending" | "approved" | "rejected" | string;
  created_at?: string;
  approved_at?: string;
  rejection_reason?: string;
};

/* =========================================================
   CURRENCIES
========================================================= */

const currencies: Currency[] = [
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    rate: 1,
  },
  {
    code: "KES",
    name: "Kenyan Shilling",
    symbol: "KSh",
    rate: 129.5,
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    rate: 0.92,
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    rate: 0.79,
  },
  {
    code: "UGX",
    name: "Ugandan Shilling",
    symbol: "USh",
    rate: 3675,
  },
  {
    code: "TZS",
    name: "Tanzanian Shilling",
    symbol: "TSh",
    rate: 2600,
  },
  {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    rate: 1520,
  },
  {
    code: "ZAR",
    name: "South African Rand",
    symbol: "R",
    rate: 18.2,
  },
  {
    code: "AED",
    name: "UAE Dirham",
    symbol: "د.إ",
    rate: 3.67,
  },
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    rate: 86.5,
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    rate: 1.37,
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    rate: 1.56,
  },
];

/* =========================================================
   PAYMENT METHODS
========================================================= */

const paymentMethods = [
  {
    id: "mpesa" as PaymentMethod,
    name: "M-Pesa",
    description: "Mobile Money",
    icon: Smartphone,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    id: "airtel" as PaymentMethod,
    name: "Airtel Money",
    description: "Mobile Money",
    icon: Smartphone,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: "card" as PaymentMethod,
    name: "Bank Card",
    description: "Visa / Mastercard",
    icon: CreditCard,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: "bank" as PaymentMethod,
    name: "Bank Transfer",
    description: "Local & International",
    icon: Banknote,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    id: "crypto" as PaymentMethod,
    name: "Crypto",
    description: "USDT / BTC / ETH",
    icon: Bitcoin,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function numberValue(value: unknown) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
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

/* =========================================================
   DEPOSIT PAGE
========================================================= */

export default function DepositPage() {
  const [amount, setAmount] = useState("100");

  const [currency, setCurrency] =
    useState("USD");

  const [method, setMethod] =
    useState<PaymentMethod>("mpesa");

  const [phone, setPhone] =
    useState("");

  const [account, setAccount] =
    useState("");

  const [reference, setReference] =
    useState("");

  const [deposits, setDeposits] =
    useState<Deposit[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingHistory, setLoadingHistory] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  /* =======================================================
     SELECTED CURRENCY
  ======================================================= */

  const selectedCurrency =
    currencies.find(
      (item) => item.code === currency
    ) || currencies[0];

  /* =======================================================
     AMOUNT
  ======================================================= */

  const usdAmount =
    Number(amount || 0);

  const convertedAmount =
    useMemo(() => {
      return (
        usdAmount *
        selectedCurrency.rate
      );
    }, [
      usdAmount,
      selectedCurrency,
    ]);

  const formattedAmount =
    new Intl.NumberFormat(
      "en-US",
      {
        maximumFractionDigits: 2,
      }
    ).format(convertedAmount);

  /* =======================================================
     LOAD DEPOSIT HISTORY
  ======================================================= */

  const loadDeposits = async () => {
    try {
      setLoadingHistory(true);

      const response =
        await fetch(
          "/api/deposits",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load deposits."
        );
      }

      const loadedDeposits =
        Array.isArray(data)
          ? data
          : Array.isArray(data.deposits)
          ? data.deposits
          : [];

      setDeposits(
        loadedDeposits
      );
    } catch (err) {
      console.error(
        "Deposit history error:",
        err
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  /* =======================================================
     INITIAL HISTORY LOAD
  ======================================================= */

  useEffect(() => {
    loadDeposits();
  }, []);

  /* =======================================================
     HANDLE DEPOSIT
  ======================================================= */

  const handleDeposit = async () => {
    setError("");
    setMessage("");
    setSuccess(false);

    const parsedAmount =
      Number(amount);

    /* -----------------------------------------------
       AMOUNT VALIDATION
    ----------------------------------------------- */

    if (
      !Number.isFinite(
        parsedAmount
      ) ||
      parsedAmount <= 0
    ) {
      setError(
        "Please enter a valid deposit amount."
      );

      return;
    }

    if (
      parsedAmount < 1
    ) {
      setError(
        "Minimum deposit amount is $1."
      );

      return;
    }

    /* -----------------------------------------------
       PAYMENT METHOD VALIDATION
    ----------------------------------------------- */

    if (
      method === "mpesa" ||
      method === "airtel"
    ) {
      if (!phone.trim()) {
        setError(
          `Please enter your ${
            method === "mpesa"
              ? "M-Pesa"
              : "Airtel Money"
          } phone number.`
        );

        return;
      }
    }

    if (method === "bank") {
      if (!reference.trim()) {
        setError(
          "Enter your bank transfer reference after making the transfer."
        );

        return;
      }
    }

    /* -----------------------------------------------
       CREATE DEPOSIT
    ----------------------------------------------- */

    try {
      setLoading(true);

      /*
       * IMPORTANT:
       * We send the USD amount to the backend because
       * the current wallet is a USD demo wallet.
       *
       * The selected currency is stored as metadata.
       */

      let paymentReference = "";

      if (
        method === "mpesa" ||
        method === "airtel"
      ) {
        paymentReference =
          phone.trim();
      }

      if (method === "bank") {
        paymentReference =
          reference.trim();
      }

      if (method === "card") {
        /*
         * We deliberately DO NOT send card numbers,
         * expiry dates or CVV to our database.
         *
         * A real card payment should use a payment
         * provider's hosted checkout/tokenization.
         */

        paymentReference =
          account.trim();
      }

      if (method === "crypto") {
        paymentReference =
          reference.trim();
      }

      const response =
        await fetch(
          "/api/deposits",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              amount:
                parsedAmount,

              currency:
                currency,

              method:
                method,

              reference:
                paymentReference ||
                null,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create deposit."
        );
      }

      setSuccess(true);

      setMessage(
        data.message ||
          "Deposit request created successfully."
      );

      /*
       * Clear temporary fields.
       */

      setPhone("");
      setAccount("");
      setReference("");

      /*
       * Reload database history.
       */

      await loadDeposits();

    } catch (err) {
      console.error(
        "Deposit request error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the deposit server."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     STATUS HELPERS
  ======================================================= */

  const statusClass = (
    status?: string
  ) => {
    switch (
      String(status).toLowerCase()
    ) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";

      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";

      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  const StatusIcon = ({
    status,
  }: {
    status?: string;
  }) => {
    const normalized =
      String(status).toLowerCase();

    if (
      normalized ===
      "approved"
    ) {
      return (
        <CheckCircle2 className="h-4 w-4" />
      );
    }

    if (
      normalized ===
      "rejected"
    ) {
      return (
        <XCircle className="h-4 w-4" />
      );
    }

    return (
      <Clock className="h-4 w-4" />
    );
  };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="min-h-full space-y-5 pb-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 sm:p-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">

              <ArrowDownToLine className="h-5 w-5 text-green-500" />

            </div>

            <div>

              <h1 className="text-xl font-bold text-white sm:text-2xl">
                Deposit Funds
              </h1>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                Add funds to your PIPMASTER trading account securely.
              </p>

            </div>

          </div>

          <button
            onClick={loadDeposits}
            disabled={loadingHistory}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition hover:border-yellow-500 hover:bg-zinc-800 hover:text-white disabled:opacity-50"
          >

            <RefreshCw
              className={`h-4 w-4 ${
                loadingHistory
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh History

          </button>

        </div>

      </section>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {success && (
        <section className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">

          <div className="flex items-start gap-3">

            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />

            <div>

              <p className="text-sm font-bold text-green-400">
                Deposit Request Submitted
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-400">
                {message}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Your demo wallet balance will be updated after the deposit is approved by an administrator.
              </p>

            </div>

          </div>

        </section>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">

          <div className="flex items-start gap-3">

            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

            <div>

              <p className="text-sm font-bold text-red-400">
                Deposit Failed
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-400">
                {error}
              </p>

            </div>

          </div>

        </section>
      )}

      <div className="grid gap-5 xl:grid-cols-12">

        {/* ===================================================
            LEFT
        =================================================== */}

        <section className="space-y-5 xl:col-span-8">

          {/* =================================================
              AMOUNT
          ================================================= */}

          <div className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 sm:p-6">

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-lg bg-yellow-500/10 p-2">

                <DollarSign className="h-5 w-5 text-yellow-500" />

              </div>

              <div>

                <h2 className="font-semibold text-white">
                  Deposit Amount
                </h2>

                <p className="text-xs text-zinc-500">
                  Enter the amount you want to deposit.
                </p>

              </div>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div>

                <label className="mb-2 block text-xs text-zinc-500">
                  Amount in USD
                </label>

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    $
                  </span>

                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        e.target.value
                      )
                    }
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] pl-8 pr-4 text-white outline-none focus:border-yellow-500"
                    placeholder="100"
                  />

                </div>

              </div>

              <div>

                <label className="mb-2 block text-xs text-zinc-500">
                  Receive currency
                </label>

                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      e.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
                >

                  {currencies.map(
                    (item) => (
                      <option
                        key={item.code}
                        value={item.code}
                      >
                        {item.code} -{" "}
                        {item.name}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {/* CONVERSION */}

            <div className="mt-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">

              <div className="flex flex-wrap items-center justify-between gap-3">

                <div>

                  <p className="text-xs text-zinc-500">
                    Deposit amount
                  </p>

                  <p className="mt-1 text-xl font-bold text-white">
                    ${usdAmount.toFixed(2)} USD
                  </p>

                </div>

                <ArrowRight className="text-yellow-500" />

                <div className="text-right">

                  <p className="text-xs text-zinc-500">
                    Estimated local amount
                  </p>

                  <p className="mt-1 text-xl font-bold text-yellow-500">
                    {selectedCurrency.symbol}
                    {formattedAmount}
                  </p>

                </div>

              </div>

              <p className="mt-3 text-[10px] text-zinc-600">
                The current wallet uses USD demo funds. The selected currency is recorded with the deposit request; actual currency conversion requires a payment provider.
              </p>

            </div>

          </div>

          {/* =================================================
              PAYMENT METHODS
          ================================================= */}

          <div className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 sm:p-6">

            <div className="mb-5">

              <h2 className="font-semibold text-white">
                Choose Payment Method
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Select how you want to fund your account.
              </p>

            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {paymentMethods.map(
                (item) => {

                  const Icon =
                    item.icon;

                  const active =
                    method ===
                    item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setMethod(
                          item.id
                        );
                        setError("");
                        setSuccess(
                          false
                        );
                      }}
                      className={`rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-yellow-500 bg-yellow-500/5"
                          : "border-zinc-800 bg-[#0F1114] hover:border-zinc-600"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bg}`}
                        >

                          <Icon
                            className={`h-5 w-5 ${item.color}`}
                          />

                        </div>

                        {active && (
                          <CheckCircle2 className="h-5 w-5 text-yellow-500" />
                        )}

                      </div>

                      <p className="mt-3 text-sm font-semibold text-white">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {item.description}
                      </p>

                    </button>
                  );
                }
              )}

            </div>

          </div>

          {/* =================================================
              METHOD DETAILS
          ================================================= */}

          <div className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 sm:p-6">

            {method === "mpesa" && (
              <MobileMoneyForm
                title="Safaricom M-Pesa"
                phone={phone}
                setPhone={
                  setPhone
                }
              />
            )}

            {method === "airtel" && (
              <MobileMoneyForm
                title="Airtel Money"
                phone={phone}
                setPhone={
                  setPhone
                }
              />
            )}

            {method === "card" && (
              <CardForm
                account={account}
                setAccount={
                  setAccount
                }
              />
            )}

            {method === "bank" && (
              <BankTransferInfo
                reference={
                  reference
                }
                setReference={
                  setReference
                }
              />
            )}

            {method === "crypto" && (
              <CryptoDeposit
                reference={
                  reference
                }
                setReference={
                  setReference
                }
              />
            )}

          </div>

        </section>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <aside className="space-y-5 xl:col-span-4">

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="rounded-2xl border border-zinc-800 bg-[#15181C] p-5">

            <div className="flex items-center gap-3">

              <Wallet className="h-5 w-5 text-yellow-500" />

              <h2 className="font-semibold text-white">
                Deposit Summary
              </h2>

            </div>

            <div className="mt-5 space-y-4">

              <SummaryRow
                label="Deposit amount"
                value={`$${usdAmount.toFixed(
                  2
                )} USD`}
              />

              <SummaryRow
                label="Currency"
                value={
                  currency
                }
              />

              <SummaryRow
                label="Payment method"
                value={
                  paymentMethods.find(
                    (item) =>
                      item.id ===
                      method
                  )?.name ||
                  ""
                }
              />

              <div className="border-t border-zinc-800 pt-4">

                <SummaryRow
                  label="Estimated received"
                  value={`${selectedCurrency.symbol}${formattedAmount}`}
                  highlight
                />

              </div>

            </div>

            <button
              type="button"
              onClick={
                handleDeposit
              }
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Creating Request...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Continue Deposit
                </>
              )}

            </button>

            <p className="mt-3 text-center text-[10px] leading-4 text-zinc-600">
              Your deposit is created as a pending request. Your wallet is only credited after approval.
            </p>

          </div>

          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="rounded-2xl border border-zinc-800 bg-[#15181C] p-5">

            <div className="flex items-start gap-3">

              <Lock className="mt-0.5 h-5 w-5 text-green-500" />

              <div>

                <h3 className="text-sm font-semibold text-white">
                  Secure Transactions
                </h3>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Deposit requests are validated by the Express server and stored in your authenticated account.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              IMPORTANT
          ================================================= */}

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">

            <div className="flex items-start gap-3">

              <Zap className="mt-0.5 h-5 w-5 text-yellow-500" />

              <div>

                <h3 className="text-sm font-semibold text-yellow-400">
                  Demo Payment Workflow
                </h3>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  This request system records deposits in your database. It does not automatically move real money until an actual payment provider is connected.
                </p>

              </div>

            </div>

          </div>

        </aside>

      </div>

      {/* =====================================================
          DEPOSIT HISTORY
      ===================================================== */}

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#15181C]">

        <div className="flex items-center justify-between border-b border-zinc-800 p-4 sm:p-5">

          <div>

            <h2 className="font-bold text-white">
              Deposit History
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Your database-backed deposit requests.
            </p>

          </div>

          <span className="rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-bold text-zinc-400">
            {deposits.length} Records
          </span>

        </div>

        {loadingHistory ? (
          <div className="flex items-center justify-center p-10">

            <RefreshCw className="h-5 w-5 animate-spin text-yellow-500" />

          </div>
        ) : deposits.length === 0 ? (
          <div className="p-10 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900">

              <ArrowDownToLine className="h-5 w-5 text-zinc-600" />

            </div>

            <p className="mt-3 text-sm font-bold text-white">
              No deposits yet
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Your deposit requests will appear here.
            </p>

          </div>
        ) : (
          <div className="divide-y divide-zinc-800">

            {deposits
              .slice(0, 20)
              .map((deposit) => (

                <div
                  key={
                    String(
                      deposit.id
                    )
                  }
                  className="flex flex-col gap-3 p-4 transition hover:bg-zinc-900/40 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10">

                      <ArrowDownToLine className="h-4 w-4 text-green-500" />

                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-semibold text-white">
                        Deposit #{deposit.id}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {formatMethod(
                          deposit.method
                        )}
                        {" • "}
                        {deposit.currency ||
                          "USD"}
                      </p>

                      <p className="mt-1 text-[10px] text-zinc-600">
                        {formatDate(
                          deposit.created_at
                        )}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">

                    <div className="text-right">

                      <p className="text-sm font-bold text-white">
                        $
                        {numberValue(
                          deposit.amount
                        ).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>

                      {deposit.reference && (
                        <p className="mt-1 max-w-[180px] truncate text-[10px] text-zinc-600">
                          Ref:{" "}
                          {
                            deposit.reference
                          }
                        </p>
                      )}

                    </div>

                    <div
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-bold uppercase ${statusClass(
                        deposit.status
                      )}`}
                    >

                      <StatusIcon
                        status={
                          deposit.status
                        }
                      />

                      {deposit.status ||
                        "pending"}

                    </div>

                  </div>

                </div>

              ))}

          </div>
        )}

      </section>

    </main>
  );
}

/* ============================================================
   MOBILE MONEY FORM
============================================================ */

function MobileMoneyForm({
  title,
  phone,
  setPhone,
}: {
  title: string;
  phone: string;
  setPhone: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <h2 className="font-semibold text-white">
        {title}
      </h2>

      <p className="mt-1 text-xs text-zinc-500">
        Enter your mobile money number for this deposit request.
      </p>

      <label className="mt-5 block text-xs text-zinc-500">
        Mobile Phone Number
      </label>

      <input
        value={phone}
        onChange={(e) =>
          setPhone(
            e.target.value
          )
        }
        placeholder="e.g. 0712345678"
        className="mt-2 h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
      />

      <div className="mt-4 rounded-xl bg-green-500/5 p-4 text-xs text-zinc-400">

        <div className="flex items-start gap-2">

          <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />

          <p>
            The number is recorded as the payment reference for the deposit request. An actual STK Push requires a payment provider integration.
          </p>

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   CARD FORM
============================================================ */

function CardForm({
  account,
  setAccount,
}: {
  account: string;
  setAccount: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <h2 className="font-semibold text-white">
        Bank Card
      </h2>

      <p className="mt-1 text-xs text-zinc-500">
        Use a hosted payment provider for actual card payments.
      </p>

      <label className="mt-5 block text-xs text-zinc-500">
        Cardholder Name
      </label>

      <input
        value={account}
        onChange={(e) =>
          setAccount(
            e.target.value
          )
        }
        placeholder="Name on card"
        className="mt-2 h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
      />

      <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

        <div className="flex items-start gap-2">

          <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />

          <p className="text-xs leading-5 text-zinc-500">
            Card numbers, expiry dates and CVV are intentionally not submitted to this application. A real card payment should use a PCI-compliant payment provider checkout.
          </p>

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   BANK TRANSFER
============================================================ */

function BankTransferInfo({
  reference,
  setReference,
}: {
  reference: string;
  setReference: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <h2 className="font-semibold text-white">
        Bank Transfer
      </h2>

      <p className="mt-1 text-xs text-zinc-500">
        Transfer the funds and enter the transaction reference below.
      </p>

      <div className="mt-5 space-y-3 rounded-xl bg-[#0F1114] p-4">

        <SummaryRow
          label="Bank"
          value="PIPMASTER Finance Bank"
        />

        <SummaryRow
          label="Account Name"
          value="PIPMASTER TRADING"
        />

        <SummaryRow
          label="Account Number"
          value="0000000000"
        />

        <SummaryRow
          label="SWIFT / BIC"
          value="PIPMKE01"
        />

      </div>

      <label className="mt-5 block text-xs text-zinc-500">
        Bank Transaction Reference
      </label>

      <input
        value={reference}
        onChange={(e) =>
          setReference(
            e.target.value
          )
        }
        placeholder="Enter transaction reference"
        className="mt-2 h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
      />

    </div>
  );
}

/* ============================================================
   CRYPTO
============================================================ */

function CryptoDeposit({
  reference,
  setReference,
}: {
  reference: string;
  setReference: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <h2 className="font-semibold text-white">
        Crypto Deposit
      </h2>

      <p className="mt-1 text-xs text-zinc-500">
        Select a network and use the transaction hash as your reference.
      </p>

      <select className="mt-5 h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none">

        <option>
          USDT - TRC20
        </option>

        <option>
          USDT - ERC20
        </option>

        <option>
          Bitcoin Network
        </option>

        <option>
          Ethereum Network
        </option>

      </select>

      <div className="mt-4 break-all rounded-xl bg-[#0F1114] p-4 font-mono text-xs text-zinc-400">

        TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

      </div>

      <label className="mt-5 block text-xs text-zinc-500">
        Transaction Hash / Reference
      </label>

      <input
        value={reference}
        onChange={(e) =>
          setReference(
            e.target.value
          )
        }
        placeholder="Enter transaction hash"
        className="mt-2 h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
      />

    </div>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <span className="text-xs text-zinc-500">
        {label}
      </span>

      <span
        className={`text-right text-sm font-semibold ${
          highlight
            ? "text-yellow-500"
            : "text-zinc-200"
        }`}
      >
        {value}
      </span>

    </div>
  );
}

/* ============================================================
   METHOD NAME
============================================================ */

function formatMethod(
  method?: string
) {
  switch (
    String(method).toLowerCase()
  ) {
    case "mpesa":
      return "M-Pesa";

    case "airtel":
      return "Airtel Money";

    case "card":
      return "Bank Card";

    case "bank":
      return "Bank Transfer";

    case "crypto":
      return "Crypto";

    default:
      return method ||
        "Unknown";
  }
}