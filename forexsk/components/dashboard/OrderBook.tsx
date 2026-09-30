"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const sellOrders = [
  { price: "118,680.20", amount: "0.231", total: "27,424" },
  { price: "118,675.50", amount: "0.852", total: "101,130" },
  { price: "118,670.00", amount: "0.612", total: "72,646" },
  { price: "118,665.45", amount: "1.245", total: "147,770" },
  { price: "118,660.30", amount: "0.455", total: "53,995" },
  { price: "118,655.00", amount: "0.775", total: "91,982" },
  { price: "118,650.25", amount: "1.010", total: "119,837" },
];

const buyOrders = [
  { price: "118,645.00", amount: "0.452", total: "53,618" },
  { price: "118,640.50", amount: "0.840", total: "99,658" },
  { price: "118,635.20", amount: "1.350", total: "160,157" },
  { price: "118,630.10", amount: "0.742", total: "88,024" },
  { price: "118,625.00", amount: "0.621", total: "73,656" },
  { price: "118,620.45", amount: "0.990", total: "117,434" },
  { price: "118,615.20", amount: "1.420", total: "168,433" },
];

export default function OrderBook() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#1A1D24] overflow-hidden">

      {/* Header */}

      <div className="border-b border-zinc-800 px-5 py-4 flex items-center justify-between">

        <div>

          <h2 className="font-bold text-lg text-white">
            Order Book
          </h2>

          <p className="text-xs text-zinc-500">
            BTC / USDT
          </p>

        </div>

        <div className="text-green-500 font-bold">
          LIVE
        </div>

      </div>

      {/* Table Header */}

      <div className="grid grid-cols-3 border-b border-zinc-800 bg-zinc-900 px-4 py-3 text-xs uppercase text-zinc-500">

        <div>Price</div>

        <div className="text-center">
          Amount
        </div>

        <div className="text-right">
          Total
        </div>

      </div>

      {/* SELL */}

      <div>

        {sellOrders.map((item, index) => (

          <div
            key={index}
            className="grid grid-cols-3 items-center px-4 py-2 hover:bg-red-500/5 transition"
          >

            <div className="flex items-center gap-2 text-red-500 font-medium">

              <ArrowDownRight size={14} />

              {item.price}

            </div>

            <div className="text-center text-zinc-300">

              {item.amount}

            </div>

            <div className="text-right text-zinc-500">

              {item.total}

            </div>

          </div>

        ))}

      </div>

      {/* Current Price */}

      <div className="border-y border-zinc-700 bg-zinc-900 py-4 text-center">

        <div className="text-3xl font-bold text-green-500">

          118,648.80

        </div>

        <div className="text-sm text-zinc-500">

          Last Traded Price

        </div>

      </div>

      {/* BUY */}

      <div>

        {buyOrders.map((item, index) => (

          <div
            key={index}
            className="grid grid-cols-3 items-center px-4 py-2 hover:bg-green-500/5 transition"
          >

            <div className="flex items-center gap-2 text-green-500 font-medium">

              <ArrowUpRight size={14} />

              {item.price}

            </div>

            <div className="text-center text-zinc-300">

              {item.amount}

            </div>

            <div className="text-right text-zinc-500">

              {item.total}

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="border-t border-zinc-800 bg-zinc-900 p-4">

        <div className="grid grid-cols-2 gap-4">

          <div className="rounded-xl bg-green-500/10 p-4">

            <div className="text-xs text-zinc-400">

              Total Buy Volume

            </div>

            <div className="mt-2 text-xl font-bold text-green-500">

              6.415 BTC

            </div>

          </div>

          <div className="rounded-xl bg-red-500/10 p-4">

            <div className="text-xs text-zinc-400">

              Total Sell Volume

            </div>

            <div className="mt-2 text-xl font-bold text-red-500">

              5.180 BTC

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}