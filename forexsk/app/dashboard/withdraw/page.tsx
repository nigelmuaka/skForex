"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowUpFromLine,
  Banknote,
  Bitcoin,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  Smartphone,
  Wallet,
  AlertTriangle,
  XCircle,
} from "lucide-react";

type Currency = {
  code: string;
  name: string;
  symbol: string;
  rate: number;
};

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
];

type WithdrawalMethod =
  | "mpesa"
  | "airtel"
  | "bank"
  | "card"
  | "crypto";

const methods = [
  {
    id: "mpesa" as WithdrawalMethod,
    name: "M-Pesa",
    description: "Withdraw to Safaricom",
    icon: Smartphone,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    id: "airtel" as WithdrawalMethod,
    name: "Airtel Money",
    description: "Withdraw to Airtel",
    icon: Smartphone,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    id: "bank" as WithdrawalMethod,
    name: "Bank Account",
    description: "Local or international bank",
    icon: Banknote,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    id: "card" as WithdrawalMethod,
    name: "Bank Card",
    description: "Supported cards",
    icon: CreditCard,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: "crypto" as WithdrawalMethod,
    name: "Crypto Wallet",
    description: "USDT / BTC / ETH",
    icon: Bitcoin,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("100");
  const [currency, setCurrency] = useState("USD");
  const [method, setMethod] =
    useState<WithdrawalMethod>("mpesa");

  const [phone, setPhone] = useState("");

  const [accountHolder, setAccountHolder] =
    useState("");

  const [accountNumber, setAccountNumber] =
    useState("");

  const [bankName, setBankName] = useState("");

  const [swift, setSwift] = useState("");

  const [cardNumber, setCardNumber] = useState("");

  const [cryptoNetwork, setCryptoNetwork] =
    useState("USDT - TRC20");

  const [cryptoAddress, setCryptoAddress] =
    useState("");

  const [availableBalance, setAvailableBalance] =
    useState(0);

  const [loadingBalance, setLoadingBalance] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const selectedCurrency =
    currencies.find(
      (item) => item.code === currency
    ) || currencies[0];

  const usdAmount = Number(amount || 0);

  const convertedAmount = useMemo(() => {
    return usdAmount * selectedCurrency.rate;
  }, [usdAmount, selectedCurrency]);

  const formattedAmount = new Intl.NumberFormat(
    "en-US",
    {
      maximumFractionDigits: 2,
    }
  ).format(convertedAmount);

  const canWithdraw =
    usdAmount > 0 &&
    usdAmount <= availableBalance &&
    !submitting;

  /*
   * =========================================================
   * LOAD REAL USER BALANCE
   * =========================================================
   */

  const loadBalance = async () => {
    try {
      setLoadingBalance(true);

      const response = await fetch(
        `${API_BASE}/api/user/balance`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load your wallet balance."
        );
      }

      /*
       * Supports either:
       *
       * { demoBalance: 100 }
       *
       * or
       *
       * { realBalance: 100 }
       *
       * or
       *
       * { balance: 100 }
       */

      const balance =
        Number(data?.realBalance) ||
        Number(data?.demoBalance) ||
        Number(data?.balance) ||
        0;

      setAvailableBalance(balance);
    } catch (error) {
      console.error(
        "Balance loading error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load wallet balance."
      );
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    loadBalance();
  }, []);

  /*
   * =========================================================
   * RESET METHOD-SPECIFIC DETAILS
   * =========================================================
   */

  const changeMethod = (
    newMethod: WithdrawalMethod
  ) => {
    setMethod(newMethod);

    setSuccessMessage("");
    setErrorMessage("");

    if (newMethod !== "mpesa" && newMethod !== "airtel") {
      setPhone("");
    }

    if (newMethod !== "bank") {
      setAccountHolder("");
      setAccountNumber("");
      setBankName("");
      setSwift("");
    }

    if (newMethod !== "card") {
      setCardNumber("");
    }

    if (newMethod !== "crypto") {
      setCryptoAddress("");
    }
  };

  /*
   * =========================================================
   * VALIDATE WITHDRAWAL
   * =========================================================
   */

  const validateWithdrawal = () => {
    if (!Number.isFinite(usdAmount) || usdAmount <= 0) {
      return "Please enter a valid withdrawal amount.";
    }

    if (usdAmount > availableBalance) {
      return "Insufficient available balance.";
    }

    if (method === "mpesa" || method === "airtel") {
      if (!phone.trim()) {
        return "Please enter your mobile money number.";
      }

      if (phone.trim().length < 9) {
        return "Please enter a valid mobile money number.";
      }
    }

    if (method === "bank") {
      if (!accountHolder.trim()) {
        return "Please enter the account holder name.";
      }

      if (!accountNumber.trim()) {
        return "Please enter the bank account number.";
      }

      if (!bankName.trim()) {
        return "Please enter the bank name.";
      }
    }

    if (method === "card") {
      if (!cardNumber.trim()) {
        return "Please enter the card details.";
      }
    }

    if (method === "crypto") {
      if (!cryptoAddress.trim()) {
        return "Please enter the crypto wallet address.";
      }
    }

    return null;
  };

  /*
   * =========================================================
   * SUBMIT REAL WITHDRAWAL REQUEST
   * =========================================================
   */

  const handleWithdraw = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    const validationError =
      validateWithdrawal();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setSubmitting(true);

      /*
       * Account details are sent as structured data.
       * The backend must validate everything again.
       */

      let destination = {};

      if (
        method === "mpesa" ||
        method === "airtel"
      ) {
        destination = {
          phone: phone.trim(),
        };
      }

      if (method === "bank") {
        destination = {
          accountHolder:
            accountHolder.trim(),
          accountNumber:
            accountNumber.trim(),
          bankName: bankName.trim(),
          swift: swift.trim(),
        };
      }

      if (method === "card") {
        destination = {
          cardNumber: cardNumber.trim(),
        };
      }

      if (method === "crypto") {
        destination = {
          network: cryptoNetwork,
          address: cryptoAddress.trim(),
        };
      }

      const response = await fetch(
        `${API_BASE}/api/withdrawals`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            amount: usdAmount,
            currency,
            method,
            destination,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Withdrawal request failed."
        );
      }

      setSuccessMessage(
        data?.message ||
          "Withdrawal request submitted successfully. It is now pending review."
      );

      /*
       * Update the balance immediately using
       * the balance returned by the backend when available.
       */

      if (
        data?.balance !== undefined &&
        data?.balance !== null
      ) {
        setAvailableBalance(
          Number(data.balance)
        );
      } else if (
        data?.realBalance !== undefined &&
        data?.realBalance !== null
      ) {
        setAvailableBalance(
          Number(data.realBalance)
        );
      } else {
        await loadBalance();
      }

      /*
       * Clear the form after successful submission.
       */

      setAmount("100");
      setPhone("");
      setAccountHolder("");
      setAccountNumber("");
      setBankName("");
      setSwift("");
      setCardNumber("");
      setCryptoAddress("");
    } catch (error) {
      console.error(
        "Withdrawal error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit withdrawal request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-full space-y-5 pb-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 sm:p-6">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">

            <ArrowUpFromLine className="h-5 w-5 text-blue-400" />

          </div>

          <div>

            <h1 className="text-xl font-bold text-white sm:text-2xl">
              Withdraw Funds
            </h1>

            <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
              Request a withdrawal from your available wallet balance.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          SUCCESS / ERROR MESSAGES
      ====================================================== */}

      {successMessage && (

        <div className="flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">

          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />

          <div>

            <p className="text-sm font-semibold text-green-400">
              Withdrawal submitted
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-300">
              {successMessage}
            </p>

          </div>

        </div>

      )}


      {errorMessage && (

        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">

          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

          <div>

            <p className="text-sm font-semibold text-red-400">
              Withdrawal error
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-300">
              {errorMessage}
            </p>

          </div>

        </div>

      )}


      <div className="grid gap-5 xl:grid-cols-12">

        {/* ===================================================
            LEFT
        ==================================================== */}

        <section className="space-y-5 xl:col-span-8">

          {/* =================================================
              BALANCE
          ================================================== */}

          <div className="rounded-2xl border border-zinc-800 bg-[#15181C] p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs text-zinc-500">
                  Available to Withdraw
                </p>

                {loadingBalance ? (

                  <div className="mt-3 flex items-center gap-2">

                    <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />

                    <span className="text-sm text-zinc-500">
                      Loading balance...
                    </span>

                  </div>

                ) : (

                  <h2 className="mt-2 text-2xl font-bold text-white">
                    $
                    {availableBalance.toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </h2>

                )}

              </div>

              <Wallet className="h-7 w-7 text-yellow-500" />

            </div>

          </div>


          {/* =================================================
              AMOUNT
          ================================================== */}

          <div className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 sm:p-6">

            <h2 className="font-semibold text-white">
              Withdrawal Amount
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Enter the amount you want to withdraw.
            </p>


            <div className="mt-5 grid gap-4 sm:grid-cols-2">

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
                    max={availableBalance}
                    step="0.01"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setSuccessMessage("");
                      setErrorMessage("");
                    }}
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] pl-8 pr-4 text-white outline-none focus:border-yellow-500"
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
                    setCurrency(e.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
                >

                  {currencies.map((item) => (

                    <option
                      key={item.code}
                      value={item.code}
                    >
                      {item.code} - {item.name}
                    </option>

                  ))}

                </select>

              </div>

            </div>


            <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

              <div className="flex items-center justify-between gap-3">

                <div>

                  <p className="text-xs text-zinc-500">
                    Withdrawal amount
                  </p>

                  <p className="mt-1 text-lg font-bold text-white">
                    ${usdAmount.toFixed(2)} USD
                  </p>

                </div>

                <ArrowUpFromLine className="text-blue-400" />

                <div className="text-right">

                  <p className="text-xs text-zinc-500">
                    Estimated received
                  </p>

                  <p className="mt-1 text-lg font-bold text-blue-400">
                    {selectedCurrency.symbol}
                    {formattedAmount}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              METHODS
          ================================================== */}

          <div className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 sm:p-6">

            <h2 className="font-semibold text-white">
              Withdrawal Method
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              Select where you want to receive your funds.
            </p>


            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {methods.map((item) => {

                const Icon = item.icon;

                const active =
                  method === item.id;

                return (

                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      changeMethod(item.id)
                    }
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

              })}

            </div>

          </div>


          {/* =================================================
              DETAILS
          ================================================== */}

          <div className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 sm:p-6">

            {/* MOBILE MONEY */}

            {(method === "mpesa" ||
              method === "airtel") && (

              <div>

                <h2 className="font-semibold text-white">
                  {method === "mpesa"
                    ? "Safaricom M-Pesa"
                    : "Airtel Money"}
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Enter the phone number registered to your mobile money account.
                </p>

                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="e.g. 0712345678"
                  inputMode="tel"
                  className="mt-5 h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
                />

              </div>

            )}


            {/* BANK */}

            {method === "bank" && (

              <div>

                <h2 className="font-semibold text-white">
                  Bank Account Details
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Enter the bank account where the withdrawal should be sent.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                  <input
                    value={accountHolder}
                    onChange={(e) =>
                      setAccountHolder(
                        e.target.value
                      )
                    }
                    placeholder="Account holder name"
                    className="h-12 rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
                  />

                  <input
                    value={accountNumber}
                    onChange={(e) =>
                      setAccountNumber(
                        e.target.value
                      )
                    }
                    placeholder="Account number"
                    className="h-12 rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
                  />

                  <input
                    value={bankName}
                    onChange={(e) =>
                      setBankName(e.target.value)
                    }
                    placeholder="Bank name"
                    className="h-12 rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
                  />

                  <input
                    value={swift}
                    onChange={(e) =>
                      setSwift(e.target.value)
                    }
                    placeholder="SWIFT / BIC (optional)"
                    className="h-12 rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
                  />

                </div>

              </div>

            )}


            {/* CARD */}

            {method === "card" && (

              <div>

                <h2 className="font-semibold text-white">
                  Bank Card
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Enter the card information required by your payout provider.
                </p>

                <input
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(e.target.value)
                  }
                  placeholder="Card number"
                  inputMode="numeric"
                  className="mt-5 h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
                />

              </div>

            )}


            {/* CRYPTO */}

            {method === "crypto" && (

              <div>

                <h2 className="font-semibold text-white">
                  Crypto Wallet Address
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Select the network and enter the destination wallet address.
                </p>

                <select
                  value={cryptoNetwork}
                  onChange={(e) =>
                    setCryptoNetwork(
                      e.target.value
                    )
                  }
                  className="mt-5 h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none"
                >

                  <option>
                    USDT - TRC20
                  </option>

                  <option>
                    USDT - ERC20
                  </option>

                  <option>
                    Bitcoin
                  </option>

                  <option>
                    Ethereum
                  </option>

                </select>

                <input
                  value={cryptoAddress}
                  onChange={(e) =>
                    setCryptoAddress(
                      e.target.value
                    )
                  }
                  placeholder="Wallet address"
                  className="mt-4 h-12 w-full rounded-xl border border-zinc-700 bg-[#0F1114] px-4 text-white outline-none focus:border-yellow-500"
                />

              </div>

            )}

          </div>

        </section>


        {/* ===================================================
            RIGHT
        ==================================================== */}

        <aside className="space-y-5 xl:col-span-4">

          {/* SUMMARY */}

          <div className="rounded-2xl border border-zinc-800 bg-[#15181C] p-5">

            <div className="flex items-center gap-3">

              <Wallet className="h-5 w-5 text-yellow-500" />

              <h2 className="font-semibold text-white">
                Withdrawal Summary
              </h2>

            </div>


            <div className="mt-5 space-y-4">

              <SummaryRow
                label="Available"
                value={`$${availableBalance.toFixed(2)} USD`}
              />

              <SummaryRow
                label="Amount"
                value={`$${usdAmount.toFixed(2)} USD`}
              />

              <SummaryRow
                label="Currency"
                value={currency}
              />

              <SummaryRow
                label="Method"
                value={
                  methods.find(
                    (item) =>
                      item.id === method
                  )?.name || ""
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
              disabled={!canWithdraw}
              onClick={handleWithdraw}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
            >

              {submitting ? (

                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  Submitting...

                </>

              ) : (

                <>
                  <ArrowUpFromLine className="h-4 w-4" />

                  Request Withdrawal

                </>

              )}

            </button>

            {!loadingBalance &&
              usdAmount > availableBalance && (
                <p className="mt-3 text-center text-xs text-red-400">
                  Withdrawal amount exceeds your available balance.
                </p>
              )}

          </div>


          {/* REVIEW */}

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">

            <div className="flex items-start gap-3">

              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />

              <div>

                <h3 className="text-sm font-semibold text-white">
                  Withdrawal Review
                </h3>

                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  Your request will be recorded in the system and may remain pending until an authorized administrator reviews it.
                </p>

              </div>

            </div>

          </div>


          {/* SECURITY */}

          <div className="rounded-2xl border border-zinc-800 bg-[#15181C] p-5">

            <div className="flex items-start gap-3">

              <ShieldCheck className="h-5 w-5 text-green-500" />

              <div>

                <h3 className="text-sm font-semibold text-white">
                  Account Security
                </h3>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Never share your password, PIN, OTP, or private wallet keys with anyone.
                </p>

              </div>

            </div>

          </div>

        </aside>

      </div>

    </main>
  );
}


/*
 * ===========================================================
 * SUMMARY ROW
 * ===========================================================
 */

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