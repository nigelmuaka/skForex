"use client";

import {
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const trades = [
  {
    id: 1,
    pair: "BTC/USDT",
    side: "BUY",
    type: "Market",
    qty: "0.125 BTC",
    price: "$118,450.25",
    fee: "$3.20",
    pnl: "+$245.30",
    status: "Completed",
    time: "2026-07-19 09:25",
  },
  {
    id: 2,
    pair: "ETH/USDT",
    side: "SELL",
    type: "Limit",
    qty: "1.52 ETH",
    price: "$4,625.10",
    fee: "$2.10",
    pnl: "-$58.40",
    status: "Completed",
    time: "2026-07-19 09:12",
  },
  {
    id: 3,
    pair: "XAU/USD",
    side: "BUY",
    type: "Market",
    qty: "5 Lots",
    price: "$3,356.40",
    fee: "$4.80",
    pnl: "+$326.90",
    status: "Completed",
    time: "2026-07-19 08:55",
  },
  {
    id: 4,
    pair: "EUR/USD",
    side: "SELL",
    type: "Stop",
    qty: "2 Lots",
    price: "1.1756",
    fee: "$1.20",
    pnl: "+$102.00",
    status: "Pending",
    time: "2026-07-19 08:41",
  },
  {
    id: 5,
    pair: "SOL/USDT",
    side: "BUY",
    type: "Limit",
    qty: "50 SOL",
    price: "$201.52",
    fee: "$1.75",
    pnl: "-$75.60",
    status: "Cancelled",
    time: "2026-07-19 08:10",
  },
];

export default function TradeHistory() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#1A1D24] overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">

        <div>

          <h2 className="text-lg font-bold text-white">
            Trade History
          </h2>

          <p className="text-xs text-zinc-500">
            Recent Executed Orders
          </p>

        </div>

        <button className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400">
          View All
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-zinc-800 bg-zinc-900 text-left text-xs uppercase text-zinc-500">

              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Pair</th>
              <th className="px-4 py-3">Side</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">P/L</th>
              <th className="px-4 py-3">Status</th>

            </tr>

          </thead>

          <tbody>

            {trades.map((trade) => (

              <tr
                key={trade.id}
                className="border-b border-zinc-800 hover:bg-zinc-900 transition"
              >

                <td className="px-4 py-4 text-zinc-400 whitespace-nowrap">
                  {trade.time}
                </td>

                <td className="px-4 py-4 font-semibold">
                  {trade.pair}
                </td>

                <td className="px-4 py-4">

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                      trade.side === "BUY"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {trade.side === "BUY" ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}

                    {trade.side}

                  </span>

                </td>

                <td className="px-4 py-4">
                  {trade.type}
                </td>

                <td className="px-4 py-4">
                  {trade.qty}
                </td>

                <td className="px-4 py-4">
                  {trade.price}
                </td>

                <td className="px-4 py-4">
                  {trade.fee}
                </td>

                <td
                  className={`px-4 py-4 font-bold ${
                    trade.pnl.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {trade.pnl}
                </td>

                <td className="px-4 py-4">

                  {trade.status === "Completed" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500">
                      <CheckCircle2 size={14} />
                      Completed
                    </span>
                  )}

                  {trade.status === "Pending" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-500">
                      <Clock3 size={14} />
                      Pending
                    </span>
                  )}

                  {trade.status === "Cancelled" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
                      <XCircle size={14} />
                      Cancelled
                    </span>
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="grid grid-cols-3 border-t border-zinc-800 bg-zinc-900">

        <div className="p-4 border-r border-zinc-800">
          <p className="text-xs text-zinc-500">
            Today's Trades
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            58
          </h3>
        </div>

        <div className="p-4 border-r border-zinc-800">
          <p className="text-xs text-zinc-500">
            Total Fees
          </p>

          <h3 className="mt-2 text-2xl font-bold text-yellow-500">
            $412
          </h3>
        </div>

        <div className="p-4">
          <p className="text-xs text-zinc-500">
            Net Profit
          </p>

          <h3 className="mt-2 text-2xl font-bold text-green-500">
            +$12,450
          </h3>
        </div>

      </div>

    </div>
  );
}