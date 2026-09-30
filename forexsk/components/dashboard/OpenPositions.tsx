"use client";

import {
  TrendingUp,
  TrendingDown,
  X,
} from "lucide-react";

const positions = [
  {
    id: 1,
    pair: "BTC/USDT",
    side: "LONG",
    leverage: "20x",
    entry: "117,850.20",
    mark: "118,648.40",
    margin: "$2,500",
    pnl: "+$1,596.40",
    positive: true,
  },
  {
    id: 2,
    pair: "ETH/USDT",
    side: "SHORT",
    leverage: "15x",
    entry: "4,720.15",
    mark: "4,625.80",
    margin: "$1,800",
    pnl: "+$845.20",
    positive: true,
  },
  {
    id: 3,
    pair: "XAU/USD",
    side: "LONG",
    leverage: "10x",
    entry: "3342.50",
    mark: "3358.20",
    margin: "$950",
    pnl: "+$157.00",
    positive: true,
  },
  {
    id: 4,
    pair: "EUR/USD",
    side: "SHORT",
    leverage: "5x",
    entry: "1.1772",
    mark: "1.1756",
    margin: "$650",
    pnl: "+$96.30",
    positive: true,
  },
  {
    id: 5,
    pair: "SOL/USDT",
    side: "LONG",
    leverage: "25x",
    entry: "208.20",
    mark: "201.50",
    margin: "$1,200",
    pnl: "-$402.15",
    positive: false,
  },
];

export default function OpenPositions() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#1A1D24] overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">

        <div>

          <h2 className="text-lg font-bold text-white">
            Open Positions
          </h2>

          <p className="text-xs text-zinc-500">
            Active Trades
          </p>

        </div>

        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500">
          {positions.length} OPEN
        </span>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-zinc-800 text-left text-xs uppercase text-zinc-500">

              <th className="px-4 py-3">Pair</th>

              <th className="px-4 py-3">Side</th>

              <th className="px-4 py-3">Lev.</th>

              <th className="px-4 py-3">Entry</th>

              <th className="px-4 py-3">Mark</th>

              <th className="px-4 py-3">Margin</th>

              <th className="px-4 py-3">P/L</th>

              <th className="px-4 py-3 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {positions.map((trade) => (

              <tr
                key={trade.id}
                className="border-b border-zinc-800 hover:bg-zinc-900 transition"
              >

                <td className="px-4 py-4 font-semibold text-white">
                  {trade.pair}
                </td>

                <td className="px-4 py-4">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      trade.side === "LONG"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {trade.side}
                  </span>

                </td>

                <td className="px-4 py-4">
                  {trade.leverage}
                </td>

                <td className="px-4 py-4">
                  {trade.entry}
                </td>

                <td className="px-4 py-4">
                  {trade.mark}
                </td>

                <td className="px-4 py-4">
                  {trade.margin}
                </td>

                <td
                  className={`px-4 py-4 font-bold ${
                    trade.positive
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  <div className="flex items-center gap-1">

                    {trade.positive ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}

                    {trade.pnl}

                  </div>

                </td>

                <td className="px-4 py-4 text-center">

                  <button className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600">

                    <div className="flex items-center gap-2">

                      <X size={16} />

                      Close

                    </div>

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="grid grid-cols-3 border-t border-zinc-800 bg-zinc-900">

        <div className="border-r border-zinc-800 p-4">

          <p className="text-xs text-zinc-500">
            Total Margin
          </p>

          <h3 className="mt-2 text-xl font-bold">
            $7,100
          </h3>

        </div>

        <div className="border-r border-zinc-800 p-4">

          <p className="text-xs text-zinc-500">
            Unrealized P/L
          </p>

          <h3 className="mt-2 text-xl font-bold text-green-500">
            +$2,292.75
          </h3>

        </div>

        <div className="p-4">

          <p className="text-xs text-zinc-500">
            Position Value
          </p>

          <h3 className="mt-2 text-xl font-bold">
            $145,820
          </h3>

        </div>

      </div>

    </div>
  );
}