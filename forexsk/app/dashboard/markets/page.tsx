"use client";

import { useMemo, useState } from "react";

import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Bitcoin,
  DollarSign,
  Gem,
  Globe2,
  LineChart,
  RefreshCw,
  ChevronRight,
  Activity,
} from "lucide-react";

type Category =
  | "All"
  | "Favorites"
  | "Crypto"
  | "Forex"
  | "Commodities"
  | "Indices"
  | "Stocks";

type Market = {
  symbol: string;
  name: string;
  category: Exclude<Category, "All" | "Favorites">;
  price: string;
  change: string;
  changeValue: number;
  volume: string;
  high: string;
  low: string;
  icon: string;
  favorite: boolean;
};

const markets: Market[] = [
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    category: "Crypto",
    price: "$118,245.60",
    change: "+2.84%",
    changeValue: 2.84,
    volume: "$42.8B",
    high: "$119,840.20",
    low: "$114,620.40",
    icon: "₿",
    favorite: true,
  },
  {
    symbol: "ETH/USDT",
    name: "Ethereum",
    category: "Crypto",
    price: "$3,842.18",
    change: "+1.92%",
    changeValue: 1.92,
    volume: "$18.4B",
    high: "$3,910.40",
    low: "$3,720.10",
    icon: "Ξ",
    favorite: true,
  },
  {
    symbol: "SOL/USDT",
    name: "Solana",
    category: "Crypto",
    price: "$182.46",
    change: "+5.61%",
    changeValue: 5.61,
    volume: "$4.8B",
    high: "$188.20",
    low: "$170.80",
    icon: "S",
    favorite: false,
  },
  {
    symbol: "BNB/USDT",
    name: "BNB",
    category: "Crypto",
    price: "$684.32",
    change: "-0.74%",
    changeValue: -0.74,
    volume: "$1.9B",
    high: "$697.20",
    low: "$672.40",
    icon: "B",
    favorite: false,
  },
  {
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    category: "Forex",
    price: "1.1740",
    change: "+0.43%",
    changeValue: 0.43,
    volume: "$6.4T",
    high: "1.1782",
    low: "1.1698",
    icon: "€",
    favorite: true,
  },
  {
    symbol: "GBP/USD",
    name: "British Pound / US Dollar",
    category: "Forex",
    price: "1.3618",
    change: "-0.28%",
    changeValue: -0.28,
    volume: "$4.2T",
    high: "1.3670",
    low: "1.3562",
    icon: "£",
    favorite: false,
  },
  {
    symbol: "USD/JPY",
    name: "US Dollar / Japanese Yen",
    category: "Forex",
    price: "147.82",
    change: "+0.18%",
    changeValue: 0.18,
    volume: "$3.8T",
    high: "148.42",
    low: "146.90",
    icon: "¥",
    favorite: false,
  },
  {
    symbol: "XAU/USD",
    name: "Gold",
    category: "Commodities",
    price: "$3,356.30",
    change: "-0.18%",
    changeValue: -0.18,
    volume: "$2.1B",
    high: "$3,382.10",
    low: "$3,328.40",
    icon: "Au",
    favorite: true,
  },
  {
    symbol: "XAG/USD",
    name: "Silver",
    category: "Commodities",
    price: "$38.42",
    change: "+1.24%",
    changeValue: 1.24,
    volume: "$840M",
    high: "$38.90",
    low: "$37.60",
    icon: "Ag",
    favorite: false,
  },
  {
    symbol: "US30",
    name: "Dow Jones",
    category: "Indices",
    price: "44,860.20",
    change: "+0.64%",
    changeValue: 0.64,
    volume: "$8.2B",
    high: "45,020.80",
    low: "44,210.30",
    icon: "DJ",
    favorite: false,
  },
  {
    symbol: "NAS100",
    name: "Nasdaq 100",
    category: "Indices",
    price: "23,418.60",
    change: "+1.08%",
    changeValue: 1.08,
    volume: "$12.6B",
    high: "23,590.20",
    low: "23,020.10",
    icon: "NQ",
    favorite: true,
  },
  {
    symbol: "SPX500",
    name: "S&P 500",
    category: "Indices",
    price: "6,280.14",
    change: "+0.38%",
    changeValue: 0.38,
    volume: "$9.8B",
    high: "6,310.20",
    low: "6,224.80",
    icon: "SP",
    favorite: false,
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    category: "Stocks",
    price: "$212.44",
    change: "+1.62%",
    changeValue: 1.62,
    volume: "$3.2B",
    high: "$214.80",
    low: "$208.40",
    icon: "A",
    favorite: false,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    category: "Stocks",
    price: "$178.24",
    change: "+3.46%",
    changeValue: 3.46,
    volume: "$7.1B",
    high: "$181.60",
    low: "$171.80",
    icon: "N",
    favorite: true,
  },
];

const categories: {
  name: Category;
  icon: React.ElementType;
}[] = [
  { name: "All", icon: Globe2 },
  { name: "Favorites", icon: Star },
  { name: "Crypto", icon: Bitcoin },
  { name: "Forex", icon: DollarSign },
  { name: "Commodities", icon: Gem },
  { name: "Indices", icon: BarChart3 },
  { name: "Stocks", icon: LineChart },
];

export default function MarketsPage() {
  const [activeCategory, setActiveCategory] =
    useState<Category>("All");

  const [search, setSearch] = useState("");

  const [favorites, setFavorites] = useState<string[]>(
    markets
      .filter((market) => market.favorite)
      .map((market) => market.symbol)
  );

  const filteredMarkets = useMemo(() => {
    return markets.filter((market) => {
      const matchesCategory =
        activeCategory === "All"
          ? true
          : activeCategory === "Favorites"
            ? favorites.includes(market.symbol)
            : market.category === activeCategory;

      const searchValue = search.toLowerCase();

      const matchesSearch =
        market.symbol.toLowerCase().includes(searchValue) ||
        market.name.toLowerCase().includes(searchValue);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search, favorites]);

  const toggleFavorite = (symbol: string) => {
    setFavorites((current) =>
      current.includes(symbol)
        ? current.filter((item) => item !== symbol)
        : [...current, symbol]
    );
  };

  const topGainers = [...markets]
    .sort((a, b) => b.changeValue - a.changeValue)
    .slice(0, 3);

  const topLosers = [...markets]
    .sort((a, b) => a.changeValue - b.changeValue)
    .slice(0, 3);

  return (
    <main className="min-h-full space-y-5 pb-8">

      {/* PAGE HEADER */}

      <section className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 sm:p-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">

                <Globe2 className="h-5 w-5 text-yellow-500" />

              </div>

              <div>

                <h1 className="text-xl font-bold text-white sm:text-2xl">
                  Markets
                </h1>

                <p className="text-xs text-zinc-500 sm:text-sm">
                  Explore global financial markets and find your next opportunity.
                </p>

              </div>

            </div>

          </div>

          <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

            <span className="text-xs font-medium text-green-400">
              Markets Live
            </span>

            <RefreshCw className="ml-1 h-3.5 w-3.5 text-zinc-500" />

          </div>

        </div>

      </section>


      {/* MARKET OVERVIEW */}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        <OverviewCard
          title="Global Market"
          value="$2.84T"
          change="+2.41%"
          positive
          icon={Globe2}
        />

        <OverviewCard
          title="Crypto Market"
          value="$3.42T"
          change="+3.18%"
          positive
          icon={Bitcoin}
        />

        <OverviewCard
          title="Forex Volume"
          value="$7.5T"
          change="+0.64%"
          positive
          icon={DollarSign}
        />

        <OverviewCard
          title="Market Activity"
          value="84.6%"
          change="High"
          positive
          icon={Activity}
        />

      </section>


      {/* GAINERS AND LOSERS */}

      <section className="grid gap-4 lg:grid-cols-2">

        <MarketHighlight
          title="Top Gainers"
          subtitle="Strongest performers today"
          icon={TrendingUp}
          positive
          markets={topGainers}
        />

        <MarketHighlight
          title="Top Losers"
          subtitle="Weakest performers today"
          icon={TrendingDown}
          positive={false}
          markets={topLosers}
        />

      </section>


      {/* MARKET TABLE */}

      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#15181C]">

        {/* TABLE HEADER */}

        <div className="border-b border-zinc-800 p-4 sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="font-bold text-white">
                Market Overview
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Browse and monitor available trading instruments.
              </p>

            </div>

            <div className="relative w-full lg:w-80">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search markets..."
                className="h-10 w-full rounded-lg border border-zinc-700 bg-[#0F1114] pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-yellow-500"
              />

            </div>

          </div>


          {/* CATEGORY FILTERS */}

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">

            {categories.map((category) => {

              const Icon = category.icon;

              const active = activeCategory === category.name;

              return (

                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    active
                      ? "bg-yellow-500 text-black"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >

                  <Icon className="h-3.5 w-3.5" />

                  {category.name}

                </button>

              );

            })}

          </div>

        </div>


        {/* MOBILE CARDS / DESKTOP TABLE */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full min-w-[850px]">

            <thead>

              <tr className="border-b border-zinc-800 text-left text-xs uppercase tracking-wider text-zinc-500">

                <th className="px-5 py-4 font-medium">
                  Market
                </th>

                <th className="px-5 py-4 font-medium">
                  Price
                </th>

                <th className="px-5 py-4 font-medium">
                  24h Change
                </th>

                <th className="px-5 py-4 font-medium">
                  Volume
                </th>

                <th className="px-5 py-4 font-medium">
                  24h High
                </th>

                <th className="px-5 py-4 font-medium">
                  24h Low
                </th>

                <th className="px-5 py-4 text-right font-medium">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredMarkets.map((market) => (

                <MarketTableRow
                  key={market.symbol}
                  market={market}
                  favorite={favorites.includes(market.symbol)}
                  toggleFavorite={toggleFavorite}
                />

              ))}

            </tbody>

          </table>

        </div>


        {/* MOBILE */}

        <div className="divide-y divide-zinc-800 md:hidden">

          {filteredMarkets.map((market) => (

            <MarketMobileCard
              key={market.symbol}
              market={market}
              favorite={favorites.includes(market.symbol)}
              toggleFavorite={toggleFavorite}
            />

          ))}

        </div>


        {filteredMarkets.length === 0 && (

          <div className="p-10 text-center">

            <Search className="mx-auto h-8 w-8 text-zinc-700" />

            <p className="mt-3 text-sm text-zinc-500">
              No markets found.
            </p>

          </div>

        )}

      </section>

    </main>
  );
}


/* ============================================================
   OVERVIEW CARD
============================================================ */

function OverviewCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
}) {
  return (

    <div className="rounded-xl border border-zinc-800 bg-[#15181C] p-3 sm:p-4">

      <div className="flex items-center justify-between">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10 sm:h-9 sm:w-9">

          <Icon className="h-4 w-4 text-yellow-500" />

        </div>

        <span
          className={`text-[10px] font-semibold sm:text-xs ${
            positive
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {change}
        </span>

      </div>

      <p className="mt-3 truncate text-[10px] text-zinc-500 sm:text-xs">
        {title}
      </p>

      <p className="mt-1 truncate text-base font-bold text-white sm:text-xl">
        {value}
      </p>

    </div>

  );
}


/* ============================================================
   MARKET HIGHLIGHT
============================================================ */

function MarketHighlight({
  title,
  subtitle,
  icon: Icon,
  positive,
  markets,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  positive: boolean;
  markets: Market[];
}) {
  return (

    <div className="rounded-2xl border border-zinc-800 bg-[#15181C] p-4 sm:p-5">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className={`rounded-lg p-2 ${
              positive
                ? "bg-green-500/10"
                : "bg-red-500/10"
            }`}
          >

            <Icon
              className={`h-5 w-5 ${
                positive
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            />

          </div>

          <div>

            <h2 className="font-semibold text-white">
              {title}
            </h2>

            <p className="text-xs text-zinc-500">
              {subtitle}
            </p>

          </div>

        </div>

        <ArrowUpRight className="h-4 w-4 text-zinc-600" />

      </div>


      <div className="mt-4 space-y-2">

        {markets.map((market) => (

          <div
            key={market.symbol}
            className="flex items-center justify-between rounded-lg bg-[#0F1114] px-3 py-3"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-yellow-500">

                {market.icon}

              </div>

              <div>

                <p className="text-sm font-semibold text-white">
                  {market.symbol}
                </p>

                <p className="text-[10px] text-zinc-500">
                  {market.name}
                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="text-sm font-semibold text-white">
                {market.price}
              </p>

              <p
                className={`text-xs font-semibold ${
                  market.changeValue >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {market.change}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}


/* ============================================================
   DESKTOP TABLE ROW
============================================================ */

function MarketTableRow({
  market,
  favorite,
  toggleFavorite,
}: {
  market: Market;
  favorite: boolean;
  toggleFavorite: (symbol: string) => void;
}) {
  return (

    <tr className="border-b border-zinc-800/70 transition hover:bg-zinc-900/50">

      <td className="px-5 py-4">

        <div className="flex items-center gap-3">

          <button
            onClick={() => toggleFavorite(market.symbol)}
            className="text-zinc-600 transition hover:text-yellow-500"
          >

            <Star
              className={`h-4 w-4 ${
                favorite
                  ? "fill-yellow-500 text-yellow-500"
                  : ""
              }`}
            />

          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-yellow-500">

            {market.icon}

          </div>

          <div>

            <p className="font-semibold text-white">
              {market.symbol}
            </p>

            <p className="text-xs text-zinc-500">
              {market.name}
            </p>

          </div>

        </div>

      </td>

      <td className="px-5 py-4 font-semibold text-white">
        {market.price}
      </td>

      <td className="px-5 py-4">

        <span
          className={`inline-flex items-center gap-1 text-sm font-semibold ${
            market.changeValue >= 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >

          {market.changeValue >= 0 ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}

          {market.change}

        </span>

      </td>

      <td className="px-5 py-4 text-sm text-zinc-400">
        {market.volume}
      </td>

      <td className="px-5 py-4 text-sm text-zinc-400">
        {market.high}
      </td>

      <td className="px-5 py-4 text-sm text-zinc-400">
        {market.low}
      </td>

      <td className="px-5 py-4 text-right">

        <a
          href={`/dashboard/trade?symbol=${encodeURIComponent(
            market.symbol
          )}`}
          className="inline-flex items-center gap-1 rounded-lg bg-yellow-500 px-3 py-2 text-xs font-semibold text-black transition hover:bg-yellow-400"
        >

          Trade

          <ChevronRight className="h-3.5 w-3.5" />

        </a>

      </td>

    </tr>

  );
}


/* ============================================================
   MOBILE MARKET CARD
============================================================ */

function MarketMobileCard({
  market,
  favorite,
  toggleFavorite,
}: {
  market: Market;
  favorite: boolean;
  toggleFavorite: (symbol: string) => void;
}) {
  return (

    <div className="p-4">

      <div className="flex items-start justify-between gap-3">

        <div className="flex items-center gap-3">

          <button
            onClick={() => toggleFavorite(market.symbol)}
            className="text-zinc-600"
          >

            <Star
              className={`h-4 w-4 ${
                favorite
                  ? "fill-yellow-500 text-yellow-500"
                  : ""
              }`}
            />

          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-xs font-bold text-yellow-500">

            {market.icon}

          </div>

          <div>

            <p className="text-sm font-semibold text-white">
              {market.symbol}
            </p>

            <p className="text-xs text-zinc-500">
              {market.name}
            </p>

          </div>

        </div>

        <div className="text-right">

          <p className="font-semibold text-white">
            {market.price}
          </p>

          <p
            className={`text-xs font-semibold ${
              market.changeValue >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {market.change}

          </p>

        </div>

      </div>


      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-[#0F1114] p-3">

        <div>

          <p className="text-[10px] text-zinc-600">
            Volume
          </p>

          <p className="mt-1 text-xs text-zinc-300">
            {market.volume}
          </p>

        </div>

        <div>

          <p className="text-[10px] text-zinc-600">
            24h High
          </p>

          <p className="mt-1 text-xs text-zinc-300">
            {market.high}
          </p>

        </div>

        <div>

          <p className="text-[10px] text-zinc-600">
            24h Low
          </p>

          <p className="mt-1 text-xs text-zinc-300">
            {market.low}
          </p>

        </div>

      </div>


      <a
        href={`/dashboard/trade?symbol=${encodeURIComponent(
          market.symbol
        )}`}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 py-2.5 text-sm font-semibold text-black hover:bg-yellow-400"
      >

        Trade {market.symbol}

        <ChevronRight className="h-4 w-4" />

      </a>

    </div>

  );
}