"use client";

import { Search, Star, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

const assets = [
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    price: "118,648.20",
    change: "+2.45%",
    positive: true,
  },
  {
    symbol: "ETH/USDT",
    name: "Ethereum",
    price: "4,625.45",
    change: "+1.78%",
    positive: true,
  },
  {
    symbol: "SOL/USDT",
    name: "Solana",
    price: "201.52",
    change: "-0.62%",
    positive: false,
  },
  {
    symbol: "BNB/USDT",
    name: "BNB",
    price: "812.42",
    change: "+0.95%",
    positive: true,
  },
  {
    symbol: "XRP/USDT",
    name: "Ripple",
    price: "0.8452",
    change: "-1.21%",
    positive: false,
  },
  {
    symbol: "DOGE/USDT",
    name: "Dogecoin",
    price: "0.2835",
    change: "+4.56%",
    positive: true,
  },
  {
    symbol: "EUR/USD",
    name: "Euro",
    price: "1.1756",
    change: "+0.12%",
    positive: true,
  },
  {
    symbol: "XAU/USD",
    name: "Gold",
    price: "3358.42",
    change: "-0.21%",
    positive: false,
  },
];

export default function WatchList() {
  const [search, setSearch] = useState("");

  const filtered = assets.filter(
    (item) =>
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#1A1D24] overflow-hidden">

      {/* Header */}

      <div className="border-b border-zinc-800 px-5 py-4">

        <h2 className="text-lg font-bold text-white">
          Watchlist
        </h2>

        <p className="text-xs text-zinc-500">
          Favorite Markets
        </p>

      </div>

      {/* Search */}

      <div className="p-4">

        <div className="relative">

          <Search
            className="absolute left-3 top-3 text-zinc-500"
            size={18}
          />

          <input
            placeholder="Search Asset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-3 pl-10 pr-4 outline-none focus:border-yellow-500"
          />

        </div>

      </div>

      {/* Markets */}

      <div className="max-h-[520px] overflow-y-auto">

        {filtered.map((item) => (

          <div
            key={item.symbol}
            className="flex items-center justify-between border-b border-zinc-800 px-5 py-4 transition hover:bg-zinc-900 cursor-pointer"
          >

            <div className="flex items-center gap-3">

              <button>

                <Star
                  size={16}
                  className="text-yellow-500 fill-yellow-500"
                />

              </button>

              <div>

                <h3 className="font-semibold text-white">
                  {item.symbol}
                </h3>

                <p className="text-xs text-zinc-500">
                  {item.name}
                </p>

              </div>

            </div>

            <div className="text-right">

              <div className="font-bold text-white">

                {item.price}

              </div>

              <div
                className={`mt-1 flex items-center justify-end gap-1 text-xs ${
                  item.positive
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {item.positive ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}

                {item.change}
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="border-t border-zinc-800 bg-zinc-900 px-5 py-4">

        <button className="w-full rounded-xl bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-400">

          View All Markets

        </button>

      </div>

    </div>
  );
}