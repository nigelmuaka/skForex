"use client";

import { useMemo, useState } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";

type TradeStatus = "Completed" | "Cancelled" | "Pending";
type TradeSide = "Buy" | "Sell";

type Trade = {
  id: string;
  pair: string;
  side: TradeSide;
  type: "Market" | "Limit" | "Stop";
  amount: string;
  entry: string;
  exit: string;
  pnl: number;
  fee: number;
  status: TradeStatus;
  date: string;
  time: string;
};

const trades: Trade[] = [
  {
    id: "TRD-10482",
    pair: "BTC/USDT",
    side: "Buy",
    type: "Market",
    amount: "0.25 BTC",
    entry: "116,820.50",
    exit: "118,450.20",
    pnl: 407.42,
    fee: 12.5,
    status: "Completed",
    date: "2026-07-21",
    time: "14:32:18",
  },
  {
    id: "TRD-10481",
    pair: "EUR/USD",
    side: "Sell",
    type: "Limit",
    amount: "2.00 Lots",
    entry: "1.1782",
    exit: "1.1740",
    pnl: 840.0,
    fee: 8.2,
    status: "Completed",
    date: "2026-07-21",
    time: "12:18:44",
  },
  {
    id: "TRD-10480",
    pair: "ETH/USDT",
    side: "Buy",
    type: "Market",
    amount: "2.50 ETH",
    entry: "3,760.20",
    exit: "3,842.12",
    pnl: 204.8,
    fee: 6.4,
    status: "Completed",
    date: "2026-07-21",
    time: "10:45:12",
  },
  {
    id: "TRD-10479",
    pair: "XAU/USD",
    side: "Sell",
    type: "Stop",
    amount: "1.00 Lot",
    entry: "3,364.10",
    exit: "3,356.30",
    pnl: 780.0,
    fee: 9.1,
    status: "Completed",
    date: "2026-07-20",
    time: "16:22:50",
  },
  {
    id: "TRD-10478",
    pair: "GBP/USD",
    side: "Buy",
    type: "Market",
    amount: "1.50 Lots",
    entry: "1.3580",
    exit: "1.3612",
    pnl: 480.0,
    fee: 7.3,
    status: "Completed",
    date: "2026-07-20",
    time: "13:05:29",
  },
  {
    id: "TRD-10477",
    pair: "SOL/USDT",
    side: "Sell",
    type: "Limit",
    amount: "25 SOL",
    entry: "184.20",
    exit: "181.40",
    pnl: 70.0,
    fee: 3.8,
    status: "Completed",
    date: "2026-07-20",
    time: "09:41:10",
  },
  {
    id: "TRD-10476",
    pair: "BTC/USDT",
    side: "Sell",
    type: "Market",
    amount: "0.10 BTC",
    entry: "118,920.00",
    exit: "119,240.00",
    pnl: -32.0,
    fee: 4.1,
    status: "Completed",
    date: "2026-07-19",
    time: "18:12:03",
  },
  {
    id: "TRD-10475",
    pair: "USD/JPY",
    side: "Buy",
    type: "Market",
    amount: "1.00 Lot",
    entry: "158.22",
    exit: "158.65",
    pnl: 430.0,
    fee: 5.2,
    status: "Completed",
    date: "2026-07-19",
    time: "15:32:46",
  },
  {
    id: "TRD-10474",
    pair: "ETH/USDT",
    side: "Buy",
    type: "Limit",
    amount: "1.00 ETH",
    entry: "3,720.00",
    exit: "3,680.00",
    pnl: -40.0,
    fee: 3.4,
    status: "Completed",
    date: "2026-07-19",
    time: "11:20:16",
  },
  {
    id: "TRD-10473",
    pair: "NAS100",
    side: "Sell",
    type: "Stop",
    amount: "2.00 Lots",
    entry: "23,820.00",
    exit: "23,950.00",
    pnl: -260.0,
    fee: 11.2,
    status: "Cancelled",
    date: "2026-07-18",
    time: "17:05:30",
  },
];

const periods = ["All Time", "Today", "7 Days", "30 Days"];

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("All Time");
  const [side, setSide] = useState<"All" | TradeSide>("All");
  const [status, setStatus] = useState<"All" | TradeStatus>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const matchesSearch =
        trade.pair.toLowerCase().includes(search.toLowerCase()) ||
        trade.id.toLowerCase().includes(search.toLowerCase());

      const matchesSide =
        side === "All" || trade.side === side;

      const matchesStatus =
        status === "All" || trade.status === status;

      return matchesSearch && matchesSide && matchesStatus;
    });
  }, [search, side, status]);

  const totalProfit = trades
    .filter((trade) => trade.pnl > 0)
    .reduce((total, trade) => total + trade.pnl, 0);

  const totalLoss = Math.abs(
    trades
      .filter((trade) => trade.pnl < 0)
      .reduce((total, trade) => total + trade.pnl, 0)
  );

  const netProfit = totalProfit - totalLoss;

  const winningTrades = trades.filter(
    (trade) => trade.pnl > 0
  ).length;

  const winRate = Math.round(
    (winningTrades / trades.length) * 100
  );

  const exportHistory = () => {
    const headers = [
      "Trade ID",
      "Pair",
      "Side",
      "Type",
      "Amount",
      "Entry",
      "Exit",
      "P/L",
      "Fee",
      "Status",
      "Date",
      "Time",
    ];

    const rows = filteredTrades.map((trade) => [
      trade.id,
      trade.pair,
      trade.side,
      trade.type,
      trade.amount,
      trade.entry,
      trade.exit,
      trade.pnl,
      trade.fee,
      trade.status,
      trade.date,
      trade.time,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "pipmaster-trading-history.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full space-y-4 pb-8">

      {/* ================= HEADER ================= */}

      <section className="rounded-xl border border-zinc-800 bg-[#15181C] p-4 sm:p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">

                <CalendarDays className="h-5 w-5 text-yellow-500" />

              </div>

              <div>

                <h1 className="text-xl font-bold text-white sm:text-2xl">
                  Trading History
                </h1>

                <p className="text-xs text-zinc-500 sm:text-sm">
                  Review and analyze all your previous trading activity.
                </p>

              </div>

            </div>

          </div>


          <button
            onClick={exportHistory}
            className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
          >

            <Download className="h-4 w-4" />

            Export History

          </button>

        </div>

      </section>


      {/* ================= SUMMARY CARDS ================= */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        <SummaryCard
          title="Net Profit"
          value={`$${netProfit.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          subtitle="Total performance"
          icon={TrendingUp}
          positive
        />

        <SummaryCard
          title="Total Profit"
          value={`+$${totalProfit.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          subtitle="Winning trades"
          icon={ArrowUpRight}
          positive
        />

        <SummaryCard
          title="Total Loss"
          value={`-$${totalLoss.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          subtitle="Losing trades"
          icon={ArrowDownRight}
          positive={false}
        />

        <SummaryCard
          title="Win Rate"
          value={`${winRate}%`}
          subtitle={`${trades.length} total trades`}
          icon={TrendingUp}
          positive
        />

      </section>


      {/* ================= FILTERS ================= */}

      <section className="rounded-xl border border-zinc-800 bg-[#15181C] p-3 sm:p-4">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pair or trade ID..."
              className="h-10 w-full rounded-lg border border-zinc-700 bg-[#0F1114] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-500"
            />

          </div>


          <div className="flex gap-2 overflow-x-auto">

            {periods.map((item) => (

              <button
                key={item}
                onClick={() => setPeriod(item)}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${
                  period === item
                    ? "bg-yellow-500 text-black"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {item}
              </button>

            ))}

          </div>


          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
          >

            <SlidersHorizontal className="h-4 w-4" />

            Filters

          </button>

        </div>


        {showFilters && (

          <div className="mt-3 grid gap-3 border-t border-zinc-800 pt-3 sm:grid-cols-2">

            <div>

              <label className="mb-1 block text-xs text-zinc-500">
                Trade Side
              </label>

              <select
                value={side}
                onChange={(e) =>
                  setSide(e.target.value as "All" | TradeSide)
                }
                className="w-full rounded-lg border border-zinc-700 bg-[#0F1114] px-3 py-2 text-sm text-white outline-none"
              >

                <option value="All">All Sides</option>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>

              </select>

            </div>


            <div>

              <label className="mb-1 block text-xs text-zinc-500">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "All" | TradeStatus
                  )
                }
                className="w-full rounded-lg border border-zinc-700 bg-[#0F1114] px-3 py-2 text-sm text-white outline-none"
              >

                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>

              </select>

            </div>

          </div>

        )}

      </section>


      {/* ================= TABLE ================= */}

      <section className="overflow-hidden rounded-xl border border-zinc-800 bg-[#15181C]">

        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">

          <div>

            <h2 className="font-bold text-white">
              Trade Records
            </h2>

            <p className="text-xs text-zinc-500">
              {filteredTrades.length} trades found
            </p>

          </div>

          <Filter className="h-4 w-4 text-zinc-500" />

        </div>


        {/* DESKTOP TABLE */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full min-w-[900px] text-left">

            <thead className="border-b border-zinc-800 bg-[#111315]">

              <tr className="text-xs uppercase tracking-wider text-zinc-500">

                <th className="px-4 py-3">
                  Trade
                </th>

                <th className="px-4 py-3">
                  Pair
                </th>

                <th className="px-4 py-3">
                  Side
                </th>

                <th className="px-4 py-3">
                  Amount
                </th>

                <th className="px-4 py-3">
                  Entry / Exit
                </th>

                <th className="px-4 py-3">
                  P/L
                </th>

                <th className="px-4 py-3">
                  Status
                </th>

                <th className="px-4 py-3">
                  Date
                </th>

                <th className="px-4 py-3">
                  Action
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-zinc-800">

              {filteredTrades.map((trade) => (

                <tr
                  key={trade.id}
                  className="transition hover:bg-zinc-900/60"
                >

                  <td className="px-4 py-4">

                    <p className="text-sm font-semibold text-white">
                      {trade.id}
                    </p>

                    <p className="text-xs text-zinc-500">
                      {trade.type}
                    </p>

                  </td>


                  <td className="px-4 py-4">

                    <p className="font-semibold text-white">
                      {trade.pair}
                    </p>

                  </td>


                  <td className="px-4 py-4">

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                        trade.side === "Buy"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >

                      {trade.side === "Buy" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}

                      {trade.side}

                    </span>

                  </td>


                  <td className="px-4 py-4 text-sm text-zinc-300">
                    {trade.amount}
                  </td>


                  <td className="px-4 py-4">

                    <p className="text-xs text-zinc-400">
                      In: {trade.entry}
                    </p>

                    <p className="text-xs text-zinc-500">
                      Out: {trade.exit}
                    </p>

                  </td>


                  <td className="px-4 py-4">

                    <p
                      className={`font-bold ${
                        trade.pnl >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {trade.pnl >= 0 ? "+" : "-"}$
                      {Math.abs(trade.pnl).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                        }
                      )}
                    </p>

                    <p className="text-xs text-zinc-600">
                      Fee: ${trade.fee}
                    </p>

                  </td>


                  <td className="px-4 py-4">
                    <StatusBadge status={trade.status} />
                  </td>


                  <td className="px-4 py-4">

                    <p className="text-sm text-zinc-300">
                      {trade.date}
                    </p>

                    <p className="text-xs text-zinc-600">
                      {trade.time}
                    </p>

                  </td>


                  <td className="px-4 py-4">

                    <button
                      onClick={() => setSelectedTrade(trade)}
                      className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 transition hover:border-yellow-500 hover:text-yellow-500"
                    >
                      Details
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* MOBILE CARDS */}

        <div className="divide-y divide-zinc-800 md:hidden">

          {filteredTrades.map((trade) => (

            <div
              key={trade.id}
              className="p-4"
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="font-bold text-white">
                    {trade.pair}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    {trade.id}
                  </p>

                </div>

                <StatusBadge status={trade.status} />

              </div>


              <div className="mt-4 grid grid-cols-2 gap-3">

                <div>

                  <p className="text-[10px] uppercase text-zinc-600">
                    Side
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${
                      trade.side === "Buy"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {trade.side}
                  </p>

                </div>


                <div>

                  <p className="text-[10px] uppercase text-zinc-600">
                    Amount
                  </p>

                  <p className="mt-1 text-sm text-zinc-300">
                    {trade.amount}
                  </p>

                </div>


                <div>

                  <p className="text-[10px] uppercase text-zinc-600">
                    Entry
                  </p>

                  <p className="mt-1 text-sm text-zinc-300">
                    {trade.entry}
                  </p>

                </div>


                <div>

                  <p className="text-[10px] uppercase text-zinc-600">
                    Exit
                  </p>

                  <p className="mt-1 text-sm text-zinc-300">
                    {trade.exit}
                  </p>

                </div>

              </div>


              <div className="mt-4 flex items-center justify-between">

                <div>

                  <p className="text-[10px] uppercase text-zinc-600">
                    Profit / Loss
                  </p>

                  <p
                    className={`mt-1 font-bold ${
                      trade.pnl >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {trade.pnl >= 0 ? "+" : "-"}$
                    {Math.abs(trade.pnl).toFixed(2)}
                  </p>

                </div>


                <button
                  onClick={() => setSelectedTrade(trade)}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300"
                >
                  View Details
                </button>

              </div>

            </div>

          ))}

        </div>


        {filteredTrades.length === 0 && (

          <div className="p-10 text-center">

            <Search className="mx-auto h-8 w-8 text-zinc-700" />

            <p className="mt-3 text-sm text-zinc-500">
              No trading history found.
            </p>

          </div>

        )}

      </section>


      {/* ================= TRADE DETAILS MODAL ================= */}

      {selectedTrade && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-[#181B20] shadow-2xl">

            <div className="flex items-center justify-between border-b border-zinc-800 p-4">

              <div>

                <p className="text-xs text-zinc-500">
                  Trade Details
                </p>

                <h2 className="mt-1 text-lg font-bold text-white">
                  {selectedTrade.pair}
                </h2>

              </div>


              <button
                onClick={() => setSelectedTrade(null)}
                className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >

                <X className="h-5 w-5" />

              </button>

            </div>


            <div className="grid grid-cols-2 gap-4 p-5">

              <Detail label="Trade ID" value={selectedTrade.id} />

              <Detail label="Order Type" value={selectedTrade.type} />

              <Detail label="Side" value={selectedTrade.side} />

              <Detail label="Amount" value={selectedTrade.amount} />

              <Detail label="Entry Price" value={selectedTrade.entry} />

              <Detail label="Exit Price" value={selectedTrade.exit} />

              <Detail label="Date" value={selectedTrade.date} />

              <Detail label="Time" value={selectedTrade.time} />

              <Detail
                label="Trading Fee"
                value={`$${selectedTrade.fee}`}
              />

              <Detail
                label="Status"
                value={selectedTrade.status}
              />

            </div>


            <div className="border-t border-zinc-800 p-5">

              <p className="text-xs text-zinc-500">
                Final Profit / Loss
              </p>

              <p
                className={`mt-1 text-3xl font-bold ${
                  selectedTrade.pnl >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {selectedTrade.pnl >= 0 ? "+" : "-"}$
                {Math.abs(selectedTrade.pnl).toFixed(2)}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


/* ================================================= */
/* SUMMARY CARD */
/* ================================================= */

function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  positive,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  positive: boolean;
}) {
  return (

    <div className="min-w-0 rounded-xl border border-zinc-800 bg-[#15181C] p-3 transition hover:border-yellow-500/40 sm:p-4">

      <div className="flex items-start justify-between gap-2">

        <div className="min-w-0">

          <p className="truncate text-[10px] uppercase tracking-wide text-zinc-500 sm:text-xs">
            {title}
          </p>

          <p
            className={`mt-2 truncate text-lg font-bold sm:text-2xl ${
              positive
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {value}
          </p>

          <p className="mt-1 truncate text-[10px] text-zinc-600 sm:text-xs">
            {subtitle}
          </p>

        </div>

        <div className="hidden rounded-lg bg-yellow-500/10 p-2 sm:block">

          <Icon className="h-4 w-4 text-yellow-500" />

        </div>

      </div>

    </div>

  );
}


/* ================================================= */
/* STATUS BADGE */
/* ================================================= */

function StatusBadge({
  status,
}: {
  status: TradeStatus;
}) {
  const styles = {
    Completed: "bg-green-500/10 text-green-500",
    Pending: "bg-yellow-500/10 text-yellow-500",
    Cancelled: "bg-red-500/10 text-red-500",
  };

  return (

    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${styles[status]}`}
    >

      {status === "Completed" && (
        <CheckCircle2 className="h-3 w-3" />
      )}

      {status === "Cancelled" && (
        <XCircle className="h-3 w-3" />
      )}

      {status === "Pending" && (
        <span className="h-2 w-2 rounded-full bg-yellow-500" />
      )}

      {status}

    </span>

  );
}


/* ================================================= */
/* DETAIL ITEM */
/* ================================================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (

    <div>

      <p className="text-[10px] uppercase tracking-wide text-zinc-600">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium text-zinc-200">
        {value}
      </p>

    </div>

  );
}