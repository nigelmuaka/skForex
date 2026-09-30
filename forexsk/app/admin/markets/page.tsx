"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Check,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  Filter,
  Globe2,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";

type MarketStatus = "Active" | "Paused" | "Closed";
type MarketCategory = "Forex" | "Metals" | "Crypto" | "Indices";

interface Market {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  bid: string;
  ask: string;
  spread: string;
  change: string;
  volume: string;
  leverage: string;
  status: MarketStatus;
  tradingHours: string;
  lastUpdate: string;
}

const initialMarkets: Market[] = [
  {
    id: "MKT-001",
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    category: "Forex",
    bid: "1.16542",
    ask: "1.16558",
    spread: "1.6",
    change: "+0.24%",
    volume: "2.84B",
    leverage: "1:500",
    status: "Active",
    tradingHours: "24/5",
    lastUpdate: "Just now",
  },
  {
    id: "MKT-002",
    symbol: "GBP/USD",
    name: "British Pound / US Dollar",
    category: "Forex",
    bid: "1.34682",
    ask: "1.34702",
    spread: "2.0",
    change: "-0.18%",
    volume: "1.92B",
    leverage: "1:500",
    status: "Active",
    tradingHours: "24/5",
    lastUpdate: "Just now",
  },
  {
    id: "MKT-003",
    symbol: "USD/JPY",
    name: "US Dollar / Japanese Yen",
    category: "Forex",
    bid: "147.842",
    ask: "147.858",
    spread: "1.6",
    change: "+0.11%",
    volume: "1.67B",
    leverage: "1:500",
    status: "Active",
    tradingHours: "24/5",
    lastUpdate: "Just now",
  },
  {
    id: "MKT-004",
    symbol: "USD/CHF",
    name: "US Dollar / Swiss Franc",
    category: "Forex",
    bid: "0.80124",
    ask: "0.80140",
    spread: "1.6",
    change: "+0.06%",
    volume: "842M",
    leverage: "1:500",
    status: "Active",
    tradingHours: "24/5",
    lastUpdate: "Just now",
  },
  {
    id: "MKT-005",
    symbol: "AUD/USD",
    name: "Australian Dollar / US Dollar",
    category: "Forex",
    bid: "0.65482",
    ask: "0.65498",
    spread: "1.6",
    change: "-0.31%",
    volume: "728M",
    leverage: "1:500",
    status: "Active",
    tradingHours: "24/5",
    lastUpdate: "Just now",
  },
  {
    id: "MKT-006",
    symbol: "XAU/USD",
    name: "Gold / US Dollar",
    category: "Metals",
    bid: "3382.45",
    ask: "3382.85",
    spread: "4.0",
    change: "+0.67%",
    volume: "4.21B",
    leverage: "1:200",
    status: "Active",
    tradingHours: "23/5",
    lastUpdate: "Just now",
  },
  {
    id: "MKT-007",
    symbol: "XAG/USD",
    name: "Silver / US Dollar",
    category: "Metals",
    bid: "38.124",
    ask: "38.164",
    spread: "4.0",
    change: "+0.42%",
    volume: "684M",
    leverage: "1:100",
    status: "Active",
    tradingHours: "23/5",
    lastUpdate: "Just now",
  },
  {
    id: "MKT-008",
    symbol: "BTC/USD",
    name: "Bitcoin / US Dollar",
    category: "Crypto",
    bid: "116420.00",
    ask: "116455.00",
    spread: "35.0",
    change: "+1.84%",
    volume: "8.74B",
    leverage: "1:100",
    status: "Active",
    tradingHours: "24/7",
    lastUpdate: "Just now",
  },
  {
    id: "MKT-009",
    symbol: "ETH/USD",
    name: "Ethereum / US Dollar",
    category: "Crypto",
    bid: "4218.20",
    ask: "4220.90",
    spread: "27.0",
    change: "+1.21%",
    volume: "3.15B",
    leverage: "1:100",
    status: "Active",
    tradingHours: "24/7",
    lastUpdate: "Just now",
  },
  {
    id: "MKT-010",
    symbol: "NAS100",
    name: "Nasdaq 100 Index",
    category: "Indices",
    bid: "23842.5",
    ask: "23845.5",
    spread: "3.0",
    change: "+0.48%",
    volume: "1.18B",
    leverage: "1:200",
    status: "Paused",
    tradingHours: "23/5",
    lastUpdate: "4 min ago",
  },
  {
    id: "MKT-011",
    symbol: "SPX500",
    name: "S&P 500 Index",
    category: "Indices",
    bid: "6452.20",
    ask: "6453.80",
    spread: "1.6",
    change: "+0.31%",
    volume: "932M",
    leverage: "1:200",
    status: "Active",
    tradingHours: "23/5",
    lastUpdate: "Just now",
  },
  {
    id: "MKT-012",
    symbol: "GER40",
    name: "Germany 40 Index",
    category: "Indices",
    bid: "24218.0",
    ask: "24223.0",
    spread: "5.0",
    change: "-0.12%",
    volume: "514M",
    leverage: "1:200",
    status: "Closed",
    tradingHours: "23/5",
    lastUpdate: "18 min ago",
  },
];

export default function AdminMarketsPage() {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState<
    "All" | MarketCategory
  >("All");

  const [statusFilter, setStatusFilter] = useState<
    "All" | MarketStatus
  >("All");

  const [showFilters, setShowFilters] = useState(false);

  const [selectedMarket, setSelectedMarket] =
    useState<Market | null>(null);

  const [editingMarket, setEditingMarket] =
    useState<Market | null>(null);

  const [showAddMarket, setShowAddMarket] = useState(false);

  const filteredMarkets = useMemo(() => {
    const query = search.toLowerCase().trim();

    return markets.filter((market) => {
      const matchesSearch =
        !query ||
        market.symbol.toLowerCase().includes(query) ||
        market.name.toLowerCase().includes(query) ||
        market.category.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        market.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        market.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    markets,
    search,
    categoryFilter,
    statusFilter,
  ]);

  const activeMarkets = markets.filter(
    (market) => market.status === "Active"
  );

  const pausedMarkets = markets.filter(
    (market) => market.status === "Paused"
  );

  const closedMarkets = markets.filter(
    (market) => market.status === "Closed"
  );

  const forexMarkets = markets.filter(
    (market) => market.category === "Forex"
  );

  const toggleMarketStatus = (marketId: string) => {
    setMarkets((current) =>
      current.map((market) => {
        if (market.id !== marketId) return market;

        return {
          ...market,
          status:
            market.status === "Active"
              ? "Paused"
              : "Active",
          lastUpdate: "Just now",
        };
      })
    );
  };

  const saveMarket = (updatedMarket: Market) => {
    setMarkets((current) =>
      current.map((market) =>
        market.id === updatedMarket.id
          ? updatedMarket
          : market
      )
    );

    setEditingMarket(null);
  };

  const addMarket = (newMarket: Market) => {
    setMarkets((current) => [
      newMarket,
      ...current,
    ]);

    setShowAddMarket(false);
  };

  return (
    <div className="space-y-6">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
            <Globe2 className="h-5 w-5 text-cyan-400" />
          </div>

          <div>

            <h1 className="text-xl font-bold tracking-tight text-white">
              Markets
            </h1>

            <p className="mt-1 text-[10px] text-gray-600">
              Manage trading symbols, pricing and market availability
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-[10px] font-semibold text-gray-500 transition hover:bg-white/[0.05] hover:text-gray-300"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Prices
          </button>

          <button
            type="button"
            onClick={() => setShowAddMarket(true)}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-3.5 py-2.5 text-[10px] font-bold text-black transition hover:bg-cyan-400"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Market
          </button>

        </div>

      </div>

      {/* =========================================================
          STAT CARDS
      ========================================================= */}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">

        <MarketStat
          title="Total Markets"
          value={markets.length.toString()}
          subtitle="Available symbols"
          icon={Globe2}
          iconClass="text-cyan-400"
        />

        <MarketStat
          title="Active"
          value={activeMarkets.length.toString()}
          subtitle="Currently tradable"
          icon={Activity}
          iconClass="text-emerald-400"
        />

        <MarketStat
          title="Paused"
          value={pausedMarkets.length.toString()}
          subtitle="Temporarily disabled"
          icon={Pause}
          iconClass="text-amber-400"
        />

        <MarketStat
          title="Forex Pairs"
          value={forexMarkets.length.toString()}
          subtitle="Currency markets"
          icon={BarChart3}
          iconClass="text-purple-400"
        />

      </div>

      {/* =========================================================
          MARKET STATUS BAR
      ========================================================= */}

      <div className="grid gap-3 md:grid-cols-3">

        <MarketStatusCard
          title="Markets Online"
          value={`${activeMarkets.length} markets`}
          text="Accepting new trading orders"
          icon={Check}
          className="text-emerald-400"
        />

        <MarketStatusCard
          title="Temporarily Paused"
          value={`${pausedMarkets.length} market`}
          text="Trading is currently disabled"
          icon={Pause}
          className="text-amber-400"
        />

        <MarketStatusCard
          title="Market Closed"
          value={`${closedMarkets.length} market`}
          text="Outside configured trading hours"
          icon={Clock3}
          className="text-gray-500"
        />

      </div>

      {/* =========================================================
          MARKET TABLE
      ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d121b]">

        {/* Toolbar */}

        <div className="flex flex-col gap-3 border-b border-white/[0.05] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-xs font-semibold text-gray-300">
              Market Instruments
            </h2>

            <p className="mt-1 text-[9px] text-gray-700">
              {filteredMarkets.length} of {markets.length} markets displayed
            </p>

          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            <div className="relative">

              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-700" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search markets..."
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] pl-9 pr-3 text-[10px] text-gray-300 outline-none placeholder:text-gray-700 transition focus:border-cyan-500/30 sm:w-60"
              />

            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className={`flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-[10px] font-semibold transition ${
                showFilters ||
                categoryFilter !== "All" ||
                statusFilter !== "All"
                  ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                  : "border-white/[0.06] bg-white/[0.02] text-gray-600 hover:text-gray-300"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>

          </div>

        </div>

        {/* Filters */}

        {showFilters && (
          <div className="space-y-4 border-b border-white/[0.05] bg-white/[0.01] px-4 py-4 sm:px-5">

            <div>

              <p className="mb-2 text-[8px] font-bold uppercase tracking-wider text-gray-700">
                Category
              </p>

              <div className="flex flex-wrap gap-2">

                {(
                  [
                    "All",
                    "Forex",
                    "Metals",
                    "Crypto",
                    "Indices",
                  ] as const
                ).map((category) => (

                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setCategoryFilter(category)
                    }
                    className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${
                      categoryFilter === category
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "bg-white/[0.025] text-gray-600 hover:text-gray-300"
                    }`}
                  >
                    {category}
                  </button>

                ))}

              </div>

            </div>

            <div>

              <p className="mb-2 text-[8px] font-bold uppercase tracking-wider text-gray-700">
                Status
              </p>

              <div className="flex flex-wrap gap-2">

                {(
                  [
                    "All",
                    "Active",
                    "Paused",
                    "Closed",
                  ] as const
                ).map((status) => (

                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setStatusFilter(status)
                    }
                    className={`rounded-lg px-3 py-2 text-[9px] font-semibold transition ${
                      statusFilter === status
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "bg-white/[0.025] text-gray-600 hover:text-gray-300"
                    }`}
                  >
                    {status}
                  </button>

                ))}

              </div>

            </div>

          </div>
        )}

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1250px]">

            <thead>

              <tr className="border-b border-white/[0.04] bg-white/[0.015]">

                <TableHead label="Market" />
                <TableHead label="Category" />
                <TableHead label="Bid" />
                <TableHead label="Ask" />
                <TableHead label="Spread" />
                <TableHead label="24h Change" />
                <TableHead label="Volume" />
                <TableHead label="Leverage" />
                <TableHead label="Hours" />
                <TableHead label="Status" />
                <TableHead label="Actions" />

              </tr>

            </thead>

            <tbody className="divide-y divide-white/[0.04]">

              {filteredMarkets.length > 0 ? (

                filteredMarkets.map((market) => (

                  <tr
                    key={market.id}
                    className="transition hover:bg-white/[0.015]"
                  >

                    {/* Market */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
                          <BarChart3 className="h-4 w-4 text-cyan-400" />
                        </div>

                        <div>

                          <p className="text-[10px] font-bold text-gray-300">
                            {market.symbol}
                          </p>

                          <p className="mt-1 text-[8px] text-gray-700">
                            {market.name}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Category */}

                    <td className="px-4 py-4">

                      <CategoryBadge
                        category={market.category}
                      />

                    </td>

                    {/* Bid */}

                    <td className="px-4 py-4">

                      <span className="font-mono text-[10px] font-semibold text-gray-400">
                        {market.bid}
                      </span>

                    </td>

                    {/* Ask */}

                    <td className="px-4 py-4">

                      <span className="font-mono text-[10px] font-semibold text-gray-400">
                        {market.ask}
                      </span>

                    </td>

                    {/* Spread */}

                    <td className="px-4 py-4">

                      <span className="text-[9px] text-gray-500">
                        {market.spread} pips
                      </span>

                    </td>

                    {/* Change */}

                    <td className="px-4 py-4">

                      <ChangeValue
                        value={market.change}
                      />

                    </td>

                    {/* Volume */}

                    <td className="px-4 py-4">

                      <span className="text-[9px] font-semibold text-gray-500">
                        ${market.volume}
                      </span>

                    </td>

                    {/* Leverage */}

                    <td className="px-4 py-4">

                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.025] px-2 py-1.5 text-[8px] font-semibold text-gray-500">
                        <ShieldCheck className="h-3 w-3 text-gray-700" />
                        {market.leverage}
                      </span>

                    </td>

                    {/* Hours */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-1.5">

                        <Clock3 className="h-3 w-3 text-gray-700" />

                        <span className="text-[9px] text-gray-600">
                          {market.tradingHours}
                        </span>

                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-4 py-4">

                      <MarketStatusBadge
                        status={market.status}
                      />

                    </td>

                    {/* Actions */}

                    <td className="px-4 py-4">

                      <div className="flex items-center gap-1.5">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedMarket(market)
                          }
                          title="View market"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] text-gray-600 transition hover:bg-white/[0.06] hover:text-gray-300"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setEditingMarket(market)
                          }
                          title="Edit market"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] text-gray-600 transition hover:bg-white/[0.06] hover:text-gray-300"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleMarketStatus(market.id)
                          }
                          title={
                            market.status === "Active"
                              ? "Pause market"
                              : "Activate market"
                          }
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                            market.status === "Active"
                              ? "bg-amber-500/5 text-amber-500/70 hover:bg-amber-500/10 hover:text-amber-400"
                              : "bg-emerald-500/5 text-emerald-500/70 hover:bg-emerald-500/10 hover:text-emerald-400"
                          }`}
                        >
                          {market.status === "Active" ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          title="More options"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-700 transition hover:bg-white/[0.04] hover:text-gray-400"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={11}
                    className="px-6 py-16 text-center"
                  >

                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03]">
                      <Search className="h-4 w-4 text-gray-700" />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-gray-500">
                      No markets found
                    </p>

                    <p className="mt-1 text-[9px] text-gray-700">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* Footer */}

        <div className="flex flex-col gap-3 border-t border-white/[0.05] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

          <p className="text-[9px] text-gray-700">
            Last price synchronization:{" "}
            <span className="text-gray-500">
              Just now
            </span>
          </p>

          <div className="flex items-center gap-2">

            <span className="flex items-center gap-1.5 text-[8px] text-gray-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Price feed connected
            </span>

          </div>

        </div>

      </div>

      {/* =========================================================
          MARKET MANAGEMENT INFO
      ========================================================= */}

      <div className="grid gap-3 md:grid-cols-3">

        <InfoCard
          icon={Settings2}
          title="Market Configuration"
          text="Configure leverage, spreads, trading hours and availability for each instrument."
        />

        <InfoCard
          icon={ShieldCheck}
          title="Risk Controls"
          text="Market settings should be validated before they affect live customer trading accounts."
        />

        <InfoCard
          icon={Activity}
          title="Live Price Feed"
          text="The displayed prices are currently sample values. Connect your Node.js market-data service for live prices."
        />

      </div>

      {/* =========================================================
          VIEW MODAL
      ========================================================= */}

      {selectedMarket && (
        <MarketViewModal
          market={selectedMarket}
          onClose={() => setSelectedMarket(null)}
          onEdit={() => {
            setSelectedMarket(null);
            setEditingMarket(selectedMarket);
          }}
        />
      )}

      {/* =========================================================
          EDIT MODAL
      ========================================================= */}

      {editingMarket && (
        <MarketEditModal
          market={editingMarket}
          onClose={() => setEditingMarket(null)}
          onSave={saveMarket}
        />
      )}

      {/* =========================================================
          ADD MARKET MODAL
      ========================================================= */}

      {showAddMarket && (
        <AddMarketModal
          onClose={() => setShowAddMarket(false)}
          onSave={addMarket}
        />
      )}

    </div>
  );
}

/* ========================================================================
   MARKET STAT
========================================================================= */

function MarketStat({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4 sm:p-5">

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
        <Icon className={`h-4 w-4 ${iconClass}`} />
      </div>

      <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-600">
        {title}
      </p>

      <p className="mt-1 text-lg font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-[8px] text-gray-700">
        {subtitle}
      </p>

    </div>
  );
}

/* ========================================================================
   MARKET STATUS CARD
========================================================================= */

function MarketStatusCard({
  title,
  value,
  text,
  icon: Icon,
  className,
}: {
  title: string;
  value: string;
  text: string;
  icon: React.ElementType;
  className: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
          <Icon className={`h-3.5 w-3.5 ${className}`} />
        </div>

        <div>

          <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-700">
            {title}
          </p>

          <p className="mt-1 text-[10px] font-bold text-gray-400">
            {value}
          </p>

        </div>

      </div>

      <p className="mt-3 text-[9px] text-gray-700">
        {text}
      </p>

    </div>
  );
}

/* ========================================================================
   CATEGORY BADGE
========================================================================= */

function CategoryBadge({
  category,
}: {
  category: MarketCategory;
}) {
  const classes: Record<MarketCategory, string> = {
    Forex: "bg-blue-500/10 text-blue-400",
    Metals: "bg-amber-500/10 text-amber-400",
    Crypto: "bg-purple-500/10 text-purple-400",
    Indices: "bg-cyan-500/10 text-cyan-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1.5 text-[8px] font-semibold ${classes[category]}`}
    >
      {category}
    </span>
  );
}

/* ========================================================================
   STATUS BADGE
========================================================================= */

function MarketStatusBadge({
  status,
}: {
  status: MarketStatus;
}) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Active
      </span>
    );
  }

  if (status === "Paused") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-amber-400">
        <Pause className="h-3 w-3" />
        Paused
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-gray-500">
      <XCircle className="h-3 w-3" />
      Closed
    </span>
  );
}

/* ========================================================================
   CHANGE VALUE
========================================================================= */

function ChangeValue({
  value,
}: {
  value: string;
}) {
  const positive = value.startsWith("+");

  return (
    <span
      className={`inline-flex items-center gap-1 text-[9px] font-bold ${
        positive
          ? "text-emerald-400"
          : "text-red-400"
      }`}
    >
      {positive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}

      {value}
    </span>
  );
}

/* ========================================================================
   TABLE HEAD
========================================================================= */

function TableHead({
  label,
}: {
  label: string;
}) {
  return (
    <th className="px-4 py-3 text-left text-[8px] font-bold uppercase tracking-wider text-gray-700">
      {label}
    </th>
  );
}

/* ========================================================================
   INFO CARD
========================================================================= */

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0d121b] p-4">

      <div className="flex items-center gap-2.5">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.035]">
          <Icon className="h-3.5 w-3.5 text-gray-500" />
        </div>

        <p className="text-[10px] font-semibold text-gray-400">
          {title}
        </p>

      </div>

      <p className="mt-3 text-[9px] leading-4 text-gray-700">
        {text}
      </p>

    </div>
  );
}

/* ========================================================================
   VIEW MARKET MODAL
========================================================================= */

function MarketViewModal({
  market,
  onClose,
  onEdit,
}: {
  market: Market;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <ModalShell onClose={onClose}>

      <div className="flex items-center justify-between border-b border-white/[0.05] p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
            <BarChart3 className="h-4 w-4 text-cyan-400" />
          </div>

          <div>

            <h2 className="text-xs font-bold text-white">
              {market.symbol}
            </h2>

            <p className="mt-1 text-[8px] text-gray-700">
              {market.name}
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white/[0.04] hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>

      </div>

      <div className="space-y-5 p-5">

        <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-5">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-[8px] uppercase tracking-[0.15em] text-gray-700">
                Current Bid
              </p>

              <p className="mt-1 font-mono text-2xl font-bold text-white">
                {market.bid}
              </p>

            </div>

            <div className="sm:text-right">

              <p className="text-[8px] uppercase tracking-[0.15em] text-gray-700">
                Current Ask
              </p>

              <p className="mt-1 font-mono text-2xl font-bold text-cyan-400">
                {market.ask}
              </p>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

          <DetailBox
            label="Spread"
            value={`${market.spread} pips`}
          />

          <DetailBox
            label="Leverage"
            value={market.leverage}
          />

          <DetailBox
            label="24h Change"
            value={market.change}
          />

          <DetailBox
            label="Volume"
            value={`$${market.volume}`}
          />

          <DetailBox
            label="Trading Hours"
            value={market.tradingHours}
          />

          <DetailBox
            label="Status"
            value={market.status}
          />

        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] pt-5">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/[0.06] px-4 py-2.5 text-[9px] font-semibold text-gray-600 hover:text-gray-300"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-[9px] font-bold text-black hover:bg-cyan-400"
          >
            <Edit3 className="h-3 w-3" />
            Edit Market
          </button>

        </div>

      </div>

    </ModalShell>
  );
}

/* ========================================================================
   EDIT MARKET MODAL
========================================================================= */

function MarketEditModal({
  market,
  onClose,
  onSave,
}: {
  market: Market;
  onClose: () => void;
  onSave: (market: Market) => void;
}) {
  const [form, setForm] = useState(market);

  const update = (
    key: keyof Market,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <ModalShell onClose={onClose}>

      <div className="flex items-center justify-between border-b border-white/[0.05] p-5">

        <div>

          <h2 className="text-xs font-bold text-white">
            Edit Market
          </h2>

          <p className="mt-1 text-[8px] text-gray-700">
            Configure {market.symbol}
          </p>

        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white/[0.04] hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>

      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">

        <FormField
          label="Symbol"
          value={form.symbol}
          onChange={(value) =>
            update("symbol", value)
          }
        />

        <FormField
          label="Market Name"
          value={form.name}
          onChange={(value) =>
            update("name", value)
          }
        />

        <SelectField
          label="Category"
          value={form.category}
          options={[
            "Forex",
            "Metals",
            "Crypto",
            "Indices",
          ]}
          onChange={(value) =>
            update("category", value)
          }
        />

        <SelectField
          label="Status"
          value={form.status}
          options={[
            "Active",
            "Paused",
            "Closed",
          ]}
          onChange={(value) =>
            update("status", value)
          }
        />

        <FormField
          label="Spread"
          value={form.spread}
          onChange={(value) =>
            update("spread", value)
          }
        />

        <FormField
          label="Leverage"
          value={form.leverage}
          onChange={(value) =>
            update("leverage", value)
          }
        />

        <FormField
          label="Trading Hours"
          value={form.tradingHours}
          onChange={(value) =>
            update("tradingHours", value)
          }
        />

        <FormField
          label="Volume"
          value={form.volume}
          onChange={(value) =>
            update("volume", value)
          }
        />

        <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] pt-5 sm:col-span-2">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/[0.06] px-4 py-2.5 text-[9px] font-semibold text-gray-600 hover:text-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSave(form)}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-[9px] font-bold text-black hover:bg-cyan-400"
          >
            <Check className="h-3 w-3" />
            Save Changes
          </button>

        </div>

      </div>

    </ModalShell>
  );
}

/* ========================================================================
   ADD MARKET MODAL
========================================================================= */

function AddMarketModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (market: Market) => void;
}) {
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] =
    useState<MarketCategory>("Forex");

  const [leverage, setLeverage] =
    useState("1:500");

  const [spread, setSpread] =
    useState("1.6");

  const [tradingHours, setTradingHours] =
    useState("24/5");

  const handleSubmit = () => {
    if (!symbol.trim() || !name.trim()) return;

    const newMarket: Market = {
      id: `MKT-${String(
        Math.floor(Math.random() * 900) + 100
      )}`,
      symbol: symbol.toUpperCase(),
      name,
      category,
      bid: "0.00000",
      ask: "0.00000",
      spread,
      change: "0.00%",
      volume: "0",
      leverage,
      status: "Active",
      tradingHours,
      lastUpdate: "Just now",
    };

    onSave(newMarket);
  };

  return (
    <ModalShell onClose={onClose}>

      <div className="flex items-center justify-between border-b border-white/[0.05] p-5">

        <div>

          <h2 className="text-xs font-bold text-white">
            Add New Market
          </h2>

          <p className="mt-1 text-[8px] text-gray-700">
            Add a new trading instrument
          </p>

        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-white/[0.04] hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>

      </div>

      <div className="space-y-4 p-5">

        <FormField
          label="Symbol"
          value={symbol}
          placeholder="e.g. EUR/USD"
          onChange={setSymbol}
        />

        <FormField
          label="Market Name"
          value={name}
          placeholder="e.g. Euro / US Dollar"
          onChange={setName}
        />

        <div className="grid gap-4 sm:grid-cols-2">

          <SelectField
            label="Category"
            value={category}
            options={[
              "Forex",
              "Metals",
              "Crypto",
              "Indices",
            ]}
            onChange={(value) =>
              setCategory(
                value as MarketCategory
              )
            }
          />

          <FormField
            label="Leverage"
            value={leverage}
            onChange={setLeverage}
          />

          <FormField
            label="Spread"
            value={spread}
            onChange={setSpread}
          />

          <FormField
            label="Trading Hours"
            value={tradingHours}
            onChange={setTradingHours}
          />

        </div>

        <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.025] p-3">

          <div className="flex items-start gap-2.5">

            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />

            <p className="text-[8px] leading-4 text-gray-600">
              New markets require a live price-feed configuration
              before customers can safely trade them.
            </p>

          </div>

        </div>

        <div className="flex items-center justify-end gap-2 border-t border-white/[0.05] pt-5">

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/[0.06] px-4 py-2.5 text-[9px] font-semibold text-gray-600 hover:text-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!symbol.trim() || !name.trim()}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-[9px] font-bold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-3 w-3" />
            Add Market
          </button>

        </div>

      </div>

    </ModalShell>
  );
}

/* ========================================================================
   MODAL SHELL
========================================================================= */

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d121b] shadow-2xl">
        {children}
      </div>

    </div>
  );
}

/* ========================================================================
   DETAIL BOX
========================================================================= */

function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-3">

      <p className="text-[8px] uppercase tracking-wider text-gray-700">
        {label}
      </p>

      <p className="mt-2 text-[10px] font-semibold text-gray-400">
        {value}
      </p>

    </div>
  );
}

/* ========================================================================
   FORM FIELD
========================================================================= */

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-[8px] font-bold uppercase tracking-wider text-gray-700">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-10 w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-[10px] text-gray-300 outline-none placeholder:text-gray-700 transition focus:border-cyan-500/30"
      />

    </div>
  );
}

/* ========================================================================
   SELECT FIELD
========================================================================= */

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-[8px] font-bold uppercase tracking-wider text-gray-700">
        {label}
      </label>

      <div className="relative">

        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-10 w-full appearance-none rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 pr-9 text-[10px] text-gray-300 outline-none transition focus:border-cyan-500/30"
        >

          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#0d121b]"
            >
              {option}
            </option>
          ))}

        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-700" />

      </div>

    </div>
  );
}