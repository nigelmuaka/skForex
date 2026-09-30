"use client";

import {
  Bell,
  Search,
  Wallet,
  UserCircle2,
  Globe,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-zinc-800 bg-[#111827]/95 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-6">

        {/* Left */}
        <div className="flex items-center gap-6">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500 text-black font-bold text-lg">
              P
            </div>

            <div>
              <h1 className="font-bold text-white tracking-wide">
                PIPMASTER
              </h1>

              <p className="text-xs text-zinc-500">
                Professional Trading Platform
              </p>
            </div>

          </div>

          {/* Search */}

          <div className="hidden lg:flex relative">

            <Search
              className="absolute left-3 top-3 text-zinc-500"
              size={18}
            />

            <input
              type="text"
              placeholder="Search BTC, EUR/USD, Gold..."
              className="w-96 rounded-xl border border-zinc-700 bg-zinc-900 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-yellow-500"
            />

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          {/* Market Status */}

          <div className="hidden md:flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2">

            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>

            <span className="text-green-500 text-sm font-medium">
              Market Open
            </span>

          </div>

          {/* Language */}

          <button className="rounded-lg p-2 hover:bg-zinc-800 transition">
            <Globe size={20} />
          </button>

          {/* Wallet */}

          <button className="rounded-lg p-2 hover:bg-zinc-800 transition relative">

            <Wallet
              size={20}
              className="text-yellow-500"
            />

          </button>

          {/* Notification */}

          <button className="relative rounded-lg p-2 hover:bg-zinc-800 transition">

            <Bell size={20} />

            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px]">
              3
            </span>

          </button>

          {/* User */}

          <button className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 hover:border-yellow-500 transition">

            <UserCircle2
              className="text-yellow-500"
              size={28}
            />

            <div className="hidden lg:block text-left">

              <div className="text-sm font-semibold">
                Nigel Muaka
              </div>

              <div className="text-xs text-zinc-500">
                VIP Trader
              </div>

            </div>

            <ChevronDown size={16} />

          </button>

        </div>

      </div>
    </header>
  );
}