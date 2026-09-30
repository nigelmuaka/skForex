"use client";

import {
  Newspaper,
  Clock3,
  ExternalLink,
  Flame,
} from "lucide-react";

const news = [
  {
    id: 1,
    title: "Bitcoin rallies above $118K as ETF inflows hit record levels.",
    category: "Crypto",
    time: "5 min ago",
    image:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=500",
    breaking: true,
  },
  {
    id: 2,
    title: "Federal Reserve signals possible interest rate pause.",
    category: "Forex",
    time: "18 min ago",
    image:
      "https://images.unsplash.com/photo-1559526324-593bc073d938?w=500",
    breaking: false,
  },
  {
    id: 3,
    title: "Gold prices retreat after strong US Dollar recovery.",
    category: "Gold",
    time: "42 min ago",
    image:
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=500",
    breaking: false,
  },
  {
    id: 4,
    title: "Nasdaq reaches fresh all-time highs led by AI stocks.",
    category: "Stocks",
    time: "1 hour ago",
    image:
      "https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=500",
    breaking: false,
  },
  {
    id: 5,
    title: "Ethereum network activity surges after new institutional adoption.",
    category: "Crypto",
    time: "2 hours ago",
    image:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500",
    breaking: false,
  },
];

export default function MarketNews() {
  return (
    <section className="overflow-hidden rounded-xl border border-zinc-800 bg-[#1A1D24]">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-3 sm:px-4">

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10 sm:h-9 sm:w-9">

            <Newspaper className="h-4 w-4 text-yellow-500 sm:h-5 sm:w-5" />

          </div>

          <div className="min-w-0">

            <h2 className="truncate text-sm font-bold text-white sm:text-base">
              Market News
            </h2>

            <p className="hidden text-xs text-zinc-500 sm:block">
              Latest Financial Updates
            </p>

          </div>

        </div>

        <button className="shrink-0 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-yellow-400 sm:px-4 sm:py-2 sm:text-sm">
          View All
        </button>

      </div>


      {/* ================= NEWS LIST ================= */}

      <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-2 xl:grid-cols-3">

        {news.map((item) => (

          <article
            key={item.id}
            className="group flex min-w-0 cursor-pointer gap-3 rounded-lg border border-zinc-800 bg-[#15181C] p-3 transition hover:border-zinc-700 hover:bg-zinc-900"
          >

            {/* Image */}

            <img
              src={item.image}
              alt={item.title}
              className="h-20 w-24 shrink-0 rounded-lg object-cover sm:h-24 sm:w-28"
            />


            {/* Content */}

            <div className="flex min-w-0 flex-1 flex-col justify-between">

              {/* Category */}

              <div className="flex min-w-0 items-center gap-1.5">

                <span className="truncate rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-yellow-500 sm:text-xs">
                  {item.category}
                </span>

                {item.breaking && (

                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-500">

                    <Flame size={11} />

                    <span className="hidden sm:inline">
                      Breaking
                    </span>

                  </span>

                )}

              </div>


              {/* Title */}

              <h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-4 text-white sm:text-sm">
                {item.title}
              </h3>


              {/* Footer */}

              <div className="mt-2 flex items-center justify-between">

                <div className="flex items-center gap-1 text-[10px] text-zinc-500 sm:text-xs">

                  <Clock3 size={12} />

                  {item.time}

                </div>

                <ExternalLink
                  size={14}
                  className="text-zinc-600 transition group-hover:text-yellow-500"
                />

              </div>

            </div>

          </article>

        ))}

      </div>

    </section>
  );
}