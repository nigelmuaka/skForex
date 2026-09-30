"use client";

import {
  DollarSign,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";

export default function FooterStats() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">

      <div className="rounded-2xl border border-zinc-800 bg-[#1A1D24] p-5">
        <p className="text-zinc-400 text-sm">
          Daily Volume
        </p>

        <h2 className="mt-3 text-3xl font-bold text-white">
          $2.84B
        </h2>

        <div className="mt-2 flex items-center gap-2 text-green-500">
          <TrendingUp size={16}/>
          +12.6%
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-[#1A1D24] p-5">
        <p className="text-zinc-400 text-sm">
          Active Traders
        </p>

        <h2 className="mt-3 flex items-center gap-2 text-3xl font-bold">
          <Users className="text-yellow-500"/>
          25,481
        </h2>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-[#1A1D24] p-5">
        <p className="text-zinc-400 text-sm">
          Total Liquidity
        </p>

        <h2 className="mt-3 flex items-center gap-2 text-3xl font-bold">
          <DollarSign className="text-green-500"/>
          $9.65B
        </h2>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-[#1A1D24] p-5">
        <p className="text-zinc-400 text-sm">
          Market Status
        </p>

        <h2 className="mt-3 flex items-center gap-2 text-3xl font-bold text-green-500">
          <Activity/>
          OPEN
        </h2>
      </div>

    </div>
  );
}